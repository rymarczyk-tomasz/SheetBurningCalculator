import React, { useState, useEffect } from "react";
import InputField from "../InputField";
import Result from "../Result";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";
import MassCalculator from "../MassCalculator";

export default function Tempering() {
    const [mass, setMass] = useState("");
    const [thickness, setThickness] = useState("");
    const [result, setResult] = useState(null);
    const [csvData, setCsvData] = useState(null);
    const [clearCounter, setClearCounter] = useState(0);

    useEffect(() => {
        fetch("/SheetBurningCalculator/1000033414_20250702101659.csv")
            .then((res) => {
                if (!res.ok) throw new Error("Nie można załadować pliku CSV");
                return res.text();
            })
            .then((text) => {
                setCsvData(parseCSV(text));
            })
            .catch((err) =>
                setResult("Błąd ładowania pliku CSV: " + err.message)
            );
    }, []);

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
        if (!mass || !thickness) {
            setResult("Uzupełnij wszystkie pola.");
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

        setResult(`Czas ulepszania cieplnego: ${time} h`);
    };

    const handleClear = () => {
        setMass("");
        setThickness("");
        setResult(null);
        setClearCounter((c) => c + 1);
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
            <InputField
                id="mass"
                label="Masa detalu (kg):"
                value={mass}
                onChange={(e) => setMass(e.target.value)}
                placeholder="Wpisz masę w kg, jezeli nie znasz masy, uzyj kalkulatora poniżej"
            />
            <InputField
                id="thickness"
                label="Grubość materiału (mm):"
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                placeholder="Wpisz grubość w mm"
            />
            <button onClick={handleCalculate}>Oblicz</button>
            <button onClick={handleClear}>Wyczyść</button>
            <MassCalculator
                onMassUpdate={handleMassUpdate}
                onThicknessUpdate={setThickness}
                thickness={thickness}
                isCutting={false}
                showRodShape={true}
                clearSignal={clearCounter}
            />
            <Result result={result} />
        </>
    );
}
