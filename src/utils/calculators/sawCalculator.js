import { rodCuttingData } from "../../data/rodPipeCuttingData";
import { isEmptyValue, parseNumberValue } from "../numberParsing";

const buildResult = (diameterValue, type) => {
  if (isEmptyValue(diameterValue)) {
    return `Wpisz srednice ${type}.`;
  }

  const diameter = parseNumberValue(diameterValue);
  if (isNaN(diameter) || diameter <= 0) {
    return `Prosze podac prawidlowa srednice ${type}.`;
  }

  const found = rodCuttingData.find(
    (row) => diameter >= row.minDiameter && diameter <= row.maxDiameter,
  );

  if (!found) {
    return `Brak danych dla podanej srednicy ${type}.`;
  }

  const time = found.time;
  const mpk = diameter < 180 ? "Mpk 416" : "Mpk 418";

  if (type === "rury") {
    return `Na ciecie rury potrzeba ${time / 2} h - ${mpk}`;
  }

  return `Na ciecie preta potrzeba ${time} h - ${mpk}`;
};

export function sawCalculator({ cutType, rodDiameter, pipeOuterDiameter }) {
  if (cutType === "pipe") {
    return {
      rodResult: null,
      pipeResult: buildResult(pipeOuterDiameter, "rury"),
    };
  }

  return {
    rodResult: buildResult(rodDiameter, "preta"),
    pipeResult: null,
  };
}
