export const calculateCircle = (outerDiameter, innerDiameter, multiplier) => {
    const outerDiameterValue = parseFloat(outerDiameter);
    const innerDiameterValue = innerDiameter ? parseFloat(innerDiameter) : 0;

    if (innerDiameterValue >= outerDiameterValue) {
        throw new Error("Fi wewnętrzne musi być mniejsze od fi zewnętrznego.");
    }

    if (!isNaN(outerDiameterValue) && !isNaN(innerDiameterValue)) {
        return (
            (((outerDiameterValue + innerDiameterValue) * Math.PI) / 1000) *
            multiplier
        );
    } else {
        throw new Error("Proszę podać fi zewnętrzne dla koła.");
    }
};
