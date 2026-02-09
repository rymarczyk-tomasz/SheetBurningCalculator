import React, { useEffect } from "react";
import ShapeSelector from "../ShapeSelector";
import Result from "../Result";
import ExtraOptions from "../BurningCalculator/ExtraOptions";
import GenericForm from "../GenericForm";

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

  return (
    <>
      <GenericForm
        fields={[
          {
            id: "waterjetType",
            type: "radio",
            value: waterjetType,
            onChange: (value) => setWaterjetType(value),
            wrapperClassName: "waterjet-type-group",
            options: [
              {
                value: "czarna",
                label: "Blacha czarna",
              },
              {
                value: "nierdzewka",
                label: "Blacha nierdzewna",
              },
            ],
          },
        ]}
      />

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

      <GenericForm
        fields={[
          {
            id: "length",
            label: "Długość boku A (mm):",
            value: length,
            onChange: (e) => setLength(e.target.value),
            placeholder: "Wpisz wymiar w mm",
            showWhen: () => shape === "rectangle",
          },
          {
            id: "width",
            label: "Długość boku B (mm):",
            value: width,
            onChange: (e) => setWidth(e.target.value),
            placeholder: "Wpisz wymiar w mm",
            showWhen: () => shape === "rectangle",
          },
          {
            id: "outerDiameter",
            label: "Fi zewnętrzne (mm):",
            value: outerDiameter,
            onChange: (e) => setOuterDiameter(e.target.value),
            placeholder: "Wpisz wymiar w mm",
            showWhen: () => shape === "circle" || shape === "semicircle",
          },
          {
            id: "innerDiameter",
            label: "Fi wewnętrzne (mm):",
            value: innerDiameter,
            onChange: (e) => setInnerDiameter(e.target.value),
            placeholder: "Wpisz wymiar w mm",
            showWhen: () => shape === "circle" || shape === "semicircle",
          },
          {
            id: "totalLength",
            label: "Całkowita długość boków (mm):",
            value: totalLength,
            onChange: (e) => setTotalLength(e.target.value),
            placeholder: "Wpisz całkowitą długość w mm",
            showWhen: () => shape === "totalLength",
          },
          {
            id: "thickness",
            label: "Grubość blachy (mm):",
            value: thickness,
            onChange: (e) => setThickness(e.target.value),
            placeholder: "Wpisz grubość w mm",
          },
        ]}
      />

      <button onClick={handleCalculate}>Oblicz</button>
      <button onClick={handleClear}>Wyczyść</button>
      <Result result={result} />
    </>
  );
}
