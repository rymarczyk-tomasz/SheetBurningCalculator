/**
 * Interpolacja liniowa po punktach { x, y }. Poza zakresem zwraca wartość skrajną.
 * Zwraca null dla pustej listy punktów.
 */
export function interpolate(points, x) {
    if (!points.length || !Number.isFinite(x)) return null;

    const sorted = [...points].sort((a, b) => a.x - b.x);
    const exact = sorted.find((p) => p.x === x);
    if (exact) return exact.y;

    let lower = null;
    let upper = null;
    for (const p of sorted) {
        if (p.x < x) lower = p;
        if (p.x > x && !upper) upper = p;
    }

    if (lower && upper) {
        return (
            lower.y + ((upper.y - lower.y) * (x - lower.x)) / (upper.x - lower.x)
        );
    }
    return (lower ?? upper).y;
}
