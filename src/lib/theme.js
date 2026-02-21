export class ThemeManager {
    constructor(toggleButtonId) {
        this.html = document.documentElement;
        this.toggleBtn = document.getElementById(toggleButtonId);
        this.themeSwitchTimer = null;
        this.init();
    }

    init() {
        this.applyTheme();

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            // Only auto-switch if user hasn't set a manual preference
            if (!localStorage.theme) {
                this.applyTheme();
            }
        });

        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggle());
        }
    }

    applyTheme() {
        const isDark = localStorage.theme === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

        this.setThemeClass(isDark, false);
    }

    toggle() {
        const willBeDark = !this.html.classList.contains('dark');
        this.html.classList.add('theme-switching');
        if (this.themeSwitchTimer) {
            clearTimeout(this.themeSwitchTimer);
        }

        if (willBeDark) {
            this.setThemeClass(true, true);
            localStorage.theme = 'dark';
        } else {
            this.setThemeClass(false, true);
            localStorage.theme = 'light';
        }

        this.themeSwitchTimer = window.setTimeout(() => {
            this.html.classList.remove('theme-switching');
        }, 140);
    }

    setThemeClass(isDark, emitEvent = false) {
        if (isDark) {
            this.html.classList.add('dark');
        } else {
            this.html.classList.remove('dark');
        }

        if (emitEvent) {
            window.dispatchEvent(new CustomEvent('powertools:theme-changed', {
                detail: { theme: isDark ? 'dark' : 'light' }
            }));
        }
    }
}
