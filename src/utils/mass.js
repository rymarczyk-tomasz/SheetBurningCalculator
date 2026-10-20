import { UserError } from "./errors";
import { parseNumber } from "./parseNumber";

/** Gęstość stali [kg/mm³] (7.86 g/cm³). */
export const STEEL_DENSITY = 7.86e-6;

const positive = (value) => {
    const number = parseNumber(value);
    return Number.isFinite(number) && number > 0 ? number : null;
};

/**
 * Zwraca masę detalu w kg lub null, gdy dane są niekompletne.
 * Rzuca UserError, gdy fi wewnętrzne nie jest mniejsze od zewnętrznego.
 */
export function calculateMass(shape, dims, thickness) {
    const t = positive(thickness);
    let volume = null;

    switch (shape) {
        case "rectangle": {
            const a = positive(dims.length);
            const b = positive(dims.width);
            if (a && b && t) volume = a * b * t;
            break;
        }
        case "circle":
        case "semicircle": {
            const outer = positive(dims.outerDiameter);
            const inner = positive(dims.innerDiameter) ?? 0;
            if (!outer || !t) break;
            if (inner >= outer) {
                throw new UserError(
                    "Fi wewnętrzne musi być mniejsze od fi zewnętrznego.",
                );
            }
            const area = (Math.PI / 4) * (outer * outer - inner * inner);
            volume = (shape === "semicircle" ? area / 2 : area) * t;
            break;
        }
        case "totalLength": {
            // Pas o szerokości 1 mm wzdłuż podanej długości
            const length = positive(dims.totalLength);
            if (length && t) volume = length * t * 1;
            break;
        }
        case "rod": {
            const d = positive(dims.rodDiameter);
            const length = positive(dims.rodLength);
            if (d && length) volume = (Math.PI / 4) * d * d * length;
            break;
        }
        default:
            break;
    }

    return volume === null ? null : volume * STEEL_DENSITY;
}
