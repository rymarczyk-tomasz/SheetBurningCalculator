import { useId } from "react";
import PropTypes from "prop-types";

const ShapeSelector = ({ shape, setShape, showRodShape = false }) => {
    const id = useId();
    return (
        <div className="form-group">
            <label htmlFor={id}>Wybierz kształt:</label>
            <select
                id={id}
                value={shape}
                onChange={(e) => setShape(e.target.value)}
            >
                <option value="rectangle">Czworokąt</option>
                <option value="circle">Okrąg / Pierścień</option>
                <option value="semicircle">Półpierścień</option>
                <option value="totalLength">Całkowita długość boków</option>
                {showRodShape && <option value="rod">Pręt</option>}
            </select>
        </div>
    );
};

ShapeSelector.propTypes = {
    shape: PropTypes.string.isRequired,
    setShape: PropTypes.func.isRequired,
    showRodShape: PropTypes.bool,
};

export default ShapeSelector;
