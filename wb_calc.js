// ============================================================
// AviOps v3 — Weight & Balance Calculator
// Aircraft-specific profiles, CG envelope graph, loading table
// ============================================================

let wb_currentAircraft = null;
let wb_weights = {};

function initWBCalculator() {
  const acSelect = document.getElementById('wb_aircraft_select');
  if (!acSelect) return;

  // Group aircraft by category
  const groups = {};
  Object.keys(WB_AIRCRAFT).forEach(name => {
    const cat = WB_AIRCRAFT[name].category;
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(name);
  });

  acSelect.innerHTML = '<option value="">— Select Aircraft Variant —</option>';
  Object.keys(groups).forEach(cat => {
    const og = document.createElement('optgroup');
    og.label = cat;
    groups[cat].forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      og.appendChild(opt);
    });
    acSelect.appendChild(og);
  });
}

function loadWBAircraft() {
  const name = document.getElementById('wb_aircraft_select').value;
  if (!name || !WB_AIRCRAFT[name]) return;

  wb_currentAircraft = WB_AIRCRAFT[name];
  wb_weights = {};

  // Init weights from defaults
  wb_currentAircraft.stations.forEach((s, i) => {
    wb_weights[i] = s.defaultWeight || 0;
  });

  renderWBTable();
  updateWBCalc();
}

function renderWBTable() {
  const ac = wb_currentAircraft;
  if (!ac) return;

  const container = document.getElementById('wb_table_container');

  let html = `
    <div class="wb-ac-header">
      <div class="wb-ac-name">${document.getElementById('wb_aircraft_select').value}</div>
      <div class="wb-ac-limits">
        Max Gross: <span class="wb-limit-val">${ac.maxGross.toLocaleString()} lbs</span>
        &nbsp;|&nbsp; Datum: Station 0
      </div>
    </div>
    <div class="wb-table-wrap">
      <table class="wb-calc-table">
        <thead>
          <tr>
            <th>STATION</th>
            <th>ARM (in)</th>
            <th>WEIGHT (lbs)</th>
            <th>MOMENT (lb·in)</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody id="wb_tbody">
        </tbody>
        <tfoot>
          <tr class="wb-total-row">
            <td colspan="2">TOTALS</td>
            <td id="wb_total_weight">—</td>
            <td id="wb_total_moment">—</td>
            <td id="wb_total_status">—</td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="wb-cg-result" id="wb_cg_result"></div>
  `;

  container.innerHTML = html;

  renderWBRows();
}

function renderWBRows() {
  const ac = wb_currentAircraft;
  const tbody = document.getElementById('wb_tbody');
  if (!tbody) return;

  tbody.innerHTML = ac.stations.map((s, i) => {
    const w = wb_weights[i] || 0;
    const moment = (w * s.arm).toFixed(1);
    const overMax = s.maxWeight && w > s.maxWeight;

    return `
      <tr class="${overMax ? 'wb-row-warn' : ''}">
        <td class="wb-station-name">
          ${s.name}
          ${s.fuelGal ? `<br><span class="wb-fuel-hint">${s.fuelGal} gal max · ${s.lbsPerGal} lb/gal</span>` : ''}
          ${s.maxWeight ? `<br><span class="wb-fuel-hint">Max: ${s.maxWeight} lbs</span>` : ''}
        </td>
        <td class="wb-arm-val">${s.arm}"</td>
        <td>
          ${s.fixed
            ? `<span class="wb-fixed-val">${w.toLocaleString()}</span>`
            : `<input type="number" class="wb-weight-input" value="${w}"
                onchange="setWBWeight(${i}, this.value)"
                oninput="setWBWeight(${i}, this.value)"
                min="0" ${s.maxWeight ? `max="${s.maxWeight}"` : ''}/>`
          }
        </td>
        <td class="wb-moment-val" id="wb_moment_${i}">${moment}</td>
        <td>${overMax ? '<span class="wb-over">OVER LIMIT</span>' : '<span class="wb-ok">OK</span>'}</td>
      </tr>
    `;
  }).join('');
}

function setWBWeight(index, value) {
  wb_weights[index] = parseFloat(value) || 0;
  // Update moment cell without full re-render
  const ac = wb_currentAircraft;
  const s = ac.stations[index];
  const moment = (wb_weights[index] * s.arm).toFixed(1);
  const cell = document.getElementById(`wb_moment_${index}`);
  if (cell) cell.textContent = moment;
  updateWBCalc();
}

function updateWBCalc() {
  const ac = wb_currentAircraft;
  if (!ac) return;

  let totalWeight = 0;
  let totalMoment = 0;

  ac.stations.forEach((s, i) => {
    const w = wb_weights[i] || 0;
    totalWeight += w;
    totalMoment += w * s.arm;
  });

  const cg = totalWeight > 0 ? (totalMoment / totalWeight) : 0;

  // Determine CG limits at this weight
  const limits = getCGLimitsAtWeight(ac, totalWeight);
  const overWeight = totalWeight > ac.maxGross;
  const cgOk = limits && cg >= limits.fwd && cg <= limits.aft;
  const cgStatus = overWeight ? 'OVER GROSS' : !cgOk ? 'CG OUT OF LIMITS' : 'WITHIN LIMITS';
  const cgColor = (overWeight || !cgOk) ? 'var(--danger)' : 'var(--success)';

  // Update totals row
  const tw = document.getElementById('wb_total_weight');
  const tm = document.getElementById('wb_total_moment');
  const ts = document.getElementById('wb_total_status');
  if (tw) tw.textContent = totalWeight.toLocaleString() + ' lbs';
  if (tm) tm.textContent = totalMoment.toFixed(0);
  if (ts) {
    ts.innerHTML = `<span style="color:${cgColor};font-weight:700">${cgStatus}</span>`;
  }

  // CG result panel
  const cgPanel = document.getElementById('wb_cg_result');
  if (cgPanel) {
    cgPanel.innerHTML = `
      <div class="wb-cg-chips">
        <div class="wb-cg-chip">
          <div class="wb-cg-chip-label">GROSS WEIGHT</div>
          <div class="wb-cg-chip-val" style="color:${overWeight ? 'var(--danger)' : 'var(--accent)'}">${totalWeight.toLocaleString()} lbs</div>
          <div class="wb-cg-chip-sub">Max: ${ac.maxGross.toLocaleString()} lbs</div>
        </div>
        <div class="wb-cg-chip">
          <div class="wb-cg-chip-label">CG LOCATION</div>
          <div class="wb-cg-chip-val" style="color:${cgOk && !overWeight ? 'var(--accent)' : 'var(--danger)'}">${cg.toFixed(2)}"</div>
          <div class="wb-cg-chip-sub">${limits ? `Limits: ${limits.fwd}"–${limits.aft}"` : 'Check POH'}</div>
        </div>
        <div class="wb-cg-chip">
          <div class="wb-cg-chip-label">TOTAL MOMENT</div>
          <div class="wb-cg-chip-val">${totalMoment.toFixed(0)}</div>
          <div class="wb-cg-chip-sub">lb·in</div>
        </div>
        <div class="wb-cg-chip ${overWeight || !cgOk ? 'wb-cg-danger' : 'wb-cg-good'}">
          <div class="wb-cg-chip-label">STATUS</div>
          <div class="wb-cg-chip-val">${cgStatus}</div>
          <div class="wb-cg-chip-sub">${overWeight ? `Over by ${(totalWeight - ac.maxGross).toFixed(0)} lbs` : cgOk ? 'Safe to fly' : 'Do not fly'}</div>
        </div>
      </div>
    `;
  }

  // Draw CG envelope graph
  drawCGEnvelope(ac, totalWeight, cg, overWeight, cgOk);
}

function getCGLimitsAtWeight(ac, weight) {
  const pts = ac.cgLimits;
  if (!pts || pts.length === 0) return null;

  // Clamp to envelope
  if (weight <= pts[0].weight) return { fwd: pts[0].fwd, aft: pts[0].aft };
  if (weight >= pts[pts.length - 1].weight) return { fwd: pts[pts.length - 1].fwd, aft: pts[pts.length - 1].aft };

  // Interpolate
  for (let i = 0; i < pts.length - 1; i++) {
    if (weight >= pts[i].weight && weight <= pts[i + 1].weight) {
      const t = (weight - pts[i].weight) / (pts[i + 1].weight - pts[i].weight);
      return {
        fwd: pts[i].fwd + t * (pts[i + 1].fwd - pts[i].fwd),
        aft: pts[i].aft + t * (pts[i + 1].aft - pts[i].aft)
      };
    }
  }
  return null;
}

function drawCGEnvelope(ac, totalWeight, cg, overWeight, cgOk) {
  const canvas = document.getElementById('wb_cg_canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const W = canvas.width;
  const H = canvas.height;
  const pad = { top: 30, right: 30, bottom: 50, left: 70 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;

  ctx.clearRect(0, 0, W, H);

  // Background
  ctx.fillStyle = '#0f1520';
  ctx.fillRect(0, 0, W, H);

  // Determine axis ranges
  const pts = ac.cgLimits;
  const allArms = pts.flatMap(p => [p.fwd, p.aft]);
  const armMin = Math.min(...allArms) - 2;
  const armMax = Math.max(...allArms) + 2;
  const wtMin = 0;
  const wtMax = ac.maxGross * 1.05;

  const toX = arm => pad.left + ((arm - armMin) / (armMax - armMin)) * plotW;
  const toY = wt => pad.top + plotH - ((wt - wtMin) / (wtMax - wtMin)) * plotH;

  // Grid lines
  ctx.strokeStyle = 'rgba(0,212,255,0.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = pad.top + (plotH / 5) * i;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + plotW, y); ctx.stroke();
    const x = pad.left + (plotW / 5) * i;
    ctx.beginPath(); ctx.moveTo(x, pad.top); ctx.lineTo(x, pad.top + plotH); ctx.stroke();
  }

  // Draw CG envelope fill
  ctx.beginPath();
  // Forward limit (bottom to top)
  ctx.moveTo(toX(pts[0].fwd), toY(pts[0].weight));
  pts.forEach(p => ctx.lineTo(toX(p.fwd), toY(p.weight)));
  // Aft limit (top to bottom)
  for (let i = pts.length - 1; i >= 0; i--) {
    ctx.lineTo(toX(pts[i].aft), toY(pts[i].weight));
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(0,212,255,0.07)';
  ctx.fill();

  // Envelope border
  ctx.beginPath();
  ctx.moveTo(toX(pts[0].fwd), toY(pts[0].weight));
  pts.forEach(p => ctx.lineTo(toX(p.fwd), toY(p.weight)));
  ctx.strokeStyle = 'rgba(0,212,255,0.6)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(toX(pts[0].aft), toY(pts[0].weight));
  pts.forEach(p => ctx.lineTo(toX(p.aft), toY(p.weight)));
  ctx.stroke();

  // Top and bottom closure lines
  ctx.beginPath();
  ctx.moveTo(toX(pts[0].fwd), toY(pts[0].weight));
  ctx.lineTo(toX(pts[0].aft), toY(pts[0].weight));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(toX(pts[pts.length-1].fwd), toY(pts[pts.length-1].weight));
  ctx.lineTo(toX(pts[pts.length-1].aft), toY(pts[pts.length-1].weight));
  ctx.stroke();

  // Axes
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top);
  ctx.lineTo(pad.left, pad.top + plotH);
  ctx.lineTo(pad.left + plotW, pad.top + plotH);
  ctx.stroke();

  // Axis labels
  ctx.fillStyle = 'rgba(136,153,170,0.8)';
  ctx.font = '10px Share Tech Mono, monospace';
  ctx.textAlign = 'center';

  // X axis — arm values
  const armStep = Math.ceil((armMax - armMin) / 6);
  for (let a = Math.ceil(armMin); a <= armMax; a += armStep) {
    ctx.fillText(a + '"', toX(a), pad.top + plotH + 16);
  }

  // Y axis — weight values
  ctx.textAlign = 'right';
  const wtStep = Math.ceil((wtMax - wtMin) / 5 / 500) * 500;
  for (let w = 0; w <= wtMax; w += wtStep) {
    ctx.fillText(w.toLocaleString(), pad.left - 6, toY(w) + 4);
  }

  // Axis titles
  ctx.fillStyle = 'rgba(0,212,255,0.5)';
  ctx.font = '10px Share Tech Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CG LOCATION (inches aft of datum)', pad.left + plotW / 2, H - 6);

  ctx.save();
  ctx.translate(14, pad.top + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('GROSS WEIGHT (lbs)', 0, 0);
  ctx.restore();

  // Plot current CG point
  if (totalWeight > 0 && cg > 0) {
    const px = toX(cg);
    const py = toY(totalWeight);
    const color = (overWeight || !cgOk) ? '#ff3d3d' : '#00ff88';

    // Crosshairs
    ctx.strokeStyle = color + '44';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(px, pad.top); ctx.lineTo(px, pad.top + plotH); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pad.left, py); ctx.lineTo(pad.left + plotW, py); ctx.stroke();
    ctx.setLineDash([]);

    // Point
    ctx.beginPath();
    ctx.arc(px, py, 7, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Label
    ctx.fillStyle = color;
    ctx.font = 'bold 11px Share Tech Mono, monospace';
    ctx.textAlign = 'left';
    const labelX = px + 10 > pad.left + plotW - 60 ? px - 70 : px + 10;
    ctx.fillText(`${cg.toFixed(1)}"`, labelX, py - 8);
    ctx.fillText(`${totalWeight.toLocaleString()} lbs`, labelX, py + 14);
  }

  // Title
  ctx.fillStyle = 'rgba(0,212,255,0.7)';
  ctx.font = 'bold 11px Share Tech Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CG ENVELOPE', pad.left + plotW / 2, pad.top - 10);
}
