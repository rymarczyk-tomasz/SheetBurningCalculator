import { requiredNumber } from "../formValidation";

export const getSawFields = ({
  cutType,
  setCutType,
  rodDiameter,
  setRodDiameter,
  pipeOuterDiameter,
  setPipeOuterDiameter,
}) => {
  const required = requiredNumber();

  return [
    {
      id: "cutType",
      type: "radio",
      value: cutType,
      onChange: (value) => setCutType(value),
      wrapperClassName: "saw-type-group",
      options: [
        { value: "rod", label: "Pret" },
        { value: "pipe", label: "Rura" },
      ],
    },
    {
      id: "rodDiameter",
      label: "Wpisz średnicę pręta w mm:",
      value: rodDiameter,
      onChange: (e) => setRodDiameter(e.target.value),
      placeholder: "Wpisz średnicę pręta w mm",
      validate: required,
      showWhen: () => cutType === "rod",
    },
    {
      id: "pipeOuterDiameter",
      label: "Wpisz fi zew. rury w mm:",
      value: pipeOuterDiameter,
      onChange: (e) => setPipeOuterDiameter(e.target.value),
      placeholder: "Wpisz fi zew. rury w mm",
      validate: required,
      showWhen: () => cutType === "pipe",
    },
  ];
};
