import React, { useState, useEffect } from "react";
import InputField from "../InputField";
import Result from "../Result";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";

async function loadSpawanieCSV() {
    try {
        const res = await fetch("/SheetBurningCalculator/spawanie.csv");
        const text = await res.text();
        const lines = text
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter((l) => l);
        if (!lines.length) return { types: [], table: [] };
        const header = lines[0].split(",").map((h) => h.trim());
        const typeCols = header.slice(1);
        const parsed = [];
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(",").map((c) => c.trim());
            const size = parseFloat(cols[0]);
            if (isNaN(size)) continue;
            const values = {};
            for (let j = 1; j < header.length; j++) {
                const label = header[j];
                const v =
                    cols[j] === undefined || cols[j] === ""
                        ? null
                        : parseFloat(cols[j]);
                values[label] = isNaN(v) ? null : v;
            }
            parsed.push({ size, values });
        }
        parsed.sort((a, b) => a.size - b.size);
        return { types: typeCols, table: parsed };
    } catch (e) {
        console.error("Błąd podczas ładowania spawanie.csv:", e);
        return { types: [], table: [] };
    }
}

export default function Welding() {
    const [totalLength, setTotalLength] = useState("");
    const [result, setResult] = useState("");

    const [weldType, setWeldType] = useState("pachwina_a");
    const [weldSize, setWeldSize] = useState("");
    const [weldPosition, setWeldPosition] = useState("PA");
    const [loading, setLoading] = useState(false);

    const [table, setTable] = useState([]);
    const [types, setTypes] = useState([]);

    const getDisplayTypes = () => {
        const out = [];

        out.push({ key: "pachwina_a", label: "pachwina a" });
        out.push({
            key: "pachwina_z",
            label: "pachwina z",
        });

        types.forEach((t) => {
            if (t.toLowerCase() === "pachwina") return;
            out.push({ key: t, label: t });
        });
        return out;
    };

    useEffect(() => {
        setTotalLength("");
        setResult("");
        setWeldType("pachwina_a");
        setWeldSize("");
        setWeldPosition("PA");

        async function init() {
            const { types: t, table: tbl } = await loadSpawanieCSV();
            setTypes(t);
            setTable(tbl);

            if (t.includes("pachwina")) {
                setWeldType("pachwina_a");
            } else {
                setWeldType(t[0] || "pachwina_a");
            }
        }

        init();
    }, []);

    function getMultiplierFromTable(targetSize, typeLabel) {
        if (!table.length || !typeLabel) return null;
        const target = parseFloat(targetSize);
        if (isNaN(target)) return null;

        const rowsWithVal = table.filter((r) => r.values[typeLabel] !== null);
        if (!rowsWithVal.length) return null;

        for (const row of rowsWithVal) {
            if (row.size === target) return row.values[typeLabel];
        }

        let lower = null;
        let upper = null;
        for (const row of rowsWithVal) {
            if (row.size < target) lower = row;
            if (row.size > target && !upper) upper = row;
        }

        if (lower && upper) {
            const lv = lower.values[typeLabel];
            const uv = upper.values[typeLabel];
            if (lv == null || uv == null) return lv ?? uv;
            return (
                lv +
                ((uv - lv) * (target - lower.size)) / (upper.size - lower.size)
            );
        }

        if (lower) return lower.values[typeLabel];
        if (upper) return upper.values[typeLabel];
        return null;
    }

    function validateFloatInput(val) {
        if (typeof val !== "string") val = String(val);
        const normalized = val.replace(",", ".").trim();
        if (normalized === "") return NaN;
        return parseFloat(normalized);
    }

    function getPositionFactor(pos) {
        if (!pos) return 1.0;
        const map = {
            PA: 1.0,
            PB: 1.0,
            PF: 1.5,
            PG: 1.5,
            PC: 1.6,
            PD: 1.6,
            PE: 2.0,
        };
        return map[pos] ?? 1.0;
    }

    async function handleCalculate() {
        const totalLengthValue = validateFloatInput(totalLength);
        const sizeValue = validateFloatInput(weldSize);

        if (isNaN(totalLengthValue) || totalLengthValue <= 0) {
            setResult("Proszę podać prawidłową całkowitą długość spawania.");
            return;
        }
        if (!weldType) {
            setResult("Proszę wybrać rodzaj spoiny.");
            return;
        }
        if (isNaN(sizeValue) || sizeValue <= 0) {
            setResult("Proszę podać prawidłową wielkość spoiny (liczba).");
            return;
        }
        if (!weldPosition) {
            setResult(
                "Proszę wybrać pozycję spawania (PA, PB, PF, PG, PC, PD, PE)."
            );
            return;
        }

        setLoading(true);

        let lookupSize = sizeValue;
        let lookupColumn = weldType;

        if (weldType === "pachwina_a" || weldType === "pachwina_z") {
            lookupColumn = "pachwina";
            if (weldType === "pachwina_z") {
                lookupSize = sizeValue / 1.41;
            } else {
                lookupSize = sizeValue;
            }
        } else {
            lookupColumn = weldType;
            lookupSize = sizeValue;
        }

        const lookupSizeRounded = Math.round(lookupSize * 1000) / 1000;

        const baseMultiplier = getMultiplierFromTable(
            lookupSizeRounded,
            lookupColumn
        );
        setLoading(false);

        if (baseMultiplier === null || baseMultiplier === undefined) {
            setResult(
                "Brak wartości normatywnej dla wybranego typu/wielkości spoiny (po przeliczeniu, jeśli dotyczy)."
            );
            return;
        }

        const positionFactor = getPositionFactor(weldPosition);

        const timeHours =
            (totalLengthValue / 1000) * baseMultiplier * positionFactor;

        let chosenLabel = weldType;
        if (weldType === "pachwina_a") chosenLabel = "pachwina a";
        if (weldType === "pachwina_z") chosenLabel = "pachwina z";

        let extraNote = "";
        if (weldType === "pachwina_z") {
            extraNote = `(wielkość spoiny ${sizeValue} )`;
        }

        setResult(
            `Szacowany czas spawania (${chosenLabel}) w pozycji ${weldPosition}: ${timeHours.toFixed(
                2
            )} h.`
        );
    }

    function handleClear() {
        setTotalLength("");
        setResult("");
        setWeldType(
            types.includes("pachwina") ? "pachwina_a" : types[0] || "pachwina_a"
        );
        setWeldSize("");
        setWeldPosition("PA");
    }

    useKeyShortcuts({
        onEnter: handleCalculate,
        onEscape: handleClear,
    });

    const displayTypes = getDisplayTypes();

    return (
        <>
            <div className="welding-selectors">
                <label>
                    Rodzaj spoiny:
                    <select
                        value={weldType}
                        onChange={(e) => setWeldType(e.target.value)}
                    >
                        {displayTypes.map((t) => (
                            <option key={t.key} value={t.key}>
                                {t.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Pozycja spawania:
                    <select
                        value={weldPosition}
                        onChange={(e) => setWeldPosition(e.target.value)}
                    >
                        <option value="PA">PA</option>
                        <option value="PA">PB</option>
                        <option value="PF">PF</option>
                        <option value="PF">PG</option>
                        <option value="PC">PC</option>
                        <option value="PC">PD</option>
                        <option value="PE">PE</option>
                    </select>
                </label>

                <InputField
                    id="weldSize"
                    label="Wielkość spoiny:"
                    value={weldSize}
                    onChange={(e) => setWeldSize(e.target.value)}
                    placeholder="Wpisz wielkość spoiny"
                />
            </div>

            <InputField
                id="totalLength"
                label="Całkowita długość spawania (mm):"
                value={totalLength}
                onChange={(e) => setTotalLength(e.target.value)}
                placeholder="Wpisz całkowitą długość spawania w mm"
            />

            <div className="welding-actions">
                <button onClick={handleCalculate} disabled={loading}>
                    {loading ? "Obliczanie..." : "Oblicz"}
                </button>
                <button onClick={handleClear}>Wyczyść</button>
            </div>

            <Result result={result} />
        </>
    );
}
