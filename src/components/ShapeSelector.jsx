import React from "react";
import PropTypes from "prop-types";

const ShapeSelector = ({ shape, setShape }) => {
    return (
        <div className="form-group">
            <label htmlFor="shape">Wybierz kształt:</label>
            <select
                id="shape"
                value={shape}
                onChange={(e) => setShape(e.target.value)}
            >
                <option value="rectangle">Czworokąt</option>
                <option value="circle">Okrąg / Pierścień</option>
                <option value="semicircle">Półpierścień</option>
            </select>
        </div>
    );
};

ShapeSelector.propTypes = {
    shape: PropTypes.string.isRequired,
    setShape: PropTypes.func.isRequired,
};

export default ShapeSelector;
