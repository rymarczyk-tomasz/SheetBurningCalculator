import React, { useState, useEffect } from "react";
import Result from "../Result";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";

const NOMINAL_SIZE_MAP = {
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
        const lines = text.split(/\r?\n/).filter((l) => l.trim());
        if (!lines.length) return { schedules: [], data: [] };

        const header = lines[0].split(",").map((h) => h.trim());
        const scheduleHeaders = header.slice(2);

        const data = lines
            .slice(1)
            .map((line) => {
                const cols = line.split(",").map((c) => c.trim());
                const [nominalSize, outerDiamStr] = cols;
                if (!nominalSize) return null;

                const values = {};
                header.slice(2).forEach((scheduleLabel, idx) => {
                    const val = cols[idx + 2];
                    values[scheduleLabel] =
                        val && val !== "" ? parseFloat(val) : null;
                });

                return {
                    nominalSize,
                    outerDiameter: parseFloat(outerDiamStr) || null,
                    values,
                };
            })
            .filter(Boolean);

        return { schedules: scheduleHeaders, data };
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
        (async () => {
            setLoading(true);
            const { schedules: schs, data } = await loadPipeCSV();
            setSchedules(schs);
            setPipeData(data);
            setSchedule(schs[0] || "Sch40");
            setLoading(false);
        })();
    }, []);

    const normalizeNominalSize = (input) => {
        if (!input) return null;

        const normalized = input.trim().replace(",", ".");

        const exact = pipeData.find(
            (d) => d.nominalSize.toLowerCase() === normalized.toLowerCase()
        );
        if (exact) return exact.nominalSize;

        const decimal = parseFloat(normalized);
        if (!isNaN(decimal) && NOMINAL_SIZE_MAP[decimal]) {
            const mapped = NOMINAL_SIZE_MAP[decimal];
            const found = pipeData.find(
                (d) => d.nominalSize.toLowerCase() === mapped.toLowerCase()
            );
            if (found) return found.nominalSize;
        }

        return null;
    };

    const handleCalculate = () => {
        if (!nominalSize.trim()) {
            setResult("Proszę podać nominalną wielkość rury.");
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

        const thickness = pipeEntry?.values[schedule];
        if (!thickness) {
            setResult("Brak grubości ścianki dla tej rury.");
            return;
        }

        const diamDisplay = pipeEntry.outerDiameter
            ? `${pipeEntry.outerDiameter}x${thickness}`
            : `${thickness}`;

        setResult(
            `Wymiary rury (${normalized}, ${schedule}): ${diamDisplay} mm`
        );
    };

    const handleClear = () => {
        setNominalSize("");
        setSchedule(schedules[0] || "Sch40");
        setResult("");
    };

    useKeyShortcuts({ onEnter: handleCalculate, onEscape: handleClear });

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
