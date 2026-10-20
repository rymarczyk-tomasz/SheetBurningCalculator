import { describe, expect, it } from "vitest";
import { findPipe, parsePipeTable } from "./pipes";

const { schedules, data } = parsePipeTable([
    ["Nominal Pipe Size", "Outside Diameter", "Sch10", "Sch40"],
    ["1/4", "13.7", "1.65", "2.24"],
    ["2", "60.3", "2.77", "3.91"],
    ["2 1/2", "73", "3.05", ""],
]);

describe("parsePipeTable", () => {
    it("czyta kolumny Schedule i puste wartości jako null", () => {
        expect(schedules).toEqual(["Sch10", "Sch40"]);
        expect(data[2].values.Sch40).toBeNull();
        expect(data[0].outerDiameter).toBe(13.7);
    });
});

describe("findPipe", () => {
    it.each([
        ["1/4", "1/4"],
        ["0.25", "1/4"],
        ["0,25", "1/4"],
        ["2", "2"],
        ["2.5", "2 1/2"],
        [" 2 1/2 ", "2 1/2"],
    ])("%j -> %j", (input, expected) => {
        expect(findPipe(data, input)?.nominalSize).toBe(expected);
    });

    it("zwraca null dla nieznanej wielkości", () => {
        expect(findPipe(data, "7")).toBeNull();
        expect(findPipe(data, "abc")).toBeNull();
        expect(findPipe(data, "")).toBeNull();
    });
});
