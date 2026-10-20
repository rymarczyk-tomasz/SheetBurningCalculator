import { useState } from "react";
import InputField from "../InputField";
import CalculatorActions from "../CalculatorActions";
import Result from "../Result";
import useCalculation from "../../hooks/useCalculation";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";
import { sawCalculator } from "../../utils/calculators/sawCalculator";

export default function SawCalculator() {
    const [diameter, setDiameter] = useState("");
    const { result, run, clearResult, pending } = useCalculation();

    const handleCalculate = () => run(() => sawCalculator({ diameter }));

    const handleClear = () => {
        setDiameter("");
        clearResult();
    };

    useKeyShortcuts({ onEnter: handleCalculate, onEscape: handleClear });

    return (
        <>
            <InputField
                label="Średnica pręta lub fi zew. rury (mm):"
                value={diameter}
                onChange={setDiameter}
                placeholder="Wpisz średnicę w mm"
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
