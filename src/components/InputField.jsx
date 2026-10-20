import { useId } from "react";
import PropTypes from "prop-types";

/**
 * Pole liczbowe. Typ "text" z klawiaturą dziesiętną, aby przyjmować także przecinek ("2,5").
 */
const InputField = ({ label, value, onChange, placeholder }) => {
    const id = useId();
    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <input
                type="text"
                inputMode="decimal"
                autoComplete="off"
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
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
