import { useEffect } from "react";

/**
 * @param {Object} params
 * @param {function} params.onEnter
 * @param {function} params.onEscape
 */
export default function useKeyShortcuts({ onEnter, onEscape }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onEscape?.();
        return;
      }

      const target = event.target;
      const tagName = target?.tagName?.toLowerCase();
      const isEditable =
        target?.isContentEditable ||
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select";

      if (isEditable) {
        return;
      }

      if (event.key === "Enter") onEnter?.();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onEnter, onEscape]);
}
