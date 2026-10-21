import { useState } from "react";
import PropTypes from "prop-types";
import { EMPTY_HOLE, EMPTY_RECT_HOLE } from "../hooks/useHoles";

function HoleRows({ rows, setRows, emptyRow, fields }) {
    const updateRow = (idx, field, value) =>
        setRows((prev) =>
            prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row)),
        );
    const addRow = () => setRows((prev) => [...prev, emptyRow]);
    const removeRow = (idx) =>
        setRows((prev) => prev.filter((_, i) => i !== idx));

    return (
        <div className="holes-rows" style={{ "--cols": fields.length }}>
            <div className="holes-row holes-row--head" aria-hidden="true">
                {fields.map(({ field, label }) => (
                    <span key={field}>{label}</span>
                ))}
                <span />
            </div>
            {rows.map((row, idx) => (
                <div key={idx} className="holes-row">
                    {fields.map(({ field, label }) => (
                        <input
                            key={field}
                            type="text"
                            inputMode="decimal"
                            autoComplete="off"
                            aria-label={`${label}, wiersz ${idx + 1}`}
                            value={row[field]}
                            onChange={(e) => updateRow(idx, field, e.target.value)}
                        />
                    ))}
                    <div className="holes-row-actions">
                        {rows.length > 1 && (
                            <button
                                type="button"
                                className="icon-btn"
                                onClick={() => removeRow(idx)}
                                aria-label="Usuń wiersz"
                            >
                                −
                            </button>
                        )}
                        {idx === rows.length - 1 && (
                            <button
                                type="button"
                                className="icon-btn"
                                onClick={addRow}
                                aria-label="Dodaj wiersz"
                            >
                                +
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

const HOLE_FIELDS = [
    { field: "diameter", label: "Fi (mm)" },
    { field: "count", label: "Ilość" },
];

const RECT_HOLE_FIELDS = [
    { field: "a", label: "Bok A (mm)" },
    { field: "b", label: "Bok B (mm)" },
    { field: "count", label: "Ilość" },
];

const countFilled = (rows) =>
    rows.filter((row) => Object.values(row).some((v) => v.trim() !== "")).length;

/**
 * Rozwijana sekcja otworów kołowych i czworokątnych (stan z useHoles).
 */
export default function HolesOptions({ holes, setHoles, rectHoles, setRectHoles }) {
    const [visible, setVisible] = useState(false);
    const filled = countFilled(holes) + countFilled(rectHoles);

    return (
        <div className="holes">
            <button
                type="button"
                className="btn btn--text holes-toggle"
                onClick={() => setVisible((v) => !v)}
                aria-expanded={visible}
            >
                <span aria-hidden="true">{visible ? "▾" : "▸"}</span>
                Otwory w detalu
                {filled > 0 && (
                    <span className="badge" title="Liczba uzupełnionych wierszy">
                        {filled}
                    </span>
                )}
            </button>
            {visible && (
                <div className="holes-panel">
                    <h3>Otwory kołowe</h3>
                    <HoleRows
                        rows={holes}
                        setRows={setHoles}
                        emptyRow={EMPTY_HOLE}
                        fields={HOLE_FIELDS}
                    />
                    <h3>Otwory czworokątne</h3>
                    <HoleRows
                        rows={rectHoles}
                        setRows={setRectHoles}
                        emptyRow={EMPTY_RECT_HOLE}
                        fields={RECT_HOLE_FIELDS}
                    />
                </div>
            )}
        </div>
    );
}

const rowsPropTypes = PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string));

HoleRows.propTypes = {
    rows: rowsPropTypes.isRequired,
    setRows: PropTypes.func.isRequired,
    emptyRow: PropTypes.objectOf(PropTypes.string).isRequired,
    fields: PropTypes.arrayOf(PropTypes.object).isRequired,
};

HolesOptions.propTypes = {
    holes: rowsPropTypes.isRequired,
    setHoles: PropTypes.func.isRequired,
    rectHoles: rowsPropTypes.isRequired,
    setRectHoles: PropTypes.func.isRequired,
};
