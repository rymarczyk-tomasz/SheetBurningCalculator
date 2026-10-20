import { loadCsvRows } from "./loadCsv";
import { interpolate } from "./interpolate";
import { parseNumber } from "./parseNumber";

/**
 * Wyznacza mnożnik z wierszy CSV (nagłówek: grubosc, <kolumny...>).
 * Interpoluje liniowo między najbliższymi dostępnymi grubościami.
 */
export function getMultiplierFromRows(rows, thickness, column) {
    const header = rows[0].map((h) => h.trim());
    const idxThickness = header.indexOf("grubosc");
    const idxColumn = header.indexOf(column);
    if (idxThickness === -1 || idxColumn === -1) return null;

    const points = rows
        .slice(1)
        .map((cols) => ({
            x: parseNumber(cols[idxThickness]),
            y: parseNumber(cols[idxColumn]),
        }))
        .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));

    return interpolate(points, thickness);
}

/**
 * Pobiera mnożnik dla danej grubości z pliku normatyw.csv.
 *
 * @param {number} thickness
 * @param {string} column - nazwa kolumny w pliku CSV (np. "fazowanie", "szlifowanie")
 * @returns {Promise<number|null>}
 */
export async function getNormatywMultiplier(thickness, column) {
    const rows = await loadCsvRows(`${import.meta.env.BASE_URL}normatyw.csv`);
    return getMultiplierFromRows(rows, thickness, column);
}
