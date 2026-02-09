import { requiredNumber } from "../formValidation";

export const getHardeningFields = ({
  mass,
  setMass,
  thickness,
  setThickness,
}) => {
  const required = requiredNumber();

  return [
    {
      id: "mass",
      label: "Masa detalu (kg):",
      value: mass,
      onChange: (e) => setMass(e.target.value),
      placeholder:
        "Wpisz masę w kg, jezeli nie znasz masy, uzyj kalkulatora poniżej",
      validate: required,
    },
    {
      id: "thickness",
      label: "Grubość materiału (mm):",
      value: thickness,
      onChange: (e) => setThickness(e.target.value),
      placeholder: "Wpisz grubość w mm",
      validate: required,
    },
  ];
};
