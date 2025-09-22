import { calculateRectangle } from "../calculateRectangle";
import { calculateSemiCircle } from "../calculateSemiCircle";
import { calculateTotalLength } from "../calculateTotalLength";
import { calculateCircle } from "../calculateCircle"; // Import calculateCircle
import { getThicknessMultiplier } from "../getThicknessMultiplier";

export function burningCalculator({
    shape,
    length,
    width,
    outerDiameter,
    innerDiameter,
    totalLength,
    thickness,
    holes,
    rectHoles,
}) {
    const thicknessValue = parseInt(thickness);
    if (isNaN(thicknessValue) || thicknessValue <= 0) {
        return "Proszę podać prawidłową grubość blachy (1-400 mm).";
    }
    if (thicknessValue > 400) {
        return "Brak możliwości palenia blach o grubości powyżej 400 mm.";
    }

    const multiplier = getThicknessMultiplier(thicknessValue);
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

    if (thicknessValue < 3) {
        return "Taką blachę tniemy na wodzie";
    } else if (thicknessValue <= 25) {
        return `Czas palenia blachy: ${result.toFixed(2)} h - Plazma`;
    } else {
        return `Czas palenia blachy: ${result.toFixed(2)} h - Palnik gazowy`;
    }
}
