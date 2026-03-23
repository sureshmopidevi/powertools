// =========================================
// THEME TOGGLE
// =========================================
(function () {
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = 'dark'; // default dark
  root.setAttribute('data-theme', theme);

  toggle.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', theme);
    toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
    toggle.innerHTML = theme === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    // Rebuild charts for theme
    rebuildCharts();
  });
})();

// =========================================
// CHART HELPERS
// =========================================
function getChartTextColor() {
  return getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim() || '#e6edf3';
}
function getChartGridColor() {
  return getComputedStyle(document.documentElement).getPropertyValue('--color-border').trim() || '#30363d';
}
function getChartBgColor() {
  return getComputedStyle(document.documentElement).getPropertyValue('--color-surface').trim() || '#161b22';
}

const brandColors = DATA.cars.map(c => c.color);
const brandColorsAlpha = DATA.cars.map(c => c.color + '33');

let priceChartInstance, safetyRadarInstance, perfRadarInstance;

function buildPriceChart() {
  const ctx = document.getElementById('priceChart').getContext('2d');
  if (priceChartInstance) priceChartInstance.destroy();

  const textColor = getChartTextColor();
  const gridColor = getChartGridColor();

  priceChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: DATA.cars.map(c => c.short),
      datasets: [
        {
          label: 'Starting Price (₹L)',
          data: DATA.cars.map(c => c.priceMin),
          backgroundColor: brandColors.map(c => c + 'cc'),
          borderColor: brandColors,
          borderWidth: 2,
          borderRadius: 6,
          barPercentage: 0.7,
          categoryPercentage: 0.8
        },
        {
          label: 'Top Variant (₹L)',
          data: DATA.cars.map(c => c.priceMax),
          backgroundColor: brandColors.map(c => c + '55'),
          borderColor: brandColors.map(c => c + 'aa'),
          borderWidth: 2,
          borderRadius: 6,
          borderDash: [4, 4],
          barPercentage: 0.7,
          categoryPercentage: 0.8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: { family: "'Plus Jakarta Sans'", size: 12, weight: '600' },
            usePointStyle: true,
            pointStyle: 'rectRounded',
            padding: 20
          },
          position: 'top'
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.88)',
          titleFont: { family: "'Plus Jakarta Sans'", size: 13, weight: 'bold' },
          bodyFont: { family: "'Inter'", size: 12 },
          padding: 14,
          cornerRadius: 12,
          callbacks: {
            label: ctx => ctx.dataset.label + ': ₹' + ctx.parsed.y.toFixed(2) + 'L'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 24,
          grid: { color: gridColor + '44' },
          ticks: { color: textColor, font: { family: "'Inter'", weight: '500' }, callback: v => '₹' + v + 'L' }
        },
        x: {
          grid: { display: false },
          ticks: { color: textColor, font: { family: "'Plus Jakarta Sans'", weight: '700', size: 11 } }
        }
      }
    }
  });
}

function buildSafetyRadar() {
  const ctx = document.getElementById('safetyRadar').getContext('2d');
  if (safetyRadarInstance) safetyRadarInstance.destroy();

  const textColor = getChartTextColor();

  // Normalize: NCAP(0-5 → 0-100), ADAS(bool → 0/100), 360cam(bool → 0/100), Airbags(6 → normalize), Disc(bool → 0/100)
  const datasets = DATA.cars.map((car) => ({
    label: car.short,
    data: [
      car.ncap * 20,
      car.adas ? 100 : 0,
      car.cam360 ? 100 : 0,
      (car.airbags / 6) * 100,
      car.allDisc ? 100 : (car.discNote.includes('only') ? 50 : 0)
    ],
    borderColor: car.color,
    backgroundColor: car.color + '18',
    borderWidth: 2,
    pointRadius: 4,
    pointBackgroundColor: car.color,
    pointBorderColor: car.color
  }));

  safetyRadarInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['NCAP Rating', 'ADAS', '360° Camera', 'Airbags', 'Disc Brakes'],
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: textColor, font: { family: "'Plus Jakarta Sans'", size: 11, weight: '600' }, usePointStyle: true, padding: 12 } }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: { display: false },
          grid: { color: textColor + '15' },
          pointLabels: { color: textColor, font: { family: "'Plus Jakarta Sans'", size: 11, weight: '700' } },
          angleLines: { color: textColor + '15' }
        }
      }
    }
  });
}

function buildPerfRadar() {
  const ctx = document.getElementById('perfRadar').getContext('2d');
  if (perfRadarInstance) perfRadarInstance.destroy();

  const textColor = getChartTextColor();

  // Normalize to 0-100
  const maxPow = Math.max(...DATA.cars.map(c => c.maxPower));
  const maxTor = Math.max(...DATA.cars.map(c => c.maxTorque));
  const maxMil = Math.max(...DATA.cars.map(c => c.bestMileage));
  const maxGC = Math.max(...DATA.cars.map(c => c.gc));
  const maxBoot = Math.max(...DATA.cars.map(c => c.boot));

  const datasets = DATA.cars.map((car) => ({
    label: car.short,
    data: [
      (car.maxPower / maxPow) * 100,
      (car.maxTorque / maxTor) * 100,
      (car.bestMileage / maxMil) * 100,
      (car.gc / maxGC) * 100,
      (car.boot / maxBoot) * 100
    ],
    borderColor: car.color,
    backgroundColor: car.color + '18',
    borderWidth: 2,
    pointRadius: 4,
    pointBackgroundColor: car.color,
    pointBorderColor: car.color
  }));

  perfRadarInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Max Power', 'Max Torque', 'Best Mileage', 'Ground Clearance', 'Boot Space'],
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: textColor, font: { family: "'Plus Jakarta Sans'", size: 11, weight: '600' }, usePointStyle: true, padding: 12 } }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: { display: false },
          grid: { color: textColor + '15' },
          pointLabels: { color: textColor, font: { family: "'Plus Jakarta Sans'", size: 11, weight: '700' } },
          angleLines: { color: textColor + '15' }
        }
      }
    }
  });
}

function rebuildCharts() {
  setTimeout(() => {
    buildPriceChart();
    buildSafetyRadar();
    buildPerfRadar();
  }, 50);
}

// =========================================
// BUILD SPEC CARDS
// =========================================
function buildSpecCards() {
  const container = document.getElementById('specCards');
  container.innerHTML = DATA.cars.map(car => {
    const starsHtml = Array.from({ length: 5 }, (_, i) =>
      `<span class="star ${i < car.ncap ? '' : 'empty'}">★</span>`
    ).join('');

    const badgeHtml = car.badge ? `<span class="spec-card-badge">${car.badge}</span>` : '';

    return `
      <div class="spec-card fade-in">
        <div class="spec-card-top" style="background:${car.color}"></div>
        <div class="spec-card-body">
          <div class="spec-card-header">
            <div>
              <div class="spec-card-name" style="color:${car.color}">${car.name}</div>
              <div class="spec-card-year">${car.year}</div>
            </div>
            ${badgeHtml}
          </div>
          <div class="spec-card-price" style="color:${car.color}">₹${car.priceMin}L – ₹${car.priceMax}L</div>
          <div class="spec-card-grid">
            <div class="spec-item">
              <span class="spec-item-label">Max Power</span>
              <span class="spec-item-value">${car.maxPower} PS</span>
            </div>
            <div class="spec-item">
              <span class="spec-item-label">Max Torque</span>
              <span class="spec-item-value">${car.maxTorque} Nm</span>
            </div>
            <div class="spec-item">
              <span class="spec-item-label">Mileage</span>
              <span class="spec-item-value">${car.bestMileage} kmpl</span>
            </div>
            <div class="spec-item">
              <span class="spec-item-label">Boot Space</span>
              <span class="spec-item-value">${car.boot}L</span>
            </div>
            <div class="spec-item">
              <span class="spec-item-label">Ground Clearance</span>
              <span class="spec-item-value">${car.gc} mm</span>
            </div>
            <div class="spec-item">
              <span class="spec-item-label">Engines</span>
              <span class="spec-item-value">${car.engines.length} option${car.engines.length > 1 ? 's' : ''}</span>
            </div>
          </div>
          <div style="margin-top:var(--space-3);">
            <span class="spec-item-label">NCAP Rating</span>
            <div class="ncap-stars" style="margin-top:4px;">
              ${car.ncap > 0 ? starsHtml + ` <span style="font-size:var(--text-xs);color:var(--color-text-muted);margin-left:4px;">${car.ncapBody}</span>` : '<span style="font-size:var(--text-xs);color:var(--color-text-muted);">Not tested (new gen)</span>'}
            </div>
          </div>
          <div class="fuel-tags">
            ${car.fuelOptions.map(f => `<span class="fuel-tag">${f}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// =========================================
// BUILD COMPARISON MATRIX
// =========================================
function buildMatrix() {
  const wrapper = document.getElementById('matrixWrapper');

  let html = '<table class="matrix-table"><thead><tr><th>Feature</th>';
  DATA.cars.forEach(car => {
    html += `<th><span style="display:block;width:100%;height:3px;background:${car.color};border-radius:2px;margin-bottom:8px;"></span>${car.short}</th>`;
  });
  html += '</tr></thead><tbody>';

  DATA.comparisonMatrix.forEach(cat => {
    html += `<tr class="category-row"><td colspan="12">${cat.category}</td></tr>`;
    cat.metrics.forEach(m => {
      html += '<tr>';
      html += `<td>${m.label}</td>`;
      m.values.forEach((v, i) => {
        const isWinner = m.winner === i;
        const isCheck = v === '✓';
        const isCross = v === '✗';
        let cls = isWinner ? 'winner-cell' : '';
        let content = v;
        if (isCheck) content = `<span class="check">✓</span>`;
        else if (isCross) content = `<span class="cross">✗</span>`;
        html += `<td class="${cls}">${content}</td>`;
      });
      html += '</tr>';
    });
  });

  html += '</tbody></table>';
  wrapper.innerHTML = html;
}

// =========================================
// BUILD SAFETY BENTO CARDS
// =========================================
function buildSafetyBento() {
  const grid = document.getElementById('safetyBentoGrid');
  if (!grid) return;

  // Safety score: NCAP(40) + ADAS(20) + 360cam(15) + AllDisc(15) + 6Airbags(10) = 100
  const hillDescentCars = ['Hyundai Creta','Kia Seltos','Tata Sierra','Maruti Grand Vitara','Toyota Urban Cruiser Hyryder','MG Astor','Renault Duster'];

  function safetyScore(car) {
    let s = 0;
    s += Math.min(car.ncap, 5) * 8; // max 40
    if (car.adas) s += 20;
    if (car.cam360) s += 15;
    if (car.allDisc) s += 15;
    else if (car.discNote && car.discNote.includes('only')) s += 7;
    if (car.airbags >= 6) s += 10;
    return s;
  }

  const starsHtml = (n) => Array.from({ length: 5 }, (_, i) =>
    `<span class="sbn-star ${i < n ? 'filled' : 'empty'}">★</span>`
  ).join('');

  function chip(label, state) {
    // state: 'has' | 'no' | 'partial'
    const icon = state === 'has' ? '✓' : state === 'partial' ? '½' : '✗';
    return `<span class="sbn-chip ${state}">${icon}&nbsp;${label}</span>`;
  }

  DATA.cars.forEach(car => {
    const score = safetyScore(car);
    const discState = car.allDisc ? 'has' : (car.discNote && car.discNote.includes('only') ? 'partial' : 'no');
    const hdState = hillDescentCars.includes(car.name) ? 'has' : 'no';

    const card = document.createElement('div');
    card.className = 'sbn-card fade-in';
    card.innerHTML = `
      <div class="sbn-accent" style="background:${car.color}"></div>
      <div class="sbn-inner">
        <div class="sbn-head">
          <div>
            <div class="sbn-name" style="color:${car.color}">${car.short}</div>
            <div class="sbn-brand">${car.brand}</div>
          </div>
          <div class="sbn-score-badge" style="background:${car.color}22;color:${car.color};border-color:${car.color}44">
            ${score}<span class="sbn-score-max">/100</span>
          </div>
        </div>

        <div class="sbn-ncap">
          ${car.ncap > 0
            ? starsHtml(car.ncap) + `<span class="sbn-ncap-label">${car.ncapBody}</span>`
            : '<span class="sbn-no-ncap">Not tested</span>'
          }
        </div>

        <div class="sbn-chips">
          ${chip('ADAS', car.adas ? 'has' : 'no')}
          ${chip('360°', car.cam360 ? 'has' : 'no')}
          ${chip('Disc', discState)}
          ${chip('Hill', hdState)}
        </div>

        <div class="sbn-bar-row">
          <div class="sbn-bar-bg">
            <div class="sbn-bar-fill" style="width:${score}%;background:${car.color}"></div>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// =========================================
// BUILD ENGINE CARDS
// =========================================
function buildEngineCards() {
  const container = document.getElementById('engineCards');
  container.innerHTML = DATA.cars.map(car => {
    return car.engines.map(eng => `
      <div class="engine-card" style="border-left-color:${car.color}">
        <h4 style="color:${car.color}">${car.short} — ${eng.name}</h4>
        <div class="engine-specs">
          <div class="engine-spec">Power<strong>${eng.power} PS</strong></div>
          <div class="engine-spec">Torque<strong>${eng.torque} Nm</strong></div>
          <div class="engine-spec">Transmission<strong>${eng.trans}</strong></div>
          <div class="engine-spec">Mileage<strong>${eng.mileage}</strong></div>
        </div>
      </div>
    `).join('');
  }).join('');
}

// =========================================
// BUILD PROS & CONS CARDS
// All cards expanded by default
// =========================================
function buildProsCons() {
  const container = document.getElementById('prosConsCards');
  container.innerHTML = DATA.cars.map((car) => {
    return `
      <div class="proscons-card fade-in open">
        <div class="proscons-header" style="border-left-color:${car.color}" onclick="toggleProsCons(this)">
          <span class="proscons-title">${car.name}</span>
          <span class="proscons-toggle">▾</span>
        </div>
        <div class="proscons-body">
          <div class="proscons-columns">
            <div class="proscons-col pros">
              <h5>✓ Pros</h5>
              <ul>${car.pros.map(p => `<li>${p}</li>`).join('')}</ul>
            </div>
            <div class="proscons-col cons">
              <h5>✗ Cons</h5>
              <ul>${car.cons.map(c => `<li>${c}</li>`).join('')}</ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleProsCons(header) {
  header.closest('.proscons-card').classList.toggle('open');
}

// =========================================
// BUILD FEATURE HEATMAP
// =========================================
function buildHeatmap() {
  const wrapper = document.getElementById('heatmapWrapper');
  let html = '<table class="heatmap-table"><thead><tr><th>Feature</th>';
  DATA.cars.forEach(car => {
    html += `<th style="color:${car.color}">${car.short}</th>`;
  });
  html += '</tr></thead><tbody>';

  const totals = DATA.cars.map(() => 0);

  DATA.featureHeatmap.forEach(row => {
    html += `<tr><td>${row.feature}</td>`;
    row.values.forEach((v, i) => {
      let cls = v;
      let icon = v === 'available' ? '✓' : v === 'missing' ? '✗' : '½';
      if (v === 'available') totals[i]++;
      else if (v === 'partial') totals[i] += 0.5;
      html += `<td><span class="hm-cell ${cls}">${icon}</span></td>`;
    });
    html += '</tr>';
  });

  html += `<tr class="total-row"><td>Total Score</td>`;
  totals.forEach((t, i) => {
    html += `<td style="color:${DATA.cars[i].color}">${t}/14</td>`;
  });
  html += '</tr></tbody></table>';

  wrapper.innerHTML = html;
}

// =========================================
// BUILD VERDICTS & PERSONAS
// =========================================
function buildVerdicts() {
  const grid = document.getElementById('verdictsGrid');
  grid.innerHTML = DATA.verdicts.map(v => `
    <div class="verdict-card fade-in">
      <div class="verdict-icon">${v.icon}</div>
      <div class="verdict-category">${v.category}</div>
      <div class="verdict-winner">${v.car}</div>
      <div class="verdict-reason">${v.reason}</div>
    </div>
  `).join('');

  const pgrid = document.getElementById('personaGrid');
  pgrid.innerHTML = DATA.personas.map(p => `
    <div class="persona-card">
      <div class="persona-icon">${p.icon}</div>
      <div class="persona-label">${p.label}</div>
      <div class="persona-rec">${p.rec}</div>
    </div>
  `).join('');
}

// =========================================
// BUILD FOOTER SOURCES
// =========================================
function buildFooter() {
  const list = document.getElementById('footerSources');
  list.innerHTML = DATA.sources.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.name}</a></li>`).join('');
}

// =========================================
// SCROLL ANIMATIONS
// =========================================
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// =========================================
// ACTIVE NAV TRACKING
// =========================================
function initNavTracking() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.2, rootMargin: '-80px 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
}

// =========================================
// INIT
// =========================================
document.addEventListener('DOMContentLoaded', () => {
  buildPriceChart();
  buildSpecCards();
  buildMatrix();
  buildSafetyRadar();
  buildSafetyBento();
  buildPerfRadar();
  buildEngineCards();
  buildProsCons();
  buildHeatmap();
  buildVerdicts();
  buildFooter();

  // Re-observe new fade-in elements after dynamic content
  setTimeout(() => {
    initScrollAnimations();
    initNavTracking();
  }, 100);
});
