import { useState, useEffect } from "react";
import { loadCsvRows } from "../utils/loadCsv";
import { parseMassThicknessTable } from "../utils/tableLookup";

/**
 * Ładuje tabelę CSV masa x grubość (format opisany w parseMassThicknessTable).
 * Dla url === null nic nie ładuje.
 *
 * Zwraca { csvData, error }
 */
export function useCSVTable(url) {
    const [csvData, setCsvData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!url) return;

        let cancelled = false;
        setCsvData(null);
        setError(null);

        loadCsvRows(url)
            .then((rows) => {
                if (!cancelled) setCsvData(parseMassThicknessTable(rows));
            })
            .catch((err) => {
                if (!cancelled) setError(err.message);
            });

        return () => {
            cancelled = true;
        };
    }, [url]);

    return { csvData, error };
}
