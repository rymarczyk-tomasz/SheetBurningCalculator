import { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { ResultHistoryContext } from "./resultHistory";

const STORAGE_KEY = "resultHistory";
const MAX_ENTRIES = 50;

function loadEntries() {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(stored) ? stored : [];
    } catch {
        return [];
    }
}

function saveEntries(entries) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
        // Brak dostępu do localStorage (np. tryb prywatny) — historia działa tylko w tej sesji
    }
}

let nextId = Date.now();

export default function ResultHistoryProvider({ children }) {
    const [entries, setEntries] = useState(loadEntries);

    useEffect(() => saveEntries(entries), [entries]);

    const addEntry = useCallback((process, lines) => {
        setEntries((prev) => {
            const last = prev[0];
            if (
                last &&
                last.process === process &&
                JSON.stringify(last.lines) === JSON.stringify(lines)
            ) {
                return prev;
            }
            const entry = {
                id: nextId++,
                time: new Date().toISOString(),
                process,
                lines,
            };
            return [entry, ...prev].slice(0, MAX_ENTRIES);
        });
    }, []);

    const clearEntries = useCallback(() => setEntries([]), []);

    const value = useMemo(
        () => ({ entries, addEntry, clearEntries }),
        [entries, addEntry, clearEntries],
    );

    return (
        <ResultHistoryContext.Provider value={value}>
            {children}
        </ResultHistoryContext.Provider>
    );
}

ResultHistoryProvider.propTypes = {
    children: PropTypes.node,
};
