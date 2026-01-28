import React, { useState, useEffect } from "react";
import ShapeSelector from "../ShapeSelector";
import InputField from "../InputField";
import Result from "../Result";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";
import { calculateRectangle } from "../../utils/calculateRectangle";
import { calculateCircle } from "../../utils/calculateCircle";
import { calculateSemiCircle } from "../../utils/calculateSemiCircle";
import { calculateTotalLength } from "../../utils/calculateTotalLength";

async function getBevelingMultiplier(thickness) {
    try {
        const response = await fetch("/SheetBurningCalculator/normatyw.csv");
        const text = await response.text();
        const lines = text
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l);
        const header = lines[0].split(",").map((h) => h.trim());
        const idxThickness = header.indexOf("grubosc");
        const idxBeveling = header.indexOf("fazowanie");

        const values = [];
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(",").map((c) => c.trim());
            const t = parseFloat(cols[idxThickness]);
            const m = parseFloat(cols[idxBeveling]);
            if (!isNaN(t) && !isNaN(m)) {
                values.push({ t, m });
            }
        }

        for (const v of values) {
            if (v.t === thickness) return v.m;
        }

        let lower = null,
            upper = null;
        for (const v of values) {
            if (v.t < thickness) lower = v;
            if (v.t > thickness && !upper) upper = v;
        }
        if (lower && upper) {
            return (
                lower.m +
                ((upper.m - lower.m) * (thickness - lower.t)) /
                    (upper.t - lower.t)
            );
        }

        if (lower) return lower.m;
        if (upper) return upper.m;
        return null;
    } catch {
        return null;
    }
}

export default function Beveling() {
    const [shape, setShape] = useState("rectangle");
    const [length, setLength] = useState("");
    const [width, setWidth] = useState("");
    const [outerDiameter, setOuterDiameter] = useState("");
    const [innerDiameter, setInnerDiameter] = useState("");
    const [thickness, setThickness] = useState("");
    const [totalLength, setTotalLength] = useState("");
    const [result, setResult] = useState("");
    const [sideOption, setSideOption] = useState("single");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setShape("rectangle");
        setLength("");
        setWidth("");
        setOuterDiameter("");
        setInnerDiameter("");
        setThickness("");
        setTotalLength("");
        setResult("");
        setSideOption("single");
    }, []);

    async function handleCalculate() {
        const thicknessValue = parseFloat(thickness);
        if (isNaN(thicknessValue) || thicknessValue <= 0) {
            setResult("Proszę podać prawidłową grubość blachy.");
            return;
        }

        const lookupThickness =
            sideOption === "double" ? thicknessValue / 2 : thicknessValue;

        setLoading(true);
        const multiplier = await getBevelingMultiplier(lookupThickness);
        setLoading(false);

        if (!multiplier) {
            setResult("Brak normatywu dla podanej grubości.");
            return;
        }

        let value = 0;
        try {
            switch (shape) {
                case "rectangle":
                    value = calculateRectangle(length, width, multiplier);
                    break;
                case "circle":
                    value = calculateCircle(
                        outerDiameter,
                        innerDiameter,
                        multiplier
                    );
                    break;
                case "semicircle":
                    value = calculateSemiCircle(
                        outerDiameter,
                        innerDiameter,
                        multiplier
                    );
                    break;
                case "totalLength":
                    value = calculateTotalLength(totalLength, multiplier);
                    break;
                default:
                    setResult("Nieobsługiwany kształt.");
                    return;
            }
        } catch (err) {
            setResult(err.message);
            return;
        }

        if (sideOption === "double") {
            value = value * 2;
        }

        setResult(
            `Czas fazowania (ukosowanie) (${sideOption === "single" ? "jednostronne" : "dwustronne"}): ${value.toFixed(2)} h`
        );
    }

    function handleClear() {
        setLength("");
        setWidth("");
        setOuterDiameter("");
        setInnerDiameter("");
        setThickness("");
        setTotalLength("");
        setResult("");
        setSideOption("single");
    }

    useKeyShortcuts({
        onEnter: handleCalculate,
        onEscape: handleClear,
    });

    return (
        <>
            <div className="beveling-side-group">
                <label className="beveling-side-label">
                    <input
                        type="radio"
                        name="sideOption"
                        value="single"
                        checked={sideOption === "single"}
                        onChange={() => setSideOption("single")}
                    />
                    Jednostronne
                </label>
                <label className="beveling-side-label">
                    <input
                        type="radio"
                        name="sideOption"
                        value="double"
                        checked={sideOption === "double"}
                        onChange={() => setSideOption("double")}
                    />
                    Dwustronne
                </label>
            </div>
            <ShapeSelector
                shape={shape}
                setShape={setShape}
                isCutting={false}
            />
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
                label="wielkosć fazy (mm):"
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                placeholder="Wpisz wielkość fazu w mm"
            />
            <button onClick={handleCalculate} disabled={loading}>
                {loading ? "Obliczanie..." : "Oblicz"}
            </button>
            <button onClick={handleClear}>Wyczyść</button>
            <Result result={result} />
        </>
    );
}
