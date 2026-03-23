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
          labels: { color: textColor, font: { family: "'General Sans'", size: 13 }, usePointStyle: true, pointStyle: 'rectRounded', padding: 20 },
          position: 'top'
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.85)',
          titleFont: { family: "'Cabinet Grotesk'", size: 14, weight: 'bold' },
          bodyFont: { family: "'General Sans'", size: 13 },
          padding: 14,
          cornerRadius: 8,
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
          ticks: { color: textColor, font: { family: "'General Sans'" }, callback: v => '₹' + v + 'L' }
        },
        x: {
          grid: { display: false },
          ticks: { color: textColor, font: { family: "'General Sans'", weight: 'bold' } }
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
        legend: { labels: { color: textColor, font: { family: "'General Sans'", size: 12 }, usePointStyle: true, padding: 12 } }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: { display: false },
          grid: { color: textColor + '15' },
          pointLabels: { color: textColor, font: { family: "'General Sans'", size: 12, weight: '600' } },
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
        legend: { labels: { color: textColor, font: { family: "'General Sans'", size: 12 }, usePointStyle: true, padding: 12 } }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: { display: false },
          grid: { color: textColor + '15' },
          pointLabels: { color: textColor, font: { family: "'General Sans'", size: 12, weight: '600' } },
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
              <div class="spec-card-name">${car.name}</div>
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
    html += `<tr class="category-row"><td colspan="7">${cat.category}</td></tr>`;
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
// BUILD SAFETY FEATURE GRID
// =========================================
function buildSafetyGrid() {
  const container = document.getElementById('safetyFeatureGrid');
  const features = [
    { label: "NCAP 5-Star", key: "ncap", check: c => c.ncap === 5 },
    { label: "ADAS", key: "adas", check: c => c.adas },
    { label: "360° Camera", key: "cam360", check: c => c.cam360 },
    { label: "6 Airbags", key: "airbags", check: c => c.airbags >= 6 },
    { label: "All Disc Brakes", key: "allDisc", check: c => c.allDisc, partial: c => c.discNote.includes('only') },
    { label: "Hill Descent", key: "hd", check: c => ['Skoda Kushaq', 'Hyundai Creta', 'Kia Seltos', 'Tata Sierra'].includes(c.name) }
  ];

  let headerRow = '<div class="safety-feature-row" style="border-bottom:2px solid var(--color-border);">';
  headerRow += '<div class="safety-feature-label" style="font-size:var(--text-xs);color:var(--color-text-muted);text-transform:uppercase;letter-spacing:0.05em;">Feature</div>';
  DATA.cars.forEach(car => {
    headerRow += `<div style="text-align:center;font-size:var(--text-xs);font-weight:700;color:${car.color};">${car.short}</div>`;
  });
  headerRow += '</div>';

  let gridHtml = headerRow;
  features.forEach(f => {
    gridHtml += '<div class="safety-feature-row">';
    gridHtml += `<div class="safety-feature-label">${f.label}</div>`;
    DATA.cars.forEach(car => {
      const has = f.check(car);
      const isPartial = f.partial && f.partial(car);
      if (has) {
        gridHtml += '<div><div class="safety-cell has">✓</div></div>';
      } else if (isPartial) {
        gridHtml += '<div><div class="safety-cell partial">½</div></div>';
      } else {
        gridHtml += '<div><div class="safety-cell no">✗</div></div>';
      }
    });
    gridHtml += '</div>';
  });

  container.innerHTML += `<div class="safety-features-grid">${gridHtml}</div>`;
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
    html += `<td style="color:${DATA.cars[i].color}">${t}/12</td>`;
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
  buildSafetyGrid();
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
