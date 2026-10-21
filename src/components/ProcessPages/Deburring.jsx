import ShapeSelector from "../ShapeSelector";
import ShapeDimensionFields from "../ShapeDimensionFields";
import HolesOptions from "../HolesOptions";
import CalculatorActions from "../CalculatorActions";
import Result from "../Result";
import useShapeDimensions from "../../hooks/useShapeDimensions";
import useHoles from "../../hooks/useHoles";
import useCalculation from "../../hooks/useCalculation";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";
import { getPerimeterTime } from "../../utils/geometry";
import { timeResultLine } from "../../utils/resultLine";

/** Mnożnik gratowania [h/m]. */
const DEBURRING_MULTIPLIER = 0.03;

export default function Deburring() {
    const { shape, setShape, dims, setDim, resetDims } = useShapeDimensions();
    const { holes, setHoles, rectHoles, setRectHoles, resetHoles } = useHoles();
    const { result, run, clearResult, pending } = useCalculation();

    const handleCalculate = () =>
        run(() => {
            const hours = getPerimeterTime(
                { shape, dims, holes, rectHoles },
                DEBURRING_MULTIPLIER,
            );
            const time = hours.toFixed(2);
            return timeResultLine(`Czas gratowania: ${time} h`, time);
        });

    const handleClear = () => {
        resetDims();
        resetHoles();
        clearResult();
    };

    useKeyShortcuts({ onEnter: handleCalculate, onEscape: handleClear });

    return (
        <>
            <ShapeSelector shape={shape} setShape={setShape} />
            <ShapeDimensionFields shape={shape} dims={dims} setDim={setDim} />
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
