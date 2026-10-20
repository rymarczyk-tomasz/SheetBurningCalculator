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

    return rows.map((row, idx) => (
        <div key={idx} className="extra-options-row">
            {fields.map(({ field, placeholder, className }) => (
                <input
                    key={field}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder={placeholder}
                    aria-label={placeholder}
                    value={row[field]}
                    onChange={(e) => updateRow(idx, field, e.target.value)}
                    className={`extra-options-input ${className}`}
                />
            ))}
            {rows.length > 1 && (
                <button
                    type="button"
                    onClick={() => removeRow(idx)}
                    aria-label="Usuń wiersz"
                >
                    -
                </button>
            )}
            {idx === rows.length - 1 && (
                <button type="button" onClick={addRow} aria-label="Dodaj wiersz">
                    +
                </button>
            )}
        </div>
    ));
}

const COUNT_FIELD = {
    field: "count",
    placeholder: "Ilość",
    className: "extra-options-input--count",
};

const HOLE_FIELDS = [
    {
        field: "diameter",
        placeholder: "Fi (mm)",
        className: "extra-options-input--diameter",
    },
    COUNT_FIELD,
];

const RECT_HOLE_FIELDS = [
    { field: "a", placeholder: "Bok A (mm)", className: "extra-options-input--side" },
    { field: "b", placeholder: "Bok B (mm)", className: "extra-options-input--side" },
    COUNT_FIELD,
];

/**
 * Rozwijana sekcja otworów kołowych i czworokątnych (stan z useHoles).
 */
export default function HolesOptions({ holes, setHoles, rectHoles, setRectHoles }) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="options-toggle-group">
            <button type="button" onClick={() => setVisible((v) => !v)}>
                {visible ? "Ukryj" : "Dodatkowe opcje"}
            </button>
            {visible && (
                <div className="extra-options-container">
                    <strong>Otwory kołowe:</strong>
                    <HoleRows
                        rows={holes}
                        setRows={setHoles}
                        emptyRow={EMPTY_HOLE}
                        fields={HOLE_FIELDS}
                    />
                    <strong>Otwory czworokątne:</strong>
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
