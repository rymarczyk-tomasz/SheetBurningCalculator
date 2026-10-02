import { useState } from "react";
import InputField from "../InputField";
import Result from "../Result";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";
import { annealingKrometData } from "../../data/annealingKrometData";
import MassCalculator from "../MassCalculator";
import { useCSVTable, findClosest } from "../../hooks/useCSVTable";

export default function Annealing() {
    const [mass, setMass] = useState("");
    const [thickness, setThickness] = useState("");
    const [result, setResult] = useState(null);
    const [furnace, setFurnace] = useState("MAAG");
    const [clearCounter, setClearCounter] = useState(0);

    const { csvData, error: csvError } = useCSVTable(
        furnace === "MAAG"
            ? `${import.meta.env.BASE_URL}1000033414_20250702101659.csv`
            : null,
    );

    const handleCalculate = () => {
        if (!mass || (furnace === "MAAG" && !thickness)) {
            setResult("Uzupełnij wszystkie pola.");
            return;
        }

        const massVal = parseFloat(mass);
        if (isNaN(massVal) || massVal <= 0) {
            setResult("Podaj prawidłową masę.");
            return;
        }

        if (furnace === "KROMET") {
            if (massVal <= 1000) {
                const idx = findClosest(
                    annealingKrometData.map((d) => d.kg),
                    massVal,
                );
                const time = annealingKrometData[idx]?.time;
                setResult(`Czas wyżarzania (KROMET): ${time} h`);
            } else {
                // Dla mas powyżej 1000 kg: 1 h na każde pełne 1000 kg
                const hours = Math.ceil(massVal / 1000);
                setResult(`Czas wyżarzania (KROMET): ${hours} h`);
            }
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

        const thicknessVal = parseFloat(thickness);
        if (isNaN(thicknessVal) || thicknessVal <= 0) {
            setResult("Podaj prawidłową grubość.");
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

        setResult(`Czas wyżarzania (MAAG): ${(time * 0.6).toFixed(2)} h`);
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
            <div>
                <label>Wybierz piec:&nbsp;</label>
                <select
                    value={furnace}
                    onChange={(e) => setFurnace(e.target.value)}
                >
                    <option value="MAAG">MAAG</option>
                    <option value="KROMET">KROMET</option>
                </select>
            </div>
            <InputField
                id="mass"
                label="Masa detalu (kg):"
                value={mass}
                onChange={(e) => setMass(e.target.value)}
                placeholder="Wpisz masę w kg"
            />
            {furnace === "MAAG" && (
                <InputField
                    id="thickness"
                    label="Grubość materiału (mm):"
                    value={thickness}
                    onChange={(e) => setThickness(e.target.value)}
                    placeholder="Wpisz grubość w mm"
                />
            )}
            <button onClick={handleCalculate}>Oblicz</button>
            <button onClick={handleClear}>Wyczyść</button>
            <MassCalculator
                onMassUpdate={setMass}
                onThicknessUpdate={setThickness}
                thickness={thickness}
                showRodShape={true}
                clearSignal={clearCounter}
            />
            <Result result={result} />
        </>
    );
}
