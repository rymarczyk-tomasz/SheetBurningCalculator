import { annealingKrometData } from "../data/annealingKrometData";
import { findClosest } from "./tableLookup";

/** Współczynnik czasu pieca MAAG względem wspólnej tabeli obróbki cieplnej (obrobka_cieplna.csv). */
export const MAAG_TIME_FACTOR = 0.6;

/**
 * Czas wyżarzania w piecu KROMET [h]. Do 1000 kg wg najbliższej masy z tabeli,
 * powyżej: 1 h na każde rozpoczęte 1000 kg.
 */
export function krometAnnealingTime(mass) {
    if (mass <= 1000) {
        const idx = findClosest(
            annealingKrometData.map((d) => d.kg),
            mass,
        );
        return annealingKrometData[idx].time;
    }
    return Math.ceil(mass / 1000);
}
