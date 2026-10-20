import { useEffect, useState } from "react";
import PropTypes from "prop-types";

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
            setStatus("Skopiowano");
        } catch {
            setStatus("Nie udało się skopiować");
        }
    };

    return (
        <button type="button" className="copy-btn" onClick={handleCopy}>
            {status ?? "Kopiuj"}
        </button>
    );
}

CopyButton.propTypes = {
    text: PropTypes.string.isRequired,
};
