# SheetBurningCalculator

Kalkulator normatywu czasu pracy (palenie, cięcie, obróbka cieplna, fazowanie, spawanie itd.).
Aplikacja React 18 + Vite, publikowana na GitHub Pages.

## Uruchomienie

```bash
npm install
npm run dev        # serwer deweloperski
npm run build      # build produkcyjny do dist/
```

## Jakość kodu

```bash
npm run lint       # ESLint
npm test           # testy jednostkowe (Vitest)
npm run test:watch # testy w trybie watch
```

CI (`.github/workflows/ci.yml`) uruchamia lint, testy i build dla każdego pusha poza `main`
oraz dla pull requestów. Push na `main` dodatkowo publikuje aplikację (`deploy.yml`).

## Struktura

- `src/processes.js` — lista procesów i ich stron.
- `src/components/` — komponenty UI; `ProcessPages/` — strony poszczególnych procesów.
- `src/hooks/` — wspólna logika stanu (`useCalculation`, `useShapeDimensions`, `useHoles`, ...).
- `src/utils/` — czyste funkcje obliczeniowe (pokryte testami `*.test.js`).
- `src/data/` — tabele normatywów zapisane w kodzie.
- `public/*.csv` — tabele normatywów ładowane w przeglądarce.

Funkcje obliczeniowe zgłaszają błędy danych wejściowych przez `UserError` — komunikat
trafia wprost do użytkownika. Udane wyniki zapisywane są w historii (localStorage).
