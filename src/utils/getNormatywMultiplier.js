import { loadCsvRows } from "./loadCsv";

/**
 * Pobiera mnożnik dla danej grubości z pliku normatyw.csv.
 * Interpoluje liniowo między najbliższymi dostępnymi wartościami.
 *
 * @param {number} thickness
 * @param {string} column - nazwa kolumny w pliku CSV (np. "fazowanie", "szlifowanie")
 * @returns {Promise<number|null>}
 */
export async function getNormatywMultiplier(thickness, column) {
    try {
        const rows = await loadCsvRows(
            `${import.meta.env.BASE_URL}normatyw.csv`,
        );
        const header = rows[0].map((h) => h.trim());
        const idxThickness = header.indexOf("grubosc");
        const idxColumn = header.indexOf(column);

        if (idxThickness === -1 || idxColumn === -1) return null;

        const values = [];
        for (let i = 1; i < rows.length; i++) {
            const cols = rows[i].map((c) => c.trim());
            const t = parseFloat(cols[idxThickness]);
            const m = parseFloat(cols[idxColumn]);
            if (!isNaN(t) && !isNaN(m)) {
                values.push({ t, m });
            }
        }

        // Dokładne trafienie
        for (const v of values) {
            if (v.t === thickness) return v.m;
        }

        // Interpolacja liniowa
        let lower = null;
        let upper = null;
        for (const v of values) {
            if (v.t < thickness) lower = v;
            if (v.t > thickness && !upper) upper = v;
        }
        if (lower && upper) {
            return (
                lower.m +
                ((upper.m - lower.m) * (thickness - lower.t)) /
                    (upper.t - lower.t)
            );
        }

        if (lower) return lower.m;
        if (upper) return upper.m;
        return null;
    } catch {
        return null;
    }
}
