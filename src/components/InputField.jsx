import { useId } from "react";
import PropTypes from "prop-types";
import { parseSum } from "../utils/parseNumber";

// "Grubość blachy (mm):" -> etykieta "Grubość blachy" + jednostka "mm" w polu
const LABEL_WITH_UNIT = /^(.*?)\s*\(([^()]{1,4})\)\s*:?\s*$/;
// Placeholdery typu "Wpisz grubość w mm" tylko powtarzają etykietę i jednostkę
const GENERIC_PLACEHOLDER = /^Wpisz [^,]* w (mm|kg)$/;

function splitLabel(label) {
    const match = label.match(LABEL_WITH_UNIT);
    if (!match) return { text: label.replace(/:\s*$/, ""), unit: null };
    return { text: match[1], unit: match[2] };
}

/**
 * Pole liczbowe. Typ "text" z klawiaturą dziesiętną, aby przyjmować także przecinek ("2,5").
 * Jednostka z etykiety (np. "(mm)") wyświetlana jest wewnątrz pola.
 * Z allowSum pole przyjmuje sumę ("250+578+360") i pokazuje jej wynik pod spodem.
 */
const InputField = ({
    label,
    value,
    onChange,
    placeholder,
    allowSum = false,
}) => {
    const id = useId();
    const { text, unit } = splitLabel(label);
    const hint =
        placeholder && !GENERIC_PLACEHOLDER.test(placeholder)
            ? placeholder
            : undefined;
    const sum = allowSum && value.trim() !== "" ? parseSum(value) : null;
    const sumInvalid = sum !== null && !Number.isFinite(sum);
    const showSum = sumInvalid || (sum !== null && value.includes("+"));

    return (
        <div className="form-group">
            <label htmlFor={id}>{text}</label>
            <div className="input-wrap">
                <input
                    type="text"
                    inputMode={allowSum ? "text" : "decimal"}
                    autoComplete="off"
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={hint}
                    className={unit ? "has-unit" : undefined}
                />
                {unit && (
                    <span className="input-unit" aria-hidden="true">
                        {unit}
                    </span>
                )}
            </div>
            {showSum && (
                <div
                    className={
                        sumInvalid
                            ? "input-sum input-sum--invalid"
                            : "input-sum"
                    }
                    aria-live="polite"
                >
                    {sumInvalid
                        ? "Obsługiwane jest tylko dodawanie, np. 250+578+360"
                        : `= ${Number(sum.toFixed(2)).toLocaleString("pl-PL")}${unit ? ` ${unit}` : ""}`}
                </div>
            )}
        </div>
    );
};

InputField.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    allowSum: PropTypes.bool,
};

export default InputField;
