import { describe, expect, it } from "vitest";
import { calculateMass } from "./mass";
import { UserError } from "./errors";

describe("calculateMass", () => {
    it("czworokąt 1000 x 1000 x 10 mm = 78.6 kg", () => {
        expect(
            calculateMass("rectangle", { length: "1000", width: "1000" }, "10"),
        ).toBeCloseTo(78.6);
    });

    it("pierścień i półpierścień", () => {
        const ring = calculateMass(
            "circle",
            { outerDiameter: "200", innerDiameter: "100" },
            "10",
        );
        expect(ring).toBeCloseTo((Math.PI / 4) * (200 ** 2 - 100 ** 2) * 10 * 7.86e-6);
        expect(
            calculateMass(
                "semicircle",
                { outerDiameter: "200", innerDiameter: "100" },
                "10",
            ),
        ).toBeCloseTo(ring / 2);
    });

    it("pręt nie wymaga grubości", () => {
        expect(
            calculateMass("rod", { rodDiameter: "100", rodLength: "1000" }, ""),
        ).toBeCloseTo((Math.PI / 4) * 100 ** 2 * 1000 * 7.86e-6);
    });

    it("zwraca null dla niekompletnych lub ujemnych danych", () => {
        expect(calculateMass("rectangle", { length: "1000" }, "10")).toBeNull();
        expect(
            calculateMass("rectangle", { length: "1000", width: "-5" }, "10"),
        ).toBeNull();
        expect(calculateMass("circle", { outerDiameter: "100" }, "")).toBeNull();
    });

    it("rzuca UserError zamiast zwracać ujemną masę", () => {
        expect(() =>
            calculateMass(
                "circle",
                { outerDiameter: "100", innerDiameter: "150" },
                "10",
            ),
        ).toThrow(UserError);
    });
});
