export const StrategyCards = () => `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        <!-- Scenario A: Debt Hater -->
        <div class="strategy-card bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-black/20 relative overflow-hidden group">
            <div class="absolute top-0 left-0 w-full h-1.5 bg-slate-300 dark:bg-slate-600 transition-all group-hover:h-2"></div>
            <div class="mb-6">
                <span class="inline-block px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wide mb-2">Strategy 1</span>
                <h3 class="text-xl font-bold text-slate-800 dark:text-white leading-tight">Debt Hater</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">Pay maximum cash now. Take a short 5-year loan.</p>
            </div>
            <div class="mt-auto space-y-4">
                <div class="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
                    <div class="main-stat-label text-slate-400 dark:text-slate-500">Monthly EMI (5yr)</div>
                    <div class="text-2xl font-bold text-slate-800 dark:text-white tracking-tight" id="emiA">₹0</div>
                </div>
                <div class="flex justify-between items-center text-xs mt-2 px-1">
                    <span class="text-slate-500 dark:text-slate-400 font-medium">Interest Paid:</span>
                    <span class="font-bold text-rose-500 dark:text-rose-400" id="interestA">₹0</span>
                </div>
                
                 <!-- Metric Placeholder for Layout Match -->
                 <div class="bg-slate-100 dark:bg-slate-700/50 rounded-xl p-3 border border-slate-200 dark:border-slate-600/50 opacity-75">
                    <div class="flex justify-between items-center mb-1">
                       <span class="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Invested Returns</span>
                       <i class="fas fa-ban text-slate-400 text-xs"></i>
                    </div>
                    <div class="text-2xl font-bold text-slate-600 dark:text-slate-300 tracking-tight" id="invValueA">₹0</div>
                    <div class="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">No Investment Strategy</div>
               </div>

                <ul class="space-y-2 mt-2 pt-2 border-t border-slate-50 dark:border-slate-700">
                    <li class="flex items-start gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                        <i class="fas fa-check-circle text-emerald-500 dark:text-emerald-400 mt-0.5"></i> Lowest interest cost
                    </li>
                    <li class="flex items-start gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                        <i class="fas fa-times-circle text-rose-500 dark:text-rose-400 mt-0.5"></i> All cash locked
                    </li>
                </ul>
            </div>
        </div>

        <!-- Scenario B: Smart Investor -->
        <div class="strategy-card bg-indigo-600 dark:bg-indigo-700 rounded-3xl p-1 border border-indigo-500 dark:border-indigo-600 shadow-2xl shadow-indigo-500/20 dark:shadow-black/40 text-white transform md:-translate-y-4 z-10">
            <div class="bg-white/10 backdrop-blur-sm rounded-[1.4rem] p-5 h-full flex flex-col">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <span class="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-400 text-yellow-900 text-[10px] font-extrabold uppercase tracking-wide mb-2">
                            <i class="fas fa-star text-[8px]"></i> Recommended
                        </span>
                        <h3 class="text-xl font-bold text-white leading-tight">Smart Investor</h3>
                    </div>
                </div>
                <p class="text-xs text-indigo-100 mb-6 font-medium leading-relaxed opacity-90">Keep cash. Take longer 7-year loan. Invest the difference.</p>
                <div class="mt-auto space-y-4">
                    <div class="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-lg text-slate-900 dark:text-white">
                        <div class="flex justify-between items-end mb-1">
                            <div class="main-stat-label text-slate-400 dark:text-slate-500">Monthly EMI (7yr)</div>
                            <div class="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded" id="sipB_label">Save ₹0</div>
                        </div>
                        <div class="text-3xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight" id="emiB">₹0</div>
                    </div>

                    <!-- New Metric: Investment Gains -->
                    <div class="bg-indigo-800/20 rounded-xl p-3 border border-indigo-400/20">
                         <div class="flex justify-between items-center mb-1">
                            <span class="text-[10px] uppercase font-bold text-indigo-200 tracking-wider">Invested Returns (7yr)</span>
                            <i class="fas fa-coins text-yellow-400 text-xs"></i>
                         </div>
                         <div class="text-2xl font-bold text-white tracking-tight" id="invValueB">₹0</div>
                         <div class="text-[10px] text-indigo-300 mt-0.5 font-medium">Excl. Initial Lumpsum</div>
                    </div>

                    <div class="flex justify-between items-center text-xs mt-2 px-1 text-indigo-100">
                        <span class="font-medium opacity-80">Interest Paid:</span>
                        <span class="font-bold text-white" id="interestB">₹0</span>
                    </div>
                    <ul class="space-y-2 mt-2 pt-2 border-t border-indigo-500/30">
                        <li class="flex items-start gap-2 text-xs font-medium text-indigo-50 opacity-90">
                            <i class="fas fa-shield-alt text-yellow-300 mt-0.5"></i> Liquid cash available
                        </li>
                        <li class="flex items-start gap-2 text-xs font-medium text-indigo-50 opacity-90">
                            <i class="fas fa-chart-line text-yellow-300 mt-0.5"></i> Beats inflation
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Scenario C: Late Bloomer -->
        <div class="strategy-card bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-black/20 relative overflow-hidden group">
            <div class="absolute top-0 left-0 w-full h-1.5 bg-emerald-400 dark:bg-emerald-500 transition-all group-hover:h-2"></div>
            <div class="mb-6">
                <span class="inline-block px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wide mb-2">Strategy 3</span>
                <h3 class="text-xl font-bold text-slate-800 dark:text-white leading-tight">Late Bloomer</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">Pay fast (5yr). Start investing aggressively only after loan ends.</p>
            </div>
            <div class="mt-auto space-y-4">
                <div class="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
                    <div class="main-stat-label text-slate-400 dark:text-slate-500">Invest Yrs 6-7</div>
                    <div class="text-2xl font-bold text-emerald-700 dark:text-emerald-400" id="emiC">₹0</div>
                </div>
                <div class="flex justify-between items-center text-xs mt-2 px-1">
                    <span class="text-slate-500 dark:text-slate-400 font-medium">Interest Paid:</span>
                    <span class="font-bold text-rose-500 dark:text-rose-400" id="interestC">₹0</span>
                </div>

                <!-- Metric: Investment Gains -->
                <div class="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-3 border border-emerald-100 dark:border-emerald-900/30">
                     <div class="flex justify-between items-center mb-1">
                        <span class="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">Invested Returns</span>
                        <i class="fas fa-coins text-emerald-500 text-xs"></i>
                     </div>
                     <div class="text-2xl font-bold text-slate-700 dark:text-white tracking-tight" id="invValueC">₹0</div>
                     <div class="text-[10px] text-emerald-600/70 dark:text-emerald-500/70 mt-0.5 font-medium">Years 6-7 Gains</div>
                </div>

                <ul class="space-y-2 mt-2 pt-2 border-t border-slate-50 dark:border-slate-700">
                    <li class="flex items-start gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                        <i class="fas fa-check-circle text-emerald-500 dark:text-emerald-400 mt-0.5"></i> Debt free quickly
                    </li>
                    <li class="flex items-start gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                        <i class="fas fa-clock text-orange-500 dark:text-orange-400 mt-0.5"></i> Lost 5 years of compounding
                    </li>
                </ul>
            </div>
        </div>
    </div>
`;
