/**
 * Converts a number to its Indian English word representation.
 * @param {number} num 
 * @returns {string}
 */
export const numToWords = (num) => {
    if (!num || isNaN(num)) return '';
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const inWords = (n) => {
        if ((n = n.toString()).length > 9) return 'Overflow';
        let n_array = ('000000000' + n).slice(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n_array) return;
        let str = '';
        str += (n_array[1] != 0) ? (a[Number(n_array[1])] || b[n_array[1][0]] + ' ' + a[n_array[1][1]]) + 'Crore ' : '';
        str += (n_array[2] != 0) ? (a[Number(n_array[2])] || b[n_array[2][0]] + ' ' + a[n_array[2][1]]) + 'Lakh ' : '';
        str += (n_array[3] != 0) ? (a[Number(n_array[3])] || b[n_array[3][0]] + ' ' + a[n_array[3][1]]) + 'Thousand ' : '';
        str += (n_array[4] != 0) ? (a[Number(n_array[4])] || b[n_array[4][0]] + ' ' + a[n_array[4][1]]) + 'Hundred ' : '';
        str += (n_array[5] != 0) ? ((str != '') ? '' : '') + (a[Number(n_array[5])] || b[n_array[5][0]] + ' ' + a[n_array[5][1]]) : '';
        return str.trim();
    };
    return inWords(num);
};

/**
 * Formats a number with Indian thousand separators.
 * @param {number|string} num 
 * @returns {string}
 */
export const formatNumber = (num) => {
    if (num === '' || isNaN(num)) return '';
    let x = num.toString();
    let lastThree = x.substring(x.length - 3);
    let otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers != '') lastThree = ',' + lastThree;
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
};

/**
 * Gets the raw numeric value from a formatted string.
 * @param {string|number} val 
 * @returns {number}
 */
export const getRawValue = (val) => {
    if (typeof val === 'number') return val;
    return parseFloat(val.toString().replace(/,/g, '')) || 0;
};

/**
 * Formats a number as INR currency.
 * @param {number} num 
 * @returns {string}
 */
export const formatCurrency = (num) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
}).format(num);

/**
 * Calculates Equated Monthly Installment (EMI).
 * @param {number} p - Principal
 * @param {number} r - Annual interest rate (%)
 * @param {number} n - Tenure in months
 * @returns {number}
 */
export const calculateEMI = (p, r, n) => {
    if (p <= 0) return 0;
    const rate = r / 1200;
    return (p * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
};

/**
 * Calculates Future Value of a Systematic Investment Plan (SIP).
 * @param {number} amt - Monthly investment amount
 * @param {number} r - Annual return rate (%)
 * @param {number} n - Tenure in months
 * @returns {number}
 */
export const fvSIP = (amt, r, n) => {
    if (r === 0) return amt * n;
    const i = r / 1200;
    return amt * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
};

/**
 * Calculates Future Value of a Lumpsum investment.
 * @param {number} amt - Initial investment amount
 * @param {number} r - Annual return rate (%)
 * @param {number} n_months - Tenure in months
 * @returns {number}
 */
export const fvLumpsum = (amt, r, n_months) => {
    const i = r / 1200;
    return amt * Math.pow(1 + i, n_months);
};
