import { useCallback, useContext, useState } from "react";
import { ProcessLabelContext, useResultHistory } from "../context/resultHistory";
import { UserError } from "../utils/errors";
import { resultLine } from "../utils/resultLine";

/**
 * Obsługa wyniku obliczeń: uruchamia funkcję liczącą (synchroniczną lub async),
 * zapisuje wynik/błąd do wyświetlenia i dodaje udane wyniki do historii.
 *
 * Funkcja licząca zwraca linię wyniku (resultLine lub tekst) albo ich tablicę,
 * ewentualnie rzuca UserError.
 */
export default function useCalculation() {
    const processLabel = useContext(ProcessLabelContext);
    const { addEntry } = useResultHistory();
    const [result, setResult] = useState(null);
    const [pending, setPending] = useState(false);

    const run = useCallback(
        async (compute) => {
            setPending(true);
            try {
                const value = await compute();
                const lines = (Array.isArray(value) ? value : [value]).map(
                    (line) => (typeof line === "string" ? resultLine(line) : line),
                );
                setResult({ kind: "success", lines });
                addEntry(processLabel, lines);
            } catch (error) {
                if (!(error instanceof UserError)) console.error(error);
                const message =
                    error instanceof UserError
                        ? error.message
                        : "Wystąpił nieoczekiwany błąd obliczeń.";
                setResult({ kind: "error", lines: [{ text: message }] });
            } finally {
                setPending(false);
            }
        },
        [addEntry, processLabel],
    );

    const clearResult = useCallback(() => setResult(null), []);

    return { result, run, clearResult, pending };
}
