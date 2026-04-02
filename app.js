// ============================================================
// AviOps — Main Application Logic
// ============================================================

// ===== CLOCK =====
function updateClocks() {
  const now = new Date();
  const h = String(now.getUTCHours()).padStart(2, '0');
  const m = String(now.getUTCMinutes()).padStart(2, '0');
  const s = String(now.getUTCSeconds()).padStart(2, '0');
  document.getElementById('zuluClock').textContent = `${h}${m}Z`;
  const lh = String(now.getHours()).padStart(2, '0');
  const lm = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('localClock').textContent = `LOCAL: ${lh}:${lm}`;
}

// ===== TABS =====
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });
}

// ===== NOTAM FILTER =====
function initNotamFilter() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

// ===== TFR TYPES =====
function renderTFRTypes() {
  const grid = document.getElementById('tfrTypesGrid');
  if (!grid) return;
  grid.innerHTML = TFR_TYPES.map(t => `
    <div class="tfr-type-card">
      <div class="tfr-type-title">${t.title}</div>
      <div class="tfr-type-desc">${t.desc}</div>
    </div>
  `).join('');
}

// ===== FAR/AIM =====
function renderFARCategories() {
  const container = document.getElementById('farCategories');
  if (!container) return;
  container.innerHTML = FAR_DATA.map(cat => `
    <div class="far-category-card">
      <div class="far-cat-header">${cat.category}</div>
      <div class="far-cat-items">
        ${cat.items.map(item => `
          <div class="far-item" onclick="showFARDetail(${JSON.stringify(item.title).replace(/"/g, '&quot;')})">
            <div class="far-item-title">${item.title}</div>
            <div class="far-item-ref">${item.ref}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function showFARDetail(title) {
  // Find item
  let found = null;
  FAR_DATA.forEach(cat => {
    cat.items.forEach(item => {
      if (item.title === title) found = item;
    });
  });
  if (!found) return;

  // Remove existing detail panel
  const existing = document.getElementById('farDetailPanel');
  if (existing) existing.remove();

  const panel = document.createElement('div');
  panel.id = 'farDetailPanel';
  panel.className = 'far-detail-panel';
  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
      <div>
        <span style="font-size:10px;letter-spacing:2px;color:var(--text-secondary);text-transform:uppercase">Regulation Reference</span>
        <h4>${found.title}</h4>
      </div>
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-family:var(--font-data);font-size:11px;color:var(--accent-dim)">${found.ref}</span>
        <button onclick="document.getElementById('farDetailPanel').remove()" style="background:none;border:none;color:var(--text-secondary);cursor:pointer;font-size:18px;line-height:1">×</button>
      </div>
    </div>
    ${found.content}
  `;

  const categories = document.getElementById('farCategories');
  categories.parentNode.insertBefore(panel, categories);
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== POH =====
function renderPOH() {
  const fwGrid = document.getElementById('pohFixedWingGrid');
  const hGrid = document.getElementById('pohHelicopterGrid');

  if (fwGrid) {
    fwGrid.innerHTML = POH_FIXED_WING.map(a => `
      <div class="poh-card">
        <div class="poh-card-title">${a.title}</div>
        <div class="poh-card-sub">${a.sub}</div>
        <ul class="poh-specs">
          ${a.specs.map(s => `
            <li>
              <span class="poh-spec-label">${s.label}</span>
              <span class="poh-spec-val">${s.val}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `).join('');
  }

  if (hGrid) {
    hGrid.innerHTML = POH_HELICOPTER.map(a => `
      <div class="poh-card">
        <div class="poh-card-title">${a.title}</div>
        <div class="poh-card-sub">${a.sub}</div>
        <ul class="poh-specs">
          ${a.specs.map(s => `
            <li>
              <span class="poh-spec-label">${s.label}</span>
              <span class="poh-spec-val">${s.val}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `).join('');
  }

  const perfContainer = document.getElementById('perfCards');
  if (perfContainer) {
    perfContainer.innerHTML = PERF_CONCEPTS.map(p => `
      <div class="perf-card">
        <div class="perf-card-title">${p.title}</div>
        <div class="perf-card-body">${p.body}</div>
      </div>
    `).join('');
  }
}

function showPohCategory(cat, btn) {
  document.querySelectorAll('.poh-category').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.sel-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('poh-' + cat).classList.add('active');
  btn.classList.add('active');
}

// ===== CHECKLISTS =====
let activeChecklist = null;
let checklistState = {};

function renderChecklists() {
  const tabs = document.getElementById('checklistTabs');
  const names = Object.keys(CHECKLIST_DATA);

  tabs.innerHTML = names.map(name => `
    <button class="cl-tab-btn ${activeChecklist === name ? 'active' : ''}" onclick="loadChecklist('${name}')">${name}</button>
  `).join('');

  if (!activeChecklist && names.length > 0) {
    loadChecklist(names[0]);
  } else if (activeChecklist) {
    renderChecklistContent(activeChecklist);
  }
}

function loadChecklist(name) {
  activeChecklist = name;
  if (!checklistState[name]) checklistState[name] = {};

  document.querySelectorAll('.cl-tab-btn').forEach(b => {
    b.classList.toggle('active', b.textContent === name);
  });

  renderChecklistContent(name);
}

function renderChecklistContent(name) {
  const cl = CHECKLIST_DATA[name];
  const container = document.getElementById('checklistContent');
  const state = checklistState[name] || {};

  let totalItems = 0;
  let checkedItems = 0;

  cl.sections.forEach(sec => {
    totalItems += sec.items.length;
    sec.items.forEach((item, i) => {
      if (state[`${sec.title}_${i}`]) checkedItems++;
    });
  });

  container.innerHTML = `
    <div class="checklist-title">✈ ${name}</div>
    ${cl.sections.map(sec => `
      <div class="checklist-section">
        <div class="checklist-section-title">${sec.title}</div>
        ${sec.items.map((item, i) => {
          const key = `${sec.title}_${i}`;
          const checked = state[key] || false;
          return `
            <div class="checklist-item ${checked ? 'checked' : ''}" onclick="toggleChecklistItem('${name}', '${key}')">
              <div class="cl-checkbox"></div>
              <div class="cl-item-text">${item.text}</div>
              <div class="cl-item-action">${item.action}</div>
            </div>
          `;
        }).join('')}
      </div>
    `).join('')}
    <div class="checklist-progress">
      <div class="progress-bar"><div class="progress-fill" style="width:${totalItems > 0 ? (checkedItems/totalItems*100).toFixed(0) : 0}%"></div></div>
      <span class="progress-text">${checkedItems}/${totalItems}</span>
      <button class="reset-cl" onclick="resetChecklist('${name}')">RESET</button>
    </div>
  `;
}

function toggleChecklistItem(clName, key) {
  if (!checklistState[clName]) checklistState[clName] = {};
  checklistState[clName][key] = !checklistState[clName][key];
  renderChecklistContent(clName);
}

function resetChecklist(name) {
  checklistState[name] = {};
  renderChecklistContent(name);
}

function newChecklist() {
  const name = prompt('Checklist name:');
  if (!name) return;
  CHECKLIST_DATA[name] = { sections: [{ title: 'Section 1', items: [{ text: 'Item 1', action: 'CHECK' }] }] };
  renderChecklists();
  loadChecklist(name);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  updateClocks();
  setInterval(updateClocks, 1000);

  initTabs();
  initNotamFilter();
  renderTFRTypes();
  renderFARCategories();
  renderPOH();
  renderChecklists();
  calcFuel();
  calcDA();
  calcPA();
  calcCrosswind();
  calcUnit();
  calcTAS();

  // v2 extended
  renderSoundingStations();
  renderChartDownloads();
  renderAFDGrid();
  renderAWCards();

  // v3 W&B
  initWBCalculator();

  // v5 op tools
  initSunriseTool();
  initHoverPerf();
  initFleetTracker();

  // Auto-load ADS-B map
  loadDefaultADSB();
});

// Allow Enter key on inputs
document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const active = document.querySelector('.tab-content.active');
    if (!active) return;
    const btn = active.querySelector('.btn-primary');
    if (btn) btn.click();
  }
});

// ===== W&B RESET =====
function resetWBWeights() {
  if (!wb_currentAircraft) return;
  wb_currentAircraft.stations.forEach((s, i) => {
    wb_weights[i] = s.defaultWeight || 0;
  });
  renderWBRows();
  updateWBCalc();
}
