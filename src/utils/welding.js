import { UserError } from "./errors";
import { interpolate } from "./interpolate";
import { parseNumber, parsePositive } from "./parseNumber";

/** Przeliczenie wielkości spoiny pachwinowej z (długość boku) na a (grubość): a = z / 1.41. */
export const FILLET_Z_TO_A = 1.41;

export const WELD_POSITION_FACTORS = {
    PA: 1.0,
    PB: 1.0,
    PF: 1.5,
    PG: 1.5,
    PC: 1.6,
    PD: 1.6,
    PE: 2.0,
};

export const WELD_POSITIONS = Object.keys(WELD_POSITION_FACTORS);

/**
 * Parsuje spawanie.csv: pierwsza kolumna to wielkość spoiny, kolejne to rodzaje spoin.
 */
export function parseWeldingTable(rows) {
    if (!rows.length) return { types: [], table: [] };
    const header = rows[0].map((h) => h.trim());
    const types = header.slice(1);

    const table = rows
        .slice(1)
        .map((cols) => {
            const size = parseNumber(cols[0]);
            if (!Number.isFinite(size)) return null;
            const values = {};
            types.forEach((label, idx) => {
                const v = parseNumber(cols[idx + 1]);
                values[label] = Number.isFinite(v) ? v : null;
            });
            return { size, values };
        })
        .filter(Boolean)
        .sort((a, b) => a.size - b.size);

    return { types, table };
}

/**
 * Mnożnik [h/m] dla wielkości spoiny, interpolowany po wierszach z wartością w danej kolumnie.
 */
export function getWeldMultiplier(table, size, column) {
    const points = table
        .filter((row) => row.values[column] != null)
        .map((row) => ({ x: row.size, y: row.values[column] }));
    return interpolate(points, size);
}

/**
 * Oblicza czas spawania w godzinach.
 * weldType: "pachwina_a", "pachwina_z" lub nazwa kolumny z spawanie.csv.
 */
export function calculateWeldingTime({
    table,
    weldType,
    size,
    length,
    position,
}) {
    const lengthMm = parsePositive(
        length,
        "Proszę podać prawidłową całkowitą długość spawania.",
    );
    const sizeValue = parsePositive(
        size,
        "Proszę podać prawidłową wielkość spoiny (liczba).",
    );
    if (!weldType) throw new UserError("Proszę wybrać rodzaj spoiny.");

    const isFillet = weldType === "pachwina_a" || weldType === "pachwina_z";
    const column = isFillet ? "pachwina" : weldType;
    const lookupSize =
        weldType === "pachwina_z" ? sizeValue / FILLET_Z_TO_A : sizeValue;

    const multiplier = getWeldMultiplier(
        table,
        Math.round(lookupSize * 1000) / 1000,
        column,
    );
    if (multiplier == null) {
        throw new UserError(
            "Brak wartości normatywnej dla wybranego typu/wielkości spoiny.",
        );
    }

    const positionFactor = WELD_POSITION_FACTORS[position] ?? 1.0;
    return (lengthMm / 1000) * multiplier * positionFactor;
}
