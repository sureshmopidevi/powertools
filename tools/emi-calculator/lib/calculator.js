export class EMICalculator {
    static calculate({ productPrice, tenure, processingFee, returnRate, foregoneDiscount, gstOnInterest, bankInterestRate }) {
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
            savingsPercentage
        };
    }
}
