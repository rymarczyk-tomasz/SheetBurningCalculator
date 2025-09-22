import { rodCuttingData } from "../../data/rodPipeCuttingData";

export function sawCalculator({ rodDiameter }) {
    const diameter = parseInt(rodDiameter);

    if (isNaN(diameter) || diameter <= 0) {
        return {
            rodResult: "Proszę podać prawidłową średnicę.",
            pipeResult: "Proszę podać prawidłową średnicę.",
        };
    }

    const found = rodCuttingData.find(
        (row) => diameter >= row.minDiameter && diameter <= row.maxDiameter
    );

    if (!found) {
        return {
            rodResult: `Brak danych dla podanej średnicy pręta.`,
            pipeResult: `Brak danych dla podanej średnicy rury.`,
        };
    }

    const time = found.time;
    const mpk = diameter < 180 ? "Mpk 416" : "Mpk 418";

    const rodResult = `Na cięcie pręta potrzeba ${time} h - ${mpk}`;
    const pipeResult = `Na cięcie rury potrzeba ${time / 2} h - ${mpk}`;

    return { rodResult, pipeResult };
}
