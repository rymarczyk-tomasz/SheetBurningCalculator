import PropTypes from "prop-types";
import InputField from "./InputField";

/**
 * Wspólne pola wymiarów zależne od wybranego kształtu (prostokąt/koło/półkole/dł. całkowita).
 */
const ShapeDimensionFields = ({
    shape,
    length,
    setLength,
    width,
    setWidth,
    outerDiameter,
    setOuterDiameter,
    innerDiameter,
    setInnerDiameter,
    totalLength,
    setTotalLength,
}) => {
    return (
        <>
            {shape === "rectangle" && (
                <>
                    <InputField
                        id="length"
                        label="Długość boku A (mm):"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        placeholder="Wpisz wymiar w mm"
                    />
                    <InputField
                        id="width"
                        label="Długość boku B (mm):"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        placeholder="Wpisz wymiar w mm"
                    />
                </>
            )}

            {(shape === "circle" || shape === "semicircle") && (
                <>
                    <InputField
                        id="outerDiameter"
                        label="Fi zewnętrzne (mm):"
                        value={outerDiameter}
                        onChange={(e) => setOuterDiameter(e.target.value)}
                        placeholder="Wpisz wymiar w mm"
                    />
                    <InputField
                        id="innerDiameter"
                        label="Fi wewnętrzne (mm):"
                        value={innerDiameter}
                        onChange={(e) => setInnerDiameter(e.target.value)}
                        placeholder="Wpisz wymiar w mm"
                    />
                </>
            )}

            {shape === "totalLength" && (
                <InputField
                    id="totalLength"
                    label="Całkowita długość boków (mm):"
                    value={totalLength}
                    onChange={(e) => setTotalLength(e.target.value)}
                    placeholder="Wpisz całkowitą długość w mm"
                />
            )}
        </>
    );
};

ShapeDimensionFields.propTypes = {
    shape: PropTypes.string.isRequired,
    length: PropTypes.string,
    setLength: PropTypes.func,
    width: PropTypes.string,
    setWidth: PropTypes.func,
    outerDiameter: PropTypes.string,
    setOuterDiameter: PropTypes.func,
    innerDiameter: PropTypes.string,
    setInnerDiameter: PropTypes.func,
    totalLength: PropTypes.string,
    setTotalLength: PropTypes.func,
};

export default ShapeDimensionFields;
