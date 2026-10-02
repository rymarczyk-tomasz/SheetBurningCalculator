import MassThicknessLookup from "./MassThicknessLookup";

export default function Hardening() {
    return (
        <MassThicknessLookup
            csvUrl={`${import.meta.env.BASE_URL}1000033414_20250702101659.csv`}
            resultLabel="Czas hartowania"
            thicknessLabel="Grubość materiału (mm):"
            thicknessPlaceholder="Wpisz grubość w mm"
            linkThickness
        />
    );
}
