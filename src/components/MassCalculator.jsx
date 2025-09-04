import React, { useState } from "react";
import InputField from "./InputField";

export default function MassCalculator({ onMassUpdate }) {
    const [lengthA, setLengthA] = useState("");
    const [lengthB, setLengthB] = useState("");
    const [thickness, setThickness] = useState("");
    const [calculatedMass, setCalculatedMass] = useState(null);
    const density = 7.86;

    const handleCalculate = () => {
        if (!lengthA || !lengthB || !thickness) {
            setCalculatedMass("Uzupełnij wszystkie pola.");
            return;
        }

        const lengthAVal = parseFloat(lengthA);
        const lengthBVal = parseFloat(lengthB);
        const thicknessVal = parseFloat(thickness);

        if (
            isNaN(lengthAVal) ||
            isNaN(lengthBVal) ||
            isNaN(thicknessVal) ||
            lengthAVal <= 0 ||
            lengthBVal <= 0 ||
            thicknessVal <= 0
        ) {
            setCalculatedMass("Podaj poprawne, dodatnie wartości.");
            return;
        }

        const mass =
            ((lengthAVal / 10) *
                (lengthBVal / 10) *
                (thicknessVal / 10) *
                density) /
            1000;
        const calculatedValue = mass.toFixed(2);
        setCalculatedMass(`Masa detalu: ${calculatedValue} kg`);
        onMassUpdate(calculatedValue);
    };

    const handleClear = () => {
        setLengthA("");
        setLengthB("");
        setThickness("");
        setCalculatedMass(null);
    };

    return (
        <>
            <h2>Kalkulator do obliczania masy detalu</h2>
            <InputField
                id="lengthA"
                label="Długość A (mm):"
                value={lengthA}
                onChange={(e) => setLengthA(e.target.value)}
                placeholder="Wpisz długość A w mm"
            />
            <InputField
                id="lengthB"
                label="Długość B (mm):"
                value={lengthB}
                onChange={(e) => setLengthB(e.target.value)}
                placeholder="Wpisz długość B w mm"
            />
            <InputField
                id="thickness"
                label="Grubość materiału (mm):"
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                placeholder="Wpisz grubość w mm"
            />
            <button onClick={handleCalculate}>Oblicz masę</button>
            <button onClick={handleClear}>Wyczyść</button>
            {calculatedMass && <p>{calculatedMass}</p>}
        </>
    );
}
