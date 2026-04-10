# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
npm run dev      # Vite dev server with HMR
npm run build    # Production build
npm run preview  # Preview production build
```

No test framework is configured. No linter is configured.

## Stack

- React 19 + Vite 7 + Tailwind CSS 4 (with `@tailwindcss/vite` plugin)
- lucide-react for icons
- Supabase (`VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY` env vars required) — tables: `members`, `assets`, `history`
- Korean language UI (장비 관리 시스템 = Equipment Management System)

## Architecture

**State management**: A single custom hook `useAssetManager` (`src/hooks/useAssetManager.js`) owns all application state (members, assets, history) via `useState`. Computed stats use `useMemo`. No Redux, no Context API — data flows via props drilling from `App.jsx`.

**Persistence**: On mount, `useAssetManager` loads all data from Supabase. If a table is empty, it seeds it from the `INITIAL_*` arrays in `src/data/`. All mutations update local state optimistically and fire-and-forget write to Supabase (errors are logged but not surfaced to the UI). A `loading` boolean is returned and used by `App.jsx` to show a loading screen.

**Routing**: No router library. `App.jsx` manages a `page` state string (`"dashboard"`, `"assets"`, `"members"`, `"stock"`, `"history"`) and renders the matching page component. Navigation resets filters/search/detail panel.

**CRUD pattern**: Modal-based forms for create/edit. Detail panels slide in from the right. All mutations go through handler functions in `useAssetManager`.

**Data layer**: Initial data loaded from `src/data/` files (assets.js, members.js, history.js). IDs are random 9-char strings via `uid()` in `src/utils.js`. Dates are ISO strings (YYYY-MM-DD).

Asset shape: `{ id, category, manufacturer, model, serial, spec, purchaseDate, status, assignedTo, note, isShared?, sharedLabel? }`. Shared assets have `isShared: true` and a `sharedLabel` string; `assignedTo` is `null` for shared/stock assets. Member shape: `{ id, name, team, position, email, photo? }`. History entry shape: `{ id, assetId, action ("assign"|"return"), memberId, date, note }`.

**Detail panel disambiguation**: `App.jsx` uses `!!detailItem.category` to distinguish asset vs member detail panels — assets always have `category`, members never do.

**`modalOpen` type**: either a string (`"asset"` | `"member"`) or an object `{ type: "assign", assetId }` for the assign modal.

## Key Conventions

**Tailwind v4 theming**: Custom theme variables defined in `src/index.css` via `@theme` block (`--color-primary`, `--color-dark`, `--color-success`, etc.). Use these theme tokens (e.g., `text-primary`, `bg-dark`) rather than hardcoded hex values in Tailwind classes.

**Component organization**: Feature-based folders under `src/components/` — each domain (dashboard, assets, members, stock, history) has its own folder. Shared primitives live in `src/components/ui/`. Layout shell components in `src/components/layout/`.

**Enums and constants**: Status values (`"in-use"`, `"stock"`, `"repair"`, `"dispose"`), team names, and category names are defined in `src/data/constants.js`. Always import from there rather than hardcoding.

**Dashboard charts**: SVG-based interactive charts (donut charts, progress bars) built with pure React — no charting library. Charts use inline SVG with hover state management.
