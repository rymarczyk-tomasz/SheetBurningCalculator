import { describe, expect, it } from "vitest";
import { parseNumber, parsePositive } from "./parseNumber";
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
