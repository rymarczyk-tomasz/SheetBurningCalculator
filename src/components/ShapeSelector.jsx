import PropTypes from "prop-types";

const ShapeSelector = ({ shape, setShape, isCutting }) => {
    return (
        <div className="form-group">
            <label htmlFor="shape">
                {isCutting ? "Wybierz kształt ciętego materiału:" : "Wybierz kształt:"}
            </label>
            <select
                id="shape"
                value={shape}
                onChange={(e) => setShape(e.target.value)}
            >
                {isCutting ? (
                    <>
                        <option value="rod">Pręt</option>
                        <option value="pipe">Rura</option>
                    </>
                ) : (
                    <>
                        <option value="totalLength">Całkowita długość boków</option>
                        <option value="rectangle">Czworokąt</option>
                        <option value="circle">Okrąg / Pierścień</option>
                        <option value="semicircle">Półpierścień</option>
                    </>
                )}
            </select>
        </div>
    );
};

ShapeSelector.propTypes = {
    shape: PropTypes.string.isRequired,
    setShape: PropTypes.func.isRequired,
    isCutting: PropTypes.bool, // Dodaj ten prop
};

export default ShapeSelector;
