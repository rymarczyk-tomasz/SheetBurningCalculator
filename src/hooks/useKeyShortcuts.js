import { useContext, useEffect, useRef } from "react";
import { ProcessActiveContext } from "../context/processActive";

// Enter na tych elementach ma własne działanie (klik, wybór opcji, nowa linia)
const IGNORED_ENTER_TAGS = new Set(["BUTTON", "A", "TEXTAREA", "SELECT"]);
// Escape w liście wyboru zamyka ją — nie może przy okazji kasować formularza
const IGNORED_ESCAPE_TAGS = new Set(["SELECT"]);

/**
 * Skróty klawiszowe strony: Enter — oblicz, Escape — wyczyść.
 * Działają tylko dla widocznej strony procesu i nie przechwytują klawiszy
 * w elementach oznaczonych data-no-shortcuts (np. wyszukiwarka).
 *
 * @param {Object} params
 * @param {function} [params.onEnter]
 * @param {function} [params.onEscape]
 */
export default function useKeyShortcuts({ onEnter, onEscape }) {
    const active = useContext(ProcessActiveContext);
    const handlers = useRef({ onEnter, onEscape, active });

    useEffect(() => {
        handlers.current = { onEnter, onEscape, active };
    });

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.defaultPrevented || event.isComposing) return;
            if (!handlers.current.active) return;
            if (event.target.closest?.("[data-no-shortcuts]")) return;

            const tag = event.target.tagName;
            if (event.key === "Enter" && !IGNORED_ENTER_TAGS.has(tag)) {
                handlers.current.onEnter?.();
            } else if (event.key === "Escape" && !IGNORED_ESCAPE_TAGS.has(tag)) {
                handlers.current.onEscape?.();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);
}
