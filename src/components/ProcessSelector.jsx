import PropTypes from "prop-types";

const processes = [
  { value: "burning", label: "Palenie" },
  { value: "saw", label: "Cięcie" },
  { value: "waterjet", label: "Cięcie wodą" },
  { value: "hardening", label: "Hartowanie" },
  { value: "nitriding", label: "Azotowanie" },
  { value: "annealing", label: "Wyżarzanie" },
  { value: "tempering", label: "Ulepszanie cieplne" },
  { value: "carburizing", label: "Nawęglanie" },
  { value: "beveling", label: "Fazowanie" },
  { value: "grindingAfterBurning", label: "Szlifowanie po paleniu" },
  { value: "deburring", label: "Gratowanie" },
  { value: "straightening", label: "Prostowanie" },
  { value: "bevelingMilling", label: "Fazowanie (frezowanie)" },
  { value: "welding", label: "Spawanie ręczne MAG-135" },
  { value: "pipeSchedule", label: "Rury wg ASME B36.10/19" },
];

const ProcessSelector = ({ process, setProcess }) => {
  return (
    <div className="form-group">
      <label>Wybierz proces:</label>
      <div>
        {processes.map((p) => {
          const isWaterjet = p.value === "waterjet";
          const isDisabled = isWaterjet;
          const isActive = process === p.value && !isDisabled;

          return (
            <button
              key={p.value}
              type="button"
              onClick={() => {
                if (!isDisabled) setProcess(p.value);
              }}
              disabled={isDisabled}
              title={isDisabled ? "Kalkulator w naprawie" : ""}
              className={`process-selector-btn${
                isActive ? " active" : ""
              }${isDisabled ? " disabled" : ""}`}
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
  process: PropTypes.string.isRequired,
  setProcess: PropTypes.func.isRequired,
};

export default ProcessSelector;
