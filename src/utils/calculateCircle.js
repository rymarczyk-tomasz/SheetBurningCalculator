import { isEmptyValue, parseNumberValue } from "./numberParsing";

export const calculateCircle = (outerDiameter, innerDiameter, multiplier) => {
  const outerDiameterValue = parseNumberValue(outerDiameter);
  const innerDiameterValue = isEmptyValue(innerDiameter)
    ? 0
    : parseNumberValue(innerDiameter);

  if (innerDiameterValue >= outerDiameterValue) {
    throw new Error("Fi wewnętrzne musi być mniejsze od fi zewnętrznego.");
  }

  if (!isNaN(outerDiameterValue) && !isNaN(innerDiameterValue)) {
    return (
      (((outerDiameterValue + innerDiameterValue) * Math.PI) / 1000) *
      multiplier
    );
  }

  throw new Error("Proszę podać fi zewnętrzne dla koła.");
};
