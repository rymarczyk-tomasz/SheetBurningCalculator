import PropTypes from "prop-types";
import InputField from "./InputField";

const FIELDS_BY_SHAPE = {
    rectangle: [
        { field: "length", label: "Długość boku A (mm):" },
        { field: "width", label: "Długość boku B (mm):" },
    ],
    circle: [
        { field: "outerDiameter", label: "Fi zewnętrzne (mm):" },
        {
            field: "innerDiameter",
            label: "Fi wewnętrzne (mm):",
            placeholder: "Wpisz wymiar w mm (opcjonalnie)",
        },
    ],
    totalLength: [
        {
            field: "totalLength",
            label: "Całkowita długość boków (mm):",
            placeholder: "Np. 250+578+360",
            allowSum: true,
        },
    ],
    rod: [
        { field: "rodDiameter", label: "Średnica pręta (mm):" },
        { field: "rodLength", label: "Długość pręta (mm):" },
    ],
};
FIELDS_BY_SHAPE.semicircle = FIELDS_BY_SHAPE.circle;

/**
 * Pola wymiarów zależne od wybranego kształtu (stan z useShapeDimensions).
 */
const ShapeDimensionFields = ({ shape, dims, setDim }) => (
    <div className="form-grid">
        {(FIELDS_BY_SHAPE[shape] ?? []).map(
            ({ field, label, placeholder, allowSum }) => (
                <InputField
                    key={field}
                    label={label}
                    value={dims[field]}
                    onChange={(value) => setDim(field, value)}
                    placeholder={placeholder ?? "Wpisz wymiar w mm"}
                    allowSum={allowSum}
                />
            ),
        )}
    </div>
);

ShapeDimensionFields.propTypes = {
    shape: PropTypes.string.isRequired,
    dims: PropTypes.objectOf(PropTypes.string).isRequired,
    setDim: PropTypes.func.isRequired,
};

export default ShapeDimensionFields;
