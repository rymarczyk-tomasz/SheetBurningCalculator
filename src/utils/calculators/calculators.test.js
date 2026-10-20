import { describe, expect, it } from "vitest";
import { burningCalculator } from "./burningCalculator";
import { sawCalculator } from "./sawCalculator";
import { waterjetCalculator } from "./waterjetCalculator";
import { UserError } from "../errors";

const rectangle = { shape: "rectangle", dims: { length: "1000", width: "500" } };

describe("burningCalculator", () => {
    it("plazma do 25 mm", () => {
        // 3 m * 0.014 h/m (6–11.99 mm)
        expect(burningCalculator({ ...rectangle, thickness: "10" })).toEqual({
            text: "Czas palenia blachy: 0.04 h - Plazma",
            copy: "0,04",
        });
    });

    it("palnik gazowy powyżej 25 mm, przecinek dziesiętny", () => {
        // 3 m * 0.05 h/m (28–34.99 mm)
        expect(burningCalculator({ ...rectangle, thickness: "30,5" })).toEqual({
            text: "Czas palenia blachy: 0.15 h - Palnik gazowy",
            copy: "0,15",
        });
    });

    it("uwzględnia otwory", () => {
        const result = burningCalculator({
            ...rectangle,
            thickness: "10",
            rectHoles: [{ a: "500", b: "500", count: "2" }],
        });
        // (3 m + 4 m) * 0.014
        expect(result.copy).toBe("0,10");
    });

    it.each([
        ["", "Proszę podać prawidłową grubość"],
        ["2", "Taką blachę tniemy na wodzie."],
        ["401", "Brak możliwości palenia"],
    ])("grubość %j -> UserError", (thickness, message) => {
        expect(() => burningCalculator({ ...rectangle, thickness })).toThrow(
            message,
        );
    });
});

describe("sawCalculator", () => {
    it("zwraca czas dla pręta i rury", () => {
        expect(sawCalculator({ diameter: "100" })).toEqual([
            { text: "Na cięcie pręta potrzeba 0.34 h - Mpk 416", copy: "0,34" },
            { text: "Na cięcie rury potrzeba 0.17 h - Mpk 416", copy: "0,17" },
        ]);
    });

    it("MPK 418 od 180 mm, ułamki w obrębie przedziału", () => {
        expect(sawCalculator({ diameter: "199,5" })[0].text).toBe(
            "Na cięcie pręta potrzeba 0.58 h - Mpk 418",
        );
    });

    it("rzuca UserError poza zakresem tabeli", () => {
        expect(() => sawCalculator({ diameter: "901" })).toThrow(UserError);
        expect(() => sawCalculator({ diameter: "" })).toThrow(UserError);
    });
});

describe("waterjetCalculator", () => {
    it("liczy czas dla blachy czarnej", () => {
        // 3 m * 0.12 h/m (10–11.99 mm)
        expect(
            waterjetCalculator({
                ...rectangle,
                thickness: "10",
                waterjetType: "czarna",
            }),
        ).toEqual({ text: "Czas cięcia wodą (czarna): 0.36 h", copy: "0,36" });
    });

    it("rzuca UserError dla grubości spoza tabeli", () => {
        expect(() =>
            waterjetCalculator({
                ...rectangle,
                thickness: "150",
                waterjetType: "czarna",
            }),
        ).toThrow(UserError);
    });
});
