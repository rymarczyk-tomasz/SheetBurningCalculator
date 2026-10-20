import { useId, useState } from "react";
import InputField from "../InputField";
import CalculatorActions from "../CalculatorActions";
import Result from "../Result";
import MassCalculator from "../MassCalculator";
import useCalculation from "../../hooks/useCalculation";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";
import { useCSVTable } from "../../hooks/useCSVTable";
import { UserError } from "../../utils/errors";
import { parsePositive } from "../../utils/parseNumber";
import { lookupMassThickness } from "../../utils/tableLookup";
import { timeResultLine } from "../../utils/resultLine";
import { krometAnnealingTime, MAAG_TIME_FACTOR } from "../../utils/annealing";

const MAAG_CSV_URL = `${import.meta.env.BASE_URL}obrobka_cieplna.csv`;

export default function Annealing() {
    const furnaceSelectId = useId();
    const [mass, setMass] = useState("");
    const [thickness, setThickness] = useState("");
    const [furnace, setFurnace] = useState("MAAG");
    const [clearCounter, setClearCounter] = useState(0);
    const { result, run, clearResult, pending } = useCalculation();

    const { csvData, error: csvError } = useCSVTable(
        furnace === "MAAG" ? MAAG_CSV_URL : null,
    );

    const handleCalculate = () =>
        run(() => {
            const massValue = parsePositive(mass, "Podaj prawidłową masę.");

            if (furnace === "KROMET") {
                const krometTime = krometAnnealingTime(massValue);
                return timeResultLine(
                    `Czas wyżarzania (KROMET): ${krometTime} h`,
                    krometTime,
                );
            }

            const thicknessValue = parsePositive(
                thickness,
                "Podaj prawidłową grubość.",
            );
            if (csvError) throw new UserError(csvError);
            if (!csvData) {
                throw new UserError("Trwa ładowanie danych, spróbuj ponownie.");
            }

            const time = lookupMassThickness(csvData, massValue, thicknessValue);
            if (time == null) {
                throw new UserError("Brak danych dla podanych parametrów.");
            }
            const maagTime = (time * MAAG_TIME_FACTOR).toFixed(2);
            return timeResultLine(`Czas wyżarzania (MAAG): ${maagTime} h`, maagTime);
        });

    const handleClear = () => {
        setMass("");
        setThickness("");
        clearResult();
        setClearCounter((c) => c + 1);
    };

    useKeyShortcuts({ onEnter: handleCalculate, onEscape: handleClear });

    return (
        <>
            <div className="form-group">
                <label htmlFor={furnaceSelectId}>Wybierz piec:</label>
                <select
                    id={furnaceSelectId}
                    value={furnace}
                    onChange={(e) => setFurnace(e.target.value)}
                >
                    <option value="MAAG">MAAG</option>
                    <option value="KROMET">KROMET</option>
                </select>
            </div>
            <InputField
                label="Masa detalu (kg):"
                value={mass}
                onChange={setMass}
                placeholder="Wpisz masę w kg lub użyj kalkulatora poniżej"
            />
            {furnace === "MAAG" && (
                <InputField
                    label="Grubość materiału (mm):"
                    value={thickness}
                    onChange={setThickness}
                    placeholder="Wpisz grubość w mm"
                />
            )}
            <CalculatorActions
                onCalculate={handleCalculate}
                onClear={handleClear}
                pending={pending}
            />
            <Result result={result} />
            <MassCalculator
                key={clearCounter}
                onMassUpdate={setMass}
                thickness={thickness}
                onThicknessChange={setThickness}
            />
        </>
    );
}
