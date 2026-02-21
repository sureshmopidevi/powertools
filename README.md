# Powertools

Powertools is a lightweight dashboard of decision tools (finance, lifestyle, algorithms, utilities) built with vanilla JavaScript and Tailwind-inspired styles. It favors fast interactions, responsive layouts, and purposeful micro-animations so every tool feels premium without a heavy framework.

## What’s New
- **Home list performance:** Caching, skeleton loaders, and restored scroll/search state keep the dashboard instant when you return from a tool.
- **Smooth animations:** Theme toggles now briefly suppress transitions, adding deliberate “settle” motion and preventing flicker while dark/light styles repaint.
- **Live filtering:** The search bar filters cards by title/description without rerendering the grid, and empty categories disappear for a cleaner experience.
- **BMI calculator:** Added the new BMI tool plus PRD, dual-unit logic, and educational guidance content.

## Quick Links
- **GitHub Pages:** https://sureshmopidevi.github.io/powertools/


## Running
Open `index.html` in a browser to explore the tools hub. Each tool lives under `tools/*` with its own `index.html` entry point and shared `src/` helpers.

## Contribution
Follow the existing Vanilla JS + utility CSS patterns, keep scripts in `tools/` subfolders, and register new tools in `src/data/tools.json` so the dashboard picks them up automatically.
