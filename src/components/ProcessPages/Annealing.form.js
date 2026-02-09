import { requiredNumber } from "../formValidation";

export const getAnnealingFields = ({
  furnace,
  setFurnace,
  mass,
  setMass,
  thickness,
  setThickness,
}) => {
  const required = requiredNumber();

  return [
    {
      id: "furnace",
      type: "select",
      label: "Wybierz piec:",
      value: furnace,
      onChange: (e) => setFurnace(e.target.value),
      wrapperClassName: "form-group",
      options: [
        { value: "MAAG", label: "MAAG" },
        { value: "KROMET", label: "KROMET" },
      ],
    },
    {
      id: "mass",
      label: "Masa detalu (kg):",
      value: mass,
      onChange: (e) => setMass(e.target.value),
      placeholder: "Wpisz masę w kg",
      validate: required,
    },
    {
      id: "thickness",
      label: "Grubość materiału (mm):",
      value: thickness,
      onChange: (e) => setThickness(e.target.value),
      placeholder: "Wpisz grubość w mm",
      showWhen: () => furnace === "MAAG",
      validate: required,
    },
  ];
};
