import { useEffect } from "react";

/**
 * Hook do obsługi skrótów klawiszowych (Enter / Escape)
 * @param {Object} params
 * @param {function} params.onEnter - funkcja uruchamiana po Enter
 * @param {function} params.onEscape - funkcja uruchamiana po Escape
 */
export default function useKeyShortcuts({ onEnter, onEscape }) {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Enter") onEnter?.();
            if (event.key === "Escape") onEscape?.();
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onEnter, onEscape]);
}
