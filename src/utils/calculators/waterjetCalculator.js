import { waterjetCuttingData } from "../../data/waterjetCuttingData";
import { UserError } from "../errors";
import { getPerimeterTime } from "../geometry";
import { parsePositive } from "../parseNumber";
import { findInRanges } from "../rangeLookup";
import { timeResultLine } from "../resultLine";

export function getWaterjetMultiplier(type, thickness) {
    const typeData = waterjetCuttingData.find((t) => t.type === type);
    if (!typeData) return null;
    return findInRanges(typeData.data, thickness)?.multiplier ?? null;
}

/**
 * Zwraca opis czasu cięcia wodą. Rzuca UserError dla nieprawidłowych danych.
 */
export function waterjetCalculator({
    shape,
    dims,
    thickness,
    holes,
    rectHoles,
    waterjetType,
}) {
    const thicknessValue = parsePositive(
        thickness,
        "Proszę podać prawidłową grubość blachy.",
    );

    const multiplier = getWaterjetMultiplier(waterjetType, thicknessValue);
    if (!multiplier) {
        throw new UserError("Brak danych dla podanej grubości i typu blachy.");
    }

    const hours = getPerimeterTime({ shape, dims, holes, rectHoles }, multiplier);
    const time = hours.toFixed(2);
    return timeResultLine(`Czas cięcia wodą (${waterjetType}): ${time} h`, time);
}
