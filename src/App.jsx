import React, { useState, useEffect } from "react";
import "./App.css";

import ProcessSelector from "./components/ProcessSelector";
import BurningCalculator from "./components/BurningCalculator/BurningCalculator";
import SawCalculator from "./components/SawCalculator/SawCalculator";
import WaterjetCalculator from "./components/WaterjetCalculator/WaterjetCalculator";
import Hardening from "./components/ProcessPages/Hardening";
import Nitriding from "./components/ProcessPages/Nitriding";
import Annealing from "./components/ProcessPages/Annealing";
import Tempering from "./components/ProcessPages/Tempering";
import Carburizing from "./components/ProcessPages/Carburizing";
import Beveling from "./components/ProcessPages/Beveling";
import GrindingAfterBurning from "./components/ProcessPages/GrindingAfterBurning";
import Deburring from "./components/ProcessPages/Deburring";
import Straightening from "./components/ProcessPages/Straightening";
import BevelingMilling from "./components/ProcessPages/BevelingMilling";

import useKeyShortcuts from "./hooks/useKeyShortcuts";

import { burningCalculator } from "./utils/calculators/burningCalculator";
import { sawCalculator } from "./utils/calculators/sawCalculator";
import { waterjetCalculator } from "./utils/calculators/waterjetCalculator";

function App() {
    const [process, setProcess] = useState("burning");
    const [shape, setShape] = useState("rectangle");

    const [length, setLength] = useState("");
    const [width, setWidth] = useState("");
    const [outerDiameter, setOuterDiameter] = useState("");
    const [innerDiameter, setInnerDiameter] = useState("");
    const [thickness, setThickness] = useState("");
    const [totalLength, setTotalLength] = useState("");
    const [rodDiameter, setRodDiameter] = useState("");
    const [pipeOuterDiameter, setPipeOuterDiameter] = useState("");
    const [holes, setHoles] = useState([{ diameter: "", count: "" }]);
    const [rectHoles, setRectHoles] = useState([{ a: "", b: "", count: "" }]);
    const [waterjetType, setWaterjetType] = useState("czarna");

    const [extraOptionsVisible, setExtraOptionsVisible] = useState(false);
    const [result, setResult] = useState("");

    const clearFields = () => {
        setLength("");
        setWidth("");
        setOuterDiameter("");
        setInnerDiameter("");
        setThickness("");
        setTotalLength("");
        setRodDiameter("");
        setPipeOuterDiameter("");
        setHoles([{ diameter: "", count: "" }]);
        setRectHoles([{ a: "", b: "", count: "" }]);
        setResult("");
    };

    useEffect(() => {
        clearFields();
    }, [shape, process]);

    useEffect(() => {
        if (process === "saw") setShape("rod");
        if (process === "burning") setShape("rectangle");
    }, [process]);

    function handleCalculate() {
        let message = "";

        if (process === "burning") {
            message = burningCalculator({
                shape,
                length,
                width,
                outerDiameter,
                innerDiameter,
                totalLength,
                thickness,
                holes,
                rectHoles,
            });
        } else if (process === "saw") {
            message = sawCalculator({
                shape,
                rodDiameter,
                pipeOuterDiameter,
            });
        } else if (process === "waterjet") {
            message = waterjetCalculator({
                shape,
                length,
                width,
                outerDiameter,
                innerDiameter,
                totalLength,
                thickness,
                holes,
                rectHoles,
                waterjetType,
            });
        }

        setResult(message);
    }

    const handleClear = () => {
        clearFields();
    };

    useKeyShortcuts({
        onEnter: handleCalculate,
        onEscape: handleClear,
    });

    return (
        <div className="container">
            <h1>Kalkulator normatywu czasu pracy</h1>
            <ProcessSelector process={process} setProcess={setProcess} />

            <div className="secondary-container">
                {process === "burning" && (
                    <BurningCalculator
                        shape={shape}
                        setShape={setShape}
                        length={length}
                        setLength={setLength}
                        width={width}
                        setWidth={setWidth}
                        outerDiameter={outerDiameter}
                        setOuterDiameter={setOuterDiameter}
                        innerDiameter={innerDiameter}
                        setInnerDiameter={setInnerDiameter}
                        thickness={thickness}
                        setThickness={setThickness}
                        totalLength={totalLength}
                        setTotalLength={setTotalLength}
                        holes={holes}
                        setHoles={setHoles}
                        rectHoles={rectHoles}
                        setRectHoles={setRectHoles}
                        result={result}
                        handleCalculate={handleCalculate}
                        handleClear={handleClear}
                        extraOptionsVisible={extraOptionsVisible}
                        setExtraOptionsVisible={setExtraOptionsVisible}
                    />
                )}

                {process === "saw" && (
                    <SawCalculator
                        shape={shape}
                        setShape={setShape}
                        rodDiameter={rodDiameter}
                        setRodDiameter={setRodDiameter}
                        pipeOuterDiameter={pipeOuterDiameter}
                        setPipeOuterDiameter={setPipeOuterDiameter}
                        result={result}
                        handleCalculate={handleCalculate}
                        handleClear={handleClear}
                    />
                )}

                {process === "waterjet" && (
                    <WaterjetCalculator
                        shape={shape}
                        setShape={setShape}
                        length={length}
                        setLength={setLength}
                        width={width}
                        setWidth={setWidth}
                        outerDiameter={outerDiameter}
                        setOuterDiameter={setOuterDiameter}
                        innerDiameter={innerDiameter}
                        setInnerDiameter={setInnerDiameter}
                        thickness={thickness}
                        setThickness={setThickness}
                        totalLength={totalLength}
                        setTotalLength={setTotalLength}
                        holes={holes}
                        setHoles={setHoles}
                        rectHoles={rectHoles}
                        setRectHoles={setRectHoles}
                        waterjetType={waterjetType}
                        setWaterjetType={setWaterjetType}
                        result={result}
                        handleCalculate={handleCalculate}
                        handleClear={handleClear}
                        extraOptionsVisible={extraOptionsVisible}
                        setExtraOptionsVisible={setExtraOptionsVisible}
                    />
                )}

                {}
                {process === "hardening" && <Hardening />}
                {process === "nitriding" && <Nitriding />}
                {process === "annealing" && <Annealing />}
                {process === "tempering" && <Tempering />}
                {process === "carburizing" && <Carburizing />}
                {process === "beveling" && <Beveling />}
                {process === "grindingAfterBurning" && <GrindingAfterBurning />}
                {process === "deburring" && <Deburring />}
                {process === "straightening" && <Straightening />}
                {process === "bevelingMilling" && <BevelingMilling />}
            </div>
        </div>
    );
}

export default App;
