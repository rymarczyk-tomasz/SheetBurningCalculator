import BurningCalculator from "./components/BurningCalculator/BurningCalculator";
import SawCalculator from "./components/SawCalculator/SawCalculator";
import WaterjetCalculator from "./components/WaterjetCalculator/WaterjetCalculator";
import Hardening from "./components/ProcessPages/Hardening";
import Nitriding from "./components/ProcessPages/Nitriding";
import Annealing from "./components/ProcessPages/Annealing";
import Tempering from "./components/ProcessPages/Tempering";
import Carburizing from "./components/ProcessPages/Carburizing";
import Beveling from "./components/ProcessPages/Beveling";
import GrindingAfterBurning from "./components/ProcessPages/GrindingAfterBurning";
import Deburring from "./components/ProcessPages/Deburring";
import Straightening from "./components/ProcessPages/Straightening";
import BevelingMilling from "./components/ProcessPages/BevelingMilling";
import Welding from "./components/ProcessPages/Welding";
import PipeSchedule from "./components/ProcessPages/PipeSchedule";

/**
 * Lista procesów: kolejność i grupa w nawigacji bocznej oraz komponent strony procesu.
 */
export const PROCESSES = [
    {
        value: "burning",
        group: "Cięcie",
        label: "Palenie",
        component: BurningCalculator,
    },
    {
        value: "saw",
        group: "Cięcie",
        label: "Cięcie",
        component: SawCalculator,
    },
    {
        value: "waterjet",
        group: "Cięcie",
        label: "Cięcie wodą",
        component: WaterjetCalculator,
        disabled: true,
        disabledReason: "Kalkulator w naprawie",
    },
    {
        value: "hardening",
        group: "Obróbka cieplna",
        label: "Hartowanie",
        component: Hardening,
    },
    {
        value: "nitriding",
        group: "Obróbka cieplna",
        label: "Azotowanie",
        component: Nitriding,
    },
    {
        value: "annealing",
        group: "Obróbka cieplna",
        label: "Wyżarzanie",
        component: Annealing,
    },
    {
        value: "tempering",
        group: "Obróbka cieplna",
        label: "Ulepszanie cieplne",
        component: Tempering,
    },
    {
        value: "carburizing",
        group: "Obróbka cieplna",
        label: "Nawęglanie",
        component: Carburizing,
    },
    {
        value: "beveling",
        group: "Obróbka mechaniczna",
        label: "Fazowanie",
        component: Beveling,
    },
    {
        value: "grindingAfterBurning",
        group: "Obróbka mechaniczna",
        label: "Szlifowanie po paleniu",
        component: GrindingAfterBurning,
    },
    {
        value: "deburring",
        group: "Obróbka mechaniczna",
        label: "Gratowanie",
        component: Deburring,
    },
    {
        value: "straightening",
        group: "Obróbka mechaniczna",
        label: "Prostowanie",
        component: Straightening,
    },
    {
        value: "bevelingMilling",
        group: "Obróbka mechaniczna",
        label: "Fazowanie (frezowanie)",
        component: BevelingMilling,
    },
    {
        value: "welding",
        group: "Spawanie",
        label: "Spawanie ręczne MAG-135",
        component: Welding,
    },
    {
        value: "pipeSchedule",
        group: "Rury",
        label: "Rury wg ASME B36.10/19",
        component: PipeSchedule,
    },
];
