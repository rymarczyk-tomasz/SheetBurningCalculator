# Production Time Standards Calculator

A web app that estimates standard labour times for steel fabrication processes: plasma and oxy-fuel cutting, sawing, heat treatment, bevelling, welding and more.
It is used day to day by process engineers and sales estimators at a manufacturing company.

**Live demo:** [rymarczyk-tomasz.github.io/SheetBurningCalculator](https://rymarczyk-tomasz.github.io/SheetBurningCalculator/)

![Calculator showing a burning-time result and the result history](docs/screenshot.png)

> The user interface is in Polish, because that is the language of the people who use it.

## Why it exists

Process engineers plan how a part is made, and estimators price it for a customer quote. Both need to know how long each operation takes. The standard times come from tables: cutting speed per sheet thickness, heat-treatment time per part mass and thickness, welding time per weld size and position.
Looking these values up by hand is slow and easy to get wrong, especially when the geometry has to be calculated first (perimeter, part mass, holes).

This app turns those tables into calculators. You enter the part dimensions and get the time, ready to paste into a quote or a production order.

## Features

- **15 processes** in one place:
  - plasma / oxy-fuel cutting
  - band-saw cutting of bars and pipes
  - waterjet cutting (temporarily disabled)
  - heat treatment: hardening, nitriding, annealing in two furnaces, quench & temper, carburizing
  - chamfering (cut and milled), grinding after cutting, deburring, straightening
  - manual MAG-135 welding
  - ASME B36.10 / B36.19 pipe dimension lookup
- **Shape-aware geometry:** rectangles, rings, half-rings and free perimeter, plus optional circular and rectangular holes.
- **Part mass calculator** for processes whose time depends on mass.
- **Built for the shop floor:**
  - decimal comma accepted in every field
  - Enter calculates, Esc clears
  - one-click copy of just the value (`0,15`), in the format used in Polish spreadsheets
  - result history that survives a page reload
- **Clear feedback:** invalid input produces a specific message instead of a wrong number.

## Tech stack

| Area | Tools |
| --- | --- |
| UI | React 18 (function components, hooks, context) |
| Build | Vite 6 |
| Data | CSV tables parsed in the browser with PapaParse |
| Quality | Vitest unit tests, ESLint 9, PropTypes |
| CI/CD | GitHub Actions: lint, tests and build on every push and pull request; deployment to GitHub Pages from `main` |

## Architecture

```text
src/
├── processes.js        # registry: process id → label → page component
├── components/         # UI; ProcessPages/ holds one page per process
├── hooks/              # useCalculation, useShapeDimensions, useHoles, useCSVTable, ...
├── context/            # result history (React context + localStorage)
├── utils/              # pure calculation logic + unit tests
└── data/               # small lookup tables kept in code
public/*.csv            # standard-time tables, editable without touching code
```

Key decisions:

- **Calculation logic is plain JavaScript, separate from React.**
  Geometry, mass, table lookups and interpolation are pure functions in `src/utils/`, so they can be tested without rendering anything.
- **Expected and unexpected errors are handled differently.**
  Invalid input throws a `UserError`, and its message is shown to the user as-is. Any other error is logged and replaced with a generic message, so bugs never show up as confusing text.
- **Shared hooks replace duplicated page logic.**
  Each process page is a thin form on top of `useCalculation`, which handles running the calculation, pending state, error display and history.
- **The standard-time tables live in CSV files.**
  They can be updated without a code change. Each file is fetched once and cached.

## Quality

- Unit tests cover the geometry, mass, the calculators, table interpolation, the weld and pipe lookups, and input parsing.
- A data test checks every CSV table for malformed rows.
  It was added after a single extra comma was found to shift two pipe wall thicknesses into the wrong columns. The test now catches that kind of error before it reaches users.
- CI blocks a deployment if lint or tests fail.

## Running locally

Requires Node.js 22.

```bash
npm install
npm run dev          # development server
npm test             # unit tests
npm run lint         # ESLint
npm run build        # production build in dist/
```

## Author

Tomasz Rymarczyk: [github.com/rymarczyk-tomasz](https://github.com/rymarczyk-tomasz)
