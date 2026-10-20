import PropTypes from "prop-types";

/**
 * Przyciski "Oblicz" / "Wyczyść" wspólne dla wszystkich kalkulatorów.
 */
export default function CalculatorActions({
    onCalculate,
    onClear,
    pending = false,
    pendingLabel = "Obliczanie...",
}) {
    return (
        <div className="calculator-actions">
            <button type="button" onClick={onCalculate} disabled={pending}>
                {pending ? pendingLabel : "Oblicz"}
            </button>
            <button type="button" onClick={onClear}>
                Wyczyść
            </button>
        </div>
    );
}

CalculatorActions.propTypes = {
    onCalculate: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    pending: PropTypes.bool,
    pendingLabel: PropTypes.string,
};
