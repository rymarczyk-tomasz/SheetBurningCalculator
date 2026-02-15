import React, { useState, useEffect } from "react";
import Result from "../Result";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";
import GenericForm from "../GenericForm";
import { getFormErrors } from "../formValidation";
import { getStraighteningFields } from "./Straightening.form";
import {
  clearCalculation,
  loadCalculation,
  saveCalculation,
} from "../../utils/calculationStorage";

export default function Straightening() {
  const [length, setLength] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    const stored = loadCalculation("straightening");
    if (stored) {
      setLength(stored.length ?? "");
      setResult(stored.result ?? "");
      return;
    }

    setLength("");
    setResult("");
  }, []);

  function handleCalculate() {
    const lengthValue = parseFloat(length);

    if (isNaN(lengthValue) || lengthValue <= 0) {
      setResult("Proszę podać prawidłową długość.");
      return;
    }

    const lengthInMeters = lengthValue / 1000;
    const multiplier = 0.1;
    const value = lengthInMeters * multiplier;

    const message = `Czas prostowania: ${value.toFixed(2)} h`;
    saveCalculation("straightening", { length, result: message });
    setResult(message);
  }

  function handleClear() {
    setLength("");
    setResult("");
    clearCalculation("straightening");
  }

  useKeyShortcuts({
    onEnter: handleCalculate,
    onEscape: handleClear,
  });

  const fields = getStraighteningFields({ length, setLength });
  const { errors, hasErrors } = getFormErrors(fields);

  return (
    <>
      <GenericForm
        fields={fields}
        errors={errors}
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
