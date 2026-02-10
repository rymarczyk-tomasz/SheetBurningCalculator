export default function ExtraOptions({
  holes,
  setHoles,
  rectHoles,
  setRectHoles,
  holeErrors,
  rectHoleErrors,
}) {
  const handleHoleChange = (idx, field, value) => {
    setHoles((prev) =>
      prev.map((item, index) =>
        index === idx ? { ...item, [field]: value } : item,
      ),
    );
  };

  const addHole = () => setHoles([...holes, { diameter: "", count: "" }]);
  const removeHole = (idx) => setHoles(holes.filter((_, i) => i !== idx));

  const handleRectHoleChange = (idx, field, value) => {
    setRectHoles((prev) =>
      prev.map((item, index) =>
        index === idx ? { ...item, [field]: value } : item,
      ),
    );
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
            name={`calc-hole-diameter-${idx}`}
            placeholder="Fi (mm)"
            value={hole.diameter}
            onChange={(e) => handleHoleChange(idx, "diameter", e.target.value)}
            className="extra-options-input extra-options-input--diameter"
            autoComplete="off"
          />
          {holeErrors?.[idx]?.diameter && (
            <div className="form-error">{holeErrors[idx].diameter}</div>
          )}
          <input
            type="number"
            min="1"
            name={`calc-hole-count-${idx}`}
            placeholder="Ilość"
            value={hole.count}
            onChange={(e) => handleHoleChange(idx, "count", e.target.value)}
            className="extra-options-input extra-options-input--count"
            autoComplete="off"
          />
          {holeErrors?.[idx]?.count && (
            <div className="form-error">{holeErrors[idx].count}</div>
          )}
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
            name={`calc-rect-hole-a-${idx}`}
            placeholder="Bok A (mm)"
            value={rect.a}
            onChange={(e) => handleRectHoleChange(idx, "a", e.target.value)}
            className="extra-options-input extra-options-input--side"
            autoComplete="off"
          />
          {rectHoleErrors?.[idx]?.a && (
            <div className="form-error">{rectHoleErrors[idx].a}</div>
          )}
          <input
            type="number"
            min="1"
            name={`calc-rect-hole-b-${idx}`}
            placeholder="Bok B (mm)"
            value={rect.b}
            onChange={(e) => handleRectHoleChange(idx, "b", e.target.value)}
            className="extra-options-input extra-options-input--side"
            autoComplete="off"
          />
          {rectHoleErrors?.[idx]?.b && (
            <div className="form-error">{rectHoleErrors[idx].b}</div>
          )}
          <input
            type="number"
            min="1"
            name={`calc-rect-hole-count-${idx}`}
            placeholder="Ilość"
            value={rect.count}
            onChange={(e) => handleRectHoleChange(idx, "count", e.target.value)}
            className="extra-options-input extra-options-input--count"
            autoComplete="off"
          />
          {rectHoleErrors?.[idx]?.count && (
            <div className="form-error">{rectHoleErrors[idx].count}</div>
          )}
          {rectHoles.length > 1 && (
            <button type="button" onClick={() => removeRectHole(idx)}>
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
