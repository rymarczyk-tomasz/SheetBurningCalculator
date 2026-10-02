import { useState } from "react";
import ShapeSelector from "../ShapeSelector";
import ShapeDimensionFields from "../ShapeDimensionFields";
import InputField from "../InputField";
import Result from "../Result";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";
import { calculateByShape } from "../../utils/calculateByShape";

import { getNormatywMultiplier } from "../../utils/getNormatywMultiplier";

export default function GrindingAfterBurning() {
    const [shape, setShape] = useState("rectangle");
    const [length, setLength] = useState("");
    const [width, setWidth] = useState("");
    const [outerDiameter, setOuterDiameter] = useState("");
    const [innerDiameter, setInnerDiameter] = useState("");
    const [thickness, setThickness] = useState("");
    const [totalLength, setTotalLength] = useState("");
    const [result, setResult] = useState("");
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
            "szlifowanie",
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

        setResult(`Czas szlifowania po paleniu: ${value.toFixed(2)} h`);
    }

    function handleClear() {
        setLength("");
        setWidth("");
        setOuterDiameter("");
        setInnerDiameter("");
        setThickness("");
        setTotalLength("");
        setResult("");
    }

    useKeyShortcuts({
        onEnter: handleCalculate,
        onEscape: handleClear,
    });

    return (
        <>
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
                label="Grubość blachy (mm):"
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                placeholder="Wpisz grubość w mm"
            />
            <button onClick={handleCalculate} disabled={loading}>
                {loading ? "Obliczanie..." : "Oblicz"}
            </button>
            <button onClick={handleClear}>Wyczyść</button>
            <Result result={result} />
        </>
    );
}
