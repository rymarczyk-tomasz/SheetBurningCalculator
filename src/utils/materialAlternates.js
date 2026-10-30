import { UserError } from "./errors";

/**
 * Wyszukiwanie zamienników materiałowych wg karty GE D50A152.
 * Treść karty jest poufna (Class II, non-public), dlatego dane nie są częścią
 * aplikacji — użytkownik wczytuje je z lokalnego pliku JSON (format DATA_FORMAT).
 */
export const DATA_FORMAT = "d50a152-v1";

export const COLUMNS = [
    { key: "asian", label: "Asian" },
    { key: "european", label: "European & Canadian" },
    { key: "american", label: "GE Vernova & American" },
];

const MAX_SUGGESTIONS = 12;
const MAX_ALSTOM = 30;
const FILLER_WORDS = /\b(GR|GRADE|TY|TYP|TYPE)\b\.?/g;
const NOTE_REF = /Note\s*(\d+)\s*♠/gi;

/**
 * Sprowadza oznaczenie materiału do porównywalnej postaci: wielkie litery,
 * bez spacji, kropek i słów "gr."/"ty." ("ASTM Z5 gr. 70" -> "ASTMZ570").
 */
export function normalizeMaterial(text) {
    return String(text)
        .toUpperCase()
        .replace(FILLER_WORDS, " ")
        .replace(/[^A-Z0-9]/g, "");
}

/** Parsuje i sprawdza zawartość wczytanego pliku z danymi karty. */
export function parseAlternatesData(text) {
    let data;
    try {
        data = JSON.parse(text);
    } catch {
        throw new UserError("Plik nie jest poprawnym plikiem JSON.");
    }
    if (data?.format !== DATA_FORMAT || !Array.isArray(data.table1)) {
        throw new UserError("To nie jest plik z danymi karty D50A152 (nieznany format).");
    }
    return data;
}

const rowCodes = (row) => row.codes ?? [row.spec];

/**
 * Kod zakończony "*" obejmuje wszystkie gatunki specyfikacji ("X1A9*" pasuje do
 * X1A9, X1A9A, X1A9C2), ale nie do innej specyfikacji (X1A91).
 */
function matchesCode(code, query) {
    if (!code.endsWith("*")) return normalizeMaterial(code) === query;
    const base = normalizeMaterial(code.slice(0, -1));
    if (!query.startsWith(base)) return false;
    const next = query.charAt(base.length);
    return next === "" || /[A-Z]/.test(next);
}

const isExcluded = (row, query) =>
    (row.exclude ?? []).some((code) => query.startsWith(normalizeMaterial(code)));

const rowAlternates = (row) => COLUMNS.flatMap(({ key }) => row[key] ?? []);

// Specyfikacja GE bez gatunku: "X1A2C7" -> "X1A2", "X1AF47A" -> "X1AF47"
const GE_SPEC = /^[A-Z]{1,2}\d+[A-Z]{1,2}\d+/;
const specFamily = (normalized) => normalized.match(GE_SPEC)?.[0] ?? null;

/** Im mniejsza wartość, tym trafniejsza podpowiedź; Infinity — brak podobieństwa. */
function similarityRank(row, query) {
    const queryFamily = specFamily(query);
    let best = Infinity;
    for (const code of rowCodes(row)) {
        const n = normalizeMaterial(code.replace("*", ""));
        if (n.endsWith(query)) {
            best = Math.min(best, n.length - 50);
        } else if (n.includes(query) || (n.length >= 4 && query.startsWith(n))) {
            best = Math.min(best, n.length);
        } else if (queryFamily && specFamily(n) === queryFamily) {
            best = Math.min(best, 100 + n.length);
        }
    }
    return best;
}

function alstomRows(data) {
    return [
        ...(data.table2 ?? []).map((r) => ({ table: 2, r })),
        ...(data.table3 ?? []).map((r) => ({ table: 3, r })),
    ].map(({ table, r: [specified, reference, region, alternate, geSpec] }) => ({
        table,
        specified,
        reference,
        region,
        alternate,
        geSpec,
    }));
}

/**
 * Wyszukuje materiał wg rysunku.
 * - exact: wiersze Tabeli 1, w których materiał jest w kolumnie "Specified Material"
 * - similar: podpowiedzi o podobnym oznaczeniu
 * - usedAsAlternate: gdy brak wyników powyżej — wiersze, w których materiał występuje
 *   tylko jako zamiennik (tabela czytana jest od lewej do prawej — nie można go zastąpić)
 * - alstom: pasujące pozycje Tabel 2 i 3 (Alstom)
 */
export function findAlternates(data, query) {
    const q = normalizeMaterial(query);
    if (!q) return null;

    const exact = data.table1.filter(
        (row) => !isExcluded(row, q) && rowCodes(row).some((code) => matchesCode(code, q)),
    );

    const similar =
        q.length < 2
            ? []
            : data.table1
                  .filter((row) => !exact.includes(row) && !isExcluded(row, q))
                  .map((row) => ({ row, rank: similarityRank(row, q) }))
                  .filter(({ rank }) => rank !== Infinity)
                  .sort((a, b) => a.rank - b.rank)
                  .slice(0, MAX_SUGGESTIONS)
                  .map(({ row }) => row);

    // Tylko dla pełnego oznaczenia, którego nie ma w kolumnie "Specified Material"
    const usedAsAlternate =
        exact.length > 0 || similar.length > 0 || q.length < 3
            ? []
            : data.table1.filter((row) =>
                  rowAlternates(row).some((alt) => normalizeMaterial(alt).includes(q)),
              );

    const alstom =
        q.length < 3
            ? []
            : alstomRows(data)
                  .filter(
                      (row) =>
                          normalizeMaterial(row.specified).includes(q) ||
                          normalizeMaterial(row.reference) === q,
                  )
                  .slice(0, MAX_ALSTOM);

    return { exact, similar, usedAsAlternate, alstom };
}

/**
 * Dzieli wpis zamiennika na materiał i warunki z końcowego nawiasu:
 * "GBX gr. 1 (YS > 99 ksi)" -> { material: "GBX gr. 1", conditions: "YS > 99 ksi" }.
 */
export function splitAlternate(text) {
    const t = text.trim();
    const whole = { material: t, conditions: "" };
    if (!t.endsWith(")")) return whole;

    let depth = 0;
    for (let i = t.length - 1; i >= 0; i--) {
        if (t[i] === ")") depth++;
        else if (t[i] === "(" && --depth === 0) {
            const material = t.slice(0, i).trim();
            return material ? { material, conditions: t.slice(i + 1, -1).trim() } : whole;
        }
    }
    return whole;
}

/** Numery notatek ♠ przywołanych w tekście ("CEV Note 91♠" -> ["91"]). */
export function noteRefs(...texts) {
    const refs = new Set();
    for (const text of texts) {
        for (const match of String(text ?? "").matchAll(NOTE_REF)) refs.add(match[1]);
    }
    return [...refs].sort((a, b) => Number(a) - Number(b));
}

/** Wszystkie notatki ♠ przywołane w wierszu (nazwa, zamienniki, uwagi kolumn). */
export function rowNoteRefs(row) {
    return noteRefs(row.name, ...rowAlternates(row), ...Object.values(row.remarks ?? {}));
}

/**
 * Polskie tłumaczenie tekstu z karty ze słownika w pliku danych
 * (group: "forms" | "names" | "conditions"); null, gdy brak tłumaczenia.
 */
export function translate(data, group, text) {
    if (!text) return null;
    return data.pl?.[group]?.[text] ?? null;
}

/** Postać wyrobu po polsku z oryginałem w nawiasie: "Blacha gruba (Plate)". */
export function formLabel(data, form) {
    if (!form) return "";
    const pl = translate(data, "forms", form);
    return pl ? `${pl} (${form})` : form;
}

/** Tekst do wklejenia we wniosek o zamiennik. */
export function requestText(data, row, columnKey, alternate) {
    const { material, conditions } = splitAlternate(alternate);
    const remark = row.remarks?.[columnKey];
    const description = [
        formLabel(data, row.form),
        translate(data, "names", row.name) ?? row.name,
    ]
        .filter(Boolean)
        .join(", ");
    const original = [conditions, remark].filter(Boolean).join("; ");
    const requirements = [conditions, remark]
        .filter(Boolean)
        .map((text) => translate(data, "conditions", text) ?? text)
        .join("; ");
    const notes = noteRefs(row.name, alternate, remark)
        .filter((n) => data.notes?.[n])
        .map((n) => `Note ${n}♠: ${data.notes[n]}`);

    return [
        `Materiał wg rysunku: ${row.spec}${description ? ` – ${description}` : ""}`,
        `Proponowany zamiennik: ${material}`,
        `Wymagania dla zamiennika: ${requirements || "brak dodatkowych wymagań w karcie"}`,
        ...(requirements !== original ? [`(oryginał w karcie: ${original})`] : []),
        ...notes,
        data.requestFooter ?? `Podstawa: ${data.document} rev. ${data.revision}.`,
    ].join("\n");
}
