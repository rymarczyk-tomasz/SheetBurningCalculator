import { describe, expect, it } from "vitest";
import { parseNumber, parsePositive, parseSum } from "./parseNumber";
import { UserError } from "./errors";

describe("parseNumber", () => {
    it("parsuje liczby z kropką i przecinkiem", () => {
        expect(parseNumber("2.5")).toBe(2.5);
        expect(parseNumber("2,5")).toBe(2.5);
        expect(parseNumber(" 10 ")).toBe(10);
        expect(parseNumber(7)).toBe(7);
    });

    it("zwraca NaN dla pustych i nieprawidłowych wartości", () => {
        expect(parseNumber("")).toBeNaN();
        expect(parseNumber("   ")).toBeNaN();
        expect(parseNumber(null)).toBeNaN();
        expect(parseNumber(undefined)).toBeNaN();
        expect(parseNumber("12abc")).toBeNaN();
    });
});

describe("parsePositive", () => {
    it("zwraca dodatnią liczbę", () => {
        expect(parsePositive("3,5", "błąd")).toBe(3.5);
    });

    it.each(["", "0", "-1", "abc"])("rzuca UserError dla %j", (value) => {
        expect(() => parsePositive(value, "błąd")).toThrow(UserError);
        expect(() => parsePositive(value, "błąd")).toThrow("błąd");
    });
});

describe("parseSum", () => {
    it("sumuje składniki z kropką i przecinkiem", () => {
        expect(parseSum("250+578+360")).toBe(1188);
        expect(parseSum(" 12,5 + 7.5 ")).toBe(20);
        expect(parseSum("100")).toBe(100);
        expect(parseSum("250+")).toBe(250);
    });

    it("zwraca NaN dla pustych i nieprawidłowych wartości", () => {
        expect(parseSum("")).toBeNaN();
        expect(parseSum("+")).toBeNaN();
        expect(parseSum("250+abc")).toBeNaN();
    });
});
