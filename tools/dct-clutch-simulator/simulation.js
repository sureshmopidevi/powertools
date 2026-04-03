/* ═══════════════════════════════════════════════════════════════
   SIMULATION — mutable runtime state, tick loop, and controls
   Depends on: physics.js (PHY, SCEN, computeHeat, coolPower, updateBell, getTCUMode, computeAccel)
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── Mutable state ── */
let tempC1 = 80, tempC2 = 80, tempBell = 50, peakTemp = 80;
let elapsed = 0, running = false, interval = null;
let scenario = 'mall', loadFactor = 1.30, ambTemp = 42;
let ahSaves = 0, wearJoules = 0, tcuMode = 'normal';
let simSpeed = 0, simGear = 'P', simActiveClutch = 'C1';
let simSlip = 0, simPgen = 0, simPdis = 0, simMu = 0.35;
let simAccel = 0;
let displaySpeed = 0;
let prevSpeed = 0;

const tempHistC1 = [], tempHistC2 = [], timeHist = [];
const MAX_H = 180;

/* ── Tick — 1-second physics step ── */
function tick() {
  elapsed++;
  const ah = document.getElementById('ah').checked;
  const nt = document.getElementById('nt').checked;
  const [spd, gearNum] = SCEN[scenario].state(elapsed);
  const activeCL = (gearNum % 2 === 1) ? 'C1' : 'C2';
  simActiveClutch = activeCL;

  const maxTemp = Math.max(tempC1, tempC2);
  tcuMode = getTCUMode(maxTemp);

  const simSlipRef = { val: simSlip };
  const { heat: Pg, mu } = computeHeat(spd, gearNum, activeCL, ah, nt, loadFactor, tcuMode, scenario, tempC1, tempC2, simSlipRef);
  simSlip = simSlipRef.val;
  simMu = mu;

  const Pd_C1 = coolPower(tempC1, spd, tempBell);
  const Pd_C2 = coolPower(tempC2, spd, tempBell);
  const dT_active = (Pg - (activeCL === 'C1' ? Pd_C1 : Pd_C2)) / PHY.C_disc;
  const dT_idle = -(activeCL === 'C1' ? Pd_C2 : Pd_C1) / PHY.C_disc;
  const noise = (Math.random() - .5) * 0.25, floor = PHY.T_floor(ambTemp);

  if (activeCL === 'C1') {
    tempC1 = Math.max(floor, Math.min(380, tempC1 + dT_active + noise));
    tempC2 = Math.max(floor, Math.min(380, tempC2 + dT_idle + noise * 0.3));
  } else {
    tempC2 = Math.max(floor, Math.min(380, tempC2 + dT_active + noise));
    tempC1 = Math.max(floor, Math.min(380, tempC1 + dT_idle + noise * 0.3));
  }

  // Update auto-hold save counter
  if (ah && spd < 2 && !document.getElementById('nt').checked) ahSaves++;

  tempBell = updateBell(tempBell, ambTemp, tempC1, tempC2, 1);
  peakTemp = Math.max(peakTemp, tempC1, tempC2);
  wearJoules += Math.max(0, Pg);

  simAccel = spd < 2 ? 0 : computeAccel(spd, gearNum, scenario, loadFactor);
  prevSpeed = simSpeed;
  simSpeed = spd;
  simGear = gearNum === 0 ? 'P' : gearNum + ' (' + activeCL + ')';
  simPgen = Pg;
  simPdis = activeCL === 'C1' ? Pd_C1 : Pd_C2;

  const tLabel = fmt(elapsed);
  tempHistC1.push(+tempC1.toFixed(1));
  tempHistC2.push(+tempC2.toFixed(1));
  timeHist.push(tLabel);
  if (tempHistC1.length > MAX_H) { tempHistC1.shift(); tempHistC2.shift(); timeHist.shift(); }

  SCEN[scenario].events.forEach(ev => { if (!ev._fired && elapsed >= ev.t) { ev._fired = true; log(ev.m); } });

  const hotT = Math.max(tempC1, tempC2);
  if (hotT >= PHY.T_damage && elapsed % 10 === 0) log('🚨 DAMAGE zone! μ degrading permanently');
  else if (hotT >= PHY.T_limp && elapsed % 15 === 0) log('🔴 Limp mode: 33% torque, 3rd locked');
  else if (hotT >= PHY.T_tcu_lim && elapsed % 20 === 0) log('🟠 TCU limiting to 62% clutch torque');

  render();
}

/* ── Controls ── */
function setScenario(id, btn) {
  scenario = id;
  document.querySelectorAll('.sc-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  SCEN[id].events.forEach(ev => delete ev._fired);
  log('Scenario → ' + SCEN[id].name);
  el('k-sc').textContent = SCEN[id].name;
  SCENE.type = SCEN[id].bg;
  /* Re-spawn traffic with correct density for new scenario */
  initScene();
}

function refresh() { log('Settings updated'); }

const loadLabels = ['1 pax (solo)', '2 pax', '3 pax', '4 pax', '5 pax + bags'];
const loadFactors = [0.72, 0.86, 1.0, 1.15, 1.30];
function updateLoad(v) {
  loadFactor = loadFactors[v - 1];
  el('load-txt').textContent = loadLabels[v - 1];
  log(`Load: ${loadLabels[v - 1]} (×${loadFactor.toFixed(2)})`);
}

function updateAmb(v) {
  ambTemp = parseInt(v);
  el('amb-txt').textContent = v + '°C';
}

function toggleSim() {
  running = !running;
  el('play-btn').textContent = running ? '⏸ Pause' : '▶ Resume';
  if (running) {
    interval = setInterval(tick, 1000);
    log('Simulation started');
  } else {
    clearInterval(interval);
    log(`Paused — C1:${Math.round(tempC1)}°C C2:${Math.round(tempC2)}°C`);
  }
}

function resetSim() {
  clearInterval(interval);
  running = false;
  tempC1 = 80; tempC2 = 80; tempBell = 50; peakTemp = 80; elapsed = 0;
  ahSaves = 0; wearJoules = 0; tcuMode = 'normal';
  simSlip = 0; simPgen = 0; simPdis = 0; simMu = 0.35; simAccel = 0; simSpeed = 0;
  tempHistC1.length = 0; tempHistC2.length = 0; timeHist.length = 0;
  SCENE.animSpeed = 0; SCENE.particles = []; SCENE.carTilt = 0; SCENE.wheelAngle = 0;
  Object.values(SCEN).forEach(s => s.events.forEach(e => delete e._fired));
  chartInst.data.datasets.forEach(d => d.data = []);
  chartInst.data.labels = [];
  chartInst.update();
  el('play-btn').textContent = '▶ Start';
  el('tcu-banner').classList.remove('show', 'active');
  updateSVGGauge(80, 80, 80);
  render();
  log('Reset — D7UF1 dual clutch thermal model ready');
  log('C1 (1·3·5·7) + C2 (2·4·6·R) modelled independently');
}
