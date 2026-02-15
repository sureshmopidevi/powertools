
import { ThemeManager } from '../../../src/lib/theme.js';
import { NetWorthCalculator } from './calculator.js';
import { StorageManager } from './storage.js';

export class AppUI {
  constructor() {
    this.storage = new StorageManager();
    this.state = {
      view: 'dashboard',
      items: [],
      snapshots: [],
      recurring: [],
      currency: '₹',
      ageGroup: '30-35'
    };

    this.contentArea = document.getElementById('content-area');
    this.sidebar = document.getElementById('sidebar');
    this.charts = { allocation: null, trend: null };
  }

  async render() {
    await this.storage.init();
    await this.loadData();

    this.initSidebar();
    this.initMobileMenu();
    this.renderView();

    new ThemeManager('themeToggle');
  }

  async loadData() {
    this.state.items = await this.storage.getAllItems();
    this.state.snapshots = await this.storage.getAllSnapshots();
    this.state.recurring = await this.storage.getAllRecurring();
    // Default items if empty
    if (this.state.items.length === 0 && this.state.snapshots.length === 0) {
      await this.seedInitialData();
    }
  }

  async seedInitialData() {
    const initialItems = [
      { type: 'asset', category: 'Cash', name: 'Savings Account', value: 50000 },
      { type: 'liability', category: 'Credit Card', name: 'Primary Card', value: 5000 }
    ];
    for (const item of initialItems) {
      await this.storage.saveItem(item);
    }
    this.state.items = await this.storage.getAllItems();
  }

  initSidebar() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const view = link.dataset.view;
        this.switchView(view);

        // Close mobile menu if open
        this.sidebar.classList.add('hidden');
        this.sidebar.classList.remove('fixed', 'inset-0', 'bg-white', 'dark:bg-slate-900');
      });
    });
  }

  initMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        this.sidebar.classList.toggle('hidden');
        this.sidebar.classList.add('fixed', 'inset-0', 'z-50');
      });
    }
  }

  switchView(view) {
    this.state.view = view;

    // Update active state in sidebar
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.dataset.view === view) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    this.renderView();
  }

  renderView() {
    this.contentArea.innerHTML = '';
    this.contentArea.className = 'p-4 md:p-8 max-w-7xl mx-auto animate-enter';

    switch (this.state.view) {
      case 'dashboard':
        this.renderDashboard();
        break;
      case 'assets':
        this.renderItemList('asset');
        break;
      case 'liabilities':
        this.renderItemList('liability');
        break;
      case 'recurring':
        this.renderRecurring();
        break;
      case 'history':
        this.renderHistory();
        break;
    }
  }

  // --- Dashboard View ---
  renderDashboard() {
    const { totalAssets, totalLiabilities, netWorth } = NetWorthCalculator.calculate(this.state.items);
    const trend = NetWorthCalculator.getTrend(this.state.snapshots);

    this.contentArea.innerHTML = `
            <div class="space-y-8">
                <header>
                    <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Financial Overview</h2>
                    <p class="text-slate-500 dark:text-slate-400 font-medium">Welcome back to your wealth dashboard</p>
                </header>

                <!-- Stats Grid -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="nebula-card p-6">
                        <p class="text-label">Total Net Worth</p>
                        <h3 class="text-metric">${this.formatVal(netWorth)}</h3>
                        <div class="mt-2 flex items-center gap-1.5 text-xs font-bold ${trend.direction === 'up' ? 'text-emerald-500' : 'text-rose-500'}">
                            <i class="fa-solid fa-arrow-${trend.direction}"></i>
                            <span>${trend.change}%</span>
                            <span class="text-slate-400 font-normal">vs last snapshot</span>
                        </div>
                    </div>
                    <div class="nebula-card p-6">
                        <p class="text-label">Total Assets</p>
                        <h3 class="text-metric">${this.formatVal(totalAssets)}</h3>
                        <p class="mt-2 text-xs text-slate-400">${this.state.items.filter(i => i.type === 'asset').length} distinct items</p>
                    </div>
                    <div class="nebula-card p-6">
                        <p class="text-label">Total Liabilities</p>
                        <h3 class="text-metric">${this.formatVal(totalLiabilities)}</h3>
                        <p class="mt-2 text-xs text-slate-400">${this.state.items.filter(i => i.type === 'liability').length} distinct items</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Allocation -->
                    <!-- Allocation -->
                    <div class="nebula-card p-8">
                        <h4 class="text-label mb-8">Asset Allocation</h4>
                        <div class="h-64">
                            <canvas id="allocationChart"></canvas>
                        </div>
                    </div>
                    
                    <!-- Recent Activity / Benchmarks -->
                    <div class="space-y-6">
                         <div class="nebula-card p-8 bg-gradient-to-br from-gold-50/50 to-white dark:from-slate-800/50 dark:to-slate-900">
                            <h4 class="text-label text-gold-600 dark:text-gold-400 mb-4">Milestones</h4>
                            <div id="milestoneContainer" class="flex flex-wrap gap-2"></div>
                         </div>
                         
                         <div class="nebula-card p-8">
                            <h4 class="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest mb-6">Recent Items</h4>
                            <div class="space-y-4">
                                ${this.state.items.slice(0, 4).map(item => `
                                    <div class="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                <i class="fa-solid ${item.type === 'asset' ? 'fa-arrow-up text-emerald-500' : 'fa-arrow-down text-rose-500'} text-[10px]"></i>
                                            </div>
                                            <div>
                                                <p class="text-sm font-bold text-slate-700 dark:text-slate-200">${item.name}</p>
                                                <p class="text-[10px] text-slate-400 uppercase">${item.category}</p>
                                            </div>
                                        </div>
                                        <p class="text-sm font-black text-slate-900 dark:text-white">${this.formatVal(item.value)}</p>
                                    </div>
                                `).join('')}
                            </div>
                         </div>
                    </div>
                </div>

                <div class="flex justify-end pt-4">
                    <button id="takeSnapshot" class="nebula-btn nebula-btn-primary px-8 py-4 rounded-xl shadow-lg shadow-gold-500/10">
                        <i class="fa-solid fa-camera"></i>
                        Capture Today's Snapshot
                    </button>
                </div>
            </div>
        `;

    this.renderCharts(totalAssets, totalLiabilities);
    this.renderMilestones(netWorth);

    document.getElementById('takeSnapshot').addEventListener('click', () => this.takeSnapshot());
  }

  // --- Item List View ---
  renderItemList(type) {
    const items = this.state.items.filter(i => i.type === type);
    const title = type === 'asset' ? 'Assets' : 'Liabilities';
    const colorClass = type === 'asset' ? 'emerald' : 'rose';
    const categories = type === 'asset'
      ? ['Cash', 'Bank', 'Stock', 'Mutual Fund', 'Real Estate', 'Gold', 'Other']
      : ['Credit Card', 'Home Loan', 'Car Loan', 'Personal Loan', 'Other'];

    this.contentArea.innerHTML = `
            <div class="space-y-8">
                <header class="flex justify-between items-end">
                    <div>
                        <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">${title}</h2>
                        <p class="text-slate-500 dark:text-slate-400 font-medium">Manage your individual ${type} entries</p>
                    </div>
                    <button id="addNewItem" class="nebula-btn nebula-btn-primary">
                        <i class="fa-solid fa-plus"></i> Add ${type}
                    </button>
                </header>

                <div class="nebula-table-container">
                    <table class="nebula-table">
                        <thead>
                            <tr>
                                <th class="w-1/3">Name</th>
                                <th class="w-1/4">Category</th>
                                <th class="w-1/4">Value</th>
                                <th class="w-48 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items.map(item => `
                                <tr>
                                    <td>
                                        <p class="font-bold text-slate-800 dark:text-white">${item.name}</p>
                                    </td>
                                    <td>
                                        <span class="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-bold text-slate-500 uppercase">${item.category}</span>
                                    </td>
                                    <td class="font-mono font-bold text-slate-900 dark:text-white">
                                        ${this.formatVal(item.value)}
                                    </td>
                                    <td class="text-right space-x-2">
                                        <button data-id="${item.id}" class="edit-item nebula-btn-ghost">
                                            <i class="fa-solid fa-pen-to-square"></i>
                                        </button>
                                        <button data-id="${item.id}" class="delete-item nebula-btn-ghost hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                            ${items.length === 0 ? `<tr><td colspan="4" class="text-center py-12 text-slate-400 italic">No entries found. Add your first ${type} above.</td></tr>` : ''}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Modal Shadow -->
            <div id="itemModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center hidden">
                <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-enter mx-4">
                    <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 class="font-black text-xl text-slate-800 dark:text-white" id="modalTitle">Add ${title}</h3>
                        <button id="closeModal" class="nebula-btn-ghost"><i class="fa-solid fa-times"></i></button>
                    </div>
                    <form id="itemForm" class="p-6 space-y-4">
                        <input type="hidden" id="itemId">
                        <div>
                            <label class="nebula-label">Item Name</label>
                            <input type="text" id="itemName" required placeholder="e.g. HDFC Salary Account" class="nebula-input">
                        </div>
                        <div>
                            <label class="nebula-label">Category</label>
                            <select id="itemCategory" class="nebula-input appearance-none">
                                ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="nebula-label">Value (${this.state.currency})</label>
                            <input type="number" id="itemValue" required placeholder="0.00" class="nebula-input font-mono">
                        </div>
                        <button type="submit" class="w-full nebula-btn nebula-btn-primary mt-4">
                            Save Entry
                        </button>
                    </form>
                </div>
            </div>
        `;

    this.attachItemListeners(type);
  }

  // --- History View ---
  renderHistory() {
    this.contentArea.innerHTML = `
            <div class="space-y-8">
                <header class="flex justify-between items-end">
                    <div>
                        <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">History</h2>
                        <p class="text-slate-500 dark:text-slate-400 font-medium">Historical snapshots of your net worth</p>
                    </div>
                </header>

                <div class="nebula-table-container">
                    <table class="nebula-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Total Assets</th>
                                <th>Total Liabilities</th>
                                <th>Net Worth</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.state.snapshots.reverse().map(snap => `
                                <tr>
                                    <td class="font-bold text-slate-800 dark:text-white">${new Date(snap.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                    <td class="text-emerald-500 font-bold">${this.formatVal(snap.totalAssets)}</td>
                                    <td class="text-rose-500 font-bold">${this.formatVal(snap.totalLiabilities)}</td>
                                    <td class="font-black text-slate-900 dark:text-white">${this.formatVal(snap.netWorth)}</td>
                                    <td class="text-right">
                                        <button data-date="${snap.date}" class="delete-snapshot nebula-btn-ghost hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                            ${this.state.snapshots.length === 0 ? `<tr><td colspan="5" class="text-center py-12 text-slate-400 italic">No snapshots yet. Take your first one from the dashboard.</td></tr>` : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

    document.querySelectorAll('.delete-snapshot').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (confirm('Delete this historical snapshot?')) {
          await this.storage.deleteSnapshot(btn.dataset.date);
          await this.loadData();
          this.renderView();
        }
      });
    });
  }

  // --- Recurring Transactions View ---
  renderRecurring() {
    const recurring = this.state.recurring;
    const totalMonthlyOutflow = this.getMonthlyRecurringTotal('expense');
    const totalMonthlyInflow = this.getMonthlyRecurringTotal('income');

    this.contentArea.innerHTML = `
            <div class="space-y-8">
                <header class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Recurring Transactions</h2>
                        <p class="text-slate-500 dark:text-slate-400 font-medium">Track subscriptions, SIPs, EMIs and automated flows</p>
                    </div>
                    <button id="addRecurringBtn" class="nebula-btn nebula-btn-primary">
                        <i class="fa-solid fa-plus"></i> Add recurring
                    </button>
                </header>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="nebula-card p-6">
                        <p class="text-label">Total Active</p>
                        <h3 class="text-metric">${recurring.filter(r => r.status === 'active').length}</h3>
                        <p class="mt-2 text-xs text-slate-400">Recurring items running now</p>
                    </div>
                    <div class="nebula-card p-6">
                        <p class="text-label">Monthly Outflow</p>
                        <h3 class="text-metric text-rose-500">${this.formatVal(totalMonthlyOutflow)}</h3>
                        <p class="mt-2 text-xs text-slate-400">Subscriptions, SIPs, EMIs, etc.</p>
                    </div>
                    <div class="nebula-card p-6">
                        <p class="text-label">Monthly Inflow</p>
                        <h3 class="text-metric text-emerald-500">${this.formatVal(totalMonthlyInflow)}</h3>
                        <p class="mt-2 text-xs text-slate-400">Salary, rent, and other recurring credits</p>
                    </div>
                </div>

                <div class="nebula-table-container overflow-x-auto">
                    <table class="nebula-table w-full">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Direction</th>
                                <th>Cycle</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${recurring.map(entry => `
                                <tr>
                                    <td>
                                        <p class="font-bold text-slate-800 dark:text-white">${entry.name}</p>
                                        <p class="text-xs text-slate-400">${entry.note || ''}</p>
                                    </td>
                                    <td><span class="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-bold text-slate-500 uppercase">${entry.type}</span></td>
                                    <td class="${entry.direction === 'income' ? 'text-emerald-500' : 'text-rose-500'} font-bold uppercase text-xs">${entry.direction}</td>
                                    <td class="uppercase text-xs font-bold text-slate-500">${entry.cycle}</td>
                                    <td class="font-mono font-bold text-slate-900 dark:text-white">${this.formatVal(entry.amount)}</td>
                                    <td>
                                        <span class="nebula-badge ${entry.status === 'active' ? 'nebula-badge-warning' : 'nebula-badge-neutral'}">${entry.status}</span>
                                    </td>
                                    <td class="text-right space-x-2">
                                        <button data-id="${entry.id}" class="edit-recurring nebula-btn-ghost">
                                            <i class="fa-solid fa-pen-to-square"></i>
                                        </button>
                                        <button data-id="${entry.id}" class="delete-recurring nebula-btn-ghost hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                            ${recurring.length === 0 ? `<tr><td colspan="7" class="text-center py-12 text-slate-400 italic">No recurring transactions yet.</td></tr>` : ''}
                        </tbody>
                    </table>
                </div>
            </div>

            <div id="recurringModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center hidden">
                <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-enter mx-4">
                    <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 class="font-black text-xl text-slate-800 dark:text-white" id="recurringModalTitle">Add Recurring</h3>
                        <button id="closeRecurringModal" class="nebula-btn-ghost"><i class="fa-solid fa-times"></i></button>
                    </div>
                    <form id="recurringForm" class="p-6 space-y-4">
                        <input type="hidden" id="recurringId">
                        <div class="form-field">
                            <label class="nebula-label">Name</label>
                            <input id="recurringName" class="nebula-input" required placeholder="Netflix, SIP - Nifty 50, Home EMI">
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="form-field">
                                <label class="nebula-label">Type</label>
                                <select id="recurringType" class="nebula-input">
                                    <option value="subscription">Subscription</option>
                                    <option value="sip">SIP</option>
                                    <option value="emi">EMI</option>
                                    <option value="insurance">Insurance</option>
                                    <option value="salary">Salary</option>
                                    <option value="rent">Rent</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div class="form-field">
                                <label class="nebula-label">Direction</label>
                                <select id="recurringDirection" class="nebula-input">
                                    <option value="expense">Expense</option>
                                    <option value="income">Income</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="form-field">
                                <label class="nebula-label">Cycle</label>
                                <select id="recurringCycle" class="nebula-input">
                                    <option value="monthly">Monthly</option>
                                    <option value="quarterly">Quarterly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>
                            <div class="form-field">
                                <label class="nebula-label">Status</label>
                                <select id="recurringStatus" class="nebula-input">
                                    <option value="active">Active</option>
                                    <option value="paused">Paused</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-field">
                            <label class="nebula-label">Amount (${this.state.currency})</label>
                            <input id="recurringAmount" type="number" min="0" step="0.01" class="nebula-input font-mono" required>
                        </div>
                        <div class="form-field">
                            <label class="nebula-label">Note (optional)</label>
                            <input id="recurringNote" class="nebula-input" placeholder="Paid on 5th of every month">
                        </div>
                        <button class="w-full nebula-btn nebula-btn-primary" type="submit">Save recurring transaction</button>
                    </form>
                </div>
            </div>
        `;

    this.attachRecurringListeners();
  }

  // --- Actions & Helpers ---
  attachRecurringListeners() {
    const modal = document.getElementById('recurringModal');
    const form = document.getElementById('recurringForm');

    document.getElementById('addRecurringBtn').addEventListener('click', () => {
      form.reset();
      document.getElementById('recurringId').value = '';
      document.getElementById('recurringStatus').value = 'active';
      document.getElementById('recurringModalTitle').textContent = 'Add Recurring';
      modal.classList.remove('hidden');
    });

    document.getElementById('closeRecurringModal').addEventListener('click', () => modal.classList.add('hidden'));

    document.querySelectorAll('.edit-recurring').forEach(btn => {
      btn.addEventListener('click', () => {
        const entry = this.state.recurring.find(r => r.id === btn.dataset.id);
        if (!entry) return;
        document.getElementById('recurringId').value = entry.id;
        document.getElementById('recurringName').value = entry.name;
        document.getElementById('recurringType').value = entry.type;
        document.getElementById('recurringDirection').value = entry.direction;
        document.getElementById('recurringCycle').value = entry.cycle;
        document.getElementById('recurringStatus').value = entry.status;
        document.getElementById('recurringAmount').value = entry.amount;
        document.getElementById('recurringNote').value = entry.note || '';
        document.getElementById('recurringModalTitle').textContent = 'Edit Recurring';
        modal.classList.remove('hidden');
      });
    });

    document.querySelectorAll('.delete-recurring').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (confirm('Delete this recurring transaction?')) {
          await this.storage.deleteRecurring(btn.dataset.id);
          await this.loadData();
          this.renderView();
        }
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const entry = {
        id: document.getElementById('recurringId').value || null,
        name: document.getElementById('recurringName').value.trim(),
        type: document.getElementById('recurringType').value,
        direction: document.getElementById('recurringDirection').value,
        cycle: document.getElementById('recurringCycle').value,
        status: document.getElementById('recurringStatus').value,
        amount: parseFloat(document.getElementById('recurringAmount').value) || 0,
        note: document.getElementById('recurringNote').value.trim()
      };

      await this.storage.saveRecurring(entry);
      await this.loadData();
      modal.classList.add('hidden');
      this.renderView();
    });
  }

  attachItemListeners(type) {
    const modal = document.getElementById('itemModal');
    const form = document.getElementById('itemForm');

    document.getElementById('addNewItem').addEventListener('click', () => {
      form.reset();
      document.getElementById('itemId').value = '';
      document.getElementById('modalTitle').textContent = `Add ${type === 'asset' ? 'Asset' : 'Liability'}`;
      modal.classList.remove('hidden');
    });

    document.getElementById('closeModal').addEventListener('click', () => modal.classList.add('hidden'));

    document.querySelectorAll('.edit-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = this.state.items.find(i => i.id === btn.dataset.id);
        document.getElementById('itemId').value = item.id;
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemCategory').value = item.category;
        document.getElementById('itemValue').value = item.value;
        document.getElementById('modalTitle').textContent = `Edit Entry`;
        modal.classList.remove('hidden');
      });
    });

    document.querySelectorAll('.delete-item').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (confirm('Permanently delete this entry?')) {
          await this.storage.deleteItem(btn.dataset.id);
          await this.loadData();
          this.renderView();
        }
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const item = {
        id: document.getElementById('itemId').value || null,
        type: type,
        name: document.getElementById('itemName').value,
        category: document.getElementById('itemCategory').value,
        value: parseFloat(document.getElementById('itemValue').value) || 0
      };
      await this.storage.saveItem(item);
      await this.loadData();
      modal.classList.add('hidden');
      this.renderView();
    });
  }

  async takeSnapshot() {
    const { totalAssets, totalLiabilities, netWorth } = NetWorthCalculator.calculate(this.state.items);
    const snapshot = {
      date: new Date().toISOString().split('T')[0],
      totalAssets,
      totalLiabilities,
      netWorth
    };
    await this.storage.saveSnapshot(snapshot);
    await this.loadData();
    alert('Snapshot saved successfully!');
    this.renderView();
  }

  renderCharts(assets, liabilities) {
    const isDark = document.documentElement.classList.contains('dark');
    const colors = {
      gold: '#eab308',
      emerald: '#10b981',
      rose: '#f43f5e',
      slate: isDark ? '#94a3b8' : '#64748b'
    };

    if (this.charts.allocation) this.charts.allocation.destroy();
    const ctx = document.getElementById('allocationChart')?.getContext('2d');
    if (!ctx) return;

    this.charts.allocation = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Assets', 'Liabilities'],
        datasets: [{
          data: [assets, liabilities],
          backgroundColor: [colors.emerald, colors.rose],
          borderWidth: 0,
          hoverOffset: 10
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
              font: { family: 'Plus Jakarta Sans', size: 12, weight: 'bold' },
              color: colors.slate
            }
          }
        },
        cutout: '70%',
        animation: { animateScale: true }
      }
    });
  }

  renderMilestones(netWorth) {
    const milestones = [
      { amount: 1000000, label: '₹10 Lakh' },
      { amount: 10000000, label: '₹1 Crore' },
      { amount: 100000000, label: '₹10 Crore' }
    ];

    const achieved = milestones.filter(m => netWorth >= m.amount);
    const container = document.getElementById('milestoneContainer');
    if (!container) return;

    if (achieved.length > 0) {
      container.innerHTML = achieved.map(m => `
        <div class="nebula-badge nebula-badge-warning gap-1.5 px-3 py-1.5 rounded-lg">
            <i class="fa-solid fa-crown text-xs"></i>
            <span class="uppercase tracking-wider font-bold">${m.label} Club</span>
        </div>
      `).join('');
    } else {
      container.innerHTML = `<p class="text-xs text-slate-400 italic">No milestones achieved yet. Keep growing!</p>`;
    }
  }

  formatVal(val) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  }

  getMonthlyRecurringTotal(direction) {
    const factor = { monthly: 1, quarterly: 1 / 3, yearly: 1 / 12 };
    return this.state.recurring
      .filter(entry => entry.status === 'active' && entry.direction === direction)
      .reduce((sum, entry) => {
        const cycleFactor = factor[entry.cycle] || 1;
        return sum + (entry.amount * cycleFactor);
      }, 0);
  }
}
