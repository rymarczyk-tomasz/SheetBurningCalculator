import { describe, expect, it } from "vitest";
import {
    getTimeValue,
    localizeDecimals,
    resultLine,
    timeResultLine,
} from "./resultLine";

describe("resultLine", () => {
    it("domyślnie kopiuje cały tekst", () => {
        expect(resultLine("abc")).toEqual({ text: "abc", copy: "abc" });
    });

    it("kopiuje podaną wartość bez zmian (np. wymiar rury)", () => {
        expect(resultLine("Wymiary rury", "33.4x6.35").copy).toBe("33.4x6.35");
    });
});

describe("timeResultLine", () => {
    it("kopiuje czas z przecinkiem dziesiętnym", () => {
        expect(timeResultLine("Czas: 0.15 h", "0.15")).toEqual({
            text: "Czas: 0.15 h",
            copy: "0,15",
        });
        expect(timeResultLine("Czas: 0.025 h", 0.025).copy).toBe("0,025");
        expect(timeResultLine("Czas: 2 h", 2).copy).toBe("2");
    });
});

describe("getTimeValue", () => {
    it("zwraca czas z jednostką dla linii z liczbą", () => {
        expect(getTimeValue(timeResultLine("Czas: 0.15 h", "0.15"))).toEqual({
            value: "0,15",
            unit: "h",
        });
    });

    it("zwraca null dla linii innych niż czas", () => {
        expect(getTimeValue(resultLine("Rura", "33.4x6.35"))).toBeNull();
        expect(getTimeValue({ text: "Błąd" })).toBeNull();
    });
});

describe("localizeDecimals", () => {
    it("zamienia kropki dziesiętne na przecinki", () => {
        expect(localizeDecimals("Czas: 0.15 h - Mpk 416.2")).toBe(
            "Czas: 0,15 h - Mpk 416,2",
        );
        expect(localizeDecimals("Koniec zdania.")).toBe("Koniec zdania.");
    });
});
