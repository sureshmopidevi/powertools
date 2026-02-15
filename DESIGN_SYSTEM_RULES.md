# Powertools Design System Rules

This document extends `/Users/lt-sureshmopidevi/Documents/hobby/powertools/CONVENTIONS.md` into a reusable UI + business-logic architecture standard for all future tools.

## 1. Product Principles
- Build for decision speed: each screen should help users decide in under 30 seconds.
- Show outcomes first, inputs second: put key metrics and recommendations above data-entry zones.
- Minimize cognitive load: no more than 3 primary actions per screen.
- Preserve trust: show assumptions, formulas, and data freshness for every computed output.

## 2. Layout System
- Use `max-w-7xl mx-auto` for all tool canvases.
- Use 3 vertical zones:
1. Context header (title, purpose, Home button)
2. Decision surface (KPIs/charts/results)
3. Action surface (forms/tables/export/history)
- Major cards: `rounded-3xl` outer shells, `rounded-2xl` internal containers.
- Spacing scale:
1. Section gap: `32px` (`gap-8` / `space-y-8`)
2. Card padding: `24px` (`p-6`) default, `32px` (`p-8`) for analytics cards
3. Control gap: `12px` (`gap-3`) to `16px` (`gap-4`)

## 3. Typography
- Display/headings: Plus Jakarta Sans.
- Body/data text: Inter.
- Numeric values (money/percentages): use tabular numerals and stronger weight.
- Required hierarchy:
1. H1: Tool identity + user outcome
2. H2: View context
3. Label: uppercase micro-label for metric semantics

## 4. Color and Semantics
- Keep category color mapping from `CONVENTIONS.md`:
1. Finance = Gold
2. Education = Platinum
3. Security = Copper
4. General = Silver
- Functional colors:
1. Positive states: emerald/green
2. Negative states: rose/red
3. Neutral info: slate
- Never use color alone to communicate meaning; pair with icon/text.

## 5. Core Component Rules
- Home button is mandatory in every tool header (`fa-arrow-left`, `../../index.html`).
- Buttons:
1. Primary = single dominant action
2. Secondary = context action
3. Ghost = row-level actions (edit/delete/view)
- Forms:
1. Inputs/selects must share identical height (44px baseline)
2. Labels always above controls
3. Two-column grids collapse to one column on mobile
- Tables:
1. Wrap with `overflow-x-auto`
2. Keep action column right-aligned
3. Provide empty-state rows with explicit next action
- Modals:
1. Dimmed backdrop
2. Single intent per modal
3. Destructive actions require confirmation

## 6. Business Logic UX Rules
- Every financial tool must expose:
1. Inputs used for calculation
2. Core formula or method
3. Result timestamp or snapshot date
- Add trend context where possible:
1. `Current value`
2. `Change vs previous`
3. `Direction` with icon + text
- Recurring cashflow-aware tools should normalize frequencies to monthly for comparability.
- Show both absolute value and business interpretation:
1. Example: `₹42,000` and `Monthly Outflow`
- If data is user-entered and persistent, support edit, delete, and history by default.

## 7. Data and Validation Rules
- Persist user data locally (IndexedDB) unless explicitly productized for cloud.
- Schema evolution must be versioned (increment DB version on store changes).
- Required validation:
1. Numeric fields: min, precision, and non-NaN fallback
2. Enumerations: controlled selects, no free-form category drift
3. Dates: ISO storage format
- Safe defaults:
1. Pre-seed minimal demo records only when database is empty
2. Never overwrite existing user data silently

## 8. Accessibility and Responsiveness
- Minimum touch target: 40px, preferred 44px.
- Color contrast should remain legible in both light and dark themes.
- Keyboard flow:
1. Tab order follows visual flow
2. Enter submits modal forms
3. Escape should close overlays (recommended for future updates)
- Mobile-first:
1. Sidebar converts to toggle panel
2. Multi-column sections collapse cleanly

## 9. Performance and Reliability
- Use vanilla JS modules and avoid build-step dependencies.
- Avoid runtime-only CSS features that can fail silently in production.
- Keep chart re-renders idempotent (destroy previous instances before redraw).
- Ensure app remains usable when optional dependencies fail (graceful fallbacks).

## 10. Tool Delivery Checklist
1. Home button implemented and functional.
2. Tool registered in `/Users/lt-sureshmopidevi/Documents/hobby/powertools/src/data/tools.json`.
3. Category color and icon semantics are correct.
4. Desktop/mobile layouts verified.
5. Empty, loading, and error states are present.
6. CRUD flows support edit/delete confirmations where applicable.
7. Financial outputs show currency format and trend context.
