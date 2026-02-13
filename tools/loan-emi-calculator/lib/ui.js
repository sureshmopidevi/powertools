
import { ThemeManager } from '../../../src/lib/theme.js';
import { LoanCalculator } from './calculator.js';

export class AppUI {
  constructor() {
    this.state = {
      amount: 5000000,
      rate: 8.5,
      tenureYears: 20,
      showSchedule: false,
      copied: false
    };

    this.app = document.getElementById('app');
    this.charts = {
      pie: null,
      area: null
    };

    // Load saved data
    const saved = localStorage.getItem('loan_emi_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.amount === 'number') this.state.amount = parsed.amount;
        if (typeof parsed.rate === 'number') this.state.rate = parsed.rate;
        if (typeof parsed.tenureYears === 'number') this.state.tenureYears = parsed.tenureYears;
      } catch (e) { }
    }
  }

  render() {
    if (!this.app) return;
    this.app.innerHTML = this.getHTML();
    this.attachListeners();
    this.update();

    // Initialize theme manager for the tool's toggle
    new ThemeManager('themeToggle');
  }

  getHTML() {
    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 animate-enter">
        
        <!-- Navigation & Header -->
        <header class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <a href="../../index.html" class="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-gold-600 dark:hover:text-gold-400 hover:border-gold-300 dark:hover:border-gold-600 transition-all text-xs font-semibold no-underline w-fit">
              <i class="fa-solid fa-arrow-left"></i>Home
            </a>
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-gold-500/20">
                <i class="fa-solid fa-calculator text-xl"></i>
              </div>
              <div>
                <h1 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Loan EMI Calculator</h1>
                <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Financial Planning</p>
              </div>
            </div>
          </div>

          <button id="themeToggle" class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm">
             <i class="fa-solid fa-moon dark:hidden"></i>
             <i class="fa-solid fa-sun hidden dark:inline"></i>
          </button>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Inputs Section -->
          <section class="lg:col-span-7 space-y-6">
            <div class="grid gap-4">
              ${this.renderInputGroup('amount', 'Loan Amount', 50000, 10000000, 10000, '₹', 'loan-amount')}
              ${this.renderInputGroup('rate', 'Interest Rate', 1, 30, 0.1, '%', 'interest-rate')}
              ${this.renderInputGroup('tenureYears', 'Loan Tenure', 1, 30, 1, 'Yrs', 'loan-tenure')}
            </div>

            <!-- Tenure Insights -->
            <div id="insightsSection" class="pt-4">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <i class="fa-solid fa-chart-line mr-2 text-gold-500"></i> 
                Tenure Insights
              </h3>
              <div id="comparisons" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Injected via JS -->
              </div>
            </div>

            <!-- Amortization Schedule -->
            <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-all">
              <button id="toggleSchedule" class="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                <span class="font-bold text-slate-900 dark:text-white">Detailed Amortization Schedule</span>
                <i class="fa-solid fa-chevron-down text-slate-400 transition-transform duration-300" id="scheduleChevron"></i>
              </button>
              
              <div id="scheduleContainer" class="max-h-0 overflow-hidden transition-all duration-300">
                <div id="scheduleTable" class="overflow-x-auto max-h-96 overflow-y-auto custom-scrollbar">
                   <!-- Injected via JS -->
                </div>
              </div>
            </div>
          </section>

          <!-- Results Section -->
          <section class="lg:col-span-5 space-y-6">
            
            <!-- Primary Result Card -->
            <div class="bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/40 border border-gold-100 dark:border-slate-700 p-8 relative overflow-hidden group">
              <div class="absolute -top-10 -right-10 w-40 h-40 bg-gold-500/5 rounded-full blur-3xl group-hover:bg-gold-500/10 transition-colors"></div>
              
              <div class="relative z-10 text-center mb-8">
                <p class="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em] text-xs mb-2">Monthly Installment</p>
                <h2 id="emiDisplay" class="text-4xl md:text-5xl font-black text-gold-600 dark:text-gold-400 tracking-tight tabular-nums">
                  ₹0
                </h2>
              </div>

              <div class="grid grid-cols-2 gap-4 relative z-10">
                <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
                  <p class="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Interest</p>
                  <h3 id="totalInterestDisplay" class="text-xl font-bold text-slate-900 dark:text-white tabular-nums">₹0</h3>
                  <p id="interestPercentDisplay" class="text-xs text-slate-400 mt-1">0% of total</p>
                </div>
                <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
                  <p class="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Payable</p>
                  <h3 id="totalAmountDisplay" class="text-xl font-bold text-slate-900 dark:text-white tabular-nums">₹0</h3>
                  <p class="text-xs text-slate-400 mt-1">Principal + Int.</p>
                </div>
              </div>

              <div class="flex gap-3 mt-8 relative z-10">
                <button id="shareButton" class="flex-1 flex items-center justify-center gap-2 bg-slate-900 dark:bg-gold-600 hover:bg-black dark:hover:bg-gold-500 text-white dark:text-slate-900 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-[0.98]">
                  <i class="fa-solid fa-share-nodes"></i>
                  <span>Share Plan</span>
                </button>
                <button id="copyButton" class="w-14 flex items-center justify-center bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-white rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors group">
                  <i class="fa-regular fa-copy group-active:scale-95"></i>
                </button>
              </div>
            </div>

            <!-- Visualizations -->
            <div class="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 p-8">
              <h3 class="font-bold text-slate-800 dark:text-white mb-8 text-center uppercase tracking-widest text-xs">Payment Breakdown</h3>
              
              <div class="relative h-56 mb-8">
                <canvas id="pieChart"></canvas>
              </div>

              <div class="border-t border-slate-100 dark:border-slate-700 pt-8">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">Projected Balance Reduction</p>
                <div class="h-40">
                  <canvas id="areaChart"></canvas>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <!-- Toast Notification -->
      <div id="toast" class="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl opacity-0 pointer-events-none transition-all duration-300 transform translate-y-4 z-50">
        <i class="fa-solid fa-check-circle text-emerald-400 mr-2"></i>
        Plan copied to clipboard
      </div>
    `;
  }

  renderInputGroup(id, label, min, max, step, suffix, inputId) {
    const value = this.state[id];
    // Use text type for amount to allow commas, number for others
    const isAmount = id === 'amount';
    const inputType = isAmount ? 'text' : 'number';
    const displayValue = isAmount ? this.formatInput(value) : value;

    // Adjust width based on content length to prevent cutoff
    const widthClass = isAmount ? 'w-32' : 'w-20';

    return `
      <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 transition-all hover:border-gold-200 dark:hover:border-gold-900/50">
        <div class="flex justify-between items-center mb-5">
          <label for="${inputId}" class="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest leading-none">
            ${label}
          </label>
          <div class="flex items-center bg-slate-50 dark:bg-slate-900/50 rounded-xl px-4 py-2 border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-gold-500/50 transition-all">
            <input
              id="${inputId}"
              type="${inputType}"
              value="${displayValue}"
              step="${step}"
              class="${widthClass} bg-transparent text-right font-black text-slate-900 dark:text-white outline-none text-base tracking-tight"
              placeholder="0"
            />
            <span class="text-slate-400 dark:text-slate-500 font-bold ml-2 text-xs">${suffix}</span>
          </div>
        </div>
        <input
          type="range"
          id="${id}Slider"
          min="${min}"
          max="${max}"
          step="${step}"
          value="${value}"
          class="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-gold-500 accent-gold"
        />
        <div class="flex justify-between mt-3 text-[10px] text-slate-300 dark:text-slate-600 font-bold uppercase tracking-tighter">
          <span>${suffix === '₹' ? this.formatCompact(min) : min + ' ' + suffix}</span>
          <span>${suffix === '₹' ? this.formatCompact(max) : max + ' ' + suffix}</span>
        </div>
      </div>
    `;
  }

  attachListeners() {
    // Inputs and Sliders
    ['amount', 'rate', 'tenureYears'].forEach(id => {
      const input = document.getElementById(id === 'amount' ? 'loan-amount' : id === 'rate' ? 'interest-rate' : 'loan-tenure');
      const slider = document.getElementById(`${id}Slider`);

      const updateFunc = (val, isSlider = false) => {
        this.state[id] = val;

        // Update input field if change came from slider
        if (isSlider && input) {
          input.value = id === 'amount' ? this.formatInput(val) : val;
        }
        // Update slider if change came from input
        else if (!isSlider && slider) {
          slider.value = val;
        }

        this.update();
      };

      if (input) {
        // Handle input events for formatting
        input.addEventListener('input', (e) => {
          let rawValue = e.target.value.replace(/,/g, '');

          // Allow decimal point for rate
          if (id === 'rate' && (rawValue.endsWith('.') || (rawValue.includes('.') && rawValue.endsWith('0')))) {
            // Don't update state or format yet if user is typing decimal
            return;
          }

          let val = parseFloat(rawValue);
          if (isNaN(val)) val = 0;

          // Enforce bounds
          const max = parseFloat(slider.getAttribute('max'));
          if (val > max) val = max;

          this.state[id] = val;
          if (slider) slider.value = val;

          // Only re-format prompt if it's amount and user isn't actively deleting
          if (id === 'amount') {
            // Store cursor position to restore later if needed (simple approximation)
            const start = input.selectionStart;
            // Only format on blur or if complete number
            // For live formatting we need more complex logic, let's format on blur mostly or simple cases
            // Simple approach: unformatted on visual edit, formatted on blur?
            // User asked for "adding 7500000... no comos added", implies they want to see commas while typing or at least have space
            // Let's format and set value
            input.value = this.formatInput(val);
          }

          this.update();
        });

        // Better approach: Format on blur, allow raw on focus
        if (id === 'amount') {
          input.addEventListener('focus', (e) => {
            e.target.value = this.state[id]; // Show raw number on edit
          });
          input.addEventListener('blur', (e) => {
            e.target.value = this.formatInput(this.state[id]); // Show formatted on exit
          });
        }
      }

      if (slider) {
        slider.addEventListener('input', (e) => {
          const val = parseFloat(e.target.value);
          updateFunc(val, true);
        });
      }
    });

    // Toggle Schedule
    const toggleBtn = document.getElementById('toggleSchedule');
    const container = document.getElementById('scheduleContainer');
    const chevron = document.getElementById('scheduleChevron');

    toggleBtn.addEventListener('click', () => {
      this.state.showSchedule = !this.state.showSchedule;
      if (this.state.showSchedule) {
        container.style.maxHeight = '500px';
        chevron.classList.add('rotate-180');
      } else {
        container.style.maxHeight = '0';
        chevron.classList.remove('rotate-180');
      }
    });

    // Copy Content
    document.getElementById('copyButton').addEventListener('click', () => this.copyPlan());
    document.getElementById('shareButton').addEventListener('click', () => this.sharePlan());
  }

  update() {
    const { emi, totalInterest, totalAmount, schedule, yearlyData } = LoanCalculator.calculate(
      this.state.amount,
      this.state.rate,
      this.state.tenureYears
    );

    // Save state
    localStorage.setItem('loan_emi_data', JSON.stringify({
      amount: this.state.amount,
      rate: this.state.rate,
      tenureYears: this.state.tenureYears
    }));

    // Update DOM
    document.getElementById('emiDisplay').textContent = this.formatCurrency(emi);
    document.getElementById('totalInterestDisplay').textContent = this.formatCurrency(totalInterest);
    document.getElementById('totalAmountDisplay').textContent = this.formatCurrency(totalAmount);

    const interestPercent = totalAmount > 0 ? (totalInterest / totalAmount) * 100 : 0;
    document.getElementById('interestPercentDisplay').textContent = `${interestPercent.toFixed(1)}% of total`;

    // Comparisons
    this.renderComparisons(emi, totalInterest);

    // Table
    this.renderTable(schedule);

    // Charts
    this.renderCharts(this.state.amount, totalInterest, yearlyData);
  }

  renderComparisons(emi, totalInterest) {
    const comparisons = LoanCalculator.getComparisons(
      this.state.amount,
      this.state.rate,
      this.state.tenureYears,
      emi,
      totalInterest
    );

    const container = document.getElementById('comparisons');
    container.innerHTML = comparisons.map(comp => `
      <button class="comparison-btn w-full text-left p-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 hover:border-gold-300 dark:hover:border-gold-600 transition-all group" data-tenure="${comp.tenure}">
        <div class="flex justify-between items-center mb-3">
          <span class="font-bold text-slate-800 dark:text-white">${comp.tenure} Years</span>
          <i class="fa-solid fa-arrow-right text-[10px] text-slate-300 group-hover:text-gold-500 group-hover:translate-x-1 transition-all"></i>
        </div>
        <div class="space-y-2">
          <div class="flex justify-between text-[11px]">
            <span class="text-slate-400">EMI</span>
            <span class="${comp.diffEMI > 0 ? 'text-rose-500' : 'text-emerald-500'} font-bold tabular-nums">
              ${comp.diffEMI > 0 ? '+' : ''}${this.formatCurrency(comp.diffEMI)}
            </span>
          </div>
          <div class="flex justify-between text-[11px]">
            <span class="text-slate-400">Interest</span>
            <span class="${comp.diffInterest > 0 ? 'text-rose-500' : 'text-emerald-500'} font-bold tabular-nums">
              ${comp.diffInterest > 0 ? '+' : ''}${this.formatCurrency(comp.diffInterest)}
            </span>
          </div>
        </div>
      </button>
    `).join('');

    // Add listeners to comparison buttons
    container.querySelectorAll('.comparison-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tenure = parseInt(btn.dataset.tenure);
        this.state.tenureYears = tenure;
        document.getElementById('loan-tenure').value = tenure;
        document.getElementById('tenureYearsSlider').value = tenure;
        this.update();
      });
    });
  }

  renderTable(schedule) {
    const container = document.getElementById('scheduleTable');
    container.innerHTML = `
      <table class="w-full text-xs text-left">
        <thead class="text-xs text-slate-400 uppercase bg-slate-50/80 dark:bg-slate-900/80 sticky top-0 z-10 backdrop-blur-md">
          <tr>
            <th class="px-6 py-4 font-bold tracking-widest">Month</th>
            <th class="px-6 py-4 text-right font-bold tracking-widest">Principal</th>
            <th class="px-6 py-4 text-right font-bold tracking-widest">Interest</th>
            <th class="px-6 py-4 text-right font-bold tracking-widest">Balance</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          ${schedule.map((row) => `
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
              <td class="px-6 py-3 font-bold text-slate-700 dark:text-slate-300">${row.month}</td>
              <td class="px-6 py-3 text-right text-emerald-600 font-mono">${this.formatCurrency(row.principal)}</td>
              <td class="px-6 py-3 text-right text-gold-500 font-mono">${this.formatCurrency(row.interest)}</td>
              <td class="px-6 py-3 text-right text-slate-400 font-mono">${this.formatCurrency(row.balance)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  renderCharts(principal, interest, yearlyData) {
    const isDark = document.documentElement.classList.contains('dark');
    const principalColor = '#10b981'; // Emerald 500
    const interestColor = '#f59e0b'; // Gold 500

    // Pie Chart
    if (this.charts.pie) this.charts.pie.destroy();
    const pieCtx = document.getElementById('pieChart')?.getContext('2d');
    if (!pieCtx || !window.Chart) {
      console.warn('Pie Chart container or Chart.js missing');
      return;
    }

    this.charts.pie = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: ['Principal', 'Interest'],
        datasets: [{
          data: [principal, interest],
          backgroundColor: [principalColor, interestColor],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' },
              color: isDark ? '#94a3b8' : '#64748b'
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${this.formatCurrency(ctx.raw)}`
            }
          }
        },
        cutout: '70%'
      }
    });

    // Area Chart
    if (this.charts.area) this.charts.area.destroy();
    const areaCtx = document.getElementById('areaChart')?.getContext('2d');
    if (!areaCtx) return;

    const gradient = areaCtx.createLinearGradient(0, 0, 0, 150);
    gradient.addColorStop(0, 'rgba(245, 158, 11, 0.2)');
    gradient.addColorStop(1, 'rgba(245, 158, 11, 0)');

    this.charts.area = new Chart(areaCtx, {
      type: 'line',
      data: {
        labels: yearlyData.map(d => d.year),
        datasets: [{
          label: 'Balance',
          data: yearlyData.map(d => d.balance),
          borderColor: interestColor,
          borderWidth: 3,
          fill: true,
          backgroundColor: gradient,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointBackgroundColor: interestColor,
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (ctx) => ` Balance: ${this.formatCurrency(ctx.raw)}`
            }
          }
        },
        scales: {
          x: { display: false },
          y: {
            display: false,
            beginAtZero: true
          }
        }
      }
    });
  }

  // Utilities
  formatCurrency(val) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  }

  formatCompact(val) {
    return new Intl.NumberFormat('en-IN', {
      notation: "compact",
      compactDisplay: "short",
      style: 'currency',
      currency: 'INR'
    }).format(val);
  }

  // Helper for input field formatting (commas only, no symbol)
  formatInput(val) {
    if (!val) return '';
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(val);
  }

  async sharePlan() {
    const { emi, totalInterest, totalAmount } = LoanCalculator.calculate(this.state.amount, this.state.rate, this.state.tenureYears);
    const text = `🏠 *Loan EMI Plan*\n\n` +
      `💰 Principal: ${this.formatCurrency(this.state.amount)}\n` +
      `📉 Interest Rate: ${this.state.rate}%\n` +
      `⏳ Tenure: ${this.state.tenureYears} Years\n\n` +
      `� Monthly EMI: ${this.formatCurrency(emi)}\n` +
      `💸 Total Interest: ${this.formatCurrency(totalInterest)}\n` +
      `🏦 Total Payable: ${this.formatCurrency(totalAmount)}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Loan EMI Calculation', text });
      } catch (err) { }
    } else {
      this.copyToClipboard(text);
    }
  }

  copyPlan() {
    const { emi, totalInterest, totalAmount } = LoanCalculator.calculate(this.state.amount, this.state.rate, this.state.tenureYears);
    const text = `🏠 *Loan EMI Plan*\n\n` +
      `💰 Principal: ${this.formatCurrency(this.state.amount)}\n` +
      `📉 Interest Rate: ${this.state.rate}%\n` +
      `⏳ Tenure: ${this.state.tenureYears} Years\n\n` +
      `💵 Monthly EMI: ${this.formatCurrency(emi)}\n` +
      `💸 Total Interest: ${this.formatCurrency(totalInterest)}\n` +
      `🏦 Total Payable: ${this.formatCurrency(totalAmount)}`;
    this.copyToClipboard(text);
  }

  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      const toast = document.getElementById('toast');
      toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
      toast.classList.add('opacity-100', 'translate-y-0');

      setTimeout(() => {
        toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
        toast.classList.remove('opacity-100', 'translate-y-0');
      }, 2000);
    });
  }
}
