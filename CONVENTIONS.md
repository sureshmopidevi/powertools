# Project Conventions & Design Patterns

This document outlines the architectural and design patterns for the Powertools project to ensure consistency across all tools.

## 1. Universal Home Navigation
Every tool MUST include a "Home" button in its header/top section to allow users to return to the main dashboard.

### Implementation Pattern:
The button should use a consistent style, specifically:
- **Icon**: FontAwesome `fa-arrow-left`
- **Text**: "Home"
- **Destination**: `../../index.html` (or the appropriate relative path to the root)

**Example (HTML):**
```html
<a href="../../index.html" class="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-300 dark:hover:border-violet-600 transition-all text-xs font-semibold no-underline w-fit">
    <i class="fa-solid fa-arrow-left"></i>Home
</a>
```

## 2. Tech Stack & Styling
- **Logic**: Use Vanilla JS (ES6 modules) where possible to avoid build-step overhead and maintain performance.
- **Styling**: Tailwind CSS with the **Slate** color palette (`slate-900` for dark backgrounds, `slate-50` for light).
- **Typography**: Use **Plus Jakarta Sans** as the primary display font.
- **Icons**: Standardize on **FontAwesome 6+**.

## 3. Tool Layout
- Tools should be centered in a `max-w-7xl` container.
- Use `rounded-3xl` for major card components.
- Maintain a consistent spacing system (e.g., `mb-10` or `mb-14` for headers).
