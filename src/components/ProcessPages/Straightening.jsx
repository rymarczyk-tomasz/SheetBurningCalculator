import { useState } from "react";
import InputField from "../InputField";
import CalculatorActions from "../CalculatorActions";
import Result from "../Result";
import useCalculation from "../../hooks/useCalculation";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";
import { parsePositive } from "../../utils/parseNumber";
import { timeResultLine } from "../../utils/resultLine";

/** Mnożnik prostowania [h/m]. */
const STRAIGHTENING_MULTIPLIER = 0.1;

export default function Straightening() {
    const [length, setLength] = useState("");
    const { result, run, clearResult, pending } = useCalculation();

    const handleCalculate = () =>
        run(() => {
            const lengthMm = parsePositive(
                length,
                "Proszę podać prawidłową długość.",
            );
            const hours = (lengthMm / 1000) * STRAIGHTENING_MULTIPLIER;
            const time = hours.toFixed(2);
            return timeResultLine(`Czas prostowania: ${time} h`, time);
        });

    const handleClear = () => {
        setLength("");
        clearResult();
    };

    useKeyShortcuts({ onEnter: handleCalculate, onEscape: handleClear });

    return (
        <>
            <InputField
                label="Długość dłuższego boku lub średnica (fi) [mm]:"
                value={length}
                onChange={setLength}
                placeholder="Wpisz długość lub fi w mm"
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
