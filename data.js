// ============================================================
// AviOps — Static Reference Data
// ============================================================

const FAR_DATA = [
  {
    category: "Part 91 — General Operating Rules",
    items: [
      {
        title: "VFR Weather Minimums (Controlled Airspace)",
        ref: "14 CFR §91.155",
        content: `<h4>14 CFR §91.155 — Basic VFR Weather Minimums</h4>
<p><strong>Class B:</strong> 3 SM visibility, clear of clouds.<br>
<strong>Class C/D:</strong> 3 SM, 500 ft below / 1,000 ft above / 2,000 ft horizontal from clouds.<br>
<strong>Class E (below 10,000 ft MSL):</strong> 3 SM, 500 ft below / 1,000 ft above / 2,000 ft horizontal.<br>
<strong>Class E (at/above 10,000 ft MSL):</strong> 5 SM, 1,000 ft below / 1,000 ft above / 1 SM horizontal.<br>
<strong>Class G (1,200 ft AGL or less, day):</strong> 1 SM, clear of clouds.<br>
<strong>Class G (1,200 ft AGL or less, night):</strong> 3 SM, 500/1,000/2,000.<br>
<strong>Note:</strong> Special VFR may be authorized with at least 1 SM visibility and clear of clouds.</p>`
      },
      {
        title: "Instrument Currency Requirements",
        ref: "14 CFR §61.57(c)",
        content: `<h4>14 CFR §61.57(c) — Instrument Currency</h4>
<p>Within the preceding <strong>6 calendar months</strong> in the same category of aircraft, a pilot must perform and log under actual or simulated instrument conditions:</p>
<ul style="margin-left:16px;line-height:2">
<li>6 instrument approaches</li>
<li>Holding procedures and tasks</li>
<li>Intercepting and tracking courses through the use of navigational electronic systems</li>
</ul>
<p><strong>Lapse:</strong> If currency lapses, you may not act as PIC under IFR or in IMC. Must complete an IPC with authorized instructor.</p>`
      },
      {
        title: "Preflight Action Requirements",
        ref: "14 CFR §91.103",
        content: `<h4>14 CFR §91.103 — Preflight Action</h4>
<p>Each PIC <strong>shall</strong>, before beginning a flight, become familiar with all available information concerning that flight. For flights not in the vicinity of an airport:</p>
<ul style="margin-left:16px;line-height:2">
<li>Weather reports and forecasts</li>
<li>Fuel requirements</li>
<li>Alternatives if the planned flight cannot be completed</li>
<li>Any known traffic delays</li>
<li>Runway lengths at airports of intended use</li>
<li>Takeoff and landing distance data for the aircraft</li>
</ul>`
      },
      {
        title: "Minimum Safe Altitudes",
        ref: "14 CFR §91.119",
        content: `<h4>14 CFR §91.119 — Minimum Safe Altitudes</h4>
<p><strong>Anywhere:</strong> Altitude allowing emergency landing without hazard to persons or property on the surface (except when necessary for T/O and landing).</p>
<p><strong>Over congested areas:</strong> 1,000 ft above the highest obstacle within 2,000 ft horizontal radius.</p>
<p><strong>Over other than congested areas:</strong> 500 ft AGL, except over open water or sparsely populated areas — 500 ft from any person, vessel, vehicle, or structure.</p>
<p><strong>Helicopters:</strong> May be operated at less than the prescribed altitudes if operation is conducted without hazard to persons or property on the surface.</p>`
      },
      {
        title: "Fuel Requirements — VFR",
        ref: "14 CFR §91.151",
        content: `<h4>14 CFR §91.151 — Fuel Requirements for VFR Flight</h4>
<p><strong>Day VFR:</strong> Enough to fly to the first point of intended landing and, assuming normal cruising speed, <strong>30 minutes</strong> of additional fuel.</p>
<p><strong>Night VFR:</strong> Enough fuel to the destination plus <strong>45 minutes</strong> additional at normal cruising speed.</p>
<p><strong>Helicopters (Day VFR):</strong> 20 minutes reserve at normal cruising speed.</p>
<p><strong>Helicopters (Night VFR):</strong> 30 minutes reserve.</p>`
      },
      {
        title: "Fuel Requirements — IFR",
        ref: "14 CFR §91.167",
        content: `<h4>14 CFR §91.167 — Fuel Requirements for IFR Flight</h4>
<p>No person may operate an aircraft in IFR conditions unless it carries enough fuel to:</p>
<ul style="margin-left:16px;line-height:2">
<li>Complete the flight to the first airport of intended landing</li>
<li>Fly from that airport to the alternate airport (if required)</li>
<li>Fly after that for <strong>45 minutes</strong> at normal cruising speed</li>
</ul>`
      },
      {
        title: "Alternate Airport Requirements — IFR",
        ref: "14 CFR §91.169",
        content: `<h4>14 CFR §91.169 — IFR Flight Plan — Alternate Airport</h4>
<p><strong>1-2-3 Rule (Fixed Wing):</strong> If, from 1 hour before to 1 hour after ETA, the forecast ceiling is at least <strong>2,000 ft</strong> and visibility at least <strong>3 SM</strong>, no alternate is required.</p>
<p><strong>Alternate minimums:</strong></p>
<ul style="margin-left:16px;line-height:2">
<li>Precision approach: 600 ft ceiling / 2 SM visibility</li>
<li>Non-precision approach: 800 ft ceiling / 2 SM visibility</li>
<li>No instrument approach: ceiling and visibility that allow descent from MEA to airport</li>
</ul>`
      },
      {
        title: "Right-of-Way Rules",
        ref: "14 CFR §91.113",
        content: `<h4>14 CFR §91.113 — Right-of-Way Rules</h4>
<p><strong>Priority order (highest to lowest):</strong></p>
<ol style="margin-left:16px;line-height:2">
<li>Balloon</li>
<li>Glider</li>
<li>Airship</li>
<li>Aircraft towing or refueling other aircraft</li>
<li>Airplane, helicopter, powered parachute, weight-shift control aircraft</li>
</ol>
<p><strong>When aircraft are of same category:</strong><br>
Aircraft being overtaken has right-of-way. An aircraft on approach to land or on final approach has right-of-way over aircraft in flight or on surface.</p>
<p><strong>Helicopters:</strong> When two helicopters approach head-on, each shall alter course to the right.</p>`
      }
    ]
  },
  {
    category: "Airspace",
    items: [
      {
        title: "Airspace Classes — Summary",
        ref: "14 CFR §71 / AIM Ch. 3",
        content: `<h4>Airspace Classification Summary</h4>
<table style="width:100%;border-collapse:collapse;font-size:12px">
<tr style="color:var(--accent);border-bottom:1px solid var(--border)">
<th style="text-align:left;padding:4px 8px">Class</th>
<th style="text-align:left;padding:4px 8px">Clearance</th>
<th style="text-align:left;padding:4px 8px">Radio</th>
<th style="text-align:left;padding:4px 8px">Equipment</th>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:4px 8px;color:var(--warn)"><strong>A</strong></td>
<td style="padding:4px 8px">Required</td>
<td style="padding:4px 8px">Required</td>
<td style="padding:4px 8px">IFR equipped, Mode C</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:4px 8px;color:#4488ff"><strong>B</strong></td>
<td style="padding:4px 8px">Required</td>
<td style="padding:4px 8px">Required</td>
<td style="padding:4px 8px">Mode C, ADS-B</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:4px 8px;color:#aa44ff"><strong>C</strong></td>
<td style="padding:4px 8px">Required</td>
<td style="padding:4px 8px">Required</td>
<td style="padding:4px 8px">Mode C, ADS-B</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:4px 8px;color:#4499ff"><strong>D</strong></td>
<td style="padding:4px 8px">Required</td>
<td style="padding:4px 8px">Required</td>
<td style="padding:4px 8px">ADS-B (if within Mode C veil)</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:4px 8px;color:#ff8844"><strong>E</strong></td>
<td style="padding:4px 8px">Not required (VFR)</td>
<td style="padding:4px 8px">Not required (VFR)</td>
<td style="padding:4px 8px">Mode C above 10,000 ft</td>
</tr>
<tr>
<td style="padding:4px 8px"><strong>G</strong></td>
<td style="padding:4px 8px">Not required</td>
<td style="padding:4px 8px">Not required</td>
<td style="padding:4px 8px">None specified</td>
</tr>
</table>`
      },
      {
        title: "Class D Communications — Tower Contact",
        ref: "14 CFR §91.129 / AIM 3-2-4",
        content: `<h4>Class D Airspace — Communications</h4>
<p>Prior to entry, <strong>two-way radio communication must be established</strong> with the tower. Acknowledgment of your call sign by ATC (even with "standby") constitutes establishment of two-way communication.</p>
<p>Extends from the surface to 2,500 ft AGL, typically a 4 NM radius. Tower hours determine when Class D is active — outside those hours, reverts to Class E or G.</p>`
      }
    ]
  },
  {
    category: "Helicopter-Specific",
    items: [
      {
        title: "Helicopter VFR Fuel Requirements",
        ref: "14 CFR §91.151(b)",
        content: `<h4>14 CFR §91.151(b) — Helicopter Fuel (VFR)</h4>
<p><strong>Day VFR:</strong> Fuel to fly to the first point of intended landing, plus <strong>20 minutes</strong> at normal cruising speed.</p>
<p><strong>Night VFR:</strong> Fuel to the destination plus <strong>30 minutes</strong> at normal cruising speed.</p>
<p>This is less than fixed-wing requirements — but operators and companies often impose more conservative standards. Always check your operations specification (OpSpec) or company SOPs.</p>`
      },
      {
        title: "Helicopter Minimum Altitudes",
        ref: "14 CFR §91.119(d)",
        content: `<h4>14 CFR §91.119(d) — Helicopter Altitude Exception</h4>
<p>Helicopters may be operated at less than the minimums prescribed in §91.119(b) and (c), provided the operation is conducted <strong>without hazard to persons or property on the surface</strong>.</p>
<p>This exception allows helicopters to operate at low levels for tasks such as power line patrol, aerial application, and law enforcement — provided safety can be assured. Always document risk management and comply with any applicable company or regulatory requirements.</p>`
      },
      {
        title: "Helicopter Weight / Altitude / Temperature (WAT)",
        ref: "POH Performance Charts / AC 27-1B",
        content: `<h4>Weight / Altitude / Temperature (WAT) — Helicopters</h4>
<p>Helicopter performance degrades as weight increases, altitude increases, and temperature increases. The <strong>WAT limit</strong> defines the maximum gross weight at which a helicopter can maintain a specified hover or climb performance under given conditions.</p>
<p><strong>Key computations:</strong></p>
<ul style="margin-left:16px;line-height:2">
<li><strong>Hover In Ground Effect (HIGE):</strong> Best hover performance, rotor in ground effect (typically within 1 rotor diameter)</li>
<li><strong>Hover Out of Ground Effect (HOGE):</strong> Required for cross-country planning and elevated platforms</li>
<li><strong>Height Velocity (H/V) Diagram:</strong> "Dead man's curve" — altitude/airspeed combinations to avoid for safe autorotation</li>
</ul>
<p>Always use your <strong>aircraft-specific performance charts</strong> from the POH.</p>`
      }
    ]
  },
  {
    category: "IFR Operations",
    items: [
      {
        title: "IFR Takeoff Minimums",
        ref: "14 CFR §91.175 / TERPS",
        content: `<h4>IFR Takeoff Minimums — Part 91</h4>
<p>Part 91 operators are <strong>not required</strong> to comply with published takeoff minimums, but must comply if they are flying a Part 135 operation.</p>
<p>Standard takeoff minimums (unless otherwise published):<br>
<strong>1 or 2 engines:</strong> 1 SM<br>
<strong>3+ engines:</strong> ½ SM</p>
<p>Alternate takeoff minimums or departure procedures (DPs/ODPs) are published in the front of the Terminal Procedures Publication (TPP) where required. Look for a <strong>▲T</strong> symbol on instrument approach charts.</p>`
      },
      {
        title: "Approach Minimums — DA vs MDA",
        ref: "14 CFR §91.175 / AIM 5-4-19",
        content: `<h4>DA vs MDA — Approach Minimums</h4>
<p><strong>Decision Altitude (DA) / Decision Height (DH):</strong> Used for precision approaches (ILS, LPV, GLS). At the DA, pilot must decide to continue or execute missed approach based on required visual references.</p>
<p><strong>Minimum Descent Altitude (MDA):</strong> Used for non-precision approaches (VOR, LOC, LNAV). Pilot descends to MDA and flies level until the MAP or required visual references are established.</p>
<p><strong>Required visual references:</strong> At least one of the following must be distinctly visible — approach light system, threshold, threshold markings, threshold lights, REIL, VASI/PAPI, touchdown zone, or runway markings/lights.</p>`
      }
    ]
  }
];

const TFR_TYPES = [
  { title: "§91.137 — Disaster/Hazard", desc: "Established to protect persons/property on the ground during disaster relief, firefighting, or other hazardous operations. Typically 3 NM radius, surface to 2,000 ft AGL." },
  { title: "§91.138 — National Disasters", desc: "For national disasters in Hawaii, usually applies to volcanic areas or other large-scale events." },
  { title: "§91.141 — Presidential/VIP", desc: "Protects the President, VP, or other VIPs. Often a 30 NM outer ring (no unauthorized ops below 18,000) and 10 NM inner ring (no ops). Extends from surface to unlimited." },
  { title: "§91.143 — Space Operations", desc: "Launched rockets or other space vehicles. Location varies by launch site (Cape Canaveral, Vandenberg, etc.)." },
  { title: "§91.144 — High Density Traffic", desc: "Issued by the Administrator to reduce traffic density in airspace where it may be hazardous." },
  { title: "§91.145 — Airshow/Sporting Events", desc: "Issued for major aviation events and large sporting events. Typically 3 NM radius, surface to 3,000 ft AGL." },
  { title: "§99.7 — National Security", desc: "Special security instructions — areas around national security sensitive locations, nuclear plants, etc." },
  { title: "NOTAM TFR — Wildfire", desc: "Common in western states. Altitude floor is typically 2,000 ft AGL, 1–5 NM radius. Aviation firefighting assets operating below." }
];

const POH_FIXED_WING = [
  {
    title: "Cessna 172S (Skyhawk)",
    sub: "Single Engine Trainer/Utility",
    specs: [
      { label: "Max Gross Weight", val: "2,550 lbs" },
      { label: "Empty Weight (approx)", val: "1,680 lbs" },
      { label: "Useful Load", val: "~870 lbs" },
      { label: "Fuel Capacity", val: "56 gal (53 usable)" },
      { label: "Cruise Speed", val: "122 KTAS" },
      { label: "Range", val: "~640 NM" },
      { label: "Service Ceiling", val: "14,000 ft" },
      { label: "Vso", val: "40 KIAS" },
      { label: "Vs1", val: "48 KIAS" },
      { label: "Vx", val: "62 KIAS" },
      { label: "Vy", val: "74 KIAS" },
      { label: "Va (2,550 lbs)", val: "105 KIAS" },
      { label: "Vno", val: "129 KIAS" },
      { label: "Vne", val: "163 KIAS" }
    ]
  },
  {
    title: "Piper PA-28-181 (Archer III)",
    sub: "Single Engine Trainer/Utility",
    specs: [
      { label: "Max Gross Weight", val: "2,558 lbs" },
      { label: "Useful Load", val: "~900 lbs" },
      { label: "Fuel Capacity", val: "50 gal (48 usable)" },
      { label: "Cruise Speed", val: "128 KTAS" },
      { label: "Vso", val: "44 KIAS" },
      { label: "Vs1", val: "49 KIAS" },
      { label: "Vx", val: "63 KIAS" },
      { label: "Vy", val: "76 KIAS" },
      { label: "Va", val: "111 KIAS" },
      { label: "Vno", val: "125 KIAS" },
      { label: "Vne", val: "160 KIAS" }
    ]
  },
  {
    title: "Beechcraft Bonanza G36",
    sub: "Single Engine / Complex",
    specs: [
      { label: "Max Gross Weight", val: "3,650 lbs" },
      { label: "Fuel Capacity", val: "74 gal usable" },
      { label: "Cruise Speed", val: "176 KTAS" },
      { label: "Range", val: "~800 NM" },
      { label: "Service Ceiling", val: "18,500 ft" },
      { label: "Vs1", val: "58 KIAS" },
      { label: "Vy", val: "110 KIAS" },
      { label: "Va", val: "146 KIAS" },
      { label: "Vno", val: "174 KIAS" },
      { label: "Vne", val: "225 KIAS" }
    ]
  },
  {
    title: "Cirrus SR22T",
    sub: "Single Engine / High Performance",
    specs: [
      { label: "Max Gross Weight", val: "3,600 lbs" },
      { label: "Fuel Capacity", val: "92 gal usable" },
      { label: "Cruise Speed", val: "213 KTAS" },
      { label: "Range", val: "~1,100 NM" },
      { label: "Service Ceiling", val: "25,000 ft" },
      { label: "Vs0", val: "65 KIAS" },
      { label: "Vy", val: "101 KIAS" },
      { label: "Va", val: "133 KIAS" },
      { label: "Vno", val: "178 KIAS" },
      { label: "Vne", val: "205 KIAS" }
    ]
  }
];

const POH_HELICOPTER = [
  {
    title: "Robinson R22",
    sub: "2-Seat Light Piston Helicopter",
    specs: [
      { label: "Max Gross Weight", val: "1,370 lbs" },
      { label: "Empty Weight", val: "~840 lbs" },
      { label: "Fuel Capacity", val: "19.2 gal usable" },
      { label: "Vne", val: "102 KIAS" },
      { label: "Best Rate Climb", val: "~600 fpm" },
      { label: "Cruise Speed", val: "~96 KTAS" },
      { label: "Range", val: "~200 NM" },
      { label: "Service Ceiling", val: "14,000 ft" },
      { label: "HOGE", val: "Varies with WAT" }
    ]
  },
  {
    title: "Robinson R44",
    sub: "4-Seat Light Piston Helicopter",
    specs: [
      { label: "Max Gross Weight", val: "2,500 lbs" },
      { label: "Fuel Capacity", val: "48.5 gal usable" },
      { label: "Vne", val: "130 KIAS" },
      { label: "Cruise Speed", val: "~113 KTAS" },
      { label: "Range", val: "~320 NM" },
      { label: "Service Ceiling", val: "14,000 ft" },
      { label: "Engine", val: "Lycoming IO-540" }
    ]
  },
  {
    title: "Bell 206 JetRanger",
    sub: "Single Turbine — Utility",
    specs: [
      { label: "Max Gross Weight", val: "3,350 lbs" },
      { label: "Fuel Capacity", val: "91.5 gal" },
      { label: "Vne", val: "130 KIAS" },
      { label: "Cruise Speed", val: "~115 KTAS" },
      { label: "Range", val: "~375 NM" },
      { label: "Service Ceiling", val: "13,500 ft" },
      { label: "Engine", val: "Allison 250-C20J" },
      { label: "HIGE", val: "~12,800 ft (ISA, MGW)" }
    ]
  },
  {
    title: "Sikorsky UH-60 Black Hawk",
    sub: "Twin Turbine — Military Utility",
    specs: [
      { label: "Max Gross Weight", val: "22,000 lbs" },
      { label: "Fuel Capacity", val: "~360 gal" },
      { label: "Vne", val: "193 KIAS" },
      { label: "Cruise Speed", val: "~150 KTAS" },
      { label: "Range", val: "~320 NM" },
      { label: "Service Ceiling", val: "19,150 ft" },
      { label: "Engines", val: "2x GE T700" },
      { label: "Payload", val: "~9,000 lbs (slung)" }
    ]
  },
  {
    title: "Bell UH-1 Huey",
    sub: "Single Turbine — Legacy Utility",
    specs: [
      { label: "Max Gross Weight", val: "9,500 lbs" },
      { label: "Vne", val: "124 KIAS" },
      { label: "Cruise Speed", val: "~110 KTAS" },
      { label: "Range", val: "~285 NM" },
      { label: "Service Ceiling", val: "12,600 ft" },
      { label: "Engine", val: "Lycoming T53" }
    ]
  },
  {
    title: "MD 500E (500 Series)",
    sub: "Light Turbine Utility",
    specs: [
      { label: "Max Gross Weight", val: "3,000 lbs" },
      { label: "Fuel Capacity", val: "74 gal" },
      { label: "Vne", val: "152 KIAS" },
      { label: "Cruise Speed", val: "~130 KTAS" },
      { label: "Range", val: "~250 NM" },
      { label: "Service Ceiling", val: "16,000 ft" },
      { label: "Engine", val: "Allison 250-C20B" }
    ]
  }
];

const PERF_CONCEPTS = [
  {
    title: "Density Altitude",
    body: "Pressure altitude corrected for non-standard temperature. High DA = reduced engine power, reduced lift, longer takeoff roll. DA = PA + (120 × (OAT − ISA temp)). ISA temp = 15°C − (2°C per 1,000 ft)."
  },
  {
    title: "Pressure Altitude",
    body: "The altitude indicated when altimeter is set to 29.92 inHg. PA = field elevation + (29.92 − altimeter setting) × 1,000. Used in performance chart calculations."
  },
  {
    title: "Takeoff Distance Factors",
    body: "Increases with: higher gross weight, higher density altitude, uphill slope, tailwind, contaminated/soft runway surface. Rule of thumb: DA increase of 1,000 ft adds ~3–5% to TO distance."
  },
  {
    title: "Vx vs Vy",
    body: "Vx = Best Angle of Climb (most altitude per horizontal distance — obstacle clearance). Vy = Best Rate of Climb (most altitude per unit time — enroute climb). Vx increases, Vy decreases with altitude until they meet at absolute ceiling."
  },
  {
    title: "H/V Curve (Helicopters)",
    body: "Height/Velocity Diagram defines combinations of altitude and airspeed from which a safe autorotation cannot be performed. Avoid 'dead man's curve' during low-altitude/low-speed flight, especially at high density altitudes."
  },
  {
    title: "Aircraft Structural Envelope",
    body: "Va (maneuvering speed) is the maximum speed at which full single control deflection is safe. Va decreases as weight decreases. Above Va, avoid full or abrupt control inputs. Vno = max structural cruise; Vne = never exceed."
  }
];

const CHECKLIST_DATA = {
  "C172 — Normal": {
    sections: [
      {
        title: "Preflight Inspection",
        items: [
          { text: "Aircraft documents (ARROW)", action: "CHECK" },
          { text: "Fuel — color, quantity, caps secure", action: "CHECK" },
          { text: "Oil level", action: "6–8 QTS" },
          { text: "Fuel sumps — drain and check", action: "DRAIN/CHECK" },
          { text: "Control surfaces — free and correct", action: "CHECK" },
          { text: "Pitot tube cover removed", action: "REMOVE" },
          { text: "Stall warning — test", action: "CHECK" },
          { text: "Tires — condition and inflation", action: "CHECK" },
          { text: "Engine compartment — general inspection", action: "INSPECT" }
        ]
      },
      {
        title: "Before Start",
        items: [
          { text: "Seats and belts", action: "ADJUST/SECURE" },
          { text: "Brakes", action: "TEST/SET" },
          { text: "Circuit breakers", action: "IN" },
          { text: "Avionics master", action: "OFF" },
          { text: "Fuel selector", action: "BOTH" },
          { text: "Mixture", action: "RICH" }
        ]
      },
      {
        title: "Engine Start",
        items: [
          { text: "Throttle", action: "1/4\" OPEN" },
          { text: "Primer — as required, locked", action: "AS REQ'D" },
          { text: "Beacon/strobes", action: "ON" },
          { text: "Clear prop — announce", action: "ANNOUNCE" },
          { text: "Ignition", action: "START" },
          { text: "Oil pressure", action: "CHECK (30 sec)" },
          { text: "Avionics master", action: "ON" }
        ]
      },
      {
        title: "Before Takeoff",
        items: [
          { text: "Flight controls — free and correct", action: "CHECK" },
          { text: "Flight instruments — set and checked", action: "SET" },
          { text: "Altimeter", action: "SET" },
          { text: "Nav/comms — set", action: "SET" },
          { text: "Transponder", action: "ALT / ADS-B" },
          { text: "Fuel selector", action: "BOTH" },
          { text: "Mixture", action: "RICH (<3,000 ft)" },
          { text: "Throttle — run-up 1,800 RPM", action: "1,800 RPM" },
          { text: "Magneto check (max 125 RPM drop, 50 RPM diff)", action: "CHECK" },
          { text: "Carburetor heat — test", action: "TEST" },
          { text: "Engine gauges", action: "IN GREEN" },
          { text: "Flaps — as required", action: "0–10°" },
          { text: "Emergency briefing", action: "BRIEF" }
        ]
      },
      {
        title: "Shutdown",
        items: [
          { text: "Mixture", action: "IDLE CUTOFF" },
          { text: "Magnetos", action: "OFF" },
          { text: "Avionics master", action: "OFF" },
          { text: "Master switch", action: "OFF" },
          { text: "Control lock", action: "INSTALL" },
          { text: "Hobbs/tach — record", action: "LOG" }
        ]
      }
    ]
  },
  "R44 — Normal": {
    sections: [
      {
        title: "Preflight",
        items: [
          { text: "Rotor head — inspect", action: "INSPECT" },
          { text: "Main rotor blades — inspect", action: "INSPECT" },
          { text: "Tail rotor — inspect", action: "INSPECT" },
          { text: "Engine compartment", action: "INSPECT" },
          { text: "Fuel — color, quantity", action: "CHECK/SUMP" },
          { text: "Oil level", action: "CHECK" },
          { text: "Drive belts — tension/condition", action: "CHECK" },
          { text: "Landing gear/skids", action: "INSPECT" },
          { text: "Pitot tube clear", action: "CHECK" }
        ]
      },
      {
        title: "Before Engine Start",
        items: [
          { text: "Collective — full down, friction on", action: "DOWN/FRICTION" },
          { text: "Cyclic — centered", action: "CENTER" },
          { text: "Throttle — closed", action: "CLOSED" },
          { text: "Fuel shutoff", action: "ON" },
          { text: "Mixture — rich", action: "RICH" },
          { text: "Governor switch", action: "OFF" }
        ]
      },
      {
        title: "Engine Start",
        items: [
          { text: "Throttle — cracked", action: "CRACK OPEN" },
          { text: "Clear — announce", action: "CLEAR" },
          { text: "Starter — engage", action: "ENGAGE" },
          { text: "At 80% RPM — throttle to idle", action: "IDLE" },
          { text: "Oil pressure — check", action: "CHECK 30s" },
          { text: "Rotor engage — gradually", action: "GRADUAL" },
          { text: "Governor switch", action: "ON" }
        ]
      },
      {
        title: "Before Takeoff",
        items: [
          { text: "Engine warm-up — oil temp in green", action: "WARM UP" },
          { text: "Instruments — set and checked", action: "SET" },
          { text: "Hover check — controls, performance", action: "CHECK" },
          { text: "H/V curve — brief", action: "BRIEF" }
        ]
      },
      {
        title: "Shutdown",
        items: [
          { text: "Governor switch", action: "OFF" },
          { text: "Cool down — 1–2 min at idle", action: "2 MIN" },
          { text: "Collective — full down", action: "DOWN" },
          { text: "Mixture — idle cutoff", action: "CUTOFF" },
          { text: "Throttle — closed", action: "CLOSED" },
          { text: "All switches — off", action: "OFF" },
          { text: "Rotor braked — if equipped", action: "APPLY" }
        ]
      }
    ]
  },
  "Emergency — Engine Failure": {
    sections: [
      {
        title: "Fixed Wing — Engine Failure in Flight",
        items: [
          { text: "Airspeed — best glide (Vg)", action: "ESTABLISH" },
          { text: "Fuel selector — switch tank", action: "SWITCH" },
          { text: "Mixture — rich", action: "RICH" },
          { text: "Carburetor heat — ON", action: "ON" },
          { text: "Primer — in and locked", action: "LOCKED" },
          { text: "Ignition — BOTH or START", action: "BOTH/START" },
          { text: "Master/alternator — check on", action: "ON" },
          { text: "Landing site — identify", action: "IDENTIFY" },
          { text: "Squawk 7700", action: "7700" },
          { text: "MAYDAY — declare", action: "DECLARE" }
        ]
      },
      {
        title: "Helicopter — Engine Failure (Low Altitude)",
        items: [
          { text: "Collective — lower immediately", action: "LOWER" },
          { text: "Autorotation RPM — maintain", action: "MAINTAIN" },
          { text: "Landing site — select", action: "SELECT" },
          { text: "Mayday — declare if time permits", action: "DECLARE" },
          { text: "At 40–100 ft: flare to decelerate", action: "FLARE" },
          { text: "Level attitude — at 8–15 ft", action: "LEVEL" },
          { text: "Collective — cushion landing", action: "PULL" }
        ]
      }
    ]
  }
};
