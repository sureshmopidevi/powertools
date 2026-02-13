
/**
 * Pure function to calculate Loan Details.
 * Ported from React component to Vanilla JS.
 */
export class LoanCalculator {
    static calculate(amount, rate, tenureYears) {
        const r = rate / 12 / 100;
        const n = tenureYears * 12;

        let emi = 0;
        if (rate === 0) {
            emi = amount / (n || 1);
        } else {
            emi = amount * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
        }

        // Handle NaN or Infinity edge cases
        if (!isFinite(emi) || isNaN(emi)) emi = 0;

        const totalAmount = emi * n;
        const totalInterest = totalAmount - amount;

        // Generate Amortization Schedule
        let balance = amount;
        const schedule = [];
        const yearMap = new Map();

        for (let i = 1; i <= n; i++) {
            const interestPayment = balance * r;
            let principalPayment = emi - interestPayment;

            // Adjust last payment to fix rounding errors
            if (balance - principalPayment < 0) {
                principalPayment = balance;
            }

            balance -= principalPayment;
            if (balance < 0) balance = 0;

            schedule.push({
                month: i,
                principal: principalPayment,
                interest: interestPayment,
                balance: balance,
                totalPayment: emi
            });

            // Aggregate for yearly chart
            const year = Math.ceil(i / 12);
            // We want the balance at the END of the year
            yearMap.set(year, {
                year: `Year ${year}`,
                balance: Math.round(balance)
            });
        }

        // Chart Data Preparation
        const rawYearlyData = [{ year: 'Start', balance: amount }, ...Array.from(yearMap.values())];

        // Downsample data for cleaner charts if dataset is large
        const chartData = rawYearlyData.filter((_, idx) => {
            const totalPoints = rawYearlyData.length;
            if (totalPoints <= 12) return true;
            return idx === 0 || idx === totalPoints - 1 || idx % Math.ceil(totalPoints / 12) === 0;
        });

        return {
            emi: Math.round(emi),
            totalInterest: Math.round(totalInterest),
            totalAmount: Math.round(totalAmount),
            schedule,
            yearlyData: chartData
        };
    }

    static getComparisons(amount, rate, tenureYears, currentEmi, currentTotalInterest) {
        const variants = [tenureYears - 5, tenureYears + 5].filter(t => t > 0 && t <= 30 && t !== tenureYears);

        return variants.map(t => {
            const r = (rate || 0) / 12 / 100;
            const n = t * 12;
            let e = 0;
            if (rate === 0) {
                e = (amount || 0) / (n || 1);
            } else {
                e = (amount || 0) * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
            }

            const totalI = (e * n) - (amount || 0);

            return {
                tenure: t,
                diffEMI: Math.round(e) - currentEmi,
                diffInterest: Math.round(totalI) - currentTotalInterest
            };
        });
    }
}
