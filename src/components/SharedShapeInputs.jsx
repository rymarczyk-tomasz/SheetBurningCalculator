import React from "react";
import InputField from "./InputField";
import ShapeSelector from "./ShapeSelector";
import ExtraOptions from "./BurningCalculator/ExtraOptions";

export default function SharedShapeInputs({
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
    isWaterjet,
    waterjetType,
    setWaterjetType,
}) {
    return (
        <>
            {isWaterjet && (
                <div
                    style={{
                        display: "flex",
                        gap: "16px",
                        justifyContent: "center",
                        marginBottom: 8,
                    }}
                >
                    <label>
                        <input
                            type="radio"
                            value="czarna"
                            checked={waterjetType === "czarna"}
                            onChange={() => setWaterjetType("czarna")}
                        />
                        Blacha czarna
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="nierdzewka"
                            checked={waterjetType === "nierdzewka"}
                            onChange={() => setWaterjetType("nierdzewka")}
                        />
                        Blacha nierdzewna
                    </label>
                </div>
            )}

            <ShapeSelector
                shape={shape}
                setShape={setShape}
                isCutting={false}
            />

            <div style={{ margin: "16px 0" }}>
                <button
                    type="button"
                    onClick={() => setExtraOptionsVisible((v) => !v)}
                >
                    {extraOptionsVisible ? "Ukryj" : "Dodatkowe opcje"}
                </button>
                {extraOptionsVisible && (
                    <ExtraOptions
                        holes={holes}
                        setHoles={setHoles}
                        rectHoles={rectHoles}
                        setRectHoles={setRectHoles}
                    />
                )}
            </div>

            {shape === "rectangle" && (
                <>
                    <InputField
                        id="length"
                        label="Długość boku A (mm):"
                        value={fields.length}
                        onChange={(e) => setters.setLength(e.target.value)}
                        placeholder="Wpisz wymiar w mm"
                    />
                    <InputField
                        id="width"
                        label="Długość boku B (mm):"
                        value={fields.width}
                        onChange={(e) => setters.setWidth(e.target.value)}
                        placeholder="Wpisz wymiar w mm"
                    />
                </>
            )}

            {(shape === "circle" || shape === "semicircle") && (
                <>
                    <InputField
                        id="outerDiameter"
                        label="Fi zewnętrzne (mm):"
                        value={fields.outerDiameter}
                        onChange={(e) =>
                            setters.setOuterDiameter(e.target.value)
                        }
                        placeholder="Wpisz wymiar w mm"
                    />
                    <InputField
                        id="innerDiameter"
                        label="Fi wewnętrzne (mm):"
                        value={fields.innerDiameter}
                        onChange={(e) =>
                            setters.setInnerDiameter(e.target.value)
                        }
                        placeholder="Wpisz wymiar w mm"
                    />
                </>
            )}

            {shape === "totalLength" && (
                <InputField
                    id="totalLength"
                    label="Całkowita długość boków (mm):"
                    value={fields.totalLength}
                    onChange={(e) => setters.setTotalLength(e.target.value)}
                    placeholder="Wpisz całkowitą długość w mm"
                />
            )}

            <InputField
                id="thickness"
                label="Grubość blachy (mm):"
                value={fields.thickness}
                onChange={(e) => setters.setThickness(e.target.value)}
                placeholder="Wpisz grubość w mm"
            />
        </>
    );
}
