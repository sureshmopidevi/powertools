const KG_PER_LB = 0.45359237;
const LB_PER_KG = 2.2046226218;
const METERS_PER_INCH = 0.0254;

const BMI_LIMITS = {
    underweight: 18.5,
    normal: 25.0,
    overweight: 30.0,
    obesityI: 35.0,
    obesityII: 40.0
};

const CATEGORY_LABELS = {
    underweight: 'Underweight',
    normal: 'Normal',
    overweight: 'Overweight',
    obesity_i: 'Obesity Class I',
    obesity_ii: 'Obesity Class II',
    obesity_iii: 'Obesity Class III'
};

function toNumber(value) {
    const num = Number(value);
    return Number.isFinite(num) ? num : NaN;
}

export function validateInput(input) {
    const errors = {};
    const unitSystem = input?.unitSystem === 'imperial' ? 'imperial' : 'metric';

    if (unitSystem === 'metric') {
        const heightCm = toNumber(input?.heightCm);
        const weightKg = toNumber(input?.weightKg);

        if (!Number.isFinite(heightCm)) {
            errors.heightCm = 'Enter height in cm.';
        } else if (heightCm < 90 || heightCm > 250) {
            errors.heightCm = 'Height must be between 90 and 250 cm.';
        }

        if (!Number.isFinite(weightKg)) {
            errors.weightKg = 'Enter weight in kg.';
        } else if (weightKg < 20 || weightKg > 300) {
            errors.weightKg = 'Weight must be between 20 and 300 kg.';
        }
    } else {
        const heightFt = toNumber(input?.heightFt);
        const heightIn = toNumber(input?.heightIn);
        const weightLb = toNumber(input?.weightLb);

        if (!Number.isFinite(heightFt)) {
            errors.heightFt = 'Enter height in feet.';
        } else if (heightFt < 0 || heightFt > 8) {
            errors.heightFt = 'Feet must be between 0 and 8.';
        }

        if (!Number.isFinite(heightIn)) {
            errors.heightIn = 'Enter inches.';
        } else if (heightIn < 0 || heightIn >= 12) {
            errors.heightIn = 'Inches must be between 0 and 11.9.';
        }

        if (!Number.isFinite(weightLb)) {
            errors.weightLb = 'Enter weight in pounds.';
        } else if (weightLb < 44 || weightLb > 660) {
            errors.weightLb = 'Weight must be between 44 and 660 lb.';
        }

        if (!errors.heightFt && !errors.heightIn) {
            const totalInches = (heightFt * 12) + heightIn;
            if (totalInches < 36 || totalInches > 96) {
                const msg = 'Total height must be between 36 and 96 inches.';
                errors.heightFt = msg;
                errors.heightIn = msg;
            }
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

export function getBMICategory(bmi) {
    if (bmi < BMI_LIMITS.underweight) return 'underweight';
    if (bmi < BMI_LIMITS.normal) return 'normal';
    if (bmi < BMI_LIMITS.overweight) return 'overweight';
    if (bmi < BMI_LIMITS.obesityI) return 'obesity_i';
    if (bmi < BMI_LIMITS.obesityII) return 'obesity_ii';
    return 'obesity_iii';
}

export function getHealthyWeightRange(heightMeters, unitSystem) {
    const minKg = 18.5 * heightMeters * heightMeters;
    const maxKg = 24.9 * heightMeters * heightMeters;

    if (unitSystem === 'imperial') {
        const minLb = minKg * LB_PER_KG;
        const maxLb = maxKg * LB_PER_KG;
        return {
            minLb: Number(minLb.toFixed(1)),
            maxLb: Number(maxLb.toFixed(1)),
            label: `${minLb.toFixed(1)} lb - ${maxLb.toFixed(1)} lb`
        };
    }

    return {
        minKg: Number(minKg.toFixed(1)),
        maxKg: Number(maxKg.toFixed(1)),
        label: `${minKg.toFixed(1)} kg - ${maxKg.toFixed(1)} kg`
    };
}

export function calculateBMI(input) {
    const validation = validateInput(input);
    if (!validation.isValid) {
        return {
            bmi: null,
            categoryKey: null,
            categoryLabel: null,
            healthyRange: null,
            normalizedInput: null,
            timestamp: new Date().toISOString()
        };
    }

    const unitSystem = input.unitSystem === 'imperial' ? 'imperial' : 'metric';

    let heightMeters = 0;
    let weightKg = 0;
    let heightCm = null;
    let totalInches = null;
    let weightLb = null;

    if (unitSystem === 'metric') {
        heightCm = toNumber(input.heightCm);
        heightMeters = heightCm / 100;
        weightKg = toNumber(input.weightKg);
        weightLb = weightKg * LB_PER_KG;
    } else {
        const heightFt = toNumber(input.heightFt);
        const heightIn = toNumber(input.heightIn);
        totalInches = (heightFt * 12) + heightIn;
        heightMeters = totalInches * METERS_PER_INCH;
        weightLb = toNumber(input.weightLb);
        weightKg = weightLb * KG_PER_LB;
        heightCm = heightMeters * 100;
    }

    const rawBMI = weightKg / (heightMeters * heightMeters);
    const categoryKey = getBMICategory(rawBMI);
    const healthyRange = getHealthyWeightRange(heightMeters, unitSystem);

    return {
        bmi: Number(rawBMI.toFixed(1)),
        categoryKey,
        categoryLabel: CATEGORY_LABELS[categoryKey],
        healthyRange,
        normalizedInput: {
            unitSystem,
            heightMeters: Number(heightMeters.toFixed(4)),
            heightCm: Number(heightCm.toFixed(1)),
            totalInches: totalInches !== null ? Number(totalInches.toFixed(1)) : null,
            weightKg: Number(weightKg.toFixed(2)),
            weightLb: Number(weightLb.toFixed(2))
        },
        timestamp: new Date().toISOString()
    };
}
