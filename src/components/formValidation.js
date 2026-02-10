import { isEmptyValue, parseNumberValue } from "../utils/numberParsing";

export { isEmptyValue, parseNumberValue };

export const requiredNumber = () => (value) => {
  if (isEmptyValue(value)) {
    return "Wymagane pole.";
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

export const optionalNumber = () => (value) => {
  if (isEmptyValue(value)) {
    return null;
  }

  const parsed = parseNumberValue(value);
  if (isNaN(parsed)) {
    return "Wpisz poprawna wartosc.";
  }

  if (parsed < 0) {
    return "Wpisz nieujemna wartosc.";
  }

  return null;
};

export const optionalPositiveNumber = () => (value) => {
  if (isEmptyValue(value)) {
    return null;
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

export const requiredText = () => (value) => {
  if (isEmptyValue(value)) {
    return "Wymagane pole.";
  }

  return null;
};

const resolveShowWhen = (showWhen) => {
  if (typeof showWhen === "function") {
    return Boolean(showWhen());
  }

  if (showWhen === undefined) {
    return true;
  }

  return Boolean(showWhen);
};

export const getVisibleFields = (fields) =>
  fields.filter((field) => resolveShowWhen(field.showWhen));

export const getFieldError = (field) => {
  if (field.validate) {
    return field.validate(field.value, field) || null;
  }

  if (field.required && isEmptyValue(field.value)) {
    return "Wymagane pole.";
  }

  return null;
};

export const getFormErrors = (fields) => {
  const visibleFields = getVisibleFields(fields);
  const errors = {};

  visibleFields.forEach((field) => {
    const error = getFieldError(field);
    if (error) {
      errors[field.id] = error;
    }
  });

  return {
    errors,
    hasErrors: Object.keys(errors).length > 0,
  };
};
