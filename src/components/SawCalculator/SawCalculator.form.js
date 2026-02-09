import { requiredNumber } from "../formValidation";

export const getSawFields = ({ rodDiameter, setRodDiameter }) => {
  const required = requiredNumber();

  return [
    {
      id: "diameter",
      label: "Wpisz średnicę pręta lub fi zew. rury w mm:",
      value: rodDiameter,
      onChange: (e) => setRodDiameter(e.target.value),
      placeholder: "Wpisz średnicę pręta lub fi zew. rury w mm",
      validate: required,
    },
  ];
};
