import { ThemeManager } from '../../src/lib/theme.js';
import { App } from './lib/app.js';
import { AppUI } from './lib/ui.js';

// Execute immediately instead of waiting for DOMContentLoaded
// This allows the app to render as soon as the modules load
// instead of waiting for all external resources (fonts, icons, etc.)
AppUI.render();
new ThemeManager('themeToggle');
window.app = new App();
