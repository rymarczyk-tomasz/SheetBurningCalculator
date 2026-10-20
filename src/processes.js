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
 * Lista procesów: kolejność przycisków w ProcessSelector i komponent strony procesu.
 */
export const PROCESSES = [
    { value: "burning", label: "Palenie", component: BurningCalculator },
    { value: "saw", label: "Cięcie", component: SawCalculator },
    {
        value: "waterjet",
        label: "Cięcie wodą",
        component: WaterjetCalculator,
        disabled: true,
        disabledReason: "Kalkulator w naprawie",
    },
    { value: "hardening", label: "Hartowanie", component: Hardening },
    { value: "nitriding", label: "Azotowanie", component: Nitriding },
    { value: "annealing", label: "Wyżarzanie", component: Annealing },
    { value: "tempering", label: "Ulepszanie cieplne", component: Tempering },
    { value: "carburizing", label: "Nawęglanie", component: Carburizing },
    { value: "beveling", label: "Fazowanie", component: Beveling },
    {
        value: "grindingAfterBurning",
        label: "Szlifowanie po paleniu",
        component: GrindingAfterBurning,
    },
    { value: "deburring", label: "Gratowanie", component: Deburring },
    { value: "straightening", label: "Prostowanie", component: Straightening },
    {
        value: "bevelingMilling",
        label: "Fazowanie (frezowanie)",
        component: BevelingMilling,
    },
    { value: "welding", label: "Spawanie ręczne MAG-135", component: Welding },
    {
        value: "pipeSchedule",
        label: "Rury wg ASME B36.10/19",
        component: PipeSchedule,
    },
];
