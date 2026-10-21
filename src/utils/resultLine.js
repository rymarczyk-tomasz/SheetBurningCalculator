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

const TIME_VALUE = /^\d+(,\d+)?$/;

/**
 * Dla linii z czasem (kopiowana wartość to liczba z przecinkiem) zwraca wartość
 * i jednostkę do wyróżnienia w wyniku; dla pozostałych linii null.
 */
export function getTimeValue(line) {
    if (!line.copy || !TIME_VALUE.test(line.copy)) return null;
    return { value: line.copy, unit: "h" };
}

/** Zamienia kropki dziesiętne w tekście na przecinki ("0.15 h" -> "0,15 h"). */
export function localizeDecimals(text) {
    return text.replace(/(\d)\.(\d)/g, "$1,$2");
}
