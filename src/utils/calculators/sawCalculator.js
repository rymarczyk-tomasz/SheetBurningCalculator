import { rodCuttingData } from "../../data/rodPipeCuttingData";
import { UserError } from "../errors";
import { parsePositive } from "../parseNumber";
import { findInRanges } from "../rangeLookup";
import { timeResultLine } from "../resultLine";

/**
 * Zwraca dwie linie wyniku: czas cięcia pręta i rury o podanej średnicy.
 * Rzuca UserError dla nieprawidłowych danych.
 */
export function sawCalculator({ diameter }) {
    const diameterValue = parsePositive(
        diameter,
        "Proszę podać prawidłową średnicę.",
    );

    const found = findInRanges(rodCuttingData, diameterValue);
    if (!found) {
        throw new UserError("Brak danych dla podanej średnicy.");
    }

    const mpk = diameterValue < 180 ? "Mpk 416" : "Mpk 418";
    const rodTime = found.time;
    const pipeTime = found.time / 2;

    return [
        timeResultLine(`Na cięcie pręta potrzeba ${rodTime} h - ${mpk}`, rodTime),
        timeResultLine(`Na cięcie rury potrzeba ${pipeTime} h - ${mpk}`, pipeTime),
    ];
}
