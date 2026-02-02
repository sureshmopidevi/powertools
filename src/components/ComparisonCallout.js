export const ComparisonCallout = () => `
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-black/20">
        <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
            </div>
            <div class="flex-1">
                <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-3">Quick Comparison</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
                        <div class="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">Smart Investor vs Debt Hater</div>
                        <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400" id="savingsVsA">₹0</div>
                        <div class="text-xs text-slate-600 dark:text-slate-400 mt-1" id="savingsVsALabel">more in assets</div>
                    </div>
                    <div class="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
                        <div class="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">Smart Investor vs Late Bloomer</div>
                        <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400" id="savingsVsC">₹0</div>
                        <div class="text-xs text-slate-600 dark:text-slate-400 mt-1" id="savingsVsCLabel">more in assets</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
