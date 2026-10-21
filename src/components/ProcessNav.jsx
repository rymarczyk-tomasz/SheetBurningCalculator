import { useState } from "react";
import PropTypes from "prop-types";

function groupProcesses(processes) {
    const groups = [];
    for (const p of processes) {
        let group = groups.find((g) => g.name === p.group);
        if (!group) {
            group = { name: p.group, items: [] };
            groups.push(group);
        }
        group.items.push(p);
    }
    return groups;
}

/**
 * Boczna nawigacja po procesach, pogrupowana tematycznie, z filtrem.
 */
export default function ProcessNav({ processes, process, setProcess }) {
    const [query, setQuery] = useState("");
    const normalized = query.trim().toLocaleLowerCase("pl");
    const visible = normalized
        ? processes.filter((p) => p.label.toLocaleLowerCase("pl").includes(normalized))
        : processes;
    const groups = groupProcesses(visible);

    return (
        <nav className="sidebar" aria-label="Procesy">
            <input
                type="search"
                className="sidebar-search"
                placeholder="Szukaj procesu…"
                aria-label="Szukaj procesu"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                data-no-shortcuts
            />
            {groups.length === 0 && (
                <p className="sidebar-empty">Brak pasujących procesów</p>
            )}
            {groups.map((group) => (
                <section key={group.name} className="nav-group">
                    <h2 className="nav-group-title">{group.name}</h2>
                    <ul>
                        {group.items.map((p) => {
                            const isActive = process === p.value;
                            return (
                                <li key={p.value}>
                                    <button
                                        type="button"
                                        className={`nav-item${isActive ? " nav-item--active" : ""}`}
                                        onClick={() => setProcess(p.value)}
                                        disabled={p.disabled}
                                        aria-current={isActive ? "page" : undefined}
                                    >
                                        <span>{p.label}</span>
                                        {p.disabled && p.disabledReason && (
                                            <small>{p.disabledReason}</small>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            ))}
        </nav>
    );
}

ProcessNav.propTypes = {
    processes: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            group: PropTypes.string.isRequired,
            disabled: PropTypes.bool,
            disabledReason: PropTypes.string,
        }),
    ).isRequired,
    process: PropTypes.string.isRequired,
    setProcess: PropTypes.func.isRequired,
};
