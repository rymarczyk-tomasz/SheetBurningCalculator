import { calculateRectangle } from "../calculateRectangle";
import { calculateSemiCircle } from "../calculateSemiCircle";
import { calculateTotalLength } from "../calculateTotalLength";
import { calculateCircle } from "../calculateCircle"; // Import calculateCircle
import { waterjetCuttingData } from "../../data/waterjetCuttingData";
import { calculateExtraLength } from "../calculateExtraLength";
import { parseNumberValue } from "../numberParsing";

export function getWaterjetMultiplier(type, thickness) {
  const typeData = waterjetCuttingData.find((t) => t.type === type);
  if (!typeData) return null;
  const found = typeData.data.find(
    (row) => thickness >= row.minThickness && thickness <= row.maxThickness,
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
  const thicknessValue = parseNumberValue(thickness);
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

  return `Czas cięcia wodą (${waterjetType}): ${result.toFixed(2)} h`;
}
