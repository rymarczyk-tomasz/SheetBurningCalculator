import Papa from "papaparse";

/**
 * Pobiera i parsuje plik CSV (obsługuje cudzysłowy/przecinki w polach, w odróżnieniu od String.split(",")).
 * Zwraca tablicę wierszy, każdy wiersz to tablica surowych (nieprzyciętych) komórek-stringów.
 */
export async function loadCsvRows(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Nie można załadować pliku CSV");
    const text = await response.text();

    const { data, errors } = Papa.parse(text.trim(), {
        skipEmptyLines: true,
    });
    if (errors.length) {
        throw new Error("Błąd parsowania pliku CSV: " + errors[0].message);
    }
    return data;
}
