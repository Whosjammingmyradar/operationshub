// ============================================================
// AviOps — Flight Tools & Calculations
// ============================================================

// ===== DENSITY ALTITUDE =====
function calcDA() {
  const elev = parseFloat(document.getElementById('da_elev').value) || 0;
  const altim = parseFloat(document.getElementById('da_alt').value) || 29.92;
  const temp = parseFloat(document.getElementById('da_temp').value) || 15;

  const pa = elev + (29.92 - altim) * 1000;
  const isaTemp = 15 - (elev / 1000) * 2;
  const da = pa + 120 * (temp - isaTemp);

  document.getElementById('da_result').innerHTML =
    `PA: <span style="color:var(--warn)">${Math.round(pa).toLocaleString()} ft</span> &nbsp;|&nbsp; DA: <span style="color:${da > 5000 ? 'var(--danger)' : 'var(--accent)'}">${Math.round(da).toLocaleString()} ft</span>`;
}

// ===== PRESSURE ALTITUDE =====
function calcPA() {
  const elev = parseFloat(document.getElementById('pa_elev').value) || 0;
  const altim = parseFloat(document.getElementById('pa_alt').value) || 29.92;
  const pa = elev + (29.92 - altim) * 1000;
  document.getElementById('pa_result').innerHTML =
    `<span style="color:var(--accent)">${Math.round(pa).toLocaleString()} ft PA</span>`;
}

// ===== TRUE AIRSPEED =====
function calcTAS() {
  const cas = parseFloat(document.getElementById('tas_cas').value) || 0;
  const pa = parseFloat(document.getElementById('tas_pa').value) || 0;
  const oat = parseFloat(document.getElementById('tas_oat').value) || 15;

  // ISA standard temperature at altitude
  const isaT = 15 - (pa / 1000) * 2;
  // Density ratio
  const tempK = oat + 273.15;
  const isaK = isaT + 273.15;
  const pr = Math.pow(1 - (6.8755856e-6 * pa), 5.2558797);
  const sigma = pr * (isaK / tempK);
  const tas = cas / Math.sqrt(sigma);

  document.getElementById('tas_result').innerHTML =
    `TAS: <span style="color:var(--accent)">${Math.round(tas)} KTAS</span>`;
}

// ===== CROSSWIND =====
function calcCrosswind() {
  const rwy = parseFloat(document.getElementById('cw_rwy').value) || 0;
  const dir = parseFloat(document.getElementById('cw_dir').value) || 0;
  const spd = parseFloat(document.getElementById('cw_spd').value) || 0;

  const angle = (dir - rwy) * Math.PI / 180;
  const xw = Math.abs(spd * Math.sin(angle));
  const hw = spd * Math.cos(angle);

  const hwLabel = hw >= 0 ? 'Headwind' : 'Tailwind';
  const hwColor = hw < 0 ? 'var(--danger)' : 'var(--accent)';

  document.getElementById('cw_result').innerHTML =
    `XW: <span style="color:var(--warn)">${xw.toFixed(1)} kts</span> &nbsp;|&nbsp; ${hwLabel}: <span style="color:${hwColor}">${Math.abs(hw).toFixed(1)} kts</span>`;
}

// ===== UNIT CONVERTER =====
function calcUnit() {
  const val = parseFloat(document.getElementById('uc_val').value) || 0;
  const type = document.getElementById('uc_type').value;
  let result = 0;
  let unit = '';

  switch (type) {
    case 'kts_mph':  result = val * 1.15078; unit = 'MPH'; break;
    case 'mph_kts':  result = val * 0.868976; unit = 'kts'; break;
    case 'kts_kph':  result = val * 1.852; unit = 'km/h'; break;
    case 'nm_sm':    result = val * 1.15078; unit = 'SM'; break;
    case 'sm_nm':    result = val * 0.868976; unit = 'NM'; break;
    case 'ft_m':     result = val * 0.3048; unit = 'm'; break;
    case 'm_ft':     result = val * 3.28084; unit = 'ft'; break;
    case 'c_f':      result = (val * 9/5) + 32; unit = '°F'; break;
    case 'f_c':      result = (val - 32) * 5/9; unit = '°C'; break;
    case 'hpa_inhg': result = val * 0.02953; unit = 'inHg'; break;
    case 'inhg_hpa': result = val * 33.8639; unit = 'hPa'; break;
  }

  document.getElementById('uc_result').innerHTML =
    `<span style="color:var(--accent)">${result.toFixed(2)} ${unit}</span>`;
}

// ===== METAR DECODER =====
function decodeMetar() {
  const raw = document.getElementById('metar_decode_input').value.trim().toUpperCase();
  if (!raw) return;

  const out = document.getElementById('metar_decode_output');
  const parts = raw.split(/\s+/);
  const decoded = [];

  let i = 0;
  for (; i < parts.length; i++) {
    const p = parts[i];

    // Station ID
    if (i === 0 && /^[A-Z]{4}$/.test(p)) {
      decoded.push({ label: 'Station', val: p });
      continue;
    }

    // Date/Time: 121752Z
    if (/^\d{6}Z$/.test(p)) {
      const day = p.substring(0, 2);
      const hr = p.substring(2, 4);
      const min = p.substring(4, 6);
      decoded.push({ label: 'Observation Time', val: `Day ${day}, ${hr}:${min} UTC` });
      continue;
    }

    // AUTO / COR
    if (p === 'AUTO') { decoded.push({ label: 'Type', val: 'Automated observation' }); continue; }
    if (p === 'COR') { decoded.push({ label: 'Type', val: 'Corrected observation' }); continue; }

    // Wind: 27015KT or 27015G22KT or VRB05KT or 00000KT
    if (/^(VRB|\d{3})\d{2,3}(G\d{2,3})?(KT|MPS|KMH)$/.test(p)) {
      const m = p.match(/^(VRB|\d{3})(\d{2,3})(G(\d{2,3}))?(KT|MPS|KMH)$/);
      if (m) {
        const dir = m[1] === 'VRB' ? 'Variable' : m[1] + '°';
        const spd = m[2];
        const gust = m[4] ? ` gusting ${m[4]}` : '';
        decoded.push({ label: 'Wind', val: `From ${dir} at ${spd}${gust} ${m[5]}` });
      }
      continue;
    }

    // Wind variable: 250V310
    if (/^\d{3}V\d{3}$/.test(p)) {
      decoded.push({ label: 'Wind Variable', val: `Varying from ${p.substring(0,3)}° to ${p.substring(4)}°` });
      continue;
    }

    // Visibility: 10SM or 1/2SM or 3/4SM
    if (/^(\d+\/?[\d]*)SM$/.test(p)) {
      decoded.push({ label: 'Visibility', val: p.replace('SM', '') + ' statute miles' });
      continue;
    }
    if (/^\d{4}$/.test(p) && parseInt(p) <= 9999) {
      decoded.push({ label: 'Visibility (meters)', val: p + ' m' });
      continue;
    }

    // Sky coverage: FEW/SCT/BKN/OVC/CLR/SKC + height
    if (/^(FEW|SCT|BKN|OVC|CLR|SKC|NSC|VV)(\d{3})?/.test(p)) {
      const m = p.match(/^(FEW|SCT|BKN|OVC|CLR|SKC|NSC|VV)(\d{3})?(TCU|CB)?/);
      if (m) {
        const covers = { FEW:'Few (1–2 oktas)', SCT:'Scattered (3–4 oktas)', BKN:'Broken (5–7 oktas)', OVC:'Overcast (8 oktas)', CLR:'Clear', SKC:'Sky Clear', NSC:'No Significant Cloud', VV:'Vertical Visibility' };
        const alt = m[2] ? ` at ${parseInt(m[2]) * 100} ft AGL` : '';
        const cb = m[3] ? ` (${m[3] === 'TCU' ? 'Towering Cumulus' : 'Cumulonimbus'})` : '';
        decoded.push({ label: 'Sky', val: (covers[m[1]] || m[1]) + alt + cb });
      }
      continue;
    }

    // Weather: -RA, TSRA, BR, FG, etc.
    const wxCodes = { RA:'Rain', SN:'Snow', DZ:'Drizzle', GR:'Hail', GS:'Small Hail/Snow Pellets', SG:'Snow Grains', IC:'Ice Crystals', PL:'Ice Pellets', UP:'Unknown Precipitation', BR:'Mist', FG:'Fog', HZ:'Haze', DU:'Dust', SA:'Sand', VA:'Volcanic Ash', SQ:'Squall', TS:'Thunderstorm', FC:'Funnel Cloud', SS:'Sandstorm', DS:'Duststorm', PY:'Spray', FU:'Smoke' };
    const wxMatch = p.match(/^(-|\+|VC|RE)?(MI|BC|PR|DR|BL|SH|TS|FZ)?(RA|SN|DZ|GR|GS|SG|IC|PL|UP|BR|FG|HZ|DU|SA|VA|SQ|FC|SS|DS|PY|FU)+$/);
    if (wxMatch && p !== 'AUTO' && p !== 'COR') {
      const intens = { '-': 'Light', '+': 'Heavy', 'VC': 'In the vicinity', 'RE': 'Recent' };
      const desc = { MI:'Shallow', BC:'Patchy', PR:'Partial', DR:'Drifting', BL:'Blowing', SH:'Showers', TS:'Thunderstorm', FZ:'Freezing' };
      let text = '';
      for (const [k, v] of Object.entries(intens)) { if (p.startsWith(k)) { text += v + ' '; break; } }
      for (const [k, v] of Object.entries(desc)) { if (p.includes(k)) { text += v + ' '; break; } }
      for (const [k, v] of Object.entries(wxCodes)) { if (p.includes(k)) { text += v + ' '; } }
      if (text) { decoded.push({ label: 'Weather', val: text.trim() }); continue; }
    }

    // Temp/Dewpoint: 22/10 or M05/M08
    if (/^(M?\d{1,2})\/(M?\d{1,2})$/.test(p)) {
      const m = p.match(/^(M?\d{1,2})\/(M?\d{1,2})$/);
      const parseT = s => s.startsWith('M') ? -parseInt(s.substring(1)) : parseInt(s);
      const t = parseT(m[1]);
      const d = parseT(m[2]);
      const spread = t - d;
      decoded.push({ label: 'Temp / Dew Point', val: `${t}°C / ${d}°C (spread: ${spread}°C)` });
      continue;
    }

    // Altimeter: A2992
    if (/^A\d{4}$/.test(p)) {
      const inhg = (parseInt(p.substring(1)) / 100).toFixed(2);
      const hpa = (parseFloat(inhg) * 33.8639).toFixed(0);
      decoded.push({ label: 'Altimeter', val: `${inhg} inHg (${hpa} hPa)` });
      continue;
    }

    // QNH: Q1013
    if (/^Q\d{4}$/.test(p)) {
      const hpa = parseInt(p.substring(1));
      const inhg = (hpa / 33.8639).toFixed(2);
      decoded.push({ label: 'QNH', val: `${hpa} hPa (${inhg} inHg)` });
      continue;
    }

    // RMK
    if (p === 'RMK') {
      decoded.push({ label: 'Remarks', val: parts.slice(i + 1).join(' ') });
      break;
    }
  }

  if (decoded.length === 0) {
    out.innerHTML = '<div style="color:var(--text-secondary)">Could not decode — ensure it is a valid METAR string.</div>';
    return;
  }

  out.innerHTML = decoded.map(d =>
    `<div class="decode-row"><span class="decode-label">${d.label}</span><span class="decode-val">${d.val}</span></div>`
  ).join('');
}

// ===== FAR SEARCH =====
function searchFAR() {
  const query = document.getElementById('farSearch').value.trim().toLowerCase();
  const results = document.getElementById('farResults');

  if (!query) { results.innerHTML = ''; return; }

  const matches = [];
  FAR_DATA.forEach(cat => {
    cat.items.forEach(item => {
      const score = (item.title.toLowerCase().includes(query) ? 2 : 0) +
                    (item.ref.toLowerCase().includes(query) ? 2 : 0) +
                    (item.content.toLowerCase().includes(query) ? 1 : 0);
      if (score > 0) matches.push({ ...item, category: cat.category, score });
    });
  });

  matches.sort((a, b) => b.score - a.score);

  if (matches.length === 0) {
    results.innerHTML = `<div style="color:var(--text-secondary)">No results found for "${query}". Try a broader term or regulation number.</div>`;
    return;
  }

  results.innerHTML = matches.map(m => `
    <div class="far-detail-panel" style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div>
          <span style="font-size:11px;letter-spacing:2px;color:var(--text-secondary)">${m.category}</span>
          <h4>${m.title}</h4>
        </div>
        <span style="font-family:var(--font-data);font-size:11px;color:var(--accent-dim);flex-shrink:0;margin-left:12px">${m.ref}</span>
      </div>
      ${m.content}
    </div>
  `).join('');
}

// ===== WEIGHT & BALANCE =====
let wbItems = [
  { name: 'Empty Weight', weight: 1680, arm: 39.5 },
  { name: 'Pilot', weight: 170, arm: 37 },
  { name: 'Passenger', weight: 150, arm: 37 },
  { name: 'Fuel', weight: 180, arm: 48 },
  { name: 'Baggage', weight: 30, arm: 95 }
];

function renderWBItems() {
  const container = document.getElementById('wbItems');
  container.innerHTML = wbItems.map((item, i) => {
    const moment = (item.weight * item.arm).toFixed(0);
    return `
      <div class="wb-row">
        <input type="text" value="${item.name}" onchange="wbItems[${i}].name=this.value" />
        <input type="number" value="${item.weight}" onchange="wbItems[${i}].weight=parseFloat(this.value)||0;updateWBTotals()" />
        <input type="number" value="${item.arm}" step="0.1" onchange="wbItems[${i}].arm=parseFloat(this.value)||0;updateWBTotals()" />
        <span class="moment-val">${(parseFloat(item.weight)*parseFloat(item.arm)).toFixed(0)}</span>
      </div>
    `;
  }).join('');
  updateWBTotals();
}

function addWBItem() {
  wbItems.push({ name: 'Item', weight: 0, arm: 0 });
  renderWBItems();
}

function updateWBTotals() {
  const totals = document.getElementById('wbTotals');
  let totalWeight = 0, totalMoment = 0;
  wbItems.forEach(item => {
    totalWeight += parseFloat(item.weight) || 0;
    totalMoment += (parseFloat(item.weight) || 0) * (parseFloat(item.arm) || 0);
  });
  const cg = totalWeight > 0 ? (totalMoment / totalWeight).toFixed(2) : '—';

  totals.innerHTML = `
    <div class="wb-total-item">
      <div class="wb-total-label">Gross Weight</div>
      <div class="wb-total-value">${totalWeight.toFixed(0)} lbs</div>
    </div>
    <div class="wb-total-item">
      <div class="wb-total-label">Total Moment</div>
      <div class="wb-total-value">${totalMoment.toFixed(0)}</div>
    </div>
    <div class="wb-total-item">
      <div class="wb-total-label">CG</div>
      <div class="wb-total-value">${cg}" aft datum</div>
    </div>
    <div class="wb-total-item">
      <div class="wb-total-label">Status</div>
      <div class="wb-status wb-warn">Verify against POH envelope</div>
    </div>
  `;
}

// ===== FUEL PLANNING =====
function calcFuel() {
  const fuelType = document.getElementById('fuelType').value;
  const gal = parseFloat(document.getElementById('fuelGal').value) || 0;
  const burn = parseFloat(document.getElementById('fuelBurn').value) || 1;
  const reserve = parseFloat(document.getElementById('fuelReserve').value) || 45;

  const density = fuelType === 'jet-a' ? 6.7 : 6.0;
  const totalLbs = gal * density;
  const reserveGal = (burn * reserve) / 60;
  const usableGal = gal - reserveGal;
  const enduranceMins = (usableGal / burn) * 60;
  const enduranceFull = (gal / burn) * 60;

  const fmt = mins => {
    const h = Math.floor(Math.abs(mins) / 60);
    const m = Math.round(Math.abs(mins) % 60);
    return `${h}h ${m}m`;
  };

  const out = document.getElementById('fuelResults');
  out.innerHTML = `
    <div class="fuel-result-item">
      <div class="fuel-result-label">Fuel Weight</div>
      <div class="fuel-result-value">${totalLbs.toFixed(0)} lbs</div>
    </div>
    <div class="fuel-result-item">
      <div class="fuel-result-label">Reserve Fuel</div>
      <div class="fuel-result-value">${reserveGal.toFixed(1)} gal</div>
    </div>
    <div class="fuel-result-item">
      <div class="fuel-result-label">Usable (–reserve)</div>
      <div class="fuel-result-value">${usableGal.toFixed(1)} gal</div>
    </div>
    <div class="fuel-result-item">
      <div class="fuel-result-label">Endurance (–reserve)</div>
      <div class="fuel-result-value" style="color:${enduranceMins < 0 ? 'var(--danger)' : 'var(--accent)'}">${fmt(enduranceMins)}</div>
    </div>
    <div class="fuel-result-item">
      <div class="fuel-result-label">Total Endurance</div>
      <div class="fuel-result-value">${fmt(enduranceFull)}</div>
    </div>
  `;
}
