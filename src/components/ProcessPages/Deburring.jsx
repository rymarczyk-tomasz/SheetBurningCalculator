import { useState } from "react";
import ShapeSelector from "../ShapeSelector";
import ShapeDimensionFields from "../ShapeDimensionFields";
import Result from "../Result";
import ExtraOptions from "../BurningCalculator/ExtraOptions";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";
import { calculateByShape } from "../../utils/calculateByShape";

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

    function handleCalculate() {
        const multiplier = 0.03;

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

        let extraLength = 0;
        holes.forEach(({ diameter, count }) => {
            const d = parseFloat(diameter);
            const c = parseInt(count, 10);
            if (!isNaN(d) && d > 0 && !isNaN(c) && c > 0) {
                extraLength += Math.PI * d * c;
            }
        });
        rectHoles.forEach(({ a, b, count }) => {
            const aa = parseFloat(a);
            const bb = parseFloat(b);
            const c = parseInt(count, 10);
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
            <ShapeSelector
                shape={shape}
                setShape={setShape}
                isCutting={false}
            />
            <div className="options-toggle-group">
                <button
                    type="button"
                    onClick={() => setExtraOptionsVisible((v) => !v)}
                >
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
            <button onClick={handleCalculate}>Oblicz</button>
            <button onClick={handleClear}>Wyczyść</button>
            <Result result={result} />
        </>
    );
}
