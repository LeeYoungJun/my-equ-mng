# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

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

Asset shape: `{ id, category, manufacturer, model, serial, spec, purchaseDate, status, assignedTo, note, isShared?, sharedLabel?, warrantyExpiry?, dueDate?, repairVendor?, repairStartDate?, repairExpectedDate? }`. Shared assets have `isShared: true` and a `sharedLabel` string; `assignedTo` is `null` for shared/stock assets. Member shape: `{ id, name, team, position, email, photo? }`. History entry shape: `{ id, assetId, action ("assign"|"return"|"status-change"), memberId, date, note }`.

**Detail panel disambiguation**: `App.jsx` uses `!!detailItem.category` to distinguish asset vs member detail panels — assets always have `category`, members never do.

**`modalOpen` type**: either a string (`"asset"` | `"member"`) or an object `{ type: "assign", assetId }` for the assign modal.

## Key Conventions

**Tailwind v4 theming**: Custom theme variables defined in `src/index.css` via `@theme` block (`--color-primary`, `--color-dark`, `--color-success`, etc.). Use these theme tokens (e.g., `text-primary`, `bg-dark`) rather than hardcoded hex values in Tailwind classes.

**Component organization**: Feature-based folders under `src/components/` — each domain (dashboard, assets, members, stock, history) has its own folder. Shared primitives live in `src/components/ui/`. Layout shell components in `src/components/layout/`.

**Enums and constants**: Status values (`"in-use"`, `"stock"`, `"repair"`, `"dispose"`), team names, and category names are defined in `src/data/constants.js`. Always import from there rather than hardcoding.

**Dashboard charts**: SVG-based interactive charts (donut charts, progress bars) built with pure React — no charting library. Charts use inline SVG with hover state management.

**Imperative UI utilities**: `src/lib/toast.js` and `src/lib/confirm.js` expose singleton helpers (`toast.success()`, `dialog.confirm()`) that are registered by `<Toast>` and `<ConfirmDialog>` components in `App.jsx` via `_register`. Call these directly anywhere — do not pass callbacks through props for notifications or confirmations.

**Design language**: Apple-inspired aesthetic. SF Pro font stack, `--color-primary: #0071e3` (Apple blue), minimal borders, subtle shadows. Maintain this visual style when adding new UI.
