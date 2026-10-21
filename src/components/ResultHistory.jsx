import { useResultHistory } from "../context/resultHistory";
import { getTimeValue, localizeDecimals } from "../utils/resultLine";
import CopyButton from "./CopyButton";

const timeFormat = new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
});

// Wpisy zapisane przed wprowadzeniem linii z wartością do kopiowania mają tylko `text`
const entryLines = (entry) =>
    entry.lines ?? [{ text: entry.text, copy: entry.text }];

const displayText = (line) =>
    getTimeValue(line) ? localizeDecimals(line.text) : line.text;

export default function ResultHistory() {
    const { entries, clearEntries } = useResultHistory();

    return (
        <aside className="history" aria-label="Historia wyników">
            <div className="history-header">
                <h2>Historia wyników</h2>
                {entries.length > 0 && (
                    <button
                        type="button"
                        className="btn btn--text"
                        onClick={clearEntries}
                    >
                        Wyczyść
                    </button>
                )}
            </div>
            {entries.length === 0 ? (
                <p className="history-empty">
                    Tutaj pojawią się ostatnie obliczenia.
                </p>
            ) : (
                <ul>
                    {entries.map((entry) => (
                        <li key={entry.id} className="history-item">
                            <span className="history-meta">
                                {timeFormat.format(new Date(entry.time))} ·{" "}
                                {entry.process}
                            </span>
                            {entryLines(entry).map((line, idx) => (
                                <div key={idx} className="result-row">
                                    <span className="history-text">
                                        {displayText(line)}
                                    </span>
                                    {line.copy && <CopyButton text={line.copy} />}
                                </div>
                            ))}
                        </li>
                    ))}
                </ul>
            )}
        </aside>
    );
}
