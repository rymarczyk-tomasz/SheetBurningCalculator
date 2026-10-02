import { useState } from "react";
import PropTypes from "prop-types";
import InputField from "../InputField";
import Result from "../Result";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";
import MassCalculator from "../MassCalculator";
import { useCSVTable, findClosest } from "../../hooks/useCSVTable";

/**
 * Wspólny widok procesów liczących czas na podstawie tabeli CSV (masa x grubość).
 * Używany przez: Carburizing, Hardening, Nitriding, Tempering.
 */
export default function MassThicknessLookup({
    csvUrl,
    resultLabel,
    thicknessLabel,
    thicknessPlaceholder,
    linkThickness,
}) {
    const [mass, setMass] = useState("");
    const [thickness, setThickness] = useState("");
    const [result, setResult] = useState(null);
    const [clearCounter, setClearCounter] = useState(0);

    const { csvData, error: csvError } = useCSVTable(csvUrl);

    const handleCalculate = () => {
        if (!mass || !thickness) {
            setResult("Uzupełnij wszystkie pola.");
            return;
        }
        if (csvError) {
            setResult(csvError);
            return;
        }
        if (!csvData || !csvData.data.length) {
            setResult("Ładowanie danych lub brak danych w pliku CSV.");
            return;
        }

        const massVal = parseFloat(mass);
        const thicknessVal = parseFloat(thickness);
        if (
            isNaN(massVal) ||
            isNaN(thicknessVal) ||
            massVal <= 0 ||
            thicknessVal <= 0
        ) {
            setResult("Podaj poprawne, dodatnie wartości.");
            return;
        }

        const { thicknesses, data } = csvData;
        const massIdx = findClosest(
            data.map((d) => d.mass),
            massVal,
        );
        const thicknessIdx = findClosest(thicknesses, thicknessVal);
        const time = data[massIdx]?.times[thicknessIdx];

        if (time == null) {
            setResult("Brak danych dla podanych parametrów.");
            return;
        }
        setResult(`${resultLabel}: ${time} h`);
    };

    const handleClear = () => {
        setMass("");
        setThickness("");
        setResult(null);
        setClearCounter((c) => c + 1);
    };

    useKeyShortcuts({ onEnter: handleCalculate, onEscape: handleClear });

    return (
        <>
            <InputField
                id="mass"
                label="Masa detalu (kg):"
                value={mass}
                onChange={(e) => setMass(e.target.value)}
                placeholder="Wpisz masę w kg, jeżeli nie znasz masy, użyj kalkulatora poniżej"
            />
            <InputField
                id="thickness"
                label={thicknessLabel}
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                placeholder={thicknessPlaceholder}
            />
            <button onClick={handleCalculate}>Oblicz</button>
            <button onClick={handleClear}>Wyczyść</button>
            <MassCalculator
                onMassUpdate={setMass}
                onThicknessUpdate={linkThickness ? setThickness : undefined}
                thickness={linkThickness ? thickness : undefined}
                isCutting={false}
                showRodShape={true}
                clearSignal={clearCounter}
            />
            <Result result={result} />
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

MassThicknessLookup.defaultProps = {
    linkThickness: false,
};
