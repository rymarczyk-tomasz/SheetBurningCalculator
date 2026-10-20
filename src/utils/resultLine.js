/**
 * Linia wyniku: pełny tekst do wyświetlenia i sama wartość kopiowana do schowka
 * (np. wymiar rury "73x5.16").
 */
export function resultLine(text, copy = text) {
    return { text, copy: String(copy) };
}

/**
 * Linia wyniku z czasem: kopiowany jest sam czas z przecinkiem dziesiętnym ("0,15"),
 * gotowy do wklejenia w polskim formacie liczb.
 */
export function timeResultLine(text, time) {
    return resultLine(text, String(time).replace(".", ","));
}
