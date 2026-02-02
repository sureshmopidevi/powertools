import { AnalysisSection } from '../components/AnalysisSection.js';
import { ComparisonCallout } from '../components/ComparisonCallout.js';
import { EducationalSection } from '../components/EducationalSection.js';
import { Header } from '../components/Header.js';
import { InflationSection } from '../components/InflationSection.js';
import { InputPanel } from '../components/InputPanel.js';
import { NetWorthChart } from '../components/NetWorthChart.js';
import { StrategyCards } from '../components/StrategyCards.js';

export class AppUI {
    static render() {
        const app = document.getElementById('app');
        if (!app) return;

        app.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
                ${Header()}
                
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    <!-- Left Column: Inputs -->
                    ${InputPanel()}

                    <!-- Right Column: Results -->
                    <div class="lg:col-span-8 space-y-8 animate-enter delay-200">
                        ${StrategyCards()}
                        ${ComparisonCallout()}
                        ${NetWorthChart()}
                        ${AnalysisSection()}
                        ${EducationalSection()}
                        ${InflationSection()}
                    </div>
                </div>
            </div>
        `;
    }
}
