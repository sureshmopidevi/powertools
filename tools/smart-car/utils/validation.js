/**
 * Input validation utilities for car financing calculator
 */

export const VALIDATION_RULES = {
    carPrice: { min: 100000, max: 20000000, label: 'Car Price' },
    totalCash: { min: 0, max: 20000000, label: 'Total Cash Available' },
    buffer: { min: 0, max: 20000000, label: 'Investable Lumpsum' },
    loanRate: { min: 0, max: 30, label: 'Loan Interest Rate' },
    sipRate: { min: 0, max: 50, label: 'SIP Returns' },
    taxRate: { min: 0, max: 50, label: 'Tax Rate' },
    monthlyKm: { min: 0, max: 10000, label: 'Monthly Kilometers' },
    mileage: { min: 1, max: 100, label: 'Mileage' },
    fuelPrice: { min: 0, max: 500, label: 'Fuel Price' },
    depreciation: { min: 0, max: 50, label: 'Depreciation Rate' }
};

/**
 * Validates a numeric value against min/max constraints
 */
export const validateNumber = (value, min, max, fieldName) => {
    const num = parseFloat(value);

    if (isNaN(num)) {
        return { valid: false, error: `${fieldName} must be a valid number` };
    }

    if (num < min) {
        return { valid: false, error: `${fieldName} must be at least ${formatValue(min)}` };
    }

    if (num > max) {
        return { valid: false, error: `${fieldName} cannot exceed ${formatValue(max)}` };
    }

    return { valid: true, error: null };
};

/**
 * Validates car price
 */
export const validateCarPrice = (price) => {
    const rules = VALIDATION_RULES.carPrice;
    return validateNumber(price, rules.min, rules.max, rules.label);
};

/**
 * Validates down payment against car price and total cash
 */
export const validateDownPayment = (downPayment, carPrice, totalCash) => {
    const minDP = carPrice * 0.15; // Minimum 15% down payment

    if (downPayment < minDP) {
        return {
            valid: false,
            error: `Down payment must be at least 15% of car price (₹${Math.round(minDP).toLocaleString('en-IN')})`
        };
    }

    if (downPayment > totalCash) {
        return {
            valid: false,
            error: 'Down payment cannot exceed total cash available'
        };
    }

    if (downPayment > carPrice) {
        return {
            valid: false,
            error: 'Down payment cannot exceed car price'
        };
    }

    return { valid: true, error: null };
};

/**
 * Validates buffer (investable lumpsum) against total cash and down payment
 */
export const validateBuffer = (buffer, totalCash, carPrice) => {
    const minDP = carPrice * 0.15;
    const maxBuffer = Math.max(0, totalCash - minDP);

    if (buffer > maxBuffer) {
        return {
            valid: false,
            error: `Buffer cannot exceed ₹${Math.round(maxBuffer).toLocaleString('en-IN')} (Total Cash - Min Down Payment)`
        };
    }

    return { valid: true, error: null };
};

/**
 * Validates percentage values
 */
export const validatePercentage = (value, fieldName, min = 0, max = 100) => {
    return validateNumber(value, min, max, fieldName);
};

/**
 * Validates all inputs and returns validation state
 */
export const validateAllInputs = (inputs) => {
    const errors = {};
    let isValid = true;

    // Car Price
    const carPriceValidation = validateCarPrice(inputs.carPrice);
    if (!carPriceValidation.valid) {
        errors.carPrice = carPriceValidation.error;
        isValid = false;
    }

    // Total Cash
    const totalCashValidation = validateNumber(
        inputs.totalCash,
        VALIDATION_RULES.totalCash.min,
        VALIDATION_RULES.totalCash.max,
        VALIDATION_RULES.totalCash.label
    );
    if (!totalCashValidation.valid) {
        errors.totalCash = totalCashValidation.error;
        isValid = false;
    }

    // Down Payment (derived from totalCash - buffer)
    const downPayment = inputs.totalCash - inputs.buffer;
    const dpValidation = validateDownPayment(downPayment, inputs.carPrice, inputs.totalCash);
    if (!dpValidation.valid) {
        errors.buffer = dpValidation.error;
        isValid = false;
    }

    // Buffer
    const bufferValidation = validateBuffer(inputs.buffer, inputs.totalCash, inputs.carPrice);
    if (!bufferValidation.valid) {
        errors.buffer = bufferValidation.error;
        isValid = false;
    }

    // Rates
    const loanRateValidation = validatePercentage(inputs.loanRate, VALIDATION_RULES.loanRate.label, 0, 30);
    if (!loanRateValidation.valid) {
        errors.loanRate = loanRateValidation.error;
        isValid = false;
    }

    const sipRateValidation = validatePercentage(inputs.sipRate, VALIDATION_RULES.sipRate.label, 0, 50);
    if (!sipRateValidation.valid) {
        errors.sipRate = sipRateValidation.error;
        isValid = false;
    }

    const taxRateValidation = validatePercentage(inputs.taxRate, VALIDATION_RULES.taxRate.label, 0, 50);
    if (!taxRateValidation.valid) {
        errors.taxRate = taxRateValidation.error;
        isValid = false;
    }

    const depreciationValidation = validatePercentage(inputs.depreciation, VALIDATION_RULES.depreciation.label, 0, 50);
    if (!depreciationValidation.valid) {
        errors.depreciation = depreciationValidation.error;
        isValid = false;
    }

    // Fuel-related (if enabled)
    if (inputs.fuelEnabled) {
        const monthlyKmValidation = validateNumber(
            inputs.monthlyKm,
            VALIDATION_RULES.monthlyKm.min,
            VALIDATION_RULES.monthlyKm.max,
            VALIDATION_RULES.monthlyKm.label
        );
        if (!monthlyKmValidation.valid) {
            errors.monthlyKm = monthlyKmValidation.error;
            isValid = false;
        }

        const mileageValidation = validateNumber(
            inputs.mileage,
            VALIDATION_RULES.mileage.min,
            VALIDATION_RULES.mileage.max,
            VALIDATION_RULES.mileage.label
        );
        if (!mileageValidation.valid) {
            errors.mileage = mileageValidation.error;
            isValid = false;
        }

        const fuelPriceValidation = validateNumber(
            inputs.fuelPrice,
            VALIDATION_RULES.fuelPrice.min,
            VALIDATION_RULES.fuelPrice.max,
            VALIDATION_RULES.fuelPrice.label
        );
        if (!fuelPriceValidation.valid) {
            errors.fuelPrice = fuelPriceValidation.error;
            isValid = false;
        }
    }

    return { isValid, errors };
};

/**
 * Helper to format values for error messages
 */
const formatValue = (value) => {
    if (value >= 100000) {
        return `₹${(value / 100000).toFixed(1)}L`;
    }
    return value.toLocaleString('en-IN');
};
