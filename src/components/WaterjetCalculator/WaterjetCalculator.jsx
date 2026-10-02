import { useState, useEffect } from "react";
import ShapeSelector from "../ShapeSelector";
import ShapeDimensionFields from "../ShapeDimensionFields";
import InputField from "../InputField";
import Result from "../Result";
import ExtraOptions from "../BurningCalculator/ExtraOptions";

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
    result,
    handleCalculate,
    handleClear,
}) {
    const [extraOptionsVisible, setExtraOptionsVisible] = useState(false);

    useEffect(() => {
        if (shape !== "rectangle") {
            setShape("rectangle");
        }
    }, []);

    return (
        <>
            <div className="waterjet-type-group">
                <label>
                    <input
                        type="radio"
                        value="czarna"
                        checked={waterjetType === "czarna"}
                        onChange={() => setWaterjetType("czarna")}
                    />
                    Blacha czarna
                </label>
                <label>
                    <input
                        type="radio"
                        value="nierdzewka"
                        checked={waterjetType === "nierdzewka"}
                        onChange={() => setWaterjetType("nierdzewka")}
                    />
                    Blacha nierdzewna
                </label>
            </div>

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
