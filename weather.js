// ============================================================
// AviOps — Weather Module
// Sources: aviationweather.gov API (CORS-accessible endpoints)
// ============================================================

const AWC_BASE = 'https://aviationweather.gov/api/data';

// ===== METAR/TAF =====

async function loadMetarTaf() {
  const input = document.getElementById('metarInput').value.trim().toUpperCase();
  if (!input) return;
  const out = document.getElementById('metarOutput');
  out.innerHTML = '<span class="loading-spinner"></span> Fetching weather data...';

  try {
    const [metarRes, tafRes] = await Promise.allSettled([
      fetch(`${AWC_BASE}/metar?ids=${input}&format=json&hours=3`),
      fetch(`${AWC_BASE}/taf?ids=${input}&format=json`)
    ]);

    let html = '';

    // --- METAR ---
    html += `<div style="margin-bottom:20px">`;
    html += `<div style="font-size:11px;font-weight:700;letter-spacing:3px;color:var(--accent);margin-bottom:10px;text-transform:uppercase">METAR — ${input}</div>`;

    if (metarRes.status === 'fulfilled' && metarRes.value.ok) {
      const metars = await metarRes.value.json();
      if (metars && metars.length > 0) {
        metars.slice(0, 5).forEach((m, i) => {
          const cat = getFlightCategory(m);
          html += `<div style="background:var(--bg-secondary);border:1px solid var(--border);border-left:3px solid ${categoryColor(cat)};border-radius:3px;padding:12px;margin-bottom:8px">`;
          html += `<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">`;
          html += `<span style="font-size:11px;color:var(--text-secondary)">${m.obsTime || ''}</span>`;
          html += `<span class="flight-category cat-${cat.toLowerCase()}">${cat}</span>`;
          html += `</div>`;
          html += `<div style="font-family:var(--font-data);font-size:12px;color:var(--text-data);line-height:1.7;word-break:break-all">${m.rawOb || 'No raw observation'}</div>`;
          if (i === 0) {
            html += renderMetarParsed(m);
          }
          html += `</div>`;
        });
      } else {
        html += `<div class="error-msg">No METAR data found for ${input}.</div>`;
      }
    } else {
      html += `<div class="error-msg">Unable to fetch METAR. Check identifier or try again.</div>`;
    }
    html += `</div>`;

    // --- TAF ---
    html += `<div>`;
    html += `<div style="font-size:11px;font-weight:700;letter-spacing:3px;color:var(--accent);margin-bottom:10px;text-transform:uppercase">TAF — ${input}</div>`;

    if (tafRes.status === 'fulfilled' && tafRes.value.ok) {
      const tafs = await tafRes.value.json();
      if (tafs && tafs.length > 0) {
        tafs.forEach(t => {
          html += `<div style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:3px;padding:12px;margin-bottom:8px">`;
          html += `<div style="font-size:11px;color:var(--text-secondary);margin-bottom:6px">${t.issueTime || ''} — Valid: ${t.validTimeFrom || ''} to ${t.validTimeTo || ''}</div>`;
          html += `<div style="font-family:var(--font-data);font-size:12px;color:var(--text-data);line-height:1.8;word-break:break-all">${(t.rawTAF || '').replace(/\n/g, '<br>')}</div>`;
          html += `</div>`;
        });
      } else {
        html += `<div class="error-msg">No TAF data found for ${input}.</div>`;
      }
    } else {
      html += `<div class="error-msg">No TAF available for ${input}.</div>`;
    }
    html += `</div>`;

    out.innerHTML = html;
  } catch (e) {
    out.innerHTML = `<div class="error-msg">Network error: ${e.message}.<br>aviationweather.gov may be blocking direct browser requests. Try the <a href="https://aviationweather.gov/metar?ids=${input}" target="_blank" style="color:var(--accent)">official site ↗</a></div>`;
  }
}

function renderMetarParsed(m) {
  let html = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;margin-top:10px">`;

  const items = [
    { label: "Wind", val: m.wdir !== undefined ? `${String(m.wdir).padStart(3,'0')}° @ ${m.wspd} KT${m.wgst ? ` G${m.wgst}` : ''}` : '—' },
    { label: "Visibility", val: m.visib !== undefined ? `${m.visib} SM` : '—' },
    { label: "Temperature", val: m.temp !== undefined ? `${m.temp}°C` : '—' },
    { label: "Dew Point", val: m.dewp !== undefined ? `${m.dewp}°C` : '—' },
    { label: "Altimeter", val: m.altim !== undefined ? `${m.altim} inHg` : '—' },
    { label: "Ceiling", val: m.cig !== undefined ? `${m.cig} ft` : 'No ceiling' },
    { label: "Sky Cover", val: m.cover || '—' },
    { label: "Elevation", val: m.elev !== undefined ? `${m.elev} ft MSL` : '—' }
  ];

  items.forEach(i => {
    html += `<div style="background:rgba(0,0,0,0.3);border:1px solid var(--border);border-radius:2px;padding:8px">`;
    html += `<div style="font-size:10px;font-weight:700;letter-spacing:1px;color:var(--text-secondary);text-transform:uppercase;margin-bottom:3px">${i.label}</div>`;
    html += `<div style="font-family:var(--font-data);font-size:13px;color:var(--text-primary)">${i.val}</div>`;
    html += `</div>`;
  });

  html += `</div>`;
  return html;
}

// ===== WEATHER OVERVIEW =====

async function loadWeatherOverview() {
  const input = document.getElementById('wxAirport').value.trim().toUpperCase();
  if (!input) return;
  const grid = document.getElementById('wxGrid');
  grid.innerHTML = '<div class="wx-card placeholder-card"><span class="loading-spinner"></span></div>';

  try {
    const res = await fetch(`${AWC_BASE}/metar?ids=${input}&format=json&hours=1`);
    if (!res.ok) throw new Error('Request failed');
    const metars = await res.json();

    if (!metars || metars.length === 0) {
      grid.innerHTML = `<div class="wx-card placeholder-card"><div class="placeholder-text">No data found for "${input}". Check identifier.</div></div>`;
      return;
    }

    const m = metars[0];
    const cat = getFlightCategory(m);

    const cards = [
      { title: "FLIGHT CATEGORY", value: cat, unit: input, sub: '', cat: cat },
      { title: "WIND", value: m.wdir !== undefined ? `${String(m.wdir).padStart(3,'0')}°/${m.wspd}` : '—', unit: 'KT' + (m.wgst ? ` Gusts ${m.wgst}` : ''), sub: '' },
      { title: "VISIBILITY", value: m.visib !== undefined ? m.visib : '—', unit: 'SM', sub: '' },
      { title: "CEILING", value: m.cig !== undefined ? m.cig.toLocaleString() : 'UNLIM', unit: 'ft AGL', sub: '' },
      { title: "TEMPERATURE", value: m.temp !== undefined ? m.temp : '—', unit: '°C', sub: m.dewp !== undefined ? `Dewpoint: ${m.dewp}°C` : '' },
      { title: "ALTIMETER", value: m.altim !== undefined ? m.altim : '—', unit: 'inHg', sub: m.altim ? `${(m.altim * 33.8639).toFixed(0)} hPa` : '' },
      { title: "OBS TIME", value: (m.obsTime || '').split(' ')[1] || '—', unit: 'UTC', sub: m.obsTime || '' },
      { title: "SKY COVER", value: m.cover || '—', unit: '', sub: m.clouds ? m.clouds.map(c => `${c.cover} ${c.base}ft`).join(' / ') : '' }
    ];

    grid.innerHTML = cards.map(c => `
      <div class="wx-card">
        <div class="wx-card-title">${c.title}</div>
        ${c.cat ? `<span class="flight-category cat-${c.cat.toLowerCase()}" style="font-size:22px;padding:4px 16px">${c.value}</span>` : `<div class="wx-card-value">${c.value}</div>`}
        <div class="wx-card-unit">${c.unit}</div>
        ${c.sub ? `<div class="wx-card-sub">${c.sub}</div>` : ''}
      </div>
    `).join('');

  } catch (e) {
    grid.innerHTML = `<div class="wx-card placeholder-card"><div class="error-msg">Could not load data. aviationweather.gov API may require same-origin access. <a href="https://aviationweather.gov/metar?ids=${input}" target="_blank" style="color:var(--accent)">Open directly ↗</a></div></div>`;
  }
}

// ===== PIREPs =====

async function loadPireps() {
  const input = document.getElementById('pirepInput').value.trim().toUpperCase();
  if (!input) return;
  const out = document.getElementById('pirepOutput');
  out.innerHTML = '<span class="loading-spinner"></span> Fetching PIREPs...';

  try {
    const res = await fetch(`${AWC_BASE}/pirep?id=${input}&format=json&distance=100`);
    if (!res.ok) throw new Error('Request failed');
    const pireps = await res.json();

    if (!pireps || pireps.length === 0) {
      out.innerHTML = `<div style="color:var(--text-secondary);font-family:var(--font-body)">No PIREPs found within 100 NM of ${input} in the last few hours.</div>`;
      return;
    }

    out.innerHTML = pireps.map(p => {
      const turbBadge = getTurbBadge(p.turbLLO || p.turbLHI || '');
      const iceBadge = getIceBadge(p.icgLO || p.icgHI || '');
      return `
        <div style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:3px;padding:12px;margin-bottom:8px">
          <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;flex-wrap:wrap">
            <span style="font-family:var(--font-data);font-size:11px;color:var(--accent)">${p.reportTime || ''}</span>
            <span style="font-family:var(--font-data);font-size:11px;color:var(--text-secondary)">${p.aircraftType || 'UNKN'}</span>
            ${turbBadge} ${iceBadge}
            <span style="font-size:10px;color:var(--text-secondary)">@ ${p.fltLvl || '—'} ft</span>
          </div>
          <div style="font-family:var(--font-data);font-size:12px;color:var(--text-data);line-height:1.7;word-break:break-all">${p.rawOb || 'No raw observation'}</div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px;margin-top:8px">
            ${p.temp !== undefined ? pirepChip('OAT', p.temp + '°C') : ''}
            ${p.wdir !== undefined ? pirepChip('Wind', `${p.wdir}°/${p.wspd}kt`) : ''}
            ${p.visib !== undefined ? pirepChip('Vis', p.visib + ' SM') : ''}
            ${p.skyLow !== undefined ? pirepChip('Sky', p.skyLow) : ''}
          </div>
        </div>
      `;
    }).join('');

  } catch (e) {
    out.innerHTML = `<div class="error-msg">Error fetching PIREPs: ${e.message}</div>`;
  }
}

function pirepChip(label, val) {
  return `<div style="background:rgba(0,0,0,0.3);border:1px solid var(--border);border-radius:2px;padding:4px 8px;font-family:var(--font-data);font-size:11px"><span style="color:var(--text-secondary)">${label}:</span> <span style="color:var(--accent)">${val}</span></div>`;
}

function getTurbBadge(t) {
  if (!t) return '';
  t = String(t).toUpperCase();
  if (t.includes('SEV') || t === 'SEV') return '<span class="pirep-badge turb-sev">SEV TURB</span>';
  if (t.includes('MOD')) return '<span class="pirep-badge turb-mod">MOD TURB</span>';
  if (t.includes('LGT') || t.includes('LIGHT')) return '<span class="pirep-badge turb-light">LGT TURB</span>';
  if (t.includes('NEG') || t === 'NONE') return '<span class="pirep-badge turb-none">NEG TURB</span>';
  return '';
}

function getIceBadge(i) {
  if (!i) return '';
  i = String(i).toUpperCase();
  if (i.includes('SEV') || i.includes('MOD')) return '<span class="pirep-badge ice-mod">MOD ICE</span>';
  if (i.includes('LGT') || i.includes('LIGHT')) return '<span class="pirep-badge ice-light">LGT ICE</span>';
  return '';
}

// ===== NOTAMs =====

async function loadNotams() {
  const input = document.getElementById('notamInput').value.trim().toUpperCase();
  if (!input) return;
  const out = document.getElementById('notamOutput');
  out.innerHTML = '<span class="loading-spinner"></span> Fetching NOTAMs...';

  try {
    // AWC does not serve NOTAMs directly; use FAA NOTAM API (public)
    const res = await fetch(`https://external-api.faa.gov/notamapi/v1/notams?icaoLocation=${input}&pageSize=20`, {
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const notams = data.items || [];

    if (notams.length === 0) {
      out.innerHTML = `<div style="color:var(--text-secondary);font-family:var(--font-body)">No NOTAMs found for ${input}, or location not found.</div>`;
      return;
    }

    out.innerHTML = notams.map(n => {
      const props = n.properties || {};
      const notamText = props.coreNOTAMData?.notam?.text || props.coreNOTAMData?.notam?.fullText || 'No text available';
      const notamId = props.coreNOTAMData?.notam?.id || props.notamNumber || 'N/A';
      const effStart = props.coreNOTAMData?.notam?.effectiveStart || '';
      const effEnd = props.coreNOTAMData?.notam?.effectiveEnd || '';
      const classification = props.coreNOTAMData?.notam?.classification || '';

      return `
        <div class="notam-item">
          <div class="notam-header">
            <span class="notam-id">${notamId}</span>
            <span class="notam-type">${classification}</span>
          </div>
          ${effStart ? `<div style="font-size:11px;color:var(--text-secondary);margin-bottom:6px">Eff: ${effStart}${effEnd ? ' — ' + effEnd : ''}</div>` : ''}
          <div>${notamText}</div>
        </div>
      `;
    }).join('');

  } catch (e) {
    out.innerHTML = `
      <div class="error-msg">Could not load NOTAMs via API (${e.message}).<br><br>
      Access NOTAMs directly at:<br>
      <a href="https://notams.aim.faa.gov/notamSearch/?searchType=0&designatorsForLocation=${input}" target="_blank" style="color:var(--accent)">FAA NOTAM Search — ${input} ↗</a>
      </div>`;
  }
}

// ===== HELPERS =====

function getFlightCategory(m) {
  const vis = parseFloat(m.visib) || 0;
  const cig = parseFloat(m.cig) || 99999;
  if (cig < 500 || vis < 1) return 'LIFR';
  if (cig < 1000 || vis < 3) return 'IFR';
  if (cig <= 3000 || vis <= 5) return 'MVFR';
  return 'VFR';
}

function categoryColor(cat) {
  switch (cat) {
    case 'VFR': return 'var(--success)';
    case 'MVFR': return '#8888ff';
    case 'IFR': return 'var(--danger)';
    case 'LIFR': return '#ff44ff';
    default: return 'var(--border-bright)';
  }
}
