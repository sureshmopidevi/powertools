export class ThemeManager {
    constructor(toggleButtonId) {
        this.html = document.documentElement;
        this.toggleBtn = document.getElementById(toggleButtonId);
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

        if (isDark) {
            this.html.classList.add('dark');
        } else {
            this.html.classList.remove('dark');
        }
    }

    toggle() {
        const willBeDark = !this.html.classList.contains('dark');
        if (willBeDark) {
            this.html.classList.add('dark');
            localStorage.theme = 'dark';
        } else {
            this.html.classList.remove('dark');
            localStorage.theme = 'light';
        }
    }
}
