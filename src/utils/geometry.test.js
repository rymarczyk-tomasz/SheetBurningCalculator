import { describe, expect, it } from "vitest";
import { getHolesLengthMm, getPerimeterMm, getPerimeterTime } from "./geometry";
import { UserError } from "./errors";

describe("getPerimeterMm", () => {
    it("czworokąt: 2 * (A + B)", () => {
        expect(getPerimeterMm("rectangle", { length: "1000", width: "500" })).toBe(
            3000,
        );
    });

    it("okrąg: obwód zewnętrzny + wewnętrzny", () => {
        expect(getPerimeterMm("circle", { outerDiameter: "100" })).toBeCloseTo(
            Math.PI * 100,
        );
        expect(
            getPerimeterMm("circle", { outerDiameter: "100", innerDiameter: "50" }),
        ).toBeCloseTo(Math.PI * 150);
    });

    it("półpierścień: połowa łuków + dwa proste odcinki", () => {
        expect(
            getPerimeterMm("semicircle", {
                outerDiameter: "100",
                innerDiameter: "50",
            }),
        ).toBeCloseTo((Math.PI * 150) / 2 + 50);
        // Półkole bez otworu: łuk + średnica
        expect(getPerimeterMm("semicircle", { outerDiameter: "100" })).toBeCloseTo(
            (Math.PI * 100) / 2 + 100,
        );
    });

    it("całkowita długość boków", () => {
        expect(getPerimeterMm("totalLength", { totalLength: "1234,5" })).toBe(
            1234.5,
        );
    });

    it("odrzuca fi wewnętrzne >= zewnętrznemu", () => {
        expect(() =>
            getPerimeterMm("circle", { outerDiameter: "50", innerDiameter: "50" }),
        ).toThrow(UserError);
    });

    it("odrzuca brakujące, zerowe i ujemne wymiary", () => {
        expect(() => getPerimeterMm("rectangle", { length: "100" })).toThrow(
            UserError,
        );
        expect(() =>
            getPerimeterMm("rectangle", { length: "-100", width: "100" }),
        ).toThrow(UserError);
        expect(() =>
            getPerimeterMm("circle", { outerDiameter: "100", innerDiameter: "-5" }),
        ).toThrow(UserError);
    });

    it("odrzuca nieznany kształt", () => {
        expect(() => getPerimeterMm("hexagon", {})).toThrow(UserError);
    });
});

describe("getHolesLengthMm", () => {
    it("sumuje otwory kołowe i czworokątne", () => {
        const holes = [{ diameter: "10", count: "2" }];
        const rectHoles = [{ a: "20", b: "30", count: "1" }];
        expect(getHolesLengthMm(holes, rectHoles)).toBeCloseTo(
            Math.PI * 10 * 2 + 100,
        );
    });

    it("pomija niekompletne wiersze", () => {
        const holes = [
            { diameter: "", count: "" },
            { diameter: "10", count: "" },
        ];
        expect(getHolesLengthMm(holes, [{ a: "5", b: "", count: "1" }])).toBe(0);
    });
});

describe("getPerimeterTime", () => {
    it("liczy czas jako długość [m] * mnożnik", () => {
        const hours = getPerimeterTime(
            {
                shape: "rectangle",
                dims: { length: "1000", width: "500" },
                rectHoles: [{ a: "100", b: "100", count: "1" }],
            },
            0.1,
        );
        expect(hours).toBeCloseTo(3.4 * 0.1);
    });
});
