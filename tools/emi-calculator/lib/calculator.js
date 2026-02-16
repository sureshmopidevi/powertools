export class EMICalculator {
    static calculateForRate(params, returnRate) {
        return this.calculate({ ...params, returnRate }, false);
    }

    static calculate(input, includeBreakEven = true) {
        const params = this.normalizeInput(input);

        const upfrontCost = Math.max(params.productPrice - params.upfrontDiscount, 0);
        const financedAmount = Math.max(params.productPrice - params.emiDiscount - params.downPayment, 0);
        const monthlyRate = params.bankInterestRate / 100 / 12;

        const charge = this.computeEmiCharges({
            strategy: params.emiStrategy,
            principal: financedAmount,
            tenure: params.tenure,
            monthlyRate,
            subventionShare: params.subventionShare
        });

        const gstCost = params.gstOnInterest ? charge.customerInterest * 0.18 : 0;
        const totalEmiPaymentsExcludingUpfront = charge.customerPrincipalAndInterest + gstCost;
        const monthlyOutflow = params.tenure > 0 ? totalEmiPaymentsExcludingUpfront / params.tenure : 0;

        const totalInterestEarned = this.simulateOpportunityReturns({
            upfrontCost,
            downPayment: params.downPayment,
            processingFee: params.processingFee,
            monthlyOutflow,
            tenure: params.tenure,
            annualReturnRate: params.returnRate
        });

        const totalEmiPayment = params.downPayment + charge.customerPrincipalAndInterest + params.processingFee + gstCost;
        const effectiveEmiCost = totalEmiPayment - totalInterestEarned;
        const savings = upfrontCost - effectiveEmiCost;
        const isEmiBetter = savings > 0;
        const savingsPercentage = params.productPrice > 0 ? (Math.abs(savings) / params.productPrice) * 100 : 0;
        const hiddenCostPercentage = params.productPrice > 0 ? ((params.processingFee + gstCost) / params.productPrice) * 100 : 0;

        const breakEvenReturnRate = includeBreakEven
            ? this.findBreakEvenReturnRate(params)
            : null;

        return {
            ...params,
            upfrontCost,
            financedAmount,
            monthlyEMI: charge.monthlyEmi,
            standardMonthlyEMI: charge.standardMonthlyEmi,
            totalInterestAccrued: charge.totalInterestAccrued,
            customerInterest: charge.customerInterest,
            interestSubsidy: charge.interestSubsidy,
            totalEmiPayment,
            totalInterestEarned,
            processingFee: params.processingFee,
            gstCost,
            effectiveEmiCost,
            savings,
            isEmiBetter,
            savingsPercentage,
            hiddenCostPercentage,
            breakEvenReturnRate,
            monthlyOutflow
        };
    }

    static normalizeInput(input) {
        return {
            productPrice: Math.max(Number(input.productPrice) || 0, 0),
            tenure: Math.max(Math.round(Number(input.tenure) || 0), 1),
            processingFee: Math.max(Number(input.processingFee) || 0, 0),
            returnRate: Number(input.returnRate) || 0,
            upfrontDiscount: Math.max(Number(input.upfrontDiscount ?? input.foregoneDiscount) || 0, 0),
            emiDiscount: Math.max(Number(input.emiDiscount) || 0, 0),
            gstOnInterest: Boolean(input.gstOnInterest),
            bankInterestRate: Math.max(Number(input.bankInterestRate) || 0, 0),
            emiStrategy: input.emiStrategy || 'no_cost_subvention',
            subventionShare: this.clamp(Number(input.subventionShare) || 100, 0, 100),
            downPayment: Math.max(Number(input.downPayment) || 0, 0)
        };
    }

    static computeEmiCharges({ strategy, principal, tenure, monthlyRate, subventionShare }) {
        const standard = this.reducingBalance(principal, tenure, monthlyRate);

        if (strategy === 'reducing_balance') {
            return {
                monthlyEmi: standard.monthlyEmi,
                standardMonthlyEmi: standard.monthlyEmi,
                totalInterestAccrued: standard.totalInterest,
                customerInterest: standard.totalInterest,
                interestSubsidy: 0,
                customerPrincipalAndInterest: principal + standard.totalInterest
            };
        }

        if (strategy === 'flat_rate') {
            const annualRate = monthlyRate * 12;
            const totalInterest = principal * annualRate * (tenure / 12);
            const monthlyEmi = (principal + totalInterest) / tenure;
            return {
                monthlyEmi,
                standardMonthlyEmi: monthlyEmi,
                totalInterestAccrued: totalInterest,
                customerInterest: totalInterest,
                interestSubsidy: 0,
                customerPrincipalAndInterest: principal + totalInterest
            };
        }

        const subsidy = standard.totalInterest * (subventionShare / 100);
        const customerInterest = Math.max(standard.totalInterest - subsidy, 0);
        const monthlyEmi = (principal + customerInterest) / tenure;

        return {
            monthlyEmi,
            standardMonthlyEmi: standard.monthlyEmi,
            totalInterestAccrued: standard.totalInterest,
            customerInterest,
            interestSubsidy: subsidy,
            customerPrincipalAndInterest: principal + customerInterest
        };
    }

    static reducingBalance(principal, tenure, monthlyRate) {
        if (principal <= 0 || tenure <= 0) {
            return { monthlyEmi: 0, totalInterest: 0 };
        }

        if (monthlyRate <= 0) {
            return { monthlyEmi: principal / tenure, totalInterest: 0 };
        }

        const factor = Math.pow(1 + monthlyRate, tenure);
        const monthlyEmi = (principal * monthlyRate * factor) / (factor - 1);
        const totalInterest = (monthlyEmi * tenure) - principal;

        return { monthlyEmi, totalInterest };
    }

    static simulateOpportunityReturns({ upfrontCost, downPayment, processingFee, monthlyOutflow, tenure, annualReturnRate }) {
        const monthlyReturnRate = annualReturnRate / 100 / 12;
        let balance = Math.max(upfrontCost - downPayment - processingFee, 0);
        let totalInterestEarned = 0;

        for (let i = 0; i < tenure; i++) {
            const interest = balance > 0 ? balance * monthlyReturnRate : 0;
            totalInterestEarned += interest;
            balance = balance + interest - monthlyOutflow;
        }

        return totalInterestEarned;
    }

    static findBreakEvenReturnRate(baseParams) {
        const lowResult = this.calculateForRate(baseParams, 0);
        if (lowResult.savings <= 0) return 0;

        const highResult = this.calculateForRate(baseParams, 60);
        if (highResult.savings > 0) return null;

        let low = 0;
        let high = 60;

        for (let i = 0; i < 35; i++) {
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

    static clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }
}
