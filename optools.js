// ============================================================
// AviOps v5 — Operational Tools
// 1. Sunrise / Sunset Calculator
// 2. ICAO Flight Plan Builder
// 3. Helicopter Hover Performance (HIGE/HOGE)
// ============================================================

// ===== 1. SUNRISE / SUNSET =====
// Algorithm: Jean Meeus "Astronomical Algorithms"

function calcSunriseSunset() {
  const icao = document.getElementById('sun_icao').value.trim().toUpperCase();
  const lat  = parseFloat(document.getElementById('sun_lat').value);
  const lon  = parseFloat(document.getElementById('sun_lon').value);
  const dateStr = document.getElementById('sun_date').value;

  if (isNaN(lat)||isNaN(lon)) { document.getElementById('sun_output').innerHTML='<div class="error-msg">Enter latitude and longitude.</div>'; return; }

  const date = dateStr ? new Date(dateStr+'T12:00:00Z') : new Date();
  const results = getSunTimes(lat, lon, date);
  const out = document.getElementById('sun_output');

  const fmtUTC = d => d ? d.toUTCString().split(' ').slice(4,5)[0] + 'Z' : '—';
  const fmtLocal = d => d ? d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) : '—';

  // Night currency: 1 hr before sunrise to 1 hr after sunset is "night" per FAR 61.57 (civil twilight)
  const civilTwilight = 30; // minutes — civil twilight approx
  const nightStart = results.sunset ? new Date(results.sunset.getTime() - civilTwilight*60000) : null;
  const nightEnd   = results.sunrise? new Date(results.sunrise.getTime()+ civilTwilight*60000) : null;

  out.innerHTML = `
    <div class="sun-grid">
      <div class="sun-card sun-rise">
        <div class="sun-card-icon"></div>
        <div class="sun-card-label">SUNRISE</div>
        <div class="sun-card-time">${fmtUTC(results.sunrise)}</div>
        <div class="sun-card-local">Local: ${fmtLocal(results.sunrise)}</div>
      </div>
      <div class="sun-card sun-set">
        <div class="sun-card-icon"></div>
        <div class="sun-card-label">SUNSET</div>
        <div class="sun-card-time">${fmtUTC(results.sunset)}</div>
        <div class="sun-card-local">Local: ${fmtLocal(results.sunset)}</div>
      </div>
      <div class="sun-card">
        <div class="sun-card-icon"></div>
        <div class="sun-card-label">CIVIL TWILIGHT</div>
        <div class="sun-card-time" style="font-size:13px">Morning: ${fmtUTC(results.dawnCivil)}</div>
        <div class="sun-card-time" style="font-size:13px">Evening: ${fmtUTC(results.duskCivil)}</div>
      </div>
      <div class="sun-card">
        <div class="sun-card-icon"></div>
        <div class="sun-card-label">SOLAR NOON</div>
        <div class="sun-card-time">${fmtUTC(results.solarNoon)}</div>
        <div class="sun-card-local">Day length: ${results.dayLength}</div>
      </div>
    </div>
    <div class="sun-currency-panel">
      <div class="sun-currency-title">NIGHT CURRENCY REFERENCE — 14 CFR §61.57(b)</div>
      <div class="sun-currency-body">
        <div class="sun-currency-row">
          <span class="sun-cur-label">Night begins (end of civil twilight)</span>
          <span class="sun-cur-val">${fmtUTC(results.duskCivil)}</span>
        </div>
        <div class="sun-currency-row">
          <span class="sun-cur-label">Night ends (beginning of civil twilight)</span>
          <span class="sun-cur-val">${fmtUTC(results.dawnCivil)}</span>
        </div>
        <div class="sun-currency-row">
          <span class="sun-cur-label">Passenger carry night window (§61.57)</span>
          <span class="sun-cur-val">1 hr after sunset  1 hr before sunrise</span>
        </div>
      </div>
      <div style="font-size:11px;color:var(--text-secondary);font-family:var(--font-body);margin-top:8px">
        Night for logging purposes: evening civil twilight to morning civil twilight (FAR 1.1). For passenger carry recency: 1 hr after sunset to 1 hr before sunrise (§61.57(b)).
      </div>
    </div>
  `;
}

function getSunTimes(lat, lon, date) {
  const rad = Math.PI/180, deg = 180/Math.PI;
  const JD = dateToJD(date);
  const n  = JD - 2451545.0;
  const L  = (280.460 + 0.9856474*n) % 360;
  const g  = (357.528 + 0.9856003*n) * rad;
  const lambda = (L + 1.915*Math.sin(g) + 0.020*Math.sin(2*g)) * rad;
  const epsilon = (23.439 - 0.0000004*n) * rad;
  const sinDec  = Math.sin(epsilon)*Math.sin(lambda);
  const dec     = Math.asin(sinDec);

  // Hour angle for sunrise/sunset (sun centre on horizon)
  const cosH = (Math.cos(90.833*rad) - sinDec*Math.sin(lat*rad)) / (Math.cos(dec)*Math.cos(lat*rad));
  // Civil twilight (-6 deg)
  const cosHc = (Math.cos(96*rad) - sinDec*Math.sin(lat*rad)) / (Math.cos(dec)*Math.cos(lat*rad));

  const makeTime = (jd) => {
    const ms = (jd - 2440587.5) * 86400000;
    return new Date(ms);
  };

  let sunrise=null, sunset=null, dawnCivil=null, duskCivil=null, solarNoon=null;

  // Equation of time
  const B = 2*Math.PI*(n-81)/364;
  const EoT = 9.87*Math.sin(2*B) - 7.53*Math.cos(B) - 1.5*Math.sin(B); // minutes
  const lonCorrection = lon/15; // hours

  const noon = 12 - lonCorrection - EoT/60;
  solarNoon = makeTime(JD + (noon - 12)/24);

  if (Math.abs(cosH) <= 1) {
    const H = Math.acos(cosH)*deg/15;
    sunrise = makeTime(JD + (noon - H)/24);
    sunset  = makeTime(JD + (noon + H)/24);
  }

  if (Math.abs(cosHc) <= 1) {
    const Hc = Math.acos(cosHc)*deg/15;
    dawnCivil = makeTime(JD + (noon - Hc)/24);
    duskCivil = makeTime(JD + (noon + Hc)/24);
  }

  let dayLength = '—';
  if (sunrise && sunset) {
    const mins = (sunset-sunrise)/60000;
    dayLength = `${Math.floor(mins/60)}h ${Math.round(mins%60)}m`;
  }

  return { sunrise, sunset, dawnCivil, duskCivil, solarNoon, dayLength };
}

function dateToJD(date) {
  return date.getTime()/86400000 + 2440587.5;
}

async function lookupAirportForSun() {
  const icao = document.getElementById('sun_icao').value.trim().toUpperCase();
  if (!icao) return;
  try {
    const res = await fetch(`https://aviationweather.gov/api/data/metar?ids=${icao}&format=json&hours=1`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (data && data.length > 0 && data[0].lat && data[0].lon) {
      document.getElementById('sun_lat').value = parseFloat(data[0].lat).toFixed(4);
      document.getElementById('sun_lon').value = parseFloat(data[0].lon).toFixed(4);
      calcSunriseSunset();
    } else {
      document.getElementById('sun_output').innerHTML = `<div class="error-msg">Could not find coordinates for ${icao}. Enter lat/lon manually.</div>`;
    }
  } catch(e) {
    document.getElementById('sun_output').innerHTML = `<div class="error-msg">Lookup failed. Enter lat/lon manually.</div>`;
  }
}

function initSunriseTool() {
  const today = new Date().toISOString().split('T')[0];
  const el = document.getElementById('sun_date');
  if (el) el.value = today;
}

// ===== 2. ICAO FLIGHT PLAN BUILDER =====

function buildICAOFlightPlan() {
  const v = id => (document.getElementById(id)?.value || '').trim().toUpperCase();
  const n = id => document.getElementById(id)?.value?.trim() || '';

  const acid   = v('fp_acid');
  const fltRules = v('fp_rules');
  const fltType  = v('fp_type');
  const acType   = v('fp_actype');
  const wakecat  = v('fp_wake');
  const equip    = v('fp_equip');
  const dep      = v('fp_dep');
  const depTime  = n('fp_deptime').replace(':','');
  const speed    = v('fp_speed');
  const speedUnit= v('fp_speed_unit');
  const alt      = v('fp_alt');
  const altUnit  = v('fp_alt_unit');
  const route    = v('fp_route');
  const dest     = v('fp_dest');
  const eet      = n('fp_eet').replace(':','');
  const altn1    = v('fp_altn1');
  const altn2    = v('fp_altn2');
  const fuel     = n('fp_fuel').replace(':','');
  const pob      = n('fp_pob');
  const remarks  = n('fp_remarks');
  const survEquip= Array.from(document.querySelectorAll('.fp_surv:checked')).map(e=>e.value).join('');

  const out = document.getElementById('fp_output');

  if (!acid||!dep||!dest||!acType) {
    out.innerHTML='<div class="error-msg">Fill in Aircraft ID, Departure, Destination, and Aircraft Type at minimum.</div>';
    return;
  }

  // Build ICAO format
  const field7  = `${acid}`;
  const field8  = `${fltRules}${fltType}`;
  const field9  = `${acType}/${wakecat}`;
  const field10 = equip || 'S';
  const field13 = `${dep}${depTime}`;
  const field15 = `${speedUnit}${speed} ${altUnit}${alt} ${route}`;
  const field16 = `${dest}${eet} ${altn1||'ZZZZ'} ${altn2}`.trim();
  const field18 = buildField18(fuel, pob, remarks);
  const field19 = `E/${fuel} P/${pob} R/${survEquip}`;

  const icaoBlock = `(FPL
-${field7}
-${field8}
-${field9}/${field10}
-${field13}
-${field15}
-${field16}
${field18 ? '-'+field18 : ''}
-E/${fuel} P/${pob||'TBN'})`;

  // Domestic FAA format
  const faaBlock = `AIRCRAFT ID: ${acid}
AIRCRAFT TYPE: ${acType}/${wakecat}
TRUE AIRSPEED: ${speed} kts
DEPARTURE: ${dep}
DEPARTURE TIME: ${depTime}Z
CRUISING ALT: ${alt}
ROUTE: ${route}
DESTINATION: ${dest}
ETE: ${eet}
ALTERNATE: ${altn1||'NONE'}
FUEL ON BOARD: ${fuel}
POB: ${pob}
REMARKS: ${remarks||'NONE'}`;

  out.innerHTML = `
    <div class="fp-result-tabs">
      <button class="fp-tab-btn active" onclick="showFPFormat('icao',this)">ICAO FORMAT</button>
      <button class="fp-tab-btn" onclick="showFPFormat('faa',this)">FAA DOMESTIC</button>
    </div>
    <div id="fp_format_icao" class="fp-format-block">
      <pre class="fp-pre">${icaoBlock}</pre>
      <button class="btn-secondary" onclick="copyFPText('fp_format_icao')" style="margin-top:8px">COPY</button>
    </div>
    <div id="fp_format_faa" class="fp-format-block" style="display:none">
      <pre class="fp-pre">${faaBlock}</pre>
      <button class="btn-secondary" onclick="copyFPText('fp_format_faa')" style="margin-top:8px">COPY</button>
    </div>
    <div style="margin-top:14px;font-size:12px;color:var(--text-secondary);font-family:var(--font-body)">
      ! Always verify your flight plan against current ICAO Doc 4444 and file via an authorized ATC unit or 1800wxbrief.com.
      <a href="https://www.1800wxbrief.com/Website/flightPlan" target="_blank" style="color:var(--accent);margin-left:6px">File on 1800wxbrief </a>
    </div>
  `;
}

function buildField18(fuel, pob, remarks) {
  const parts = [];
  if (remarks) parts.push('RMK/'+remarks.replace(/\s+/g,'-'));
  return parts.join(' ');
}

function showFPFormat(id, btn) {
  document.querySelectorAll('.fp-format-block').forEach(el => el.style.display='none');
  document.querySelectorAll('.fp-tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('fp_format_'+id).style.display='block';
  btn.classList.add('active');
}

function copyFPText(containerId) {
  const pre = document.querySelector('#'+containerId+' pre');
  if (!pre) return;
  navigator.clipboard.writeText(pre.textContent).then(()=>{
    const btns = document.querySelectorAll('#'+containerId+' .btn-secondary');
    btns.forEach(b => { b.textContent='COPIED '; setTimeout(()=>b.textContent='COPY',2000); });
  });
}

// ===== 3. HELICOPTER HOVER PERFORMANCE =====

function calcHoverPerf() {
  const gw    = parseFloat(document.getElementById('hp_gw').value)    || 0;
  const oat   = parseFloat(document.getElementById('hp_oat').value);
  const elev  = parseFloat(document.getElementById('hp_elev').value)  || 0;
  const altim = parseFloat(document.getElementById('hp_altim').value) || 29.92;
  const acKey = document.getElementById('hp_aircraft').value;

  const out = document.getElementById('hp_output');

  if (!acKey) { out.innerHTML='<div class="error-msg">Select an aircraft.</div>'; return; }

  const ac = HOVER_AIRCRAFT[acKey];
  if (!ac) { out.innerHTML='<div class="error-msg">Aircraft data not found.</div>'; return; }

  // Pressure altitude
  const pa = elev + (29.92 - altim) * 1000;

  // ISA temperature at elevation
  const isaTemp = 15 - (elev/1000)*2;
  const temp = isNaN(oat) ? isaTemp : oat;

  // Density altitude
  const da = pa + 120*(temp - isaTemp);

  // WAT lookup — interpolate from aircraft table
  const higeCapacity = interpolateWAT(ac.hige, da);
  const hogeCapacity = interpolateWAT(ac.hoge, da);

  const higeStatus = gw <= higeCapacity;
  const hogeStatus = gw <= hogeCapacity;
  const higeMargin = higeCapacity - gw;
  const hogeMargin = hogeCapacity - gw;

  const statusChip = (ok, margin) => ok
    ? `<span style="color:var(--success);font-weight:700">GO  (${margin.toFixed(0)} lbs margin)</span>`
    : `<span style="color:var(--danger);font-weight:700">NO-GO  (${Math.abs(margin).toFixed(0)} lbs over)</span>`;

  out.innerHTML = `
    <div class="hp-results">
      <div class="hp-conditions">
        <div class="hp-cond-title">CONDITIONS</div>
        <div class="hp-cond-grid">
          <div class="hp-cond-chip"><div class="hp-cond-label">Pressure Alt</div><div class="hp-cond-val">${Math.round(pa).toLocaleString()} ft</div></div>
          <div class="hp-cond-chip"><div class="hp-cond-label">Density Alt</div><div class="hp-cond-val" style="color:${da>5000?'var(--danger)':'var(--accent)'}">${Math.round(da).toLocaleString()} ft</div></div>
          <div class="hp-cond-chip"><div class="hp-cond-label">OAT</div><div class="hp-cond-val">${temp.toFixed(1)}°C</div></div>
          <div class="hp-cond-chip"><div class="hp-cond-label">ISA Dev</div><div class="hp-cond-val">${(temp-isaTemp)>0?'+':''}${(temp-isaTemp).toFixed(1)}°C</div></div>
          <div class="hp-cond-chip"><div class="hp-cond-label">Gross Weight</div><div class="hp-cond-val">${gw.toLocaleString()} lbs</div></div>
          <div class="hp-cond-chip"><div class="hp-cond-label">Max Gross</div><div class="hp-cond-val">${ac.maxGross.toLocaleString()} lbs</div></div>
        </div>
      </div>

      <div class="hp-hover-cards">
        <div class="hp-hover-card ${higeStatus?'hp-go':'hp-nogo'}">
          <div class="hp-hover-label">HIGE</div>
          <div class="hp-hover-sub">Hover In Ground Effect<br><small>Within ~1 rotor diameter AGL</small></div>
          <div class="hp-hover-cap">${higeCapacity > 0 ? higeCapacity.toLocaleString()+' lbs max' : 'Exceeds chart'}</div>
          <div class="hp-hover-status">${statusChip(higeStatus, higeMargin)}</div>
        </div>
        <div class="hp-hover-card ${hogeStatus?'hp-go':'hp-nogo'}">
          <div class="hp-hover-label">HOGE</div>
          <div class="hp-hover-sub">Hover Out of Ground Effect<br><small>Required for elevated platforms</small></div>
          <div class="hp-hover-cap">${hogeCapacity > 0 ? hogeCapacity.toLocaleString()+' lbs max' : 'Exceeds chart'}</div>
          <div class="hp-hover-status">${statusChip(hogeStatus, hogeMargin)}</div>
        </div>
      </div>

      ${da > 8000 ? `<div class="hp-warning">! High density altitude (${Math.round(da).toLocaleString()} ft). Performance significantly degraded. Verify against current POH charts.</div>` : ''}
      ${gw > ac.maxGross ? `<div class="hp-warning" style="border-color:var(--danger)"> Gross weight ${gw.toLocaleString()} lbs exceeds maximum gross weight ${ac.maxGross.toLocaleString()} lbs. Do not fly.</div>` : ''}

      <div style="font-size:11px;color:var(--text-secondary);font-family:var(--font-body);margin-top:14px;line-height:1.6">
        Performance data is approximate and based on standard AFM/POH charts at ISA conditions. Always use your aircraft's actual POH performance charts. HIGE/HOGE figures assume no wind, level surface, and normal operating procedures.
      </div>
    </div>
  `;
}

function interpolateWAT(table, da) {
  if (!table || table.length === 0) return 0;
  if (da <= table[0].da) return table[0].gw;
  if (da >= table[table.length-1].da) return Math.max(0, table[table.length-1].gw - (da - table[table.length-1].da) * 5);
  for (let i=0; i<table.length-1; i++) {
    if (da >= table[i].da && da <= table[i+1].da) {
      const t = (da - table[i].da) / (table[i+1].da - table[i].da);
      return table[i].gw + t*(table[i+1].gw - table[i].gw);
    }
  }
  return 0;
}

// HIGE/HOGE WAT tables — approximate from POH performance charts
// Format: { da: density altitude ft, gw: max gross weight lbs }
const HOVER_AIRCRAFT = {
  "Robinson R22 Beta II": {
    maxGross: 1370,
    hige: [
      {da:0,gw:1370},{da:2000,gw:1340},{da:4000,gw:1290},{da:6000,gw:1230},
      {da:8000,gw:1160},{da:10000,gw:1080},{da:12000,gw:990},{da:14000,gw:880}
    ],
    hoge: [
      {da:0,gw:1320},{da:2000,gw:1270},{da:4000,gw:1200},{da:6000,gw:1120},
      {da:8000,gw:1030},{da:10000,gw:920},{da:12000,gw:790}
    ]
  },
  "Robinson R44 Raven II": {
    maxGross: 2500,
    hige: [
      {da:0,gw:2500},{da:2000,gw:2440},{da:4000,gw:2360},{da:6000,gw:2260},
      {da:8000,gw:2140},{da:10000,gw:2000},{da:12000,gw:1840},{da:14000,gw:1650}
    ],
    hoge: [
      {da:0,gw:2380},{da:2000,gw:2280},{da:4000,gw:2160},{da:6000,gw:2020},
      {da:8000,gw:1860},{da:10000,gw:1680},{da:12000,gw:1470}
    ]
  },
  "Bell 206B-3 JetRanger III": {
    maxGross: 3350,
    hige: [
      {da:0,gw:3350},{da:2000,gw:3270},{da:4000,gw:3170},{da:6000,gw:3040},
      {da:8000,gw:2890},{da:10000,gw:2710},{da:12000,gw:2500},{da:14000,gw:2260}
    ],
    hoge: [
      {da:0,gw:3200},{da:2000,gw:3090},{da:4000,gw:2950},{da:6000,gw:2790},
      {da:8000,gw:2600},{da:10000,gw:2380},{da:12000,gw:2120}
    ]
  },
  "UH-60L Black Hawk": {
    maxGross: 22000,
    hige: [
      {da:0,gw:22000},{da:2000,gw:21200},{da:4000,gw:20300},{da:6000,gw:19200},
      {da:8000,gw:18000},{da:10000,gw:16600},{da:12000,gw:15000}
    ],
    hoge: [
      {da:0,gw:20500},{da:2000,gw:19500},{da:4000,gw:18400},{da:6000,gw:17100},
      {da:8000,gw:15600},{da:10000,gw:13900},{da:12000,gw:12000}
    ]
  },
  "Bell UH-1H Iroquois": {
    maxGross: 9500,
    hige: [
      {da:0,gw:9500},{da:2000,gw:9100},{da:4000,gw:8650},{da:6000,gw:8150},
      {da:8000,gw:7580},{da:10000,gw:6940},{da:12000,gw:6200}
    ],
    hoge: [
      {da:0,gw:8800},{da:2000,gw:8280},{da:4000,gw:7720},{da:6000,gw:7080},
      {da:8000,gw:6350},{da:10000,gw:5520}
    ]
  },
  "MD 500E": {
    maxGross: 3000,
    hige: [
      {da:0,gw:3000},{da:2000,gw:2900},{da:4000,gw:2780},{da:6000,gw:2630},
      {da:8000,gw:2460},{da:10000,gw:2270},{da:12000,gw:2050}
    ],
    hoge: [
      {da:0,gw:2840},{da:2000,gw:2700},{da:4000,gw:2540},{da:6000,gw:2350},
      {da:8000,gw:2130},{da:10000,gw:1880}
    ]
  }
};

function initHoverPerf() {
  const sel = document.getElementById('hp_aircraft');
  if (!sel) return;
  sel.innerHTML = '<option value="">— Select Helicopter —</option>' +
    Object.keys(HOVER_AIRCRAFT).map(k=>`<option value="${k}">${k}</option>`).join('');
}
