# pivot-jet

A **blazingly fast** pivot chart web application to enable fast and beautiful slicing, dicing, and aggregating of large CSV tables. Keyboard-first pivot + chart explorer for large CSVs (≈1M×30). Browser-only, no server. Uses **Arrow + WASM** end-to-end (DuckDB-WASM + Perspective).

## Quick start
```bash
pnpm i   # or npm i / yarn
pnpm dev # http://localhost:5173
```

Load a CSV in the header. Use hotkeys: R/C/A/F, `[`/`]`, `L`, `Shift+S`.

See PRD.txt for acceptance criteria and implementation details.
