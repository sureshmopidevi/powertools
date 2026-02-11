import { ThemeManager } from '../../src/lib/theme.js';
import { App } from './lib/app.js';
import { AppUI } from './lib/ui.js';

document.addEventListener('DOMContentLoaded', () => {
    // Render UI Components
    AppUI.render();

    // Initialize Theme
    new ThemeManager('themeToggle');

    // Initialize App
    window.app = new App();
});
