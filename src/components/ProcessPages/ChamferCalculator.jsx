import { useId, useState } from "react";
import PropTypes from "prop-types";
import ShapeSelector from "../ShapeSelector";
import ShapeDimensionFields from "../ShapeDimensionFields";
import InputField from "../InputField";
import CalculatorActions from "../CalculatorActions";
import Result from "../Result";
import useShapeDimensions from "../../hooks/useShapeDimensions";
import useCalculation from "../../hooks/useCalculation";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";
import { UserError } from "../../utils/errors";
import { getPerimeterTime } from "../../utils/geometry";
import { parsePositive } from "../../utils/parseNumber";
import { timeResultLine } from "../../utils/resultLine";

const SIDE_OPTIONS = [
    { value: "single", label: "Jednostronne", factor: 1 },
    { value: "double", label: "Dwustronne", factor: 2 },
];

/**
 * Wspólny widok fazowania (ukosowanie / frezowanie): obrys detalu x mnożnik x liczba stron.
 * getMultiplier(wielkośćFazy) zwraca mnożnik [h/m] (może być async) lub null.
 */
export default function ChamferCalculator({ resultLabel, getMultiplier }) {
    const radioName = useId();
    const { shape, setShape, dims, setDim, resetDims } = useShapeDimensions();
    const [chamferSize, setChamferSize] = useState("");
    const [side, setSide] = useState("single");
    const { result, run, clearResult, pending } = useCalculation();

    const handleCalculate = () =>
        run(async () => {
            const size = parsePositive(
                chamferSize,
                "Proszę podać prawidłową wielkość fazy.",
            );
            const multiplier = await getMultiplier(size);
            if (!multiplier) {
                throw new UserError("Brak normatywu dla podanej wielkości fazy.");
            }

            const sideOption = SIDE_OPTIONS.find((o) => o.value === side);
            const hours =
                getPerimeterTime({ shape, dims }, multiplier) * sideOption.factor;
            const time = hours.toFixed(2);
            return timeResultLine(
                `${resultLabel} (${sideOption.label.toLowerCase()}): ${time} h`,
                time,
            );
        });

    const handleClear = () => {
        resetDims();
        setChamferSize("");
        setSide("single");
        clearResult();
    };

    useKeyShortcuts({ onEnter: handleCalculate, onEscape: handleClear });

    return (
        <>
            <div className="radio-group">
                {SIDE_OPTIONS.map(({ value, label }) => (
                    <label key={value} className="radio-label">
                        <input
                            type="radio"
                            name={radioName}
                            value={value}
                            checked={side === value}
                            onChange={() => setSide(value)}
                        />
                        {label}
                    </label>
                ))}
            </div>
            <ShapeSelector shape={shape} setShape={setShape} />
            <ShapeDimensionFields shape={shape} dims={dims} setDim={setDim} />
            <InputField
                label="Wielkość fazy na stronę (mm):"
                value={chamferSize}
                onChange={setChamferSize}
                placeholder="Wpisz wielkość fazy w mm"
            />
            <CalculatorActions
                onCalculate={handleCalculate}
                onClear={handleClear}
                pending={pending}
            />
            <Result result={result} />
        </>
    );
}

ChamferCalculator.propTypes = {
    resultLabel: PropTypes.string.isRequired,
    getMultiplier: PropTypes.func.isRequired,
};
