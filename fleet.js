// ============================================================
// AviOps v5 — Fleet Tracker (Enhanced)
// Alerts: depart/land/altitude/geo-fence
// Route canvas overlay colored by altitude
// CSV export
// ============================================================

const FLEET_STORAGE_KEY = 'aviops_fleet_v1';
const ALERT_STORAGE_KEY = 'aviops_alerts_v1';
const POLL_INTERVAL_MS  = 30000;

let fleetList      = [];
let fleetPollers   = {};
let fleetData      = {};
let alertRules     = [];
let activeFleetHex = null;

// ===== PERSISTENCE =====
function fleetSave() { try { localStorage.setItem(FLEET_STORAGE_KEY, JSON.stringify(fleetList));  } catch(e){} }
function alertSave() { try { localStorage.setItem(ALERT_STORAGE_KEY, JSON.stringify(alertRules)); } catch(e){} }
function fleetLoad() { try { const r=localStorage.getItem(FLEET_STORAGE_KEY); if(r) fleetList=JSON.parse(r); } catch(e){ fleetList=[];} }
function alertLoad() { try { const r=localStorage.getItem(ALERT_STORAGE_KEY); if(r) alertRules=JSON.parse(r); } catch(e){ alertRules=[];} }

// ===== INIT =====
function initFleetTracker() {
  fleetLoad();
  alertLoad();

  if (fleetList.length === 0) {
    fleetList = [
      { id:'demo1', name:'Alaska Airlines 5', reg:'N569AS', hex:'a7486a', notes:'B738 — Demo aircraft' },
      { id:'demo2', name:'Example Helicopter', reg:'N12345', hex:'',      notes:'Replace with your aircraft hex' }
    ];
    fleetSave();
  }

  renderFleetSidebar();
  renderAlertRules();

  if (fleetList.length > 0 && fleetList[0].hex) selectFleetAircraft(fleetList[0].hex);

  if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
}

// ===== SIDEBAR =====
function renderFleetSidebar() {
  const sidebar = document.getElementById('fleet_sidebar');
  if (!sidebar) return;
  const count = document.getElementById('fleet_count');
  if (count) count.textContent = `(${fleetList.length})`;

  if (!fleetList.length) { sidebar.innerHTML = '<div class="fleet-empty">No aircraft in fleet. Add one below.</div>'; return; }

  sidebar.innerHTML = fleetList.map(ac => {
    const live = fleetData[ac.hex]?.latest;
    const isActive = ac.hex === activeFleetHex;
    const gnd  = live ? live[8] : null;
    const alt  = live && live[7]  ? Math.round(parseFloat(live[7]) *3.28084).toLocaleString()+' ft' : '—';
    const spd  = live && live[9]  ? Math.round(parseFloat(live[9]) *1.94384)+' kts' : '—';
    const dot  = live ? (gnd?'🟡':'🟢') : '⚪';
    const aCnt = alertRules.filter(a=>a.hex===ac.hex&&a.enabled).length;
    return `
      <div class="fleet-item ${isActive?'fleet-item-active':''}" onclick="selectFleetAircraft('${ac.hex}')">
        <div class="fleet-item-top">
          <span class="fleet-status-dot">${dot}</span>
          <span class="fleet-item-name">${ac.name}</span>
          ${aCnt?`<span class="fleet-alert-badge">🔔${aCnt}</span>`:''}
          <button class="fleet-remove-btn" onclick="removeFleetAircraft('${ac.id}',event)">×</button>
        </div>
        <div class="fleet-item-reg">${ac.reg||'—'} <span class="fleet-item-hex">${ac.hex||'no hex'}</span></div>
        ${live?`<div class="fleet-item-data"><span style="color:${gnd?'var(--warn)':'var(--success)'}">${gnd?'GND':'AIR'}</span><span>${alt}</span><span>${spd}</span></div>`
              :'<div class="fleet-item-data"><span style="color:var(--text-secondary)">Not yet polled</span></div>'}
        ${ac.notes?`<div class="fleet-item-notes">${ac.notes}</div>`:''}
      </div>`;
  }).join('');
}

// ===== ADD / REMOVE =====
function addFleetAircraft() {
  const name  = document.getElementById('fleet_add_name').value.trim();
  const reg   = document.getElementById('fleet_add_reg').value.trim().toUpperCase();
  const hex   = document.getElementById('fleet_add_hex').value.trim().toLowerCase().replace(/[^0-9a-f]/g,'');
  const notes = document.getElementById('fleet_add_notes').value.trim();
  if (!name) { alert('Aircraft name is required.'); return; }
  fleetList.push({ id:'ac_'+Date.now(), name, reg, hex, notes });
  fleetSave();
  ['fleet_add_name','fleet_add_reg','fleet_add_hex','fleet_add_notes'].forEach(i=>{ const e=document.getElementById(i); if(e) e.value=''; });
  renderFleetSidebar();
  renderAlertRules();
  if (hex) selectFleetAircraft(hex);
}

function removeFleetAircraft(id, e) {
  e.stopPropagation();
  const ac = fleetList.find(a=>a.id===id);
  fleetList = fleetList.filter(a=>a.id!==id);
  fleetSave();
  if (ac?.hex && fleetPollers[ac.hex]) { clearInterval(fleetPollers[ac.hex]); delete fleetPollers[ac.hex]; }
  renderFleetSidebar();
  renderAlertRules();
  if (activeFleetHex===ac?.hex) { activeFleetHex=null; clearFleetPanel(); }
}

// ===== SELECT + POLL =====
function selectFleetAircraft(hex) {
  if (!hex) return;
  activeFleetHex = hex;
  const frame = document.getElementById('fleet_map_frame');
  if (frame) frame.src = `https://globe.adsbexchange.com/?icao=${hex}&zoom=10`;
  renderFleetPanel(hex);
  renderFleetSidebar();
  if (!fleetPollers[hex]) {
    pollFleetAircraft(hex);
    fleetPollers[hex] = setInterval(()=>pollFleetAircraft(hex), POLL_INTERVAL_MS);
  }
}

async function pollFleetAircraft(hex) {
  if (!hex) return;
  try {
    const res  = await fetch(`https://opensky-network.org/api/states/all?icao24=${hex}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!fleetData[hex]) fleetData[hex] = { latest:null, history:[], prevOnGround:null, positions:[] };
    const fd = fleetData[hex];

    if (data.states && data.states.length > 0) {
      const s = data.states[0];
      checkAlerts(hex, s, fd.prevOnGround, s[8]);
      fd.prevOnGround = s[8];
      fd.latest = s;
      fd.history.unshift({ time: new Date().toUTCString(), state: s });
      if (fd.history.length > 100) fd.history = fd.history.slice(0,100);
      if (s[6]!==null && s[5]!==null) {
        fd.positions.push({ lat:parseFloat(s[6]), lon:parseFloat(s[5]), alt:s[7]?parseFloat(s[7])*3.28084:0 });
        if (fd.positions.length > 200) fd.positions = fd.positions.slice(-200);
      }
    }

    if (hex===activeFleetHex) { renderFleetPanel(hex); }
    renderFleetSidebar();
  } catch(e) {
    const el = document.getElementById('fleet_poll_status');
    if (el) el.textContent = `Poll failed: ${e.message}`;
  }
}

// ===== ALERTS =====
function checkAlerts(hex, s, prevGnd, curGnd) {
  alertRules.filter(a=>a.hex===hex&&a.enabled).forEach(rule => {
    let triggered=false, msg='';
    if (rule.type==='depart' && prevGnd===true  && curGnd===false) { triggered=true; msg=`✈ ${getAcName(hex)} has DEPARTED`; }
    if (rule.type==='land'   && prevGnd===false && curGnd===true)  { triggered=true; msg=`🛬 ${getAcName(hex)} has LANDED`;   }
    if (rule.type==='altitude') {
      const ft = s[7] ? parseFloat(s[7])*3.28084 : null;
      if (ft!==null) {
        if (rule.params.dir==='above' && ft>rule.params.alt) { triggered=true; msg=`⬆ ${getAcName(hex)} above ${rule.params.alt.toLocaleString()} ft (${Math.round(ft).toLocaleString()} ft)`; }
        if (rule.params.dir==='below' && ft<rule.params.alt && !s[8]) { triggered=true; msg=`⬇ ${getAcName(hex)} below ${rule.params.alt.toLocaleString()} ft`; }
      }
    }
    if (rule.type==='geofence' && s[6]!==null && s[5]!==null) {
      const d = haversineNM(parseFloat(s[6]),parseFloat(s[5]),rule.params.lat,rule.params.lon);
      if (d<=rule.params.radiusNm) { triggered=true; msg=`📍 ${getAcName(hex)} within ${rule.params.radiusNm} NM of ${rule.params.name||'waypoint'} (${d.toFixed(1)} NM)`; }
    }
    if (triggered) fireAlert(rule, msg);
  });
}

function fireAlert(rule, msg) {
  showFleetToast(msg, rule.type);
  if ('Notification' in window && Notification.permission==='granted') new Notification('AviOps Alert', { body:msg });
  const log = document.getElementById('alert_log');
  if (log) {
    const item = document.createElement('div');
    item.className = 'alert-log-item';
    item.innerHTML = `<span class="alert-log-time">${new Date().toUTCString().split(',')[1]?.trim()||''}</span> ${msg}`;
    log.insertBefore(item, log.firstChild);
    if (log.children.length>30) log.removeChild(log.lastChild);
  }
}

function showFleetToast(msg, type) {
  const colors = { depart:'var(--success)', land:'var(--warn)', altitude:'var(--accent)', geofence:'#cc88ff' };
  const t = document.createElement('div');
  t.className = 'fleet-toast';
  t.style.borderLeftColor = colors[type]||'var(--accent)';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=>t.classList.add('fleet-toast-show'),50);
  setTimeout(()=>{ t.classList.remove('fleet-toast-show'); setTimeout(()=>t.remove(),400); },5000);
}

function getAcName(hex) { const a=fleetList.find(a=>a.hex===hex); return a?a.name:hex; }

function haversineNM(lat1,lon1,lat2,lon2) {
  const R=3440.065, dLat=(lat2-lat1)*Math.PI/180, dLon=(lon2-lon1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

// ===== ALERT RULES =====
function addAlertRule() {
  const hex  = document.getElementById('alert_ac_select').value;
  const type = document.getElementById('alert_type').value;
  if (!hex) { alert('Select an aircraft first.'); return; }
  const rule = { id:'r_'+Date.now(), hex, type, params:{}, enabled:true };
  if (type==='altitude') {
    rule.params.dir = document.getElementById('alert_alt_dir').value;
    rule.params.alt = parseInt(document.getElementById('alert_alt_val').value)||1000;
  }
  if (type==='geofence') {
    rule.params.lat      = parseFloat(document.getElementById('alert_geo_lat').value)||0;
    rule.params.lon      = parseFloat(document.getElementById('alert_geo_lon').value)||0;
    rule.params.radiusNm = parseFloat(document.getElementById('alert_geo_radius').value)||10;
    rule.params.name     = document.getElementById('alert_geo_name').value.trim()||'Waypoint';
  }
  alertRules.push(rule);
  alertSave();
  renderAlertRules();
  renderFleetSidebar();
}

function removeAlertRule(id) { alertRules=alertRules.filter(r=>r.id!==id); alertSave(); renderAlertRules(); renderFleetSidebar(); }

function toggleAlertRule(id) {
  const r=alertRules.find(r=>r.id===id);
  if(r){ r.enabled=!r.enabled; alertSave(); renderAlertRules(); renderFleetSidebar(); }
}

function renderAlertRules() {
  const sel = document.getElementById('alert_ac_select');
  if (sel) sel.innerHTML = '<option value="">— Select Aircraft —</option>'+fleetList.filter(a=>a.hex).map(a=>`<option value="${a.hex}">${a.name} (${a.reg})</option>`).join('');
  updateAlertTypeFields();
  const container = document.getElementById('alert_rules_list');
  if (!container) return;
  if (!alertRules.length) { container.innerHTML='<div style="color:var(--text-secondary);font-size:12px;font-family:var(--font-body)">No alert rules configured.</div>'; return; }
  container.innerHTML = alertRules.map(r=>{
    const ac=fleetList.find(a=>a.hex===r.hex);
    let desc='';
    if(r.type==='depart')   desc='Departs (ground → airborne)';
    if(r.type==='land')     desc='Lands (airborne → ground)';
    if(r.type==='altitude') desc=`Goes ${r.params.dir} ${r.params.alt?.toLocaleString()} ft`;
    if(r.type==='geofence') desc=`Within ${r.params.radiusNm} NM of ${r.params.name}`;
    return `
      <div class="alert-rule-item ${r.enabled?'':'alert-rule-disabled'}">
        <div class="alert-rule-left">
          <span class="alert-rule-ac">${ac?ac.name:r.hex}</span>
          <span class="alert-rule-desc">${desc}</span>
        </div>
        <div class="alert-rule-actions">
          <button onclick="toggleAlertRule('${r.id}')" class="alert-toggle-btn">${r.enabled?'DISABLE':'ENABLE'}</button>
          <button onclick="removeAlertRule('${r.id}')" class="alert-remove-btn">×</button>
        </div>
      </div>`;
  }).join('');
}

function updateAlertTypeFields() {
  const type = document.getElementById('alert_type')?.value;
  const af = document.getElementById('alert_alt_fields'), gf = document.getElementById('alert_geo_fields');
  if (af) af.style.display = type==='altitude' ?'block':'none';
  if (gf) gf.style.display = type==='geofence' ?'block':'none';
}

// ===== ROUTE OVERLAY =====
function drawRouteOverlay(hex) {
  const canvas = document.getElementById('route_canvas');
  if (!canvas) return;
  const ctx=canvas.getContext('2d'), W=canvas.width, H=canvas.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#0f1520'; ctx.fillRect(0,0,W,H);

  const pts = fleetData[hex]?.positions;
  if (!pts||pts.length<2) {
    ctx.fillStyle='rgba(136,153,170,0.5)'; ctx.font='12px Share Tech Mono,monospace'; ctx.textAlign='center';
    ctx.fillText('Route builds as aircraft is tracked — updates every 30s', W/2, H/2); return;
  }

  const pad=35;
  const lats=pts.map(p=>p.lat), lons=pts.map(p=>p.lon);
  const minLat=Math.min(...lats), maxLat=Math.max(...lats);
  const minLon=Math.min(...lons), maxLon=Math.max(...lons);
  const toX=lon=>pad+((lon-minLon)/(maxLon-minLon||0.001))*(W-pad*2);
  const toY=lat=>H-pad-((lat-minLat)/(maxLat-minLat||0.001))*(H-pad*2);

  // Grid
  ctx.strokeStyle='rgba(0,212,255,0.06)'; ctx.lineWidth=1;
  for(let i=0;i<=4;i++){
    const x=pad+i*(W-pad*2)/4, y=pad+i*(H-pad*2)/4;
    ctx.beginPath(); ctx.moveTo(x,pad); ctx.lineTo(x,H-pad); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pad,y); ctx.lineTo(W-pad,y); ctx.stroke();
  }

  const maxAlt=Math.max(...pts.map(p=>p.alt))||1;
  for(let i=1;i<pts.length;i++){
    const prev=pts[i-1], curr=pts[i], t=curr.alt/maxAlt;
    ctx.beginPath(); ctx.moveTo(toX(prev.lon),toY(prev.lat)); ctx.lineTo(toX(curr.lon),toY(curr.lat));
    ctx.strokeStyle=`rgb(${Math.round(255*(1-t))},${Math.round(100+155*t)},255)`;
    ctx.lineWidth=2.5; ctx.stroke();
  }

  // Start
  const s=pts[pts.length-1];
  ctx.beginPath(); ctx.arc(toX(s.lon),toY(s.lat),5,0,Math.PI*2); ctx.fillStyle='var(--success)'; ctx.fill();
  ctx.fillStyle='rgba(136,153,170,0.8)'; ctx.font='9px Share Tech Mono,monospace'; ctx.textAlign='left';
  ctx.fillText('START',toX(s.lon)+7,toY(s.lat)+4);

  // Current
  const c=pts[0];
  ctx.beginPath(); ctx.arc(toX(c.lon),toY(c.lat),7,0,Math.PI*2); ctx.fillStyle='var(--accent)'; ctx.fill();
  ctx.strokeStyle='#000'; ctx.lineWidth=1.5; ctx.stroke();
  ctx.fillStyle='var(--accent)'; ctx.font='bold 10px Share Tech Mono,monospace'; ctx.textAlign='left';
  ctx.fillText('NOW',toX(c.lon)+9,toY(c.lat)+4);

  // Title
  ctx.fillStyle='rgba(0,212,255,0.6)'; ctx.font='bold 10px Share Tech Mono,monospace'; ctx.textAlign='center';
  ctx.fillText(`ROUTE — ${getAcName(hex)} — ${pts.length} pts`,W/2,16);

  // Alt legend
  const lx=W-pad-55, ly=H-12;
  const grad=ctx.createLinearGradient(lx,ly,lx+50,ly);
  grad.addColorStop(0,'rgb(255,100,255)'); grad.addColorStop(1,'rgb(0,200,255)');
  ctx.strokeStyle=grad; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(lx,ly); ctx.lineTo(lx+50,ly); ctx.stroke();
  ctx.fillStyle='rgba(136,153,170,0.6)'; ctx.font='8px Share Tech Mono,monospace';
  ctx.textAlign='left'; ctx.fillText('LO',lx,ly-3);
  ctx.textAlign='right'; ctx.fillText('HI ALT',lx+50,ly-3);
}

function clearRouteTrack(hex) { if(fleetData[hex]) fleetData[hex].positions=[]; drawRouteOverlay(hex); }

// ===== CSV EXPORT =====
function exportFleetCSV(hex) {
  const fd=fleetData[hex];
  if (!fd?.history?.length) { alert('No history to export.'); return; }
  const ac=fleetList.find(a=>a.hex===hex);
  const rows=[['Time (UTC)','Status','Baro Alt (ft)','Geo Alt (ft)','Speed (kts)','Track (deg)','Vert Rate (fpm)','Latitude','Longitude','Squawk','Callsign']];
  fd.history.forEach(h=>{
    const s=h.state, altM=s[7]?parseFloat(s[7]):null, geoM=s[13]?parseFloat(s[13]):null;
    const vel=s[9]?parseFloat(s[9]):null, vs=s[11]?parseFloat(s[11]):null;
    rows.push([h.time, s[8]?'GROUND':'AIRBORNE',
      altM?Math.round(altM*3.28084):'', geoM?Math.round(geoM*3.28084):'',
      vel?Math.round(vel*1.94384):'', s[10]!==null?parseFloat(s[10]).toFixed(1):'',
      vs?(vs*196.85).toFixed(0):'', s[6]!==null?parseFloat(s[6]).toFixed(5):'',
      s[5]!==null?parseFloat(s[5]).toFixed(5):'', s[14]||'', (s[1]||'').trim()
    ]);
  });
  const csv=rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob=new Blob([csv],{type:'text/csv'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url; a.download=`${ac?.reg||hex}_history_${new Date().toISOString().split('T')[0]}.csv`; a.click();
  URL.revokeObjectURL(url);
}

// ===== PANEL =====
function renderFleetPanel(hex) {
  const panel=document.getElementById('fleet_panel');
  if (!panel) return;
  const ac=fleetList.find(a=>a.hex===hex), fd=fleetData[hex], s=fd?.latest;
  if (!ac) { panel.innerHTML=''; return; }

  const p = s ? {
    callsign:(s[1]||'').trim()||ac.reg||'—',
    country:s[2]||'—', onGround:s[8],
    lat:s[6]!==null?parseFloat(s[6]).toFixed(4)+'°':'—',
    lon:s[5]!==null?parseFloat(s[5]).toFixed(4)+'°':'—',
    baroAlt:s[7]?Math.round(parseFloat(s[7])*3.28084).toLocaleString()+' ft':(s[8]?'GND':'—'),
    geoAlt:s[13]?Math.round(parseFloat(s[13])*3.28084).toLocaleString()+' ft':'—',
    speed:s[9]?Math.round(parseFloat(s[9])*1.94384)+' kts':'—',
    track:s[10]!==null?parseFloat(s[10]).toFixed(0)+'°':'—',
    vRate:s[11]?(parseFloat(s[11])*196.85).toFixed(0)+' fpm':'—',
    squawk:s[14]||'—',
    lastContact:s[4]?new Date(s[4]*1000).toUTCString():'—'
  } : null;

  const sc=!s?'var(--text-secondary)':s[8]?'var(--warn)':'var(--success)';
  const st=!s?'NOT TRACKED':s[8]?'ON GROUND':'AIRBORNE';
  const pa=fd?.history?.[0]?`Polled ${Math.round((Date.now()-new Date(fd.history[0].time).getTime())/1000)}s ago`:'Awaiting poll...';

  panel.innerHTML=`
    <div class="fleet-panel-header">
      <div>
        <div class="fleet-panel-name">${ac.name}</div>
        <div class="fleet-panel-sub">${ac.reg||'—'} · HEX: ${hex||'—'}${ac.notes?' · '+ac.notes:''}</div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-size:13px;font-weight:700;color:${sc}">${st}</div>
        <div id="fleet_poll_status" style="font-size:10px;color:var(--text-secondary);font-family:var(--font-data)">${pa}</div>
        <div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap;justify-content:flex-end">
          <button class="btn-secondary" style="font-size:11px;padding:4px 10px" onclick="pollFleetAircraft('${hex}')">↻ REFRESH</button>
          <button class="btn-secondary" style="font-size:11px;padding:4px 10px" onclick="exportFleetCSV('${hex}')">⬇ CSV</button>
          <button class="btn-secondary" style="font-size:11px;padding:4px 10px" onclick="clearRouteTrack('${hex}')">🗺 CLEAR ROUTE</button>
        </div>
      </div>
    </div>
    ${p?`
    <div class="fleet-data-grid">
      ${[['Callsign',p.callsign],['Baro Alt',p.baroAlt],['Geo Alt',p.geoAlt],['Speed',p.speed],
         ['Track',p.track],['Vert Rate',p.vRate],['Latitude',p.lat],['Longitude',p.lon],
         ['Squawk',p.squawk],['Country',p.country],['Last Contact',p.lastContact]]
        .map(([l,v])=>`<div class="fleet-data-chip"><div class="fleet-data-label">${l}</div><div class="fleet-data-val">${v}</div></div>`).join('')}
    </div>`:`
    <div style="color:var(--text-secondary);font-family:var(--font-body);font-size:13px;padding:12px 0">
      No live state data. Aircraft may be on ground/transponder off, or hex may be incorrect.<br><br>
      <a href="https://globe.adsbexchange.com/?icao=${hex}" target="_blank" style="color:var(--accent)">Search ADS-B Exchange ↗</a>
    </div>`}
    <div class="route-section">
      <div class="route-header">ROUTE TRACK <span style="font-size:10px;font-weight:400;color:var(--text-secondary);margin-left:6px">colored by altitude · updates every 30s poll</span></div>
      <canvas id="route_canvas" width="700" height="260" style="width:100%;border:1px solid var(--border);border-radius:var(--radius);background:#0f1520;display:block"></canvas>
    </div>
    <div class="fleet-history">
      <div class="fleet-history-header">
        FLIGHT HISTORY LOG
        <span style="font-size:10px;font-weight:400;color:var(--text-secondary);margin-left:8px">${fd?.history?.length||0} entries</span>
        ${fd?.history?.length?`
          <button onclick="clearFleetHistory('${hex}')" style="margin-left:auto;background:none;border:1px solid rgba(255,56,56,0.3);color:rgba(255,56,56,0.6);font-size:10px;padding:2px 8px;border-radius:2px;cursor:pointer">CLEAR</button>
          <button onclick="exportFleetCSV('${hex}')" style="margin-left:6px;background:none;border:1px solid var(--border-bright);color:var(--accent);font-size:10px;padding:2px 8px;border-radius:2px;cursor:pointer">⬇ EXPORT CSV</button>`:''}
      </div>
      <div class="fleet-history-table-wrap">
        ${fd?.history?.length?`
        <table class="fleet-history-table">
          <thead><tr><th>TIME (UTC)</th><th>STATUS</th><th>ALT</th><th>SPEED</th><th>TRACK</th><th>V/S</th><th>LAT</th><th>LON</th><th>SQUAWK</th></tr></thead>
          <tbody>${fd.history.map(h=>{
            const s=h.state,a=s[7]?parseFloat(s[7]):null,v=s[9]?parseFloat(s[9]):null,vs=s[11]?parseFloat(s[11]):null;
            return `<tr>
              <td>${new Date(h.time).toUTCString().replace(' GMT','Z').split(',')[1]?.trim()||h.time}</td>
              <td style="color:${s[8]?'var(--warn)':'var(--success)'}">${s[8]?'GND':'AIR'}</td>
              <td>${a?Math.round(a*3.28084).toLocaleString()+'ft':'—'}</td>
              <td>${v?Math.round(v*1.94384)+'kt':'—'}</td>
              <td>${s[10]!==null?parseFloat(s[10]).toFixed(0)+'°':'—'}</td>
              <td>${vs?(vs*196.85).toFixed(0)+'fpm':'—'}</td>
              <td>${s[6]!==null?parseFloat(s[6]).toFixed(3):'—'}</td>
              <td>${s[5]!==null?parseFloat(s[5]).toFixed(3):'—'}</td>
              <td>${s[14]||'—'}</td></tr>`;
          }).join('')}</tbody>
        </table>`:`<div style="color:var(--text-secondary);font-size:12px;font-family:var(--font-body);padding:10px">No history yet. Polls every 30s automatically.</div>`}
      </div>
    </div>`;

  setTimeout(()=>drawRouteOverlay(hex),50);
}

function clearFleetHistory(hex) { if(fleetData[hex]) fleetData[hex].history=[]; renderFleetPanel(hex); }
function clearFleetPanel() { const p=document.getElementById('fleet_panel'); if(p) p.innerHTML='<div style="color:var(--text-secondary);font-family:var(--font-body);font-size:13px;padding:20px">Select an aircraft to view live data.</div>'; }
function findHexByReg() { const r=document.getElementById('fleet_hex_lookup').value.trim().toUpperCase(); if(r) window.open(`https://globe.adsbexchange.com/?reg=${r}`,'_blank'); }
