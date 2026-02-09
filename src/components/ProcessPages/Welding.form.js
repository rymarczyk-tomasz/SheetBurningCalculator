import { requiredNumber } from "../formValidation";

export const getWeldingSelectorFields = ({
  weldType,
  setWeldType,
  weldPosition,
  setWeldPosition,
  weldSize,
  setWeldSize,
  weldTypeOptions,
  weldPositionOptions,
}) => {
  const required = requiredNumber();

  return [
    {
      id: "weldType",
      type: "select",
      label: "Rodzaj spoiny:",
      value: weldType,
      onChange: (e) => setWeldType(e.target.value),
      wrapperClassName: "form-group",
      options: weldTypeOptions,
    },
    {
      id: "weldPosition",
      type: "select",
      label: "Pozycja spawania:",
      value: weldPosition,
      onChange: (e) => setWeldPosition(e.target.value),
      wrapperClassName: "form-group",
      options: weldPositionOptions,
    },
    {
      id: "weldSize",
      label: "Wielkość spoiny:",
      value: weldSize,
      onChange: (e) => setWeldSize(e.target.value),
      placeholder: "Wpisz wielkość spoiny",
      validate: required,
    },
  ];
};

export const getWeldingLengthFields = ({ totalLength, setTotalLength }) => {
  const required = requiredNumber();

  return [
    {
      id: "totalLength",
      label: "Całkowita długość spawania (mm):",
      value: totalLength,
      onChange: (e) => setTotalLength(e.target.value),
      placeholder: "Wpisz całkowitą długość spawania w mm",
      validate: required,
    },
  ];
};
