import { useState } from "react";
import ShapeSelector from "../ShapeSelector";
import ShapeDimensionFields from "../ShapeDimensionFields";
import InputField from "../InputField";
import Result from "../Result";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";
import { calculateByShape } from "../../utils/calculateByShape";

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

    function handleCalculate() {
        const thicknessValue = parseFloat(thickness);
        if (isNaN(thicknessValue) || thicknessValue <= 0) {
            setResult("Proszę podać prawidłową grubość blachy.");
            return;
        }

        const multiplier = 0.2;

        let value = 0;
        try {
            value = calculateByShape(
                shape,
                { length, width, outerDiameter, innerDiameter, totalLength },
                multiplier,
            );
        } catch (err) {
            setResult(err.message);
            return;
        }

        if (sideOption === "double") {
            value = value * 2;
        }

        setResult(
            `Czas fazowania (frezowanie) (${sideOption === "single" ? "jednostronne" : "dwustronne"}): ${value.toFixed(2)} h`,
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
            <ShapeDimensionFields
                shape={shape}
                length={length}
                setLength={setLength}
                width={width}
                setWidth={setWidth}
                outerDiameter={outerDiameter}
                setOuterDiameter={setOuterDiameter}
                innerDiameter={innerDiameter}
                setInnerDiameter={setInnerDiameter}
                totalLength={totalLength}
                setTotalLength={setTotalLength}
            />
            <InputField
                id="thickness"
                label="Wielkość fazy (mm):"
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                placeholder="Wpisz wielkość fazy w mm"
            />
            <button onClick={handleCalculate}>Oblicz</button>
            <button onClick={handleClear}>Wyczyść</button>
            <Result result={result} />
        </>
    );
}
