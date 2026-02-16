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
        const { calculateEMI, fvSIP, fvLumpsum, formatCurrency, calculateLoanBalance } = App.math;

        // 1. Get Inputs
        const P = getRawValue(this.inputs.price.value);
        const C = getRawValue(this.inputs.totalCash.value);
        const B = getRawValue(this.inputs.buffer.value); // Investable Lumpsum for Strategy B

        const rLoan = parseFloat(this.inputs.loanRate.value) || 0;
        const rInv = parseFloat(this.inputs.sipRate.value) || 0;
        const rTax = parseFloat(this.inputs.taxRate.value) || 0;

        const km = parseFloat(this.inputs.monthlyKm.value) || 0;
        const mil = parseFloat(this.inputs.mileage.value) || 1;
        const fuelP = parseFloat(this.inputs.fuelPrice.value) || 0;
        const depRate = parseFloat(this.inputs.depreciation.value) || 0;

        const isFuelIncluded = this.elements.fuelToggle.checked;

        // 2. UI Toggle for fuel section
        if (isFuelIncluded) {
            this.elements.fuelContainer.classList.remove('disabled-section');
            if (this.elements.fuelNote) this.elements.fuelNote.style.display = 'block';
        } else {
            this.elements.fuelContainer.classList.add('disabled-section');
            if (this.elements.fuelNote) this.elements.fuelNote.style.display = 'none';
        }

        // 3. Shared Values
        const HORIZON = 84; // 7 years analysis period
        const monthlyFuel = isFuelIncluded ? (km / mil) * fuelP : 0;
        const carValueAt = (years) => P * Math.pow(1 - (depRate / 100), years);
        const carValue7 = carValueAt(7);
        const totalFuelHorizon = monthlyFuel * HORIZON;

        const fmt = (val) => formatCurrency(Math.round(val));
        const taxOnGains = (fv, principal) => {
            const gains = fv - principal;
            return gains > 0 ? gains * (rTax / 100) : 0;
        };

        if (this.elements.invRateDisplay) this.elements.invRateDisplay.innerText = rInv;

        // ========= STRATEGY A: DEBT HATER (5 Year Loan) =========
        const dpA = Math.min(C, P);
        const loanA = Math.max(0, P - dpA);
        const emiA = calculateEMI(loanA, rLoan, 60);
        const totalEmiPaidA = emiA * 60;
        const interestA = Math.max(0, totalEmiPaidA - loanA);
        const leftoverCashA = Math.max(0, C - dpA);

        const totalAssetsA = carValue7 + leftoverCashA;
        const totalOutgoA = C + totalEmiPaidA + totalFuelHorizon;
        const netCostA = totalOutgoA - totalAssetsA;

        // Update Strategy A UI
        this.elements.emiA.innerText = formatCurrency(emiA);
        this.elements.interestA.innerText = formatCurrency(interestA);
        this.elements.t_emiA.innerText = formatCurrency(emiA);
        this.elements.t_totalA.innerText = formatCurrency(emiA + monthlyFuel);

        if (this.elements.assetTotalA) this.elements.assetTotalA.innerText = fmt(totalAssetsA);
        if (this.elements.costDpA) this.elements.costDpA.innerText = fmt(dpA);
        if (this.elements.costEmiPaidA) this.elements.costEmiPaidA.innerText = fmt(totalEmiPaidA);
        if (this.elements.costIntA) this.elements.costIntA.innerText = fmt(interestA);
        if (this.elements.costNetA) this.elements.costNetA.innerText = fmt(netCostA);


        // ========= STRATEGY B: SMART INVESTOR (7 Year Loan) =========
        const dpB = Math.max(0, C - B);
        const loanB = Math.max(0, P - dpB);
        const emiB = calculateEMI(loanB, rLoan, 84);
        const totalEmiPaidB = emiB * 84;
        const interestB = Math.max(0, totalEmiPaidB - loanB);

        // SIP from surplus (assuming budget = emiA)
        const monthlySurplusB = Math.max(0, emiA - emiB);
        const fvSipB = fvSIP(monthlySurplusB, rInv, 84);
        const sipPrincipalB = monthlySurplusB * 84;
        const netSipB = fvSipB - taxOnGains(fvSipB, sipPrincipalB);

        // Investment from Buffer B
        const fvBufferB = fvLumpsum(B, rInv, 84);
        const netBufferB = fvBufferB - taxOnGains(fvBufferB, B);

        const totalInvestmentB = netBufferB + netSipB;
        const totalAssetsB = carValue7 + totalInvestmentB;
        const totalOutgoB = C + totalEmiPaidB + sipPrincipalB + totalFuelHorizon;
        const netCostB = totalOutgoB - totalAssetsB;

        // Update Strategy B UI
        this.elements.emiB.innerText = formatCurrency(emiB);
        this.elements.interestB.innerText = formatCurrency(interestB);
        this.elements.sipB_label.innerText = `Save ${formatCurrency(monthlySurplusB)}/mo`;
        this.elements.t_emiB.innerText = formatCurrency(emiB);
        this.elements.t_totalB.innerText = formatCurrency(emiB + monthlySurplusB + monthlyFuel);
        if (this.elements.invValueB) this.elements.invValueB.innerText = formatCurrency(totalInvestmentB);

        if (this.elements.assetInvB) this.elements.assetInvB.innerText = fmt(totalInvestmentB);
        if (this.elements.assetTotalB) this.elements.assetTotalB.innerText = fmt(totalAssetsB);
        if (this.elements.costDpB) this.elements.costDpB.innerText = fmt(dpB);
        if (this.elements.costEmiPaidB) this.elements.costEmiPaidB.innerText = fmt(totalEmiPaidB);
        if (this.elements.costIntB) this.elements.costIntB.innerText = fmt(interestB);
        if (this.elements.costNetB) this.elements.costNetB.innerText = fmt(netCostB);


        // ========= STRATEGY C: LATE BLOOMER (5 Yr Loan + 2 Yr SIP) =========
        const emiC = emiA;
        const sipPrincipalC = emiC * 24;
        const fvSipC = fvSIP(emiC, rInv, 24);
        const netSipC = fvSipC - taxOnGains(fvSipC, sipPrincipalC);

        const totalInvestmentC = netSipC;
        const totalAssetsC = carValue7 + leftoverCashA + totalInvestmentC;
        const totalOutgoC = C + totalEmiPaidA + sipPrincipalC + totalFuelHorizon;
        const netCostC = totalOutgoC - totalAssetsC;

        // Update Strategy C UI
        this.elements.emiC.innerText = formatCurrency(emiC);
        this.elements.interestC.innerText = formatCurrency(interestA);
        this.elements.t_emiC.innerText = formatCurrency(emiC);
        this.elements.t_totalC.innerText = formatCurrency(emiC + monthlyFuel);
        if (this.elements.invValueC) this.elements.invValueC.innerText = formatCurrency(totalInvestmentC);

        if (this.elements.assetInvC) this.elements.assetInvC.innerText = fmt(totalInvestmentC);
        if (this.elements.assetTotalC) this.elements.assetTotalC.innerText = fmt(totalAssetsC);
        if (this.elements.costDpC) this.elements.costDpC.innerText = fmt(dpA);
        if (this.elements.costEmiPaidC) this.elements.costEmiPaidC.innerText = fmt(totalEmiPaidA);
        if (this.elements.costIntC) this.elements.costIntC.innerText = fmt(interestA);
        if (this.elements.costNetC) this.elements.costNetC.innerText = fmt(netCostC);


        // ========= COMMON UI UPDATES =========
        this.elements.fuelVals.forEach(el => el.innerText = formatCurrency(monthlyFuel));
        this.elements.resaleVals.forEach(el => el.innerText = formatCurrency(carValue7));

        const inflationRate = 0.06;
        const purchasingPower = C / Math.pow(1 + inflationRate, 7);
        this.elements.inf_cash.innerText = formatCurrency(C);
        this.elements.inf_value.innerText = formatCurrency(purchasingPower);

        // Comparison Callout
        const savingsVsA = totalAssetsB - totalAssetsA;
        if (this.elements.savingsVsA) {
            this.elements.savingsVsA.innerText = formatCurrency(Math.abs(savingsVsA));
            if (this.elements.savingsVsALabel) {
                this.elements.savingsVsALabel.innerText = savingsVsA > 0 ? 'more in assets' : 'less in assets';
            }
        }

        const savingsVsC = totalAssetsB - totalAssetsC;
        if (this.elements.savingsVsC) {
            this.elements.savingsVsC.innerText = formatCurrency(Math.abs(savingsVsC));
            if (this.elements.savingsVsCLabel) {
                this.elements.savingsVsCLabel.innerText = savingsVsC > 0 ? 'more in assets' : 'less in assets';
            }
        }

        // ========= NET WORTH CHART DATA =========
        const calculateYearlyNetWorth = (strategy) => {
            const netWorth = [];
            netWorth.push(C); // Year 0: Net Worth is always starting cash

            for (let year = 1; year <= 7; year++) {
                const months = year * 12;
                const carVal = carValueAt(year);
                
                if (strategy === 'A') {
                    const loanBal = calculateLoanBalance(loanA, rLoan, 60, months);
                    netWorth.push(carVal + leftoverCashA - loanBal);
                } else if (strategy === 'B') {
                    const loanBal = calculateLoanBalance(loanB, rLoan, 84, months);
                    const inv = fvLumpsum(B, rInv, months) + fvSIP(monthlySurplusB, rInv, months);
                    const netInv = inv - taxOnGains(inv, B + monthlySurplusB * months);
                    netWorth.push(carVal + netInv - loanBal);
                } else if (strategy === 'C') {
                    const loanBal = calculateLoanBalance(loanA, rLoan, 60, months);
                    let netInv = 0;
                    if (months > 60) {
                        const sipVal = fvSIP(emiC, rInv, months - 60);
                        netInv = sipVal - taxOnGains(sipVal, emiC * (months - 60));
                    }
                    netWorth.push(carVal + leftoverCashA + netInv - loanBal);
                }
            }
            return netWorth;
        };

        const chartData = {
            strategyA: calculateYearlyNetWorth('A'),
            strategyB: calculateYearlyNetWorth('B'),
            strategyC: calculateYearlyNetWorth('C')
        };

        if (this.chart) {
            this.chart.render(chartData);
        }
    }

}
App.math = math;
