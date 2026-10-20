import { useEffect, useId, useState } from "react";
import InputField from "../InputField";
import CalculatorActions from "../CalculatorActions";
import Result from "../Result";
import useCalculation from "../../hooks/useCalculation";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";
import { loadCsvRows } from "../../utils/loadCsv";
import { timeResultLine } from "../../utils/resultLine";
import {
    calculateWeldingTime,
    parseWeldingTable,
    WELD_POSITIONS,
} from "../../utils/welding";

const FILLET_TYPES = [
    { key: "pachwina_a", label: "Pachwina a" },
    { key: "pachwina_z", label: "Pachwina z" },
];

export default function Welding() {
    const typeSelectId = useId();
    const positionSelectId = useId();
    const [totalLength, setTotalLength] = useState("");
    const [weldType, setWeldType] = useState("pachwina_a");
    const [weldSize, setWeldSize] = useState("");
    const [weldPosition, setWeldPosition] = useState("PA");
    const [types, setTypes] = useState([]);
    const [table, setTable] = useState([]);
    const [loadError, setLoadError] = useState(null);
    const { result, run, clearResult, pending } = useCalculation();

    useEffect(() => {
        let cancelled = false;
        loadCsvRows(`${import.meta.env.BASE_URL}spawanie.csv`)
            .then((rows) => {
                if (cancelled) return;
                const parsed = parseWeldingTable(rows);
                setTypes(parsed.types);
                setTable(parsed.table);
            })
            .catch((err) => {
                if (!cancelled) setLoadError(err.message);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const displayTypes = [
        ...FILLET_TYPES,
        ...types
            .filter((t) => t.toLowerCase() !== "pachwina")
            .map((t) => ({ key: t, label: t })),
    ];

    const handleCalculate = () =>
        run(() => {
            const hours = calculateWeldingTime({
                table,
                weldType,
                size: weldSize,
                length: totalLength,
                position: weldPosition,
            });
            const label =
                displayTypes.find((t) => t.key === weldType)?.label ?? weldType;
            const time = hours.toFixed(2);
            return timeResultLine(
                `Szacowany czas spawania (${label}) w pozycji ${weldPosition}: ${time} h`,
                time,
            );
        });

    const handleClear = () => {
        setTotalLength("");
        setWeldType("pachwina_a");
        setWeldSize("");
        setWeldPosition("PA");
        clearResult();
    };

    useKeyShortcuts({ onEnter: handleCalculate, onEscape: handleClear });

    return (
        <>
            <div className="welding-selectors">
                <div className="form-group">
                    <label htmlFor={typeSelectId}>Rodzaj spoiny:</label>
                    <select
                        id={typeSelectId}
                        value={weldType}
                        onChange={(e) => setWeldType(e.target.value)}
                    >
                        {displayTypes.map((t) => (
                            <option key={t.key} value={t.key}>
                                {t.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor={positionSelectId}>Pozycja spawania:</label>
                    <select
                        id={positionSelectId}
                        value={weldPosition}
                        onChange={(e) => setWeldPosition(e.target.value)}
                    >
                        {WELD_POSITIONS.map((pos) => (
                            <option key={pos} value={pos}>
                                {pos}
                            </option>
                        ))}
                    </select>
                </div>
                <InputField
                    label="Wielkość spoiny (mm):"
                    value={weldSize}
                    onChange={setWeldSize}
                    placeholder="Wpisz wielkość spoiny w mm"
                />
            </div>

            <InputField
                label="Całkowita długość spawania (mm):"
                value={totalLength}
                onChange={setTotalLength}
                placeholder="Wpisz całkowitą długość spawania w mm"
            />

            {loadError && <p className="result--error-text">{loadError}</p>}
            <CalculatorActions
                onCalculate={handleCalculate}
                onClear={handleClear}
                pending={pending}
            />
            <Result result={result} />
        </>
    );
}
