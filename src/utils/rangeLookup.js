/**
 * Wyszukuje wiersz przedziału { min, max, ... } zawierający wartość.
 * Wiersze muszą być posortowane rosnąco po `min`. Wartości wpadające w lukę
 * między przedziałami (np. 3.995 między 3.99 a 4) trafiają do niższego przedziału.
 * Zwraca null, gdy wartość jest poniżej pierwszego lub powyżej ostatniego przedziału.
 */
export function findInRanges(rows, value) {
    if (!Number.isFinite(value)) return null;

    let found = null;
    for (const row of rows) {
        if (value < row.min) break;
        found = row;
    }

    if (!found) return null;
    if (found === rows[rows.length - 1] && value > found.max) return null;
    return found;
}
