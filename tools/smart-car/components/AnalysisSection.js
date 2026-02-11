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
                            <th class="text-left">Strategy</th>
                            <th class="text-right">Loan EMI</th>
                            <th class="text-right">Fuel Cost</th>
                            <th class="text-right">Total Monthly Outflow</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>1. Debt Hater</strong></td>
                            <td class="text-right" id="t_emiA">₹0</td>
                            <td class="text-right text-orange-600 dark:text-orange-400 font-medium fuel-val">₹0</td>
                            <td class="text-right font-bold text-slate-800 dark:text-white" id="t_totalA">₹0</td>
                        </tr>
                        <tr class="bg-indigo-50/30 dark:bg-indigo-900/10">
                            <td><strong>2. Smart Investor</strong></td>
                            <td id="t_emiB" class="text-right text-indigo-600 dark:text-indigo-400 font-bold">₹0</td>
                            <td class="text-right text-orange-600 dark:text-orange-400 font-medium fuel-val">₹0</td>
                            <td class="text-right font-bold text-indigo-900 dark:text-indigo-300" id="t_totalB">₹0</td>
                        </tr>
                        <tr>
                            <td><strong>3. Late Bloomer</strong></td>
                            <td class="text-right" id="t_emiC">₹0</td>
                            <td class="text-right text-orange-600 dark:text-orange-400 font-medium fuel-val">₹0</td>
                            <td class="text-right font-bold text-slate-800 dark:text-white" id="t_totalC">₹0</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Asset Growth Table (Full Width) -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div class="bg-slate-50 dark:bg-slate-850 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h3 class="font-bold text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wide flex items-center gap-2">
                    <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    Asset Growth (Year 7)
                </h3>
                <span class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">@ <span id="invRateDisplay">15</span>% p.a. returns</span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full analysis-table">
                    <thead>
                        <tr>
                            <th class="text-left">Strategy</th>
                            <th class="text-right">Car Value (Depreciated)</th>
                            <th class="text-right">Investment Value</th>
                            <th class="text-right font-bold">Total Assets</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>1. Debt Hater</strong></td>
                            <td class="text-right resale-val">₹0</td>
                            <td class="text-right text-slate-400">₹0</td>
                            <td class="text-right font-bold text-slate-800 dark:text-slate-100" id="assetTotalA">₹0</td>
                        </tr>
                        <tr class="bg-indigo-50/30 dark:bg-indigo-900/10">
                            <td><strong class="text-indigo-900 dark:text-indigo-300">2. Smart Investor</strong></td>
                            <td class="text-right resale-val">₹0</td>
                            <td class="text-right text-emerald-600 dark:text-emerald-400 font-medium" id="assetInvB">₹0</td>
                            <td class="text-right font-bold text-indigo-700 dark:text-indigo-300" id="assetTotalB">₹0</td>
                        </tr>
                        <tr>
                            <td><strong>3. Late Bloomer</strong></td>
                            <td class="text-right resale-val">₹0</td>
                            <td class="text-right text-emerald-600 dark:text-emerald-400 font-medium" id="assetInvC">₹0</td>
                            <td class="text-right font-bold text-slate-800 dark:text-slate-100" id="assetTotalC">₹0</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Effective Cost Table (Full Width) -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div class="bg-slate-50 dark:bg-slate-850 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h3 class="font-bold text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wide flex items-center gap-2">
                    <svg class="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    Effective Cost of Ownership (7 Years)
                </h3>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full analysis-table">
                    <thead>
                        <tr>
                            <th class="text-left">Strategy</th>
                            <th class="text-right">Down Payment</th>
                            <th class="text-right">Total EMI Paid</th>
                            <th class="text-right">Interest Paid</th>
                            <th class="text-right font-bold">Net Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>1. Debt Hater</strong></td>
                            <td class="text-right" id="costDpA">₹0</td>
                            <td class="text-right" id="costEmiPaidA">₹0</td>
                            <td class="text-right text-rose-500" id="costIntA">₹0</td>
                            <td class="text-right font-bold text-slate-800 dark:text-slate-100" id="costNetA">₹0</td>
                        </tr>
                        <tr class="bg-indigo-50/30 dark:bg-indigo-900/10">
                            <td><strong class="text-indigo-900 dark:text-indigo-300">2. Smart Investor</strong></td>
                            <td class="text-right" id="costDpB">₹0</td>
                            <td class="text-right" id="costEmiPaidB">₹0</td>
                            <td class="text-right text-rose-500" id="costIntB">₹0</td>
                            <td class="text-right font-bold text-indigo-700 dark:text-indigo-300" id="costNetB">₹0</td>
                        </tr>
                        <tr>
                            <td><strong>3. Late Bloomer</strong></td>
                            <td class="text-right" id="costDpC">₹0</td>
                            <td class="text-right" id="costEmiPaidC">₹0</td>
                            <td class="text-right text-rose-500" id="costIntC">₹0</td>
                            <td class="text-right font-bold text-slate-800 dark:text-slate-100" id="costNetC">₹0</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Recommendation Section -->
        <div class="bg-gradient-to-br from-indigo-50 to-emerald-50 dark:from-indigo-900/20 dark:to-emerald-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800 p-6 shadow-sm">
            <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                    </svg>
                </div>
                <div class="flex-1">
                    <h3 class="font-bold text-indigo-900 dark:text-indigo-200 text-lg mb-2">🏆 Why "Smart Investor" is Recommended</h3>
                    <ul class="text-sm text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                        <li class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                            <span><strong>Lower Monthly Outflow</strong> — Longer tenure reduces EMI burden</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                            <span><strong>Investment Arbitrage</strong> — SIP returns exceed loan interest cost</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                            <span><strong>Highest Net Worth</strong> — Best total assets after 7 years</span>
                        </li>
                    </ul>
                    <div class="bg-white/60 dark:bg-slate-800/60 rounded-lg p-3 border border-indigo-100 dark:border-indigo-800">
                        <p class="text-xs text-indigo-800 dark:text-indigo-300">
                            <strong>Key Insight:</strong> If your expected SIP returns are higher than your loan interest rate, it's mathematically better to borrow more and invest the difference. This strategy works best with disciplined monthly investments.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
