import ChamferCalculator from "./ChamferCalculator";

/** Stały mnożnik frezowania fazy [h/m], niezależny od wielkości fazy. */
const MILLING_MULTIPLIER = 0.2;

const getMillingMultiplier = () => MILLING_MULTIPLIER;

export default function BevelingMilling() {
    return (
        <ChamferCalculator
            resultLabel="Czas fazowania (frezowanie)"
            getMultiplier={getMillingMultiplier}
        />
    );
}
