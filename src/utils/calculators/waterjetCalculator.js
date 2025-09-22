import { calculateRectangle } from "../calculateRectangle";
import { calculateSemiCircle } from "../calculateSemiCircle";
import { calculateTotalLength } from "../calculateTotalLength";
import { calculateCircle } from "../calculateCircle"; // Import calculateCircle
import { waterjetCuttingData } from "../../data/waterjetCuttingData";

export function getWaterjetMultiplier(type, thickness) {
    const typeData = waterjetCuttingData.find((t) => t.type === type);
    if (!typeData) return null;
    const found = typeData.data.find(
        (row) => thickness >= row.minThickness && thickness <= row.maxThickness
    );
    return found ? found.multiplier : null;
}

export function waterjetCalculator({
    shape,
    length,
    width,
    outerDiameter,
    innerDiameter,
    totalLength,
    thickness,
    holes,
    rectHoles,
    waterjetType,
}) {
    const thicknessValue = parseFloat(thickness);
    if (isNaN(thicknessValue) || thicknessValue <= 0) {
        return "Proszę podać prawidłową grubość blachy.";
    }

    const multiplier = getWaterjetMultiplier(waterjetType, thicknessValue);
    if (!multiplier) {
        return "Brak danych dla podanej grubości i typu blachy.";
    }

    let result = 0;
    try {
        switch (shape) {
            case "rectangle":
                result = calculateRectangle(length, width, multiplier);
                break;
            case "circle":
                result = calculateCircle(
                    outerDiameter,
                    innerDiameter,
                    multiplier
                );
                break;
            case "semicircle":
                result = calculateSemiCircle(
                    outerDiameter,
                    innerDiameter,
                    multiplier
                );
                break;
            case "totalLength":
                result = calculateTotalLength(totalLength, multiplier);
                break;
            default:
                return "Nieobsługiwany kształt.";
        }
    } catch (error) {
        return error.message;
    }

    let extraLength = 0;

    holes.forEach(({ diameter, count }) => {
        const d = parseFloat(diameter);
        const c = parseInt(count);
        if (!isNaN(d) && d > 0 && !isNaN(c) && c > 0) {
            extraLength += Math.PI * d * c;
        }
    });

    rectHoles.forEach(({ a, b, count }) => {
        const aa = parseFloat(a);
        const bb = parseFloat(b);
        const c = parseInt(count);
        if (aa > 0 && bb > 0 && c > 0) {
            extraLength += 2 * (aa + bb) * c;
        }
    });

    if (extraLength > 0) {
        result += (extraLength / 1000) * multiplier;
    }

    return `Czas cięcia wodą (${waterjetType}): ${result.toFixed(2)} h`;
}
