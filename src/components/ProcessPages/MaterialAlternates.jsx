import { useId, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import CopyButton from "../CopyButton";
import useKeyShortcuts from "../../hooks/useKeyShortcuts";
import {
    COLUMNS,
    findAlternates,
    formLabel,
    parseAlternatesData,
    requestText,
    rowNoteRefs,
    splitAlternate,
    translate,
} from "../../utils/materialAlternates";

// Karta D50A152 jest poufna — trzymamy ją wyłącznie w przeglądarce użytkownika
const STORAGE_KEY = "d50a152Data";
const DATA_FOLDER = "R:\\D50A152 Zamienniki materiałowe\\Aktualna wersja";

function readStoredData() {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!stored) return null;
        return { fileName: stored.fileName, data: parseAlternatesData(stored.text) };
    } catch {
        return null;
    }
}

/** Tekst z karty po polsku; oryginał pod spodem, gdy jest tłumaczenie. */
function Translated({ data, group, text, className }) {
    const pl = translate(data, group, text);
    return (
        <>
            <p className={className}>{pl ?? text}</p>
            {pl && pl !== text && <p className="alt-original">{text}</p>}
        </>
    );
}

Translated.propTypes = {
    data: PropTypes.object.isRequired,
    group: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    className: PropTypes.string,
};

function AlternateItem({ data, row, columnKey, alternate }) {
    const { material, conditions } = splitAlternate(alternate);
    return (
        <li className="alt-item">
            <div>
                <p className="alt-material">{material}</p>
                {conditions && (
                    <Translated
                        data={data}
                        group="conditions"
                        text={conditions}
                        className="alt-conditions"
                    />
                )}
            </div>
            <CopyButton
                text={requestText(data, row, columnKey, alternate)}
                label={`Kopiuj opis do wniosku: ${material}`}
            />
        </li>
    );
}

AlternateItem.propTypes = {
    data: PropTypes.object.isRequired,
    row: PropTypes.object.isRequired,
    columnKey: PropTypes.string.isRequired,
    alternate: PropTypes.string.isRequired,
};

function AlternateRow({ data, row }) {
    const notes = rowNoteRefs(row).filter((n) => data.notes?.[n]);
    const columns = COLUMNS.filter(
        ({ key }) => row[key]?.length > 0 || row.remarks?.[key],
    );

    return (
        <section className="alt-row">
            <header className="alt-row-head">
                <h3>{row.spec}</h3>
                {row.form && (
                    <span className="alt-form" title={row.form}>
                        {translate(data, "forms", row.form) ?? row.form}
                    </span>
                )}
                {row.new && <span className="badge">zmiana w rev. {data.revision}</span>}
            </header>
            {row.name && (
                <Translated data={data} group="names" text={row.name} className="alt-row-meta" />
            )}
            {row.form && (
                <p className="alt-row-meta">
                    Zamienniki z tego wiersza dotyczą postaci wyrobu: {formLabel(data, row.form)}
                </p>
            )}
            <div className="alt-columns">
                {columns.map(({ key, label }) => (
                    <div key={key} className="alt-column">
                        <h4>{label}</h4>
                        <ul>
                            {(row[key] ?? []).map((alternate) => (
                                <AlternateItem
                                    key={alternate}
                                    data={data}
                                    row={row}
                                    columnKey={key}
                                    alternate={alternate}
                                />
                            ))}
                        </ul>
                        {row.remarks?.[key] && (
                            <div className="alt-remark">
                                <Translated
                                    data={data}
                                    group="conditions"
                                    text={row.remarks[key]}
                                    className="alt-remark-text"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {notes.length > 0 && (
                <dl className="alt-notes">
                    {notes.map((n) => (
                        <div key={n}>
                            <dt>Note {n}♠</dt>
                            <dd>{data.notes[n]}</dd>
                        </div>
                    ))}
                </dl>
            )}
        </section>
    );
}

AlternateRow.propTypes = {
    data: PropTypes.object.isRequired,
    row: PropTypes.object.isRequired,
};

function AlstomTable({ rows }) {
    return (
        <div className="alt-table-wrap">
            <table className="alt-table">
                <thead>
                    <tr>
                        <th>Tabela</th>
                        <th>Materiał</th>
                        <th>Specyfikacja</th>
                        <th>Zamiennik</th>
                        <th>Specyfikacja GE</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, idx) => (
                        <tr key={idx}>
                            <td>{row.table === 2 ? "2 – turbiny parowe" : "3 – generatory"}</td>
                            <td>{row.specified}</td>
                            <td>{row.reference}</td>
                            <td>
                                {row.alternate} <small>({row.region})</small>
                            </td>
                            <td>{row.geSpec}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

AlstomTable.propTypes = { rows: PropTypes.arrayOf(PropTypes.object).isRequired };

export default function MaterialAlternates() {
    const inputId = useId();
    const fileInput = useRef(null);
    const [source, setSource] = useState(readStoredData);
    const [loadError, setLoadError] = useState(null);
    const [query, setQuery] = useState("");

    const data = source?.data;
    const result = useMemo(
        () => (data && query.trim() ? findAlternates(data, query) : null),
        [data, query],
    );

    useKeyShortcuts({ onEscape: () => setQuery("") });

    const handleFile = async (event) => {
        const file = event.target.files[0];
        event.target.value = "";
        if (!file) return;
        try {
            const text = await file.text();
            const parsed = parseAlternatesData(text);
            setSource({ fileName: file.name, data: parsed });
            setLoadError(null);
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({ fileName: file.name, text }));
            } catch {
                setLoadError("Nie udało się zapamiętać pliku — trzeba go będzie wczytać ponownie.");
            }
        } catch (err) {
            setLoadError(err.message);
        }
    };

    const handleRemove = () => {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
            // brak dostępu do localStorage — dane i tak znikną po zamknięciu strony
        }
        setSource(null);
        setQuery("");
    };

    const nothingFound =
        result &&
        !result.exact.length &&
        !result.similar.length &&
        !result.usedAsAlternate.length &&
        !result.alstom.length;

    return (
        <div className="alternates">
            <div className="alt-source">
                {data ? (
                    <p>
                        Karta <strong>{data.document} rev. {data.revision}</strong>
                        {data.revisionDate && ` z ${data.revisionDate}`} · plik {source.fileName}
                    </p>
                ) : (
                    <p>
                        Karta zamienników jest dokumentem poufnym GE, dlatego nie jest
                        częścią aplikacji. Wczytaj plik <strong>D50A152_*.json</strong> z folderu{" "}
                        <code className="alt-path">{DATA_FOLDER}</code> — dane zostaną
                        zapamiętane tylko w tej przeglądarce.
                    </p>
                )}
                <div className="alt-source-actions">
                    <button
                        type="button"
                        className="btn btn--secondary"
                        onClick={() => fileInput.current.click()}
                    >
                        {data ? "Wczytaj inny plik" : "Wczytaj plik"}
                    </button>
                    {data && (
                        <button type="button" className="btn btn--text" onClick={handleRemove}>
                            Usuń z przeglądarki
                        </button>
                    )}
                </div>
                <input
                    ref={fileInput}
                    type="file"
                    accept=".json,application/json"
                    hidden
                    onChange={handleFile}
                />
            </div>
            {loadError && <p className="result--error-text">{loadError}</p>}

            {data && (
                <div className="form-group">
                    <label htmlFor={inputId}>Materiał wg rysunku</label>
                    <input
                        type="search"
                        id={inputId}
                        autoComplete="off"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder='np. "B4A8A", "ASTM A36", "B50A902B", "NB 00028"'
                    />
                </div>
            )}

            {result && (
                <div className="alt-results" aria-live="polite">
                    {result.exact.map((row) => (
                        <AlternateRow key={row.spec} data={data} row={row} />
                    ))}

                    {result.exact.length > 0 && data.rules?.length > 0 && (
                        <section className="alt-rules">
                            <h3>Przed złożeniem wniosku</h3>
                            <ul>
                                {data.rules.map((rule) => (
                                    <li key={rule}>{rule}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {result.usedAsAlternate.length > 0 && (
                        <div className="result result--error" role="status">
                            <p className="result-text">
                                Materiału nie ma w kolumnie „Specified Material” — występuje
                                tylko jako zamiennik dla:{" "}
                                {result.usedAsAlternate.map((row) => row.spec).join(", ")}.
                                Jego zamiana na inny materiał wymaga SDR/MSR.
                            </p>
                        </div>
                    )}

                    {result.similar.length > 0 && (
                        <div className="alt-similar">
                            <p>
                                {result.exact.length
                                    ? "Inne podobne pozycje:"
                                    : "Brak dokładnego dopasowania. Podobne pozycje (sprawdź gatunek na rysunku):"}
                            </p>
                            <div className="alt-similar-list">
                                {result.similar.map((row) => (
                                    <button
                                        key={row.spec}
                                        type="button"
                                        className="btn btn--secondary"
                                        onClick={() =>
                                            setQuery((row.codes?.[0] ?? row.spec).replace("*", ""))
                                        }
                                    >
                                        {row.spec}
                                        {row.form && (
                                            <small>
                                                {translate(data, "forms", row.form) ?? row.form}
                                            </small>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {result.alstom.length > 0 && (
                        <section>
                            <h3 className="alt-section-title">Alstom (Tabele 2 i 3)</h3>
                            <AlstomTable rows={result.alstom} />
                        </section>
                    )}

                    {nothingFound && (
                        <div className="result result--error" role="status">
                            <p className="result-text">
                                Materiału nie ma w karcie {data.document} — zamiennik tylko przez
                                SDR/MSR.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
