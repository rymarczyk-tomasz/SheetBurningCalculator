import React from "react";
import GenericForm from "../GenericForm";
import { getFormErrors } from "../formValidation";
import { getSawFields } from "./SawCalculator.form";

export default function SawCalculator({
  rodDiameter,
  setRodDiameter,
  pipeOuterDiameter,
  setPipeOuterDiameter,
  handleCalculate,
  handleClear,
  result,
}) {
  const fields = getSawFields({ rodDiameter, setRodDiameter });
  const { errors, hasErrors } = getFormErrors(fields);

  return (
    <>
      <GenericForm fields={fields} errors={errors} />

      <button onClick={handleCalculate} disabled={hasErrors}>
        Oblicz
      </button>
      <button onClick={handleClear}>Wyczyść</button>
      <>
        {result.rodResult && <p>{result.rodResult}</p>}
        {result.pipeResult && <p>{result.pipeResult}</p>}
      </>
    </>
  );
}
