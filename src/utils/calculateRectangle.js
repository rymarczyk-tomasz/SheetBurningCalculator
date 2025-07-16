export const calculateRectangle = (length, width, multiplier) => {
    const lengthValue = parseFloat(length);
    const widthValue = parseFloat(width);

    if (!isNaN(lengthValue) && !isNaN(widthValue)) {
        return (((lengthValue + widthValue) * 2) / 1000) * multiplier;
    } else {
        throw new Error("Proszę podać wszystkie dane dla czworokąta.");
    }
};
