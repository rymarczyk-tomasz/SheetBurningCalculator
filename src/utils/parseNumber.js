import { UserError } from "./errors";

/**
 * Zamienia wartość z pola formularza na liczbę. Akceptuje przecinek dziesiętny ("2,5").
 * Dla pustej lub nieprawidłowej wartości zwraca NaN.
 */
export function parseNumber(value) {
    if (typeof value === "number") return value;
    if (value == null) return NaN;
    const normalized = String(value).trim().replace(",", ".");
    if (normalized === "") return NaN;
    return Number(normalized);
}

/**
 * Zwraca dodatnią liczbę lub rzuca UserError z podanym komunikatem.
 */
export function parsePositive(value, message) {
    const number = parseNumber(value);
    if (!Number.isFinite(number) || number <= 0) {
        throw new UserError(message);
    }
    return number;
}
