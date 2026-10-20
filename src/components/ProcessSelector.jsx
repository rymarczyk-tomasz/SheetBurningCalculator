import PropTypes from "prop-types";

const ProcessSelector = ({ processes, process, setProcess }) => {
  return (
    <div className="form-group">
      <label>Wybierz proces:</label>
      <div>
        {processes.map((p) => {
          const isActive = process === p.value && !p.disabled;

          return (
            <button
              key={p.value}
              type="button"
              onClick={() => setProcess(p.value)}
              disabled={p.disabled}
              title={p.disabled ? p.disabledReason : undefined}
              aria-pressed={isActive}
              className={`process-selector-btn${isActive ? " active" : ""}${
                p.disabled ? " disabled" : ""
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

ProcessSelector.propTypes = {
  processes: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
      disabledReason: PropTypes.string,
    }),
  ).isRequired,
  process: PropTypes.string.isRequired,
  setProcess: PropTypes.func.isRequired,
};

export default ProcessSelector;
