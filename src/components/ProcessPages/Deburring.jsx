import React, { useState, useEffect } from "react";
import ShapeSelector from "../ShapeSelector";
import Result from "../Result";
import ExtraOptions from "../BurningCalculator/ExtraOptions";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";
import { calculateRectangle } from "../../utils/calculateRectangle";
import { calculateCircle } from "../../utils/calculateCircle";
import { calculateSemiCircle } from "../../utils/calculateSemiCircle";
import { calculateTotalLength } from "../../utils/calculateTotalLength";
import GenericForm from "../GenericForm";

export default function Deburring() {
  const [shape, setShape] = useState("rectangle");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [outerDiameter, setOuterDiameter] = useState("");
  const [innerDiameter, setInnerDiameter] = useState("");
  const [totalLength, setTotalLength] = useState("");
  const [holes, setHoles] = useState([{ diameter: "", count: "" }]);
  const [rectHoles, setRectHoles] = useState([{ a: "", b: "", count: "" }]);
  const [extraOptionsVisible, setExtraOptionsVisible] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    setShape("rectangle");
    setLength("");
    setWidth("");
    setOuterDiameter("");
    setInnerDiameter("");
    setTotalLength("");
    setHoles([{ diameter: "", count: "" }]);
    setRectHoles([{ a: "", b: "", count: "" }]);
    setResult("");
  }, []);

  function handleCalculate() {
    const multiplier = 0.03;

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

    let extraLength = 0;
    holes.forEach(({ diameter, count }) => {
      const d = parseFloat(diameter);
      const c = parseInt(count);
      if (!isNaN(d) && d > 0 && !isNaN(c) && c > 0) {
        extraLength += Math.PI * d * c;
      }
    });
    rectHoles.forEach(({ a, b, count }) => {
      const aa = parseFloat(a);
      const bb = parseFloat(b);
      const c = parseInt(count);
      if (aa > 0 && bb > 0 && c > 0) {
        extraLength += 2 * (aa + bb) * c;
      }
    });

    if (extraLength > 0) {
      value += (extraLength / 1000) * multiplier;
    }

    setResult(`Czas gratowania: ${value.toFixed(2)} h`);
  }

  function handleClear() {
    setLength("");
    setWidth("");
    setOuterDiameter("");
    setInnerDiameter("");
    setTotalLength("");
    setHoles([{ diameter: "", count: "" }]);
    setRectHoles([{ a: "", b: "", count: "" }]);
    setResult("");
  }

  useKeyShortcuts({
    onEnter: handleCalculate,
    onEscape: handleClear,
  });

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
        ]}
      />
      <button onClick={handleCalculate}>Oblicz</button>
      <button onClick={handleClear}>Wyczyść</button>
      <Result result={result} />
    </>
  );
}
