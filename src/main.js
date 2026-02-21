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
    let hasAnimatedInitialRender = false;
    let searchDebounceTimer = null;
    let sectionIndex = [];
    let noResultsStateEl = null;
    let latestQuery = '';
    let activeCacheStoredAt = null;

    const TOOLS_CACHE_KEY = 'powertools.tools.cache.v1';
    const UI_STATE_KEY = 'powertools.home.ui.v1';
    const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
    const NETWORK_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

    const normalizeQuery = (query) => (query || '').trim().toLowerCase();
    const escapeHtml = (value) => String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

    const setSearchClearVisibility = (query) => {
        if (searchClear) {
            searchClear.classList.toggle('hidden', normalizeQuery(query).length === 0);
        }
    };

    const buildToolsSignature = (categories) => {
        if (!Array.isArray(categories)) return '';
        return categories.map((category) => {
            const title = category?.title || '';
            const tools = Array.isArray(category?.tools) ? category.tools : [];
            const toolSig = tools
                .map((tool) => `${tool?.id || ''}|${tool?.lastUpdatedOn || ''}|${tool?.commitCount || 0}`)
                .join(',');
            return `${title}:${toolSig}`;
        }).join('||');
    };

    const getCachedSnapshot = () => {
        try {
            const raw = sessionStorage.getItem(TOOLS_CACHE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed || !Array.isArray(parsed.data) || typeof parsed.storedAt !== 'number') return null;
            if ((Date.now() - parsed.storedAt) > CACHE_TTL_MS) return null;
            return parsed;
        } catch {
            return null;
        }
    };

    const setCachedSnapshot = ({ data, html = '', storedAt = Date.now() }) => {
        if (!Array.isArray(data)) return;
        const signature = buildToolsSignature(data);
        try {
            sessionStorage.setItem(TOOLS_CACHE_KEY, JSON.stringify({
                storedAt,
                data,
                html,
                signature
            }));
        } catch {
            // Ignore storage errors.
        }
    };

    const shouldBackgroundRefresh = (snapshot) => {
        if (!snapshot || typeof snapshot.storedAt !== 'number') return true;
        return (Date.now() - snapshot.storedAt) > NETWORK_REFRESH_INTERVAL_MS;
    };

    const readUIState = () => {
        try {
            const raw = sessionStorage.getItem(UI_STATE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== 'object') return null;
            return parsed;
        } catch {
            return null;
        }
    };

    const writeUIState = () => {
        try {
            const rowOffsets = Array.from(document.querySelectorAll('.horizontal-row'))
                .map((row) => row.scrollLeft);
            sessionStorage.setItem(UI_STATE_KEY, JSON.stringify({
                query: latestQuery,
                windowScrollY: window.scrollY,
                rowOffsets
            }));
        } catch {
            // Ignore storage errors.
        }
    };

    const restoreUIState = (state) => {
        if (!state || typeof state !== 'object') return;

        const query = typeof state.query === 'string' ? state.query : '';
        latestQuery = query;
        if (searchInput) searchInput.value = query;
        renderCategories(query);

        requestAnimationFrame(() => {
            if (Array.isArray(state.rowOffsets)) {
                const rows = Array.from(document.querySelectorAll('.horizontal-row'));
                rows.forEach((row, idx) => {
                    const offset = state.rowOffsets[idx];
                    if (typeof offset === 'number' && Number.isFinite(offset)) {
                        row.scrollLeft = Math.max(0, offset);
                    }
                });
            }
            if (typeof state.windowScrollY === 'number' && Number.isFinite(state.windowScrollY)) {
                window.scrollTo({ top: Math.max(0, state.windowScrollY), behavior: 'auto' });
            }
        });
    };

    const ensureNoResultsState = () => {
        if (noResultsStateEl) return;
        noResultsStateEl = document.createElement('section');
        noResultsStateEl.id = 'noResultsState';
        noResultsStateEl.className = 'hidden animate-fade-in-up';
        noResultsStateEl.innerHTML = `
            <div class="mx-auto max-w-xl rounded-3xl border border-slate-200/80 dark:border-slate-700/70 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm p-8 text-center shadow-sm">
                <div class="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <i class="fa-solid fa-magnifying-glass text-slate-500 dark:text-slate-400"></i>
                </div>
                <h2 class="text-xl font-bold text-slate-800 dark:text-white">No tools found</h2>
                <p id="noResultsMessage" class="text-sm text-slate-500 dark:text-slate-400 mt-2"></p>
            </div>
        `;
        appContainer.appendChild(noResultsStateEl);
    };

    const setNoResultsState = (query, hasResults) => {
        ensureNoResultsState();
        if (!noResultsStateEl) return;

        const messageEl = noResultsStateEl.querySelector('#noResultsMessage');
        if (messageEl) {
            if (query.trim()) {
                messageEl.innerHTML = `No results for "<span class="font-semibold">${escapeHtml(query.trim())}</span>". Try a different keyword.`;
            } else {
                messageEl.textContent = 'No tools are available right now.';
            }
        }

        noResultsStateEl.classList.toggle('hidden', hasResults);
    };

    const buildSectionIndex = () => {
        sectionIndex = Array.from(appContainer.querySelectorAll('[data-tools-section="1"]')).map((sectionEl) => {
            const cards = Array.from(sectionEl.querySelectorAll('[data-tool-card="1"]'));
            return { sectionEl, cards };
        });
    };

    const renderCategories = (query = '', { forceRerender = false } = {}) => {
        const normalizedQuery = normalizeQuery(query);
        latestQuery = query;
        const shouldAnimate = !hasAnimatedInitialRender && normalizedQuery.length === 0;

        if (!forceRerender && sectionIndex.length > 0) {
            let hasAnySection = false;
            sectionIndex.forEach(({ sectionEl, cards }) => {
                let visibleCards = 0;
                cards.forEach((cardEl) => {
                    const haystack = cardEl.dataset.search || '';
                    const isMatch = normalizedQuery.length === 0 || haystack.includes(normalizedQuery);
                    cardEl.classList.toggle('hidden', !isMatch);
                    if (isMatch) visibleCards += 1;
                });
                const showSection = visibleCards > 0;
                sectionEl.classList.toggle('hidden', !showSection);
                if (showSection) hasAnySection = true;
            });

            setNoResultsState(query, hasAnySection);
            setSearchClearVisibility(query);
            return;
        }

        let delay = 100;
        let html = '';

        allCategories.forEach((category) => {
            const section = new Section({
                title: category.title,
                tools: category.tools,
                delay,
                query: '',
                animate: shouldAnimate
            });
            const sectionHTML = section.render();
            if (sectionHTML) {
                html += sectionHTML;
                delay += 100;
            }
        });

        appContainer.innerHTML = html;
        if (allCategories.length > 0 && normalizedQuery.length === 0) {
            setCachedSnapshot({
                data: allCategories,
                html,
                storedAt: activeCacheStoredAt || Date.now()
            });
        }
        buildSectionIndex();
        renderCategories(query, { forceRerender: false });

        if (shouldAnimate) hasAnimatedInitialRender = true;
    };

    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const nextQuery = event.target.value;
            if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
            searchDebounceTimer = setTimeout(() => {
                renderCategories(nextQuery);
            }, 90);
        });
    }

    if (searchClear && searchInput) {
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.focus();
            renderCategories('');
        });
    }

    document.addEventListener('click', (event) => {
        const anchor = event.target?.closest?.('a[data-tool-card="1"]');
        if (anchor) {
            writeUIState();
        }
    });

    window.addEventListener('pagehide', () => {
        writeUIState();
    });

    // Load Tools
    try {
        const cachedSnapshot = getCachedSnapshot();
        const cachedTools = cachedSnapshot?.data || null;
        const cachedHtml = typeof cachedSnapshot?.html === 'string' ? cachedSnapshot.html : '';
        const savedUIState = readUIState();
        let renderedFromCache = false;

        if (cachedTools) {
            allCategories = cachedTools;
            activeCacheStoredAt = cachedSnapshot?.storedAt || Date.now();

            if (cachedHtml) {
                appContainer.innerHTML = cachedHtml;
                buildSectionIndex();
                hasAnimatedInitialRender = true;
                renderCategories('');
            } else {
                renderCategories('', { forceRerender: true });
            }

            restoreUIState(savedUIState);
            renderedFromCache = true;
        } else {
            appContainer.innerHTML = `
                <section class="animate-fade-in-up">
                    <div class="mx-auto max-w-xl rounded-3xl border border-slate-200/80 dark:border-slate-700/70 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm p-8 text-center shadow-sm">
                        <p class="text-sm font-semibold text-slate-600 dark:text-slate-300">
                            <i class="fa-solid fa-spinner fa-spin mr-2"></i>Loading tools...
                        </p>
                    </div>
                </section>
            `;
        }

        if (cachedSnapshot && !shouldBackgroundRefresh(cachedSnapshot)) {
            return;
        }

        const response = await fetch('src/data/tools.json');
        const freshTools = await response.json();
        const freshSignature = buildToolsSignature(freshTools);
        const cachedSignature = cachedSnapshot?.signature || '';
        const didToolsChange = freshSignature !== cachedSignature;

        allCategories = freshTools;
        activeCacheStoredAt = Date.now();

        if (!renderedFromCache) {
            renderCategories('', { forceRerender: true });
            restoreUIState(savedUIState);
            return;
        }

        if (!didToolsChange) {
            setCachedSnapshot({
                data: freshTools,
                html: cachedHtml || '',
                storedAt: activeCacheStoredAt
            });
            return;
        }

        const scheduleIdle = window.requestIdleCallback
            ? (cb) => window.requestIdleCallback(cb, { timeout: 900 })
            : (cb) => setTimeout(cb, 220);

        scheduleIdle(() => {
            if (normalizeQuery(latestQuery).length > 0) {
                setCachedSnapshot({
                    data: freshTools,
                    html: '',
                    storedAt: activeCacheStoredAt
                });
                return;
            }

            renderCategories('', { forceRerender: true });
        });

    } catch (error) {
        console.error('Failed to load tools:', error);
        if (sectionIndex.length > 0) return;
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
