import PropTypes from "prop-types";

/**
 * Przyciski "Oblicz" / "Wyczyść" wspólne dla wszystkich kalkulatorów
 * wraz z podpowiedzią skrótów klawiszowych.
 */
export default function CalculatorActions({
    onCalculate,
    onClear,
    pending = false,
    pendingLabel,
}) {
    return (
        <div className="calculator-actions">
            <button
                type="button"
                className="btn btn--primary"
                onClick={onCalculate}
                disabled={pending}
                aria-busy={pending}
            >
                {pending && pendingLabel ? pendingLabel : "Oblicz"}
                <kbd>Enter</kbd>
            </button>
            <button type="button" className="btn btn--secondary" onClick={onClear}>
                Wyczyść
                <kbd>Esc</kbd>
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
