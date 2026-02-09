import { requiredNumber } from "../formValidation";

export const getNitridingFields = ({
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
      label: "Grubość warstwy azotowanej [mm]:",
      value: thickness,
      onChange: (e) => setThickness(e.target.value),
      placeholder: "Wpisz grubość warstwy azotowanej w mm (ręcznie)",
      validate: required,
    },
  ];
};
