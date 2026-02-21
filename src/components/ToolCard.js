export class ToolCard {
    constructor(tool) {
        this.tool = tool;
    }

    escapeAttr(value) {
        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('"', '&quot;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;');
    }

    isWithinRange(date, startDate, endDate) {
        if (startDate && date < new Date(`${startDate}T00:00:00`)) return false;
        if (endDate && date > new Date(`${endDate}T23:59:59`)) return false;
        return true;
    }

    getActiveBadge() {
        const now = new Date();
        const badges = Array.isArray(this.tool.badges) ? this.tool.badges : [];

        const activeBadges = badges
            .filter(badge => badge && badge.label && badge.type)
            .filter(badge => this.isWithinRange(now, badge.startDate, badge.endDate))
            .sort((a, b) => (b.priority || 0) - (a.priority || 0));

        if (activeBadges.length > 0) {
            return activeBadges[0];
        }

        // Backward compatibility with legacy fields.
        if (this.tool.badge && this.tool.badgeType) {
            return { label: this.tool.badge, type: this.tool.badgeType };
        }

        return null;
    }

    getBadgeHTML() {
        const badge = this.getActiveBadge();
        if (!badge) return '';

        let badgeClass = '';
        if (badge.type === 'new') {
            badgeClass = 'badge-new text-white';
        } else if (badge.type === 'popular') {
            badgeClass = 'badge-popular text-white';
        } else if (badge.type === 'updated') {
            badgeClass = 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-600';
        } else {
            badgeClass = 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-600';
        }

        return `
            <div class="absolute top-4 right-4 z-20">
                <span class="${badgeClass} text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                    ${badge.label}
                </span>
            </div>
        `;
    }

    render() {
        const { title, description, icon, url, color } = this.tool;

        // Dynamic classes are generated based on the 'color' property
        // relying on the custom colors defined in tailwind.config in index.html

        // Actually, let's just use the color name to construct the classes dynamically if possible, 
        // OR just stick to a map for safety and tailwind compilation scanning (though we are using CDN here so it's dynamic).
        // Since it's CDN, dynamic classes like `text-${color}-500` work if they are included in the full build or JIT if configured.
        // We will assume the colors used are standard safe list or just use the map to be safe.

        const iconClass = `text-${color}-500 dark:text-${color}-400`;
        const bgClass = `bg-${color}-50 dark:bg-${color}-900/20`;
        const arrowClass = `text-${color}-500`;
        const searchText = this.escapeAttr(`${title || ''} ${description || ''}`.toLowerCase());

        return `
            <a href="${url}" data-tool-card="1" data-search="${searchText}" class="tool-card squircle-card group relative z-0 flex flex-col bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 p-6 overflow-hidden shrink-0 snap-start focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-400/60 dark:focus-visible:ring-slate-500/60 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent">
                ${this.getBadgeHTML()}

                <div class="flex items-start justify-between mb-4">
                    <div class="tool-icon-wrap w-14 h-14 rounded-2xl ${bgClass} flex items-center justify-center transition-transform duration-300">
                        <i class="fa-solid ${icon} ${iconClass} text-2xl"></i>
                    </div>
                </div>

                <div class="mt-auto">
                    <h3 class="tool-title text-lg font-bold text-slate-800 dark:text-slate-100 transition-colors">
                        ${title}
                    </h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        ${description}
                    </p>
                </div>

                <!-- Hover Arrow -->
                <div class="tool-arrow absolute bottom-6 right-6 opacity-0 transform translate-x-2 transition-all duration-300">
                    <i class="fa-solid fa-arrow-right ${arrowClass}"></i>
                </div>
            </a>
        `;
    }
}
