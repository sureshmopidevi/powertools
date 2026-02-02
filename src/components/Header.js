export const Header = () => `
    <header class="mb-10 animate-enter flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left relative">
        <div>
            <div class="flex items-center gap-2 mb-2 justify-center md:justify-start">
                <div class="h-6 w-1 bg-indigo-600 dark:bg-indigo-500 rounded-full"></div>
                <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Decision Matrix</span>
            </div>
            <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                Smart Car <span class="gradient-text">Decision Maker</span>
            </h1>
            <p class="text-slate-500 dark:text-slate-400 max-w-xl text-sm md:text-base font-medium leading-relaxed">
                Analyze the math behind your car purchase. See how different financing strategies impact your wealth over 7 years.
            </p>
        </div>

        <button id="themeToggle" class="mt-6 md:mt-2 w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-all active:scale-95">
            <i class="fas fa-moon dark:hidden"></i>
            <i class="fas fa-sun hidden dark:block"></i>
        </button>
    </header>
`;
