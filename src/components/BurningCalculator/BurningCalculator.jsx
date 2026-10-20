import { useState } from "react";
import ShapeSelector from "../ShapeSelector";
import ShapeDimensionFields from "../ShapeDimensionFields";
import HolesOptions from "../HolesOptions";
import InputField from "../InputField";
import CalculatorActions from "../CalculatorActions";
import Result from "../Result";
import useShapeDimensions from "../../hooks/useShapeDimensions";
import useHoles from "../../hooks/useHoles";
import useCalculation from "../../hooks/useCalculation";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";
import { burningCalculator } from "../../utils/calculators/burningCalculator";

export default function BurningCalculator() {
    const { shape, setShape, dims, setDim, resetDims } = useShapeDimensions();
    const { holes, setHoles, rectHoles, setRectHoles, resetHoles } = useHoles();
    const [thickness, setThickness] = useState("");
    const { result, run, clearResult, pending } = useCalculation();

    const handleCalculate = () =>
        run(() =>
            burningCalculator({ shape, dims, thickness, holes, rectHoles }),
        );

    const handleClear = () => {
        resetDims();
        resetHoles();
        setThickness("");
        clearResult();
    };

    useKeyShortcuts({ onEnter: handleCalculate, onEscape: handleClear });

    return (
        <>
            <ShapeSelector shape={shape} setShape={setShape} />
            <HolesOptions
                holes={holes}
                setHoles={setHoles}
                rectHoles={rectHoles}
                setRectHoles={setRectHoles}
            />
            <ShapeDimensionFields shape={shape} dims={dims} setDim={setDim} />
            <InputField
                label="Grubość blachy (mm):"
                value={thickness}
                onChange={setThickness}
                placeholder="Wpisz grubość w mm"
            />
            <CalculatorActions
                onCalculate={handleCalculate}
                onClear={handleClear}
                pending={pending}
            />
            <Result result={result} />
        </>
    );
}
