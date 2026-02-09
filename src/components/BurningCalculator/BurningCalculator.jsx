import React from "react";
import ShapeSelector from "../ShapeSelector";
import Result from "../Result";
import ExtraOptions from "./ExtraOptions";
import GenericForm from "../GenericForm";
import { getFormErrors } from "../formValidation";
import { getBurningFields } from "./BurningCalculator.form";

export default function BurningCalculator({
  shape,
  setShape,
  length,
  setLength,
  width,
  setWidth,
  outerDiameter,
  setOuterDiameter,
  innerDiameter,
  setInnerDiameter,
  thickness,
  setThickness,
  totalLength,
  setTotalLength,
  holes,
  setHoles,
  rectHoles,
  setRectHoles,
  result,
  handleCalculate,
  handleClear,
  extraOptionsVisible,
  setExtraOptionsVisible,
}) {
  const fields = getBurningFields({
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

  const { errors, hasErrors } = getFormErrors(fields);

  return (
    <>
      <ShapeSelector shape={shape} setShape={setShape} isCutting={false} />

      <div className="options-toggle-group">
        <button type="button" onClick={() => setExtraOptionsVisible((v) => !v)}>
          {extraOptionsVisible ? "Ukryj" : "Dodatkowe opcje"}
        </button>
        {extraOptionsVisible && (
          <ExtraOptions
            holes={holes}
            setHoles={setHoles}
            rectHoles={rectHoles}
            setRectHoles={setRectHoles}
          />
        )}
      </div>

      <GenericForm fields={fields} errors={errors} />

      <button onClick={handleCalculate} disabled={hasErrors}>
        Oblicz
      </button>
      <button onClick={handleClear}>Wyczyść</button>
      <Result result={result} />
    </>
  );
}
