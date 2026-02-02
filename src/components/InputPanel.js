export const InputPanel = () => `
    <div class="lg:col-span-4 animate-enter delay-100">
        <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 p-6 md:p-8 sticky top-6 z-10 overflow-y-auto max-h-[90vh]">

            <div class="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                <div class="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg shadow-lg shadow-indigo-500/30">
                    <i class="fas fa-sliders-h"></i>
                </div>
                <div>
                    <h2 class="text-lg font-bold text-slate-900 dark:text-white leading-tight">Configuration</h2>
                    <p class="text-xs text-slate-400 font-medium">Adjust your variables</p>
                </div>
            </div>

            <div class="space-y-6">
                <!-- Vehicle Details -->
                <div>
                    <label class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 block">Vehicle Cost & Value</label>
                    <div class="space-y-4">
                        <div class="input-group">
                            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">On-Road Price</label>
                            <div class="relative">
                                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                <input type="text" id="carPrice" value="22,81,000" class="currency-input w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:bg-white dark:focus:bg-slate-950 transition-colors" placeholder="e.g. 15,00,000">
                            </div>
                            <div class="word-helper" id="carPriceWords">Twenty Two Lakh Eighty One Thousand</div>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="input-group">
                                <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Loan Interest (%)</label>
                                <input type="number" id="loanRate" value="9.0" step="0.1" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-950">
                            </div>
                            <div class="input-group">
                                <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Depreciation / Yr (%)</label>
                                <input type="number" id="depreciation" value="15" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-950">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Fuel Costs -->
                <div class="bg-orange-50/50 dark:bg-orange-900/10 p-4 rounded-2xl border border-orange-100 dark:border-orange-900/30 transition-all duration-300" id="runningCostsCard">
                    <div class="flex justify-between items-center mb-3">
                        <label class="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider flex items-center gap-2">
                            <i class="fas fa-gas-pump"></i> Fuel Costs
                        </label>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="includeFuel" class="sr-only peer" checked>
                            <div class="w-9 h-5 bg-gray-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                    <div id="fuelInputsContainer" class="transition-opacity duration-300">
                        <div class="grid grid-cols-2 gap-3 mb-3">
                            <div class="input-group">
                                <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Monthly Km</label>
                                <input type="number" id="monthlyKm" value="1000" class="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-950">
                            </div>
                            <div class="input-group">
                                <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Mileage (km/l)</label>
                                <input type="number" id="mileage" value="15" class="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-950">
                            </div>
                        </div>
                        <div class="input-group">
                            <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Fuel Price (₹)</label>
                            <input type="number" id="fuelPrice" value="100" class="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-950">
                        </div>
                    </div>
                </div>

                <!-- Savings -->
                <div>
                    <label class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 block">Down Payment Configuration</label>
                    <div class="space-y-4">
                        <div class="input-group">
                            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Total Down Payment Amount</label>
                            <div class="relative">
                                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                <input type="text" id="totalCash" value="5,00,000" class="currency-input w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:bg-white dark:focus:bg-slate-950">
                            </div>
                            <div class="word-helper" id="totalCashWords">Five Lakh</div>
                            <p class="text-[10px] text-slate-500 mt-1">Amount you are willing to spend upfront.</p>
                        </div>
                        <div class="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 input-group">
                            <label class="block text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-1.5">Investable Lumpsum (Sliced)</label>
                            <div class="relative mb-2">
                                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 dark:text-indigo-500 font-bold">₹</span>
                                <input type="text" id="bufferCash" value="1,00,000" class="currency-input w-full pl-8 pr-4 py-3 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700 rounded-xl font-bold text-indigo-700 dark:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800">
                            </div>
                            <div class="word-helper text-indigo-600/70 dark:text-indigo-400" id="bufferCashWords">One Lakh</div>
                            <p class="text-[10px] text-indigo-600 dark:text-indigo-400 leading-relaxed font-medium mt-2">
                                Calculated Amount: (Total - Min Down Payment). Auto-calculated but editable.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Market Assumptions -->
                <div>
                    <label class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 block">Market Assumptions</label>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="input-group">
                            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Returns (SIP)</label>
                            <div class="relative">
                                <input type="number" id="sipRate" value="13.0" step="0.1" class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-950">
                                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">%</span>
                            </div>
                        </div>
                        <div class="input-group">
                            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Tax on Gains</label>
                            <div class="relative">
                                <input type="number" id="taxRate" value="12.5" step="0.5" class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-950">
                                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
