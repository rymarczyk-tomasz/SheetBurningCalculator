import { UserError } from "../errors";
import { getPerimeterTime } from "../geometry";
import { getThicknessMultiplier } from "../getThicknessMultiplier";
import { parsePositive } from "../parseNumber";
import { timeResultLine } from "../resultLine";

const MIN_THICKNESS = 3;
const MAX_THICKNESS = 400;
const PLASMA_MAX_THICKNESS = 25;

/**
 * Zwraca linię wyniku z czasem palenia blachy. Rzuca UserError dla nieprawidłowych danych.
 */
export function burningCalculator({ shape, dims, thickness, holes, rectHoles }) {
    const thicknessValue = parsePositive(
        thickness,
        `Proszę podać prawidłową grubość blachy (${MIN_THICKNESS}-${MAX_THICKNESS} mm).`,
    );
    if (thicknessValue > MAX_THICKNESS) {
        throw new UserError(
            `Brak możliwości palenia blach o grubości powyżej ${MAX_THICKNESS} mm.`,
        );
    }
    if (thicknessValue < MIN_THICKNESS) {
        throw new UserError("Taką blachę tniemy na wodzie.");
    }

    const multiplier = getThicknessMultiplier(thicknessValue);
    const hours = getPerimeterTime({ shape, dims, holes, rectHoles }, multiplier);
    const method =
        Math.floor(thicknessValue) <= PLASMA_MAX_THICKNESS
            ? "Plazma"
            : "Palnik gazowy";

    const time = hours.toFixed(2);
    return timeResultLine(`Czas palenia blachy: ${time} h - ${method}`, time);
}
