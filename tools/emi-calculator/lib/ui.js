import { EMICalculator } from './calculator.js';

export class AppUI {
    constructor() {
        this.state = {
            productPrice: 80000,
            tenure: 9,
            processingFee: 199,
            returnRate: 10,
            upfrontDiscount: 5000,
            emiDiscount: 2500,
            gstOnInterest: true,
            showAdvanced: true,
            bankInterestRate: 15,
            emiStrategy: 'no_cost_subvention',
            subventionShare: 100,
            downPayment: 0
        };
        this.app = document.getElementById('app');
    }

    render() {
        if (!this.app) return;
        this.app.innerHTML = this.getHTML();
        this.attachListeners();
        this.updateAnalysis();
    }

    getHTML() {
        return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 font-inter text-slate-700 dark:text-slate-300 space-y-8">
            <header class="space-y-4">
                <a href="../../index.html" class="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-white/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-gold-600 dark:hover:text-gold-400 transition-colors no-underline text-sm font-semibold">
                    <i class="fa-solid fa-arrow-left"></i> Home
                </a>

                <div class="flex items-start justify-between gap-4">
                    <div class="space-y-1">
                        <p class="text-xs font-semibold uppercase tracking-wider text-gold-700 dark:text-gold-400">Finance Tool</p>
                        <h1 class="text-3xl md:text-4xl font-sans font-bold text-slate-900 dark:text-white tracking-tight">EMI Discount Analyzer</h1>
                        <p class="text-sm md:text-base max-w-3xl text-slate-600 dark:text-slate-400">Compare upfront vs EMI with both-side discounts, bank-style EMI strategies, and opportunity-return impact.</p>
                    </div>
                    <button id="themeToggle" class="h-11 w-11 shrink-0 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                        <i class="fa-solid fa-moon dark:hidden"></i>
                        <i class="fa-solid fa-sun hidden dark:inline"></i>
                    </button>
                </div>
            </header>

            <section class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div class="lg:col-span-8 space-y-6">
                    <article id="recommendationCard" class="rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl">
                        <p class="text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-2">Decision</p>
                        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                            <div>
                        <h2 id="recTitle" class="text-3xl md:text-4xl font-sans font-bold">Analyzing...</h2>
                                <p id="recDesc" class="text-sm text-white/80 mt-2 max-w-2xl">Computing current scenario with your assumptions.</p>
                            </div>
                            <div class="rounded-2xl px-4 py-3 bg-white/10 border border-white/20 min-w-[180px]">
                                <p class="text-[11px] uppercase tracking-wider text-white/70">Net Difference</p>
                                <p id="recAmount" class="text-3xl font-bold tabular-nums">₹0</p>
                                <p id="recPercent" class="text-xs text-white/70">0%</p>
                            </div>
                        </div>
                    </article>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <article id="optionACard" class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Option A</p>
                                    <h3 class="text-xl font-sans font-bold text-slate-900 dark:text-white">Pay Upfront</h3>
                                </div>
                                <span id="checkA" class="hidden h-7 w-7 rounded-full bg-emerald-500 text-white items-center justify-center"><i class="fa-solid fa-check text-xs"></i></span>
                            </div>
                            <div>
                                <p id="costA" class="text-3xl font-bold tabular-nums text-slate-900 dark:text-white">₹0</p>
                                <p class="text-xs text-slate-500">Effective cash outflow</p>
                            </div>
                            <div class="space-y-2 text-sm">
                                ${this.renderStatRow('Base price', 'basePriceVal')}
                                ${this.renderStatRow('Upfront discount', 'upfrontDiscountVal', 'text-emerald-600 dark:text-emerald-400')}
                            </div>
                        </article>

                        <article id="optionBCard" class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Option B</p>
                                    <h3 class="text-xl font-sans font-bold text-slate-900 dark:text-white">EMI Plan</h3>
                                </div>
                                <span id="checkB" class="hidden h-7 w-7 rounded-full bg-emerald-500 text-white items-center justify-center"><i class="fa-solid fa-check text-xs"></i></span>
                            </div>
                            <div>
                                <p id="costB" class="text-3xl font-bold tabular-nums text-slate-900 dark:text-white">₹0</p>
                                <p class="text-xs text-slate-500">Net effective cost after return offset</p>
                            </div>
                            <div class="space-y-2 text-sm">
                                ${this.renderStatRow('Total EMI payments', 'totalEmiVal')}
                                ${this.renderStatRow('EMI discount', 'emiDiscountVal', 'text-emerald-600 dark:text-emerald-400')}
                                ${this.renderStatRow('Opportunity returns', 'returnsVal', 'text-emerald-600 dark:text-emerald-400')}
                                ${this.renderStatRow('Fees + GST', 'feesVal', 'text-rose-600 dark:text-rose-400')}
                            </div>
                        </article>
                    </div>

                    <article class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 md:p-8">
                        <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-5">Decision Surface</h3>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            ${this.renderMetric('Monthly EMI', 'monthlyEmiMetric', 'based on strategy')}
                            ${this.renderMetric('Interest Charged', 'interestMetric', 'customer share')}
                            ${this.renderMetric('Break-even APY', 'breakEvenMetric', 'required return')}
                            ${this.renderMetric('Snapshot', 'snapshotMetric', 'local time')}
                        </div>
                    </article>
                </div>

                <div class="lg:col-span-4 space-y-6">
                    <section class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 space-y-5">
                        <div>
                            <h2 class="text-xl font-sans font-bold text-slate-900 dark:text-white">Inputs</h2>
                            <p class="text-xs text-slate-500">All values normalized to monthly cashflow logic.</p>
                        </div>

                        ${this.renderInputGroup('productPrice', 'Product Price', '₹')}

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            ${this.renderInputGroup('upfrontDiscount', 'Upfront Discount', '₹', 'Offer valid on full payment')}
                            ${this.renderInputGroup('emiDiscount', 'EMI Discount', '₹', 'Instant cashback/offer on EMI')}
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            ${this.renderInputGroup('processingFee', 'Processing Fee', '₹')}
                            ${this.renderInputGroup('downPayment', 'Down Payment', '₹')}
                        </div>

                        ${this.renderSlider('tenure', 'Tenure (Months)', 3, 36, 1, 'mo')}
                        ${this.renderSlider('returnRate', 'Expected Return (APY)', 0, 24, 0.25, '%')}

                        ${this.renderToggle('gstOnInterest', 'Include GST on interest', '18% GST is usually applied on interest component.')}

                        <div class="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-4">
                            <button id="advancedToggle" class="w-full h-11 inline-flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-gold-600 dark:hover:text-gold-400">
                                <span>Advanced Settings</span>
                                <i class="fa-solid fa-chevron-down transition-transform ${this.state.showAdvanced ? 'rotate-180' : ''}"></i>
                            </button>

                            <div id="advancedPanel" class="space-y-4 overflow-hidden transition-all duration-300 ${this.state.showAdvanced ? 'max-h-[460px] opacity-100' : 'max-h-0 opacity-0'}">
                                ${this.renderSelectGroup('emiStrategy', 'EMI Strategy', [
                                    { value: 'no_cost_subvention', label: 'No-cost EMI (subvention)' },
                                    { value: 'reducing_balance', label: 'Reducing balance EMI' },
                                    { value: 'flat_rate', label: 'Flat-rate EMI' }
                                ])}
                                ${this.renderInputGroup('bankInterestRate', 'Annual Interest Rate', '%')}
                                ${this.renderSlider('subventionShare', 'Interest Subsidy Share', 0, 100, 5, '%', 'Used in no-cost EMI mode')}
                            </div>
                        </div>
                    </section>

                    <section class="bg-gold-50 dark:bg-gold-900/20 rounded-3xl border border-gold-100 dark:border-gold-900/40 p-6 space-y-3 text-sm text-gold-900 dark:text-gold-300">
                        <h3 class="text-xs font-semibold uppercase tracking-wider">Method</h3>
                        <p id="formulaText">EMI formula is selected dynamically based on strategy.</p>
                        <p id="assumptionText" class="text-xs text-gold-800 dark:text-gold-400">Assumptions loading...</p>
                    </section>
                </div>
            </section>
        </div>
        `;
    }

    renderInputGroup(id, label, prefix, helper) {
        return `
        <div>
            <label for="${id}" class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">${label}</label>
            <div class="relative">
                ${prefix ? `<span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">${prefix}</span>` : ''}
                <input
                    type="number"
                    id="${id}"
                    value="${this.state[id]}"
                    class="w-full h-11 ${prefix ? 'pl-8' : 'pl-3'} pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                />
            </div>
            ${helper ? `<p class="text-[11px] text-slate-500 mt-1">${helper}</p>` : ''}
        </div>
        `;
    }

    renderSlider(id, label, min, max, step, suffix, helper) {
        return `
        <div>
            <div class="flex items-center justify-between mb-1.5">
                <label for="${id}" class="text-xs font-semibold uppercase tracking-wider text-slate-500">${label}</label>
                <span class="text-sm font-bold text-slate-900 dark:text-white tabular-nums"><span id="${id}Display">${this.state[id]}</span>${suffix ? ` ${suffix}` : ''}</span>
            </div>
            <input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${this.state[id]}" class="w-full accent-gold-600" />
            ${helper ? `<p class="text-[11px] text-slate-500 mt-1">${helper}</p>` : ''}
        </div>
        `;
    }

    renderSelectGroup(id, label, options) {
        const optionsHtml = options
            .map((opt) => `<option value="${opt.value}" ${this.state[id] === opt.value ? 'selected' : ''}>${opt.label}</option>`)
            .join('');

        return `
        <div>
            <label for="${id}" class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">${label}</label>
            <select id="${id}" class="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white px-3 focus:outline-none focus:ring-2 focus:ring-gold-500/30">
                ${optionsHtml}
            </select>
        </div>
        `;
    }

    renderToggle(id, label, description) {
        return `
        <div class="flex items-start justify-between gap-3 rounded-xl border border-slate-100 dark:border-slate-700 p-3">
            <div>
                <label for="${id}" class="block text-xs font-semibold uppercase tracking-wider text-slate-500">${label}</label>
                <p class="text-[11px] text-slate-500 mt-1">${description}</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="${id}" class="sr-only peer" ${this.state[id] ? 'checked' : ''}>
                <span class="w-11 h-6 rounded-full bg-slate-200 dark:bg-slate-700 peer-checked:bg-gold-600 transition-colors"></span>
                <span class="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow peer-checked:translate-x-5 transition-transform"></span>
            </label>
        </div>
        `;
    }

    renderStatRow(label, valueId, colorClass = 'text-slate-900 dark:text-white') {
        return `
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2 last:border-0 last:pb-0">
            <span class="text-slate-500">${label}</span>
            <span id="${valueId}" class="font-semibold tabular-nums ${colorClass}">-</span>
        </div>
        `;
    }

    renderMetric(label, valueId, hint) {
        return `
        <div class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/50 p-4">
            <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">${label}</p>
            <p id="${valueId}" class="text-lg font-bold tabular-nums text-slate-900 dark:text-white mt-1">-</p>
            <p class="text-[11px] text-slate-500 mt-1">${hint}</p>
        </div>
        `;
    }

    attachListeners() {
        const numericInputIds = [
            'productPrice',
            'upfrontDiscount',
            'emiDiscount',
            'processingFee',
            'downPayment',
            'bankInterestRate'
        ];

        numericInputIds.forEach((id) => {
            const input = document.getElementById(id);
            if (!input) return;
            input.addEventListener('input', (e) => {
                this.state[id] = Number(e.target.value);
                this.updateAnalysis();
            });
        });

        ['tenure', 'returnRate', 'subventionShare'].forEach((id) => {
            const slider = document.getElementById(id);
            const display = document.getElementById(`${id}Display`);
            if (!slider) return;

            slider.addEventListener('input', (e) => {
                const value = Number(e.target.value);
                this.state[id] = value;
                if (display) display.textContent = value;
                this.updateAnalysis();
            });
        });

        const gstToggle = document.getElementById('gstOnInterest');
        if (gstToggle) {
            gstToggle.addEventListener('change', (e) => {
                this.state.gstOnInterest = e.target.checked;
                this.updateAnalysis();
            });
        }

        const strategySelect = document.getElementById('emiStrategy');
        if (strategySelect) {
            strategySelect.addEventListener('change', (e) => {
                this.state.emiStrategy = e.target.value;
                this.updateAnalysis();
            });
        }

        const advancedBtn = document.getElementById('advancedToggle');
        const advancedPanel = document.getElementById('advancedPanel');
        const chevron = advancedBtn?.querySelector('.fa-chevron-down');

        if (advancedBtn && advancedPanel && chevron) {
            advancedBtn.addEventListener('click', () => {
                this.state.showAdvanced = !this.state.showAdvanced;
                advancedPanel.classList.toggle('max-h-0', !this.state.showAdvanced);
                advancedPanel.classList.toggle('opacity-0', !this.state.showAdvanced);
                advancedPanel.classList.toggle('max-h-[460px]', this.state.showAdvanced);
                advancedPanel.classList.toggle('opacity-100', this.state.showAdvanced);
                chevron.classList.toggle('rotate-180', this.state.showAdvanced);
            });
        }
    }

    updateAnalysis() {
        const result = EMICalculator.calculate(this.state);

        const fmt = (v) => `₹${Math.round(v).toLocaleString('en-IN')}`;
        const fmtSigned = (v) => `${v < 0 ? '-' : '+'} ₹${Math.abs(Math.round(v)).toLocaleString('en-IN')}`;

        const recCard = document.getElementById('recommendationCard');
        const recTitle = document.getElementById('recTitle');
        const recDesc = document.getElementById('recDesc');

        if (result.isEmiBetter) {
            recCard.className = 'rounded-3xl p-6 md:p-8 border border-emerald-200/30 bg-gradient-to-br from-emerald-700 to-emerald-900 text-white shadow-xl';
            recTitle.textContent = 'Choose EMI';
            recDesc.textContent = 'EMI-side discounts and expected returns outweigh fees under current assumptions.';
        } else {
            recCard.className = 'rounded-3xl p-6 md:p-8 border border-amber-200/30 bg-gradient-to-br from-amber-700 to-amber-900 text-white shadow-xl';
            recTitle.textContent = 'Choose Upfront';
            recDesc.textContent = 'Upfront payment remains cheaper after accounting for discounts, fees, and modeled returns.';
        }

        document.getElementById('recAmount').textContent = fmt(Math.abs(result.savings));
        document.getElementById('recPercent').textContent = `${result.savingsPercentage.toFixed(1)}% of base price`;

        const optionACard = document.getElementById('optionACard');
        const optionBCard = document.getElementById('optionBCard');
        const checkA = document.getElementById('checkA');
        const checkB = document.getElementById('checkB');

        optionACard.classList.toggle('ring-2', !result.isEmiBetter);
        optionACard.classList.toggle('ring-emerald-400', !result.isEmiBetter);
        optionBCard.classList.toggle('ring-2', result.isEmiBetter);
        optionBCard.classList.toggle('ring-emerald-400', result.isEmiBetter);

        checkA.classList.toggle('hidden', result.isEmiBetter);
        checkA.classList.toggle('flex', !result.isEmiBetter);
        checkB.classList.toggle('hidden', !result.isEmiBetter);
        checkB.classList.toggle('flex', result.isEmiBetter);

        document.getElementById('costA').textContent = fmt(result.upfrontCost);
        document.getElementById('costB').textContent = fmt(result.effectiveEmiCost);

        document.getElementById('basePriceVal').textContent = fmt(result.productPrice);
        document.getElementById('upfrontDiscountVal').textContent = fmtSigned(-result.upfrontDiscount);
        document.getElementById('totalEmiVal').textContent = fmt(result.totalEmiPayment);
        document.getElementById('emiDiscountVal').textContent = fmtSigned(-result.emiDiscount);
        document.getElementById('returnsVal').textContent = fmtSigned(result.totalInterestEarned);
        document.getElementById('feesVal').textContent = fmt(result.processingFee + result.gstCost);

        document.getElementById('monthlyEmiMetric').textContent = fmt(result.monthlyEMI);
        document.getElementById('interestMetric').textContent = fmt(result.customerInterest);

        const breakEvenNode = document.getElementById('breakEvenMetric');
        breakEvenNode.textContent = result.breakEvenReturnRate === null
            ? '> 60%'
            : `${result.breakEvenReturnRate.toFixed(2)}%`;

        const now = new Date();
        document.getElementById('snapshotMetric').textContent = now.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });

        const formulaText = document.getElementById('formulaText');
        const assumptionText = document.getElementById('assumptionText');
        const subventionSlider = document.getElementById('subventionShare');
        if (subventionSlider) {
            const isNoCost = result.emiStrategy === 'no_cost_subvention';
            subventionSlider.disabled = !isNoCost;
            subventionSlider.classList.toggle('opacity-50', !isNoCost);
            subventionSlider.classList.toggle('cursor-not-allowed', !isNoCost);
        }

        if (result.emiStrategy === 'reducing_balance') {
            formulaText.textContent = 'Formula: EMI = P*r*(1+r)^n / ((1+r)^n - 1) using monthly reducing balance.';
        } else if (result.emiStrategy === 'flat_rate') {
            formulaText.textContent = 'Formula: Flat EMI = (P + P*R*T) / n, where R is annual rate and T is years.';
        } else {
            formulaText.textContent = 'No-cost EMI: reducing-balance interest is computed first, then subsidy share reduces customer interest.';
        }

        assumptionText.textContent = `Assumptions: ${result.tenure} months, ${result.bankInterestRate.toFixed(2)}% annual rate, ${result.subventionShare.toFixed(0)}% subsidy, GST ${result.gstOnInterest ? 'included' : 'excluded'}.`;
    }
}
