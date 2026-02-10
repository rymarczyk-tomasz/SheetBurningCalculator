import PropTypes from "prop-types";

const InputField = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  onKeyDown,
  name,
  placeholder,
  type,
  error,
}) => {
  const errorId = error ? `${id}-error` : undefined;
  const inputName = name || id;

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        name={inputName}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete="off"
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
  onKeyDown: PropTypes.func,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  error: PropTypes.string,
};

InputField.defaultProps = {
  type: "number",
  onBlur: undefined,
  onKeyDown: undefined,
  name: undefined,
  error: undefined,
};

export default InputField;
