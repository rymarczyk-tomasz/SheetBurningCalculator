import { useEffect, useState } from "react";
import GenericForm from "../GenericForm";
import { getFormErrors } from "../formValidation";
import { getSawFields } from "./SawCalculator.form";
import { sawCalculator } from "../../utils/calculators/sawCalculator";
import {
  clearCalculation,
  loadCalculation,
  saveCalculation,
} from "../../utils/calculationStorage";
import Result from "../Result";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";

const STORAGE_KEY = "app:saw";

export default function SawCalculator() {
  const [cutType, setCutType] = useState("rod");
  const [rodDiameter, setRodDiameter] = useState("");
  const [pipeOuterDiameter, setPipeOuterDiameter] = useState("");
  const [result, setResult] = useState({});

  useEffect(() => {
    const stored = loadCalculation(STORAGE_KEY);
    if (stored) {
      setCutType(stored.cutType ?? "rod");
      setRodDiameter(stored.rodDiameter ?? "");
      setPipeOuterDiameter(stored.pipeOuterDiameter ?? "");
      setResult(stored.result ?? {});
    }
  }, []);

  const handleCalculate = () => {
    const message = sawCalculator({
      cutType,
      rodDiameter,
      pipeOuterDiameter,
    });

    saveCalculation(STORAGE_KEY, {
      cutType,
      rodDiameter,
      pipeOuterDiameter,
      result: message,
    });

    setResult(message);
  };

  const handleClear = () => {
    clearCalculation(STORAGE_KEY);
    setCutType("rod");
    setRodDiameter("");
    setPipeOuterDiameter("");
    setResult({});
  };

  useKeyShortcuts({
    onEnter: handleCalculate,
    onEscape: handleClear,
  });

  const fields = getSawFields({
    cutType,
    setCutType,
    rodDiameter,
    setRodDiameter,
    pipeOuterDiameter,
    setPipeOuterDiameter,
  });
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
