import { rodCuttingData } from "../../data/rodPipeCuttingData";

export function sawCalculator({ shape, rodDiameter, pipeOuterDiameter }) {
    const diameter = parseInt(
        shape === "rod" ? rodDiameter : pipeOuterDiameter
    );

    if (isNaN(diameter) || diameter <= 0) {
        return "Proszę podać prawidłową średnicę.";
    }

    const found = rodCuttingData.find(
        (row) => diameter >= row.minDiameter && diameter <= row.maxDiameter
    );

    if (!found) {
        return `Brak danych dla podanej średnicy ${
            shape === "rod" ? "pręta" : "rury"
        }.`;
    }

    const time = shape === "rod" ? found.time : found.time / 2;
    const mpk = diameter < 180 ? "Mpk 416" : "Mpk 418";

    return `Na cięcie ${
        shape === "rod" ? "pręta" : "rury"
    } potrzeba ${time} h - ${mpk}`;
}
