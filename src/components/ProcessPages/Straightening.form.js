import { requiredNumber } from "../formValidation";

export const getStraighteningFields = ({ length, setLength }) => {
  const required = requiredNumber();

  return [
    {
      id: "length",
      label: "Długość dłuższego boku lub średnica (fi) [mm]:",
      value: length,
      onChange: (e) => setLength(e.target.value),
      placeholder: "Wpisz długość lub fi w mm",
      validate: required,
    },
  ];
};
