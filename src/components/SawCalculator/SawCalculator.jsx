import React, { useState } from "react";
import InputField from "../InputField";
import Result from "../Result";

export default function SawCalculator({
    rodDiameter,
    setRodDiameter,
    pipeOuterDiameter,
    setPipeOuterDiameter,
    handleCalculate,
    handleClear,
    result,
}) {
    const [shape, setShape] = useState("rod");

    return (
        <>
            <div className="form-group">
                <label htmlFor="shape">
                    Wybierz kształt ciętego materiału:
                </label>
                <select
                    id="shape"
                    value={shape}
                    onChange={(e) => setShape(e.target.value)}
                >
                    <option value="rod">Pręt</option>
                    <option value="pipe">Rura</option>
                </select>
            </div>

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
