
import { AppUI } from './lib/ui.js';

// Initialize App
const app = new AppUI();
app.render();

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    // Re-render charts to pick up new colors
    app.update();
});

// Listen for manual theme changes
document.getElementById('themeToggle')?.addEventListener('click', () => {
    // Small delay to ensure the 'dark' class is updated on <html>
    setTimeout(() => app.update(), 10);
});
