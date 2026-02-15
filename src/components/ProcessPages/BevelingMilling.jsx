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
import {
  getBevelingMillingFields,
  getBevelingMillingSideFields,
} from "./BevelingMilling.form";
import {
  clearCalculation,
  loadCalculation,
  saveCalculation,
} from "../../utils/calculationStorage";

export default function BevelingMilling() {
  const [shape, setShape] = useState("rectangle");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [outerDiameter, setOuterDiameter] = useState("");
  const [innerDiameter, setInnerDiameter] = useState("");
  const [thickness, setThickness] = useState("");
  const [totalLength, setTotalLength] = useState("");
  const [result, setResult] = useState("");
  const [sideOption, setSideOption] = useState("single");

  useEffect(() => {
    const stored = loadCalculation("bevelingMilling");
    if (stored) {
      setShape(stored.shape ?? "rectangle");
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

    setShape("rectangle");
    setLength("");
    setWidth("");
    setOuterDiameter("");
    setInnerDiameter("");
    setThickness("");
    setTotalLength("");
    setResult("");
    setSideOption("single");
  }, []);

  function handleCalculate() {
    const thicknessValue = parseFloat(thickness);
    if (isNaN(thicknessValue) || thicknessValue <= 0) {
      setResult("Proszę podać prawidłową grubość blachy.");
      return;
    }

    const multiplier = 0.2;

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

    const message = `Czas fazowania (frezowanie) (${sideOption === "single" ? "jednostronne" : "dwustronne"}): ${value.toFixed(2)} h`;
    saveCalculation("bevelingMilling", {
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
    clearCalculation("bevelingMilling");
  }

  useKeyShortcuts({
    onEnter: handleCalculate,
    onEscape: handleClear,
  });

  const sideFields = getBevelingMillingSideFields({
    sideOption,
    setSideOption,
  });
  const mainFields = getBevelingMillingFields({
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
      <button onClick={handleCalculate} disabled={hasErrors}>
        Oblicz
      </button>
      <button onClick={handleClear}>Wyczyść</button>
      <Result result={result} />
    </>
  );
}
