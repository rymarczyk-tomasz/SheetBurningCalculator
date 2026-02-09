import React, { useEffect } from "react";
import ShapeSelector from "../ShapeSelector";
import Result from "../Result";
import ExtraOptions from "../BurningCalculator/ExtraOptions";
import GenericForm from "../GenericForm";
import { getFormErrors } from "../formValidation";
import {
  getWaterjetFields,
  getWaterjetTypeFields,
} from "./WaterjetCalculator.form";

export default function WaterjetCalculator({
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
  waterjetType,
  setWaterjetType,
  holes,
  setHoles,
  rectHoles,
  setRectHoles,
  extraOptionsVisible,
  setExtraOptionsVisible,
  result,
  handleCalculate,
  handleClear,
}) {
  useEffect(() => {
    if (shape !== "rectangle") {
      setShape("rectangle");
    }
  }, []);

  const typeFields = getWaterjetTypeFields({ waterjetType, setWaterjetType });
  const mainFields = getWaterjetFields({
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

  const { errors: typeErrors } = getFormErrors(typeFields);
  const { errors: mainErrors, hasErrors: mainHasErrors } =
    getFormErrors(mainFields);
  const hasErrors = mainHasErrors || Object.keys(typeErrors).length > 0;

  return (
    <>
      <GenericForm fields={typeFields} errors={typeErrors} />

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

      <GenericForm fields={mainFields} errors={mainErrors} />

      <button onClick={handleCalculate} disabled={hasErrors}>
        Oblicz
      </button>
      <button onClick={handleClear}>Wyczyść</button>
      <Result result={result} />
    </>
  );
}
