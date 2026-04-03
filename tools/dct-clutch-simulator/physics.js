/* ═══════════════════════════════════════════════════════════════
   PHYSICS MODEL — Kia D7UF1 Dry 7DCT
   Sources: SAE 2015-01-1144, ATZ 2016, Polito DCT thesis
   ═══════════════════════════════════════════════════════════════ */

'use strict';

const PHY = {
  r_eff: 0.095, F_clamp: 7200, n_faces: 2,
  C_disc: 1150,
  k_nat: 0.65, k_forced: 0.016,
  mu_ref: 0.35, alpha_mu: 0.0018,
  T_warn: 180, T_tcu_lim: 220, T_limp: 260, T_damage: 300,
  gears: [3.929, 2.318, 2.043, 1.023, 0.822, 0.884, 0.721],
  final_drive: 4.429, tyre_radius: 0.335,
  omega_idle: 78.5,
  // Vehicle dynamics
  mass: 1480,       // kg — Kia Sorento 5-pax est.
  drag_cd: 0.33,    // Cd
  frontal_A: 2.61,  // m²
  roll_rr: 0.013,   // rolling resistance coefficient
  T_floor: (amb) => amb + 25,
};

/** Friction coefficient as a function of temperature */
function mu_T(T) {
  return Math.max(0.15, Math.min(0.42, PHY.mu_ref * (1 - PHY.alpha_mu * Math.max(0, T - 200))));
}

/* ── Scenario configurations ── */
const SCEN = {
  mall: {
    name: 'InOrbit Mall',
    bg: 'urban',
    state(t) {
      const c = t % 52;
      if (c < 22) return [0, 1];
      if (c < 44) return [5 + Math.random() * 8, 1];
      return [16 + Math.random() * 10, 2];
    },
    events: [
      { t: 15,  m: 'Queue at InOrbit junction — bumper-to-bumper' },
      { t: 48,  m: 'Ramp entry congestion — steep incline' },
      { t: 90,  m: 'Waiting for parking slot — 8 min queue' },
      { t: 150, m: 'Speed bump zone — repeated stop-go' },
    ],
  },
  signal: {
    name: 'Hitech City Signal',
    bg: 'urban',
    state(t) {
      const c = t % 68;
      if (c < 40) return [0, 1];
      if (c < 57) return [3 + Math.random() * 9, 1];
      return [20 + Math.random() * 14, 2];
    },
    events: [
      { t: 10,  m: 'Phase 1 signal — 3 min 20 sec wait begins' },
      { t: 48,  m: 'Queue crawls forward 2 car lengths' },
      { t: 84,  m: 'Phase 2 signal — full stop again' },
      { t: 130, m: 'U-turn queue after HITEC flyover' },
    ],
  },
  orr: {
    name: 'ORR Highway',
    bg: 'highway',
    state(t) {
      const base = 85 + Math.sin(t / 28) * 10;
      return [base + (Math.random() - .5) * 5, 6];
    },
    events: [
      { t: 8,   m: 'Entered ORR from Nanakramguda toll plaza' },
      { t: 50,  m: 'Smooth 90 km/h cruise — clutch fully locked' },
      { t: 105, m: 'Brief slowdown near Shamshabad exit' },
      { t: 145, m: 'Overtaking — downshift to 5th then back to 6th' },
    ],
  },
  tirumala: {
    name: 'Tirumala Ghat',
    bg: 'ghat',
    state(t) {
      const c = t % 40;
      if (c < 12) return [0, 1];
      return [7 + Math.random() * 12, 2];
    },
    events: [
      { t: 8,   m: 'Alipiri ghat start — gradient to 10°' },
      { t: 38,  m: 'First hairpin — queue, repeated hill-holds' },
      { t: 72,  m: 'Mid-ghat sustained incline — peak stress' },
      { t: 112, m: 'Vehicle queue near checkpoint — uphill hold' },
      { t: 162, m: 'Descent phase — engine braking critical' },
    ],
  },
};

/* ── Thermal heat generation ── */
function computeHeat(spd, gearNum, activeClutch, ah, nt, lf, tcuF, scenario, tempC1, tempC2, simSlipRef) {
  const isStopped = spd < 2, isCrawl = spd >= 2 && spd < 22, isCity = spd >= 22 && spd < 55, isHighway = spd >= 55;
  const isHill = scenario === 'tirumala';
  const tf = { normal: 1.0, monitoring: 1.0, limiting: 0.62, limp: 0.33 }[tcuF] ?? 1.0;
  const activeTemp = activeClutch === 'C1' ? tempC1 : tempC2;
  const mu = mu_T(activeTemp);
  const hCoeff = mu * PHY.F_clamp * lf * tf * PHY.r_eff * PHY.n_faces;

  if (isStopped) {
    if (nt)  { simSlipRef.val = 0; return { heat: 5, mu }; }
    if (ah)  { simSlipRef.val = 0; return { heat: 8, mu }; }
    const hillF = isHill ? 2.1 : 1.0, deltaOmega = PHY.omega_idle * hillF;
    simSlipRef.val = deltaOmega;
    return { heat: hCoeff * deltaOmega, mu };
  }
  if (isCrawl) {
    const v_ms = spd / 3.6, gRatio = PHY.gears[gearNum - 1] || PHY.gears[0];
    const omega_wheel = v_ms / PHY.tyre_radius, omega_shaft = omega_wheel * gRatio * PHY.final_drive;
    const omega_eng = PHY.omega_idle * (isHill ? 1.35 : 1.0);
    const deltaOmega = Math.max(0, omega_eng - omega_shaft);
    simSlipRef.val = deltaOmega;
    if (ah && isHill) return { heat: hCoeff * deltaOmega * 0.40, mu };
    if (ah)           return { heat: hCoeff * deltaOmega * 0.45, mu };
    return { heat: hCoeff * deltaOmega, mu };
  }
  if (isCity)    { simSlipRef.val = 6 + Math.random() * 10; return { heat: 48 * lf * tf, mu }; }
  if (isHighway) { simSlipRef.val = 0.15 + Math.random() * 0.4; return { heat: 7, mu }; }
  simSlipRef.val = 0;
  return { heat: 0, mu };
}

/** Radiative + forced convection cooling power for a disc */
function coolPower(T, spd, tempBell) {
  return (PHY.k_nat + PHY.k_forced * spd) * Math.max(0, T - tempBell);
}

/** Update bell housing (ambient soak) temperature */
function updateBell(tempBell, ambTemp, tempC1, tempC2, dt) {
  const target = ambTemp + 18 + (tempC1 + tempC2) * 0.02;
  return tempBell + (target - tempBell) * (dt / 90);
}

/** Determine TCU protection mode from peak temperature */
function getTCUMode(T) {
  if (T < PHY.T_warn)    return 'normal';
  if (T < PHY.T_tcu_lim) return 'monitoring';
  if (T < PHY.T_limp)    return 'limiting';
  return 'limp';
}

/* ── Longitudinal vehicle dynamics ── */
function computeAccel(spd, gearNum, scenario, loadFactor) {
  const v = spd / 3.6; // m/s
  const isHill = scenario === 'tirumala';
  const grade = isHill ? Math.sin(10 * Math.PI / 180) : 0; // 10° grade
  const engineTorque = scenario === 'orr' ? 280 : 180;     // Nm — simplified
  const gRatio = PHY.gears[Math.min(gearNum - 1, 6)] || PHY.gears[0];
  const F_tract = engineTorque * gRatio * PHY.final_drive / PHY.tyre_radius * 0.85; // 85% η
  const rho = 1.18; // kg/m³ air density Hyderabad
  const F_drag  = 0.5 * rho * PHY.drag_cd * PHY.frontal_A * v * v;
  const m       = PHY.mass * loadFactor;
  const F_roll  = PHY.roll_rr * m * 9.81;
  const F_grade = m * 9.81 * grade;
  return Math.max(-8, Math.min(4, (F_tract - F_drag - F_roll - F_grade) / m));
}
