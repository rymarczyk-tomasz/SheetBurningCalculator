import MassThicknessLookup from "./MassThicknessLookup";

export default function Tempering() {
    return (
        <MassThicknessLookup
            csvUrl={`${import.meta.env.BASE_URL}1000033414_20250702101659.csv`}
            resultLabel="Czas ulepszania cieplnego"
            thicknessLabel="Grubość materiału (mm):"
            thicknessPlaceholder="Wpisz grubość w mm"
            linkThickness
        />
    );
}
