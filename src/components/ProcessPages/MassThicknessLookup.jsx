import { useState } from "react";
import PropTypes from "prop-types";
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

/**
 * Wspólny widok procesów liczących czas na podstawie tabeli CSV (masa x grubość).
 * Używany przez: Carburizing, Hardening, Nitriding, Tempering.
 */
export default function MassThicknessLookup({
    csvUrl,
    resultLabel,
    thicknessLabel,
    thicknessPlaceholder,
    linkThickness = false,
}) {
    const [mass, setMass] = useState("");
    const [thickness, setThickness] = useState("");
    const [clearCounter, setClearCounter] = useState(0);
    const { csvData, error: csvError } = useCSVTable(csvUrl);
    const { result, run, clearResult, pending } = useCalculation();

    const handleCalculate = () =>
        run(() => {
            const massValue = parsePositive(mass, "Podaj prawidłową masę detalu.");
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
            return timeResultLine(`${resultLabel}: ${time} h`, time);
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
            <InputField
                label="Masa detalu (kg):"
                value={mass}
                onChange={setMass}
                placeholder="Wpisz masę w kg lub użyj kalkulatora poniżej"
            />
            <InputField
                label={thicknessLabel}
                value={thickness}
                onChange={setThickness}
                placeholder={thicknessPlaceholder}
            />
            <CalculatorActions
                onCalculate={handleCalculate}
                onClear={handleClear}
                pending={pending}
            />
            <Result result={result} />
            <MassCalculator
                key={clearCounter}
                onMassUpdate={setMass}
                thickness={linkThickness ? thickness : undefined}
                onThicknessChange={linkThickness ? setThickness : undefined}
            />
        </>
    );
}

MassThicknessLookup.propTypes = {
    csvUrl: PropTypes.string.isRequired,
    resultLabel: PropTypes.string.isRequired,
    thicknessLabel: PropTypes.string.isRequired,
    thicknessPlaceholder: PropTypes.string.isRequired,
    linkThickness: PropTypes.bool,
};
