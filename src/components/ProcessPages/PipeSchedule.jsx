import { useEffect, useId, useState } from "react";
import CalculatorActions from "../CalculatorActions";
import Result from "../Result";
import useCalculation from "../../hooks/useCalculation";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";
import { loadCsvRows } from "../../utils/loadCsv";
import { UserError } from "../../utils/errors";
import { findPipe, parsePipeTable } from "../../utils/pipes";
import { resultLine } from "../../utils/resultLine";

const DEFAULT_SCHEDULE = "Sch40";

export default function PipeSchedule() {
    const sizeInputId = useId();
    const scheduleSelectId = useId();
    const [nominalSize, setNominalSize] = useState("");
    const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
    const [schedules, setSchedules] = useState([]);
    const [pipeData, setPipeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const { result, run, clearResult, pending } = useCalculation();

    useEffect(() => {
        let cancelled = false;
        loadCsvRows(`${import.meta.env.BASE_URL}pipe_diameters.csv`)
            .then((rows) => {
                if (cancelled) return;
                const parsed = parsePipeTable(rows);
                setSchedules(parsed.schedules);
                setPipeData(parsed.data);
            })
            .catch((err) => {
                if (!cancelled) setLoadError(err.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const handleCalculate = () =>
        run(() => {
            if (!nominalSize.trim()) {
                throw new UserError("Proszę podać nominalną wielkość rury.");
            }
            const pipe = findPipe(pipeData, nominalSize);
            if (!pipe) {
                throw new UserError("Nie znaleziono wielkości rury w bazie danych.");
            }
            const thickness = pipe.values[schedule];
            if (!thickness) {
                throw new UserError("Brak grubości ścianki dla tej rury.");
            }

            const dimensions = pipe.outerDiameter
                ? `${pipe.outerDiameter}x${thickness}`
                : `${thickness}`;
            return resultLine(
                `Wymiary rury (${pipe.nominalSize}, ${schedule}): ${dimensions} mm`,
                dimensions,
            );
        });

    const handleClear = () => {
        setNominalSize("");
        setSchedule(DEFAULT_SCHEDULE);
        clearResult();
    };

    useKeyShortcuts({ onEnter: handleCalculate, onEscape: handleClear });

    return (
        <>
            <div className="pipe-schedule-container">
                <div className="form-group">
                    <label htmlFor={sizeInputId}>
                        Nominalna wielkość rury (np. 1/4, 0.25 lub 0,25):
                    </label>
                    <input
                        type="text"
                        id={sizeInputId}
                        autoComplete="off"
                        value={nominalSize}
                        onChange={(e) => setNominalSize(e.target.value)}
                        placeholder='Wpisz wielkość (np. "1/4", "2 1/2", "2.5", "2,5")'
                    />
                </div>

                <div className="form-group">
                    <label htmlFor={scheduleSelectId}>Typ Schedule:</label>
                    <select
                        id={scheduleSelectId}
                        value={schedule}
                        onChange={(e) => setSchedule(e.target.value)}
                    >
                        {schedules.map((sch) => (
                            <option key={sch} value={sch}>
                                {sch}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loadError && <p className="result--error-text">{loadError}</p>}
            <CalculatorActions
                onCalculate={handleCalculate}
                onClear={handleClear}
                pending={loading || pending}
                pendingLabel={loading ? "Ładowanie..." : undefined}
            />
            <Result result={result} />
        </>
    );
}
