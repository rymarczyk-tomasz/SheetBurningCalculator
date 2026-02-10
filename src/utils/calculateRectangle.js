import { parseNumberValue } from "./numberParsing";

export const calculateRectangle = (length, width, multiplier) => {
  const lengthValue = parseNumberValue(length);
  const widthValue = parseNumberValue(width);

  if (!isNaN(lengthValue) && !isNaN(widthValue)) {
    return (((lengthValue + widthValue) * 2) / 1000) * multiplier;
  }

  throw new Error("Proszę podać wszystkie dane dla czworokąta.");
};
