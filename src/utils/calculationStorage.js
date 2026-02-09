const STORAGE_PREFIX = "sheetburning:calc:";

export const loadCalculation = (key) => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const saveCalculation = (key, data) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      `${STORAGE_PREFIX}${key}`,
      JSON.stringify(data),
    );
  } catch {
    // Ignore storage failures.
  }
};

export const clearCalculation = (key) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch {
    // Ignore storage failures.
  }
};
