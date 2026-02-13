export class ToolCard {
    constructor(tool) {
        this.tool = tool;
    }

    getBadgeHTML() {
        if (!this.tool.badge) return '';

        let badgeClass = '';
        if (this.tool.badgeType === 'new') {
            badgeClass = 'badge-new text-white';
        } else if (this.tool.badgeType === 'popular') {
            badgeClass = 'badge-popular text-white';
        } else if (this.tool.badgeType === 'updated') {
            badgeClass = 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-600';
        }

        return `
            <div class="absolute top-4 right-4 z-20">
                <span class="${badgeClass} text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                    ${this.tool.badge}
                </span>
            </div>
        `;
    }

    render() {
        const { id, title, description, icon, url, color } = this.tool;

        // Dynamic classes are generated based on the 'color' property
        // relying on the custom colors defined in tailwind.config in index.html

        // Actually, let's just use the color name to construct the classes dynamically if possible, 
        // OR just stick to a map for safety and tailwind compilation scanning (though we are using CDN here so it's dynamic).
        // Since it's CDN, dynamic classes like `text-${color}-500` work if they are included in the full build or JIT if configured.
        // We will assume the colors used are standard safe list or just use the map to be safe.

        const iconClass = `text-${color}-500 dark:text-${color}-400`;
        const bgClass = `bg-${color}-50 dark:bg-${color}-900/20`;
        const titleHoverClass = `group-hover:text-${color}-600 dark:group-hover:text-${color}-400`;
        const arrowClass = `text-${color}-500`;

        return `
            <a href="${url}" class="tool-card group relative flex flex-col bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-3xl p-6 overflow-hidden">
                ${this.getBadgeHTML()}

                <div class="flex items-start justify-between mb-4">
                    <div class="w-14 h-14 rounded-2xl ${bgClass} flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <i class="fa-solid ${icon} ${iconClass} text-2xl"></i>
                    </div>
                </div>

                <div class="mt-auto">
                    <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 ${titleHoverClass} transition-colors">
                        ${title}
                    </h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        ${description}
                    </p>
                </div>

                <!-- Hover Arrow -->
                <div class="absolute bottom-6 right-6 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <i class="fa-solid fa-arrow-right ${arrowClass}"></i>
                </div>
            </a>
        `;
    }
}
