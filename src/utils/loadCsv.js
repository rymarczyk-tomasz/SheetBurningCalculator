import Papa from "papaparse";
import { UserError } from "./errors";

const cache = new Map();

async function fetchCsvRows(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new UserError("Nie można załadować pliku z danymi.");
    }
    const text = await response.text();

    const { data, errors } = Papa.parse(text.trim(), {
        skipEmptyLines: true,
    });
    if (errors.length) {
        throw new UserError(
            "Błąd parsowania pliku z danymi: " + errors[0].message,
        );
    }
    return data;
}

/**
 * Pobiera i parsuje plik CSV (obsługuje cudzysłowy/przecinki w polach).
 * Zwraca tablicę wierszy (tablice surowych komórek-stringów). Wynik jest
 * zapamiętywany per URL; nieudane pobranie nie trafia do pamięci podręcznej.
 * Zwracanych tablic nie należy modyfikować.
 */
export function loadCsvRows(url) {
    if (!cache.has(url)) {
        const promise = fetchCsvRows(url).catch((error) => {
            cache.delete(url);
            throw error;
        });
        cache.set(url, promise);
    }
    return cache.get(url);
}
