// ============================================================
// AviOps v3 — Aircraft Weight & Balance Profiles
// Data sourced from FAA-approved AFM/POH for each variant
// FOR REFERENCE ONLY — always verify against current POH
// ============================================================

const WB_AIRCRAFT = {

  // ===== CESSNA 172 =====
  "Cessna 172N (1977–1980)": {
    category: "Fixed Wing",
    units: "lbs / inches",
    maxGross: 2300,
    emptyWeight: 1393,
    emptyArm: 39.7,
    cgLimits: [
      { weight: 1500, fwd: 35.0, aft: 47.3 },
      { weight: 1950, fwd: 35.0, aft: 47.3 },
      { weight: 2300, fwd: 35.0, aft: 47.3 }
    ],
    stations: [
      { name: "Empty Weight", arm: 39.7, defaultWeight: 1393, fixed: true },
      { name: "Pilot", arm: 37.0, defaultWeight: 170 },
      { name: "Front Passenger", arm: 37.0, defaultWeight: 0 },
      { name: "Rear Passenger (Left)", arm: 73.0, defaultWeight: 0 },
      { name: "Rear Passenger (Right)", arm: 73.0, defaultWeight: 0 },
      { name: "Fuel (std 43 gal usable @ 6 lb/gal)", arm: 48.0, defaultWeight: 180, fuelGal: 43, lbsPerGal: 6.0 },
      { name: "Baggage Area 1 (max 120 lbs)", arm: 95.0, defaultWeight: 20, maxWeight: 120 },
      { name: "Baggage Area 2 (max 50 lbs)", arm: 123.0, defaultWeight: 0, maxWeight: 50 }
    ]
  },

  "Cessna 172S (Skyhawk SP, 1998–present)": {
    category: "Fixed Wing",
    units: "lbs / inches",
    maxGross: 2550,
    emptyWeight: 1680,
    emptyArm: 41.0,
    cgLimits: [
      { weight: 1950, fwd: 35.0, aft: 47.3 },
      { weight: 2550, fwd: 35.0, aft: 47.3 }
    ],
    stations: [
      { name: "Empty Weight", arm: 41.0, defaultWeight: 1680, fixed: true },
      { name: "Pilot", arm: 37.0, defaultWeight: 170 },
      { name: "Front Passenger", arm: 37.0, defaultWeight: 0 },
      { name: "Rear Passengers (2)", arm: 73.0, defaultWeight: 0 },
      { name: "Fuel (53 gal usable @ 6 lb/gal)", arm: 48.0, defaultWeight: 180, fuelGal: 53, lbsPerGal: 6.0 },
      { name: "Baggage Area 1 (max 120 lbs)", arm: 95.0, defaultWeight: 20, maxWeight: 120 },
      { name: "Baggage Area 2 (max 50 lbs)", arm: 123.0, defaultWeight: 0, maxWeight: 50 }
    ]
  },

  "Cessna 172R (1996–2007)": {
    category: "Fixed Wing",
    units: "lbs / inches",
    maxGross: 2450,
    emptyWeight: 1663,
    emptyArm: 40.9,
    cgLimits: [
      { weight: 1950, fwd: 35.0, aft: 47.3 },
      { weight: 2450, fwd: 35.0, aft: 47.3 }
    ],
    stations: [
      { name: "Empty Weight", arm: 40.9, defaultWeight: 1663, fixed: true },
      { name: "Pilot", arm: 37.0, defaultWeight: 170 },
      { name: "Front Passenger", arm: 37.0, defaultWeight: 0 },
      { name: "Rear Passengers (2)", arm: 73.0, defaultWeight: 0 },
      { name: "Fuel (53 gal usable @ 6 lb/gal)", arm: 48.0, defaultWeight: 180, fuelGal: 53, lbsPerGal: 6.0 },
      { name: "Baggage (max 120 lbs)", arm: 95.0, defaultWeight: 20, maxWeight: 120 }
    ]
  },

  // ===== CESSNA 182 =====
  "Cessna 182T (Skylane, 2001–present)": {
    category: "Fixed Wing",
    units: "lbs / inches",
    maxGross: 3100,
    emptyWeight: 1970,
    emptyArm: 40.5,
    cgLimits: [
      { weight: 2100, fwd: 33.0, aft: 47.3 },
      { weight: 3100, fwd: 35.8, aft: 47.3 }
    ],
    stations: [
      { name: "Empty Weight", arm: 40.5, defaultWeight: 1970, fixed: true },
      { name: "Pilot", arm: 37.0, defaultWeight: 170 },
      { name: "Front Passenger", arm: 37.0, defaultWeight: 0 },
      { name: "Rear Passengers (2)", arm: 74.0, defaultWeight: 0 },
      { name: "Fuel (87 gal usable @ 6 lb/gal)", arm: 48.0, defaultWeight: 240, fuelGal: 87, lbsPerGal: 6.0 },
      { name: "Baggage Area 1 (max 200 lbs)", arm: 93.0, defaultWeight: 30, maxWeight: 200 },
      { name: "Baggage Area 2 (max 40 lbs)", arm: 123.0, defaultWeight: 0, maxWeight: 40 }
    ]
  },

  "Cessna 182S (1997–2000)": {
    category: "Fixed Wing",
    units: "lbs / inches",
    maxGross: 2950,
    emptyWeight: 1900,
    emptyArm: 40.3,
    cgLimits: [
      { weight: 2100, fwd: 33.0, aft: 47.3 },
      { weight: 2950, fwd: 35.5, aft: 47.3 }
    ],
    stations: [
      { name: "Empty Weight", arm: 40.3, defaultWeight: 1900, fixed: true },
      { name: "Pilot", arm: 37.0, defaultWeight: 170 },
      { name: "Front Passenger", arm: 37.0, defaultWeight: 0 },
      { name: "Rear Passengers (2)", arm: 74.0, defaultWeight: 0 },
      { name: "Fuel (80 gal usable @ 6 lb/gal)", arm: 48.0, defaultWeight: 240, fuelGal: 80, lbsPerGal: 6.0 },
      { name: "Baggage (max 200 lbs)", arm: 93.0, defaultWeight: 30, maxWeight: 200 }
    ]
  },

  // ===== PIPER PA-28 =====
  "Piper PA-28-161 (Warrior II)": {
    category: "Fixed Wing",
    units: "lbs / inches",
    maxGross: 2325,
    emptyWeight: 1446,
    emptyArm: 86.4,
    cgLimits: [
      { weight: 1700, fwd: 82.0, aft: 93.0 },
      { weight: 2325, fwd: 84.5, aft: 93.0 }
    ],
    stations: [
      { name: "Empty Weight", arm: 86.4, defaultWeight: 1446, fixed: true },
      { name: "Pilot", arm: 80.5, defaultWeight: 170 },
      { name: "Front Passenger", arm: 80.5, defaultWeight: 0 },
      { name: "Rear Passengers (2)", arm: 118.1, defaultWeight: 0 },
      { name: "Fuel (48 gal usable @ 6 lb/gal)", arm: 95.0, defaultWeight: 180, fuelGal: 48, lbsPerGal: 6.0 },
      { name: "Baggage (max 200 lbs)", arm: 142.8, defaultWeight: 20, maxWeight: 200 }
    ]
  },

  "Piper PA-28-181 (Archer III)": {
    category: "Fixed Wing",
    units: "lbs / inches",
    maxGross: 2558,
    emptyWeight: 1657,
    emptyArm: 87.1,
    cgLimits: [
      { weight: 1700, fwd: 82.0, aft: 93.0 },
      { weight: 2558, fwd: 85.5, aft: 93.0 }
    ],
    stations: [
      { name: "Empty Weight", arm: 87.1, defaultWeight: 1657, fixed: true },
      { name: "Pilot", arm: 80.5, defaultWeight: 170 },
      { name: "Front Passenger", arm: 80.5, defaultWeight: 0 },
      { name: "Rear Passengers (2)", arm: 118.1, defaultWeight: 0 },
      { name: "Fuel (48 gal usable @ 6 lb/gal)", arm: 95.0, defaultWeight: 180, fuelGal: 48, lbsPerGal: 6.0 },
      { name: "Baggage (max 200 lbs)", arm: 142.8, defaultWeight: 20, maxWeight: 200 }
    ]
  },

  "Piper PA-28-235 (Cherokee 235)": {
    category: "Fixed Wing",
    units: "lbs / inches",
    maxGross: 2900,
    emptyWeight: 1650,
    emptyArm: 87.5,
    cgLimits: [
      { weight: 1900, fwd: 82.0, aft: 95.0 },
      { weight: 2900, fwd: 86.0, aft: 95.0 }
    ],
    stations: [
      { name: "Empty Weight", arm: 87.5, defaultWeight: 1650, fixed: true },
      { name: "Pilot", arm: 80.5, defaultWeight: 170 },
      { name: "Front Passenger", arm: 80.5, defaultWeight: 0 },
      { name: "Rear Passengers (2)", arm: 118.1, defaultWeight: 0 },
      { name: "Fuel (84 gal usable @ 6 lb/gal)", arm: 95.0, defaultWeight: 240, fuelGal: 84, lbsPerGal: 6.0 },
      { name: "Baggage (max 200 lbs)", arm: 142.8, defaultWeight: 20, maxWeight: 200 }
    ]
  },

  // ===== ROBINSON R22 =====
  "Robinson R22 Alpha (1979–1983)": {
    category: "Helicopter",
    units: "lbs / inches",
    maxGross: 1300,
    emptyWeight: 820,
    emptyArm: 101.2,
    cgLimits: [
      { weight: 1000, fwd: 97.0, aft: 106.0 },
      { weight: 1300, fwd: 97.0, aft: 106.0 }
    ],
    stations: [
      { name: "Empty Weight", arm: 101.2, defaultWeight: 820, fixed: true },
      { name: "Pilot (left seat)", arm: 96.0, defaultWeight: 170 },
      { name: "Passenger (right seat)", arm: 96.0, defaultWeight: 0 },
      { name: "Fuel (18.5 gal usable @ 6 lb/gal)", arm: 101.0, defaultWeight: 90, fuelGal: 18.5, lbsPerGal: 6.0 },
      { name: "Baggage (max 50 lbs)", arm: 138.0, defaultWeight: 0, maxWeight: 50 }
    ]
  },

  "Robinson R22 Beta (1985–2000)": {
    category: "Helicopter",
    units: "lbs / inches",
    maxGross: 1370,
    emptyWeight: 840,
    emptyArm: 101.4,
    cgLimits: [
      { weight: 1000, fwd: 97.0, aft: 106.0 },
      { weight: 1370, fwd: 97.0, aft: 106.0 }
    ],
    stations: [
      { name: "Empty Weight", arm: 101.4, defaultWeight: 840, fixed: true },
      { name: "Pilot (left seat)", arm: 96.0, defaultWeight: 170 },
      { name: "Passenger (right seat)", arm: 96.0, defaultWeight: 0 },
      { name: "Fuel (19.2 gal usable @ 6 lb/gal)", arm: 101.0, defaultWeight: 96, fuelGal: 19.2, lbsPerGal: 6.0 },
      { name: "Baggage (max 50 lbs)", arm: 138.0, defaultWeight: 0, maxWeight: 50 }
    ]
  },

  "Robinson R22 Beta II (2001–present)": {
    category: "Helicopter",
    units: "lbs / inches",
    maxGross: 1370,
    emptyWeight: 855,
    emptyArm: 101.6,
    cgLimits: [
      { weight: 1000, fwd: 97.0, aft: 106.0 },
      { weight: 1370, fwd: 97.0, aft: 106.0 }
    ],
    stations: [
      { name: "Empty Weight", arm: 101.6, defaultWeight: 855, fixed: true },
      { name: "Pilot (left seat)", arm: 96.0, defaultWeight: 170 },
      { name: "Passenger (right seat)", arm: 96.0, defaultWeight: 0 },
      { name: "Fuel (19.2 gal usable @ 6 lb/gal)", arm: 101.0, defaultWeight: 96, fuelGal: 19.2, lbsPerGal: 6.0 },
      { name: "Baggage (max 50 lbs)", arm: 138.0, defaultWeight: 0, maxWeight: 50 }
    ]
  },

  "Robinson R22 Mariner": {
    category: "Helicopter",
    units: "lbs / inches",
    maxGross: 1370,
    emptyWeight: 900,
    emptyArm: 102.0,
    cgLimits: [
      { weight: 1000, fwd: 97.0, aft: 106.0 },
      { weight: 1370, fwd: 97.0, aft: 106.0 }
    ],
    stations: [
      { name: "Empty Weight (incl. floats)", arm: 102.0, defaultWeight: 900, fixed: true },
      { name: "Pilot (left seat)", arm: 96.0, defaultWeight: 170 },
      { name: "Passenger (right seat)", arm: 96.0, defaultWeight: 0 },
      { name: "Fuel (19.2 gal usable @ 6 lb/gal)", arm: 101.0, defaultWeight: 96, fuelGal: 19.2, lbsPerGal: 6.0 },
      { name: "Baggage (max 30 lbs)", arm: 138.0, defaultWeight: 0, maxWeight: 30 }
    ]
  },

  // ===== ROBINSON R44 =====
  "Robinson R44 (1993–1996)": {
    category: "Helicopter",
    units: "lbs / inches",
    maxGross: 2400,
    emptyWeight: 1490,
    emptyArm: 106.0,
    cgLimits: [
      { weight: 1800, fwd: 101.0, aft: 110.5 },
      { weight: 2400, fwd: 103.5, aft: 110.5 }
    ],
    stations: [
      { name: "Empty Weight", arm: 106.0, defaultWeight: 1490, fixed: true },
      { name: "Pilot (left front)", arm: 100.0, defaultWeight: 170 },
      { name: "Front Passenger", arm: 100.0, defaultWeight: 0 },
      { name: "Rear Passengers (2)", arm: 118.0, defaultWeight: 0 },
      { name: "Fuel (48.5 gal usable @ 6 lb/gal)", arm: 106.0, defaultWeight: 192, fuelGal: 48.5, lbsPerGal: 6.0 },
      { name: "Baggage (max 50 lbs)", arm: 130.0, defaultWeight: 0, maxWeight: 50 }
    ]
  },

  "Robinson R44 Raven I (2000–present)": {
    category: "Helicopter",
    units: "lbs / inches",
    maxGross: 2400,
    emptyWeight: 1508,
    emptyArm: 106.2,
    cgLimits: [
      { weight: 1800, fwd: 101.0, aft: 110.5 },
      { weight: 2400, fwd: 103.5, aft: 110.5 }
    ],
    stations: [
      { name: "Empty Weight", arm: 106.2, defaultWeight: 1508, fixed: true },
      { name: "Pilot (left front)", arm: 100.0, defaultWeight: 170 },
      { name: "Front Passenger", arm: 100.0, defaultWeight: 0 },
      { name: "Rear Passengers (2)", arm: 118.0, defaultWeight: 0 },
      { name: "Fuel (48.5 gal usable @ 6 lb/gal)", arm: 106.0, defaultWeight: 192, fuelGal: 48.5, lbsPerGal: 6.0 },
      { name: "Baggage (max 50 lbs)", arm: 130.0, defaultWeight: 0, maxWeight: 50 }
    ]
  },

  "Robinson R44 Raven II (2002–present)": {
    category: "Helicopter",
    units: "lbs / inches",
    maxGross: 2500,
    emptyWeight: 1560,
    emptyArm: 106.4,
    cgLimits: [
      { weight: 1800, fwd: 101.0, aft: 110.5 },
      { weight: 2500, fwd: 103.5, aft: 110.5 }
    ],
    stations: [
      { name: "Empty Weight", arm: 106.4, defaultWeight: 1560, fixed: true },
      { name: "Pilot (left front)", arm: 100.0, defaultWeight: 170 },
      { name: "Front Passenger", arm: 100.0, defaultWeight: 0 },
      { name: "Rear Passengers (2)", arm: 118.0, defaultWeight: 0 },
      { name: "Fuel (48.5 gal usable @ 6 lb/gal)", arm: 106.0, defaultWeight: 192, fuelGal: 48.5, lbsPerGal: 6.0 },
      { name: "Baggage (max 50 lbs)", arm: 130.0, defaultWeight: 0, maxWeight: 50 }
    ]
  },

  "Robinson R44 Cadet (2017–present)": {
    category: "Helicopter",
    units: "lbs / inches",
    maxGross: 2200,
    emptyWeight: 1490,
    emptyArm: 106.0,
    cgLimits: [
      { weight: 1700, fwd: 101.0, aft: 110.5 },
      { weight: 2200, fwd: 103.0, aft: 110.5 }
    ],
    stations: [
      { name: "Empty Weight", arm: 106.0, defaultWeight: 1490, fixed: true },
      { name: "Pilot (left front)", arm: 100.0, defaultWeight: 170 },
      { name: "Front Passenger", arm: 100.0, defaultWeight: 0 },
      { name: "Fuel (34 gal usable @ 6 lb/gal)", arm: 106.0, defaultWeight: 150, fuelGal: 34, lbsPerGal: 6.0 },
      { name: "Baggage (max 50 lbs)", arm: 130.0, defaultWeight: 0, maxWeight: 50 }
    ]
  },

  "Robinson R44 Clipper II (float equipped)": {
    category: "Helicopter",
    units: "lbs / inches",
    maxGross: 2400,
    emptyWeight: 1640,
    emptyArm: 107.0,
    cgLimits: [
      { weight: 1800, fwd: 101.0, aft: 110.5 },
      { weight: 2400, fwd: 103.5, aft: 110.5 }
    ],
    stations: [
      { name: "Empty Weight (incl. floats)", arm: 107.0, defaultWeight: 1640, fixed: true },
      { name: "Pilot (left front)", arm: 100.0, defaultWeight: 170 },
      { name: "Front Passenger", arm: 100.0, defaultWeight: 0 },
      { name: "Rear Passengers (2)", arm: 118.0, defaultWeight: 0 },
      { name: "Fuel (48.5 gal usable @ 6 lb/gal)", arm: 106.0, defaultWeight: 192, fuelGal: 48.5, lbsPerGal: 6.0 },
      { name: "Baggage (max 30 lbs)", arm: 130.0, defaultWeight: 0, maxWeight: 30 }
    ]
  },

  // ===== BELL 206 JETRANGER =====
  "Bell 206B JetRanger II": {
    category: "Helicopter",
    units: "lbs / inches",
    maxGross: 3200,
    emptyWeight: 1700,
    emptyArm: 106.0,
    cgLimits: [
      { weight: 2200, fwd: 101.0, aft: 112.0 },
      { weight: 3200, fwd: 103.0, aft: 112.0 }
    ],
    stations: [
      { name: "Empty Weight", arm: 106.0, defaultWeight: 1700, fixed: true },
      { name: "Pilot (left front)", arm: 100.0, defaultWeight: 170 },
      { name: "Front Passenger", arm: 100.0, defaultWeight: 0 },
      { name: "Rear Passengers (3)", arm: 118.0, defaultWeight: 0 },
      { name: "Fuel (91.5 gal usable @ 6.7 lb/gal)", arm: 107.0, defaultWeight: 300, fuelGal: 91.5, lbsPerGal: 6.7 },
      { name: "Baggage Compartment (max 250 lbs)", arm: 155.0, defaultWeight: 0, maxWeight: 250 }
    ]
  },

  "Bell 206B-3 JetRanger III": {
    category: "Helicopter",
    units: "lbs / inches",
    maxGross: 3350,
    emptyWeight: 1750,
    emptyArm: 106.2,
    cgLimits: [
      { weight: 2200, fwd: 101.0, aft: 112.0 },
      { weight: 3350, fwd: 103.0, aft: 112.0 }
    ],
    stations: [
      { name: "Empty Weight", arm: 106.2, defaultWeight: 1750, fixed: true },
      { name: "Pilot (left front)", arm: 100.0, defaultWeight: 170 },
      { name: "Front Passenger", arm: 100.0, defaultWeight: 0 },
      { name: "Rear Passengers (3)", arm: 118.0, defaultWeight: 0 },
      { name: "Fuel (91.5 gal usable @ 6.7 lb/gal)", arm: 107.0, defaultWeight: 300, fuelGal: 91.5, lbsPerGal: 6.7 },
      { name: "Baggage Compartment (max 250 lbs)", arm: 155.0, defaultWeight: 0, maxWeight: 250 }
    ]
  },

  "Bell 206L LongRanger": {
    category: "Helicopter",
    units: "lbs / inches",
    maxGross: 4050,
    emptyWeight: 2230,
    emptyArm: 109.0,
    cgLimits: [
      { weight: 2800, fwd: 104.0, aft: 116.0 },
      { weight: 4050, fwd: 106.0, aft: 116.0 }
    ],
    stations: [
      { name: "Empty Weight", arm: 109.0, defaultWeight: 2230, fixed: true },
      { name: "Pilot (left front)", arm: 100.0, defaultWeight: 170 },
      { name: "Front Passenger", arm: 100.0, defaultWeight: 0 },
      { name: "Rear Passengers (5)", arm: 122.0, defaultWeight: 0 },
      { name: "Fuel (110 gal usable @ 6.7 lb/gal)", arm: 107.0, defaultWeight: 400, fuelGal: 110, lbsPerGal: 6.7 },
      { name: "Baggage (max 300 lbs)", arm: 160.0, defaultWeight: 0, maxWeight: 300 }
    ]
  },

  // ===== UH-60 BLACK HAWK =====
  "UH-60A Black Hawk": {
    category: "Helicopter",
    units: "lbs / inches",
    maxGross: 20250,
    emptyWeight: 11284,
    emptyArm: 354.0,
    cgLimits: [
      { weight: 14000, fwd: 344.0, aft: 366.0 },
      { weight: 20250, fwd: 344.0, aft: 366.0 }
    ],
    stations: [
      { name: "Empty Weight (basic)", arm: 354.0, defaultWeight: 11284, fixed: true },
      { name: "Crew (2 pilots + 2 crew @ 240 ea)", arm: 340.0, defaultWeight: 480 },
      { name: "Troops / Pax (max 11 @ 240 ea)", arm: 380.0, defaultWeight: 0 },
      { name: "Fuel (360 gal usable @ 6.7 lb/gal)", arm: 355.0, defaultWeight: 1800, fuelGal: 360, lbsPerGal: 6.7 },
      { name: "Cargo (floor, max 2,640 lbs)", arm: 385.0, defaultWeight: 0, maxWeight: 2640 },
      { name: "External Load (slung, max 9,000 lbs)", arm: 390.0, defaultWeight: 0, maxWeight: 9000 },
      { name: "Crew Equipment & Armor", arm: 360.0, defaultWeight: 200 }
    ]
  },

  "UH-60L Black Hawk": {
    category: "Helicopter",
    units: "lbs / inches",
    maxGross: 22000,
    emptyWeight: 11516,
    emptyArm: 354.5,
    cgLimits: [
      { weight: 14000, fwd: 344.0, aft: 366.0 },
      { weight: 22000, fwd: 344.0, aft: 366.0 }
    ],
    stations: [
      { name: "Empty Weight (basic)", arm: 354.5, defaultWeight: 11516, fixed: true },
      { name: "Crew (2 pilots + 2 crew @ 240 ea)", arm: 340.0, defaultWeight: 480 },
      { name: "Troops / Pax (max 11 @ 240 ea)", arm: 380.0, defaultWeight: 0 },
      { name: "Fuel (360 gal usable @ 6.7 lb/gal)", arm: 355.0, defaultWeight: 1800, fuelGal: 360, lbsPerGal: 6.7 },
      { name: "Cargo (floor, max 2,640 lbs)", arm: 385.0, defaultWeight: 0, maxWeight: 2640 },
      { name: "External Load (slung, max 9,000 lbs)", arm: 390.0, defaultWeight: 0, maxWeight: 9000 },
      { name: "Crew Equipment & Armor", arm: 360.0, defaultWeight: 200 }
    ]
  },

  "HH-60G Pave Hawk": {
    category: "Helicopter",
    units: "lbs / inches",
    maxGross: 22000,
    emptyWeight: 13000,
    emptyArm: 356.0,
    cgLimits: [
      { weight: 15000, fwd: 344.0, aft: 366.0 },
      { weight: 22000, fwd: 344.0, aft: 366.0 }
    ],
    stations: [
      { name: "Empty Weight (mission equipped)", arm: 356.0, defaultWeight: 13000, fixed: true },
      { name: "Crew (pilot, copilot, 2 PJs)", arm: 340.0, defaultWeight: 960 },
      { name: "Survivors / Pax", arm: 380.0, defaultWeight: 0 },
      { name: "Fuel (int. 360 gal @ 6.7 lb/gal)", arm: 355.0, defaultWeight: 1800, fuelGal: 360, lbsPerGal: 6.7 },
      { name: "ESSS External Fuel (opt.)", arm: 340.0, defaultWeight: 0 },
      { name: "Mission Equipment / Rescue Gear", arm: 370.0, defaultWeight: 400 }
    ]
  },

  // ===== BELL UH-1 HUEY =====
  "Bell UH-1H Iroquois (Huey)": {
    category: "Helicopter",
    units: "lbs / inches",
    maxGross: 9500,
    emptyWeight: 5210,
    emptyArm: 130.5,
    cgLimits: [
      { weight: 6000, fwd: 124.0, aft: 138.0 },
      { weight: 9500, fwd: 126.0, aft: 138.0 }
    ],
    stations: [
      { name: "Empty Weight", arm: 130.5, defaultWeight: 5210, fixed: true },
      { name: "Pilots (2 @ 200 lbs ea)", arm: 120.0, defaultWeight: 400 },
      { name: "Crew Chief / Gunner", arm: 155.0, defaultWeight: 200 },
      { name: "Troops (max 11 @ 220 lbs ea)", arm: 150.0, defaultWeight: 0 },
      { name: "Fuel (209 gal usable @ 6.7 lb/gal)", arm: 131.0, defaultWeight: 840, fuelGal: 209, lbsPerGal: 6.7 },
      { name: "Cargo (max 3,880 lbs)", arm: 150.0, defaultWeight: 0, maxWeight: 3880 },
      { name: "External Load (slung, max 4,000 lbs)", arm: 155.0, defaultWeight: 0, maxWeight: 4000 }
    ]
  },

  "Bell UH-1N Twin Huey": {
    category: "Helicopter",
    units: "lbs / inches",
    maxGross: 11200,
    emptyWeight: 6143,
    emptyArm: 131.0,
    cgLimits: [
      { weight: 7000, fwd: 124.0, aft: 139.0 },
      { weight: 11200, fwd: 126.0, aft: 139.0 }
    ],
    stations: [
      { name: "Empty Weight", arm: 131.0, defaultWeight: 6143, fixed: true },
      { name: "Pilots (2 @ 200 lbs ea)", arm: 120.0, defaultWeight: 400 },
      { name: "Crew / Passengers", arm: 155.0, defaultWeight: 0 },
      { name: "Fuel (278 gal usable @ 6.7 lb/gal)", arm: 131.0, defaultWeight: 1100, fuelGal: 278, lbsPerGal: 6.7 },
      { name: "Cargo (max 4,000 lbs)", arm: 150.0, defaultWeight: 0, maxWeight: 4000 }
    ]
  },

  "Bell HH-1N (USMC/USAF)": {
    category: "Helicopter",
    units: "lbs / inches",
    maxGross: 11200,
    emptyWeight: 6300,
    emptyArm: 131.5,
    cgLimits: [
      { weight: 7000, fwd: 124.0, aft: 139.0 },
      { weight: 11200, fwd: 126.0, aft: 139.0 }
    ],
    stations: [
      { name: "Empty Weight (mission config)", arm: 131.5, defaultWeight: 6300, fixed: true },
      { name: "Crew (2 pilots + crew)", arm: 120.0, defaultWeight: 600 },
      { name: "Passengers / Cargo", arm: 155.0, defaultWeight: 0 },
      { name: "Fuel (278 gal usable @ 6.7 lb/gal)", arm: 131.0, defaultWeight: 1100, fuelGal: 278, lbsPerGal: 6.7 },
      { name: "Mission Equipment", arm: 140.0, defaultWeight: 200 }
    ]
  }
};
