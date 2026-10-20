import MassThicknessLookup from "./MassThicknessLookup";

export default function Carburizing() {
    return (
        <MassThicknessLookup
            csvUrl={`${import.meta.env.BASE_URL}naweglanie.csv`}
            resultLabel="Czas nawęglania"
            thicknessLabel="Grubość warstwy nawęglanej Eht [mm]:"
            thicknessPlaceholder="Wpisz grubość warstwy nawęglanej Eht w mm (ręcznie)"
        />
    );
}
