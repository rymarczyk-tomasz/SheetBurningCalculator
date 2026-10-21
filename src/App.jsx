import { useCallback, useEffect, useState } from "react";
import "./App.css";

import ProcessNav from "./components/ProcessNav";
import ResultHistory from "./components/ResultHistory";
import ResultHistoryProvider from "./context/ResultHistoryProvider";
import { ProcessLabelContext } from "./context/resultHistory";
import { ProcessActiveContext } from "./context/processActive";
import { PROCESSES } from "./processes";

const STORAGE_KEY = "lastProcess";

const isSelectable = (id) =>
    PROCESSES.some((p) => p.value === id && !p.disabled);

function readInitialProcess() {
    const fromHash = window.location.hash.slice(1);
    if (isSelectable(fromHash)) return fromHash;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (isSelectable(stored)) return stored;
    } catch {
        // localStorage niedostępny — zaczynamy od pierwszego procesu
    }
    return PROCESSES.find((p) => !p.disabled).value;
}

function App() {
    const [processId, setProcessId] = useState(readInitialProcess);
    // Odwiedzone strony zostają zamontowane, dzięki czemu wpisane dane nie znikają przy zmianie procesu
    const [visited, setVisited] = useState(() => [processId]);
    const current = PROCESSES.find((p) => p.value === processId);

    const selectProcess = useCallback((id) => {
        if (!isSelectable(id)) return;
        setProcessId(id);
        setVisited((prev) => (prev.includes(id) ? prev : [...prev, id]));
    }, []);

    useEffect(() => {
        if (window.location.hash.slice(1) !== processId) {
            window.history.replaceState(null, "", `#${processId}`);
        }
        try {
            localStorage.setItem(STORAGE_KEY, processId);
        } catch {
            // brak zapisu nie jest krytyczny
        }
        document.title = `${current.label} · Normatywy czasu pracy`;
    }, [processId, current.label]);

    useEffect(() => {
        const onHashChange = () => selectProcess(window.location.hash.slice(1));
        window.addEventListener("hashchange", onHashChange);
        return () => window.removeEventListener("hashchange", onHashChange);
    }, [selectProcess]);

    return (
        <ResultHistoryProvider>
            <div className="app">
                <header className="app-header">
                    <h1>Kalkulator normatywu czasu pracy</h1>
                </header>
                <div className="app-layout">
                    <ProcessNav
                        processes={PROCESSES}
                        process={processId}
                        setProcess={selectProcess}
                    />
                    <main className="main">
                        <h2 className="page-title">{current.label}</h2>
                        {PROCESSES.filter((p) => visited.includes(p.value)).map(
                            (p) => {
                                const Page = p.component;
                                const active = p.value === processId;
                                return (
                                    <div key={p.value} className="card" hidden={!active}>
                                        <ProcessLabelContext.Provider value={p.label}>
                                            <ProcessActiveContext.Provider value={active}>
                                                <Page />
                                            </ProcessActiveContext.Provider>
                                        </ProcessLabelContext.Provider>
                                    </div>
                                );
                            },
                        )}
                    </main>
                    <ResultHistory />
                </div>
            </div>
        </ResultHistoryProvider>
    );
}

export default App;
