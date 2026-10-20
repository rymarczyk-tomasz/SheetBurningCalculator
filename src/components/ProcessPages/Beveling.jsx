import ChamferCalculator from "./ChamferCalculator";
import { getNormatywMultiplier } from "../../utils/getNormatywMultiplier";

const getBevelingMultiplier = (size) => getNormatywMultiplier(size, "fazowanie");

export default function Beveling() {
    return (
        <ChamferCalculator
            resultLabel="Czas fazowania (ukosowanie)"
            getMultiplier={getBevelingMultiplier}
        />
    );
}
