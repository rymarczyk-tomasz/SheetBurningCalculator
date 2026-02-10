import { useState } from "react";
import "./App.css";

import ProcessSelector from "./components/ProcessSelector";
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

function App() {
  const [process, setProcess] = useState("burni3ng");

  return (
    <div className="container">
      <h1>Kalkulator normatywu czasu pracy</h1>
      <ProcessSelector process={process} setProcess={setProcess} />

      <div className="secondary-container">
        {process === "burning" && <BurningCalculator />}
        {process === "saw" && <SawCalculator />}
        {process === "waterjet" && <WaterjetCalculator />}
        {process === "hardening" && <Hardening />}
        {process === "nitriding" && <Nitriding />}
        {process === "annealing" && <Annealing />}
        {process === "tempering" && <Tempering />}
        {process === "carburizing" && <Carburizing />}
        {process === "beveling" && <Beveling />}
        {process === "grindingAfterBurning" && <GrindingAfterBurning />}
        {process === "deburring" && <Deburring />}
        {process === "straightening" && <Straightening />}
        {process === "bevelingMilling" && <BevelingMilling />}
        {process === "welding" && <Welding />}
        {process === "pipeSchedule" && <PipeSchedule />}
      </div>
    </div>
  );
}

export default App;
