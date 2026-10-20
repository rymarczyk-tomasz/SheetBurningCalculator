import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import Papa from "papaparse";
import { describe, expect, it } from "vitest";
import { findPipe, parsePipeTable } from "../utils/pipes";

const publicDir = fileURLToPath(new URL("../../public/", import.meta.url));
const csvFiles = readdirSync(publicDir).filter((f) => f.endsWith(".csv"));

const readRows = (file) =>
    Papa.parse(readFileSync(publicDir + file, "utf8").trim(), {
        skipEmptyLines: true,
    }).data;

describe("pliki CSV w public/", () => {
    it("istnieją", () => {
        expect(csvFiles.length).toBeGreaterThan(0);
    });

    // Nadmiarowy przecinek przesuwa wartości do niewłaściwych kolumn
    it.each(csvFiles)("%s: żaden wiersz nie ma więcej kolumn niż nagłówek", (file) => {
        const [header, ...rows] = readRows(file);
        const tooLong = rows
            .map((row, idx) => ({ line: idx + 2, columns: row.length }))
            .filter((r) => r.columns > header.length);
        expect(tooLong).toEqual([]);
    });
});

describe("pipe_diameters.csv", () => {
    const { data } = parsePipeTable(readRows("pipe_diameters.csv"));

    it("1\": Sch160 i XXS wg ASME B36.10", () => {
        const pipe = findPipe(data, "1");
        expect(pipe.values.Sch160).toBe(6.35);
        expect(pipe.values.XXS).toBe(9.09);
    });
});
