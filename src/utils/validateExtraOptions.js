import { isEmptyValue, parseNumberValue } from "./numberParsing";

const getValueErrors = (value, label) => {
  if (isEmptyValue(value)) {
    return `${label} jest wymagane.`;
  }

  const parsed = parseNumberValue(value);
  if (isNaN(parsed)) {
    return "Wpisz poprawna wartosc.";
  }

  if (parsed <= 0) {
    return "Wpisz dodatnia wartosc.";
  }

  return null;
};

const getHoleRowErrors = (row) => {
  const diameterEmpty = isEmptyValue(row.diameter);
  const countEmpty = isEmptyValue(row.count);

  if (diameterEmpty && countEmpty) {
    return {};
  }

  return {
    diameter: diameterEmpty
      ? "Fi jest wymagane."
      : getValueErrors(row.diameter, "Fi"),
    count: countEmpty
      ? "Ilosc jest wymagana."
      : getValueErrors(row.count, "Ilosc"),
  };
};

const getRectRowErrors = (row) => {
  const aEmpty = isEmptyValue(row.a);
  const bEmpty = isEmptyValue(row.b);
  const countEmpty = isEmptyValue(row.count);

  if (aEmpty && bEmpty && countEmpty) {
    return {};
  }

  return {
    a: aEmpty ? "Bok A jest wymagany." : getValueErrors(row.a, "Bok A"),
    b: bEmpty ? "Bok B jest wymagany." : getValueErrors(row.b, "Bok B"),
    count: countEmpty
      ? "Ilosc jest wymagana."
      : getValueErrors(row.count, "Ilosc"),
  };
};

export const getExtraOptionsErrors = (holes, rectHoles) => {
  const holeErrors = holes.map(getHoleRowErrors);
  const rectHoleErrors = rectHoles.map(getRectRowErrors);

  const hasHoleErrors = holeErrors.some((row) =>
    Object.values(row).some(Boolean),
  );
  const hasRectErrors = rectHoleErrors.some((row) =>
    Object.values(row).some(Boolean),
  );

  return {
    holeErrors,
    rectHoleErrors,
    hasErrors: hasHoleErrors || hasRectErrors,
  };
};
