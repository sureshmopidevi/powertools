
export class NetWorthCalculator {
    static calculate(items) {
        const totalAssets = items
            .filter(item => item.type === 'asset')
            .reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);

        const totalLiabilities = items
            .filter(item => item.type === 'liability')
            .reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);

        const netWorth = totalAssets - totalLiabilities;
        const ratio = totalLiabilities > 0 ? (totalAssets / totalLiabilities).toFixed(2) : 'Infinity';

        return {
            totalAssets,
            totalLiabilities,
            netWorth,
            ratio
        };
    }

    static getTrend(snapshots) {
        if (snapshots.length < 2) return { change: 0, direction: 'neutral' };

        const latest = snapshots[snapshots.length - 1];
        const previous = snapshots[snapshots.length - 2];

        const latestNW = latest.netWorth;
        const previousNW = previous.netWorth;

        const change = previousNW !== 0 ? ((latestNW - previousNW) / Math.abs(previousNW)) * 100 : 0;

        return {
            change: Math.abs(change).toFixed(1),
            direction: latestNW >= previousNW ? 'up' : 'down'
        };
    }

    static getBenchmark(netWorth, ageGroup) {
        // Benchmarks from PRD
        const benchmarks = {
            '25-30': [500000, 1500000, 4000000],
            '30-35': [2000000, 5000000, 15000000],
            '35-40': [5000000, 15000000, 50000000]
        };

        const group = benchmarks[ageGroup];
        if (!group) return null;

        if (netWorth < group[0]) return 'below 25th';
        if (netWorth < group[1]) return 'top 75%';
        if (netWorth < group[2]) return 'top 50%';
        return 'top 25%';
    }
}
