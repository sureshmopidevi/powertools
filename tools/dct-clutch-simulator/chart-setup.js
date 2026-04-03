/* ═══════════════════════════════════════════════════════════════
   CHART — Chart.js time-series for C1 & C2 temperatures
   Depends on: simulation.js (tempHistC1, tempHistC2, timeHist, PHY)
   ═══════════════════════════════════════════════════════════════ */

'use strict';

const chartCtx = document.getElementById('chart').getContext('2d');
const chartInst = new Chart(chartCtx, {
  type: 'line',
  data: {
    labels: timeHist,
    datasets: [
      { label: 'C1 (Odd gears)', data: tempHistC1, borderColor: '#00d4c8', backgroundColor: 'rgba(0,212,200,.05)', borderWidth: 1.8, pointRadius: 0, tension: 0.4, fill: true },
      { label: 'C2 (Even gears)', data: tempHistC2, borderColor: '#a78bfa', backgroundColor: 'rgba(167,139,250,.04)', borderWidth: 1.8, pointRadius: 0, tension: 0.4, fill: false },
      { label: 'TCU Warn 180°', data: [], borderColor: '#f59e0b', borderWidth: 1, borderDash: [4, 4], pointRadius: 0, fill: false },
      { label: 'Limp 260°', data: [], borderColor: '#ef4444', borderWidth: 1, borderDash: [3, 3], pointRadius: 0, fill: false },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: true, position: 'top', labels: { color: '#5a6075', font: { size: 10, family: 'DM Mono' }, boxWidth: 12, padding: 10 } },
      tooltip: { callbacks: { label: c => `${c.dataset.label}: ${typeof c.parsed.y === 'number' ? c.parsed.y.toFixed(1) + '°C' : '—'}` } },
    },
    scales: {
      x: { ticks: { color: '#5a6075', font: { size: 9 }, maxTicksLimit: 8 }, grid: { color: 'rgba(128,128,128,.05)' }, border: { display: false } },
      y: { min: 50, max: 320, ticks: { color: '#5a6075', font: { size: 9 } }, grid: { color: 'rgba(128,128,128,.07)' }, border: { display: false } },
    },
  },
});

function updateChart() {
  chartInst.data.datasets[0].data = [...tempHistC1];
  chartInst.data.datasets[1].data = [...tempHistC2];
  chartInst.data.labels = [...timeHist];
  const n = timeHist.length;
  chartInst.data.datasets[2].data = Array(n).fill(PHY.T_warn);
  chartInst.data.datasets[3].data = Array(n).fill(PHY.T_limp);
  chartInst.update('none');
}
