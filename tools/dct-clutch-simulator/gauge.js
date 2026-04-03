/* ═══════════════════════════════════════════════════════════════
   SVG GAUGE — temperature arc gauge with zone colours
   Depends on: simulation.js (state vars)
   ═══════════════════════════════════════════════════════════════ */

'use strict';

const CX = 140, CY = 155, R = 105, R_INNER = 87;
const START_DEG = 155, SWEEP_DEG = 230, T_MIN = 80, T_MAX = 320;

const ZONE_TEMPS = [
  { lo: 80,  hi: 150, color: '#22c55e' },
  { lo: 150, hi: 200, color: '#f59e0b' },
  { lo: 200, hi: 260, color: '#f97316' },
  { lo: 260, hi: 320, color: '#ef4444' },
];

function degToRad(d) { return d * Math.PI / 180; }

function arcPath(cx, cy, r, startDeg, sweepDeg) {
  const a1 = degToRad(startDeg), a2 = degToRad(startDeg + sweepDeg);
  const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
  const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
  const large = sweepDeg > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

function tempToDeg(T) {
  return START_DEG + Math.max(0, Math.min(1, (T - T_MIN) / (T_MAX - T_MIN))) * SWEEP_DEG;
}

function tempToNeedleAngle(T) { return tempToDeg(T) - 90; }

function initGaugePaths() {
  el('gauge-track').setAttribute('d', arcPath(CX, CY, R, START_DEG, SWEEP_DEG));

  ['gauge-z0', 'gauge-z1', 'gauge-z2', 'gauge-z3'].forEach((id, i) => {
    const z = ZONE_TEMPS[i];
    const ds = tempToDeg(z.lo), sw = tempToDeg(Math.min(z.hi, T_MAX)) - ds;
    if (sw > 0) el(id).setAttribute('d', arcPath(CX, CY, R, ds, sw));
  });

  const ticksG  = el('gauge-ticks');
  const labsG   = el('gauge-labels');
  const linesG  = el('gauge-zone-lines');
  ticksG.innerHTML = ''; labsG.innerHTML = ''; linesG.innerHTML = '';

  [80, 120, 150, 180, 200, 230, 260, 290, 320].forEach(T => {
    const ang = degToRad(tempToDeg(T)), isM = [80, 150, 200, 260, 320].includes(T);
    const r1 = R - (isM ? 9 : 6), r2 = R + (isM ? 9 : 6);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', (CX + r1 * Math.cos(ang)).toFixed(1));
    line.setAttribute('y1', (CY + r1 * Math.sin(ang)).toFixed(1));
    line.setAttribute('x2', (CX + r2 * Math.cos(ang)).toFixed(1));
    line.setAttribute('y2', (CY + r2 * Math.sin(ang)).toFixed(1));
    line.setAttribute('stroke-width', isM ? '1.5' : '1');
    ticksG.appendChild(line);
  });

  [80, 150, 200, 260, 320].forEach(T => {
    const ang = degToRad(tempToDeg(T)), lr = R + 18;
    const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    txt.setAttribute('x', (CX + lr * Math.cos(ang)).toFixed(1));
    txt.setAttribute('y', (CY + lr * Math.sin(ang) + 3).toFixed(1));
    txt.textContent = T === 80 ? '80°' : T + '°';
    labsG.appendChild(txt);
  });

  [150, 200, 260].forEach(T => {
    const ang = degToRad(tempToDeg(T)), r1 = R - 8, r2 = R + 8;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', (CX + r1 * Math.cos(ang)).toFixed(1));
    line.setAttribute('y1', (CY + r1 * Math.sin(ang)).toFixed(1));
    line.setAttribute('x2', (CX + r2 * Math.cos(ang)).toFixed(1));
    line.setAttribute('y2', (CY + r2 * Math.sin(ang)).toFixed(1));
    line.setAttribute('stroke-width', '2');
    linesG.appendChild(line);
  });

  /* Inner ring tracks for C1 / C2 */
  ['gauge-c1-track', 'gauge-c2-track'].forEach(id => { const e = el(id); if (e) e.remove(); });
  const svg = document.getElementById('svg-gauge');

  const mk = (id, r) => {
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.id = id;
    p.setAttribute('d', arcPath(CX, CY, r, START_DEG, SWEEP_DEG));
    p.setAttribute('fill', 'none');
    p.setAttribute('stroke', 'var(--faint)');
    p.setAttribute('stroke-width', '3');
    p.setAttribute('stroke-linecap', 'butt');
    p.setAttribute('opacity', '0.4');
    svg.insertBefore(p, el('gauge-needle'));
    return p;
  };
  mk('gauge-c1-track', R_INNER - 6);
  mk('gauge-c2-track', R_INNER + 6);

  ['gauge-c1-fill', 'gauge-c2-fill'].forEach(id => { const e = el(id); if (e) e.remove(); });
  const mkF = (id, r) => {
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.id = id;
    p.setAttribute('fill', 'none');
    p.setAttribute('stroke', '#22c55e');
    p.setAttribute('stroke-width', '3');
    p.setAttribute('stroke-linecap', 'butt');
    p.setAttribute('opacity', '0.7');
    p.style.transition = 'stroke .4s ease';
    svg.insertBefore(p, el('gauge-needle'));
  };
  mkF('gauge-c1-fill', R_INNER - 6);
  mkF('gauge-c2-fill', R_INNER + 6);
}

function updateSVGGauge(maxT, tC1, tC2) {
  const zone = getZone(maxT), fillEnd = Math.min(maxT, T_MAX);
  const fillSweep = Math.max(0, tempToDeg(fillEnd) - START_DEG);
  const fillEl = el('gauge-arc-fill');
  if (fillSweep > 0) { fillEl.setAttribute('d', arcPath(CX, CY, R, START_DEG, fillSweep)); fillEl.setAttribute('stroke', zone.raw); }
  else fillEl.setAttribute('d', '');

  el('gauge-needle').setAttribute('transform', `rotate(${tempToNeedleAngle(maxT).toFixed(2)} ${CX} ${CY})`);
  el('gauge-temp-text').textContent = Math.round(maxT) + '°';
  el('gauge-temp-text').setAttribute('fill', zone.raw);
  el('gauge-zone-text').textContent = zone.name;
  el('gauge-zone-text').setAttribute('fill', zone.raw);

  const c1El = el('gauge-c1-fill'), c2El = el('gauge-c2-fill');
  if (c1El) {
    const s = Math.max(0, tempToDeg(Math.min(tC1, T_MAX)) - START_DEG);
    if (s > 0) { c1El.setAttribute('d', arcPath(CX, CY, R_INNER - 6, START_DEG, s)); c1El.setAttribute('stroke', getZone(tC1).raw); }
    else c1El.setAttribute('d', '');
  }
  if (c2El) {
    const s = Math.max(0, tempToDeg(Math.min(tC2, T_MAX)) - START_DEG);
    if (s > 0) { c2El.setAttribute('d', arcPath(CX, CY, R_INNER + 6, START_DEG, s)); c2El.setAttribute('stroke', getZone(tC2).raw); }
    else c2El.setAttribute('d', '');
  }
}
