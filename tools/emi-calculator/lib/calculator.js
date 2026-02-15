export class EMICalculator {
    static calculateForRate(params, returnRate) {
        return this.calculate({ ...params, returnRate }, false);
    }

    static calculate({ productPrice, tenure, processingFee, returnRate, foregoneDiscount, gstOnInterest, bankInterestRate }, includeBreakEven = true) {
        const upfrontCost = productPrice - foregoneDiscount;
        const monthlyEMI = productPrice / tenure;

        let balance = productPrice;
        let totalInterestEarned = 0;
        const monthlyReturnRate = returnRate / 100 / 12;

        for (let i = 0; i < tenure; i++) {
            const interest = balance * monthlyReturnRate;
            totalInterestEarned += interest;
            balance = balance + interest - monthlyEMI;
        }

        const estimatedBankInterest = (productPrice * (bankInterestRate / 100) * (tenure / 12)) * 0.55;
        const gstCost = gstOnInterest ? estimatedBankInterest * 0.18 : 0;
        const totalEmiPayment = (monthlyEMI * tenure) + processingFee + gstCost;
        const effectiveEmiCost = totalEmiPayment - totalInterestEarned;
        const savings = upfrontCost - effectiveEmiCost;
        const isEmiBetter = savings > 0;
        const savingsPercentage = (Math.abs(savings) / productPrice) * 100;
        const hiddenCostPercentage = (gstCost / productPrice) * 100;

        const breakEvenReturnRate = includeBreakEven
            ? this.findBreakEvenReturnRate({
                productPrice,
                tenure,
                processingFee,
                foregoneDiscount,
                gstOnInterest,
                bankInterestRate
            })
            : null;

        return {
            upfrontCost,
            monthlyEMI,
            totalEmiPayment,
            totalInterestEarned,
            processingFee,
            gstCost,
            effectiveEmiCost,
            savings,
            isEmiBetter,
            savingsPercentage,
            hiddenCostPercentage,
            breakEvenReturnRate
        };
    }

    static findBreakEvenReturnRate(baseParams) {
        const lowResult = this.calculateForRate(baseParams, 0);
        if (lowResult.savings <= 0) return 0;

        const highResult = this.calculateForRate(baseParams, 40);
        if (highResult.savings > 0) return null;

        let low = 0;
        let high = 40;
        for (let i = 0; i < 30; i++) {
            const mid = (low + high) / 2;
            const result = this.calculateForRate(baseParams, mid);
            if (result.savings > 0) {
                low = mid;
            } else {
                high = mid;
            }
        }
        return Number(high.toFixed(2));
    }
}
