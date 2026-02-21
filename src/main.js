import { Section } from './components/Section.js';
import { ThemeManager } from './lib/theme.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Theme for the Home Page
    new ThemeManager('themeToggle');

    const appContainer = document.getElementById('app-container');
    const searchInput = document.getElementById('toolSearchInput');
    const searchClear = document.getElementById('toolSearchClear');
    if (!appContainer) return;

    let allCategories = [];

    const normalizeQuery = (query) => (query || '').trim().toLowerCase();
    const escapeHtml = (value) => String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

    const getNoResultsHTML = (query) => `
        <section class="animate-fade-in-up">
            <div class="mx-auto max-w-xl rounded-3xl border border-slate-200/80 dark:border-slate-700/70 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm p-8 text-center shadow-sm">
                <div class="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <i class="fa-solid fa-magnifying-glass text-slate-500 dark:text-slate-400"></i>
                </div>
                <h2 class="text-xl font-bold text-slate-800 dark:text-white">No tools found</h2>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    No results for "<span class="font-semibold">${escapeHtml(query)}</span>". Try a different keyword.
                </p>
            </div>
        </section>
    `;

    const renderCategories = (query = '') => {
        const normalizedQuery = normalizeQuery(query);
        let delay = 100;
        let hasAnySection = false;
        let html = '';

        allCategories.forEach((category) => {
            const section = new Section({
                title: category.title,
                tools: category.tools,
                delay,
                query: normalizedQuery
            });
            const sectionHTML = section.render();
            if (sectionHTML) {
                html += sectionHTML;
                hasAnySection = true;
                delay += 100;
            }
        });

        appContainer.innerHTML = hasAnySection ? html : getNoResultsHTML(query.trim());

        if (searchClear) {
            searchClear.classList.toggle('hidden', normalizeQuery(query).length === 0);
        }
    };

    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            renderCategories(event.target.value);
        });
    }

    if (searchClear && searchInput) {
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.focus();
            renderCategories('');
        });
    }

    // Load Tools
    try {
        const response = await fetch('src/data/tools.json');
        allCategories = await response.json();
        renderCategories('');

    } catch (error) {
        console.error('Failed to load tools:', error);
        appContainer.innerHTML = `
            <section class="animate-fade-in-up">
                <div class="mx-auto max-w-xl rounded-3xl border border-rose-200 dark:border-rose-900/40 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm p-8 text-center shadow-sm">
                    <h2 class="text-xl font-bold text-rose-700 dark:text-rose-300">Unable to load tools</h2>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">Please refresh the page and try again.</p>
                </div>
            </section>
        `;
    }
});
