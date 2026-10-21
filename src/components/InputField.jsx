import { useId } from "react";
import PropTypes from "prop-types";

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
 */
const InputField = ({ label, value, onChange, placeholder }) => {
    const id = useId();
    const { text, unit } = splitLabel(label);
    const hint =
        placeholder && !GENERIC_PLACEHOLDER.test(placeholder)
            ? placeholder
            : undefined;

    return (
        <div className="form-group">
            <label htmlFor={id}>{text}</label>
            <div className="input-wrap">
                <input
                    type="text"
                    inputMode="decimal"
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
        </div>
    );
};

InputField.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
};

export default InputField;
