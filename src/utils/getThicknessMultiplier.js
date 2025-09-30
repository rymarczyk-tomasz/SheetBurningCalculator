export const thicknessMultiplierData = [
    { min: 3, max: 3.99, multiplier: 0.007 },
    { min: 4, max: 4.99, multiplier: 0.01 },
    { min: 5, max: 5.99, multiplier: 0.011 },
    { min: 6, max: 11.99, multiplier: 0.014 },
    { min: 12, max: 14.99, multiplier: 0.02 },
    { min: 15, max: 19.99, multiplier: 0.022 },
    { min: 20, max: 24.99, multiplier: 0.02 },
    { min: 25, max: 27.99, multiplier: 0.045 },
    { min: 28, max: 34.99, multiplier: 0.05 },
    { min: 35, max: 44.99, multiplier: 0.055 },
    { min: 45, max: 49.99, multiplier: 0.06 },
    { min: 50, max: 54.99, multiplier: 0.065 },
    { min: 55, max: 64.99, multiplier: 0.07 },
    { min: 65, max: 69.99, multiplier: 0.075 },
    { min: 70, max: 74.99, multiplier: 0.08 },
    { min: 75, max: 84.99, multiplier: 0.085 },
    { min: 85, max: 89.99, multiplier: 0.09 },
    { min: 90, max: 94.99, multiplier: 0.095 },
    { min: 95, max: 109.99, multiplier: 0.1 },
    { min: 110, max: 119.99, multiplier: 0.11 },
    { min: 120, max: 129.99, multiplier: 0.115 },
    { min: 130, max: 139.99, multiplier: 0.125 },
    { min: 140, max: 149.99, multiplier: 0.13 },
    { min: 150, max: 159.99, multiplier: 0.14 },
    { min: 160, max: 179.99, multiplier: 0.145 },
    { min: 180, max: 199.99, multiplier: 0.16 },
    { min: 200, max: 219.99, multiplier: 0.175 },
    { min: 220, max: 239.99, multiplier: 0.19 },
    { min: 240, max: 259.99, multiplier: 0.205 },
    { min: 260, max: 279.99, multiplier: 0.22 },
    { min: 280, max: 299.99, multiplier: 0.235 },
    { min: 300, max: 400, multiplier: 0.25 },
];

export function getThicknessMultiplier(thickness) {
    const found = thicknessMultiplierData.find(
        (row) => thickness >= row.min && thickness <= row.max
    );
    return found ? found.multiplier : 0.5;
}
