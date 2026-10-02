import { useState, useEffect } from "react";
import { loadCsvRows } from "../utils/loadCsv";

/**
 * Hook ładujący plik CSV w formacie:
 *   wiersz 0: pusta_komórka, grubość1, grubość2, ...
 *   wiersz n: masa, czas1, czas2, ...
 *
 * Zwraca { csvData, loading, error }
 */
export function useCSVTable(url) {
    const [csvData, setCsvData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!url) return;

        setLoading(true);
        setError(null);

        loadCsvRows(url)
            .then((rows) => {
                const thicknesses = rows[0].slice(1).map(Number);
                const data = rows.slice(1).map((row) => ({
                    mass: Number(row[0]),
                    times: row
                        .slice(1)
                        .map((val) => (val ? Number(val) : null)),
                }));
                setCsvData({ thicknesses, data });
            })
            .catch((err) =>
                setError("Błąd ładowania pliku CSV: " + err.message),
            )
            .finally(() => setLoading(false));
    }, [url]);

    return { csvData, loading, error };
}

/**
 * Zwraca indeks elementu w tablicy arr najbliższego wartości value.
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
