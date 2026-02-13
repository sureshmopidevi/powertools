import { Section } from './components/Section.js';
import { ThemeManager } from './lib/theme.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Theme for the Home Page
    new ThemeManager('themeToggle');

    // Load Tools
    try {
        const response = await fetch('src/data/tools.json');
        const categories = await response.json();

        const appContainer = document.getElementById('app-container');
        if (!appContainer) return;

        // Render Sections from hierarchical JSON
        let delay = 100;
        categories.forEach(category => {
            const section = new Section(category.title, category.tools, delay);
            appContainer.innerHTML += section.render();
            delay += 100; // Stagger animation
        });

    } catch (error) {
        console.error('Failed to load tools:', error);
    }
});
