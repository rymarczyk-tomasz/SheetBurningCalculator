import PropTypes from "prop-types";

const ProcessSelector = ({ processes, process, setProcess }) => {
    return (
        <div className="form-group">
            <label>Wybierz proces:</label>
            <div>
                {processes.map((p) => (
                    <button
                        key={p.value}
                        type="button"
                        onClick={() => setProcess(p.value)}
                        disabled={p.disabled}
                        title={p.disabled ? p.disabledReason : undefined}
                        aria-pressed={process === p.value}
                        className={`process-selector-btn${
                            process === p.value ? " active" : ""
                        }`}
                    >
                        {p.label}
                    </button>
                ))}
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
