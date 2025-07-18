import { useState } from "react";

export default function useCalculatorForm(isWaterjet = false) {
    const [shape, setShape] = useState("");
    const [length, setLength] = useState("");
    const [width, setWidth] = useState("");
    const [outerDiameter, setOuterDiameter] = useState("");
    const [innerDiameter, setInnerDiameter] = useState("");
    const [thickness, setThickness] = useState("");
    const [totalLength, setTotalLength] = useState("");
    const [holes, setHoles] = useState([]);
    const [rectHoles, setRectHoles] = useState([]);
    const [extraOptionsVisible, setExtraOptionsVisible] = useState(false);
    const [result, setResult] = useState(null);

    const [waterjetType, setWaterjetType] = useState("czarna");

    const fields = {
        length,
        width,
        outerDiameter,
        innerDiameter,
        thickness,
        totalLength,
    };

    const setters = {
        setLength,
        setWidth,
        setOuterDiameter,
        setInnerDiameter,
        setThickness,
        setTotalLength,
    };

    const handleCalculate = () => {
        setResult("Wynik obliczeń");
    };

    const handleClear = () => {
        setLength("");
        setWidth("");
        setOuterDiameter("");
        setInnerDiameter("");
        setThickness("");
        setTotalLength("");
        setHoles([]);
        setRectHoles([]);
        setResult(null);
    };

    return {
        shape,
        setShape,
        fields,
        setters,
        holes,
        setHoles,
        rectHoles,
        setRectHoles,
        extraOptionsVisible,
        setExtraOptionsVisible,
        result,
        handleCalculate,
        handleClear,
        ...(isWaterjet && { waterjetType, setWaterjetType }),
    };
}
