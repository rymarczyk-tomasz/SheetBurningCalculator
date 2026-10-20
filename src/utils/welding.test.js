import { describe, expect, it } from "vitest";
import { calculateWeldingTime, getWeldMultiplier, parseWeldingTable } from "./welding";
import { UserError } from "./errors";

const { types, table } = parseWeldingTable([
    ["wielkosc spoiny", "pachwina", "V/Y"],
    ["4", "0.13", "0.08"],
    ["2", "0.05", ""],
    ["3", "0.08", ""],
]);

describe("parseWeldingTable", () => {
    it("czyta rodzaje spoin i sortuje wiersze po wielkości", () => {
        expect(types).toEqual(["pachwina", "V/Y"]);
        expect(table.map((r) => r.size)).toEqual([2, 3, 4]);
        expect(table[0].values["V/Y"]).toBeNull();
    });
});

describe("getWeldMultiplier", () => {
    it("pomija wiersze bez wartości w kolumnie", () => {
        expect(getWeldMultiplier(table, 2, "V/Y")).toBe(0.08);
        expect(getWeldMultiplier(table, 2.5, "pachwina")).toBeCloseTo(0.065);
    });
});

describe("calculateWeldingTime", () => {
    it("pachwina a, pozycja PA", () => {
        expect(
            calculateWeldingTime({
                table,
                weldType: "pachwina_a",
                size: "3",
                length: "1000",
                position: "PA",
            }),
        ).toBeCloseTo(0.08);
    });

    it("pachwina z przeliczana na a i współczynnik pozycji PF", () => {
        const hours = calculateWeldingTime({
            table,
            weldType: "pachwina_z",
            size: "4,23",
            length: "2000",
            position: "PF",
        });
        // 4.23 / 1.41 = 3 -> 0.08 h/m
        expect(hours).toBeCloseTo(2 * 0.08 * 1.5);
    });

    it("rzuca UserError dla brakujących danych", () => {
        expect(() =>
            calculateWeldingTime({
                table,
                weldType: "pachwina_a",
                size: "",
                length: "1000",
                position: "PA",
            }),
        ).toThrow(UserError);
        expect(() =>
            calculateWeldingTime({
                table,
                weldType: "K",
                size: "3",
                length: "1000",
                position: "PA",
            }),
        ).toThrow(UserError);
    });
});
