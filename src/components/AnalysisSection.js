export const AnalysisSection = () => `
    <div class="mt-8 animate-enter delay-300 space-y-8">
        <div class="flex items-center gap-3 mb-4">
            <div class="h-8 w-1 bg-indigo-600 dark:bg-indigo-500 rounded-full"></div>
            <h2 class="text-xl font-bold text-slate-800 dark:text-white">Deep Dive Analysis</h2>
        </div>

        <!-- Monthly Cash Flow Table -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div class="bg-slate-50 dark:bg-slate-850 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h3 class="font-bold text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wide">Monthly Cash Flow</h3>
                <span class="text-xs text-slate-500 dark:text-slate-400 font-medium" id="fuelNote">*Includes estimated fuel costs</span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full analysis-table">
                    <thead>
                        <tr>
                            <th>Strategy</th>
                            <th>Loan EMI</th>
                            <th class="fuel-col">Fuel Cost</th>
                            <th>Total Monthly Outflow</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>1. Debt Hater</strong></td>
                            <td id="t_emiA">₹0</td>
                            <td class="fuel-col text-orange-600 dark:text-orange-400 font-medium fuel-val">₹0</td>
                            <td class="font-bold text-slate-800 dark:text-white" id="t_totalA">₹0</td>
                        </tr>
                        <tr class="bg-indigo-50/30 dark:bg-indigo-900/10">
                            <td><strong>2. Smart Investor</strong></td>
                            <td id="t_emiB" class="text-indigo-600 dark:text-indigo-400 font-bold">₹0</td>
                            <td class="fuel-col text-orange-600 dark:text-orange-400 font-medium fuel-val">₹0</td>
                            <td class="font-bold text-indigo-900 dark:text-indigo-300" id="t_totalB">₹0</td>
                        </tr>
                        <tr>
                            <td><strong>3. Late Bloomer</strong></td>
                            <td id="t_emiC">₹0</td>
                            <td class="fuel-col text-orange-600 dark:text-orange-400 font-medium fuel-val">₹0</td>
                            <td class="font-bold text-slate-800 dark:text-white" id="t_totalC">₹0</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Wealth View -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div class="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Strategy 1</div>
                        <div class="text-2xl font-bold text-slate-600 dark:text-slate-200 mb-1" id="nwA">₹0</div>
                        <div class="text-[10px] text-slate-400 dark:text-slate-500">Total Net Worth</div>
                        <div class="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs flex justify-between text-slate-500 dark:text-slate-400">
                            <span>Car Value:</span> <span class="resale-val">₹0</span>
                        </div>
                        <div class="text-xs flex justify-between text-slate-500 dark:text-slate-400 mt-1">
                            <span>Investments:</span> <span>₹0</span>
                        </div>
                    </div>
                    <div class="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/40 ring-2 ring-indigo-500/10 dark:ring-indigo-500/20">
                        <div class="text-xs font-bold text-indigo-400 dark:text-indigo-400 uppercase mb-2">Strategy 2 (Best)</div>
                        <div class="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mb-1" id="nwB">₹0</div>
                        <div class="text-[10px] text-indigo-400 dark:text-indigo-500">Total Net Worth</div>
                        <div class="mt-3 pt-3 border-t border-indigo-200 dark:border-indigo-800 text-xs flex justify-between text-indigo-600 dark:text-indigo-400">
                            <span>Car Value:</span> <span class="resale-val">₹0</span>
                        </div>
                        <div class="text-xs flex justify-between text-indigo-600 dark:text-indigo-400 mt-1 font-bold">
                            <span>Investments:</span> <span id="invB">₹0</span>
                        </div>
                    </div>
                    <div class="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Strategy 3</div>
                        <div class="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1" id="nwC">₹0</div>
                        <div class="text-[10px] text-slate-400 dark:text-slate-500">Total Net Worth</div>
                        <div class="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs flex justify-between text-slate-500 dark:text-slate-400">
                            <span>Car Value:</span> <span class="resale-val">₹0</span>
                        </div>
                        <div class="text-xs flex justify-between text-slate-500 dark:text-slate-400 mt-1">
                            <span>Investments:</span> <span id="invC">₹0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
