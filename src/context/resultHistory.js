import { createContext, useContext } from "react";

export const ResultHistoryContext = createContext({
    entries: [],
    addEntry: () => {},
    clearEntries: () => {},
});

/** Nazwa aktualnie wybranego procesu (zapisywana razem z wynikiem w historii). */
export const ProcessLabelContext = createContext("");

export function useResultHistory() {
    return useContext(ResultHistoryContext);
}
