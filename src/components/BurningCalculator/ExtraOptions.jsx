import React from "react";

export default function ExtraOptions({
    holes,
    setHoles,
    rectHoles,
    setRectHoles,
}) {
    const handleHoleChange = (idx, field, value) => {
        const updated = [...holes];
        updated[idx][field] = value;
        setHoles(updated);
    };

    const addHole = () => setHoles([...holes, { diameter: "", count: "" }]);
    const removeHole = (idx) => setHoles(holes.filter((_, i) => i !== idx));

    const handleRectHoleChange = (idx, field, value) => {
        const updated = [...rectHoles];
        updated[idx][field] = value;
        setRectHoles(updated);
    };

    const addRectHole = () =>
        setRectHoles([...rectHoles, { a: "", b: "", count: "" }]);

    const removeRectHole = (idx) =>
        setRectHoles(rectHoles.filter((_, i) => i !== idx));

    return (
        <div className="extra-options-container">
            <strong>Otwory kołowe:</strong>
            {holes.map((hole, idx) => (
                <div key={idx} className="extra-options-row">
                    <input
                        type="number"
                        min="1"
                        placeholder="Fi (mm)"
                        value={hole.diameter}
                        onChange={(e) =>
                            handleHoleChange(idx, "diameter", e.target.value)
                        }
                        className="extra-options-input extra-options-input--diameter"
                    />
                    <input
                        type="number"
                        min="1"
                        placeholder="Ilość"
                        value={hole.count}
                        onChange={(e) =>
                            handleHoleChange(idx, "count", e.target.value)
                        }
                        className="extra-options-input extra-options-input--count"
                    />
                    {holes.length > 1 && (
                        <button type="button" onClick={() => removeHole(idx)}>
                            -
                        </button>
                    )}
                    {idx === holes.length - 1 && (
                        <button type="button" onClick={addHole}>
                            +
                        </button>
                    )}
                </div>
            ))}
            <strong>Otwory czworokątne:</strong>
            {rectHoles.map((rect, idx) => (
                <div key={idx} className="extra-options-row">
                    <input
                        type="number"
                        min="1"
                        placeholder="Bok A (mm)"
                        value={rect.a}
                        onChange={(e) =>
                            handleRectHoleChange(idx, "a", e.target.value)
                        }
                        className="extra-options-input extra-options-input--side"
                    />
                    <input
                        type="number"
                        min="1"
                        placeholder="Bok B (mm)"
                        value={rect.b}
                        onChange={(e) =>
                            handleRectHoleChange(idx, "b", e.target.value)
                        }
                        className="extra-options-input extra-options-input--side"
                    />
                    <input
                        type="number"
                        min="1"
                        placeholder="Ilość"
                        value={rect.count}
                        onChange={(e) =>
                            handleRectHoleChange(idx, "count", e.target.value)
                        }
                        className="extra-options-input extra-options-input--count"
                    />
                    {rectHoles.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeRectHole(idx)}
                        >
                            -
                        </button>
                    )}
                    {idx === rectHoles.length - 1 && (
                        <button type="button" onClick={addRectHole}>
                            +
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
