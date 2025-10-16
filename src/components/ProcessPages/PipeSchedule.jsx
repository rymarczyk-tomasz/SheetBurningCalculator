import React, { useState, useEffect } from "react";
import InputField from "../InputField";
import Result from "../Result";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";

const nominalSizeMap = {
    0.25: "1/4",
    0.375: "3/8",
    0.5: "1/2",
    0.75: "3/4",
    1: "1",
    1.25: "1 1/4",
    1.5: "1 1/2",
    2: "2",
    2.5: "2 1/2",
    3: "3",
    3.5: "3 1/2",
    4: "4",
    5: "5",
    6: "6",
    8: "8",
    10: "10",
    12: "12",
    14: "14",
    16: "16",
    18: "18",
    20: "20",
    22: "22",
    24: "24",
    26: "26",
    28: "28",
    30: "30",
    32: "32",
    34: "34",
    36: "36",
    38: "38",
    40: "40",
    42: "42",
    44: "44",
    46: "46",
    48: "48",
};

async function loadPipeCSV() {
    try {
        const res = await fetch("/SheetBurningCalculator/pipe_diametes.csv");
        if (!res.ok) throw new Error("Nie można załadować pliku CSV");
        const text = await res.text();
        const lines = text
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter((l) => l);

        if (!lines.length) return { schedules: [], data: [] };

        const header = lines[0].split(",").map((h) => h.trim());

        const scheduleHeaders = header.slice(2);

        const parsed = [];
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(",").map((c) => c.trim());
            const nominalSize = cols[0];
            const outerDiameter = parseFloat(cols[1]);

            if (!nominalSize) continue;

            const values = {};
            for (let j = 2; j < header.length; j++) {
                const scheduleLabel = header[j];
                const v =
                    cols[j] === "" || cols[j] === undefined
                        ? null
                        : parseFloat(cols[j]);
                values[scheduleLabel] = isNaN(v) ? null : v;
            }

            parsed.push({
                nominalSize,
                outerDiameter: isNaN(outerDiameter) ? null : outerDiameter,
                values,
            });
        }

        return { schedules: scheduleHeaders, data: parsed };
    } catch (e) {
        console.error("Błąd podczas ładowania pipe_diametes.csv:", e);
        return { schedules: [], data: [] };
    }
}

export default function PipeSchedule() {
    const [nominalSize, setNominalSize] = useState("");
    const [schedule, setSchedule] = useState("Sch40");
    const [result, setResult] = useState("");
    const [schedules, setSchedules] = useState([]);
    const [pipeData, setPipeData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function init() {
            setLoading(true);
            const { schedules: schs, data } = await loadPipeCSV();
            setSchedules(schs);
            setPipeData(data);
            setLoading(false);

            if (schs.length > 0) {
                setSchedule(schs[0]);
            }
        }

        init();
    }, []);

    const normalizeNominalSize = (input) => {
        if (!input) return null;

        const trimmed = input.trim().replace(",", ".");

        const exact = pipeData.find(
            (d) => d.nominalSize.toLowerCase() === trimmed.toLowerCase()
        );
        if (exact) return exact.nominalSize;

        const decimal = parseFloat(trimmed);
        if (!isNaN(decimal)) {
            if (nominalSizeMap[decimal]) {
                const mapped = nominalSizeMap[decimal];
                const found = pipeData.find(
                    (d) => d.nominalSize.toLowerCase() === mapped.toLowerCase()
                );
                if (found) return found.nominalSize;
            }

            const key = decimal.toString();
            if (nominalSizeMap[key]) {
                const mapped = nominalSizeMap[key];
                const found = pipeData.find(
                    (d) => d.nominalSize.toLowerCase() === mapped.toLowerCase()
                );
                if (found) return found.nominalSize;
            }
        }

        return null;
    };

    const handleCalculate = () => {
        if (!nominalSize.trim()) {
            setResult("Proszę podać nominalną wielkość rury.");
            return;
        }

        if (!schedule) {
            setResult("Proszę wybrać typ Schedule.");
            return;
        }

        const normalized = normalizeNominalSize(nominalSize);

        if (!normalized) {
            setResult("Nie znaleziono wielkości rury w bazie danych.");
            return;
        }

        const pipeEntry = pipeData.find(
            (d) => d.nominalSize.toLowerCase() === normalized.toLowerCase()
        );

        if (!pipeEntry) {
            setResult("Nie znaleziono wielkości rury w bazie danych.");
            return;
        }

        const thickness = pipeEntry.values[schedule];

        if (thickness === null || thickness === undefined) {
            setResult("Brak grubości ścianki dla tej rury.");
            return;
        }

        const outerDiam = pipeEntry.outerDiameter;
        const diamDisplay = outerDiam
            ? `${outerDiam}x${thickness}`
            : `${thickness}`;

        setResult(
            `Wymiary rury (${normalized}, ${schedule}): ${diamDisplay} mm`
        );
    };

    const handleClear = () => {
        setNominalSize("");
        setSchedule(schedules.length > 0 ? schedules[0] : "Sch40");
        setResult("");
    };

    useKeyShortcuts({
        onEnter: handleCalculate,
        onEscape: handleClear,
    });

    return (
        <>
            <div className="pipe-schedule-container">
                <div className="form-group">
                    <label htmlFor="nominalSize">
                        Nominalna wielkość rury (np. 1/4, 0.25 lub 0,25):
                    </label>
                    <input
                        type="text"
                        id="nominalSize"
                        value={nominalSize}
                        onChange={(e) => setNominalSize(e.target.value)}
                        placeholder='Wpisz wielkość (np. "1/4", "2 1/2", "2.5", "2,5")'
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="schedule">Typ Schedule:</label>
                    <select
                        id="schedule"
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

            <button onClick={handleCalculate} disabled={loading}>
                {loading ? "Ładowanie..." : "Oblicz"}
            </button>
            <button onClick={handleClear}>Wyczyść</button>
            <Result result={result} />
        </>
    );
}
