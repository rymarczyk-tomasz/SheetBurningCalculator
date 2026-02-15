import React, { useState, useEffect } from "react";
import Result from "../Result";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";
import GenericForm from "../GenericForm";
import { getFormErrors } from "../formValidation";
import {
  getWeldingLengthFields,
  getWeldingSelectorFields,
} from "./Welding.form";
import {
  clearCalculation,
  loadCalculation,
  saveCalculation,
} from "../../utils/calculationStorage";

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
          cols[j] === undefined || cols[j] === "" ? null : parseFloat(cols[j]);
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

    out.push({ key: "pachwina_a", label: "Pachwina a" });
    out.push({
      key: "pachwina_z",
      label: "Pachwina z",
    });

    types.forEach((t) => {
      if (t.toLowerCase() === "pachwina") return;
      out.push({ key: t, label: t });
    });
    return out;
  };

  useEffect(() => {
    const stored = loadCalculation("welding");
    if (stored) {
      setTotalLength(stored.totalLength ?? "");
      setResult(stored.result ?? "");
      setWeldType(stored.weldType ?? "pachwina_a");
      setWeldSize(stored.weldSize ?? "");
      setWeldPosition(stored.weldPosition ?? "PA");
    } else {
      setTotalLength("");
      setResult("");
      setWeldType("pachwina_a");
      setWeldSize("");
      setWeldPosition("PA");
    }

    async function init() {
      const { types: t, table: tbl } = await loadSpawanieCSV();
      setTypes(t);
      setTable(tbl);

      if (stored?.weldType) {
        return;
      }

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
        lv + ((uv - lv) * (target - lower.size)) / (upper.size - lower.size)
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
      setResult("Proszę wybrać pozycję spawania (PA, PB, PF, PG, PC, PD, PE).");
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
      lookupColumn,
    );
    setLoading(false);

    if (baseMultiplier === null || baseMultiplier === undefined) {
      setResult(
        "Brak wartości normatywnej dla wybranego typu/wielkości spoiny (po przeliczeniu, jeśli dotyczy).",
      );
      return;
    }

    const positionFactor = getPositionFactor(weldPosition);

    const timeHours =
      (totalLengthValue / 1000) * baseMultiplier * positionFactor;

    let chosenLabel = weldType;
    if (weldType === "pachwina_a") chosenLabel = "Pachwina a";
    if (weldType === "pachwina_z") chosenLabel = "Pachwina z";

    let extraNote = "";
    if (weldType === "pachwina_z") {
      extraNote = `(wielkość spoiny ${sizeValue} )`;
    }

    const message = `Szacowany czas spawania (${chosenLabel}) w pozycji ${weldPosition}: ${timeHours.toFixed(
      2,
    )} h.`;
    saveCalculation("welding", {
      totalLength,
      weldType,
      weldSize,
      weldPosition,
      result: message,
    });
    setResult(message);
  }

  function handleClear() {
    setTotalLength("");
    setResult("");
    setWeldType(
      types.includes("pachwina") ? "pachwina_a" : types[0] || "pachwina_a",
    );
    setWeldSize("");
    setWeldPosition("PA");
    clearCalculation("welding");
  }

  useKeyShortcuts({
    onEnter: handleCalculate,
    onEscape: handleClear,
  });

  const displayTypes = getDisplayTypes();
  const weldTypeOptions = displayTypes.map((t) => ({
    value: t.key,
    label: t.label,
  }));
  const weldPositionOptions = [
    { value: "PA", label: "PA" },
    { value: "PB", label: "PB" },
    { value: "PF", label: "PF" },
    { value: "PG", label: "PG" },
    { value: "PC", label: "PC" },
    { value: "PD", label: "PD" },
    { value: "PE", label: "PE" },
  ];

  const selectorFields = getWeldingSelectorFields({
    weldType,
    setWeldType,
    weldPosition,
    setWeldPosition,
    weldSize,
    setWeldSize,
    weldTypeOptions,
    weldPositionOptions,
  });
  const lengthFields = getWeldingLengthFields({
    totalLength,
    setTotalLength,
  });

  const { errors: selectorErrors, hasErrors: selectorsHasErrors } =
    getFormErrors(selectorFields);
  const { errors: lengthErrors, hasErrors: lengthHasErrors } =
    getFormErrors(lengthFields);
  const hasErrors = selectorsHasErrors || lengthHasErrors;

  return (
    <>
      <div className="welding-selectors">
        <GenericForm
          fields={selectorFields}
          errors={selectorErrors}
          hasErrors={hasErrors}
          onSubmit={handleCalculate}
        />
      </div>

      <GenericForm
        fields={lengthFields}
        errors={lengthErrors}
        hasErrors={hasErrors}
        onSubmit={handleCalculate}
      />

      <div className="welding-actions">
        <button onClick={handleCalculate} disabled={loading || hasErrors}>
          {loading ? "Obliczanie..." : "Oblicz"}
        </button>
        <button onClick={handleClear}>Wyczyść</button>
      </div>

      <Result result={result} />
    </>
  );
}
