import { ToolCard } from './ToolCard.js';

export class Section {
    constructor(title, tools, delay = 0) {
        this.title = title;
        this.tools = tools;
        this.delay = delay;
    }

    render() {
        const toolCardsHTML = this.tools.map(tool => {
            const card = new ToolCard(tool);
            return card.render();
        }).join('');

        const delayClass = this.delay > 0 ? `delay-${this.delay}` : '';

        return `
            <section class="mb-12 animate-fade-in-up ${delayClass}">
                <div class="flex items-center gap-3 mb-6 px-1">
                    <div class="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent w-full"></div>
                    <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">
                        ${this.title}
                    </span>
                    <div class="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent w-full"></div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    ${toolCardsHTML}
                </div>
            </section>
        `;
    }
}
