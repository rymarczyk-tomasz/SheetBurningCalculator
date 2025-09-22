import React, { useState, useEffect } from "react";
import InputField from "../InputField";
import Result from "../Result";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";
import { annealingKrometData } from "../../data/annealingKrometData";
import MassCalculator from "../MassCalculator";

export default function Annealing() {
    const [mass, setMass] = useState("");
    const [thickness, setThickness] = useState("");
    const [result, setResult] = useState(null);
    const [csvData, setCsvData] = useState(null);
    const [furnace, setFurnace] = useState("MAAG");

    useEffect(() => {
        if (furnace === "MAAG") {
            fetch("/SheetBurningCalculator/1000033414_20250702101659.csv")
                .then((res) => {
                    if (!res.ok)
                        throw new Error("Nie można załadować pliku CSV");
                    return res.text();
                })
                .then((text) => {
                    setCsvData(parseCSV(text));
                })
                .catch((err) =>
                    setResult("Błąd ładowania pliku CSV: " + err.message)
                );
        }
    }, [furnace]);

    function parseCSV(text) {
        const rows = text
            .trim()
            .split("\n")
            .map((row) => row.split(","));
        const thicknesses = rows[0].slice(1).map(Number);
        const data = rows.slice(1).map((row) => ({
            mass: Number(row[0]),
            times: row.slice(1).map((val) => (val ? Number(val) : null)),
        }));
        return { thicknesses, data };
    }

    const findClosest = (arr, value) => {
        return arr.reduce(
            (bestIdx, curr, idx, a) =>
                Math.abs(curr - value) < Math.abs(a[bestIdx] - value)
                    ? idx
                    : bestIdx,
            0
        );
    };

    const handleCalculate = () => {
        if (!mass || (furnace === "MAAG" && !thickness)) {
            setResult("Uzupełnij wszystkie pola.");
            return;
        }

        if (furnace === "KROMET") {
            const massVal = parseFloat(mass);
            if (isNaN(massVal) || massVal <= 0) {
                setResult("Podaj prawidłową masę.");
                return;
            }
            if (massVal <= 1000) {
                const idx = findClosest(
                    annealingKrometData.map((d) => d.kg),
                    massVal
                );
                const time = annealingKrometData[idx]?.time;
                setResult(`Czas wyżarzania (KROMET): ${time} h`);
            } else {
                const hours = Math.floor(massVal / 1000);
                setResult(`Czas wyżarzania (KROMET): ${hours} h`);
            }
            return;
        }

        if (!csvData || !csvData.data || csvData.data.length === 0) {
            setResult("Ładowanie danych lub brak danych w pliku CSV.");
            return;
        }
        const { thicknesses, data } = csvData;
        const massVal = parseFloat(mass);
        const thicknessVal = parseFloat(thickness);

        const massIdx = findClosest(
            data.map((d) => d.mass),
            massVal
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
    };

    const handleMassUpdate = (value) => {
        setMass(value);
    };

    useKeyShortcuts({
        onEnter: handleCalculate,
        onEscape: handleClear,
    });

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
                onMassUpdate={handleMassUpdate}
                showRodShape={true}
            />
            <Result result={result} />
        </>
    );
}
