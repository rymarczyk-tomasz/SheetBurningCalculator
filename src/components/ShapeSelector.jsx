import PropTypes from "prop-types";

const ShapeSelector = ({ shape, setShape, isCutting, showRodShape }) => {
    shape = shape || "rectangle";
    isCutting = isCutting || false;
    showRodShape = showRodShape || false;

    return (
        <div className="form-group">
            <label htmlFor="shape">
                {isCutting
                    ? "Wybierz kształt ciętego materiału:"
                    : "Wybierz kształt:"}
            </label>
            <select
                id="shape"
                value={shape}
                onChange={(e) => setShape(e.target.value)}
            >
                <>
                    <option value="rectangle">Czworokąt</option>
                    <option value="circle">Okrąg / Pierścień</option>
                    <option value="semicircle">Półpierścień</option>
                    <option value="totalLength">Całkowita długość boków</option>
                    {showRodShape && <option value="rod">Pręt</option>}
                </>
            </select>
        </div>
    );
};

ShapeSelector.propTypes = {
    shape: PropTypes.string,
    setShape: PropTypes.func.isRequired,
    isCutting: PropTypes.bool,
    showRodShape: PropTypes.bool,
};

export default ShapeSelector;
