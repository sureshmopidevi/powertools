import * as math from '../utils/math.js';
import { formatNumber, getRawValue, numToWords } from '../utils/math.js';

export class App {
    constructor() {
        this.initElements();
        this.initEventListeners();
        this.update();
    }

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
            fuelCols: document.querySelectorAll('.fuel-col'),
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

            emiC: document.getElementById('emiC'),
            interestC: document.getElementById('interestC'),
            t_emiC: document.getElementById('t_emiC'),
            t_totalC: document.getElementById('t_totalC'),

            nwA: document.getElementById('nwA'),
            nwB: document.getElementById('nwB'),
            invB: document.getElementById('invB'),
            nwC: document.getElementById('nwC'),
            invC: document.getElementById('invC'),

            fuelVals: document.querySelectorAll('.fuel-val'),
            resaleVals: document.querySelectorAll('.resale-val'),

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

        const numericInputs = [
            'loanRate', 'sipRate', 'taxRate', 'monthlyKm',
            'mileage', 'fuelPrice', 'depreciation'
        ];

        numericInputs.forEach(id => {
            this.inputs[id.replace('Rate', '')]?.addEventListener('input', () => this.update());
            // Fallback for direct IDs
            document.getElementById(id)?.addEventListener('input', () => this.update());
        });

        this.elements.fuelToggle.addEventListener('change', () => this.update());
    }

    update() {
        const { calculateEMI, fvSIP, fvLumpsum, formatCurrency } = App.math;

        // Get values
        const P = getRawValue(this.inputs.price.value);
        const C = getRawValue(this.inputs.totalCash.value);
        const B = getRawValue(this.inputs.buffer.value);

        const rLoan = parseFloat(this.inputs.loanRate.value) || 0;
        const rInv = parseFloat(this.inputs.sipRate.value) || 0;
        const rTax = parseFloat(this.inputs.taxRate.value) || 0;

        const km = parseFloat(this.inputs.monthlyKm.value) || 0;
        const mil = parseFloat(this.inputs.mileage.value) || 1;
        const fuelP = parseFloat(this.inputs.fuelPrice.value) || 0;
        const depRate = parseFloat(this.inputs.depreciation.value) || 0;

        const isFuelIncluded = this.elements.fuelToggle.checked;

        // UI Toggle
        if (isFuelIncluded) {
            this.elements.fuelContainer.classList.remove('disabled-section');
            this.elements.fuelCols.forEach(el => el.style.display = 'table-cell');
            this.elements.fuelNote.style.display = 'block';
        } else {
            this.elements.fuelContainer.classList.add('disabled-section');
            this.elements.fuelCols.forEach(el => el.style.display = 'none');
            this.elements.fuelNote.style.display = 'none';
        }

        const monthlyFuel = isFuelIncluded ? (km / mil) * fuelP : 0;
        const carValue7 = P * Math.pow(1 - (depRate / 100), 7);

        // Scenario A
        const dpA = C;
        const loanA = Math.max(0, P - dpA);
        const emiA = calculateEMI(loanA, rLoan, 60);
        const totalPaidA = emiA * 60;
        const interestA = Math.max(0, totalPaidA - loanA);
        const nwA = carValue7;

        this.elements.emiA.innerText = formatCurrency(emiA);
        this.elements.interestA.innerText = formatCurrency(interestA);
        this.elements.t_emiA.innerText = formatCurrency(emiA);
        this.elements.t_totalA.innerText = formatCurrency(emiA + monthlyFuel);

        // Scenario B
        const dpB = Math.max(0, C - B);
        const loanB = Math.max(0, P - dpB);
        const emiB = calculateEMI(loanB, rLoan, 84);
        const totalPaidB = emiB * 84;
        const interestB = Math.max(0, totalPaidB - loanB);

        const fvBuffer = fvLumpsum(B, rInv, 84);
        const netBuffer = fvBuffer - (fvBuffer - B > 0 ? (fvBuffer - B) * (rTax / 100) : 0);

        const monthlySurplus = Math.max(0, emiA - emiB);
        const fvSip = fvSIP(monthlySurplus, rInv, 84);
        const netSip = fvSip - (fvSip - (monthlySurplus * 84) > 0 ? (fvSip - (monthlySurplus * 84)) * (rTax / 100) : 0);

        const totalLiquidCashB = netBuffer + netSip;
        const nwB = carValue7 + totalLiquidCashB;

        this.elements.emiB.innerText = formatCurrency(emiB);
        this.elements.interestB.innerText = formatCurrency(interestB);
        this.elements.sipB_label.innerText = `Save ${formatCurrency(monthlySurplus)}/mo`;
        this.elements.t_emiB.innerText = formatCurrency(emiB);
        this.elements.t_totalB.innerText = formatCurrency(emiB + monthlyFuel);

        // Scenario C
        const emiC = emiA;
        const interestC = interestA;
        const fvC = fvSIP(emiC, rInv, 24);
        const finalCashC = fvC - (fvC - (emiC * 24) > 0 ? (fvC - (emiC * 24)) * (rTax / 100) : 0);
        const nwC = carValue7 + finalCashC;

        this.elements.emiC.innerText = formatCurrency(emiC);
        this.elements.interestC.innerText = formatCurrency(interestC);
        this.elements.t_emiC.innerText = formatCurrency(emiC);
        this.elements.t_totalC.innerText = formatCurrency(emiC + monthlyFuel);

        // Final Updates
        this.elements.nwA.innerText = formatCurrency(nwA);
        this.elements.nwB.innerText = formatCurrency(nwB);
        this.elements.invB.innerText = formatCurrency(totalLiquidCashB);
        this.elements.nwC.innerText = formatCurrency(nwC);
        this.elements.invC.innerText = formatCurrency(finalCashC);

        this.elements.fuelVals.forEach(el => el.innerText = formatCurrency(monthlyFuel));
        this.elements.resaleVals.forEach(el => el.innerText = formatCurrency(carValue7));

        const inflationRate = 0.06;
        const purchasingPower = C / Math.pow(1 + inflationRate, 7);
        this.elements.inf_cash.innerText = formatCurrency(C);
        this.elements.inf_value.innerText = formatCurrency(purchasingPower);
    }
}
App.math = math;
