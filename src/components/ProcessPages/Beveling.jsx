import React, { useState, useEffect } from "react";
import ShapeSelector from "../ShapeSelector";
import Result from "../Result";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";
import { calculateRectangle } from "../../utils/calculateRectangle";
import { calculateCircle } from "../../utils/calculateCircle";
import { calculateSemiCircle } from "../../utils/calculateSemiCircle";
import { calculateTotalLength } from "../../utils/calculateTotalLength";
import GenericForm from "../GenericForm";
import { getFormErrors } from "../formValidation";
import { getBevelingFields, getBevelingSideFields } from "./Beveling.form";
import {
  clearCalculation,
  loadCalculation,
  saveCalculation,
} from "../../utils/calculationStorage";
import useSharedShape from "../../hooks/useSharedShape";

async function getBevelingMultiplier(thickness) {
  try {
    const response = await fetch("/SheetBurningCalculator/normatyw.csv");
    const text = await response.text();
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l);
    const header = lines[0].split(",").map((h) => h.trim());
    const idxThickness = header.indexOf("grubosc");
    const idxBeveling = header.indexOf("fazowanie");

    const values = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map((c) => c.trim());
      const t = parseFloat(cols[idxThickness]);
      const m = parseFloat(cols[idxBeveling]);
      if (!isNaN(t) && !isNaN(m)) {
        values.push({ t, m });
      }
    }

    for (const v of values) {
      if (v.t === thickness) return v.m;
    }

    let lower = null,
      upper = null;
    for (const v of values) {
      if (v.t < thickness) lower = v;
      if (v.t > thickness && !upper) upper = v;
    }
    if (lower && upper) {
      return (
        lower.m +
        ((upper.m - lower.m) * (thickness - lower.t)) / (upper.t - lower.t)
      );
    }

    if (lower) return lower.m;
    if (upper) return upper.m;
    return null;
  } catch {
    return null;
  }
}

export default function Beveling() {
  const [shape, setShape] = useSharedShape();
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [outerDiameter, setOuterDiameter] = useState("");
  const [innerDiameter, setInnerDiameter] = useState("");
  const [thickness, setThickness] = useState("");
  const [totalLength, setTotalLength] = useState("");
  const [result, setResult] = useState("");
  const [sideOption, setSideOption] = useState("single");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = loadCalculation("beveling");
    if (stored) {
      setLength(stored.length ?? "");
      setWidth(stored.width ?? "");
      setOuterDiameter(stored.outerDiameter ?? "");
      setInnerDiameter(stored.innerDiameter ?? "");
      setThickness(stored.thickness ?? "");
      setTotalLength(stored.totalLength ?? "");
      setResult(stored.result ?? "");
      setSideOption(stored.sideOption ?? "single");
      return;
    }

    setLength("");
    setWidth("");
    setOuterDiameter("");
    setInnerDiameter("");
    setThickness("");
    setTotalLength("");
    setResult("");
    setSideOption("single");
  }, []);

  async function handleCalculate() {
    const thicknessValue = parseFloat(thickness);
    if (isNaN(thicknessValue) || thicknessValue <= 0) {
      setResult("Proszę podać prawidłową grubość blachy.");
      return;
    }

    setLoading(true);
    const multiplier = await getBevelingMultiplier(thicknessValue);
    setLoading(false);

    if (!multiplier) {
      setResult("Brak normatywu dla podanej grubości.");
      return;
    }

    let value = 0;
    try {
      switch (shape) {
        case "rectangle":
          value = calculateRectangle(length, width, multiplier);
          break;
        case "circle":
          value = calculateCircle(outerDiameter, innerDiameter, multiplier);
          break;
        case "semicircle":
          value = calculateSemiCircle(outerDiameter, innerDiameter, multiplier);
          break;
        case "totalLength":
          value = calculateTotalLength(totalLength, multiplier);
          break;
        default:
          setResult("Nieobsługiwany kształt.");
          return;
      }
    } catch (err) {
      setResult(err.message);
      return;
    }

    if (sideOption === "double") {
      value = value * 2;
    }

    const message = `Czas fazowania (ukosowanie) (${sideOption === "single" ? "jednostronne" : "dwustronne"}): ${value.toFixed(2)} h`;
    saveCalculation("beveling", {
      shape,
      length,
      width,
      outerDiameter,
      innerDiameter,
      thickness,
      totalLength,
      sideOption,
      result: message,
    });
    setResult(message);
  }

  function handleClear() {
    setLength("");
    setWidth("");
    setOuterDiameter("");
    setInnerDiameter("");
    setThickness("");
    setTotalLength("");
    setResult("");
    setSideOption("single");
    clearCalculation("beveling");
  }

  useKeyShortcuts({
    onEnter: handleCalculate,
    onEscape: handleClear,
  });

  const sideFields = getBevelingSideFields({ sideOption, setSideOption });
  const mainFields = getBevelingFields({
    shape,
    length,
    setLength,
    width,
    setWidth,
    outerDiameter,
    setOuterDiameter,
    innerDiameter,
    setInnerDiameter,
    totalLength,
    setTotalLength,
    thickness,
    setThickness,
  });

  const { errors: sideErrors, hasErrors: sideHasErrors } =
    getFormErrors(sideFields);
  const { errors: mainErrors, hasErrors: mainHasErrors } =
    getFormErrors(mainFields);
  const hasErrors = sideHasErrors || mainHasErrors;

  return (
    <>
      <GenericForm
        fields={sideFields}
        errors={sideErrors}
        hasErrors={hasErrors}
        onSubmit={handleCalculate}
      />
      <ShapeSelector shape={shape} setShape={setShape} isCutting={false} />
      <GenericForm
        fields={mainFields}
        errors={mainErrors}
        hasErrors={hasErrors}
        onSubmit={handleCalculate}
      />
      <button onClick={handleCalculate} disabled={loading || hasErrors}>
        {loading ? "Obliczanie..." : "Oblicz"}
      </button>
      <button onClick={handleClear}>Wyczyść</button>
      <Result result={result} />
    </>
  );
}
