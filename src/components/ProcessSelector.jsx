import PropTypes from "prop-types";

const processes = [
    { value: "burning", label: "Palenie" },
    { value: "saw", label: "Cięcie" },
    { value: "waterjet", label: "Cięcie wodą" },
    { value: "hardening", label: "Hartowanie" },
    { value: "nitriding", label: "Azotowanie" },
    { value: "annealing", label: "Wyrzażanie" },
    { value: "tempering", label: "Ulepszanie cieplne" },
    { value: "carburizing", label: "Nawęglanie" },
];

const ProcessSelector = ({ process, setProcess }) => {
    return (
        <div className="form-group">
            <label>Wybierz proces:</label>
            <div>
                {processes.map((p) => (
                    <button
                        key={p.value}
                        type="button"
                        onClick={() => setProcess(p.value)}
                        className={process === p.value ? "active" : ""}
                        style={{
                            marginRight: 8,
                            marginBottom: 8,
                            padding: "6px 16px",
                            background:
                                process === p.value ? "#1976d2" : "#eee",
                            color: process === p.value ? "#fff" : "#222",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                        }}
                    >
                        {p.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

ProcessSelector.propTypes = {
    process: PropTypes.string.isRequired,
    setProcess: PropTypes.func.isRequired,
};

export default ProcessSelector;
