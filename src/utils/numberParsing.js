export const isEmptyValue = (value) => {
  if (value === null || value === undefined) {
    return true;
  }

  return String(value).trim() === "";
};

export const parseNumberValue = (value) => {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value !== "string") {
    return NaN;
  }

  const normalized = value.trim().replace(",", ".");
  if (normalized === "") {
    return NaN;
  }

  return Number.parseFloat(normalized);
};
