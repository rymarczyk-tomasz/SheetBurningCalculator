import MassThicknessLookup from "./MassThicknessLookup";

export default function Hardening() {
    return (
        <MassThicknessLookup
            csvUrl={`${import.meta.env.BASE_URL}obrobka_cieplna.csv`}
            resultLabel="Czas hartowania"
            thicknessLabel="Grubość materiału (mm):"
            thicknessPlaceholder="Wpisz grubość w mm"
            linkThickness
        />
    );
}
