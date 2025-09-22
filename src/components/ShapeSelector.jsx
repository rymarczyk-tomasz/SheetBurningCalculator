import PropTypes from "prop-types";

const ShapeSelector = ({ shape, setShape, isCutting, showRodShape }) => {
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
    shape: PropTypes.string.isRequired,
    setShape: PropTypes.func.isRequired,
    isCutting: PropTypes.bool,
    showRodShape: PropTypes.bool,
};

ShapeSelector.defaultProps = {
    isCutting: false,
    showRodShape: false,
};

export default ShapeSelector;
