import { useState } from "react";
import ShapeSelector from "../ShapeSelector";
import ShapeDimensionFields from "../ShapeDimensionFields";
import InputField from "../InputField";
import Result from "../Result";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";
import { calculateByShape } from "../../utils/calculateByShape";

import { getNormatywMultiplier } from "../../utils/getNormatywMultiplier";

export default function Beveling() {
    const [shape, setShape] = useState("rectangle");
    const [length, setLength] = useState("");
    const [width, setWidth] = useState("");
    const [outerDiameter, setOuterDiameter] = useState("");
    const [innerDiameter, setInnerDiameter] = useState("");
    const [thickness, setThickness] = useState("");
    const [totalLength, setTotalLength] = useState("");
    const [result, setResult] = useState("");
    const [sideOption, setSideOption] = useState("single");
    const [loading, setLoading] = useState(false);

    async function handleCalculate() {
        const thicknessValue = parseFloat(thickness);
        if (isNaN(thicknessValue) || thicknessValue <= 0) {
            setResult("Proszę podać prawidłową grubość blachy.");
            return;
        }

        setLoading(true);
        const multiplier = await getNormatywMultiplier(
            thicknessValue,
            "fazowanie",
        );
        setLoading(false);

        if (!multiplier) {
            setResult("Brak normatywu dla podanej grubości.");
            return;
        }

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
            `Czas fazowania (ukosowanie) (${sideOption === "single" ? "jednostronne" : "dwustronne"}): ${value.toFixed(2)} h`,
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
                label="Wielkosć fazy (mm):"
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                placeholder="Wpisz wielkość fazu w mm"
            />
            <button onClick={handleCalculate} disabled={loading}>
                {loading ? "Obliczanie..." : "Oblicz"}
            </button>
            <button onClick={handleClear}>Wyczyść</button>
            <Result result={result} />
        </>
    );
}
