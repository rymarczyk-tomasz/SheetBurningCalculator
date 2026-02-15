import { useEffect, useState } from "react";

const SHARED_SHAPE_KEY = "app:sharedShape";

const readSharedShape = (defaultShape) => {
  if (typeof window === "undefined") {
    return defaultShape;
  }

  try {
    return window.localStorage.getItem(SHARED_SHAPE_KEY) || defaultShape;
  } catch {
    return defaultShape;
  }
};

export default function useSharedShape(defaultShape = "rectangle") {
  const [shape, setShape] = useState(() => readSharedShape(defaultShape));

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(SHARED_SHAPE_KEY, shape);
    } catch {
      return;
    }
  }, [shape]);

  return [shape, setShape];
}
