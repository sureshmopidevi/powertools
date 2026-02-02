export const NetWorthChart = () => `
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-black/20">
        <div class="flex items-start justify-between mb-4">
            <div>
                <h3 class="font-bold text-lg text-slate-900 dark:text-white">Net Worth Progression</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">How your assets grow over 7 years</p>
            </div>
            <div class="flex gap-3 text-xs">
                <div class="flex items-center gap-1.5">
                    <div class="w-3 h-3 rounded-full bg-slate-400"></div>
                    <span class="text-slate-600 dark:text-slate-400 font-medium">Debt Hater</span>
                </div>
                <div class="flex items-center gap-1.5">
                    <div class="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span class="text-slate-600 dark:text-slate-400 font-medium">Smart Investor</span>
                </div>
                <div class="flex items-center gap-1.5">
                    <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span class="text-slate-600 dark:text-slate-400 font-medium">Late Bloomer</span>
                </div>
            </div>
        </div>
        <div class="relative" style="height: 300px;">
            <canvas id="netWorthCanvas" class="w-full h-full"></canvas>
        </div>
    </div>
`;
