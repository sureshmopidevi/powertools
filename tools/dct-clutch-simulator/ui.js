/* ═══════════════════════════════════════════════════════════════
   UI — render, tips, log, zone lookup, utils, theme toggle, init
   Depends on: simulation.js, gauge.js, chart-setup.js, scene.js
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── Utilities ── */
function el(id) { return document.getElementById(id); }
function setKV(id, val, col) { const e = el(id); e.textContent = val; if (col) e.style.color = col; }
function fmt(s) { return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; }
function isDarkTheme() { return document.documentElement.getAttribute('data-theme') !== 'light'; }

/* ── Zone metadata ── */
function getZone(T) {
  if (T < 150) return { name: 'SAFE',     badge: '🟢 Safe',     raw: '#22c55e', color: 'var(--green)',  bgColor: 'var(--green-bg)',  sub: 'Normal operating range',        action: 'No action needed' };
  if (T < 200) return { name: 'WARM',     badge: '🟡 Warm',     raw: '#f59e0b', color: 'var(--yellow)', bgColor: 'var(--yellow-bg)', sub: 'Elevated — monitor closely',     action: 'Enable Auto Hold' };
  if (T < 260) return { name: 'HOT',      badge: '🟠 Hot',      raw: '#f97316', color: 'var(--orange)', bgColor: 'var(--orange-bg)', sub: 'TCU protection active',          action: 'Shift to N now' };
  return           { name: 'CRITICAL', badge: '🔴 Critical', raw: '#ef4444', color: 'var(--red)',    bgColor: 'var(--red-bg)',    sub: '⚠️ Lining damage above 300°C', action: 'Stop engine & park' };
}

/* ── Main render pass ── */
function render() {
  const maxT = Math.max(tempC1, tempC2), zone = getZone(maxT);

  setKV('k-temp',   Math.round(peakTemp) + '°C', zone.color);
  setKV('k-status', zone.badge,                   zone.color);
  el('k-temp-sub').textContent    = zone.sub;
  el('k-status-sub').textContent  = zone.action;
  el('k-time').textContent        = fmt(elapsed);
  el('k-sc').textContent          = SCEN[scenario].name;
  el('k-saves').textContent       = ahSaves.toLocaleString();

  updateSVGGauge(maxT, tempC1, tempC2);

  const badge = el('gauge-badge');
  badge.textContent = zone.name; badge.style.background = zone.bgColor; badge.style.color = zone.color;

  const zC1 = getZone(tempC1), zC2 = getZone(tempC2);
  el('cp-c1-temp').textContent = Math.round(tempC1) + '°'; el('cp-c1-temp').style.color = zC1.color;
  el('cp-c2-temp').textContent = Math.round(tempC2) + '°'; el('cp-c2-temp').style.color = zC2.color;

  el('sv-spd').textContent  = Math.round(simSpeed) + ' km/h';
  el('sv-acc').textContent  = (simAccel >= 0 ? '+' : '') + simAccel.toFixed(2) + ' m/s²';
  el('sv-gear').textContent = simGear;
  el('sv-slip').textContent = simSlip.toFixed(1) + ' rad/s';
  el('sv-pgen').textContent = Math.round(simPgen) + ' W';
  el('sv-pdis').textContent = Math.round(simPdis) + ' W';

  const dtdt = (simPgen - simPdis) / PHY.C_disc;
  el('sv-dtdt').style.color = dtdt > 0 ? 'var(--orange)' : 'var(--green)';
  el('sv-dtdt').textContent = (dtdt > 0 ? '+' : '') + dtdt.toFixed(3) + ' °C/s';

  el('sv-wear').textContent = (wearJoules / 1000).toFixed(1) + ' kJ';
  el('sv-mu').textContent   = simMu.toFixed(3);

  const tcuEl = el('sv-tcu');
  if      (tcuMode === 'limp')       { tcuEl.textContent = 'LIMP MODE';     tcuEl.style.color = 'var(--red)'; }
  else if (tcuMode === 'limiting')   { tcuEl.textContent = 'LIMITING 62%';  tcuEl.style.color = 'var(--orange)'; }
  else if (tcuMode === 'monitoring') { tcuEl.textContent = 'MONITORING';    tcuEl.style.color = 'var(--yellow)'; }
  else                               { tcuEl.textContent = 'NORMAL';        tcuEl.style.color = 'var(--green)'; }

  const banner = el('tcu-banner');
  if (tcuMode === 'limp') {
    banner.classList.add('show', 'active'); banner.style.borderColor = 'var(--red)';
    el('tcu-text').textContent = '🔴 LIMP MODE — TCU at 33% torque. Park, engine off, cool 10 min.';
  } else if (tcuMode === 'limiting') {
    banner.classList.add('show'); banner.classList.remove('active'); banner.style.borderColor = 'var(--orange)';
    el('tcu-text').textContent = '🟠 TCU Limiting — Clutch torque capped at 62%. Shift to N.';
  } else {
    banner.classList.remove('show', 'active');
  }

  updateChart();
  renderTips(zone);
  el('chart-annotation').textContent = `Peak: ${Math.round(peakTemp)}°C`;
}

/* ── Live recommendations ── */
function renderTips(zone) {
  const ah = document.getElementById('ah').checked, nt = document.getElementById('nt').checked;
  const tips = [], add = (color, text) => tips.push({ color, text });
  const maxT = Math.max(tempC1, tempC2);

  if (maxT >= PHY.T_damage)    add('var(--red)', '🚨 Friction lining >300°C — permanent μ degradation. Service immediately.');
  if (maxT >= PHY.T_limp)      add('var(--red)', 'Engine off + park. D7UF1 servo locked at 33% torque — do not drive.');
  else if (maxT >= PHY.T_tcu_lim) {
    add('var(--orange)', 'Shift to N — each second in D adds 200–400 W slip heat at this temp.');
    add('var(--orange)', 'FlexRay TCU limiting clutch clamp to 62% capacity.');
  } else if (maxT >= PHY.T_warn) {
    if (!ah) add('var(--yellow)', 'Enable Auto Hold — D7UF1 servo can fully retract clutch at stops (zero slip).');
    if (!nt) add('var(--yellow)', 'Shift to N at signals — idle slip adds ~750 W continuously.');
  }

  if (!ah && simSpeed < 2 && scenario !== 'orr') add('var(--orange)', `Auto Hold OFF: ${simActiveClutch} slipping at ω_idle ≈ ${PHY.omega_idle.toFixed(0)} rad/s.`);
  if (ah && simSpeed < 2)                         add('var(--green)',  'Auto Hold: servo retracted — C1 & C2 fully open. Zero friction heat at stop. ✅');

  if (scenario === 'tirumala') {
    add('var(--accent)', '⛰️ On descent: keep gear. 1st ratio 3.929:1 provides strong engine braking.');
    add('var(--accent)', 'Never N on ghat descent — C1 re-engages with a massive slip surge.');
  }
  if (scenario === 'mall' && maxT > 160) add('var(--yellow)', 'Find a straight 100m — forced convection cools disc ~2°C/s faster than idle.');
  if (maxT < 150) add('var(--green)', 'Clutch healthy — C1 & C2 both in safe zone. Keep it below 150°C. ✅');

  el('tips').innerHTML = tips.slice(0, 5).map(t =>
    `<div class="tip-item"><span class="tip-dot" style="background:${t.color}"></span><span>${t.text}</span></div>`
  ).join('');
}

/* ── Event log ── */
function log(msg) {
  const l = el('log'), d = document.createElement('div');
  d.className = 'log-e';
  d.innerHTML = `<span class="log-t">${fmt(elapsed)}</span><span>${msg}</span>`;
  l.insertBefore(d, l.firstChild);
  while (l.children.length > 25) l.removeChild(l.lastChild);
}
function clearLog() { el('log').innerHTML = ''; }

/* ── Theme toggle ── */
(function () {
  const btn  = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let d = root.getAttribute('data-theme') || 'dark';
  root.setAttribute('data-theme', d);
  btn && btn.addEventListener('click', () => {
    d = d === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', d);
    btn.innerHTML = d === 'dark'
      ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
      : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
    setTimeout(() => { initGaugePaths(); updateSVGGauge(Math.max(tempC1, tempC2), tempC1, tempC2); }, 30);
  });
})();

/* ── Initialisation ── */
initGaugePaths();
updateSVGGauge(80, 80, 80);
renderTips(getZone(80));
initScene();
log('Ready — D7UF1 dual clutch thermal model loaded');
log('📐 C1 (1·3·5·7) + C2 (2·4·6·R) independent thermal states');
log('📄 SAE 2015-01-1144 · ATZ 2016 · Polito DCT thesis · μ(T) model');

window.addEventListener('resize', () => {
  const rect = SCENE.cvs.getBoundingClientRect();
  SCENE.W = SCENE.cvs.width = Math.round(rect.width || 600);
  SCENE.cvs.height = SCENE.H;
});
