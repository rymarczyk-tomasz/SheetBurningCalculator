import { useState } from "react";
import ShapeSelector from "../ShapeSelector";
import ShapeDimensionFields from "../ShapeDimensionFields";
import InputField from "../InputField";
import CalculatorActions from "../CalculatorActions";
import Result from "../Result";
import useShapeDimensions from "../../hooks/useShapeDimensions";
import useCalculation from "../../hooks/useCalculation";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";
import { UserError } from "../../utils/errors";
import { getPerimeterTime } from "../../utils/geometry";
import { getNormatywMultiplier } from "../../utils/getNormatywMultiplier";
import { parsePositive } from "../../utils/parseNumber";
import { timeResultLine } from "../../utils/resultLine";

export default function GrindingAfterBurning() {
    const { shape, setShape, dims, setDim, resetDims } = useShapeDimensions();
    const [thickness, setThickness] = useState("");
    const { result, run, clearResult, pending } = useCalculation();

    const handleCalculate = () =>
        run(async () => {
            const thicknessValue = parsePositive(
                thickness,
                "Proszę podać prawidłową grubość blachy.",
            );
            const multiplier = await getNormatywMultiplier(
                thicknessValue,
                "szlifowanie",
            );
            if (!multiplier) {
                throw new UserError("Brak normatywu dla podanej grubości.");
            }

            const hours = getPerimeterTime({ shape, dims }, multiplier);
            const time = hours.toFixed(2);
            return timeResultLine(`Czas szlifowania po paleniu: ${time} h`, time);
        });

    const handleClear = () => {
        resetDims();
        setThickness("");
        clearResult();
    };

    useKeyShortcuts({ onEnter: handleCalculate, onEscape: handleClear });

    return (
        <>
            <ShapeSelector shape={shape} setShape={setShape} />
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
