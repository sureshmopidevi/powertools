export const EducationalSection = () => `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
        <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div class="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400 flex items-center justify-center mb-3">
                <i class="fas fa-arrow-down text-sm"></i>
            </div>
            <h4 class="font-bold text-sm text-slate-900 dark:text-white mb-1">Depreciation</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Cars lose value every year (approx 15%). The "Car Value" shown in the Net Worth section is the estimated resale price after 7 years, not what you paid.</p>
        </div>
        <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 flex items-center justify-center mb-3">
                <i class="fas fa-chart-pie text-sm"></i>
            </div>
            <h4 class="font-bold text-sm text-slate-900 dark:text-white mb-1">Arbitrage Math</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">If your loan costs 9% but your investments earn 13%, you make a "profit" of 4% on the bank's money. This is how the rich use debt.</p>
        </div>
        <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div class="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400 flex items-center justify-center mb-3">
                <i class="fas fa-gas-pump text-sm"></i>
            </div>
            <h4 class="font-bold text-sm text-slate-900 dark:text-white mb-1">Total Monthly Cost</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Your bank account sees "EMI + Fuel". We've separated this into the "Monthly Cash Flow" table to keep the strategy cards clean.</p>
        </div>
    </div>
`;
