import React, { useState, useEffect } from "react";
import Result from "../Result";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";
import GenericForm from "../GenericForm";

export default function Straightening() {
    const [length, setLength] = useState("");
    const [result, setResult] = useState("");

    useEffect(() => {
        setLength("");
        setResult("");
    }, []);

    function handleCalculate() {
        const lengthValue = parseFloat(length);

        if (isNaN(lengthValue) || lengthValue <= 0) {
            setResult("Proszę podać prawidłową długość.");
            return;
        }

        const lengthInMeters = lengthValue / 1000;
        const multiplier = 0.1;
        const value = lengthInMeters * multiplier;

        setResult(`Czas prostowania: ${value.toFixed(2)} h`);
    }

    function handleClear() {
        setLength("");
        setResult("");
    }

    useKeyShortcuts({
        onEnter: handleCalculate,
        onEscape: handleClear,
    });

    return (
        <>
            <GenericForm
                fields={[
                    {
                        id: "length",
                        label: "Długość dłuższego boku lub średnica (fi) [mm]:",
                        value: length,
                        onChange: (e) => setLength(e.target.value),
                        placeholder: "Wpisz długość lub fi w mm",
                    },
                ]}
            />
            <button onClick={handleCalculate}>Oblicz</button>
            <button onClick={handleClear}>Wyczyść</button>
            <Result result={result} />
        </>
    );
}
