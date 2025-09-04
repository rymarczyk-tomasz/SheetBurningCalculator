import React, { useEffect } from "react";
import ShapeSelector from "../ShapeSelector";
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
