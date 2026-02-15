
import { ThemeManager } from '../../src/lib/theme.js';
import { AppUI } from './lib/ui.js';

// Initialize App
const app = new AppUI();
app.render();

// Initialize Theme after DOM is rendered by AppUI
new ThemeManager('themeToggle');
