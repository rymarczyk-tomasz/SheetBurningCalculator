import { useEffect, useRef } from "react";

// Enter na tych elementach ma własne działanie (np. klik przycisku) — nie uruchamiamy obliczeń
const IGNORED_ENTER_TAGS = new Set(["BUTTON", "A", "TEXTAREA"]);

/**
 * Skróty klawiszowe strony: Enter — oblicz, Escape — wyczyść.
 *
 * @param {Object} params
 * @param {function} [params.onEnter]
 * @param {function} [params.onEscape]
 */
export default function useKeyShortcuts({ onEnter, onEscape }) {
    const handlers = useRef({ onEnter, onEscape });

    useEffect(() => {
        handlers.current = { onEnter, onEscape };
    });

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.defaultPrevented || event.isComposing) return;

            if (
                event.key === "Enter" &&
                !IGNORED_ENTER_TAGS.has(event.target.tagName)
            ) {
                handlers.current.onEnter?.();
            } else if (event.key === "Escape") {
                handlers.current.onEscape?.();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);
}
