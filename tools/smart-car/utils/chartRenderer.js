/**
 * Utility to render net worth progression chart on canvas
 */

export class ChartRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');

        // Initialize resize observer to handle responsive layout changes
        // This ensures the chart stays crisp and correctly sized when window resizes
        this.resizeObserver = new ResizeObserver(() => {
            this.setupCanvas();
            if (this.lastData) {
                this.render(this.lastData);
            }
        });
        this.resizeObserver.observe(this.canvas);

        this.setupCanvas();

        // Tooltip state
        this.hoveredYear = -1;
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    }

    handleMouseMove(e) {
        if (!this.lastData) return;

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;

        const chartWidth = this.width - this.padding.left - this.padding.right;
        const numPoints = this.lastData.strategyA.length;
        const maxYear = numPoints - 1;

        // Calculate closest year
        let year = Math.round(((mouseX - this.padding.left) / chartWidth) * maxYear);
        year = Math.max(0, Math.min(year, maxYear));

        if (this.hoveredYear !== year) {
            this.hoveredYear = year;
            this.render(this.lastData);
        }
    }

    handleMouseLeave() {
        if (this.hoveredYear !== -1) {
            this.hoveredYear = -1;
            this.render(this.lastData);
        }
    }

    setupCanvas() {
        // Set canvas size to match display size
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        // Avoid unnecessary context resets if size hasn't changed
        const currentWidth = rect.width * dpr;
        const currentHeight = rect.height * dpr;

        if (Math.abs(this.canvas.width - currentWidth) < 1 &&
            Math.abs(this.canvas.height - currentHeight) < 1) {
            this.width = rect.width;
            this.height = rect.height;
            return;
        }

        this.canvas.width = currentWidth;
        this.canvas.height = currentHeight;

        // Reset transform before scaling to prevent compounding
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);

        this.width = rect.width;
        this.height = rect.height;
        this.padding = { top: 20, right: 20, bottom: 40, left: 60 };
    }

    render(data) {
        if (!this.ctx) return;

        // specific check to ensure size is correct before rendering this frame
        this.setupCanvas();
        this.lastData = data;

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

        // Draw Tooltip if active
        if (this.hoveredYear !== -1 && this.hoveredYear !== undefined) {
            this.drawTooltip(this.hoveredYear, data, getX, getY);
        }
    }

    drawTooltip(year, data, getX, getY) {
        const { strategyA, strategyB, strategyC } = data;
        const x = getX(year);
        const yTop = this.padding.top;
        const yBottom = this.height - this.padding.bottom;

        // 1. Draw vertical line
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(x, yTop);
        this.ctx.lineTo(x, yBottom);
        this.ctx.strokeStyle = document.documentElement.classList.contains('dark') ? '#475569' : '#cbd5e1';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([4, 4]);
        this.ctx.stroke();
        this.ctx.restore();

        // 2. Draw points at intersection
        const drawPoint = (val, color) => {
            const y = getY(val);
            this.ctx.beginPath();
            this.ctx.arc(x, y, 6, 0, Math.PI * 2);
            this.ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#1e293b' : '#ffffff';
            this.ctx.fill();
            this.ctx.lineWidth = 3;
            this.ctx.strokeStyle = color;
            this.ctx.stroke();
        };

        drawPoint(strategyA[year], '#94a3b8');
        drawPoint(strategyB[year], '#6366f1');
        drawPoint(strategyC[year], '#10b981');

        // 3. Draw Tooltip Box
        const padding = 12;
        const lineHeight = 20;
        const boxWidth = 200;
        const boxHeight = padding * 2 + lineHeight * 4; // Header + 3 rows

        let boxX = x + 15;
        let boxY = yTop;

        // Flip if too close to right edge
        if (boxX + boxWidth > this.width - 10) {
            boxX = x - boxWidth - 15;
        }

        const isDark = document.documentElement.classList.contains('dark');
        const bgColor = isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)';
        const borderColor = isDark ? '#475569' : '#e2e8f0';
        const txtColor = isDark ? '#f1f5f9' : '#0f172a';
        const subColor = isDark ? '#94a3b8' : '#64748b';

        // Shadow and Box
        this.ctx.save();
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetY = 4;

        this.ctx.fillStyle = bgColor;
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = 1;

        this.roundRect(boxX, boxY, boxWidth, boxHeight, 8);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();

        // Text
        this.ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
        this.ctx.fillStyle = txtColor;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(`Year ${year}`, boxX + padding, boxY + padding + 6);

        this.ctx.font = '12px system-ui, sans-serif';

        const drawRow = (label, val, color, idx) => {
            const rowY = boxY + padding + 10 + (idx + 1) * lineHeight;

            // Color dot
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(boxX + padding + 5, rowY, 3, 0, Math.PI * 2);
            this.ctx.fill();

            // Label
            this.ctx.fillStyle = subColor;
            this.ctx.fillText(label, boxX + padding + 15, rowY);

            // Value
            this.ctx.fillStyle = txtColor;
            this.ctx.textAlign = 'right';
            this.ctx.fillText(this.formatCurrency(val), boxX + boxWidth - padding, rowY);
            this.ctx.textAlign = 'left';
        };

        drawRow('Debt Hater', strategyA[year], '#94a3b8', 0);
        drawRow('Smart Investor', strategyB[year], '#6366f1', 1);
        drawRow('Late Bloomer', strategyC[year], '#10b981', 2);
    }

    roundRect(x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x + r, y);
        this.ctx.arcTo(x + w, y, x + w, y + h, r);
        this.ctx.arcTo(x + w, y + h, x, y + h, r);
        this.ctx.arcTo(x, y + h, x, y, r);
        this.ctx.arcTo(x, y, x + w, y, r);
        this.ctx.closePath();
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
