import { useState } from "react";
import "./App.css";

import ProcessSelector from "./components/ProcessSelector";
import ResultHistory from "./components/ResultHistory";
import ResultHistoryProvider from "./context/ResultHistoryProvider";
import { ProcessLabelContext } from "./context/resultHistory";
import { PROCESSES } from "./processes";

function App() {
    const [processId, setProcessId] = useState(PROCESSES[0].value);
    const current = PROCESSES.find((p) => p.value === processId);
    const ProcessPage = current.component;

    return (
        <ResultHistoryProvider>
            <div className="container">
                <h1>Kalkulator normatywu czasu pracy</h1>
                <ProcessSelector
                    processes={PROCESSES}
                    process={processId}
                    setProcess={setProcessId}
                />

                <div className="secondary-container">
                    <ProcessLabelContext.Provider value={current.label}>
                        <ProcessPage key={processId} />
                    </ProcessLabelContext.Provider>
                </div>

                <ResultHistory />
            </div>
        </ResultHistoryProvider>
    );
}

export default App;
