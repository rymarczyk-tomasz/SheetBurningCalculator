export const calculateTotalLength = (totalLength, multiplier) => {
    const totalLengthValue = parseFloat(totalLength);

    if (isNaN(totalLengthValue) || totalLengthValue <= 0) {
        throw new Error(
            "Proszę podać poprawną całkowitą długość wszystkich boków."
        );
    }

    return (totalLengthValue / 1000) * multiplier;
};
