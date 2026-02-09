import { requiredNumber } from "../formValidation";

export const getCarburizingFields = ({
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
        "Wpisz masę w kg, jeżeli nie znasz masy, użyj kalkulatora poniżej",
      validate: required,
    },
    {
      id: "thickness",
      label: "Grubość warstwy nawęglanej Eht [mm]:",
      value: thickness,
      onChange: (e) => setThickness(e.target.value),
      placeholder: "Wpisz grubość warstwy nawęglanej Eht w mm (ręcznie)",
      validate: required,
    },
  ];
};
