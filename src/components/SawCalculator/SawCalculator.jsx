import React from "react";
import InputField from "../InputField";

export default function SawCalculator({
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
            <InputField
                id="diameter"
                label="Wpisz średnicę pręta lub fi zew. rury w mm:"
                value={rodDiameter}
                onChange={(e) => setRodDiameter(e.target.value)}
                placeholder="Wpisz średnicę pręta lub fi zew. rury w mm"
            />

            <button onClick={handleCalculate}>Oblicz</button>
            <button onClick={handleClear}>Wyczyść</button>
            <>
                {result.rodResult && <p>{result.rodResult}</p>}
                {result.pipeResult && <p>{result.pipeResult}</p>}
            </>
        </>
    );
}
