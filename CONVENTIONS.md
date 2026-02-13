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
- **Styling**: Tailwind CSS with custom metallic color palettes.
- **Typography**: Use **Plus Jakarta Sans** as the primary display font.
- **Icons**: Standardize on **FontAwesome 6+**.

## 3. Tool Layout
- Tools should be centered in a `max-w-7xl` container.
- Use `rounded-3xl` for major card components.
- Maintain a consistent spacing system (e.g., `mb-10` or `mb-14` for headers).

## 4. Category Color Coding
To ensure visual consistency on the homescreen and throughout the app, use the following metallic color mapping for categories:

| Category | Color Theme | Tailwind Class Example |
| :--- | :--- | :--- |
| **Finance & Lifestyle** | **Gold** | `text-gold-500` |
| **Education & Algorithms** | **Platinum** | `text-platinum-500` |
| **Security & Utilities** | **Copper** | `text-copper-500` |
| *General / Other* | *Silver* | `text-silver-500` |

### Metallic Palette Reference
These colors are defined in the `tailwind.config` within `index.html`.

- **Gold**: Wealth, Value, Finance.
- **Platinum**: Premium, High-Tech, Education.
- **Copper**: Robust, Utility, Security.
- **Silver**: Sleek, General purpose.

## 5. Tool Registration (JSON)
The main dashboard is dynamic and driven by a JSON configuration file. When creating a new tool, it must be registered in the central configuration to appear on the homepage.

**File Path**: `src/data/tools.json`

### Workflow
1.  **Develop**: Create your tool in a dedicated directory under `tools/` (e.g., `tools/my-new-tool/index.html`).
2.  **Register**: Add a new entry to `src/data/tools.json`.
3.  **Categorize**: Ensure the tool is placed under the correct category array.

### JSON Schema
```json
{
  "id": "tool-id-slug",
  "title": "Tool Display Name",
  "description": "Short, punchy description (max 80 chars).",
  "icon": "fa-icon-name",  // FontAwesome class (e.g., "fa-calculator")
  "url": "tools/tool-dir/index.html",
  "badge": "New",           // Optional
  "badgeType": "new",       // Optional: 'new', 'popular', 'updated'
  "color": "gold"           // Must match the Category Color Theme (gold, platinum, copper, silver)
}
```
