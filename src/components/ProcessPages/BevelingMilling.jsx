import React, { useState, useEffect } from "react";
import ShapeSelector from "../ShapeSelector";
import InputField from "../InputField";
import Result from "../Result";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";
import { calculateRectangle } from "../../utils/calculateRectangle";
import { calculateCircle } from "../../utils/calculateCircle";
import { calculateSemiCircle } from "../../utils/calculateSemiCircle";
import { calculateTotalLength } from "../../utils/calculateTotalLength";

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
                    value = calculateCircle(
                        outerDiameter,
                        innerDiameter,
                        multiplier
                    );
                    break;
                case "semicircle":
                    value = calculateSemiCircle(
                        outerDiameter,
                        innerDiameter,
                        multiplier
                    );
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

        setResult(
            `Czas fazowania (frezowanie) (${sideOption === "single" ? "jednostronne" : "dwustronne"}): ${value.toFixed(2)} h`
        );
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
    }

    useKeyShortcuts({
        onEnter: handleCalculate,
        onEscape: handleClear,
    });

    return (
        <>
            <div className="beveling-side-group">
                <label className="beveling-side-label">
                    <input
                        type="radio"
                        name="sideOption"
                        value="single"
                        checked={sideOption === "single"}
                        onChange={() => setSideOption("single")}
                    />
                    Jednostronne
                </label>
                <label className="beveling-side-label">
                    <input
                        type="radio"
                        name="sideOption"
                        value="double"
                        checked={sideOption === "double"}
                        onChange={() => setSideOption("double")}
                    />
                    Dwustronne
                </label>
            </div>
            <ShapeSelector
                shape={shape}
                setShape={setShape}
                isCutting={false}
            />
            {shape === "rectangle" && (
                <>
                    <InputField
                        id="length"
                        label="Długość boku A (mm):"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        placeholder="Wpisz wymiar w mm"
                    />
                    <InputField
                        id="width"
                        label="Długość boku B (mm):"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        placeholder="Wpisz wymiar w mm"
                    />
                </>
            )}
            {(shape === "circle" || shape === "semicircle") && (
                <>
                    <InputField
                        id="outerDiameter"
                        label="Fi zewnętrzne (mm):"
                        value={outerDiameter}
                        onChange={(e) => setOuterDiameter(e.target.value)}
                        placeholder="Wpisz wymiar w mm"
                    />
                    <InputField
                        id="innerDiameter"
                        label="Fi wewnętrzne (mm):"
                        value={innerDiameter}
                        onChange={(e) => setInnerDiameter(e.target.value)}
                        placeholder="Wpisz wymiar w mm"
                    />
                </>
            )}
            {shape === "totalLength" && (
                <InputField
                    id="totalLength"
                    label="Całkowita długość boków (mm):"
                    value={totalLength}
                    onChange={(e) => setTotalLength(e.target.value)}
                    placeholder="Wpisz całkowitą długość w mm"
                />
            )}
            <InputField
                id="thickness"
                label="Grubość blachy (mm):"
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                placeholder="Wpisz grubość w mm"
            />
            <button onClick={handleCalculate}>Oblicz</button>
            <button onClick={handleClear}>Wyczyść</button>
            <Result result={result} />
        </>
    );
}
