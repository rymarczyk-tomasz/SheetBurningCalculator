import { useResultHistory } from "../context/resultHistory";
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

export default function ResultHistory() {
    const { entries, clearEntries } = useResultHistory();

    if (!entries.length) return null;

    return (
        <section className="result-history">
            <div className="result-history-header">
                <h2>Historia wyników</h2>
                <button type="button" onClick={clearEntries}>
                    Wyczyść historię
                </button>
            </div>
            <ul>
                {entries.map((entry) => (
                    <li key={entry.id} className="result-history-item">
                        <span className="result-history-meta">
                            {timeFormat.format(new Date(entry.time))} ·{" "}
                            {entry.process}
                        </span>
                        {entryLines(entry).map((line, idx) => (
                            <div key={idx} className="result-row">
                                <span className="result-history-text">
                                    {line.text}
                                </span>
                                {line.copy && <CopyButton text={line.copy} />}
                            </div>
                        ))}
                    </li>
                ))}
            </ul>
        </section>
    );
}
