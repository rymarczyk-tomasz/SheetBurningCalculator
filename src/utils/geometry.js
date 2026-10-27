import { UserError } from "./errors";
import { parseNumber, parsePositive, parseSum } from "./parseNumber";

function parseInnerDiameter(value) {
    if (value == null || String(value).trim() === "") return 0;
    const number = parseNumber(value);
    if (!Number.isFinite(number) || number < 0) {
        throw new UserError("Podaj prawidłowe fi wewnętrzne.");
    }
    return number;
}

/**
 * Zwraca długość obrysu detalu w mm dla wybranego kształtu.
 * Rzuca UserError dla nieprawidłowych danych.
 */
export function getPerimeterMm(
    shape,
    { length, width, outerDiameter, innerDiameter, totalLength },
) {
    switch (shape) {
        case "rectangle": {
            const message = "Proszę podać wszystkie dane dla czworokąta.";
            const a = parsePositive(length, message);
            const b = parsePositive(width, message);
            return 2 * (a + b);
        }
        case "circle":
        case "semicircle": {
            const outer = parsePositive(
                outerDiameter,
                "Proszę podać fi zewnętrzne.",
            );
            const inner = parseInnerDiameter(innerDiameter);
            if (inner >= outer) {
                throw new UserError(
                    "Fi wewnętrzne musi być mniejsze od fi zewnętrznego.",
                );
            }
            const arcs = Math.PI * (outer + inner);
            // Półpierścień: połowa obu łuków + dwa proste odcinki o długości (D - d) / 2
            return shape === "circle" ? arcs : arcs / 2 + (outer - inner);
        }
        case "totalLength":
            return parsePositive(
                parseSum(totalLength),
                "Proszę podać poprawną całkowitą długość wszystkich boków.",
            );
        default:
            throw new UserError("Nieobsługiwany kształt.");
    }
}

/**
 * Zwraca łączny obwód otworów (kołowych i czworokątnych) w mm.
 * Niekompletne lub nieprawidłowe wiersze są pomijane.
 */
export function getHolesLengthMm(holes = [], rectHoles = []) {
    let total = 0;

    for (const { diameter, count } of holes) {
        const d = parseNumber(diameter);
        const c = Math.floor(parseNumber(count));
        if (d > 0 && c > 0) total += Math.PI * d * c;
    }

    for (const { a, b, count } of rectHoles) {
        const sideA = parseNumber(a);
        const sideB = parseNumber(b);
        const c = Math.floor(parseNumber(count));
        if (sideA > 0 && sideB > 0 && c > 0) total += 2 * (sideA + sideB) * c;
    }

    return total;
}

/**
 * Czas obróbki wzdłuż obrysu (i otworów) w godzinach: długość [m] * mnożnik [h/m].
 */
export function getPerimeterTime({ shape, dims, holes, rectHoles }, multiplier) {
    const lengthMm =
        getPerimeterMm(shape, dims) + getHolesLengthMm(holes, rectHoles);
    return (lengthMm / 1000) * multiplier;
}
