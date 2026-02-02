/**
 * Utility to render net worth progression chart on canvas
 */

export class ChartRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
    }

    setupCanvas() {
        // Set canvas size to match display size
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        // Reset transform before scaling to prevent compounding
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);

        this.width = rect.width;
        this.height = rect.height;
        this.padding = { top: 20, right: 20, bottom: 40, left: 60 };
    }

    render(data) {
        if (!this.ctx) return;

        const { strategyA, strategyB, strategyC } = data;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Calculate chart dimensions
        const chartWidth = this.width - this.padding.left - this.padding.right;
        const chartHeight = this.height - this.padding.top - this.padding.bottom;

        // Find max value for Y-axis
        const allValues = [...strategyA, ...strategyB, ...strategyC];
        const maxValue = Math.max(...allValues);
        const minValue = Math.min(...allValues, 0);
        const valueRange = maxValue - minValue;

        // Get number of data points (should be 8 for years 0-7)
        const numPoints = strategyA.length;
        const maxYear = numPoints - 1;

        // Helper functions
        const getX = (year) => this.padding.left + (year / maxYear) * chartWidth;
        const getY = (value) => {
            const normalized = (value - minValue) / valueRange;
            return this.padding.top + chartHeight - (normalized * chartHeight);
        };

        // Draw grid lines
        this.drawGrid(chartWidth, chartHeight, maxValue, minValue, getX, getY);

        // Draw axes
        this.drawAxes(chartWidth, chartHeight, getX, getY, maxValue, minValue, maxYear);

        // Draw lines
        this.drawLine(strategyA, getX, getY, '#94a3b8', 'Debt Hater');
        this.drawLine(strategyB, getX, getY, '#6366f1', 'Smart Investor');
        this.drawLine(strategyC, getX, getY, '#10b981', 'Late Bloomer');
    }

    drawGrid(chartWidth, chartHeight, maxValue, minValue, getX, getY) {
        this.ctx.strokeStyle = getComputedStyle(document.documentElement)
            .getPropertyValue('--color-slate-200') || '#e2e8f0';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([2, 2]);

        // Horizontal grid lines (5 lines)
        for (let i = 0; i <= 5; i++) {
            const value = minValue + (maxValue - minValue) * (i / 5);
            const y = getY(value);

            this.ctx.beginPath();
            this.ctx.moveTo(this.padding.left, y);
            this.ctx.lineTo(this.padding.left + chartWidth, y);
            this.ctx.stroke();
        }

        this.ctx.setLineDash([]);
    }

    drawAxes(chartWidth, chartHeight, getX, getY, maxValue, minValue, maxYear) {
        const isDark = document.documentElement.classList.contains('dark');
        const textColor = isDark ? '#94a3b8' : '#64748b';

        this.ctx.strokeStyle = isDark ? '#475569' : '#cbd5e1';
        this.ctx.lineWidth = 2;
        this.ctx.font = '11px system-ui, -apple-system, sans-serif';
        this.ctx.fillStyle = textColor;
        this.ctx.textAlign = 'center';

        // X-axis
        this.ctx.beginPath();
        this.ctx.moveTo(this.padding.left, this.padding.top + chartHeight);
        this.ctx.lineTo(this.padding.left + chartWidth, this.padding.top + chartHeight);
        this.ctx.stroke();

        // X-axis labels (Years)
        for (let year = 0; year <= maxYear; year++) {
            const x = getX(year);
            this.ctx.fillText(`Yr ${year}`, x, this.padding.top + chartHeight + 20);
        }

        // Y-axis
        this.ctx.beginPath();
        this.ctx.moveTo(this.padding.left, this.padding.top);
        this.ctx.lineTo(this.padding.left, this.padding.top + chartHeight);
        this.ctx.stroke();

        // Y-axis labels (Values)
        this.ctx.textAlign = 'right';

        for (let i = 0; i <= 5; i++) {
            const value = minValue + (maxValue - minValue) * (i / 5);
            const y = getY(value);
            const label = this.formatCurrency(value);
            this.ctx.fillText(label, this.padding.left - 10, y + 4);
        }
    }

    drawLine(data, getX, getY, color, label) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        this.ctx.beginPath();
        data.forEach((value, year) => {
            const x = getX(year);
            const y = getY(value);

            if (year === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        this.ctx.stroke();

        // Draw points
        this.ctx.fillStyle = color;
        data.forEach((value, year) => {
            const x = getX(year);
            const y = getY(value);

            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    formatCurrency(value) {
        if (value >= 10000000) {
            return `₹${(value / 10000000).toFixed(1)}Cr`;
        } else if (value >= 100000) {
            return `₹${(value / 100000).toFixed(1)}L`;
        } else if (value >= 1000) {
            return `₹${(value / 1000).toFixed(0)}K`;
        }
        return `₹${value.toFixed(0)}`;
    }
}
