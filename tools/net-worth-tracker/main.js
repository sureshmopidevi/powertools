
import { ThemeManager } from '../../src/lib/theme.js';
import { AppUI } from './lib/ui.js';

// Initialize Theme
new ThemeManager('themeToggle');

// Initialize App
const app = new AppUI();
app.render();
