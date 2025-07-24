import React from "react";
import ShapeSelector from "../ShapeSelector";
import InputField from "../InputField";
import Result from "../Result";

export default function SawCalculator({
    shape,
    setShape,
    rodDiameter,
    setRodDiameter,
    pipeOuterDiameter,
    setPipeOuterDiameter,
    handleCalculate,
    handleClear,
    result,
}) {
    return (
        <>
            <ShapeSelector shape={shape} setShape={setShape} isCutting={true} />

            {shape === "rod" && (
                <InputField
                    id="rodDiameter"
                    label="Fi pręta (mm):"
                    value={rodDiameter}
                    onChange={(e) => setRodDiameter(e.target.value)}
                    placeholder="Wpisz średnicę pręta w mm"
                />
            )}

            {shape === "pipe" && (
                <InputField
                    id="pipeOuterDiameter"
                    label="Fi zewnętrzne rury (mm):"
                    value={pipeOuterDiameter}
                    onChange={(e) => setPipeOuterDiameter(e.target.value)}
                    placeholder="Wpisz fi zewnętrzne rury w mm"
                />
            )}

            <button onClick={handleCalculate}>Oblicz</button>
            <button onClick={handleClear}>Wyczyść</button>
            <Result result={result} />
        </>
    );
}
