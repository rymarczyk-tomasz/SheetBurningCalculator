import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const COPY_ICON = (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <rect
            x="9"
            y="9"
            width="11"
            height="11"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        />
        <path
            d="M5 15V6a2 2 0 0 1 2-2h9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

const CHECK_ICON = (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
            d="M5 12.5l4.5 4.5L19 7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const CROSS_ICON = (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
            d="M6 6l12 12M18 6L6 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
        />
    </svg>
);

const STATUS_TEXT = {
    ok: "Skopiowano",
    error: "Nie udało się skopiować",
};

/**
 * Ikona kopiowania o stałym rozmiarze; stan ("Skopiowano") jest ogłaszany czytnikom ekranu.
 */
export default function CopyButton({ text }) {
    const [status, setStatus] = useState(null);

    useEffect(() => {
        if (!status) return;
        const timer = setTimeout(() => setStatus(null), 1500);
        return () => clearTimeout(timer);
    }, [status]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setStatus("ok");
        } catch {
            setStatus("error");
        }
    };

    const icon =
        status === "ok" ? CHECK_ICON : status === "error" ? CROSS_ICON : COPY_ICON;

    return (
        <>
            <button
                type="button"
                className={`copy-btn${status ? ` copy-btn--${status}` : ""}`}
                onClick={handleCopy}
                title={status ? STATUS_TEXT[status] : "Kopiuj wartość"}
                aria-label={`Kopiuj: ${text}`}
            >
                {icon}
            </button>
            <span className="sr-only" role="status" aria-live="polite">
                {status ? STATUS_TEXT[status] : ""}
            </span>
        </>
    );
}

CopyButton.propTypes = {
    text: PropTypes.string.isRequired,
};
