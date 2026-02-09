import PropTypes from "prop-types";

const InputField = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type,
  error,
}) => {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={errorId}
        required
      />
      {error && (
        <div className="form-error" id={errorId}>
          {error}
        </div>
      )}
    </div>
  );
};

InputField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  error: PropTypes.string,
};

InputField.defaultProps = {
  type: "number",
  onBlur: undefined,
  error: undefined,
};

export default InputField;
