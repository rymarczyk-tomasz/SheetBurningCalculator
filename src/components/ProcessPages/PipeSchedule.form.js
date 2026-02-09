import { requiredText } from "../formValidation";

export const getPipeScheduleFields = ({
  nominalSize,
  setNominalSize,
  schedule,
  setSchedule,
  schedules,
}) => {
  const required = requiredText();

  return [
    {
      id: "nominalSize",
      label: "Nominalna wielkość rury (np. 1/4, 0.25 lub 0,25):",
      value: nominalSize,
      onChange: (e) => setNominalSize(e.target.value),
      placeholder: 'Wpisz wielkość (np. "1/4", "2 1/2", "2.5", "2,5")',
      type: "text",
      validate: required,
    },
    {
      id: "schedule",
      type: "select",
      label: "Typ Schedule:",
      value: schedule,
      onChange: (e) => setSchedule(e.target.value),
      options: schedules.map((sch) => ({
        value: sch,
        label: sch,
      })),
    },
  ];
};
