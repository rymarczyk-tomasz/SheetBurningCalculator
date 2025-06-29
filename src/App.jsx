import React, { useState, useEffect } from "react";
import "./App.css";
import ShapeSelector from "./components/ShapeSelector";
import InputField from "./components/InputField";
import Result from "./components/Result";
import ProcessSelector from "./components/ProcessSelector";
import { getThicknessMultiplier } from "./utils";
import { calculateRectangle } from "./calculateRectangle";
import { calculateCircle } from "./calculateCircle";
import { calculateSemiCircle } from "./calculateSemiCircle";
import { calculateTotalLength } from "./calculateTotalLength";

const Saw = () => <div>Tu będzie kalkulator cięcia</div>;
const Waterjet = () => <div>Tu będzie kalkulator cięcia wodą</div>;
const Hardening = () => <div>Tu będzie kalkulator hartowania</div>;
const Nitriding = () => <div>Tu będzie kalkulator azotowania</div>;
const Annealing = () => <div>Tu będzie kalkulator żarzenia</div>;
const Tempering = () => <div>Tu będzie kalkulator ulepszania cieplnego</div>;
const Carburizing = () => <div>Tu będzie kalkulator nawęglania</div>;

function App() {
    const [process, setProcess] = useState("burning");
    const [shape, setShape] = useState("rectangle");
    const [length, setLength] = useState("");
    const [width, setWidth] = useState("");
    const [innerDiameter, setInnerDiameter] = useState("");
    const [outerDiameter, setOuterDiameter] = useState("");
    const [thickness, setThickness] = useState("");
    const [totalLength, setTotalLength] = useState("");
    const [result, setResult] = useState("");

    useEffect(() => {
        clearFields();
    }, [shape, process]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Enter") {
                handleCalculate();
            }
            if (event.key === "Escape") {
                handleClear();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const clearFields = () => {
        setLength("");
        setWidth("");
        setOuterDiameter("");
        setInnerDiameter("");
        setThickness("");
        setTotalLength("");
        setResult("");
    };

    const handleCalculate = () => {
        const thicknessValue = parseInt(thickness);
        if (isNaN(thicknessValue) || thicknessValue <= 0) {
            setResult("Proszę podać prawidłową grubość blachy (1-400 mm).");
            return;
        }

        const multiplier = getThicknessMultiplier(thicknessValue);

        try {
            let calculatedResult;
            if (shape === "rectangle") {
                calculatedResult = calculateRectangle(
                    length,
                    width,
                    multiplier
                );
            } else if (shape === "circle") {
                calculatedResult = calculateCircle(
                    outerDiameter,
                    innerDiameter,
                    multiplier
                );
            } else if (shape === "semicircle") {
                calculatedResult = calculateSemiCircle(
                    outerDiameter,
                    innerDiameter,
                    multiplier
                );
            } else if (shape === "totalLength") {
                calculatedResult = calculateTotalLength(
                    totalLength,
                    multiplier
                );
            }
            setResult(`Czas palenia blachy: ${calculatedResult.toFixed(2)} h`);
        } catch (error) {
            setResult(error.message);
        }
    };

    const handleClear = () => {
        clearFields();
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleCalculate();
        }
        if (event.key === "Escape") {
            handleClear();
        }
    };

    return (
        <div className="container" onKeyPress={handleKeyPress}>
            <h1>Kalkulator normatywu pracy</h1>
            <ProcessSelector process={process} setProcess={setProcess} />
            {process === "burning" && (
                <>
                    <ShapeSelector shape={shape} setShape={setShape} />
                    {shape === "rectangle" && (
                        <>
                            <InputField
                                id="length"
                                label="Długość boku A (mm):"
                                value={length}
                                onChange={(e) => setLength(e.target.value)}
                                placeholder="Wpisz wymiar w mm"
                            />
                            <InputField
                                id="width"
                                label="Długość boku B (mm):"
                                value={width}
                                onChange={(e) => setWidth(e.target.value)}
                                placeholder="Wpisz wymiar w mm"
                            />
                        </>
                    )}
                    {(shape === "circle" || shape === "semicircle") && (
                        <>
                            <InputField
                                id="outerDiameter"
                                label="Fi zewnętrzne (mm):"
                                value={outerDiameter}
                                onChange={(e) => setOuterDiameter(e.target.value)}
                                placeholder="Wpisz wymiar w mm"
                            />
                            <InputField
                                id="innerDiameter"
                                label="Fi wewnętrzne (mm):"
                                value={innerDiameter}
                                onChange={(e) => setInnerDiameter(e.target.value)}
                                placeholder="Wpisz wymiar w mm"
                            />
                        </>
                    )}
                    {shape === "totalLength" && (
                        <InputField
                            id="totalLength"
                            label="Całkowita długość boków (mm):"
                            value={totalLength}
                            onChange={(e) => setTotalLength(e.target.value)}
                            placeholder="Wpisz całkowitą długość w mm"
                        />
                    )}
                    <InputField
                        id="thickness"
                        label="Grubość blachy (mm):"
                        value={thickness}
                        onChange={(e) => setThickness(e.target.value)}
                        placeholder="Wpisz grubość w mm"
                    />
                    <button onClick={handleCalculate}>Oblicz</button>
                    <button onClick={handleClear}>Wyczyść</button>
                    <Result result={result} />
                </>
            )}
            {process === "saw" && <Saw />}
            {process === "waterjet" && <Waterjet />}
            {process === "hardening" && <Hardening />}
            {process === "nitriding" && <Nitriding />}
            {process === "annealing" && <Annealing />}
            {process === "tempering" && <Tempering />}
            {process === "carburizing" && <Carburizing />}
        </div>
    );
}

export default App;
