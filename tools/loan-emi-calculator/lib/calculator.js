
/**
 * Pure function to calculate Loan Details.
 * Ported from React component to Vanilla JS.
 */
export class LoanCalculator {
    static calculate(amount, rate, tenureYears) {
        // Input validation and sanitization
        amount = Math.max(0, parseFloat(amount) || 0);
        rate = Math.max(0, parseFloat(rate) || 0);
        tenureYears = Math.max(1, parseFloat(tenureYears) || 1);

        // Edge case: zero principal
        if (amount === 0) {
            return {
                emi: 0,
                totalInterest: 0,
                totalAmount: 0,
                schedule: [],
                yearlyData: [{ year: 'Start', balance: 0 }]
            };
        }

        const r = rate / 12 / 100;
        const n = tenureYears * 12;

        let emi = 0;
        if (rate === 0) {
            emi = amount / n;
        } else {
            const numerator = Math.pow(1 + r, n);
            emi = amount * r * (numerator / (numerator - 1));
        }

        // Handle NaN or Infinity edge cases
        if (!isFinite(emi) || isNaN(emi)) emi = 0;

        const totalAmount = emi * n;
        const totalInterest = Math.max(0, totalAmount - amount);

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
                principal: Math.max(0, principalPayment),
                interest: Math.max(0, interestPayment),
                balance: Math.max(0, balance),
                totalPayment: emi
            });

            // Aggregate for yearly chart
            const year = Math.ceil(i / 12);
            yearMap.set(year, {
                year: `Year ${year}`,
                balance: Math.round(Math.max(0, balance))
            });
        }

        // Chart Data Preparation
        const rawYearlyData = [{ year: 'Start', balance: Math.round(amount) }, ...Array.from(yearMap.values())];

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
        amount = Math.max(0, parseFloat(amount) || 0);
        rate = Math.max(0, parseFloat(rate) || 0);
        tenureYears = Math.max(1, parseFloat(tenureYears) || 1);

        const variants = [tenureYears - 5, tenureYears + 5]
            .filter(t => t > 0 && t <= 30 && t !== tenureYears);

        return variants.map(t => {
            const r = rate / 12 / 100;
            const n = t * 12;
            let e = 0;

            if (rate === 0) {
                e = amount / n;
            } else {
                const numerator = Math.pow(1 + r, n);
                e = amount * r * (numerator / (numerator - 1));
            }

            if (!isFinite(e) || isNaN(e)) e = 0;

            const totalI = (e * n) - amount;

            return {
                tenure: t,
                diffEMI: Math.round(e) - currentEmi,
                diffInterest: Math.round(totalI) - currentTotalInterest
            };
        });
    }
}
