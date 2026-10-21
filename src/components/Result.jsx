import PropTypes from "prop-types";
import CopyButton from "./CopyButton";
import { getTimeValue, localizeDecimals } from "../utils/resultLine";

const resultLinePropType = PropTypes.shape({
    text: PropTypes.string.isRequired,
    copy: PropTypes.string,
});

/**
 * Pojedyncza linia wyniku. Czas jest wyróżniony dużą liczbą z jednostką,
 * pozostałe linie (np. wymiary rury) wyświetlane są jako zwykły tekst.
 */
export function ResultValue({ line }) {
    const time = getTimeValue(line);

    if (!time) {
        return (
            <div className="result-row">
                <p className="result-text">{line.text}</p>
                {line.copy && <CopyButton text={line.copy} />}
            </div>
        );
    }

    return (
        <div className="result-row">
            <div className="result-main">
                <p className="result-value">
                    {time.value}
                    <span className="result-unit">{time.unit}</span>
                </p>
                <p className="result-caption">{localizeDecimals(line.text)}</p>
            </div>
            <CopyButton text={line.copy} />
        </div>
    );
}

ResultValue.propTypes = { line: resultLinePropType.isRequired };

/**
 * Wyświetla wynik z useCalculation: { kind: "success" | "error", lines: [{ text, copy }] }.
 * Przycisk kopiowania kopiuje samą wartość linii (np. czas), a nie cały tekst.
 */
const Result = ({ result }) => {
    if (!result) return null;

    const isError = result.kind === "error";
    return (
        <div
            className={`result result--${result.kind}`}
            role={isError ? "alert" : "status"}
        >
            {isError ? (
                <p className="result-text">{result.lines[0].text}</p>
            ) : (
                result.lines.map((line, idx) => <ResultValue key={idx} line={line} />)
            )}
        </div>
    );
};

Result.propTypes = {
    result: PropTypes.shape({
        kind: PropTypes.oneOf(["success", "error"]).isRequired,
        lines: PropTypes.arrayOf(resultLinePropType).isRequired,
    }),
};

export default Result;
