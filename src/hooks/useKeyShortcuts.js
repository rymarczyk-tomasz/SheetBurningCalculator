import { useEffect } from "react";

/**
 * @param {Object} params
 * @param {function} params.onEnter
 * @param {function} params.onEscape
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
