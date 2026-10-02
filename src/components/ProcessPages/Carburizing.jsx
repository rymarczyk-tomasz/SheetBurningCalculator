import MassThicknessLookup from "./MassThicknessLookup";

// Plik zawiera polskie znaki — URL musi być zakodowany
export default function Carburizing() {
    return (
        <MassThicknessLookup
            csvUrl={`${import.meta.env.BASE_URL}naw%C4%99glanie.csv`}
            resultLabel="Czas nawęglania"
            thicknessLabel="Grubość warstwy nawęglanej Eht [mm]:"
            thicknessPlaceholder="Wpisz grubość warstwy nawęglanej Eht w mm (ręcznie)"
        />
    );
}
