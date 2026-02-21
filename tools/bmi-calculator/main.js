import { ThemeManager } from '../../src/lib/theme.js';
import { AppUI } from './lib/ui.js';

const app = new AppUI();
app.render();

new ThemeManager('themeToggle');
