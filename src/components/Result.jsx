import PropTypes from "prop-types";
import CopyButton from "./CopyButton";

const resultLinePropType = PropTypes.shape({
    text: PropTypes.string.isRequired,
    copy: PropTypes.string,
});

/**
 * Wyświetla wynik z useCalculation: { kind: "success" | "error", lines: [{ text, copy }] }.
 * Przycisk "Kopiuj" kopiuje samą wartość linii (np. czas), a nie cały tekst.
 */
const Result = ({ result }) => {
    if (!result) return null;

    const isError = result.kind === "error";
    return (
        <div
            className={`result result--${result.kind}`}
            role={isError ? "alert" : "status"}
        >
            {result.lines.map((line, idx) => (
                <div key={idx} className="result-row">
                    <p className="result-line">{line.text}</p>
                    {!isError && line.copy && <CopyButton text={line.copy} />}
                </div>
            ))}
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
