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
import { rodCuttingData } from "./rodPipeCuttingData";
import { waterjetCuttingData } from "./waterjetCuttingData";

const Hardening = () => <div>Tu będzie kalkulator hartowania</div>;
const Nitriding = () => <div>Tu będzie kalkulator azotowania</div>;
const Annealing = () => <div>Tu będzie kalkulator wyżarzania</div>;
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
    const [rodDiameter, setRodDiameter] = useState("");
    const [pipeOuterDiameter, setPipeOuterDiameter] = useState("");
    const [waterjetType, setWaterjetType] = useState("czarna");
    const [extraOptionsVisible, setExtraOptionsVisible] = useState(false);
    const [holes, setHoles] = useState([{ diameter: "", count: "" }]);
    const [rectHoles, setRectHoles] = useState([{ a: "", b: "", count: "" }]);

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

    useEffect(() => {
        if (process === "saw") {
            setShape("rod");
        } else if (process === "burning") {
            setShape("rectangle");
        }
    }, [process]);

    const clearFields = () => {
        setLength("");
        setWidth("");
        setOuterDiameter("");
        setInnerDiameter("");
        setThickness("");
        setTotalLength("");
        setResult("");
        setRodDiameter("");
        setPipeOuterDiameter("");
        setHoles([{ diameter: "", count: "" }]);
        setRectHoles([{ a: "", b: "", count: "" }]);
    };

    const getWaterjetMultiplier = (type, thickness) => {
        const typeData = waterjetCuttingData.find((t) => t.type === type);
        if (!typeData) return null;
        const found = typeData.data.find(
            (row) =>
                thickness >= row.minThickness && thickness <= row.maxThickness
        );
        return found ? found.multiplier : null;
    };

    const handleHoleChange = (idx, field, value) => {
        const updated = [...holes];
        updated[idx][field] = value;
        setHoles(updated);
    };
    const addHole = () => setHoles([...holes, { diameter: "", count: "" }]);
    const removeHole = (idx) => setHoles(holes.filter((_, i) => i !== idx));

    const handleRectHoleChange = (idx, field, value) => {
        const updated = [...rectHoles];
        updated[idx][field] = value;
        setRectHoles(updated);
    };
    const addRectHole = () =>
        setRectHoles([...rectHoles, { a: "", b: "", count: "" }]);
    const removeRectHole = (idx) =>
        setRectHoles(rectHoles.filter((_, i) => i !== idx));

    const handleCalculate = () => {
        if (process === "burning") {
            const thicknessValue = parseInt(thickness);
            if (isNaN(thicknessValue) || thicknessValue <= 0) {
                setResult("Proszę podać prawidłową grubość blachy (1-400 mm).");
                return;
            }
            if (thicknessValue > 400) {
                setResult(
                    "Brak możliwości palenia blach o grubości powyżej 400 mm."
                );
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

                let extraLength = 0;
                holes.forEach(({ diameter, count }) => {
                    const d = parseFloat(diameter);
                    const c = parseInt(count);
                    if (!isNaN(d) && d > 0 && !isNaN(c) && c > 0) {
                        extraLength += Math.PI * d * c;
                    }
                });
                rectHoles.forEach(({ a, b, count }) => {
                    const aa = parseFloat(a);
                    const bb = parseFloat(b);
                    const c = parseInt(count);
                    if (
                        !isNaN(aa) &&
                        aa > 0 &&
                        !isNaN(bb) &&
                        bb > 0 &&
                        !isNaN(c) &&
                        c > 0
                    ) {
                        extraLength += 2 * (aa + bb) * c;
                    }
                });
                if (extraLength > 0) {
                    calculatedResult += (extraLength / 1000) * multiplier;
                }

                if (thicknessValue >= 1 && thicknessValue < 3) {
                    setResult("Taką blachę tniemy na wodzie");
                } else if (thicknessValue >= 3 && thicknessValue <= 25) {
                    setResult(
                        `Czas palenia blachy: ${calculatedResult.toFixed(
                            2
                        )} h - Plazma`
                    );
                } else {
                    setResult(
                        `Czas palenia blachy: ${calculatedResult.toFixed(
                            2
                        )} h - Palnik gazowy`
                    );
                }
            } catch (error) {
                setResult(error.message);
            }
            return;
        }

        if (process === "saw") {
            if (shape === "rod") {
                const diameter = parseInt(rodDiameter);
                if (isNaN(diameter) || diameter <= 0) {
                    setResult("Proszę podać prawidłową średnicę pręta.");
                    return;
                }
                const found = rodCuttingData.find(
                    (row) =>
                        diameter >= row.minDiameter &&
                        diameter <= row.maxDiameter
                );
                if (found) {
                    const mpk = diameter < 180 ? "Mpk 416" : "Mpk 418";
                    setResult(
                        `Na cięcie pręta potrzeba ${found.time} h - ${mpk}`
                    );
                } else {
                    setResult("Brak danych dla podanej średnicy pręta.");
                }
                return;
            }
            if (shape === "pipe") {
                const diameter = parseInt(pipeOuterDiameter);
                if (isNaN(diameter) || diameter <= 0) {
                    setResult("Proszę podać prawidłową średnicę rury.");
                    return;
                }
                const found = rodCuttingData.find(
                    (row) =>
                        diameter >= row.minDiameter &&
                        diameter <= row.maxDiameter
                );
                if (found) {
                    const pipeTime = found.time / 2;
                    const mpk = diameter < 180 ? "Mpk 416" : "Mpk 418";
                    setResult(`Na cięcie rury potrzeba ${pipeTime} h - ${mpk}`);
                } else {
                    setResult("Brak danych dla podanej średnicy rury.");
                }
                return;
            }
        }

        if (process === "waterjet") {
            const thicknessValue = parseFloat(thickness);
            if (isNaN(thicknessValue) || thicknessValue <= 0) {
                setResult("Proszę podać prawidłową grubość blachy.");
                return;
            }
            const multiplier = getWaterjetMultiplier(
                waterjetType,
                thicknessValue
            );
            if (!multiplier) {
                setResult("Brak danych dla podanej grubości i typu blachy.");
                return;
            }
            let calculatedResult;
            try {
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
                let extraLength = 0;
                holes.forEach(({ diameter, count }) => {
                    const d = parseFloat(diameter);
                    const c = parseInt(count);
                    if (!isNaN(d) && d > 0 && !isNaN(c) && c > 0) {
                        extraLength += Math.PI * d * c;
                    }
                });
                rectHoles.forEach(({ a, b, count }) => {
                    const aa = parseFloat(a);
                    const bb = parseFloat(b);
                    const c = parseInt(count);
                    if (
                        !isNaN(aa) &&
                        aa > 0 &&
                        !isNaN(bb) &&
                        bb > 0 &&
                        !isNaN(c) &&
                        c > 0
                    ) {
                        extraLength += 2 * (aa + bb) * c;
                    }
                });
                if (extraLength > 0) {
                    calculatedResult += (extraLength / 1000) * multiplier;
                }
                setResult(
                    `Czas cięcia wodą (${waterjetType}): ${calculatedResult.toFixed(
                        2
                    )} h`
                );
            } catch (error) {
                setResult(error.message);
            }
            return;
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
            <h1>Kalkulator normatywu czasu pracy</h1>
            <ProcessSelector process={process} setProcess={setProcess} />
            {process === "burning" && (
                <>
                    <ShapeSelector
                        shape={shape}
                        setShape={setShape}
                        isCutting={false}
                    />
                    <div style={{ margin: "16px 0" }}>
                        <button
                            type="button"
                            onClick={() => setExtraOptionsVisible((v) => !v)}
                        >
                            {extraOptionsVisible ? "Ukryj" : "Dodatkowe opcje"}
                        </button>
                        {extraOptionsVisible && (
                            <div
                                style={{
                                    border: "1px solid #ccc",
                                    padding: 12,
                                    marginTop: 8,
                                }}
                            >
                                <strong>Otwory kołowe:</strong>
                                {holes.map((hole, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            display: "flex",
                                            gap: 8,
                                            alignItems: "center",
                                            marginBottom: 4,
                                        }}
                                    >
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="Fi (mm)"
                                            value={hole.diameter}
                                            onChange={(e) =>
                                                handleHoleChange(
                                                    idx,
                                                    "diameter",
                                                    e.target.value
                                                )
                                            }
                                            style={{ width: 80 }}
                                        />
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="Ilość"
                                            value={hole.count}
                                            onChange={(e) =>
                                                handleHoleChange(
                                                    idx,
                                                    "count",
                                                    e.target.value
                                                )
                                            }
                                            style={{ width: 60 }}
                                        />
                                        {holes.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeHole(idx)}
                                            >
                                                -
                                            </button>
                                        )}
                                        {idx === holes.length - 1 && (
                                            <button
                                                type="button"
                                                onClick={addHole}
                                            >
                                                +
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <strong>Otwory czworokątne:</strong>
                                {rectHoles.map((rect, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            display: "flex",
                                            gap: 8,
                                            alignItems: "center",
                                            marginBottom: 4,
                                        }}
                                    >
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="Bok A (mm)"
                                            value={rect.a}
                                            onChange={(e) =>
                                                handleRectHoleChange(
                                                    idx,
                                                    "a",
                                                    e.target.value
                                                )
                                            }
                                            style={{ width: 80 }}
                                        />
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="Bok B (mm)"
                                            value={rect.b}
                                            onChange={(e) =>
                                                handleRectHoleChange(
                                                    idx,
                                                    "b",
                                                    e.target.value
                                                )
                                            }
                                            style={{ width: 80 }}
                                        />
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="Ilość"
                                            value={rect.count}
                                            onChange={(e) =>
                                                handleRectHoleChange(
                                                    idx,
                                                    "count",
                                                    e.target.value
                                                )
                                            }
                                            style={{ width: 60 }}
                                        />
                                        {rectHoles.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeRectHole(idx)
                                                }
                                            >
                                                -
                                            </button>
                                        )}
                                        {idx === rectHoles.length - 1 && (
                                            <button
                                                type="button"
                                                onClick={addRectHole}
                                            >
                                                +
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
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
                                onChange={(e) =>
                                    setOuterDiameter(e.target.value)
                                }
                                placeholder="Wpisz wymiar w mm"
                            />
                            <InputField
                                id="innerDiameter"
                                label="Fi wewnętrzne (mm):"
                                value={innerDiameter}
                                onChange={(e) =>
                                    setInnerDiameter(e.target.value)
                                }
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
            {process === "saw" && (
                <>
                    <ShapeSelector
                        shape={shape}
                        setShape={setShape}
                        isCutting={true}
                    />
                    {shape === "rod" && (
                        <InputField
                            id="rodDiameter"
                            label="Fi pręta (mm):"
                            value={rodDiameter}
                            onChange={(e) => setRodDiameter(e.target.value)}
                            placeholder="Wpisz średnicę pręta w mm"
                        />
                    )}
                    {shape === "pipe" && (
                        <>
                            <InputField
                                id="pipeOuterDiameter"
                                label="Fi zewnętrzne rury (mm):"
                                value={pipeOuterDiameter}
                                onChange={(e) =>
                                    setPipeOuterDiameter(e.target.value)
                                }
                                placeholder="Wpisz fi zewnętrzne rury w mm"
                            />
                        </>
                    )}
                    <button onClick={handleCalculate}>Oblicz</button>
                    <button onClick={handleClear}>Wyczyść</button>
                    <Result result={result} />
                </>
            )}
            {process === "waterjet" && (
                <>
                    <div
                        style={{
                            display: "flex",
                            gap: "16px",
                            alignItems: "center",
                            marginBottom: 8,
                            justifyContent: "center",
                        }}
                    >
                        <label style={{ margin: 0 }}>
                            <input
                                type="radio"
                                value="czarna"
                                checked={waterjetType === "czarna"}
                                onChange={() => setWaterjetType("czarna")}
                            />
                            Blacha czarna
                        </label>
                        <label style={{ margin: 0 }}>
                            <input
                                type="radio"
                                value="nierdzewka"
                                checked={waterjetType === "nierdzewka"}
                                onChange={() => setWaterjetType("nierdzewka")}
                            />
                            Blacha nierdzewna
                        </label>
                    </div>
                    <ShapeSelector
                        shape={shape}
                        setShape={setShape}
                        isCutting={false}
                    />
                    <div style={{ margin: "16px 0" }}>
                        <button
                            type="button"
                            onClick={() => setExtraOptionsVisible((v) => !v)}
                        >
                            {extraOptionsVisible ? "Ukryj" : "Dodatkowe opcje"}
                        </button>
                        {extraOptionsVisible && (
                            <div
                                style={{
                                    border: "1px solid #ccc",
                                    padding: 12,
                                    marginTop: 8,
                                }}
                            >
                                <strong>Otwory kołowe:</strong>
                                {holes.map((hole, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            display: "flex",
                                            gap: 8,
                                            alignItems: "center",
                                            marginBottom: 4,
                                        }}
                                    >
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="Fi (mm)"
                                            value={hole.diameter}
                                            onChange={(e) =>
                                                handleHoleChange(
                                                    idx,
                                                    "diameter",
                                                    e.target.value
                                                )
                                            }
                                            style={{ width: 80 }}
                                        />
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="Ilość"
                                            value={hole.count}
                                            onChange={(e) =>
                                                handleHoleChange(
                                                    idx,
                                                    "count",
                                                    e.target.value
                                                )
                                            }
                                            style={{ width: 60 }}
                                        />
                                        {holes.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeHole(idx)}
                                            >
                                                -
                                            </button>
                                        )}
                                        {idx === holes.length - 1 && (
                                            <button
                                                type="button"
                                                onClick={addHole}
                                            >
                                                +
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <strong>Otwory czworokątne:</strong>
                                {rectHoles.map((rect, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            display: "flex",
                                            gap: 8,
                                            alignItems: "center",
                                            marginBottom: 4,
                                        }}
                                    >
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="Bok A (mm)"
                                            value={rect.a}
                                            onChange={(e) =>
                                                handleRectHoleChange(
                                                    idx,
                                                    "a",
                                                    e.target.value
                                                )
                                            }
                                            style={{ width: 80 }}
                                        />
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="Bok B (mm)"
                                            value={rect.b}
                                            onChange={(e) =>
                                                handleRectHoleChange(
                                                    idx,
                                                    "b",
                                                    e.target.value
                                                )
                                            }
                                            style={{ width: 80 }}
                                        />
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="Ilość"
                                            value={rect.count}
                                            onChange={(e) =>
                                                handleRectHoleChange(
                                                    idx,
                                                    "count",
                                                    e.target.value
                                                )
                                            }
                                            style={{ width: 60 }}
                                        />
                                        {rectHoles.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeRectHole(idx)
                                                }
                                            >
                                                -
                                            </button>
                                        )}
                                        {idx === rectHoles.length - 1 && (
                                            <button
                                                type="button"
                                                onClick={addRectHole}
                                            >
                                                +
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
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
                                onChange={(e) =>
                                    setOuterDiameter(e.target.value)
                                }
                                placeholder="Wpisz wymiar w mm"
                            />
                            <InputField
                                id="innerDiameter"
                                label="Fi wewnętrzne (mm):"
                                value={innerDiameter}
                                onChange={(e) =>
                                    setInnerDiameter(e.target.value)
                                }
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
            {process === "hardening" && <Hardening />}
            {process === "nitriding" && <Nitriding />}
            {process === "annealing" && <Annealing />}
            {process === "tempering" && <Tempering />}
            {process === "carburizing" && <Carburizing />}
        </div>
    );
}

export default App;
