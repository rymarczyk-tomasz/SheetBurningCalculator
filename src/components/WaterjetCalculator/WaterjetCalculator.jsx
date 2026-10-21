import { useId, useState } from "react";
import ShapeSelector from "../ShapeSelector";
import ShapeDimensionFields from "../ShapeDimensionFields";
import HolesOptions from "../HolesOptions";
import InputField from "../InputField";
import CalculatorActions from "../CalculatorActions";
import Result from "../Result";
import useShapeDimensions from "../../hooks/useShapeDimensions";
import useHoles from "../../hooks/useHoles";
import useCalculation from "../../hooks/useCalculation";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";
import { waterjetCalculator } from "../../utils/calculators/waterjetCalculator";

const WATERJET_TYPES = [
    { value: "czarna", label: "Blacha czarna" },
    { value: "nierdzewka", label: "Blacha nierdzewna" },
];

export default function WaterjetCalculator() {
    const radioName = useId();
    const { shape, setShape, dims, setDim, resetDims } = useShapeDimensions();
    const { holes, setHoles, rectHoles, setRectHoles, resetHoles } = useHoles();
    const [thickness, setThickness] = useState("");
    const [waterjetType, setWaterjetType] = useState("czarna");
    const { result, run, clearResult, pending } = useCalculation();

    const handleCalculate = () =>
        run(() =>
            waterjetCalculator({
                shape,
                dims,
                thickness,
                holes,
                rectHoles,
                waterjetType,
            }),
        );

    const handleClear = () => {
        resetDims();
        resetHoles();
        setThickness("");
        clearResult();
    };

    useKeyShortcuts({ onEnter: handleCalculate, onEscape: handleClear });

    return (
        <>
            <div className="radio-group">
                {WATERJET_TYPES.map(({ value, label }) => (
                    <label key={value} className="radio-label">
                        <input
                            type="radio"
                            name={radioName}
                            value={value}
                            checked={waterjetType === value}
                            onChange={() => setWaterjetType(value)}
                        />
                        {label}
                    </label>
                ))}
            </div>
            <ShapeSelector shape={shape} setShape={setShape} />
            <ShapeDimensionFields shape={shape} dims={dims} setDim={setDim} />
            <InputField
                label="Grubość blachy (mm):"
                value={thickness}
                onChange={setThickness}
                placeholder="Wpisz grubość w mm"
            />
            <HolesOptions
                holes={holes}
                setHoles={setHoles}
                rectHoles={rectHoles}
                setRectHoles={setRectHoles}
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
