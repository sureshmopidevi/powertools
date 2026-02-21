import { ToolCard } from './ToolCard.js';

export class Section {
    constructor({ title, tools, delay = 0, query = '', animate = false }) {
        this.title = title;
        this.tools = Array.isArray(tools) ? tools : [];
        this.delay = delay;
        this.query = (query || '').trim().toLowerCase();
        this.animate = Boolean(animate);
    }

    getFilteredTools() {
        if (!this.query) return this.tools;

        return this.tools.filter((tool) => {
            const title = (tool.title || '').toLowerCase();
            const description = (tool.description || '').toLowerCase();
            return title.includes(this.query) || description.includes(this.query);
        });
    }

    render() {
        const filteredTools = this.getFilteredTools();
        if (filteredTools.length === 0) return '';

        const toolCardsHTML = filteredTools.map(tool => {
            const card = new ToolCard(tool);
            return card.render();
        }).join('');

        const delayClass = this.delay > 0 ? `delay-${this.delay}` : '';
        const animationClass = this.animate ? `animate-fade-in-up ${delayClass}` : '';

        return `
            <section class="mb-12 ${animationClass}">
                <div class="relative z-20 flex items-center gap-3 mb-7 px-1">
                    <div class="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent w-full"></div>
                    <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">
                        ${this.title}
                    </span>
                    <div class="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent w-full"></div>
                </div>

                <div class="horizontal-row relative z-10 overflow-x-auto pt-1 pb-2 -mx-1 px-1">
                    <div class="flex items-stretch gap-4 sm:gap-5 xl:gap-6 snap-x snap-mandatory">
                        ${toolCardsHTML}
                    </div>
                </div>
            </section>
        `;
    }
}
