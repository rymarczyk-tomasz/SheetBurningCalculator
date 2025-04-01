import PropTypes from "prop-types";

const InputField = ({ id, label, value, onChange, placeholder }) => {
    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <input
                type="number"
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required
            />
        </div>
    );
};

InputField.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
};

export default InputField;
