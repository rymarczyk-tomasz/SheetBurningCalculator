import { calculateRectangle } from "../calculateRectangle";
import { calculateSemiCircle } from "../calculateSemiCircle";
import { calculateTotalLength } from "../calculateTotalLength";
import { calculateCircle } from "../calculateCircle"; // Import calculateCircle
import { getThicknessMultiplier } from "../getThicknessMultiplier";
import { calculateExtraLength } from "../calculateExtraLength";
import { parseNumberValue } from "../numberParsing";

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
  const thicknessValue = parseNumberValue(thickness);
  if (isNaN(thicknessValue) || thicknessValue <= 0) {
    return "Proszę podać prawidłową grubość blachy (1-400 mm).";
  }
  if (thicknessValue < 3) {
    return "Taką blachę tniemy na wodzie";
  }
  if (thicknessValue > 400) {
    return "Brak możliwości palenia blach o grubości powyżej 400 mm.";
  }

  const multiplier = getThicknessMultiplier(thicknessValue);
  if (!multiplier) {
    return "Brak danych dla podanej grubości blachy.";
  }
  let result = 0;

  try {
    switch (shape) {
      case "rectangle":
        result = calculateRectangle(length, width, multiplier);
        break;
      case "circle":
        result = calculateCircle(outerDiameter, innerDiameter, multiplier);
        break;
      case "semicircle":
        result = calculateSemiCircle(outerDiameter, innerDiameter, multiplier);
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

  const extraLength = calculateExtraLength({ holes, rectHoles });

  if (extraLength > 0) {
    result += (extraLength / 1000) * multiplier;
  }

  if (thicknessValue <= 25) {
    return `Czas palenia blachy: ${result.toFixed(2)} h - Plazma`;
  } else {
    return `Czas palenia blachy: ${result.toFixed(2)} h - Palnik gazowy`;
  }
}
