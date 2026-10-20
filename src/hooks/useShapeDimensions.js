import { useCallback, useState } from "react";

const EMPTY_DIMS = {
    length: "",
    width: "",
    outerDiameter: "",
    innerDiameter: "",
    totalLength: "",
    rodDiameter: "",
    rodLength: "",
};

/**
 * Stan wybranego kształtu i jego wymiarów (używany z ShapeSelector + ShapeDimensionFields).
 */
export default function useShapeDimensions(initialShape = "rectangle") {
    const [shape, setShape] = useState(initialShape);
    const [dims, setDims] = useState(EMPTY_DIMS);

    const setDim = useCallback(
        (field, value) => setDims((prev) => ({ ...prev, [field]: value })),
        [],
    );
    const resetDims = useCallback(() => setDims(EMPTY_DIMS), []);

    return { shape, setShape, dims, setDim, resetDims };
}
