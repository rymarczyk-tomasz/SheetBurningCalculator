import React from "react";
import useCalculatorForm from "../../hooks/useCalculatorForm";
import SharedShapeInputs from "../SharedShapeInputs";
import Result from "../Result";

export default function BurningCalculator() {
    const {
        shape,
        setShape,
        fields,
        setters,
        holes,
        setHoles,
        rectHoles,
        setRectHoles,
        extraOptionsVisible,
        setExtraOptionsVisible,
        result,
        handleCalculate,
        handleClear,
    } = useCalculatorForm(false);

    return (
        <>
            <SharedShapeInputs
                shape={shape}
                setShape={setShape}
                fields={fields}
                setters={setters}
                holes={holes}
                setHoles={setHoles}
                rectHoles={rectHoles}
                setRectHoles={setRectHoles}
                extraOptionsVisible={extraOptionsVisible}
                setExtraOptionsVisible={setExtraOptionsVisible}
                isWaterjet={false}
            />
            <button onClick={handleCalculate}>Oblicz</button>
            <button onClick={handleClear}>Wyczyść</button>
            <Result result={result} />
        </>
    );
}
