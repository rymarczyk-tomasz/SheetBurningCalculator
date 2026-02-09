import PropTypes from "prop-types";

const InputField = ({ id, label, value, onChange, placeholder, type }) => {
    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <input
                type={type}
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
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    type: PropTypes.string,
};

InputField.defaultProps = {
    type: "number",
};

export default InputField;
