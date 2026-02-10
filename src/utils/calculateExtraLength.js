import { parseNumberValue } from "./numberParsing";

export const calculateExtraLength = ({ holes = [], rectHoles = [] }) => {
  let extraLength = 0;

  holes.forEach(({ diameter, count }) => {
    const d = parseNumberValue(diameter);
    const c = parseNumberValue(count);
    if (!isNaN(d) && d > 0 && !isNaN(c) && c > 0) {
      extraLength += Math.PI * d * c;
    }
  });

  rectHoles.forEach(({ a, b, count }) => {
    const aa = parseNumberValue(a);
    const bb = parseNumberValue(b);
    const c = parseNumberValue(count);
    if (!isNaN(aa) && aa > 0 && !isNaN(bb) && bb > 0 && !isNaN(c) && c > 0) {
      extraLength += 2 * (aa + bb) * c;
    }
  });

  return extraLength;
};
