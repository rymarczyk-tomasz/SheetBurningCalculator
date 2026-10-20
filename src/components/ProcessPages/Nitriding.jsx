import MassThicknessLookup from "./MassThicknessLookup";

export default function Nitriding() {
    return (
        <MassThicknessLookup
            csvUrl={`${import.meta.env.BASE_URL}azotowanie.csv`}
            resultLabel="Czas azotowania"
            thicknessLabel="Grubość warstwy azotowanej [mm]:"
            thicknessPlaceholder="Wpisz grubość warstwy azotowanej w mm (ręcznie)"
        />
    );
}
