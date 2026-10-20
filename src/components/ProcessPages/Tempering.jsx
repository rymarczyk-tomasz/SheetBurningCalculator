import MassThicknessLookup from "./MassThicknessLookup";

export default function Tempering() {
    return (
        <MassThicknessLookup
            csvUrl={`${import.meta.env.BASE_URL}obrobka_cieplna.csv`}
            resultLabel="Czas ulepszania cieplnego"
            thicknessLabel="Grubość materiału (mm):"
            thicknessPlaceholder="Wpisz grubość w mm"
            linkThickness
        />
    );
}
