import { calculateBMI, validateInput } from './calculator.js';

export class AppUI {
    constructor() {
        this.state = {
            unitSystem: 'metric',
            heightCm: 170,
            weightKg: 70,
            heightFt: 5,
            heightIn: 7,
            weightLb: 154
        };

        this.app = document.getElementById('app');
    }

    render() {
        if (!this.app) return;
        this.app.innerHTML = this.getHTML();
        this.attachListeners();
        this.update();
    }

    getHTML() {
        return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
            <header class="space-y-4 mb-10">
                <a href="../../index.html" class="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-gold-600 dark:hover:text-gold-400 hover:border-gold-300 dark:hover:border-gold-600 transition-all text-xs font-semibold no-underline w-fit">
                    <i class="fa-solid fa-arrow-left"></i>Home
                </a>

                <div class="flex items-start justify-between gap-4">
                    <div class="space-y-1">
                        <p class="text-xs font-semibold uppercase tracking-wider text-gold-700 dark:text-gold-400">Finance & Lifestyle</p>
                        <h1 class="text-3xl md:text-4xl font-sans font-bold text-slate-900 dark:text-white tracking-tight">BMI Calculator</h1>
                        <p class="text-sm md:text-base max-w-3xl text-slate-600 dark:text-slate-400">Estimate adult BMI, category, and healthy weight range instantly.</p>
                    </div>
                    <button id="themeToggle" class="h-11 w-11 shrink-0 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all" aria-label="Toggle theme">
                        <i class="fa-solid fa-moon dark:hidden"></i>
                        <i class="fa-solid fa-sun hidden dark:inline"></i>
                    </button>
                </div>
            </header>

            <section class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div class="lg:col-span-7 space-y-6">
                    <article id="resultCard" class="rounded-3xl p-6 md:p-8 border border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-700 text-white shadow-lg">
                        <p class="text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-3">Result</p>
                        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                            <div>
                                <p class="text-sm text-white/80">Body Mass Index</p>
                                <h2 id="bmiValue" class="text-4xl md:text-5xl font-sans font-bold text-white tabular-nums mt-1">--</h2>
                            </div>
                            <div id="categoryBadge" class="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold border border-white/20 bg-white/10 text-white">
                                <i id="categoryBadgeIcon" class="fa-solid fa-circle-info text-xs"></i>
                                <span id="categoryBadgeText">Awaiting valid input</span>
                            </div>
                        </div>

                        <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="rounded-2xl border border-white/20 bg-white/10 p-4">
                                <p class="text-[11px] font-semibold uppercase tracking-wider text-white/70">Healthy weight range</p>
                                <p id="healthyRangeText" class="text-lg font-bold text-white mt-1">--</p>
                            </div>
                            <div class="rounded-2xl border border-white/20 bg-white/10 p-4">
                                <p class="text-[11px] font-semibold uppercase tracking-wider text-white/70">Calculated at</p>
                                <p id="resultTimestamp" class="text-sm font-semibold text-white mt-1">--</p>
                            </div>
                        </div>

                        <div class="mt-6 flex flex-wrap items-center gap-3">
                            <button id="copyResultBtn" class="h-11 px-4 rounded-xl bg-white/95 text-slate-900 text-sm font-semibold hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                                <i class="fa-regular fa-copy mr-2"></i>Copy Result
                            </button>
                            <p class="text-xs text-white/70">Category and color update live with your inputs.</p>
                        </div>
                    </article>

                    <article class="rounded-2xl border border-gold-100 dark:border-gold-900/40 bg-gold-50 dark:bg-gold-900/20 p-5">
                        <p class="text-xs font-semibold uppercase tracking-wider text-gold-900 dark:text-gold-300 mb-2">Educational Notice</p>
                        <p class="text-sm text-gold-900 dark:text-gold-300">This BMI result is for educational use only and is not a medical diagnosis.</p>
                        <p class="text-sm text-gold-900 dark:text-gold-300 mt-1">For personal health advice, consult a qualified healthcare professional.</p>
                    </article>
                </div>

                <div class="lg:col-span-5">
                    <section class="rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm space-y-5">
                        <div>
                            <h2 class="text-xl font-sans font-bold text-slate-900 dark:text-white">Inputs</h2>
                            <p class="text-xs text-slate-500">Switch units and enter your current measurements.</p>
                        </div>

                        <div class="inline-flex w-full rounded-xl bg-slate-100 dark:bg-slate-900 p-1">
                            <button id="metricToggle" class="h-11 flex-1 rounded-lg text-sm font-semibold transition-colors">Metric (cm/kg)</button>
                            <button id="imperialToggle" class="h-11 flex-1 rounded-lg text-sm font-semibold transition-colors">Imperial (ft/in/lb)</button>
                        </div>

                        <div id="metricFields" class="space-y-4">
                            ${this.renderInput('heightCm', 'Height (cm)', '170')}
                            ${this.renderInput('weightKg', 'Weight (kg)', '70')}
                        </div>

                        <div id="imperialFields" class="space-y-4 hidden">
                            <div class="grid grid-cols-2 gap-4">
                                ${this.renderInput('heightFt', 'Height (ft)', '5')}
                                ${this.renderInput('heightIn', 'Height (in)', '7')}
                            </div>
                            ${this.renderInput('weightLb', 'Weight (lb)', '154')}
                        </div>

                        <div class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-4">
                            <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Method</p>
                            <p id="formulaText" class="text-sm text-slate-700 dark:text-slate-300">BMI = kg / (m^2)</p>
                            <p id="formulaHint" class="text-xs text-slate-500 mt-1">Adult WHO categories are used for interpretation.</p>
                        </div>
                    </section>
                </div>
            </section>
        </div>
        `;
    }

    renderInput(id, label, placeholder) {
        return `
        <div>
            <label for="${id}" class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">${label}</label>
            <input
                id="${id}"
                type="number"
                value="${this.state[id]}"
                placeholder="${placeholder}"
                class="h-11 w-full px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500/30"
            />
            <p id="${id}Error" class="text-xs text-rose-600 dark:text-rose-400 mt-1 min-h-[16px]"></p>
        </div>
        `;
    }

    attachListeners() {
        const metricToggle = document.getElementById('metricToggle');
        const imperialToggle = document.getElementById('imperialToggle');

        metricToggle?.addEventListener('click', () => {
            this.state.unitSystem = 'metric';
            this.refreshUnitVisibility();
            this.update();
        });

        imperialToggle?.addEventListener('click', () => {
            this.state.unitSystem = 'imperial';
            this.refreshUnitVisibility();
            this.update();
        });

        ['heightCm', 'weightKg', 'heightFt', 'heightIn', 'weightLb'].forEach((id) => {
            const input = document.getElementById(id);
            if (!input) return;

            input.addEventListener('input', (event) => {
                this.state[id] = event.target.value;
                this.update();
            });
        });

        document.getElementById('copyResultBtn')?.addEventListener('click', () => this.copyResult());
        this.refreshUnitVisibility();
    }

    refreshUnitVisibility() {
        const metricActive = this.state.unitSystem === 'metric';

        document.getElementById('metricFields')?.classList.toggle('hidden', !metricActive);
        document.getElementById('imperialFields')?.classList.toggle('hidden', metricActive);

        const metricToggle = document.getElementById('metricToggle');
        const imperialToggle = document.getElementById('imperialToggle');

        metricToggle?.setAttribute('aria-pressed', metricActive ? 'true' : 'false');
        imperialToggle?.setAttribute('aria-pressed', metricActive ? 'false' : 'true');

        metricToggle?.classList.toggle('bg-white', metricActive);
        metricToggle?.classList.toggle('dark:bg-slate-800', metricActive);
        metricToggle?.classList.toggle('text-slate-900', metricActive);
        metricToggle?.classList.toggle('dark:text-white', metricActive);
        metricToggle?.classList.toggle('shadow-sm', metricActive);
        metricToggle?.classList.toggle('text-slate-500', !metricActive);
        metricToggle?.classList.toggle('dark:text-slate-400', !metricActive);

        imperialToggle?.classList.toggle('bg-white', !metricActive);
        imperialToggle?.classList.toggle('dark:bg-slate-800', !metricActive);
        imperialToggle?.classList.toggle('text-slate-900', !metricActive);
        imperialToggle?.classList.toggle('dark:text-white', !metricActive);
        imperialToggle?.classList.toggle('shadow-sm', !metricActive);
        imperialToggle?.classList.toggle('text-slate-500', metricActive);
        imperialToggle?.classList.toggle('dark:text-slate-400', metricActive);

        const formulaText = document.getElementById('formulaText');
        if (formulaText) {
            formulaText.textContent = metricActive
                ? 'BMI = kg / (m^2)'
                : 'BMI = 703 x lb / (in^2)';
        }
    }

    update() {
        this.clearErrors();
        const validation = validateInput(this.state);

        if (!validation.isValid) {
            this.renderErrors(validation.errors);
            this.renderInvalidResult();
            return;
        }

        const result = calculateBMI(this.state);
        this.renderValidResult(result);
    }

    clearErrors() {
        ['heightCm', 'weightKg', 'heightFt', 'heightIn', 'weightLb'].forEach((id) => {
            const errorEl = document.getElementById(`${id}Error`);
            if (errorEl) errorEl.textContent = '';
        });
    }

    renderErrors(errors) {
        Object.entries(errors).forEach(([field, message]) => {
            const errorEl = document.getElementById(`${field}Error`);
            if (errorEl) errorEl.textContent = message;
        });
    }

    renderInvalidResult() {
        const bmiValue = document.getElementById('bmiValue');
        const categoryBadge = document.getElementById('categoryBadge');
        const categoryBadgeText = document.getElementById('categoryBadgeText');
        const categoryBadgeIcon = document.getElementById('categoryBadgeIcon');
        const healthyRangeText = document.getElementById('healthyRangeText');
        const resultTimestamp = document.getElementById('resultTimestamp');
        const copyBtn = document.getElementById('copyResultBtn');
        const resultCard = document.getElementById('resultCard');

        if (bmiValue) bmiValue.textContent = '--';
        if (healthyRangeText) healthyRangeText.textContent = '--';
        if (resultTimestamp) resultTimestamp.textContent = '--';
        if (categoryBadge) {
            categoryBadge.className = 'inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold border border-white/20 bg-white/10 text-white';
        }
        if (categoryBadgeText) categoryBadgeText.textContent = 'Awaiting valid input';
        if (categoryBadgeIcon) categoryBadgeIcon.className = 'fa-solid fa-circle-info text-xs';
        if (copyBtn) copyBtn.disabled = true;
        if (resultCard) resultCard.className = `rounded-3xl p-6 md:p-8 border text-white shadow-lg ${this.getResultCardClasses(null)}`;

        this.latestSummary = null;
    }

    renderValidResult(result) {
        const bmiValue = document.getElementById('bmiValue');
        const categoryBadge = document.getElementById('categoryBadge');
        const categoryBadgeText = document.getElementById('categoryBadgeText');
        const categoryBadgeIcon = document.getElementById('categoryBadgeIcon');
        const healthyRangeText = document.getElementById('healthyRangeText');
        const resultTimestamp = document.getElementById('resultTimestamp');
        const copyBtn = document.getElementById('copyResultBtn');
        const resultCard = document.getElementById('resultCard');

        if (bmiValue) bmiValue.textContent = result.bmi.toFixed(1);
        if (healthyRangeText) healthyRangeText.textContent = result.healthyRange.label;
        if (resultTimestamp) {
            resultTimestamp.textContent = new Date(result.timestamp).toLocaleString();
        }
        if (copyBtn) copyBtn.disabled = false;

        if (categoryBadge) {
            categoryBadge.className = `inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold border border-white/20 bg-white/10 text-white`;
        }
        if (categoryBadgeText) categoryBadgeText.textContent = result.categoryLabel;
        if (categoryBadgeIcon) categoryBadgeIcon.className = `fa-solid ${this.getCategoryIcon(result.categoryKey)} text-xs`;
        if (resultCard) resultCard.className = `rounded-3xl p-6 md:p-8 border text-white shadow-lg ${this.getResultCardClasses(result.categoryKey)}`;

        this.latestSummary = `BMI: ${result.bmi.toFixed(1)} (${result.categoryLabel}) | Healthy weight range: ${result.healthyRange.label}`;
    }

    getCategoryIcon(categoryKey) {
        if (categoryKey === 'normal') return 'fa-circle-check';
        if (categoryKey === 'underweight' || categoryKey === 'overweight') return 'fa-triangle-exclamation';
        return 'fa-circle-exclamation';
    }

    getResultCardClasses(categoryKey) {
        if (categoryKey === 'normal') {
            return 'border-emerald-500/30 bg-gradient-to-br from-emerald-700 to-teal-600';
        }
        if (categoryKey === 'underweight' || categoryKey === 'overweight') {
            return 'border-amber-500/30 bg-gradient-to-br from-amber-600 to-orange-500';
        }
        if (categoryKey) {
            return 'border-rose-500/30 bg-gradient-to-br from-rose-700 to-red-600';
        }
        return 'border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-700';
    }

    async copyResult() {
        if (!this.latestSummary) return;

        const copyBtn = document.getElementById('copyResultBtn');
        try {
            await navigator.clipboard.writeText(this.latestSummary);
            if (copyBtn) copyBtn.innerHTML = '<i class="fa-solid fa-check mr-2"></i>Copied';
            setTimeout(() => {
                if (copyBtn) copyBtn.innerHTML = '<i class="fa-regular fa-copy mr-2"></i>Copy Result';
            }, 1400);
        } catch {
            if (copyBtn) copyBtn.innerHTML = '<i class="fa-solid fa-triangle-exclamation mr-2"></i>Copy failed';
            setTimeout(() => {
                if (copyBtn) copyBtn.innerHTML = '<i class="fa-regular fa-copy mr-2"></i>Copy Result';
            }, 1400);
        }
    }
}
