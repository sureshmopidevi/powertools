export const InflationSection = () => `
    <div class="mt-8 border-t border-slate-200 dark:border-slate-800 pt-10 pb-12">
        <div class="bg-orange-50 dark:bg-orange-900/10 rounded-3xl p-6 border border-orange-100 dark:border-orange-900/30 flex flex-col md:flex-row items-center gap-6">
            <div class="flex-1">
                <h3 class="text-lg font-bold text-orange-900 dark:text-orange-300 mb-2">The Inflation Effect</h3>
                <p class="text-sm text-orange-800/80 dark:text-orange-200/70 mb-0 leading-relaxed">
                    If you keep your savings in cash under a mattress, inflation (avg 6%) eats it. <br>
                    <span class="font-bold" id="inf_cash">₹0</span> today will only buy <span class="font-bold text-orange-600 dark:text-orange-400" id="inf_value">₹0</span> worth of goods in 7 years.
                </p>
            </div>
            <div class="bg-white/50 dark:bg-black/20 p-3 rounded-xl border border-orange-200/50 dark:border-orange-800/30 text-orange-800 dark:text-orange-300 text-xs font-bold text-center min-w-[120px]">
                <i class="fas fa-percentage text-2xl mb-1 block opacity-50"></i>
                Wealth Erosion
            </div>
        </div>
    </div>
`;
