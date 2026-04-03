/* ═══════════════════════════════════════════════════════════════
   2D STREET SCENE — Enhanced Canvas Animation (60fps rAF)
   Features:
   - IDM car-following model → realistic accordion creep/crawl
   - Scenario-aware traffic density & stop line
   - Brake-light intensity proportional to deceleration
   - Clutch heat glow + pulsing shimmer
   - Enhanced particles: sparks, heat-distortion puffs, exhaust
   - Road markings, lane arrows, crosswalk (urban)
   - Mountain hairpin bends (ghat)
   - Night/day sky with stars, moon, sun
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─── Scene state object ─── */
const SCENE = {
  cvs: null, ctx: null,
  W: 0, H: 200,
  /* Parallax scroll */
  skyX: 0, bgX: 0, midX: 0,
  dashX: 0,
  /* Traffic */
  cars: [],
  /* Visual particles */
  particles: [],
  /* Traffic light */
  lightState: 'green', lightPhase: 0, /* 0=green,1=amber,2=red */
  lightTimer: 0, lightCycleLen: 0,
  /* Stop line x position (front of queue) */
  stopLineX: 0,
  /* Player body dynamics */
  carTilt: 0, targetTilt: 0,
  wheelAngle: 0,
  /* Scene type */
  type: 'urban',
  /* Smooth display speed (rAF) */
  animSpeed: 0,
  rafId: null,
};

/* ─── IDM parameters ─── */
const IDM = {
  v0: 0,           // desired speed — set per frame from simSpeed (km/h → m/s)
  a: 1.8,          // max acceleration  (m/s²)
  b: 3.5,          // comfortable deceleration (m/s²)
  T: 1.2,          // desired time headway (s)
  s0: 10,          // minimum jam distance (px)
  delta: 4,        // acceleration exponent
};

/* ─── Traffic car factory ─── */
const CAR_TYPES = {
  sedan: { w: 62, h: 22, bodyH: 14, col: ['#c0c0c0','#d0d0d0','#8b0000','#00008b','#2d6a4f','#808080'] },
  suv:   { w: 72, h: 24, bodyH: 15, col: ['#ffffff','#808080','#1a1a1a','#003366','#4a4e69','#556b2f'] },
  truck: { w: 86, h: 26, bodyH: 16, col: ['#cc6600','#ffffff','#3c3c3c','#990000','#cccccc','#7b3f00'] },
  auto:  { w: 50, h: 20, bodyH: 13, col: ['#f5c518','#ff8800','#49c4f3','#111111'] }, /* tuk-tuk */
  bike:  { w: 36, h: 16, bodyH: 10, col: ['#e74c3c','#2c3e50','#f39c12','#8e44ad'] },
};

function spawnCar(x, typeHint) {
  const types = typeHint
    ? [typeHint]
    : (SCENE.type === 'highway' ? ['sedan','suv','sedan'] : ['sedan','suv','truck','auto','bike','sedan','sedan']);
  const t = types[Math.floor(Math.random() * types.length)];
  const spec = CAR_TYPES[t];
  const col = spec.col[Math.floor(Math.random() * spec.col.length)];
  return {
    x,
    type: t,
    color: col,
    vel: 0,          // px/s (canvas space)
    brakeAlpha: 0,   // 0..1 brake light intensity
    targetBrake: 0,
    stoppedTime: 0,  // seconds spent stopped
  };
}

/* ─── Init ─── */
function initScene() {
  SCENE.cvs = el('scene-canvas');
  SCENE.ctx = SCENE.cvs.getContext('2d');
  const rect = SCENE.cvs.getBoundingClientRect();
  SCENE.W = SCENE.cvs.width = Math.round(rect.width || 600);
  SCENE.cvs.height = SCENE.H;

  /* Spawn traffic ahead of player (player at W*0.22) */
  SCENE.cars = [];
  const density = { mall: 6, signal: 7, orr: 3, tirumala: 5 };
  const count = density[scenario] || 5;
  const spacing = SCENE.W / count;
  for (let i = 0; i < count; i++) {
    const x = SCENE.W * 0.42 + i * spacing + Math.random() * 20;
    SCENE.cars.push(spawnCar(x));
  }

  /* Scene-specific traffic light cycle */
  SCENE.stopLineX = SCENE.W * 0.60;
  SCENE.lightCycleLen = scenario === 'signal' ? 50 : scenario === 'mall' ? 35 : 99999;
  SCENE.lightPhase = 0; SCENE.lightTimer = 0; SCENE.lightState = 'green';
  SCENE.particles = [];
  SCENE.animSpeed = 0;

  if (!SCENE.rafId) SCENE.rafId = requestAnimationFrame(animFrame);
}

/* ─── rAF loop ─── */
let lastRaf = performance.now();
function animFrame(now) {
  SCENE.rafId = requestAnimationFrame(animFrame);
  const dt = Math.min((now - lastRaf) / 1000, 0.05);
  lastRaf = now;
  if (!running && elapsed === 0) { drawIdleScene(); return; }
  updateScene(dt);
  drawScene();
}

/* ─── Update ─── */
function updateScene(dt) {
  /* ── Smooth display speed ── */
  const targetSpd = running ? simSpeed : 0;
  SCENE.animSpeed += (targetSpd - SCENE.animSpeed) * (1 - Math.exp(-dt * 3));
  const spd = SCENE.animSpeed;   /* km/h */
  const spd_ms = spd / 3.6;     /* m/s  */
  SCENE.type = SCEN[scenario].bg;

  /* ── Parallax scroll ── */
  SCENE.skyX -= spd_ms * 0.06 * dt;
  SCENE.bgX  -= spd_ms * 0.22 * dt;
  SCENE.midX -= spd_ms * 0.55 * dt;

  /* ── Road dashes ── */
  SCENE.dashX -= spd_ms * dt * 62;
  if (SCENE.dashX < -80) SCENE.dashX += 80;

  /* ── Wheel rotation ── */
  SCENE.wheelAngle = (SCENE.wheelAngle + spd_ms * dt * (180 / 0.335)) % 360;

  /* ── Body pitch ── */
  SCENE.targetTilt = simAccel * 0.75;
  SCENE.carTilt += (SCENE.targetTilt - SCENE.carTilt) * Math.min(1, dt * 5);

  /* ── Traffic light state machine ── */
  if (SCENE.type === 'urban') {
    SCENE.lightTimer += dt;
    if (SCENE.lightPhase === 0) {              /* green */
      if (simSpeed < 2 && elapsed > 3) { SCENE.lightPhase = 2; SCENE.lightState = 'red'; SCENE.lightTimer = 0; }
    } else if (SCENE.lightPhase === 2) {       /* red */
      if (simSpeed > 8) { SCENE.lightPhase = 1; SCENE.lightState = 'amber'; SCENE.lightTimer = 0; }
    } else if (SCENE.lightPhase === 1) {       /* amber */
      if (SCENE.lightTimer > 1.5) { SCENE.lightPhase = 0; SCENE.lightState = 'green'; SCENE.lightTimer = 0; }
    }
  } else {
    SCENE.lightState = 'green'; SCENE.lightPhase = 0;
  }

  /* ── IDM car-following ── */
  /* Player is at x = W*0.22 in canvas space, all cars are ahead (higher x) */
  const playerX = SCENE.W * 0.22;

  /* Sort cars left-to-right so chain propagates correctly */
  SCENE.cars.sort((a, b) => a.x - b.x);

  /* Compute desired speed in canvas-px/s (proportional to simSpeed) */
  const desiredVelPx = spd_ms * 60; /* ~1 px per real 60cm */

  SCENE.cars.forEach((car, i) => {
    const spec = CAR_TYPES[car.type] || CAR_TYPES.sedan;
    const halfW = spec.w / 2;

    /* Gap to car ahead (or stop-line when red) */
    let gapFront;
    let relVel;
    if (i === 0) {
      /* Lead car: gap to stop line if red */
      if (SCENE.lightState === 'red' && car.x < SCENE.stopLineX + 30) {
        gapFront = Math.max(0, SCENE.stopLineX - car.x - halfW);
        relVel = car.vel;
      } else {
        gapFront = 9999; relVel = 0;
      }
    } else {
      const ahead = SCENE.cars[i - 1];
      const aheadSpec = CAR_TYPES[ahead.type] || CAR_TYPES.sedan;
      gapFront = Math.max(0, (ahead.x - aheadSpec.w / 2) - (car.x + halfW));
      relVel = car.vel - ahead.vel;
    }

    /* Check if player car is close ahead (player occupies playerX + ~48px) */
    const playerGap = (playerX + 50) - (car.x - halfW);
    if (playerGap > 0 && playerGap < 90) {
      /* car is behind player — treat player as moving obstacle */
      gapFront = Math.max(0, playerGap - 10);
      relVel = car.vel - spd_ms * 60;
    }

    /* IDM acceleration */
    const s0 = IDM.s0;
    const T  = IDM.T;
    const sStar = s0 + Math.max(0, car.vel * T + (car.vel * relVel) / (2 * Math.sqrt(IDM.a * IDM.b)));
    const freeAcc  = IDM.a * (1 - Math.pow(Math.max(0, car.vel) / Math.max(1, desiredVelPx), IDM.delta));
    const brakeTerm = Math.pow(sStar / Math.max(1, gapFront), 2);
    const acc = IDM.a * (1 - Math.pow(Math.max(0, car.vel) / Math.max(1, desiredVelPx), IDM.delta) - brakeTerm);

    car.vel = Math.max(0, car.vel + acc * dt * 50);

    /* Creep forward */
    car.x += car.vel * dt;

    /* Brake light intensity from IDM (negative acc = braking harder) */
    const decel = -Math.min(0, acc);
    car.targetBrake = Math.min(1, decel / (IDM.b * 0.6));
    car.brakeAlpha += (car.targetBrake - car.brakeAlpha) * Math.min(1, dt * 8);

    /* Stopped time counter */
    if (car.vel < 0.5) car.stoppedTime += dt; else car.stoppedTime = 0;

    /* Respawn off-left-edge cars behind player */
    if (car.x < playerX - 200) {
      car.x = SCENE.W + 80 + Math.random() * 100;
      car.vel = desiredVelPx * (0.6 + Math.random() * 0.4);
      car.brakeAlpha = 0; car.stoppedTime = 0;
      const sc = spawnCar(0); car.color = sc.color; car.type = sc.type;
    }
    /* Respawn far-right cars when highway (keep screen full) */
    if (scenario === 'orr' && car.x > SCENE.W + 200) {
      car.x = playerX + SCENE.W * 0.25 + Math.random() * 60;
      car.vel = desiredVelPx * (0.8 + Math.random() * 0.3);
    }
  });

  /* ── Particles ── */

  /* Clutch slip sparks under the gearbox (between axles) */
  const isSlipping = simSlip > 8 && running;
  if (isSlipping && Math.random() < dt * 22) {
    const carX = SCENE.W * 0.22 + 5, groundY = SCENE.H * 0.74;
    SCENE.particles.push({
      x: carX + Math.random() * 38 - 6, y: groundY,
      vx: (Math.random() - 0.5) * 80, vy: -Math.random() * 55 - 15,
      life: 1, maxLife: 0.35 + Math.random() * 0.25, type: 'spark',
      col: simActiveClutch === 'C1' ? '#00d4c8' : '#a78bfa',
      size: 1.5 + Math.random() * 1.5,
    });
  }

  /* Heat distortion puffs from gearbox bay (when hot) */
  const maxT = Math.max(tempC1, tempC2);
  if (maxT > 140 && running && Math.random() < dt * 5) {
    const carX = SCENE.W * 0.22 + 8, baseY = SCENE.H * 0.58;
    SCENE.particles.push({
      x: carX + Math.random() * 20, y: baseY,
      vx: (Math.random() - 0.5) * 12, vy: -15 - Math.random() * 18,
      life: 1, maxLife: 1.0 + Math.random() * 0.8, type: 'heat',
      col: maxT > 260 ? 'rgba(239,68,68,' : maxT > 200 ? 'rgba(249,115,22,' : 'rgba(245,158,11,',
      size: 4 + Math.random() * 4,
    });
  }

  /* Exhaust smoke */
  if (running && Math.random() < dt * (spd < 5 ? 5 : 2)) {
    const carX = SCENE.W * 0.22 - 2, baseY = SCENE.H * 0.64;
    SCENE.particles.push({
      x: carX, y: baseY,
      vx: -18 - Math.random() * 25, vy: -6 - Math.random() * 8,
      life: 1, maxLife: 1.3 + Math.random() * 0.9, type: 'exhaust',
      col: simPgen > 500 ? 'rgba(160,80,20,' : 'rgba(90,90,90,',
      size: 5 + Math.random() * 4,
    });
  }

  /* Tyre dust when creeping on ghat */
  if (scenario === 'tirumala' && spd > 1 && spd < 15 && running && Math.random() < dt * 6) {
    const carX = SCENE.W * 0.22 + 30, groundY = SCENE.H * 0.73;
    SCENE.particles.push({
      x: carX, y: groundY,
      vx: (Math.random() - 0.5) * 20, vy: -12 - Math.random() * 8,
      life: 1, maxLife: 1.5, type: 'dust',
      col: 'rgba(180,140,80,',
      size: 7 + Math.random() * 5,
    });
  }

  /* Update particles */
  SCENE.particles = SCENE.particles.filter(p => {
    p.x += p.vx * dt; p.y += p.vy * dt;
    if (p.type !== 'spark') p.vy += 20 * dt; /* buoyancy */
    else p.vy += 80 * dt;                     /* gravity */
    p.life -= dt / p.maxLife;
    return p.life > 0;
  });
}

/* ════════════════════════ DRAW ════════════════════════ */

function drawIdleScene() {
  const { ctx, W, H } = SCENE;
  ctx.clearRect(0, 0, W, H);
  drawSky(0); drawGround(); drawRoad(0);
  drawPlayerCar(W * 0.22, H * 0.61, 0, 0);
  /* Overlay */
  ctx.fillStyle = isDarkTheme() ? 'rgba(0,0,0,.45)' : 'rgba(255,255,255,.45)';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = isDarkTheme() ? '#c8cdd8' : '#1a1d26';
  ctx.font = 'bold 14px DM Sans,sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Press ▶ Start to begin simulation', W / 2, H / 2);
  ctx.font = '11px DM Sans,sans-serif'; ctx.fillStyle = '#5a6075';
  ctx.fillText('Bumper-to-bumper Hyderabad traffic', W / 2, H / 2 + 18);
}

function drawScene() {
  const { ctx, W, H } = SCENE;
  ctx.clearRect(0, 0, W, H);

  /* Ghat hill tilt */
  const hillAngle = SCENE.type === 'ghat' ? -7 : 0;
  if (hillAngle !== 0) {
    ctx.save();
    ctx.translate(W / 2, H); ctx.rotate(hillAngle * Math.PI / 180); ctx.translate(-W / 2, -H);
  }

  drawSky(SCENE.skyX);
  drawBuildings(SCENE.bgX, SCENE.midX);
  drawGround();
  drawRoad(SCENE.dashX);
  if (SCENE.type === 'urban') drawCrosswalk();
  if (SCENE.type === 'urban') drawTrafficLight(W * 0.60, H * 0.28);

  /* ── Heat shimmer glow under car ── */
  const maxT = Math.max(tempC1, tempC2);
  if (maxT > 130 && running) {
    const pct = Math.min(1, (maxT - 130) / 170);
    const pulse = 0.7 + 0.3 * Math.sin(Date.now() / 180);
    const alpha = pct * pulse * 0.5;
    const carX = W * 0.22, carBaseY = H * 0.76;
    const shimmerColor = maxT > 260 ? `rgba(239,68,68,${alpha})` : maxT > 200 ? `rgba(249,115,22,${alpha})` : `rgba(245,158,11,${alpha})`;
    const grad = ctx.createRadialGradient(carX + 28, carBaseY, 0, carX + 28, carBaseY, 68);
    grad.addColorStop(0, shimmerColor); grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.ellipse(carX + 28, carBaseY, 68, 13, 0, 0, Math.PI * 2); ctx.fill();
  }

  /* ── Exhaust / heat / dust particles (behind car, draw before player) ── */
  SCENE.particles.forEach(p => {
    if (p.type === 'spark') return;
    ctx.save(); ctx.globalAlpha = Math.max(0, p.life * p.life); /* quadratic fade */
    const r = p.size * (1 + (1 - p.life) * 0.6);
    ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fillStyle = p.col + (0.4 * p.life).toFixed(2) + ')'; ctx.fill();
    ctx.restore();
  });

  /* ── Traffic cars ── */
  SCENE.cars.forEach(c => drawTrafficCar(c));

  /* ── Player car ── */
  drawPlayerCar(W * 0.22, H * 0.61, SCENE.carTilt, SCENE.wheelAngle);

  /* ── Sparks above road (draw after player) ── */
  SCENE.particles.forEach(p => {
    if (p.type !== 'spark') return;
    ctx.save(); ctx.globalAlpha = Math.max(0, p.life);
    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
    grd.addColorStop(0, '#ffffff'); grd.addColorStop(0.4, p.col); grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  });

  if (hillAngle !== 0) ctx.restore();
  drawHUD();
}

/* ─── Sky ─── */
function drawSky(scrollX) {
  const { ctx, W, H } = SCENE;
  const dark = isDarkTheme(), type = SCENE.type;
  let top, bot;
  if (type === 'ghat')         { top = dark ? '#0d1f0a' : '#a8d5a2'; bot = dark ? '#1e3d14' : '#c8ecc0'; }
  else if (type === 'highway') { top = dark ? '#080e1a' : '#aecde8'; bot = dark ? '#10192e' : '#d6ecf8'; }
  else                         { top = dark ? '#090a0d' : '#c4d0e6'; bot = dark ? '#13151c' : '#e4eaf6'; }
  const g = ctx.createLinearGradient(0, 0, 0, H * 0.55);
  g.addColorStop(0, top); g.addColorStop(1, bot);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H * 0.55);

  if (dark) {
    /* Stars */
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    const starSeed = 42;
    for (let i = 0; i < 22; i++) {
      const sx = ((i * 137 + scrollX * 0.01) % W + W) % W;
      const sy = ((i * 73) % (H * 0.40));
      const sr = 0.6 + (i % 3) * 0.4;
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
    }
    /* Moon */
    ctx.beginPath(); ctx.arc(W * 0.84, H * 0.12, 9, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(210,218,170,0.65)'; ctx.fill();
    ctx.beginPath(); ctx.arc(W * 0.87, H * 0.10, 7, 0, Math.PI * 2);
    ctx.fillStyle = top; ctx.fill(); /* crescent cutout */
  } else {
    /* Clouds */
    const cx = ((scrollX * 0.03) % W + W * 3) % W;
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    [[cx - 40, H * 0.07, 52, 18], [cx + 140, H * 0.05, 72, 22], [cx + 310, H * 0.12, 46, 15],
     [cx + 480, H * 0.07, 60, 17]].forEach(([x, y, rw, rh]) => {
      ctx.beginPath(); ctx.ellipse(x, y, rw, rh, 0, 0, Math.PI * 2); ctx.fill();
    });
    /* Sun */
    ctx.beginPath(); ctx.arc(W * 0.84, H * 0.10, 13, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,215,50,0.90)'; ctx.fill();
    ctx.beginPath(); ctx.arc(W * 0.84, H * 0.10, 18, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,230,80,0.25)'; ctx.fill();
  }
}

/* ─── Buildings / terrain ─── */
function drawBuildings(bgX, midX) {
  const { ctx, W, H } = SCENE;
  const dark = isDarkTheme(), type = SCENE.type;

  if (type === 'ghat') {
    /* Layered mountain silhouettes */
    const cols = dark ? ['#0d2209','#0f2a0a','#123010'] : ['#1a5e0e','#237016','#2d8820'];
    [0.9, 0.65, 0.4].forEach((alpha, layer) => {
      const ox = ((bgX * (0.3 + layer * 0.15)) % (W + 400) + W * 3) % (W + 400);
      ctx.fillStyle = cols[layer];
      ctx.beginPath(); ctx.moveTo(-10, H * 0.56);
      for (let i = 0; i < 7; i++) {
        const mx = (ox + i * 190) % (W + 400) - 50;
        const mh = H * (0.18 + layer * 0.06 + (i % 3) * 0.03);
        ctx.lineTo(mx + 80, H * 0.56 - mh);
        ctx.lineTo(mx + 160 + layer * 20, H * 0.56);
      }
      ctx.lineTo(W + 10, H * 0.56); ctx.closePath(); ctx.fill();
    });
    /* Tree line */
    const tX = ((midX * 0.6) % (W + 200) + W * 3) % (W + 200);
    ctx.fillStyle = dark ? '#0a2008' : '#1a5010';
    for (let i = 0; i < 12; i++) {
      const tx = (tX + i * 60) % (W + 120) - 30, th = 18 + (i % 4) * 6;
      ctx.beginPath(); ctx.moveTo(tx, H * 0.56); ctx.lineTo(tx + 10, H * 0.56 - th); ctx.lineTo(tx + 20, H * 0.56); ctx.fill();
    }
    return;
  }

  if (type === 'highway') {
    /* Distance road markers + pylons */
    const pX = ((midX * 0.8) % (W + 200) + W * 3) % (W + 200);
    ctx.fillStyle = dark ? '#2a2a2a' : '#888888';
    for (let i = 0; i < 5; i++) {
      const px = (pX + i * 140) % (W + 150) - 20;
      ctx.fillRect(px, H * 0.50, 4, H * 0.06); /* pylon */
      ctx.fillStyle = '#ef4444'; ctx.fillRect(px - 1, H * 0.50, 6, 3); ctx.fillStyle = dark ? '#2a2a2a' : '#888';
    }
    /* Overpass silhouette in background */
    if (elapsed > 50 && elapsed < 80) {
      const alpha = Math.min(1, Math.min(elapsed - 50, 80 - elapsed) / 10);
      ctx.save(); ctx.globalAlpha = alpha;
      ctx.fillStyle = dark ? '#1a1c28' : '#8892a4';
      ctx.fillRect(W * 0.55, H * 0.28, W * 0.35, H * 0.27); /* bridge deck */
      ctx.fillRect(W * 0.55, H * 0.30, 14, H * 0.26); ctx.fillRect(W * 0.88, H * 0.30, 14, H * 0.26);
      ctx.restore();
    }
    return;
  }

  /* Urban buildings */
  const bX = ((bgX * 0.45) % (W + 500) + W * 3) % (W + 500);
  const profiles = [
    { w: 52, h: 0.55 }, { w: 38, h: 0.38 }, { w: 60, h: 0.48 },
    { w: 44, h: 0.32 }, { w: 50, h: 0.52 }, { w: 66, h: 0.44 }, { w: 36, h: 0.35 }, { w: 58, h: 0.50 },
  ];
  const buildCol = dark ? ['#181b25','#131620','#1d2130','#141820'] : ['#b4bbc8','#c4ccd8','#a4abb8','#ccd0da'];
  for (let i = 0; i < 10; i++) {
    const b = profiles[i % profiles.length];
    const bx = (bX + i * 72 + (i % 3) * 8) % (W + 600) - 80;
    const bh = H * b.h;
    ctx.fillStyle = buildCol[i % buildCol.length];
    ctx.fillRect(bx, H * 0.56 - bh, b.w, bh);
    /* Windows */
    if (dark) {
      for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
        if (Math.sin(i * 7 + r * 3 + c) > -0.2) {
          ctx.fillStyle = 'rgba(255,215,80,0.35)';
          ctx.fillRect(bx + 6 + c * 14, H * 0.56 - bh + 8 + r * 14, 8, 8);
        }
      }
    }
    /* Shop/hoarding band at ground level */
    if (scenario === 'mall' || scenario === 'signal') {
      ctx.fillStyle = dark ? '#2d3244' : '#e0e8f4';
      ctx.fillRect(bx, H * 0.50, b.w, H * 0.06);
    }
  }

  /* Midground: overhead wires + poles */
  const mX = ((midX * 0.7) % (W + 120) + W * 3) % (W + 120);
  ctx.strokeStyle = dark ? 'rgba(80,85,100,0.6)' : 'rgba(120,120,120,0.4)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 6; i++) {
    const px = (mX + i * 95) % (W + 100) - 10;
    ctx.fillStyle = dark ? '#3a3f52' : '#828a9a';
    ctx.fillRect(px, H * 0.38, 4, H * 0.18);
    ctx.beginPath(); ctx.moveTo(px - 40, H * 0.40); ctx.lineTo(px + 80, H * 0.38); ctx.stroke();
  }
}

/* ─── Ground ─── */
function drawGround() {
  const { ctx, W, H } = SCENE;
  const dark = isDarkTheme(), type = SCENE.type, groundY = H * 0.55;
  if (type === 'ghat') {
    /* Grass bank */
    ctx.fillStyle = dark ? '#162210' : '#3d7a28';
    ctx.fillRect(0, groundY, W, H - groundY);
  } else {
    /* Pavement / kerb */
    ctx.fillStyle = dark ? '#14161e' : '#bcc4cc';
    ctx.fillRect(0, groundY, W, H - groundY);
    /* Kerb line */
    ctx.fillStyle = dark ? '#ffffff' : '#e8eaf0';
    ctx.fillRect(0, groundY, W, 2);
  }
}

/* ─── Road surface ─── */
function drawRoad(dashX) {
  const { ctx, W, H } = SCENE;
  const dark = isDarkTheme();
  const roadTop = H * 0.56, roadH = H - roadTop;

  /* Road base */
  ctx.fillStyle = dark ? '#1a1c26' : '#878b98';
  ctx.fillRect(0, roadTop, W, roadH);

  /* Subtle road texture (worn strips) */
  ctx.fillStyle = dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)';
  for (let x = 0; x < W; x += 22) ctx.fillRect(x, roadTop, 10, roadH);

  /* Edge lines */
  ctx.fillStyle = dark ? '#e8e8e8' : '#ffffff';
  ctx.fillRect(0, roadTop, W, 2);
  ctx.fillRect(0, H - 5, W, 4);

  /* Center lane dashes */
  const laneY = H * 0.71;
  ctx.fillStyle = dark ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.65)';
  for (let x = dashX; x < W + 80; x += 82) ctx.fillRect(x, laneY - 2, 48, 4);

  /* Second lane dash (highway has 2 lanes visible) */
  if (SCENE.type === 'highway') {
    const lane2Y = H * 0.86;
    ctx.fillStyle = dark ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.45)';
    for (let x = dashX; x < W + 80; x += 82) ctx.fillRect(x, lane2Y - 1, 48, 3);
  }
}

/* ─── Crosswalk (urban only) ─── */
function drawCrosswalk() {
  const { ctx, W, H } = SCENE;
  const dark = isDarkTheme();
  const cx = SCENE.stopLineX - 30;
  ctx.fillStyle = dark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.35)';
  for (let i = 0; i < 5; i++) ctx.fillRect(cx + i * 9, H * 0.57, 5, H * 0.40);
  /* Stop line */
  ctx.fillStyle = dark ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.75)';
  ctx.fillRect(SCENE.stopLineX - 10, H * 0.57, 4, H * 0.40);
}

/* ─── Traffic car ─── */
function drawTrafficCar(car) {
  const { ctx, H } = SCENE;
  const spec = CAR_TYPES[car.type] || CAR_TYPES.sedan;
  const y = H * 0.62;
  const scale = car.type === 'bike' ? 0.55 : car.type === 'auto' ? 0.62 : 0.72;

  ctx.save();
  ctx.translate(car.x, y);
  ctx.scale(scale, scale);
  drawCarShape(ctx, car.type, car.color, false, 0, 0, car.brakeAlpha);
  ctx.restore();
}

/* ─── Player car ─── */
function drawPlayerCar(x, y, tiltDeg, wheelAngle) {
  const { ctx } = SCENE;
  ctx.save(); ctx.translate(x, y); ctx.rotate(tiltDeg * Math.PI / 180);

  /* Clutch glow (C1=teal, C2=violet) tied to active clutch & temp */
  const maxT = Math.max(tempC1, tempC2);
  if (maxT > 130 && running) {
    const hAlpha = Math.min(0.65, (maxT - 130) / 160) * (0.75 + 0.25 * Math.sin(Date.now() / 200));
    const hColor = simActiveClutch === 'C1' ? `rgba(0,212,200,${hAlpha * 0.45})` : `rgba(167,139,250,${hAlpha * 0.45})`;
    ctx.shadowColor = hColor; ctx.shadowBlur = 22;
  }
  drawCarShape(ctx, 'player', '#c4ccd6', true, wheelAngle, maxT, 0);
  ctx.shadowBlur = 0;
  ctx.restore();
}

/* ─── Unified car shape renderer ─── */
function drawCarShape(ctx, type, color, isPlayer, wheelAngle, maxT, brakeAlpha) {
  const dark = isDarkTheme();

  if (isPlayer) {
    /* ── Kia-like sedan/SUV side silhouette ── */
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-46, 10); ctx.lineTo(-46, -8); ctx.lineTo(-30, -21);
    ctx.lineTo(8, -29); ctx.lineTo(28, -29);
    ctx.lineTo(44, -18); ctx.lineTo(50, -8); ctx.lineTo(50, 10);
    ctx.closePath(); ctx.fill();

    /* Roof */
    ctx.fillStyle = dark ? '#2a2e3e' : '#98a0b4';
    ctx.beginPath();
    ctx.moveTo(-28, -18); ctx.lineTo(-12, -34); ctx.lineTo(22, -34); ctx.lineTo(38, -18);
    ctx.closePath(); ctx.fill();

    /* Windows */
    ctx.fillStyle = 'rgba(100,185,230,0.65)';
    ctx.beginPath(); ctx.moveTo(-24, -19); ctx.lineTo(-11,-33); ctx.lineTo(4,-33); ctx.lineTo(4,-19); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(7,-19); ctx.lineTo(7,-33); ctx.lineTo(22,-33); ctx.lineTo(36,-19); ctx.closePath(); ctx.fill();

    /* Door line */
    ctx.strokeStyle = dark ? '#1e222f' : '#7880a0'; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(4, -19); ctx.lineTo(4, 10); ctx.stroke();

    /* Headlight */
    ctx.fillStyle = 'rgba(255,245,160,0.95)';
    ctx.beginPath(); ctx.ellipse(48, -5, 5, 4, 0, 0, Math.PI * 2); ctx.fill();

    /* Tail lights (always present, brightness = decel) */
    const tlA = 0.5 + 0.5 * Math.min(1, Math.max(0, -simAccel / 3));
    ctx.fillStyle = `rgba(255,40,20,${tlA})`;
    ctx.fillRect(-48, -8, 6, 5); ctx.fillRect(-48, 0, 6, 5);
    if (tlA > 0.7) { /* brake glow */
      ctx.shadowColor = '#ff2814'; ctx.shadowBlur = 8;
      ctx.fillRect(-48, -8, 6, 5); ctx.fillRect(-48, 0, 6, 5);
      ctx.shadowBlur = 0;
    }

    /* Bumper */
    ctx.fillStyle = dark ? '#383c50' : '#9098aa';
    ctx.fillRect(-50, 7, 10, 5); ctx.fillRect(44, 7, 10, 5);

    /* Logo dot */
    ctx.fillStyle = dark ? '#5a6080' : '#888da0';
    ctx.beginPath(); ctx.arc(6, -2, 2.5, 0, Math.PI * 2); ctx.fill();

    /* Wheels */
    [[-30, 10], [30, 10]].forEach(([wx, wy]) => {
      ctx.save(); ctx.translate(wx, wy);
      ctx.fillStyle = '#181818'; ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill();
      /* Tyre wall */
      ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.stroke();
      /* Rim */
      ctx.fillStyle = '#606070'; ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#888'; ctx.beginPath(); ctx.arc(0, 0, 3.5, 0, Math.PI * 2); ctx.fill();
      /* Spokes */
      ctx.strokeStyle = '#aaaaaa'; ctx.lineWidth = 1.2;
      for (let i = 0; i < 5; i++) {
        const a = (wheelAngle + i * 72) * Math.PI / 180;
        ctx.beginPath(); ctx.moveTo(Math.cos(a) * 3, Math.sin(a) * 3);
        ctx.lineTo(Math.cos(a) * 7, Math.sin(a) * 7); ctx.stroke();
      }
      ctx.restore();
    });

    /* Gearbox heat tint */
    if (maxT > 170) {
      const a = Math.min(0.5, (maxT - 170) / 140);
      ctx.fillStyle = maxT > 260 ? `rgba(239,68,68,${a})` : `rgba(249,115,22,${a})`;
      ctx.beginPath(); ctx.ellipse(0, 0, 28, 9, 0, 0, Math.PI * 2); ctx.fill();
    }

  } else {
    /* ── Generic traffic car ── */
    const spec = CAR_TYPES[type] || CAR_TYPES.sedan;
    const hw = spec.w / 2, hh = spec.bodyH;

    if (type === 'bike') {
      /* Motorbike silhouette */
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(-hw, hh / 2); ctx.lineTo(-hw, -hh * 0.5); ctx.lineTo(-hw * 0.3, -hh);
      ctx.lineTo(hw * 0.6, -hh); ctx.lineTo(hw, -hh * 0.3); ctx.lineTo(hw, hh / 2); ctx.closePath(); ctx.fill();
      [-hw * 0.6, hw * 0.6].forEach(wx => {
        ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(wx, hh / 2, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#555'; ctx.beginPath(); ctx.arc(wx, hh / 2, 5, 0, Math.PI * 2); ctx.fill();
      });
    } else if (type === 'auto') {
      /* Auto-rickshaw */
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(-hw, hh / 2); ctx.lineTo(-hw, 0); ctx.lineTo(-hw * 0.2, -hh * 0.9);
      ctx.lineTo(hw * 0.5, -hh * 0.9); ctx.lineTo(hw, -hh * 0.3); ctx.lineTo(hw, hh / 2); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(100,200,240,0.4)';
      ctx.fillRect(-hw * 0.1, -hh * 0.85, hw * 0.55, hh * 0.55); /* windscreen */
      [-hw * 0.55, hw * 0.55].forEach(wx => {
        ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(wx, hh / 2, 7, 0, Math.PI * 2); ctx.fill();
      });
    } else {
      /* Sedan / SUV / Truck */
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(-hw, hh / 2); ctx.lineTo(-hw, -hh * 0.3);
      ctx.lineTo(-hw + 14, -hh); ctx.lineTo(hw - 10, -hh);
      ctx.lineTo(hw, -hh * 0.3); ctx.lineTo(hw, hh / 2); ctx.closePath(); ctx.fill();
      /* Roof (sedan/suv only) */
      if (type !== 'truck') {
        ctx.fillStyle = dark ? '#2a2e3e' : '#90989e';
        ctx.beginPath();
        ctx.moveTo(-hw + 16, -hh); ctx.lineTo(-hw + 26, -hh * 1.5); ctx.lineTo(hw - 18, -hh * 1.5); ctx.lineTo(hw - 8, -hh); ctx.closePath(); ctx.fill();
      }
      /* Windscreen */
      ctx.fillStyle = 'rgba(100,180,220,0.5)';
      ctx.fillRect(-hw + 18, -hh * 0.95, hw * 0.35, hh * 0.7);
    }

    /* Tail / brake lights */
    const bl = Math.max(0.45, brakeAlpha || 0);
    ctx.fillStyle = `rgba(255,${Math.round(30 + (1 - bl) * 60)},20,${bl})`;
    ctx.fillRect(-hw - 2, -hh * 0.3, 5, 9);
    if (bl > 0.7) { ctx.shadowColor = '#ff2010'; ctx.shadowBlur = 7; ctx.fillRect(-hw - 2, -hh * 0.3, 5, 9); ctx.shadowBlur = 0; }

    /* Headlights */
    ctx.fillStyle = 'rgba(255,248,160,0.8)';
    ctx.beginPath(); ctx.ellipse(hw + 2, -hh * 0.2, 4, 3, 0, 0, Math.PI * 2); ctx.fill();
  }
}

/* ─── Traffic light ─── */
function drawTrafficLight(x, y) {
  const { ctx } = SCENE, dark = isDarkTheme();
  /* Pole */
  ctx.fillStyle = dark ? '#3c4050' : '#6a7080';
  ctx.fillRect(x - 2, y + 10, 4, 55);
  /* Extended arm */
  ctx.fillRect(x - 2, y, 20, 3);
  /* Box */
  ctx.fillStyle = dark ? '#1a1d28' : '#282d3a';
  roundRect(ctx, x + 16, y - 36, 18, 50, 5); ctx.fill();
  /* Lights */
  const lights = [
    { col: '#dd0000', glow: '#ff2222', active: SCENE.lightState === 'red',   oy: -28 },
    { col: '#cc9900', glow: '#ffcc22', active: SCENE.lightState === 'amber', oy: -14 },
    { col: '#009900', glow: '#22ff22', active: SCENE.lightState === 'green', oy:   0 },
  ];
  lights.forEach(l => {
    ctx.fillStyle = l.active ? l.col : 'rgba(60,60,60,0.7)';
    ctx.beginPath(); ctx.arc(x + 25, y + l.oy, 5.5, 0, Math.PI * 2); ctx.fill();
    if (l.active) {
      ctx.save(); ctx.shadowColor = l.glow; ctx.shadowBlur = 14;
      ctx.fillStyle = l.col;
      ctx.beginPath(); ctx.arc(x + 25, y + l.oy, 5.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  });
}

/* ─── HUD overlay ─── */
function drawHUD() {
  const { ctx, W, H, animSpeed } = SCENE, dark = isDarkTheme();

  /* Speed badge */
  ctx.fillStyle = dark ? 'rgba(8,9,12,0.74)' : 'rgba(255,255,255,0.74)';
  roundRect(ctx, 10, 10, 82, 52, 9); ctx.fill();
  ctx.fillStyle = dark ? '#c8cdd8' : '#1a1d26';
  ctx.font = 'bold 23px DM Mono,monospace'; ctx.textAlign = 'center';
  ctx.fillText(Math.round(animSpeed), 51, 38);
  ctx.font = '10px DM Sans,sans-serif'; ctx.fillStyle = '#5a6075';
  ctx.fillText('km/h', 51, 52);

  /* Queue length badge (urban) */
  if (SCENE.type === 'urban' && running) {
    const stopped = SCENE.cars.filter(c => c.vel < 1).length;
    ctx.fillStyle = dark ? 'rgba(8,9,12,0.74)' : 'rgba(255,255,255,0.74)';
    roundRect(ctx, 100, 10, 74, 36, 9); ctx.fill();
    ctx.fillStyle = stopped > 4 ? 'var(--red)' : stopped > 2 ? 'var(--orange)' : 'var(--green)';
    ctx.font = 'bold 11px DM Sans,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(`${stopped} stopped`, 137, 29);
    ctx.font = '9px DM Sans,sans-serif'; ctx.fillStyle = '#5a6075';
    ctx.fillText('in queue', 137, 40);
  }

  /* Gear badge */
  const gx = W - 58, gy = 10, gw = 48, gh = 52;
  ctx.fillStyle = dark ? 'rgba(8,9,12,0.74)' : 'rgba(255,255,255,0.74)';
  roundRect(ctx, gx, gy, gw, gh, 9); ctx.fill();
  ctx.fillStyle = dark ? '#c8cdd8' : '#1a1d26';
  ctx.font = 'bold 20px DM Mono,monospace'; ctx.textAlign = 'center';
  const gearLabel = simSpeed < 2 ? 'N' : String(simGear).split(' ')[0];
  ctx.fillText(gearLabel, gx + gw / 2, gy + 30);
  ctx.font = '10px DM Sans,sans-serif'; ctx.fillStyle = '#5a6075';
  ctx.fillText('GEAR', gx + gw / 2, gy + 44);

  /* Clutch indicator dot */
  const dotCol = simActiveClutch === 'C1' ? '#00d4c8' : '#a78bfa';
  ctx.fillStyle = dotCol;
  ctx.beginPath(); ctx.arc(gx + gw / 2, gy + 16, 4, 0, Math.PI * 2); ctx.fill();

  /* Acceleration bar */
  const barX = W / 2 - 52, barY = H - 18, barW = 104, barH = 6;
  ctx.fillStyle = dark ? 'rgba(8,9,12,0.5)' : 'rgba(0,0,0,0.14)';
  roundRect(ctx, barX - 2, barY - 2, barW + 4, barH + 4, 4); ctx.fill();
  const aFrac = Math.max(-1, Math.min(1, simAccel / 5)), midX = barX + barW / 2;
  if (aFrac > 0) { ctx.fillStyle = '#22c55e'; ctx.fillRect(midX, barY, aFrac * barW / 2, barH); }
  else if (aFrac < 0) { ctx.fillStyle = '#ef4444'; ctx.fillRect(midX + aFrac * barW / 2, barY, -aFrac * barW / 2, barH); }
  ctx.strokeStyle = dark ? 'rgba(200,200,200,0.25)' : 'rgba(0,0,0,0.18)'; ctx.lineWidth = 1;
  ctx.strokeRect(barX, barY, barW, barH);
  ctx.beginPath(); ctx.moveTo(midX, barY - 2); ctx.lineTo(midX, barY + barH + 2); ctx.stroke();

  /* Clutch slip indicator */
  if (simSlip > 8 && running) {
    ctx.save();
    ctx.fillStyle = `rgba(249,115,22,${Math.min(0.9, (simSlip - 8) / 60)})`;
    ctx.font = 'bold 10px DM Mono,monospace'; ctx.textAlign = 'center';
    ctx.fillText('⚠ SLIP ' + simSlip.toFixed(0) + ' rad/s', W / 2, H - 24);
    ctx.restore();
  }

  /* Scene label (top-right of canvas, synced to DOM el) */
  const label = simSpeed < 2
    ? (simSlip > 10 ? 'CLUTCH SLIP' : 'STOPPED')
    : simSpeed < 15 ? 'CRAWLING'
    : simSpeed < 35 ? 'STOP-GO'
    : simSpeed > 55 ? 'CRUISE'
    : 'CITY';
  el('scene-label').textContent = label;
}

/* ─── Utility ─── */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r); ctx.closePath();
}
