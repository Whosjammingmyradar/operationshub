// ============================================================
// AviOps v2 — Extended Module
// New: Airport Info, ATIS, ADS-B/OpenSky, Soundings,
//      AD Search, NTSB, Fuel Prices, Charts, SkyVector
// ============================================================

// ===== SKYVECTOR CHART CONTROLS =====
let currentSVChart = '301';

function setSVChart(chartId, btn) {
  currentSVChart = chartId;
  document.querySelectorAll('#tab-charts .filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const frame = document.getElementById('svFrame');
  if (frame) {
    const src = frame.src;
    frame.src = src.replace(/chart=\d+/, `chart=${chartId}`);
  }
}

function loadSkyVector() {
  const route = document.getElementById('svRoute').value.trim().toUpperCase();
  const frame = document.getElementById('svFrame');
  if (!frame) return;
  if (route) {
    frame.src = `https://skyvector.com/?fpl=${encodeURIComponent(route)}&chart=${currentSVChart}`;
  }
}

// ===== AIRPORT DIAGRAM =====
function openAirportDiagram() {
  const icao = document.getElementById('diagInput').value.trim().toUpperCase();
  if (!icao) return;

  const out = document.getElementById('diagOutput');
  // FAA publishes airport diagrams at a predictable URL pattern
  const faaUrl = `https://aeronav.faa.gov/d-tpp/current/${icao.substring(1)}.pdf`;
  const airnav = `https://www.airnav.com/airport/${icao}`;
  const skyvec = `https://skyvector.com/airport/${icao}`;

  out.innerHTML = `
    <div class="diag-link-card">
      <div>
        <div style="font-size:13px;font-weight:700;color:var(--text-primary);margin-bottom:8px">Airport Diagram — ${icao}</div>
        <div style="font-size:12px;color:var(--text-secondary);font-family:var(--font-body);margin-bottom:12px">FAA airport diagrams are published in the terminal procedures PDF. Open via the links below:</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <a href="https://www.airnav.com/airport/${icao}" target="_blank" class="btn-primary" style="text-decoration:none">AirNav — ${icao} ↗</a>
          <a href="https://skyvector.com/airport/${icao}" target="_blank" class="btn-secondary" style="text-decoration:none">SkyVector ↗</a>
          <a href="https://nfdc.faa.gov/nfdcApps/services/ajv5/airportDisplay.jsp?airportId=${icao}" target="_blank" class="btn-secondary" style="text-decoration:none">FAA NFDC ↗</a>
        </div>
      </div>
    </div>
  `;
}

// ===== AIRPORT INFO — OurAirports API =====
async function loadAirportInfo() {
  const icao = document.getElementById('apInfoInput').value.trim().toUpperCase();
  if (!icao) return;
  const out = document.getElementById('apInfoOutput');
  out.innerHTML = '<span class="loading-spinner"></span> Fetching airport data...';

  try {
    // OurAirports CSV endpoint — free, no auth
    const res = await fetch(`https://ourairports.com/airports/${icao}/download.csv`);
    if (!res.ok) throw new Error('Not found');
    const text = await res.text();

    // Also try the JSON-style API
    const apRes = await fetch(`https://ourairports.com/airports/${icao}.json`);
    let apData = null;
    if (apRes.ok) {
      apData = await apRes.json();
    }

    if (apData) {
      renderAirportInfoJSON(icao, apData);
    } else {
      // fallback: show links
      renderAirportFallback(icao);
    }
  } catch (e) {
    renderAirportFallback(icao);
  }
}

function renderAirportInfoJSON(icao, d) {
  const out = document.getElementById('apInfoOutput');
  const ap = d.airport || d;

  const chips = [
    { label: 'ICAO', val: icao },
    { label: 'IATA', val: ap.iata_code || '—' },
    { label: 'Name', val: ap.name || '—' },
    { label: 'Type', val: (ap.type || '—').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) },
    { label: 'City', val: ap.municipality || '—' },
    { label: 'Country', val: ap.iso_country || '—' },
    { label: 'Elevation', val: ap.elevation_ft ? ap.elevation_ft + ' ft MSL' : '—' },
    { label: 'Coordinates', val: ap.latitude_deg && ap.longitude_deg ? `${parseFloat(ap.latitude_deg).toFixed(4)}N, ${parseFloat(ap.longitude_deg).toFixed(4)}W` : '—' }
  ];

  let html = `<div class="ap-info-grid">${chips.map(c => `
    <div class="ap-info-chip">
      <div class="ap-chip-label">${c.label}</div>
      <div class="ap-chip-val">${c.val}</div>
    </div>`).join('')}</div>`;

  // Runways
  const runways = ap.runways || d.runways || [];
  if (runways.length > 0) {
    html += `<div style="font-size:11px;font-weight:700;letter-spacing:2px;color:var(--accent);text-transform:uppercase;margin:12px 0 6px">Runways</div>`;
    html += `<table class="rwy-table"><tr>
      <th>Ident</th><th>Length (ft)</th><th>Width (ft)</th><th>Surface</th><th>Lighted</th>
    </tr>`;
    runways.forEach(r => {
      html += `<tr>
        <td>${r.le_ident || '—'}/${r.he_ident || '—'}</td>
        <td>${r.length_ft ? parseInt(r.length_ft).toLocaleString() : '—'}</td>
        <td>${r.width_ft || '—'}</td>
        <td>${r.surface || '—'}</td>
        <td>${r.lighted ? '✓' : '—'}</td>
      </tr>`;
    });
    html += `</table>`;
  }

  // Frequencies
  const freqs = ap.frequencies || d.frequencies || [];
  if (freqs.length > 0) {
    html += `<div style="font-size:11px;font-weight:700;letter-spacing:2px;color:var(--accent);text-transform:uppercase;margin:12px 0 6px">Frequencies</div>`;
    html += `<div style="display:flex;gap:8px;flex-wrap:wrap">`;
    freqs.forEach(f => {
      html += `<div style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:2px;padding:6px 10px;font-family:var(--font-data);font-size:12px">
        <span style="color:var(--text-secondary);font-size:10px">${f.type || ''}</span><br>
        <span style="color:var(--accent)">${f.frequency_mhz || '—'} MHz</span><br>
        <span style="font-size:10px;color:var(--text-secondary)">${f.description || ''}</span>
      </div>`;
    });
    html += `</div>`;
  }

  // External links
  html += `<div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">
    <a href="https://ourairports.com/airports/${icao}/" target="_blank" class="resource-link">OurAirports ↗</a>
    <a href="https://www.airnav.com/airport/${icao}" target="_blank" class="resource-link">AirNav ↗</a>
    <a href="https://skyvector.com/airport/${icao}" target="_blank" class="resource-link">SkyVector ↗</a>
  </div>`;

  out.innerHTML = html;
}

function renderAirportFallback(icao) {
  const out = document.getElementById('apInfoOutput');
  out.innerHTML = `
    <div style="padding:4px">
      <div style="font-size:13px;font-weight:700;color:var(--text-primary);margin-bottom:10px">${icao} — Airport Information</div>
      <div style="font-size:12px;color:var(--text-secondary);font-family:var(--font-body);margin-bottom:12px">Detailed data available via the links below. OurAirports.com may block direct browser requests.</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <a href="https://ourairports.com/airports/${icao}/" target="_blank" class="btn-primary" style="text-decoration:none">OurAirports — ${icao} ↗</a>
        <a href="https://www.airnav.com/airport/${icao}" target="_blank" class="btn-secondary" style="text-decoration:none">AirNav ↗</a>
        <a href="https://skyvector.com/airport/${icao}" target="_blank" class="btn-secondary" style="text-decoration:none">SkyVector ↗</a>
        <a href="https://www.aopa.org/destinations/airports/${icao}" target="_blank" class="btn-secondary" style="text-decoration:none">AOPA ↗</a>
      </div>
    </div>
  `;
}

// ===== D-ATIS =====
async function loadATIS() {
  const icao = document.getElementById('atisInput').value.trim().toUpperCase();
  if (!icao) return;
  const out = document.getElementById('atisOutput');
  out.innerHTML = '<span class="loading-spinner"></span> Fetching ATIS...';

  try {
    // AWC METAR API can serve as a proxy — ATIS data is embedded in METAR for most airports
    // For D-ATIS, try aviationweather.gov
    const res = await fetch(`https://aviationweather.gov/api/data/metar?ids=${icao}&format=json&hours=1`);
    if (!res.ok) throw new Error('No data');
    const data = await res.json();

    if (!data || data.length === 0) {
      out.innerHTML = `<div class="error-msg">No ATIS/METAR data found for ${icao}.</div>`;
      return;
    }

    const m = data[0];
    out.innerHTML = `
      <div style="margin-bottom:10px">
        <div style="font-size:11px;color:var(--text-secondary);margin-bottom:6px">Current conditions at <strong style="color:var(--accent)">${icao}</strong> — ${m.obsTime || ''}</div>
        <div style="font-family:var(--font-data);font-size:12px;color:var(--text-data);line-height:1.8;background:var(--bg-secondary);border:1px solid var(--border);border-radius:2px;padding:10px;word-break:break-all">${m.rawOb || 'No data'}</div>
      </div>
      <div style="font-size:12px;color:var(--text-secondary);margin-top:10px;font-family:var(--font-body)">
        For official D-ATIS where available:
        <a href="https://datis.clowd.io/${icao}" target="_blank" style="color:var(--accent);margin-left:8px">clowd.io D-ATIS — ${icao} ↗</a>
      </div>
    `;
  } catch (e) {
    out.innerHTML = `
      <div class="error-msg">Could not fetch ATIS data.<br>
      <a href="https://datis.clowd.io/${icao}" target="_blank" style="color:var(--accent)">Try D-ATIS at clowd.io ↗</a>
      </div>`;
  }
}

// ===== ADS-B =====
function loadDefaultADSB() {
  const frame = document.getElementById('adsbFrame');
  if (frame) frame.src = 'https://globe.adsbexchange.com/?largeMode=2&hideButtons';
}

function searchADSB() {
  const val = document.getElementById('adsb_icao').value.trim();
  if (!val) return;
  const frame = document.getElementById('adsbFrame');
  if (!frame) return;

  // ADS-B Exchange supports ?icao= and ?reg= parameters
  const isHex = /^[0-9a-fA-F]{6}$/.test(val);
  if (isHex) {
    frame.src = `https://globe.adsbexchange.com/?icao=${val.toLowerCase()}`;
  } else {
    frame.src = `https://globe.adsbexchange.com/?reg=${val.toUpperCase()}`;
  }
}

// ===== OPENSKY NETWORK =====
async function lookupOpenSky() {
  const icao24 = document.getElementById('openskyIcao').value.trim().toLowerCase();
  if (!icao24) return;
  const out = document.getElementById('openskyOutput');
  out.innerHTML = '<span class="loading-spinner"></span> Querying OpenSky Network...';

  try {
    // OpenSky REST API — no auth for live states
    const res = await fetch(`https://opensky-network.org/api/states/all?icao24=${icao24}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data.states || data.states.length === 0) {
      out.innerHTML = `<div style="color:var(--text-secondary)">No live state found for ICAO24 <strong>${icao24}</strong>. Aircraft may be on ground or transponder off.</div>`;
      return;
    }

    const s = data.states[0];
    // OpenSky state vector columns:
    // 0:icao24, 1:callsign, 2:origin_country, 3:time_position, 4:last_contact,
    // 5:longitude, 6:latitude, 7:baro_altitude, 8:on_ground, 9:velocity,
    // 10:true_track, 11:vertical_rate, 12:sensors, 13:geo_altitude,
    // 14:squawk, 15:spi, 16:position_source

    const altM = parseFloat(s[7]);
    const altFt = altM ? (altM * 3.28084).toFixed(0) : '—';
    const geoAltM = parseFloat(s[13]);
    const geoAltFt = geoAltM ? (geoAltM * 3.28084).toFixed(0) : '—';
    const velMs = parseFloat(s[9]);
    const velKts = velMs ? (velMs * 1.94384).toFixed(0) : '—';
    const vsMs = parseFloat(s[11]);
    const vsFpm = vsMs ? (vsMs * 196.85).toFixed(0) : '—';

    const chips = [
      { label: 'ICAO24', val: s[0] || icao24 },
      { label: 'Callsign', val: (s[1] || '').trim() || '—' },
      { label: 'Country', val: s[2] || '—' },
      { label: 'On Ground', val: s[8] ? 'YES' : 'NO' },
      { label: 'Latitude', val: s[6] ? parseFloat(s[6]).toFixed(4) + '°' : '—' },
      { label: 'Longitude', val: s[5] ? parseFloat(s[5]).toFixed(4) + '°' : '—' },
      { label: 'Baro Alt', val: altFt + ' ft' },
      { label: 'Geo Alt', val: geoAltFt + ' ft' },
      { label: 'Speed', val: velKts + ' kts' },
      { label: 'Track', val: s[10] ? parseFloat(s[10]).toFixed(0) + '°' : '—' },
      { label: 'Vert Rate', val: vsFpm + ' fpm' },
      { label: 'Squawk', val: s[14] || '—' }
    ];

    out.innerHTML = `
      <div style="font-size:11px;font-weight:700;letter-spacing:2px;color:var(--accent);margin-bottom:10px">LIVE STATE — ${(s[1]||icao24).trim()}</div>
      <div class="ap-info-grid">
        ${chips.map(c => `
          <div class="ap-info-chip">
            <div class="ap-chip-label">${c.label}</div>
            <div class="ap-chip-val">${c.val}</div>
          </div>`).join('')}
      </div>
      <div style="font-size:11px;color:var(--text-secondary);margin-top:10px">Last contact: ${s[4] ? new Date(s[4]*1000).toUTCString() : '—'}</div>
    `;
  } catch (e) {
    out.innerHTML = `<div class="error-msg">OpenSky API error: ${e.message}.<br>Try <a href="https://opensky-network.org/aircraft-profile?icao24=${icao24}" target="_blank" style="color:var(--accent)">OpenSky Profile ↗</a></div>`;
  }
}

// ===== ASOS/AWOS STATIONS =====
async function loadASOSStations() {
  const query = document.getElementById('asosInput').value.trim().toUpperCase();
  if (!query) return;
  const out = document.getElementById('asosOutput');
  out.innerHTML = '<span class="loading-spinner"></span> Searching ASOS/AWOS stations...';

  // AWC station list API
  try {
    const res = await fetch(`https://aviationweather.gov/api/data/metar?ids=${query}&format=json&hours=1`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        out.innerHTML = `
          <div style="font-size:11px;font-weight:700;letter-spacing:2px;color:var(--accent);margin-bottom:10px">STATION DATA — ${query}</div>
          ${data.map(s => `
            <div style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:2px;padding:10px;margin-bottom:6px;font-family:var(--font-data);font-size:12px">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                <span style="color:var(--accent);font-weight:700">${s.stationId || s.id || query}</span>
                <span style="color:var(--text-secondary)">${s.obsTime || ''}</span>
              </div>
              <div style="color:var(--text-data);word-break:break-all">${s.rawOb || 'No observation'}</div>
              <div style="margin-top:4px;display:flex;gap:12px;font-size:11px;color:var(--text-secondary)">
                <span>Elev: ${s.elev !== undefined ? s.elev + ' ft' : '—'}</span>
                <span>Lat: ${s.lat || '—'} Lon: ${s.lon || '—'}</span>
              </div>
            </div>
          `).join('')}
        `;
        return;
      }
    }
  } catch (e) { /* fallback */ }

  // Fallback — link to FAA ASOS
  out.innerHTML = `
    <div style="font-size:12px;color:var(--text-secondary);font-family:var(--font-body)">
      Direct station list for "${query}" requires the FAA ASOS database. Open the official tools below:
    </div>
    <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
      <a href="https://www.faa.gov/air_traffic/weather/asos/" target="_blank" class="btn-primary" style="text-decoration:none">FAA ASOS Lookup ↗</a>
      <a href="https://mesonet.agron.iastate.edu/request/download.phtml?network=${query}_ASOS" target="_blank" class="btn-secondary" style="text-decoration:none">Iowa State Archive ↗</a>
    </div>
  `;
}

// ===== UPPER AIR SOUNDINGS =====
function openSounding() {
  const station = document.getElementById('soundingStation').value.trim().toUpperCase();
  const type = document.getElementById('soundingType').value;
  if (!station) return;

  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const hour = now.getUTCHours() < 12 ? '00' : '12'; // soundings at 00Z and 12Z

  const url = `http://weather.uwyo.edu/cgi-bin/bufrraob.py?TYPE=${type}&YEAR=${year}&MONTH=${month}&FROM=${day}${hour}&TO=${day}${hour}&STNM=${station}`;
  window.open(url, '_blank');
}

function renderSoundingStations() {
  const stations = [
    { id: 'OUN', name: 'Norman, OK' },     { id: 'FFC', name: 'Atlanta, GA' },
    { id: 'ABQ', name: 'Albuquerque, NM' },{ id: 'BOI', name: 'Boise, ID' },
    { id: 'BNA', name: 'Nashville, TN' },  { id: 'DEN', name: 'Denver, CO' },
    { id: 'IAD', name: 'Dulles, VA' },     { id: 'JAX', name: 'Jacksonville, FL' },
    { id: 'LMK', name: 'Louisville, KY' }, { id: 'OAK', name: 'Oakland, CA' },
    { id: 'SHV', name: 'Shreveport, LA' }, { id: 'TOP', name: 'Topeka, KS' },
    { id: 'GYX', name: 'Gray, ME' },       { id: 'BIS', name: 'Bismarck, ND' },
    { id: 'TUS', name: 'Tucson, AZ' },     { id: 'SEA', name: 'Seattle, WA' }
  ];

  const grid = document.getElementById('soundingStationsGrid');
  if (!grid) return;

  grid.innerHTML = stations.map(s => `
    <button class="sounding-btn" onclick="document.getElementById('soundingStation').value='${s.id}'; openSounding()">
      <span class="snd-id">${s.id}</span>
      <span class="snd-name">${s.name}</span>
    </button>
  `).join('');
}

// ===== AD SEARCH =====
function searchADs() {
  const make = document.getElementById('adMake').value.trim();
  const model = document.getElementById('adModel').value.trim();
  const out = document.getElementById('adOutput');

  if (!make) {
    out.innerHTML = '<div class="error-msg">Enter an aircraft make to search.</div>';
    return;
  }

  const query = model ? `${make} ${model}` : make;
  const faaUrl = `https://rgl.faa.gov/Regulatory_and_Guidance_Library/rgAD.nsf/0/Type?OpenView&Count=50&CollapseView&Start=1&searchQuery=${encodeURIComponent(query)}`;

  out.innerHTML = `
    <div style="font-size:13px;color:var(--text-secondary);font-family:var(--font-body);margin-bottom:12px">
      Searching Airworthiness Directives for: <strong style="color:var(--accent)">${query}</strong>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <a href="https://rgl.faa.gov/Regulatory_and_Guidance_Library/rgAD.nsf/Frameset?OpenPage" target="_blank" class="btn-primary" style="text-decoration:none">FAA AD Portal ↗</a>
      <a href="https://av-info.faa.gov/adportal/AdPortal.aspx?RecordSet=MAKE%3D${encodeURIComponent(make)}%26MODEL%3D${encodeURIComponent(model || '')}" target="_blank" class="btn-secondary" style="text-decoration:none">Legacy AD Search — ${query} ↗</a>
      <a href="https://www.faa.gov/regulations_policies/airworthiness_directives/address_search/?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}" target="_blank" class="btn-secondary" style="text-decoration:none">FAA AD Address Search ↗</a>
    </div>
    <div style="margin-top:12px;font-size:11px;color:var(--text-secondary);font-family:var(--font-body)">The FAA AD portal does not expose a public CORS-compatible API. Use the links above to search directly.</div>
  `;
}

// ===== NTSB SEARCH =====
function searchNTSB() {
  const query = document.getElementById('ntsbQuery').value.trim();
  const out = document.getElementById('ntsbOutput');

  if (!query) {
    out.innerHTML = '<div class="error-msg">Enter a search term.</div>';
    return;
  }

  out.innerHTML = `
    <div style="font-size:13px;color:var(--text-secondary);font-family:var(--font-body);margin-bottom:12px">
      Searching NTSB database for: <strong style="color:var(--accent)">${query}</strong>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <a href="https://data.ntsb.gov/carol-main-public/query-entry?searchString=${encodeURIComponent(query)}&offset=0&max=50&resultsView=brief&artifactFileName=&_wicket=y" target="_blank" class="btn-primary" style="text-decoration:none">NTSB CAROL — ${query} ↗</a>
      <a href="https://www.ntsb.gov/Pages/AviationQueryv2.aspx?FullText=${encodeURIComponent(query)}" target="_blank" class="btn-secondary" style="text-decoration:none">NTSB Aviation Query ↗</a>
      <a href="https://apps.ntsb.gov/CAROL/Simple" target="_blank" class="btn-secondary" style="text-decoration:none">NTSB CAROL Simple Search ↗</a>
    </div>
    <div style="margin-top:12px;font-size:11px;color:var(--text-secondary);font-family:var(--font-body)">NTSB CAROL database requires authentication for API access. Use the links above to search the full database.</div>
  `;
}

// ===== FUEL PRICE LOOKUP =====
function lookupFuelPrices() {
  const icao = document.getElementById('fuelPriceInput').value.trim().toUpperCase();
  const out = document.getElementById('fuelPriceOutput');

  if (!icao) {
    out.innerHTML = '<div class="error-msg">Enter an airport identifier.</div>';
    return;
  }

  out.innerHTML = `
    <div style="font-size:13px;color:var(--text-secondary);font-family:var(--font-body);margin-bottom:12px">
      Fuel prices for <strong style="color:var(--accent)">${icao}</strong> — opens in official sources:
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <a href="https://www.airnav.com/airport/${icao}#fuel" target="_blank" class="btn-primary" style="text-decoration:none">AirNav — ${icao} Fuel ↗</a>
      <a href="https://www.globalair.com/airport/fbo.aspx?apt=${icao}" target="_blank" class="btn-secondary" style="text-decoration:none">GlobalAir FBOs ↗</a>
      <a href="https://100ll.com/cgi-bin/searchairport.cgi?req=${icao}" target="_blank" class="btn-secondary" style="text-decoration:none">100LL.com ↗</a>
    </div>
    <div style="margin-top:10px;font-size:11px;color:var(--text-secondary);font-family:var(--font-body)">Fuel price data requires direct lookup via each source (no public API). AirNav is generally most current for 100LL and Jet-A.</div>
  `;
}

// ===== CHART DOWNLOADS =====
const CHART_DOWNLOADS = [
  { title: 'VFR Sectional Charts', sub: 'Current sectional aeronautical charts', url: 'https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/vfr/', badge: 'FREE PDF' },
  { title: 'IFR Enroute Charts', sub: 'Low/high enroute charts (L/H series)', url: 'https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/ifr/', badge: 'FREE PDF' },
  { title: 'Terminal Area Charts', sub: 'TACs for Class B airspace areas', url: 'https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/vfr/', badge: 'FREE PDF' },
  { title: 'Helicopter Route Charts', sub: 'Low-altitude helicopter routes', url: 'https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/helicopter/', badge: 'FREE PDF' },
  { title: 'ODP / SID / STAR', sub: 'Departure and arrival procedures', url: 'https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/dtpp/', badge: 'FREE PDF' },
  { title: 'Instrument Approach Plates', sub: 'Terminal Procedures Publication (TPP)', url: 'https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/dtpp/', badge: 'FREE PDF' },
  { title: 'Flyway Planning Charts', sub: 'VFR corridor and transition routes', url: 'https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/vfr/', badge: 'FREE PDF' },
  { title: 'Caribbean/Pacific Charts', sub: 'Area charts for non-CONUS ops', url: 'https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/ifr/media/CPC.pdf', badge: 'FREE PDF' }
];

function renderChartDownloads() {
  const grid = document.getElementById('chartDownloadGrid');
  if (!grid) return;
  grid.innerHTML = CHART_DOWNLOADS.map(c => `
    <a class="chart-dl-card" href="${c.url}" target="_blank">
      <div class="chart-dl-title">${c.title}</div>
      <div class="chart-dl-sub">${c.sub}</div>
      <span class="chart-dl-badge">${c.badge}</span>
    </a>
  `).join('');
}

// ===== A/FD REGIONS =====
const AFD_REGIONS = [
  { region: 'Southwest', coverage: 'AZ, CA, NV', url: 'https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/dafd/media/SW.pdf' },
  { region: 'Northwest', coverage: 'ID, MT, OR, WA, WY', url: 'https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/dafd/media/NW.pdf' },
  { region: 'North Central', coverage: 'CO, KS, NE, ND, SD', url: 'https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/dafd/media/NC.pdf' },
  { region: 'South Central', coverage: 'AR, LA, MS, NM, OK, TX', url: 'https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/dafd/media/SC.pdf' },
  { region: 'North Central East', coverage: 'IL, IN, MI, MN, WI', url: 'https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/dafd/media/NCE.pdf' },
  { region: 'East Central', coverage: 'KY, OH, TN, WV', url: 'https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/dafd/media/EC.pdf' },
  { region: 'Southeast', coverage: 'AL, FL, GA, PR, SC, VI', url: 'https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/dafd/media/SE.pdf' },
  { region: 'Northeast', coverage: 'CT, DE, MA, MD, ME, NH, NJ, NY, PA, RI, VA, VT', url: 'https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/dafd/media/NE.pdf' },
  { region: 'Alaska', coverage: 'AK', url: 'https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/dafd/media/AK.pdf' },
  { region: 'Pacific', coverage: 'HI, Pacific Islands', url: 'https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/dafd/media/PAC.pdf' }
];

function renderAFDGrid() {
  const grid = document.getElementById('afdGrid');
  if (!grid) return;
  grid.innerHTML = AFD_REGIONS.map(r => `
    <a class="afd-card" href="${r.url}" target="_blank">
      <div class="afd-region">${r.region}</div>
      <div class="afd-coverage">${r.coverage}</div>
    </a>
  `).join('');
}

// ===== AIRWORTHINESS QUICK REF =====
const AW_CARDS = [
  {
    title: 'Annual Inspection — §91.409',
    ref: '14 CFR §91.409(a)',
    body: 'No person may operate an aircraft unless it has had an annual inspection performed by a certificated A&P with IA within the preceding 12 calendar months. The aircraft must be in airworthy condition.'
  },
  {
    title: 'Required Inspections — AVIATES',
    ref: 'AIM / 14 CFR Part 91',
    body: 'A — Annual inspection (12 months)\nV — VOR check (30 days, IFR)\nI — 100-hour inspection (for hire)\nA — Altimeter/static system (24 months, IFR)\nT — Transponder (24 months)\nE — ELT (battery 50% or 1 hr cumulative, annual)\nS — Static system check (24 months, IFR)'
  },
  {
    title: 'Airworthiness Directives — §91.403',
    ref: '14 CFR §91.403',
    body: 'The owner/operator is responsible for maintaining the aircraft in airworthy condition, which includes complying with all applicable ADs. Emergency ADs require immediate compliance; recurring ADs specify intervals.'
  },
  {
    title: 'MEL / Inoperative Equipment',
    ref: '14 CFR §91.213',
    body: 'Equipment not required by 14 CFR or the TCDS may be inoperative if the item is deactivated, placard-marked INOPERATIVE, and inspected by a certificated pilot or mechanic. An MEL approved under an AMSOC takes precedence over §91.213.'
  },
  {
    title: 'ARROW Documents — §91.203',
    ref: '14 CFR §91.203',
    body: 'A — Airworthiness Certificate (original)\nR — Registration Certificate\nR — Radio station license (international flights)\nO — Operating limitations (AFM/POH)\nW — Weight & Balance data (current)'
  },
  {
    title: 'Helicopter Airworthiness — FAR Part 27/29',
    ref: '14 CFR Parts 27, 29',
    body: 'Normal category rotorcraft certified under Part 27 (up to 6,000 lbs / 9 pax). Transport category under Part 29 (above those limits). Military-surplus aircraft require special airworthiness certificates. Part 43 applies to maintenance.'
  }
];

function renderAWCards() {
  const grid = document.getElementById('awCardsGrid');
  if (!grid) return;
  grid.innerHTML = AW_CARDS.map(c => `
    <div class="aw-card">
      <div class="aw-card-title">${c.title}</div>
      <div class="aw-card-body">${c.body.replace(/\n/g, '<br>')}</div>
      <div class="aw-card-ref">${c.ref}</div>
    </div>
  `).join('');
}
