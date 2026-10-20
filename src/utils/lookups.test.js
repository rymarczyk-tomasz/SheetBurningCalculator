import { describe, expect, it } from "vitest";
import { findInRanges } from "./rangeLookup";
import { interpolate } from "./interpolate";
import {
    findClosest,
    lookupMassThickness,
    parseMassThicknessTable,
} from "./tableLookup";
import { getMultiplierFromRows } from "./getNormatywMultiplier";
import { krometAnnealingTime } from "./annealing";

describe("findInRanges", () => {
    const rows = [
        { min: 3, max: 3.99, v: "a" },
        { min: 4, max: 4.99, v: "b" },
    ];

    it("znajduje przedział", () => {
        expect(findInRanges(rows, 3)?.v).toBe("a");
        expect(findInRanges(rows, 4.5)?.v).toBe("b");
    });

    it("wartość w luce między przedziałami trafia do niższego", () => {
        expect(findInRanges(rows, 3.995)?.v).toBe("a");
    });

    it("zwraca null poza zakresem", () => {
        expect(findInRanges(rows, 2.9)).toBeNull();
        expect(findInRanges(rows, 5)).toBeNull();
        expect(findInRanges(rows, NaN)).toBeNull();
    });
});

describe("interpolate", () => {
    const points = [
        { x: 10, y: 1 },
        { x: 0, y: 0 },
    ];

    it("interpoluje liniowo i zwraca dokładne trafienia", () => {
        expect(interpolate(points, 5)).toBe(0.5);
        expect(interpolate(points, 10)).toBe(1);
    });

    it("poza zakresem zwraca wartość skrajną", () => {
        expect(interpolate(points, -5)).toBe(0);
        expect(interpolate(points, 50)).toBe(1);
        expect(interpolate([], 5)).toBeNull();
    });
});

describe("tabela masa x grubość", () => {
    const table = parseMassThicknessTable([
        ["Masa", "20", "50"],
        ["10", "0.7", "0.8"],
        ["100", "1.5", ""],
    ]);

    it("findClosest zwraca indeks najbliższej wartości", () => {
        expect(findClosest([10, 20, 50], 34)).toBe(1);
        expect(findClosest([10, 20, 50], 36)).toBe(2);
    });

    it("wybiera najbliższą masę i grubość", () => {
        expect(lookupMassThickness(table, 12, 22)).toBe(0.7);
        expect(lookupMassThickness(table, 12, 45)).toBe(0.8);
        expect(lookupMassThickness(table, 90, 20)).toBe(1.5);
    });

    it("zwraca null dla pustej komórki", () => {
        expect(lookupMassThickness(table, 90, 50)).toBeNull();
    });
});

describe("getMultiplierFromRows (normatyw.csv)", () => {
    const rows = [
        ["grubosc", " palenie", " fazowanie"],
        ["4", "0.05", "0.07"],
        ["8", "0.07", "0.09"],
    ];

    it("czyta kolumnę po nazwie (z pominięciem spacji) i interpoluje", () => {
        expect(getMultiplierFromRows(rows, 4, "fazowanie")).toBe(0.07);
        expect(getMultiplierFromRows(rows, 6, "fazowanie")).toBeCloseTo(0.08);
    });

    it("zwraca null dla nieznanej kolumny", () => {
        expect(getMultiplierFromRows(rows, 4, "spawanie")).toBeNull();
    });
});

describe("krometAnnealingTime", () => {
    it("do 1000 kg wg najbliższej masy z tabeli", () => {
        expect(krometAnnealingTime(100)).toBe(0.15);
        expect(krometAnnealingTime(1000)).toBe(1);
    });

    it("powyżej 1000 kg: 1 h na każde rozpoczęte 1000 kg", () => {
        expect(krometAnnealingTime(1001)).toBe(2);
        expect(krometAnnealingTime(3000)).toBe(3);
    });
});
