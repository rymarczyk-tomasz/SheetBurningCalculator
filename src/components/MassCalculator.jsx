import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import InputField from "./InputField";
import ShapeSelector from "./ShapeSelector";
import ShapeDimensionFields from "./ShapeDimensionFields";
import useShapeDimensions from "../hooks/useShapeDimensions";
import { calculateMass } from "../utils/mass";
import { UserError } from "../utils/errors";

/**
 * Pomocniczy kalkulator masy detalu. Wyliczoną masę przekazuje do rodzica przez onMassUpdate.
 * Gdy podano onThicknessChange, grubość jest współdzielona z formularzem rodzica.
 * Aby wyczyścić kalkulator, rodzic zmienia jego `key`.
 */
export default function MassCalculator({
    onMassUpdate,
    thickness: parentThickness = "",
    onThicknessChange,
}) {
    const { shape, setShape, dims, setDim } = useShapeDimensions();
    const [localThickness, setLocalThickness] = useState("");
    const isThicknessLinked = onThicknessChange !== undefined;
    const thickness = isThicknessLinked ? parentThickness : localThickness;
    const setThickness = isThicknessLinked
        ? onThicknessChange
        : setLocalThickness;

    let massText = null;
    let error = null;
    try {
        const mass = calculateMass(shape, dims, thickness);
        if (mass !== null) massText = mass.toFixed(2);
    } catch (e) {
        if (!(e instanceof UserError)) throw e;
        error = e.message;
    }

    // Czyścimy masę u rodzica tylko wtedy, gdy wcześniej ją tu wyliczyliśmy —
    // nie nadpisujemy masy wpisanej ręcznie.
    const hasNotified = useRef(false);
    useEffect(() => {
        if (massText !== null) {
            onMassUpdate(massText);
            hasNotified.current = true;
        } else if (hasNotified.current) {
            onMassUpdate("");
            hasNotified.current = false;
        }
    }, [massText, onMassUpdate]);

    return (
        <section className="mass-calculator" aria-label="Kalkulator masy detalu">
            <h3>Kalkulator masy detalu</h3>
            <p className="mass-calculator-hint">
                Wyliczona masa zostanie automatycznie wpisana do pola masy.
            </p>
            <ShapeSelector shape={shape} setShape={setShape} showRodShape />
            <ShapeDimensionFields shape={shape} dims={dims} setDim={setDim} />
            {shape !== "rod" && (
                <InputField
                    label="Grubość materiału (mm):"
                    value={thickness}
                    onChange={setThickness}
                    placeholder="Wpisz grubość w mm"
                />
            )}
            {massText !== null && (
                <p className="mass-calculator-result">
                    Masa detalu: <strong>{massText.replace(".", ",")} kg</strong>
                </p>
            )}
            {error && <p className="result--error-text">{error}</p>}
        </section>
    );
}

MassCalculator.propTypes = {
    onMassUpdate: PropTypes.func.isRequired,
    thickness: PropTypes.string,
    onThicknessChange: PropTypes.func,
};
