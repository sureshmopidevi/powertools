import { ChartRenderer } from '../utils/chartRenderer.js';
import * as math from '../utils/math.js';
import { formatNumber, getRawValue, numToWords } from '../utils/math.js';

export class App {
    constructor() {
        this.initElements();
        this.initEventListeners();
        this.initChart();
        this.update();
    }

    // Default values for reset functionality
    static DEFAULT_VALUES = {
        carPrice: '22,81,000',
        totalCash: '5,00,000',
        bufferCash: '1,00,000',
        loanRate: '9.0',
        sipRate: '13.0',
        taxRate: '12.5',
        monthlyKm: '1000',
        mileage: '15',
        fuelPrice: '100',
        depreciation: '15',
        includeFuel: true
    };

    initElements() {
        this.inputs = {
            price: document.getElementById('carPrice'),
            totalCash: document.getElementById('totalCash'),
            buffer: document.getElementById('bufferCash'),
            loanRate: document.getElementById('loanRate'),
            sipRate: document.getElementById('sipRate'),
            taxRate: document.getElementById('taxRate'),
            monthlyKm: document.getElementById('monthlyKm'),
            mileage: document.getElementById('mileage'),
            fuelPrice: document.getElementById('fuelPrice'),
            depreciation: document.getElementById('depreciation')
        };

        this.helpers = {
            price: document.getElementById('carPriceWords'),
            totalCash: document.getElementById('totalCashWords'),
            buffer: document.getElementById('bufferCashWords')
        };

        this.elements = {
            fuelToggle: document.getElementById('includeFuel'),
            fuelContainer: document.getElementById('fuelInputsContainer'),
            fuelNote: document.getElementById('fuelNote'),

            emiA: document.getElementById('emiA'),
            interestA: document.getElementById('interestA'),
            t_emiA: document.getElementById('t_emiA'),
            t_totalA: document.getElementById('t_totalA'),

            emiB: document.getElementById('emiB'),
            interestB: document.getElementById('interestB'),
            sipB_label: document.getElementById('sipB_label'),
            t_emiB: document.getElementById('t_emiB'),
            t_totalB: document.getElementById('t_totalB'),
            invValueB: document.getElementById('invValueB'),

            emiC: document.getElementById('emiC'),
            interestC: document.getElementById('interestC'),
            t_emiC: document.getElementById('t_emiC'),
            t_totalC: document.getElementById('t_totalC'),
            invValueC: document.getElementById('invValueC'),

            // Asset Growth Table
            invRateDisplay: document.getElementById('invRateDisplay'),
            assetTotalA: document.getElementById('assetTotalA'),
            assetTotalB: document.getElementById('assetTotalB'),
            assetInvB: document.getElementById('assetInvB'),
            assetTotalC: document.getElementById('assetTotalC'),
            assetInvC: document.getElementById('assetInvC'),

            // Cost Table (Expanded)
            costDpA: document.getElementById('costDpA'),
            costEmiPaidA: document.getElementById('costEmiPaidA'),
            costIntA: document.getElementById('costIntA'),
            costNetA: document.getElementById('costNetA'),

            costDpB: document.getElementById('costDpB'),
            costEmiPaidB: document.getElementById('costEmiPaidB'),
            costIntB: document.getElementById('costIntB'),
            costNetB: document.getElementById('costNetB'),

            costDpC: document.getElementById('costDpC'),
            costEmiPaidC: document.getElementById('costEmiPaidC'),
            costIntC: document.getElementById('costIntC'),
            costNetC: document.getElementById('costNetC'),

            fuelVals: document.querySelectorAll('.fuel-val'),
            resaleVals: document.querySelectorAll('.resale-val'),

            // Comparison Callout
            savingsVsA: document.getElementById('savingsVsA'),
            savingsVsALabel: document.getElementById('savingsVsALabel'),
            savingsVsC: document.getElementById('savingsVsC'),
            savingsVsCLabel: document.getElementById('savingsVsCLabel'),

            inf_cash: document.getElementById('inf_cash'),
            inf_value: document.getElementById('inf_value')
        };
    }

    initEventListeners() {
        const setupCurrencyInput = (inputId, helperId) => {
            const input = document.getElementById(inputId);
            const helper = document.getElementById(helperId);
            input.addEventListener('focus', (e) => {
                let val = getRawValue(e.target.value);
                if (val === 0) e.target.value = '';
                else e.target.value = val;
            });
            input.addEventListener('blur', (e) => {
                let val = getRawValue(e.target.value);
                if (val === 0 && e.target.value === '') e.target.value = "0";
                else e.target.value = formatNumber(val);
            });
            input.addEventListener('input', (e) => {
                let val = getRawValue(e.target.value);
                if (helper) helper.innerText = numToWords(val);
                this.update();
            });
        };

        setupCurrencyInput('carPrice', 'carPriceWords');
        setupCurrencyInput('totalCash', 'totalCashWords');
        setupCurrencyInput('bufferCash', 'bufferCashWords');

        // Auto-calculate Investable Lumpsum (Buffer) when Price or Total Cash changes
        const autoUpdateBuffer = () => {
            const P = getRawValue(this.inputs.price.value);
            const C = getRawValue(this.inputs.totalCash.value);

            // Rule: Min Down Payment = 15% of Car Price
            const minDownPayment = Math.round(P * 0.15);
            const suggestedBuffer = Math.max(0, C - minDownPayment);

            this.inputs.buffer.value = formatNumber(suggestedBuffer);
            if (this.helpers.buffer) this.helpers.buffer.innerText = numToWords(suggestedBuffer);

            this.update();
        };

        this.inputs.price.addEventListener('input', autoUpdateBuffer);
        this.inputs.totalCash.addEventListener('input', autoUpdateBuffer);

        const numericInputs = [
            'loanRate', 'sipRate', 'taxRate', 'monthlyKm',
            'mileage', 'fuelPrice', 'depreciation'
        ];

        numericInputs.forEach(id => {
            this.inputs[id.replace('Rate', '')]?.addEventListener('input', () => this.update());
            document.getElementById(id)?.addEventListener('input', () => this.update());
        });

        this.elements.fuelToggle.addEventListener('change', () => this.update());

        // Reset button
        const resetButton = document.getElementById('resetButton');
        if (resetButton) {
            resetButton.addEventListener('click', () => this.resetToDefaults());
        }
    }

    resetToDefaults() {
        const defaults = App.DEFAULT_VALUES;

        // Set currency inputs
        this.inputs.price.value = defaults.carPrice;
        this.inputs.totalCash.value = defaults.totalCash;
        this.inputs.buffer.value = defaults.bufferCash;

        // Set numeric inputs
        this.inputs.loanRate.value = defaults.loanRate;
        this.inputs.sipRate.value = defaults.sipRate;
        this.inputs.taxRate.value = defaults.taxRate;
        this.inputs.monthlyKm.value = defaults.monthlyKm;
        this.inputs.mileage.value = defaults.mileage;
        this.inputs.fuelPrice.value = defaults.fuelPrice;
        this.inputs.depreciation.value = defaults.depreciation;

        // Set fuel toggle
        this.elements.fuelToggle.checked = defaults.includeFuel;

        // Update word helpers
        if (this.helpers.price) this.helpers.price.innerText = numToWords(getRawValue(defaults.carPrice));
        if (this.helpers.totalCash) this.helpers.totalCash.innerText = numToWords(getRawValue(defaults.totalCash));
        if (this.helpers.buffer) this.helpers.buffer.innerText = numToWords(getRawValue(defaults.bufferCash));

        // Trigger update
        this.update();
    }

    initChart() {
        // Initialize chart renderer synchronously to avoid race condition
        this.chart = new ChartRenderer('netWorthCanvas');
    }

    update() {
        const { calculateEMI, fvSIP, fvLumpsum, formatCurrency } = App.math;

        // Get values
        const P = getRawValue(this.inputs.price.value);
        const C = getRawValue(this.inputs.totalCash.value);
        const B = getRawValue(this.inputs.buffer.value); // Investable Lumpsum

        const rLoan = parseFloat(this.inputs.loanRate.value) || 0;
        const rInv = parseFloat(this.inputs.sipRate.value) || 0;
        const rTax = parseFloat(this.inputs.taxRate.value) || 0;

        const km = parseFloat(this.inputs.monthlyKm.value) || 0;
        const mil = parseFloat(this.inputs.mileage.value) || 1;
        const fuelP = parseFloat(this.inputs.fuelPrice.value) || 0;
        const depRate = parseFloat(this.inputs.depreciation.value) || 0;

        const isFuelIncluded = this.elements.fuelToggle.checked;

        // UI Toggle for fuel section - but keep display
        if (isFuelIncluded) {
            this.elements.fuelContainer.classList.remove('disabled-section');
            if (this.elements.fuelNote) this.elements.fuelNote.style.display = 'block';
        } else {
            this.elements.fuelContainer.classList.add('disabled-section');
            if (this.elements.fuelNote) this.elements.fuelNote.style.display = 'none';
        }

        // Monthly fuel cost: ₹0 if toggle is off
        const monthlyFuel = isFuelIncluded ? (km / mil) * fuelP : 0;
        const carValue7 = P * Math.pow(1 - (depRate / 100), 7);

        // Helpers
        const fmt = (val) => formatCurrency(Math.round(val));

        // Update investment rate display
        if (this.elements.invRateDisplay) this.elements.invRateDisplay.innerText = rInv;

        // ========= SCENARIO A: DEBT HATER =========
        // Uses all cash as down payment. No investments. 5-year loan.
        const dpA = C;
        const loanA = Math.max(0, P - dpA);
        const emiA = calculateEMI(loanA, rLoan, 60); // 5 years
        const totalEmiPaidA = emiA * 60;
        const interestA = Math.max(0, totalEmiPaidA - loanA);

        // Assets: Only car (no investments)
        const investmentA = 0;
        const totalAssetsA = carValue7 + investmentA;

        // Costs: DP (capped at car price) + Total EMI Paid
        const effectiveDpA = Math.min(dpA, P);
        const totalCashPaidA = effectiveDpA + totalEmiPaidA;
        const netCostA = totalCashPaidA - totalAssetsA;

        // Update UI - Strategy Cards
        this.elements.emiA.innerText = formatCurrency(emiA);
        this.elements.interestA.innerText = formatCurrency(interestA);
        this.elements.t_emiA.innerText = formatCurrency(emiA);
        this.elements.t_totalA.innerText = formatCurrency(emiA + monthlyFuel);

        // Update Tables
        if (this.elements.assetTotalA) this.elements.assetTotalA.innerText = fmt(totalAssetsA);
        if (this.elements.costDpA) this.elements.costDpA.innerText = fmt(effectiveDpA);
        if (this.elements.costEmiPaidA) this.elements.costEmiPaidA.innerText = fmt(totalEmiPaidA);
        if (this.elements.costIntA) this.elements.costIntA.innerText = fmt(interestA);
        if (this.elements.costNetA) this.elements.costNetA.innerText = fmt(netCostA);


        // ========= SCENARIO B: SMART INVESTOR =========
        // Puts min DP, invests the rest. 7-year loan.
        const dpB = Math.max(0, C - B); // DP = Total Cash - Buffer (what's kept for investment)
        const loanB = Math.max(0, P - dpB);
        const emiB = calculateEMI(loanB, rLoan, 84); // 7 years
        const totalEmiPaidB = emiB * 84;
        const interestB = Math.max(0, totalEmiPaidB - loanB);

        // Investment 1: Lumpsum 'B' grown for 7 years
        const fvBuffer = fvLumpsum(B, rInv, 84);
        const taxOnBuffer = (fvBuffer - B) > 0 ? (fvBuffer - B) * (rTax / 100) : 0;
        const netBuffer = fvBuffer - taxOnBuffer;

        // Investment 2: SIP from monthly savings (difference between A's EMI and B's EMI)
        const monthlySurplus = Math.max(0, emiA - emiB);
        const fvSipVal = fvSIP(monthlySurplus, rInv, 84);
        const sipPrincipal = monthlySurplus * 84;
        const taxOnSip = (fvSipVal - sipPrincipal) > 0 ? (fvSipVal - sipPrincipal) * (rTax / 100) : 0;
        const netSip = fvSipVal - taxOnSip;

        const totalInvestmentB = netBuffer + netSip;
        const totalAssetsB = carValue7 + totalInvestmentB;

        // Costs: DP + Total EMI + Buffer (invested)
        // Net Cost = Total Paid - Total Assets
        const totalCashPaidB = dpB + totalEmiPaidB + B;
        const netCostB = totalCashPaidB - totalAssetsB;

        // Investment returns for card display
        const investmentGainsB = totalInvestmentB - B;

        // Update UI - Strategy Cards
        this.elements.emiB.innerText = formatCurrency(emiB);
        this.elements.interestB.innerText = formatCurrency(interestB);
        this.elements.sipB_label.innerText = `Save ${formatCurrency(monthlySurplus)}/mo`;
        this.elements.t_emiB.innerText = formatCurrency(emiB);
        this.elements.t_totalB.innerText = formatCurrency(emiB + monthlyFuel);
        if (this.elements.invValueB) this.elements.invValueB.innerText = formatCurrency(investmentGainsB);

        // Update Tables
        if (this.elements.assetInvB) this.elements.assetInvB.innerText = fmt(totalInvestmentB);
        if (this.elements.assetTotalB) this.elements.assetTotalB.innerText = fmt(totalAssetsB);
        if (this.elements.costDpB) this.elements.costDpB.innerText = fmt(dpB);
        if (this.elements.costEmiPaidB) this.elements.costEmiPaidB.innerText = fmt(totalEmiPaidB);
        if (this.elements.costIntB) this.elements.costIntB.innerText = fmt(interestB);
        if (this.elements.costNetB) this.elements.costNetB.innerText = fmt(netCostB);


        // ========= SCENARIO C: LATE BLOOMER =========
        // Buy car now (same as Strategy A - 5 year loan)
        // After loan ends (year 5), invest aggressively for years 6-7
        // Timeline: Months 1-60 = Pay EMI, Months 61-84 = Invest EMI amount as SIP
        const emiC = emiA;
        const interestC = interestA;

        // Investment: SIP of emiA for 24 months (years 6-7, AFTER loan ends)
        // Investment only grows for 24 months since it starts at month 61
        const fvInvC = fvSIP(emiC, rInv, 24); // 24 months SIP starting after loan
        const sipPrincipalC = emiC * 24;
        const taxOnInvC = (fvInvC - sipPrincipalC) > 0 ? (fvInvC - sipPrincipalC) * (rTax / 100) : 0;
        const totalInvestmentC = fvInvC - taxOnInvC;

        const totalAssetsC = carValue7 + totalInvestmentC;

        // Costs: Same as A (DP + EMI for 60mo) + Post-loan SIP contributions (24mo)
        const totalCashPaidC = totalCashPaidA + sipPrincipalC;
        const netCostC = totalCashPaidC - totalAssetsC;

        const investmentGainsC = totalInvestmentC;

        // Update UI - Strategy Cards
        this.elements.emiC.innerText = formatCurrency(emiC);
        this.elements.interestC.innerText = formatCurrency(interestC);
        this.elements.t_emiC.innerText = formatCurrency(emiC);
        this.elements.t_totalC.innerText = formatCurrency(emiC + monthlyFuel);
        if (this.elements.invValueC) this.elements.invValueC.innerText = formatCurrency(investmentGainsC);

        // Update Tables
        if (this.elements.assetInvC) this.elements.assetInvC.innerText = fmt(totalInvestmentC);
        if (this.elements.assetTotalC) this.elements.assetTotalC.innerText = fmt(totalAssetsC);
        if (this.elements.costDpC) this.elements.costDpC.innerText = fmt(effectiveDpA); // Same DP as A
        if (this.elements.costEmiPaidC) this.elements.costEmiPaidC.innerText = fmt(totalEmiPaidA + sipPrincipalC);
        if (this.elements.costIntC) this.elements.costIntC.innerText = fmt(interestA);
        if (this.elements.costNetC) this.elements.costNetC.innerText = fmt(netCostC);


        // ========= COMMON UPDATES =========
        // Fuel values - always show (₹0 if disabled)
        this.elements.fuelVals.forEach(el => el.innerText = formatCurrency(monthlyFuel));
        this.elements.resaleVals.forEach(el => el.innerText = formatCurrency(carValue7));

        // Inflation section
        const inflationRate = 0.06;
        const purchasingPower = C / Math.pow(1 + inflationRate, 7);
        this.elements.inf_cash.innerText = formatCurrency(C);
        this.elements.inf_value.innerText = formatCurrency(purchasingPower);

        // ========= COMPARISON CALLOUT =========
        // Smart Investor vs Debt Hater
        const savingsVsA = totalAssetsB - totalAssetsA;
        if (this.elements.savingsVsA) {
            this.elements.savingsVsA.innerText = formatCurrency(Math.abs(savingsVsA));
            if (this.elements.savingsVsALabel) {
                this.elements.savingsVsALabel.innerText = savingsVsA > 0 ? 'more in assets' : 'less in assets';
            }
        }

        // Smart Investor vs Late Bloomer
        const savingsVsC = totalAssetsB - totalAssetsC;
        if (this.elements.savingsVsC) {
            this.elements.savingsVsC.innerText = formatCurrency(Math.abs(savingsVsC));
            if (this.elements.savingsVsCLabel) {
                this.elements.savingsVsCLabel.innerText = savingsVsC > 0 ? 'more in assets' : 'less in assets';
            }
        }

        // ========= NET WORTH CHART DATA =========
        // Calculate year-by-year net worth for all strategies
        const calculateYearlyNetWorth = (strategy) => {
            const netWorth = [];

            if (strategy === 'A') {
                // Debt Hater: No investments, just car depreciation
                // Year 0: Just bought the car
                netWorth.push(P);

                for (let year = 1; year <= 7; year++) {
                    const carValue = P * Math.pow(1 - depRate / 100, year);
                    netWorth.push(carValue);
                }
            } else if (strategy === 'B') {
                // Smart Investor: Lumpsum + SIP for 7 years + car depreciation
                // Year 0: Car + Buffer investment
                netWorth.push(P + B);

                for (let year = 1; year <= 7; year++) {
                    const carValue = P * Math.pow(1 - depRate / 100, year);

                    // Lumpsum growth
                    const lumpsum = fvLumpsum(B, rInv, year * 12);
                    const lumpsumGains = Math.max(0, lumpsum - B);
                    const taxOnLumpsum = lumpsumGains * (rTax / 100);
                    const netLumpsum = lumpsum - taxOnLumpsum;

                    // SIP growth
                    const sipValue = fvSIP(monthlySurplus, rInv, year * 12);
                    const sipPrincipal = monthlySurplus * year * 12;
                    const sipGains = Math.max(0, sipValue - sipPrincipal);
                    const taxOnSip = sipGains * (rTax / 100);
                    const netSip = sipValue - taxOnSip;

                    netWorth.push(carValue + netLumpsum + netSip);
                }
            } else if (strategy === 'C') {
                // Late Bloomer: SIP only in years 6-7
                // Year 0: Just bought the car (same as A)
                netWorth.push(P);

                for (let year = 1; year <= 7; year++) {
                    const carValue = P * Math.pow(1 - depRate / 100, year);
                    if (year <= 5) {
                        netWorth.push(carValue);
                    } else {
                        const sipMonths = (year - 5) * 12;
                        const sipValue = fvSIP(emiC, rInv, sipMonths);
                        const sipPrincipal = emiC * sipMonths;
                        const sipGains = Math.max(0, sipValue - sipPrincipal);
                        const taxOnSip = sipGains * (rTax / 100);
                        const netInvestment = sipValue - taxOnSip;
                        netWorth.push(carValue + netInvestment);
                    }
                }
            }

            return netWorth;
        };

        const chartData = {
            strategyA: calculateYearlyNetWorth('A'),
            strategyB: calculateYearlyNetWorth('B'),
            strategyC: calculateYearlyNetWorth('C')
        };

        // Render chart if initialized
        if (this.chart) {
            this.chart.render(chartData);
        }
    }
}
App.math = math;
