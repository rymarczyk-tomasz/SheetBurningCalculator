import { useRef, useState } from "react";
import PropTypes from "prop-types";
import InputField from "./InputField";

const shouldShowField = (showWhen) => {
  if (typeof showWhen === "function") {
    return Boolean(showWhen());
  }

  if (showWhen === undefined) {
    return true;
  }

  return Boolean(showWhen);
};

const GenericForm = ({ fields, errors, hasErrors, onSubmit }) => {
  const containerRef = useRef(null);
  const [touched, setTouched] = useState({});

  const markTouched = (fieldId) => {
    setTouched((prev) => {
      if (prev[fieldId]) {
        return prev;
      }

      return {
        ...prev,
        [fieldId]: true,
      };
    });
  };

  const getError = (field) => {
    if (!touched[field.id]) {
      return null;
    }

    return errors[field.id] || null;
  };

  const handleEnterKey = (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const focusable = Array.from(
      container.querySelectorAll("input, select, textarea"),
    ).filter((element) => !element.disabled && element.type !== "hidden");

    if (focusable.length === 0) {
      return;
    }

    const currentIndex = focusable.indexOf(event.target);
    if (currentIndex >= 0 && currentIndex < focusable.length - 1) {
      focusable[currentIndex + 1].focus();
      return;
    }

    if (!hasErrors && onSubmit) {
      onSubmit();
    }
  };

  return (
    <form
      ref={containerRef}
      autoComplete="off"
      noValidate
      onSubmit={(event) => event.preventDefault()}
    >
      {fields
        .filter((field) => shouldShowField(field.showWhen))
        .map((field) => {
          const wrapperClassName = field.wrapperClassName || "form-group";
          const fieldError = getError(field);

          if (field.type === "select") {
            return (
              <div className={wrapperClassName} key={field.id}>
                {field.label && <label htmlFor={field.id}>{field.label}</label>}
                <select
                  id={field.id}
                  value={field.value}
                  onChange={(event) => {
                    field.onChange(event);
                    markTouched(field.id);
                  }}
                  onKeyDown={handleEnterKey}
                  autoComplete="off"
                  aria-invalid={fieldError ? "true" : "false"}
                  aria-describedby={
                    fieldError ? `${field.id}-error` : undefined
                  }
                >
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {fieldError && (
                  <div className="form-error" id={`${field.id}-error`}>
                    {fieldError}
                  </div>
                )}
              </div>
            );
          }

          if (field.type === "radio") {
            return (
              <div className={wrapperClassName} key={field.id}>
                {field.label && (
                  <span className={field.labelClassName}>{field.label}</span>
                )}
                {field.options.map((option) => (
                  <label key={option.value} className={option.labelClassName}>
                    <input
                      type="radio"
                      name={field.name || field.id}
                      value={option.value}
                      checked={String(field.value) === String(option.value)}
                      onChange={() => {
                        field.onChange(option.value);
                        markTouched(field.id);
                      }}
                      onKeyDown={handleEnterKey}
                      autoComplete="off"
                    />
                    {option.label}
                  </label>
                ))}
                {fieldError && (
                  <div className="form-error" id={`${field.id}-error`}>
                    {fieldError}
                  </div>
                )}
              </div>
            );
          }

          return (
            <InputField
              key={field.id}
              id={field.id}
              label={field.label}
              value={field.value}
              onChange={(event) => {
                field.onChange(event);
                markTouched(field.id);
              }}
              onBlur={() => markTouched(field.id)}
              onKeyDown={handleEnterKey}
              name={field.name}
              autoComplete={field.autoComplete}
              inputMode={field.inputMode}
              placeholder={field.placeholder}
              type={field.type || "number"}
              error={fieldError}
            />
          );
        })}
    </form>
  );
};

GenericForm.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      onChange: PropTypes.func.isRequired,
      placeholder: PropTypes.string,
      type: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
          label: PropTypes.string.isRequired,
          labelClassName: PropTypes.string,
        }),
      ),
      showWhen: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
      wrapperClassName: PropTypes.string,
      labelClassName: PropTypes.string,
      name: PropTypes.string,
      autoComplete: PropTypes.string,
      inputMode: PropTypes.string,
    }),
  ).isRequired,
  errors: PropTypes.objectOf(PropTypes.string),
  hasErrors: PropTypes.bool,
  onSubmit: PropTypes.func,
};

GenericForm.defaultProps = {
  errors: {},
  hasErrors: false,
  onSubmit: undefined,
};

export default GenericForm;
