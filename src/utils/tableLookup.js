import { interpolate } from "./interpolate";
import { parseNumber } from "./parseNumber";

/**
 * Zwraca indeks elementu tablicy najbliższego podanej wartości.
 */
export function findClosest(arr, value) {
    return arr.reduce(
        (bestIdx, curr, idx, a) =>
            Math.abs(curr - value) < Math.abs(a[bestIdx] - value)
                ? idx
                : bestIdx,
        0,
    );
}

/**
 * Parsuje tabelę CSV w formacie:
 *   wiersz 0: etykieta, grubość1, grubość2, ...
 *   wiersz n: masa, czas1, czas2, ...
 */
export function parseMassThicknessTable(rows) {
    return {
        thicknesses: rows[0].slice(1).map(parseNumber),
        data: rows.slice(1).map((row) => ({
            mass: parseNumber(row[0]),
            times: row
                .slice(1)
                .map((val) => (val.trim() === "" ? null : parseNumber(val))),
        })),
    };
}

/**
 * Czas dla pustej komórki leżącej między wartościami tej samej kolumny grubości:
 * interpolacja po masie, zaokrąglona do 0,1 h jak w tabeli.
 * Null dla pustych komórek na brzegu tabeli (wartości tylko z jednej strony).
 */
function fillColumnGap(data, massIdx, thicknessIdx) {
    const { mass } = data[massIdx];
    const column = data
        .map((row) => ({ x: row.mass, y: row.times[thicknessIdx] }))
        .filter((p) => p.y != null);

    if (!column.some((p) => p.x < mass) || !column.some((p) => p.x > mass)) {
        return null;
    }
    return Number(interpolate(column, mass).toFixed(1));
}

/**
 * Zwraca czas dla najbliższej masy i grubości w tabeli. Pustą komórkę między
 * wartościami kolumny uzupełnia interpolacją; null, gdy nie ma z czego jej wyznaczyć.
 */
export function lookupMassThickness({ thicknesses, data }, mass, thickness) {
    if (!data.length) return null;
    const massIdx = findClosest(
        data.map((d) => d.mass),
        mass,
    );
    const thicknessIdx = findClosest(thicknesses, thickness);
    return (
        data[massIdx].times[thicknessIdx] ??
        fillColumnGap(data, massIdx, thicknessIdx)
    );
}
