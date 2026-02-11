
import { EMICalculator } from './calculator.js';

export class AppUI {
    constructor() {
        this.state = {
            productPrice: 80000,
            tenure: 6,
            processingFee: 199,
            returnRate: 7.0,
            foregoneDiscount: 2500,
            gstOnInterest: true,
            showAdvanced: false,
            bankInterestRate: 15
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
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 font-sans text-slate-600 dark:text-slate-400">
            
            <!-- Header -->
            <div class="mb-10 md:mb-14">
                <a href="../../index.html" class="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-300 dark:hover:border-violet-600 transition-all text-xs font-semibold no-underline w-fit">
                    <i class="fa-solid fa-arrow-left"></i>Home
                </a>
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
                            <i class="fa-solid fa-calculator text-xl"></i>
                        </div>
                        <div>
                            <h1 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                                EMI Analyzer
                            </h1>
                            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">
                                True Cost Calculator
                            </p>
                        </div>
                    </div>
                     <!-- Theme Toggle Placeholder -->
                    <button id="themeToggle" class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm hover:shadow-md">
                        <i class="fa-solid fa-moon dark:hidden"></i>
                        <i class="fa-solid fa-sun hidden dark:inline"></i>
                    </button>
                </div>
                <p class="text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                     Compare "No Cost EMI" schemes against upfront payments. Uncover hidden interest costs (GST) and calculate the opportunity cost of your money.
                </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                <!-- Configuration Panel -->
                <div class="lg:col-span-4 space-y-6 animate-enter delay-100">
                    <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 p-6 md:p-8 sticky top-6 z-10">
                        
                        <div class="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                             <div class="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center text-lg">
                                <i class="fa-solid fa-sliders"></i>
                            </div>
                            <div>
                                <h2 class="text-lg font-bold text-slate-900 dark:text-white leading-tight">Configuration</h2>
                                <p class="text-xs text-slate-400 font-medium">Input details</p>
                            </div>
                        </div>

                        <div class="space-y-5">
                            ${this.renderInputGroup('productPrice', 'Product Price', '₹')}
                            
                            <div class="grid grid-cols-2 gap-4">
                                ${this.renderInputGroup('processingFee', 'Processing Fee', '₹')}
                                ${this.renderInputGroup('foregoneDiscount', 'Discount Lost', '₹', 'If paying upfront')}
                            </div>

                            <div class="pt-2 space-y-6 border-t border-slate-100 dark:border-slate-700">
                                ${this.renderSlider('tenure', 'EMI Duration', 3, 24, 1, ' months')}
                                ${this.renderSlider('returnRate', 'Expected Return Rate (APY)', 0, 15, 0.5, '%', 'Your investment return rate')}
                            </div>

                             <div class="pt-4 border-t border-slate-100 dark:border-slate-700">
                                ${this.renderToggle('gstOnInterest', 'Include GST on Interest', '18% GST is applicable on the interest component of EMI')}
                            </div>

                             <div class="pt-4 border-t border-slate-100 dark:border-slate-700">
                                <button id="advancedToggle" class="w-full flex items-center justify-between text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                                    <span>Advanced Options</span>
                                    <i class="fa-solid fa-chevron-down transition-transform duration-300 ${this.state.showAdvanced ? 'rotate-180' : ''}"></i>
                                </button>

                                <div id="advancedPanel" class="overflow-hidden transition-all duration-300 ease-in-out ${this.state.showAdvanced ? 'max-h-24 opacity-100 pt-4' : 'max-h-0 opacity-0'}">
                                     ${this.renderInputGroup('bankInterestRate', 'Bank Interest Rate (Approx)', '%', null, true)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Results Panel -->
                <div class="lg:col-span-8 space-y-6 animate-enter delay-200">
                    
                    <!-- Recommendation Card -->
                    <div id="recommendationCard" class="relative overflow-hidden rounded-3xl p-8 md:p-10 text-white shadow-2xl transition-all duration-500 bg-slate-900 border border-slate-800">
                         <!-- Backgrounds -->
                        <div id="recBgEmi" class="absolute inset-0 bg-gradient-to-br from-[#431407] via-[#7c2d12] to-[#451a03] transition-opacity duration-700 opacity-0"></div> <!-- Muted Deep Copper for EMI -->
                        <div id="recBgUpfront" class="absolute inset-0 bg-gradient-to-br from-[#422006] via-[#713f12] to-[#452207] transition-opacity duration-700 opacity-0"></div> <!-- Muted Deep Gold for Upfront -->
                        
                        <!-- Content -->
                        <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 mb-4">
                                     <i class="fa-solid fa-lightbulb text-yellow-300 text-xs"></i>
                                     <span class="text-xs font-bold tracking-wide">RECOMMENDATION</span>
                                </div>
                                <h2 id="recTitle" class="text-3xl md:text-4xl font-bold mb-2 leading-tight">Calculating...</h2>
                                <p id="recDesc" class="text-white/80 font-medium max-w-lg text-sm md:text-base leading-relaxed">
                                    Analysis pending...
                                </p>
                            </div>
                            
                            <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[140px] border border-white/10 text-center">
                                <div id="recLabel" class="text-xs font-bold text-white/60 mb-1 uppercase tracking-wider">Savings</div>
                                <div id="recAmount" class="text-3xl font-bold tabular-nums mb-1">₹0</div>
                                <div id="recPercent" class="text-[10px] font-medium text-white/70">0%</div>
                            </div>
                        </div>
                    </div>

                    <!-- Comparison Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Upfront Card -->
                        <div id="optionACard" class="bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 transition-all duration-300 border-slate-100 dark:border-slate-700">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Option A</span>
                                    <h3 class="text-lg font-bold text-slate-900 dark:text-white">Pay Upfront</h3>
                                </div>
                                <div id="checkA" class="hidden w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-sm">
                                    <i class="fa-solid fa-check text-xs"></i>
                                </div>
                            </div>
                            
                            <div class="mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                                <div class="text-3xl font-bold text-slate-900 dark:text-white tabular-nums mb-1" id="costA">₹0</div>
                                <div class="text-xs font-medium text-slate-500">Total effective cost</div>
                            </div>

                            <div class="space-y-3">
                                ${this.renderStatRow('Base Price', 'basePriceVal')}
                                ${this.renderStatRow('Instant Discount', 'discountVal', 'text-emerald-600 dark:text-emerald-400')}
                            </div>
                        </div>

                        <!-- EMI Card -->
                        <div id="optionBCard" class="bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 transition-all duration-300 border-slate-100 dark:border-slate-700">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Option B</span>
                                    <h3 class="text-lg font-bold text-slate-900 dark:text-white">No Cost EMI</h3>
                                </div>
                                <div id="checkB" class="hidden w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-sm">
                                    <i class="fa-solid fa-check text-xs"></i>
                                </div>
                            </div>

                            <div class="mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                                <div class="text-3xl font-bold text-slate-900 dark:text-white tabular-nums mb-1" id="costB">₹0</div>
                                <div class="text-xs font-medium text-slate-500">Total effective cost</div>
                            </div>

                            <div class="space-y-3">
                                ${this.renderStatRow('Total Payments', 'totalEmiVal')}
                                ${this.renderStatRow('Investment Returns', 'returnsVal', 'text-emerald-600 dark:text-emerald-400')}
                                ${this.renderStatRow('Fees & Taxes', 'feesVal', 'text-rose-600 dark:text-rose-400')}
                            </div>
                        </div>
                    </div>

                    <!-- Detailed Breakdown -->
                    <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 md:p-8">
                        <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6">Detailed Breakdown</h3>
                        
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            ${this.renderMetric('Monthly EMI', 'monthlyEmiMetric', 'tenureMetric')}
                            ${this.renderMetric('Interest Earned', 'interestMetric', null, 'text-emerald-600 dark:text-emerald-400')}
                            ${this.renderMetric('Processing Fee', 'processMetric', null, 'text-rose-600 dark:text-rose-400')}
                            ${this.renderMetric('GST on Interest', 'gstMetric', null, 'text-rose-600 dark:text-rose-400')}
                        </div>
                    </div>

                     <div class="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-4 border border-blue-100 dark:border-blue-900/30 flex gap-3 text-sm text-blue-800 dark:text-blue-300">
                        <i class="fa-solid fa-circle-info mt-0.5"></i>
                        <p>
                            <strong>How this works:</strong> "No Cost EMI" schemes discount the product price equal to the interest amount. However, you still pay 18% GST on that interest component. By paying upfront, you get the discount directly throughout the product cost.
                        </p>
                    </div>

                </div>
            </div>
             <div class="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
                <p class="text-xs text-slate-400 dark:text-slate-500">
                    Calculations are estimates. Actual values may vary based on bank policies.
                </p>
            </div>
        </div>
        `;
    }

    renderInputGroup(id, label, prefix, helper, disabled = false) {
        return `
        <div class="group">
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">${label}</label>
            <div class="relative">
                ${prefix ? `<span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">${prefix}</span>` : ''}
                <input
                    type="number"
                    id="${id}"
                    value="${this.state[id]}"
                    ${disabled ? 'disabled' : ''}
                    class="w-full ${prefix ? 'pl-8' : 'pl-4'} pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all ${disabled ? 'opacity-60 cursor-not-allowed' : ''}"
                />
            </div>
             ${helper ? `<p class="text-[10px] text-slate-400 mt-1.5 ml-1">${helper}</p>` : ''}
        </div>
        `;
    }

    renderSlider(id, label, min, max, step, suffix, helper) {
        return `
        <div class="group">
            <div class="flex justify-between items-center mb-2">
                <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">${label}</label>
                <div class="font-bold text-violet-600 dark:text-violet-400 text-sm tabular-nums">
                    <span id="${id}Display">${this.state[id]}</span>${suffix ? ` <span class="text-xs text-slate-400 font-normal">${suffix}</span>` : ''}
                </div>
            </div>
            
            <input
                type="range"
                id="${id}"
                min="${min}"
                max="${max}"
                step="${step}"
                value="${this.state[id]}"
                class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-600"
            />
             ${helper ? `<p class="text-[10px] text-slate-400 mt-2">${helper}</p>` : ''}
        </div>
        `;
    }

    renderToggle(id, label, description) {
        return `
        <div class="flex items-start justify-between gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div>
                 <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer" for="${id}">${label}</label>
                 <p class="text-[10px] text-slate-400 mt-0.5">${description}</p>
            </div>
             <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="${id}" class="sr-only peer" ${this.state[id] ? 'checked' : ''}>
                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-300 dark:peer-focus:ring-violet-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-violet-600"></div>
            </label>
        </div>
        `;
    }

    renderStatRow(label, valueId, colorClass = 'text-slate-900 dark:text-white') {
        return `
        <div class="flex justify-between items-center py-2 text-sm border-b border-slate-50 dark:border-slate-700/50 last:border-0 last:pb-0">
            <span class="text-slate-500 dark:text-slate-400 font-medium">${label}</span>
            <span id="${valueId}" class="font-bold tabular-nums ${colorClass}">-</span>
        </div>
        `;
    }

    renderMetric(label, valueId, sublabelId, colorClass = 'text-slate-900 dark:text-white') {
        return `
        <div class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
            <div class="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">${label}</div>
            <div id="${valueId}" class="text-lg font-bold tabular-nums leading-tight ${colorClass}">-</div>
            ${sublabelId ? `<div id="${sublabelId}" class="text-[10px] text-slate-400 mt-1 font-medium"></div>` : ''}
        </div>
        `;
    }

    attachListeners() {
        // Floating Inputs
        ['productPrice', 'processingFee', 'foregoneDiscount'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', (e) => {
                    this.state[id] = Number(e.target.value);
                    this.updateAnalysis();
                });
            }
        });

        // Sliders
        ['tenure', 'returnRate'].forEach(id => {
            const slider = document.getElementById(id);
            const display = document.getElementById(`${id}Display`);

            if (slider) {
                slider.addEventListener('input', (e) => {
                    const val = Number(e.target.value);
                    this.state[id] = val;
                    if (display) display.textContent = val;
                    this.updateAnalysis();
                });
            }
        });

        // Toggle Switch
        const toggleBtn = document.getElementById('gstOnInterest');
        if (toggleBtn) {
            toggleBtn.addEventListener('change', (e) => {
                this.state.gstOnInterest = e.target.checked;
                this.updateAnalysis();
            });
        }

        // Advanced Toggle
        const advancedBtn = document.getElementById('advancedToggle');
        const advancedPanel = document.getElementById('advancedPanel');
        const chevron = advancedBtn.querySelector('.fa-chevron-down');

        if (advancedBtn) {
            advancedBtn.addEventListener('click', () => {
                this.state.showAdvanced = !this.state.showAdvanced;
                if (this.state.showAdvanced) {
                    advancedPanel.classList.remove('max-h-0', 'opacity-0');
                    advancedPanel.classList.add('max-h-24', 'opacity-100', 'pt-4');
                    chevron.classList.add('rotate-180');
                } else {
                    advancedPanel.classList.add('max-h-0', 'opacity-0');
                    advancedPanel.classList.remove('max-h-24', 'opacity-100', 'pt-4');
                    chevron.classList.remove('rotate-180');
                }
            });
        }
    }

    updateAnalysis() {
        const result = EMICalculator.calculate(this.state);

        // Formatter
        const fmt = (v) => '₹' + Math.round(v).toLocaleString('en-IN');
        const fmtDec = (v) => '₹' + v.toLocaleString('en-IN', { maximumFractionDigits: 0 });

        // Update Recommendation Section
        const recBgEmi = document.getElementById('recBgEmi');
        const recBgUpfront = document.getElementById('recBgUpfront');
        const recLabel = document.getElementById('recLabel');
        const recAmount = document.getElementById('recAmount');
        const recPercent = document.getElementById('recPercent');
        const recTitle = document.getElementById('recTitle');
        const recDesc = document.getElementById('recDesc');

        if (result.isEmiBetter) {
            recBgEmi.classList.remove('opacity-0');
            recBgUpfront.classList.add('opacity-0');
            recLabel.textContent = 'Strategic Alpha';
            recTitle.innerHTML = 'Leverage EMI';
            recDesc.textContent = "Your capital works harder when invested. The return on liquidity (Apeiron) outperforms the upfront discount cost.";
        } else {
            recBgEmi.classList.add('opacity-0');
            recBgUpfront.classList.remove('opacity-0');
            recLabel.textContent = 'Net Savings';
            recTitle.innerHTML = 'Direct Purchase';
            recDesc.textContent = "Immediate ownership provides the highest net-present-value. The upfront discount creates a risk-free margin of safety.";
        }

        recAmount.textContent = fmtDec(Math.abs(result.savings));
        recPercent.textContent = `${result.savingsPercentage.toFixed(1)}%`;

        // Card Highlights
        const optionACard = document.getElementById('optionACard');
        const optionBCard = document.getElementById('optionBCard');
        const checkA = document.getElementById('checkA');
        const checkB = document.getElementById('checkB');

        const activeClass = 'border-2 border-emerald-500 ring-4 ring-emerald-500/10 dark:ring-emerald-500/20';
        const inactiveClass = 'border-slate-100 dark:border-slate-700';

        // Reset
        optionACard.className = `bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 transition-all duration-300 ${!result.isEmiBetter ? activeClass : inactiveClass}`;
        optionBCard.className = `bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 transition-all duration-300 ${result.isEmiBetter ? activeClass : inactiveClass}`;

        if (result.isEmiBetter) {
            checkA.classList.add('hidden');
            checkB.classList.remove('hidden');
        } else {
            checkA.classList.remove('hidden');
            checkB.classList.add('hidden');
        }

        // Stats Option A
        document.getElementById('costA').textContent = fmtDec(result.upfrontCost);
        document.getElementById('basePriceVal').textContent = fmt(this.state.productPrice);
        document.getElementById('discountVal').textContent = '- ' + fmt(this.state.foregoneDiscount);

        // Stats Option B
        document.getElementById('costB').textContent = fmtDec(result.effectiveEmiCost);
        document.getElementById('totalEmiVal').textContent = fmt(result.totalEmiPayment);
        document.getElementById('returnsVal').textContent = '+ ' + fmt(result.totalInterestEarned);
        document.getElementById('feesVal').textContent = '- ' + fmt(result.processingFee + result.gstCost);

        // Metrics
        document.getElementById('monthlyEmiMetric').textContent = fmt(result.monthlyEMI);
        document.getElementById('tenureMetric').textContent = `x ${this.state.tenure} mo`;
        document.getElementById('interestMetric').textContent = fmt(result.totalInterestEarned);
        document.getElementById('processMetric').textContent = fmt(this.state.processingFee);
        document.getElementById('gstMetric').textContent = fmt(result.gstCost);
    }
}
