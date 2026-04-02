[README.md](https://github.com/user-attachments/files/26427036/README.md)
# ✈ AviOps v2 — Aviation Operations Dashboard

A browser-based aviation operations reference tool for **helicopter and fixed-wing** pilots, crews, and dispatchers. 17 tabs pulling live data from aviationweather.gov, FAA APIs, OpenSky, ADS-B Exchange, OurAirports, NTSB, and more.

---

## What's New in v2

Added 6 new tabs and major expansions to existing ones:

- **WX+** — ASOS/AWOS finder, upper air soundings, prog charts, GOES satellite, NWS radar, volcanic ash/VAAC, BLIPMAP boundary layer
- **Charts** — Embedded SkyVector (VFR/IFR/TAC), airport diagram lookup, all FAA chart type downloads, SUA/MOA links
- **Traffic** — Embedded ADS-B Exchange live map, OpenSky Network aircraft state API lookup
- **Airport Info** — OurAirports.com runway/frequency data, D-ATIS fetch, FAA Chart Supplement (A/FD) by region
- **Flight Plan** — 1800wxbrief deep-links (file/brief/close), SUA/MOA scheduling, fuel price lookup
- **Airworthiness** — FAA AD search, NTSB accident database, SDR database, AVIATES/MEL/ARROW quick reference

---

## All 17 Tabs

**WEATHER:** WX · METAR/TAF · PIREPs · WX+

**AIRSPACE:** NOTAMs · TFRs · Charts · Traffic

**AIRPORTS:** Airport Info · Flight Plan

**REFERENCE:** FAR/AIM · POH/Perf · Airworthiness

**OPS:** Checklists · W&B/Fuel · Tools

---

## Live Data Sources

- aviationweather.gov — METARs, TAFs, PIREPs
- FAA NOTAM API — real-time NOTAMs
- OpenSky Network — ADS-B state vectors (free, no auth)
- ADS-B Exchange — embedded live traffic map
- SkyVector — embedded chart viewer
- OurAirports.com — runway, frequency, elevation data
- University of Wyoming — upper air soundings
- NWS WPC — prog charts
- NOAA GOES — satellite imagery
- NWS NEXRAD — radar mosaic
- 1800wxbrief.com — flight plan filing & briefings
- FAA SUA tool — MOA/restricted area status
- NTSB CAROL — accident/incident database
- FAA AD Portal — airworthiness directives
- AirNav / GlobalAir / 100LL.com — fuel prices

---

## Getting Started

**Local:** Open `index.html` in any modern browser. No build step required.

**GitHub Pages:** Settings → Pages → Source: `main`, root. Live at `yourusername.github.io/repo-name/`

---

## Project Structure

```
aviation-ops-app/
├── index.html        # 17-tab application
├── css/style.css     # Tactical dark-mode UI
├── js/
│   ├── app.js        # Core: tabs, clocks, checklist, POH, FAR rendering
│   ├── weather.js    # AWC API: METAR, TAF, PIREPs, NOTAMs
│   ├── tools.js      # Calculations: DA, PA, TAS, XW, W&B, fuel, decoder
│   ├── extended.js   # v2: airport, ATIS, ADS-B, OpenSky, soundings, ADs, NTSB
│   └── data.js       # Static: FAR/AIM, POH specs, checklists, TFR types
└── README.md
```

---

## ⚠️ Disclaimer

For reference and training purposes only. Always verify with official FAA sources before flight. Not a substitute for an official weather briefing, NOTAM service, or pilot-in-command judgment.
