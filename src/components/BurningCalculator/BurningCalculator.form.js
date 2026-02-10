import { requiredNumber } from "../formValidation";

export const getBurningFields = ({
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
  thickness,
  setThickness,
}) => {
  const required = requiredNumber();

  return [
    {
      id: "length",
      label: "Długość boku A (mm):",
      value: length,
      onChange: (e) => setLength(e.target.value),
      placeholder: "Wpisz wymiar w mm",
      name: "dimension-a",
      autoComplete: "one-time-code",
      inputMode: "decimal",
      type: "text",
      showWhen: () => shape === "rectangle",
      validate: required,
    },
    {
      id: "width",
      label: "Długość boku B (mm):",
      value: width,
      onChange: (e) => setWidth(e.target.value),
      placeholder: "Wpisz wymiar w mm",
      showWhen: () => shape === "rectangle",
      validate: required,
    },
    {
      id: "outerDiameter",
      label: "Fi zewnętrzne (mm):",
      value: outerDiameter,
      onChange: (e) => setOuterDiameter(e.target.value),
      placeholder: "Wpisz wymiar w mm",
      showWhen: () => shape === "circle" || shape === "semicircle",
      validate: required,
    },
    {
      id: "innerDiameter",
      label: "Fi wewnętrzne (mm):",
      value: innerDiameter,
      onChange: (e) => setInnerDiameter(e.target.value),
      placeholder: "Wpisz wymiar w mm",
      showWhen: () => shape === "circle" || shape === "semicircle",
    },
    {
      id: "totalLength",
      label: "Całkowita długość boków (mm):",
      value: totalLength,
      onChange: (e) => setTotalLength(e.target.value),
      placeholder: "Wpisz całkowitą długość w mm",
      showWhen: () => shape === "totalLength",
      validate: required,
    },
    {
      id: "thickness",
      label: "Grubość blachy (mm):",
      value: thickness,
      onChange: (e) => setThickness(e.target.value),
      placeholder: "Wpisz grubość w mm",
      validate: required,
    },
  ];
};
