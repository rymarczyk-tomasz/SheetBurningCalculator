import { describe, expect, it } from "vitest";
import {
    DATA_FORMAT,
    findAlternates,
    formLabel,
    noteRefs,
    normalizeMaterial,
    parseAlternatesData,
    requestText,
    rowNoteRefs,
    splitAlternate,
} from "./materialAlternates";

// Dane testowe są zmyślone — prawdziwa karta nie może trafić do repozytorium
const data = {
    format: DATA_FORMAT,
    document: "TEST1",
    revision: "A",
    notes: { 3: "Opis notatki 3." },
    requestFooter: "Podstawa: TEST1 rev. A.",
    table1: [
        {
            spec: "X1A2A, A2, C7",
            codes: ["X1A2A", "X1A2A2", "X1A2C7"],
            form: "Bar",
            name: "Carbon Steel",
            asian: ["GBX gr. 20 (YS > 99 ksi)"],
            american: ["ASTM Z36 (Note 3♠, normalize > 9\")"],
            remarks: { american: "All Note 3♠" },
        },
        { spec: "X1A9 all gr.", codes: ["X1A9*"], exclude: ["X1A9P"], european: ["EN 1 gr. S1"] },
        { spec: "X1A9P", american: ["ASME Y1"] },
        { spec: "ASTM Z36 gr. B", european: ["EN 2 gr. S2"] },
    ],
    table2: [["S1 (old)", "NB 00001", "China", "GB Q1", "1BCD1"]],
    table3: [["Cu-Q", "NB 00002", "China", "GB T2", "1BCE2"]],
};

describe("normalizeMaterial", () => {
    it("pomija spacje, kropki i słowa gr./ty.", () => {
        expect(normalizeMaterial("ASTM Z5 gr. 70")).toBe("ASTMZ570");
        expect(normalizeMaterial("astm z5 70")).toBe("ASTMZ570");
        expect(normalizeMaterial("ASTM Z7 typ. S")).toBe("ASTMZ7S");
    });
});

describe("parseAlternatesData", () => {
    it("akceptuje plik w znanym formacie", () => {
        expect(parseAlternatesData(JSON.stringify(data)).revision).toBe("A");
    });

    it.each(["nie json", JSON.stringify({ format: "inny", table1: [] })])(
        "odrzuca %j",
        (text) => {
            expect(() => parseAlternatesData(text)).toThrow();
        },
    );
});

describe("findAlternates", () => {
    it("znajduje wiersz po każdym z wymienionych gatunków", () => {
        expect(findAlternates(data, "x1a2c7").exact.map((r) => r.spec)).toEqual([
            "X1A2A, A2, C7",
        ]);
    });

    it("'all gr.' obejmuje gatunki tej samej specyfikacji z wyjątkiem wykluczonych", () => {
        expect(findAlternates(data, "X1A9").exact).toHaveLength(1);
        expect(findAlternates(data, "X1A9C2").exact[0].spec).toBe("X1A9 all gr.");
        expect(findAlternates(data, "X1A91").exact).toHaveLength(0);
        expect(findAlternates(data, "X1A9P").exact.map((r) => r.spec)).toEqual(["X1A9P"]);
        expect(findAlternates(data, "X1A9P2").similar.map((r) => r.spec)).not.toContain(
            "X1A9 all gr.",
        );
    });

    it("dla nieznanego gatunku podpowiada wiersz bazowy", () => {
        const result = findAlternates(data, "X1A2C9");
        expect(result.exact).toHaveLength(0);
        expect(result.similar.map((r) => r.spec)).toContain("X1A2A, A2, C7");
    });

    it("rozpoznaje materiał występujący tylko jako zamiennik", () => {
        const result = findAlternates(data, "EN 1 S1");
        expect(result.exact).toHaveLength(0);
        expect(result.usedAsAlternate.map((r) => r.spec)).toEqual(["X1A9 all gr."]);
    });

    it("nie ostrzega o użyciu jako zamiennik, gdy materiał jest w kolumnie Specified", () => {
        const result = findAlternates(data, "ASTM Z36 B");
        expect(result.exact).toHaveLength(1);
        expect(result.usedAsAlternate).toHaveLength(0);
    });

    it("szuka w tabelach Alstom po materiale i numerze NB", () => {
        expect(findAlternates(data, "NB 00002").alstom[0]).toMatchObject({
            table: 3,
            alternate: "GB T2",
        });
        expect(findAlternates(data, "S1 old").alstom[0].table).toBe(2);
    });

    it("pusty tekst nie daje wyniku", () => {
        expect(findAlternates(data, "  ")).toBeNull();
    });
});

describe("splitAlternate", () => {
    it.each([
        ["GBX gr. 20 (YS > 99 ksi)", "GBX gr. 20", "YS > 99 ksi"],
        ["GBY gr. 7 (AA1) (warunek testowy)", "GBY gr. 7 (AA1)", "warunek testowy"],
        ["Bolt: ISO 1 (min 830 MPa) / Nut: ISO 2 (all Note 94♠)", "Bolt: ISO 1 (min 830 MPa) / Nut: ISO 2", "all Note 94♠"],
        ["ASTM Z36", "ASTM Z36", ""],
        ["DIN 1 St 44-3 (YS > 99 ksi), St 52-3", "DIN 1 St 44-3 (YS > 99 ksi), St 52-3", ""],
    ])("%j", (text, material, conditions) => {
        expect(splitAlternate(text)).toEqual({ material, conditions });
    });
});

describe("notatki ♠", () => {
    it("zbiera numery bez powtórzeń, rosnąco", () => {
        expect(noteRefs("CEV Note 91♠", "Note 3♠, Note 93♠ is acceptable", "Note 3♠")).toEqual([
            "3",
            "91",
            "93",
        ]);
        expect(rowNoteRefs(data.table1[0])).toEqual(["3"]);
    });
});

describe("requestText", () => {
    it("zawiera materiał, zamiennik, wymagania z uwagą kolumny i treść notatki", () => {
        const row = data.table1[0];
        const text = requestText(data, row, "american", row.american[0]);
        expect(text).toContain("Materiał wg rysunku: X1A2A, A2, C7 – Bar, Carbon Steel");
        expect(text).toContain("Proponowany zamiennik: ASTM Z36");
        expect(text).toContain('Wymagania dla zamiennika: Note 3♠, normalize > 9"; All Note 3♠');
        expect(text).toContain("Note 3♠: Opis notatki 3.");
        expect(text).toContain("Podstawa: TEST1 rev. A.");
    });

    it("tłumaczy postać, opis i warunki, zostawiając oryginał warunków", () => {
        const translated = {
            ...data,
            pl: {
                forms: { Bar: "Pręt" },
                names: { "Carbon Steel": "Stal węglowa" },
                conditions: { "YS > 99 ksi": "Re > 99 ksi" },
            },
        };
        const row = data.table1[0];
        const text = requestText(translated, row, "asian", row.asian[0]);
        expect(text).toContain("X1A2A, A2, C7 – Pręt (Bar), Stal węglowa");
        expect(text).toContain("Wymagania dla zamiennika: Re > 99 ksi");
        expect(text).toContain("(oryginał w karcie: YS > 99 ksi)");
        expect(formLabel(translated, "Plate")).toBe("Plate");
    });

    it("bez warunków informuje o braku dodatkowych wymagań", () => {
        const row = data.table1[1];
        expect(requestText(data, row, "european", row.european[0])).toContain(
            "brak dodatkowych wymagań",
        );
    });
});
