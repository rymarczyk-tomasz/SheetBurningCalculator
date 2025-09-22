import React, { useState } from "react";
import InputField from "./InputField";
import ShapeSelector from "./ShapeSelector";
import PropTypes from "prop-types";

export default function MassCalculator({
    onMassUpdate,
    isCutting = false,
    showRodShape = false,
}) {
    const [shape, setShape] = useState("rectangle");
    const [length, setLength] = useState("");
    const [width, setWidth] = useState("");
    const [outerDiameter, setOuterDiameter] = useState("");
    const [innerDiameter, setInnerDiameter] = useState("");
    const [totalLength, setTotalLength] = useState("");
    const [thickness, setThickness] = useState("");
    const [rodDiameter, setRodDiameter] = useState("");
    const [rodLength, setRodLength] = useState("");
    const [calculatedMass, setCalculatedMass] = useState(null);
    const density = 7.86;

    const handleCalculate = () => {
        let mass = 0;

        if (shape === "rectangle") {
            if (!length || !width || !thickness) {
                setCalculatedMass("Uzupełnij długość, szerokość i grubość.");
                return;
            }
            const lengthVal = parseFloat(length);
            const widthVal = parseFloat(width);
            const thicknessVal = parseFloat(thickness);

            if (
                isNaN(lengthVal) ||
                isNaN(widthVal) ||
                isNaN(thicknessVal) ||
                lengthVal <= 0 ||
                widthVal <= 0 ||
                thicknessVal <= 0
            ) {
                setCalculatedMass(
                    "Podaj poprawne, dodatnie wartości długości, szerokości i grubości."
                );
                return;
            }

            mass =
                ((lengthVal / 10) *
                    (widthVal / 10) *
                    (thicknessVal / 10) *
                    density) /
                1000;
        } else if (shape === "circle" || shape === "semicircle") {
            if (!outerDiameter || !thickness) {
                setCalculatedMass("Uzupełnij średnicę zewnętrzną i grubość.");
                return;
            }
            const outerDiameterVal = parseFloat(outerDiameter);
            const innerDiameterVal = parseFloat(innerDiameter) || 0;
            const thicknessVal = parseFloat(thickness);

            if (
                isNaN(outerDiameterVal) ||
                isNaN(thicknessVal) ||
                outerDiameterVal <= 0 ||
                thicknessVal <= 0
            ) {
                setCalculatedMass(
                    "Podaj poprawne wartości średnicy zewnętrznej i grubości."
                );
                return;
            }

            const outerRadius = outerDiameterVal / 2;
            const innerRadius = innerDiameterVal / 2;

            let area =
                Math.PI *
                (outerRadius * outerRadius - innerRadius * innerRadius);
            if (shape === "semicircle") {
                area /= 2;
            }
            mass = ((area / 100) * (thicknessVal / 10) * density) / 1000;
        } else if (shape === "totalLength") {
            if (!totalLength || !thickness) {
                setCalculatedMass("Uzupełnij całkowitą długość i grubość.");
                return;
            }
            const totalLengthVal = parseFloat(totalLength);
            const thicknessVal = parseFloat(thickness);
            if (
                isNaN(totalLengthVal) ||
                isNaN(thicknessVal) ||
                totalLengthVal <= 0 ||
                thicknessVal <= 0
            ) {
                setCalculatedMass(
                    "Podaj poprawną, dodatnią całkowitą długość i grubość."
                );
                return;
            }
            mass =
                ((totalLengthVal / 10) * (thicknessVal / 10) * 0.1 * density) /
                1000;
        } else if (shape === "rod") {
            if (!rodDiameter || !rodLength) {
                setCalculatedMass("Uzupełnij średnicę i długość pręta.");
                return;
            }
            const rodDiameterVal = parseFloat(rodDiameter);
            const rodLengthVal = parseFloat(rodLength);

            if (
                isNaN(rodDiameterVal) ||
                isNaN(rodLengthVal) ||
                rodDiameterVal <= 0 ||
                rodLengthVal <= 0
            ) {
                setCalculatedMass(
                    "Podaj poprawne wartości średnicy i długości pręta."
                );
                return;
            }

            const rodRadius = rodDiameterVal / 2;
            const rodArea = Math.PI * rodRadius * rodRadius;
            mass = ((rodArea / 100) * (rodLengthVal / 10) * density) / 1000;
        }

        const calculatedValue = mass.toFixed(2);
        setCalculatedMass(`Masa detalu: ${calculatedValue} kg`);
        onMassUpdate(calculatedValue);
    };

    const handleClear = () => {
        setLength("");
        setWidth("");
        setOuterDiameter("");
        setInnerDiameter("");
        setTotalLength("");
        setThickness("");
        setRodDiameter("");
        setRodLength("");
        setCalculatedMass(null);
    };

    return (
        <>
            <h2>Kalkulator do obliczania masy detalu</h2>
            <ShapeSelector
                shape={shape}
                setShape={setShape}
                isCutting={isCutting}
                showRodShape={showRodShape}
            />

            {shape === "rectangle" && (
                <>
                    <InputField
                        id="length"
                        label="Długość boku A (mm):"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        placeholder="Wpisz długość A w mm"
                    />
                    <InputField
                        id="width"
                        label="Długość boku B (mm):"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        placeholder="Wpisz długość B w mm"
                    />
                    <InputField
                        id="thickness"
                        label="Grubość materiału (mm):"
                        value={thickness}
                        onChange={(e) => setThickness(e.target.value)}
                        placeholder="Wpisz grubość w mm"
                    />
                </>
            )}

            {(shape === "circle" || shape === "semicircle") && (
                <>
                    <InputField
                        id="outerDiameter"
                        label="Średnica zewnętrzna (mm):"
                        value={outerDiameter}
                        onChange={(e) => setOuterDiameter(e.target.value)}
                        placeholder="Wpisz średnicę zewnętrzną w mm"
                    />
                    <InputField
                        id="innerDiameter"
                        label="Średnica wewnętrzna (mm):"
                        value={innerDiameter}
                        onChange={(e) => setInnerDiameter(e.target.value)}
                        placeholder="Wpisz średnicę wewnętrzną w mm (opcjonalnie)"
                    />
                    <InputField
                        id="thickness"
                        label="Grubość materiału (mm):"
                        value={thickness}
                        onChange={(e) => setThickness(e.target.value)}
                        placeholder="Wpisz grubość w mm"
                    />
                </>
            )}

            {shape === "totalLength" && (
                <>
                    <InputField
                        id="totalLength"
                        label="Całkowita długość boków (mm):"
                        value={totalLength}
                        onChange={(e) => setTotalLength(e.target.value)}
                        placeholder="Wpisz całkowitą długość w mm"
                    />
                    <InputField
                        id="thickness"
                        label="Grubość materiału (mm):"
                        value={thickness}
                        onChange={(e) => setThickness(e.target.value)}
                        placeholder="Wpisz grubość w mm"
                    />
                </>
            )}

            {shape === "rod" && showRodShape && (
                <>
                    <InputField
                        id="rodDiameter"
                        label="Średnica pręta (mm):"
                        value={rodDiameter}
                        onChange={(e) => setRodDiameter(e.target.value)}
                        placeholder="Wpisz średnicę pręta w mm"
                    />
                    <InputField
                        id="rodLength"
                        label="Długość pręta (mm):"
                        value={rodLength}
                        onChange={(e) => setRodLength(e.target.value)}
                        placeholder="Wpisz długość pręta w mm"
                    />
                </>
            )}

            <button onClick={handleCalculate}>Oblicz masę</button>
            <button onClick={handleClear}>Wyczyść</button>
            {calculatedMass && <p>{calculatedMass}</p>}
        </>
    );
}

MassCalculator.propTypes = {
    onMassUpdate: PropTypes.func.isRequired,
    isCutting: PropTypes.bool,
    showRodShape: PropTypes.bool,
};
