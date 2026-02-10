import { useEffect, useRef, useState } from "react";
import ShapeSelector from "../ShapeSelector";
import Result from "../Result";
import ExtraOptions from "../BurningCalculator/ExtraOptions";
import GenericForm from "../GenericForm";
import { getFormErrors } from "../formValidation";
import {
  getWaterjetFields,
  getWaterjetTypeFields,
} from "./WaterjetCalculator.form";
import { waterjetCalculator } from "../../utils/calculators/waterjetCalculator";
import { getExtraOptionsErrors } from "../../utils/validateExtraOptions";
import {
  clearCalculation,
  loadCalculation,
  saveCalculation,
} from "../../utils/calculationStorage";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";

const STORAGE_KEY = "app:waterjet";

export default function WaterjetCalculator() {
  const restoringRef = useRef(false);
  const [shape, setShape] = useState("rectangle");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [outerDiameter, setOuterDiameter] = useState("");
  const [innerDiameter, setInnerDiameter] = useState("");
  const [thickness, setThickness] = useState("");
  const [totalLength, setTotalLength] = useState("");
  const [waterjetType, setWaterjetType] = useState("czarna");
  const [holes, setHoles] = useState([{ diameter: "", count: "" }]);
  const [rectHoles, setRectHoles] = useState([{ a: "", b: "", count: "" }]);
  const [extraOptionsVisible, setExtraOptionsVisible] = useState(false);
  const [result, setResult] = useState("");

  const clearFields = () => {
    setLength("");
    setWidth("");
    setOuterDiameter("");
    setInnerDiameter("");
    setThickness("");
    setTotalLength("");
    setHoles([{ diameter: "", count: "" }]);
    setRectHoles([{ a: "", b: "", count: "" }]);
    setResult("");
  };

  useEffect(() => {
    const stored = loadCalculation(STORAGE_KEY);
    if (stored) {
      restoringRef.current = true;
      setShape(stored.shape || "rectangle");
      setLength(stored.length ?? "");
      setWidth(stored.width ?? "");
      setOuterDiameter(stored.outerDiameter ?? "");
      setInnerDiameter(stored.innerDiameter ?? "");
      setThickness(stored.thickness ?? "");
      setTotalLength(stored.totalLength ?? "");
      setWaterjetType(stored.waterjetType ?? "czarna");
      setHoles(stored.holes ?? [{ diameter: "", count: "" }]);
      setRectHoles(stored.rectHoles ?? [{ a: "", b: "", count: "" }]);
      setResult(stored.result ?? "");
    }
  }, []);

  useEffect(() => {
    if (restoringRef.current) {
      restoringRef.current = false;
      return;
    }

    clearFields();
  }, [shape]);

  const handleCalculate = () => {
    const message = waterjetCalculator({
      shape,
      length,
      width,
      outerDiameter,
      innerDiameter,
      totalLength,
      thickness,
      holes,
      rectHoles,
      waterjetType,
    });

    saveCalculation(STORAGE_KEY, {
      shape,
      length,
      width,
      outerDiameter,
      innerDiameter,
      thickness,
      totalLength,
      holes,
      rectHoles,
      waterjetType,
      result: message,
    });

    setResult(message);
  };

  const handleClear = () => {
    clearCalculation(STORAGE_KEY);
    clearFields();
  };

  useKeyShortcuts({
    onEnter: handleCalculate,
    onEscape: handleClear,
  });

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
  const {
    holeErrors,
    rectHoleErrors,
    hasErrors: extraHasErrors,
  } = getExtraOptionsErrors(holes, rectHoles);
  const hasErrors =
    mainHasErrors || Object.keys(typeErrors).length > 0 || extraHasErrors;

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
            holeErrors={holeErrors}
            rectHoleErrors={rectHoleErrors}
          />
        )}
      </div>

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
