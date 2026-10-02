import { calculateRectangle } from "./calculateRectangle";
import { calculateCircle } from "./calculateCircle";
import { calculateSemiCircle } from "./calculateSemiCircle";
import { calculateTotalLength } from "./calculateTotalLength";

/**
 * Wspólny dispatcher liczący wartość (np. czas) dla wybranego kształtu z danym mnożnikiem.
 * Rzuca błąd (z komunikatem dla użytkownika) dla nieprawidłowych danych/kształtu.
 */
export function calculateByShape(
    shape,
    { length, width, outerDiameter, innerDiameter, totalLength },
    multiplier,
) {
    switch (shape) {
        case "rectangle":
            return calculateRectangle(length, width, multiplier);
        case "circle":
            return calculateCircle(outerDiameter, innerDiameter, multiplier);
        case "semicircle":
            return calculateSemiCircle(
                outerDiameter,
                innerDiameter,
                multiplier,
            );
        case "totalLength":
            return calculateTotalLength(totalLength, multiplier);
        default:
            throw new Error("Nieobsługiwany kształt.");
    }
}
