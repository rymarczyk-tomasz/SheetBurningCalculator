// Rozmiary ułamkowe; rozmiary całkowite (1, 2, 3...) dopasowywane są wprost
const NOMINAL_SIZE_MAP = {
    0.25: "1/4",
    0.375: "3/8",
    0.5: "1/2",
    0.75: "3/4",
    1.25: "1 1/4",
    1.5: "1 1/2",
    2.5: "2 1/2",
    3.5: "3 1/2",
};

/**
 * Parsuje pipe_diameters.csv: rozmiar nominalny, średnica zewnętrzna, kolejne kolumny Schedule.
 */
export function parsePipeTable(rows) {
    if (!rows.length) return { schedules: [], data: [] };

    const header = rows[0].map((h) => h.trim());
    const schedules = header.slice(2);

    const data = rows
        .slice(1)
        .map((cols) => {
            const trimmed = cols.map((c) => c.trim());
            const [nominalSize, outerDiameter] = trimmed;
            if (!nominalSize) return null;

            const values = {};
            schedules.forEach((label, idx) => {
                const val = trimmed[idx + 2];
                values[label] = val ? parseFloat(val) : null;
            });

            return {
                nominalSize,
                outerDiameter: parseFloat(outerDiameter) || null,
                values,
            };
        })
        .filter(Boolean);

    return { schedules, data };
}

/**
 * Znajduje rurę po rozmiarze nominalnym wpisanym jako ułamek ("2 1/2") lub liczba ("2.5", "2,5").
 */
export function findPipe(pipeData, input) {
    if (!input) return null;
    const normalized = input.trim().replace(",", ".").toLowerCase();
    const byName = (name) =>
        pipeData.find((d) => d.nominalSize.toLowerCase() === name) ?? null;

    const exact = byName(normalized);
    if (exact) return exact;

    const decimal = Number(normalized);
    if (normalized === "" || !Number.isFinite(decimal)) return null;
    return byName(NOMINAL_SIZE_MAP[decimal] ?? String(decimal));
}
