// =========================================
// DATA — 11-Car Compact SUV Showdown 2026
// Order: Creta, Seltos, Elevate, Grand Vitara, Hyryder,
//        Kushaq, Taigun, MG Astor, C3 Aircross, Sierra, Duster
// =========================================
const DATA = {
  cars: [
    {
      name: "Hyundai Creta", short: "Creta", brand: "Hyundai", year: "2024 (New Gen)",
      color: "#3B82F6", priceMin: 10.79, priceMax: 20.20,
      maxPower: 160, maxTorque: 253, bestMileage: 21.8, gc: 190, boot: 433,
      ncap: 5, ncapBody: "GNCAP", airbags: 6,
      adas: true, cam360: true, allDisc: true, discNote: "All variants",
      fuelOptions: ["Petrol", "Diesel", "Turbo Petrol"],
      engines: [
        { name: "1.5 NA Petrol", cc: 1497, power: 115, torque: 144, trans: "6-MT / IVT", mileage: "17.4–17.7 kmpl" },
        { name: "1.5 Diesel", cc: 1493, power: 116, torque: 250, trans: "6-MT / 6-AT", mileage: "19.1–21.8 kmpl" },
        { name: "1.5 Turbo Petrol", cc: 1482, power: 160, torque: 253, trans: "7-DCT", mileage: "18.4 kmpl" }
      ],
      pros: ["ADAS Level 2", "360° camera", "Diesel & Turbo options", "Segment leader brand value", "Excellent resale", "All-disc brakes"],
      cons: ["Crowded variant lineup", "Top variants ₹20L+", "NA petrol feels weak", "Turbo only with DCT"],
      badge: "Best Mileage (Diesel)"
    },
    {
      name: "Kia Seltos", short: "Seltos", brand: "Kia", year: "2026 (New Gen)",
      color: "#EF4444", priceMin: 10.99, priceMax: 19.99,
      maxPower: 158, maxTorque: 253, bestMileage: 20.8, gc: 190, boot: 433,
      ncap: 0, ncapBody: "Not tested", airbags: 6,
      adas: true, cam360: true, allDisc: true, discNote: "All variants",
      fuelOptions: ["Petrol", "Diesel", "Turbo Petrol"],
      engines: [
        { name: "1.5 NA Petrol", cc: 1497, power: 115, torque: 144, trans: "6-MT / IVT", mileage: "17.7 kmpl" },
        { name: "1.5 Diesel", cc: 1493, power: 116, torque: 250, trans: "6-MT / 6-AT", mileage: "19.7–20.8 kmpl" },
        { name: "1.5 Turbo GDi", cc: 1482, power: 158, torque: 253, trans: "6-iMT / 7-DCT", mileage: "18.3 kmpl" }
      ],
      pros: ["ADAS Level 2+", "12.3-inch infotainment", "Bose audio", "Turbo iMT option", "Longest in segment", "Premium cabin"],
      cons: ["New gen untested NCAP", "Complex variant naming", "Top variants near ₹20L", "iMT has learning curve"],
      badge: null
    },
    {
      name: "Honda Elevate", short: "Elevate", brand: "Honda", year: "2024",
      color: "#F97316", priceMin: 11.64, priceMax: 16.67,
      maxPower: 121, maxTorque: 145, bestMileage: 16.92, gc: 220, boot: 458,
      ncap: 5, ncapBody: "JNCAP", airbags: 6,
      adas: true, cam360: false, allDisc: true, discNote: "All variants",
      fuelOptions: ["Petrol"],
      engines: [
        { name: "1.5 i-VTEC", cc: 1498, power: 121, torque: 145, trans: "6-MT / CVT", mileage: "15.31–16.92 kmpl" }
      ],
      pros: ["Honda ADAS", "Best ground clearance (220mm)", "Honda reliability & low maintenance", "Spacious cabin", "Largest boot after Sierra (458L)", "All-disc brakes"],
      cons: ["Underpowered NA engine", "No turbo/diesel", "No panoramic sunroof", "No 360° camera", "Below-average mileage"],
      badge: "Best GC"
    },
    {
      name: "Maruti Grand Vitara", short: "Gr. Vitara", brand: "Maruti Suzuki", year: "2024",
      color: "#06B6D4", priceMin: 10.70, priceMax: 19.99,
      maxPower: 116, maxTorque: 197, bestMileage: 27.97, gc: 210, boot: 373,
      ncap: 5, ncapBody: "GNCAP", airbags: 6,
      adas: true, cam360: true, allDisc: true, discNote: "All variants",
      fuelOptions: ["Petrol", "Strong Hybrid"],
      engines: [
        { name: "1.5 NA Petrol", cc: 1462, power: 103, torque: 137, trans: "5-MT / 6-AT", mileage: "19.38–21.11 kmpl" },
        { name: "1.5 Strong Hybrid", cc: 1490, power: 116, torque: 197, trans: "e-CVT", mileage: "27.97 kmpl" }
      ],
      pros: ["Best fuel economy (27.97 kmpl hybrid)", "5-star GNCAP", "ADAS Level 2", "360° camera", "Maruti service network", "AWD option", "Strong resale"],
      cons: ["No diesel/turbo petrol", "Hybrid battery longevity concern", "Rear legroom tight", "Boot modest (373L)", "Interior quality below segment best"],
      badge: "Best Fuel Economy"
    },
    {
      name: "Toyota Urban Cruiser Hyryder", short: "Hyryder", brand: "Toyota", year: "2024",
      color: "#A855F7", priceMin: 10.79, priceMax: 19.99,
      maxPower: 116, maxTorque: 197, bestMileage: 27.97, gc: 210, boot: 373,
      ncap: 5, ncapBody: "GNCAP", airbags: 6,
      adas: true, cam360: true, allDisc: true, discNote: "All variants",
      fuelOptions: ["Petrol", "Strong Hybrid"],
      engines: [
        { name: "1.5 NA Petrol", cc: 1462, power: 103, torque: 137, trans: "5-MT / 6-AT", mileage: "19–21.11 kmpl" },
        { name: "1.5 Strong Hybrid", cc: 1490, power: 116, torque: 197, trans: "e-CVT", mileage: "27.97 kmpl" }
      ],
      pros: ["Toyota reliability & resale", "Best-in-class fuel economy (hybrid)", "5-star GNCAP", "ADAS Level 2", "AWD option", "Wireless charging"],
      cons: ["Shared platform with Grand Vitara", "No diesel/turbo petrol", "Boot modest (373L)", "Slightly premium pricing", "Cabin tech can feel dated vs Seltos"],
      badge: null
    },
    {
      name: "Skoda Kushaq", short: "Kushaq", brand: "Skoda", year: "2026 Facelift",
      color: "#22C55E", priceMin: 10.69, priceMax: 18.99,
      maxPower: 150, maxTorque: 250, bestMileage: 19.66, gc: 155, boot: 385,
      ncap: 5, ncapBody: "GNCAP", airbags: 6,
      adas: false, cam360: false, allDisc: false, discNote: "1.5 only",
      fuelOptions: ["Petrol"],
      engines: [
        { name: "1.0 TSI", cc: 999, power: 115, torque: 178, trans: "6-MT / 8-AT", mileage: "19.09–19.66 kmpl" },
        { name: "1.5 TSI", cc: 1498, power: 150, torque: 250, trans: "7-DSG", mileage: "18.72 kmpl" }
      ],
      pros: ["Turbo engine fun-to-drive", "5-star GNCAP safety", "Rear massage seats", "New 8-speed AT smooth", "Loaded base variant", "German build quality"],
      cons: ["No ADAS in any variant", "No 360° camera", "No diesel", "No wireless charging", "Low ground clearance (155mm)"],
      badge: null
    },
    {
      name: "VW Taigun", short: "Taigun", brand: "Volkswagen", year: "2025 (Updated)",
      color: "#6366F1", priceMin: 10.58, priceMax: 19.19,
      maxPower: 150, maxTorque: 250, bestMileage: 19.87, gc: 188, boot: 385,
      ncap: 5, ncapBody: "GNCAP", airbags: 6,
      adas: false, cam360: false, allDisc: false, discNote: "No (drum rear)",
      fuelOptions: ["Petrol"],
      engines: [
        { name: "1.0 TSI", cc: 999, power: 115, torque: 178, trans: "6-MT / 6-AT", mileage: "18.15–19.2 kmpl" },
        { name: "1.5 TSI EVO", cc: 1498, power: 150, torque: 250, trans: "6-MT / 7-DSG", mileage: "18.61–19.01 kmpl" }
      ],
      pros: ["5-star GNCAP", "Best highway manners", "TSI turbo engines fun", "Solid build quality", "Wireless charging"],
      cons: ["No ADAS", "No 360° camera", "No panoramic sunroof", "Rear drum brakes", "No diesel", "Older interior design"],
      badge: null
    },
    {
      name: "MG Astor", short: "MG Astor", brand: "MG Motor", year: "2024",
      color: "#EAB308", priceMin: 9.98, priceMax: 17.50,
      maxPower: 140, maxTorque: 220, bestMileage: 17.8, gc: 177, boot: 375,
      ncap: 0, ncapBody: "Not tested", airbags: 6,
      adas: true, cam360: true, allDisc: false, discNote: "Higher variants",
      fuelOptions: ["Petrol"],
      engines: [
        { name: "1.5 NA Petrol", cc: 1498, power: 110, torque: 144, trans: "5-MT / CVT", mileage: "16.96–17.8 kmpl" },
        { name: "1.3 Turbo Petrol", cc: 1349, power: 140, torque: 220, trans: "6-DCT", mileage: "15.9 kmpl" }
      ],
      pros: ["AI personal assistant (Jio-MG)", "ADAS Level 2", "360° camera", "Panoramic sunroof standard", "Affordable entry (₹9.98L)", "Wireless charging"],
      cons: ["No NCAP rating", "MG service network smaller", "Resale value concerns", "Rear drum brakes on base", "Brand trust vs established rivals"],
      badge: "Best Entry Price"
    },
    {
      name: "Citroën C3 Aircross", short: "C3 Aircross", brand: "Citroën", year: "2024",
      color: "#10B981", priceMin: 9.99, priceMax: 15.49,
      maxPower: 110, maxTorque: 190, bestMileage: 18.7, gc: 170, boot: 315,
      ncap: 0, ncapBody: "Not tested", airbags: 6,
      adas: false, cam360: false, allDisc: false, discNote: "No (drum rear)",
      fuelOptions: ["Petrol"],
      engines: [
        { name: "1.2 PureTech Turbo", cc: 1199, power: 110, torque: 190, trans: "6-MT / 6-AT", mileage: "17.4–18.7 kmpl" }
      ],
      pros: ["Unique European design", "Comfortable ride (Progressive Hydraulic Cushions)", "Good highway mileage", "Affordable pricing", "3-row 7-seat option"],
      cons: ["No ADAS", "No 360° camera", "Smallest boot (315L)", "Not NCAP tested", "Limited feature set vs rivals", "Citroën service network thin"],
      badge: null
    },
    {
      name: "Tata Sierra", short: "Sierra", brand: "Tata", year: "2026 (New)",
      color: "#EC4899", priceMin: 11.49, priceMax: 21.29,
      maxPower: 158, maxTorque: 260, bestMileage: 20.0, gc: 205, boot: 622,
      ncap: 5, ncapBody: "BNCAP", airbags: 6,
      adas: true, cam360: true, allDisc: true, discNote: "All variants",
      fuelOptions: ["Petrol", "Diesel", "Turbo Petrol"],
      engines: [
        { name: "1.5 NA Petrol", cc: 1498, power: 105, torque: 145, trans: "6-MT / 7-DCA", mileage: "17 kmpl" },
        { name: "1.5 Hyperion Turbo", cc: 1498, power: 158, torque: 255, trans: "6-AT", mileage: "16.5 kmpl" },
        { name: "1.5 Kryojet Diesel", cc: 1497, power: 116, torque: 260, trans: "6-MT / 6-AT", mileage: "20 kmpl" }
      ],
      pros: ["ADAS Level 2+", "360° camera", "AR HUD (first in segment)", "Largest boot (622L)", "Triple screen setup", "JBL Dolby Atmos", "3 engine options", "Iconic design"],
      cons: ["Long waiting periods", "Top variants over ₹21L", "NA petrol underpowered", "Tata service inconsistent", "Heavier than rivals"],
      badge: "Best Boot"
    },
    {
      name: "Renault Duster", short: "Duster", brand: "Renault", year: "2026 (Re-entry)",
      color: "#84CC16", priceMin: 12.00, priceMax: 18.50,
      maxPower: 130, maxTorque: 230, bestMileage: 18.6, gc: 217, boot: 421,
      ncap: 3, ncapBody: "Euro NCAP", airbags: 6,
      adas: true, cam360: false, allDisc: true, discNote: "Top variants",
      fuelOptions: ["Petrol", "Mild Hybrid"],
      engines: [
        { name: "1.2 TCe 130 Petrol", cc: 1199, power: 130, torque: 230, trans: "6-MT / 7-EDC", mileage: "17.5–18.6 kmpl" },
        { name: "1.2 TCe Mild Hybrid", cc: 1199, power: 130, torque: 230, trans: "7-EDC", mileage: "18.2–19.1 kmpl" }
      ],
      pros: ["Legendary off-road DNA returns", "High ground clearance (217mm)", "Good boot space (421L)", "Expected ADAS Level 2", "new-gen design & cabin", "4WD variant expected"],
      cons: ["Only 3-star Euro NCAP", "Renault India service network thin", "No diesel option (India)", "Pricing expected ₹12L+", "Awaited — specs may change at launch"],
      badge: "AWD Legend Returns"
    }
  ],
  // Indices: 0=Creta 1=Seltos 2=Elevate 3=GrVitara 4=Hyryder 5=Kushaq 6=Taigun 7=MGAstor 8=C3Aircross 9=Sierra 10=Duster
  comparisonMatrix: [
    {
      category: "Price", metrics: [
        { label: "Starting Price", values: ["₹10.79L", "₹10.99L", "₹11.64L", "₹10.70L", "₹10.79L", "₹10.69L", "₹10.58L", "₹9.98L", "₹9.99L", "₹11.49L", "₹12.00L"], winner: 7 },
        { label: "Top Variant Price", values: ["₹20.20L", "₹19.99L", "₹16.67L", "₹19.99L", "₹19.99L", "₹18.99L", "₹19.19L", "₹17.50L", "₹15.49L", "₹21.29L", "₹18.50L"], winner: 2 }
      ]
    },
    {
      category: "Performance", metrics: [
        { label: "Max Power", values: ["160 PS", "158 PS", "121 PS", "116 PS", "116 PS", "150 PS", "150 PS", "140 PS", "110 PS", "158 PS", "130 PS"], winner: 0 },
        { label: "Max Torque", values: ["253 Nm", "253 Nm", "145 Nm", "197 Nm", "197 Nm", "250 Nm", "250 Nm", "220 Nm", "190 Nm", "260 Nm", "230 Nm"], winner: 9 },
        { label: "Best Mileage", values: ["21.8 kmpl", "20.8 kmpl", "16.92 kmpl", "27.97 kmpl", "27.97 kmpl", "19.66 kmpl", "19.87 kmpl", "17.8 kmpl", "18.7 kmpl", "20 kmpl", "19.1 kmpl"], winner: 3 }
      ]
    },
    {
      category: "Dimensions", metrics: [
        { label: "Length", values: ["4330 mm", "4460 mm", "4312 mm", "4345 mm", "4365 mm", "4225 mm", "4221 mm", "4323 mm", "4318 mm", "4370 mm", "4340 mm"], winner: 1 },
        { label: "Wheelbase", values: ["2610 mm", "2690 mm", "2650 mm", "2600 mm", "2600 mm", "2651 mm", "2651 mm", "2650 mm", "2670 mm", "2650 mm", "2656 mm"], winner: 1 },
        { label: "Ground Clearance", values: ["190 mm", "190 mm", "220 mm", "210 mm", "210 mm", "155 mm", "188 mm", "177 mm", "170 mm", "205 mm", "217 mm"], winner: 2 },
        { label: "Boot Space", values: ["433L", "433L", "458L", "373L", "373L", "385L", "385L", "375L", "315L", "622L", "421L"], winner: 9 }
      ]
    },
    {
      category: "Safety", metrics: [
        { label: "NCAP Rating", values: ["5★ GNCAP", "Not tested", "5★ JNCAP", "5★ GNCAP", "5★ GNCAP", "5★ GNCAP", "5★ GNCAP", "Not tested", "Not tested", "5★ BNCAP", "3★ Euro NCAP"], winner: -1 },
        { label: "Airbags", values: ["6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6"], winner: -1 },
        { label: "ADAS", values: ["✓", "✓", "✓", "✓", "✓", "✗", "✗", "✓", "✗", "✓", "✓"], winner: -1 },
        { label: "360° Camera", values: ["✓", "✓", "✗", "✓", "✓", "✗", "✗", "✓", "✗", "✓", "✗"], winner: -1 },
        { label: "All Disc Brakes", values: ["✓", "✓", "✓", "✓", "✓", "1.5 only", "✗", "Higher trim", "✗", "✓", "Top trim"], winner: -1 }
      ]
    },
    {
      category: "Features", metrics: [
        { label: "Panoramic Sunroof", values: ["✓", "✓ (Dual)", "✗", "✓", "✓", "✓", "✗", "✓", "✗", "✓ (Alpine)", "✓"], winner: -1 },
        { label: "Ventilated Seats", values: ["✓", "✓", "✗", "✓", "✓", "✓", "✓", "✓", "✗", "✓", "✗"], winner: -1 },
        { label: "Wireless Charging", values: ["✓", "✓", "✗", "✓", "✓", "✗", "✓", "✓", "✗", "✓", "✓"], winner: -1 },
        { label: "Rear Massage", values: ["✗", "✗", "✗", "✗", "✗", "✓", "✗", "✗", "✗", "✗", "✗"], winner: -1 },
        { label: "Connected Car", values: ["✓", "✓", "✓", "✓", "✓", "✓", "✓", "✓", "✗", "✓", "✓"], winner: -1 },
        { label: "Diesel Option", values: ["✓", "✓", "✗", "✗", "✗", "✗", "✗", "✗", "✗", "✓", "✗"], winner: -1 },
        { label: "Hybrid Option", values: ["✗", "✗", "✗", "✓", "✓", "✗", "✗", "✗", "✗", "✗", "✓ (Mild)"], winner: -1 },
        { label: "AWD Option", values: ["✗", "✗", "✗", "✓", "✓", "✗", "✗", "✗", "✗", "✗", "✓ (exp.)"], winner: -1 }
      ]
    }
  ],
  featureHeatmap: [
    { feature: "ADAS", values: ["available", "available", "available", "available", "available", "missing", "missing", "available", "missing", "available", "available"] },
    { feature: "360° Camera", values: ["available", "available", "missing", "available", "available", "missing", "missing", "available", "missing", "available", "missing"] },
    { feature: "Panoramic Sunroof", values: ["available", "available", "missing", "available", "available", "available", "missing", "available", "missing", "available", "available"] },
    { feature: "Ventilated Seats", values: ["available", "available", "missing", "available", "available", "available", "available", "available", "missing", "available", "missing"] },
    { feature: "Wireless Charging", values: ["available", "available", "missing", "available", "available", "missing", "available", "available", "missing", "available", "available"] },
    { feature: "Rear Massage", values: ["missing", "missing", "missing", "missing", "missing", "available", "missing", "missing", "missing", "missing", "missing"] },
    { feature: "Diesel Option", values: ["available", "available", "missing", "missing", "missing", "missing", "missing", "missing", "missing", "available", "missing"] },
    { feature: "Hybrid Option", values: ["missing", "missing", "missing", "available", "available", "missing", "missing", "missing", "missing", "missing", "partial"] },
    { feature: "Turbo Petrol", values: ["available", "available", "missing", "missing", "missing", "available", "available", "available", "available", "available", "available"] },
    { feature: "All Disc Brakes", values: ["available", "available", "available", "available", "available", "partial", "missing", "partial", "missing", "available", "partial"] },
    { feature: "Connected Car", values: ["available", "available", "available", "available", "available", "available", "available", "available", "missing", "available", "available"] },
    { feature: "AR HUD", values: ["missing", "missing", "missing", "missing", "missing", "missing", "missing", "missing", "missing", "available", "missing"] },
    { feature: "AWD Option", values: ["missing", "missing", "missing", "available", "available", "missing", "missing", "missing", "missing", "missing", "partial"] },
    { feature: "5-star NCAP", values: ["available", "missing", "available", "available", "available", "available", "available", "missing", "missing", "available", "missing"] }
  ],
  verdicts: [
    { icon: "🏆", category: "Best Overall", car: "Hyundai Creta", reason: "Most complete package — ADAS, diesel, turbo, 360° cam, best resale value. The segment benchmark since 2020." },
    { icon: "⚡", category: "Best Features", car: "Tata Sierra", reason: "AR HUD, triple screens, JBL Dolby Atmos, 622L boot, ADAS — the most feature-loaded car in this segment." },
    { icon: "🏎️", category: "Best Driving", car: "Skoda Kushaq / VW Taigun", reason: "TSI turbo engines deliver the best driving experience with German build quality and highway stability." },
    { icon: "💰", category: "Best Value", car: "MG Astor", reason: "ADAS, 360° cam, AI assistant, panoramic sunroof all available from ₹9.98L — best tech-per-rupee." },
    { icon: "🌿", category: "Best Efficiency", car: "Grand Vitara / Hyryder Hybrid", reason: "27.97 kmpl — unmatched fuel economy. The strong hybrid erases fuel cost anxiety completely." },
    { icon: "🔧", category: "Best Reliability", car: "Honda Elevate / Toyota Hyryder", reason: "Honda i-VTEC reliability + Toyota's proven hybrid tech = lowest long-term ownership costs." },
    { icon: "🏔️", category: "Best for Off-road", car: "Renault Duster", reason: "The Duster returns with AWD, 217mm GC, and legendary off-road DNA — a segment first since its absence." }
  ],
  personas: [
    { icon: "🛣️", label: "Highway Commuter", rec: "Skoda Kushaq / VW Taigun" },
    { icon: "✨", label: "Feature Seeker", rec: "Tata Sierra" },
    { icon: "👨‍👩‍👧‍👦", label: "All-rounder Family", rec: "Hyundai Creta" },
    { icon: "💻", label: "Tech Enthusiast", rec: "Kia Seltos / MG Astor" },
    { icon: "🌿", label: "Fuel Economy Focused", rec: "Grand Vitara / Hyryder Hybrid" },
    { icon: "🛡️", label: "Reliability Focused", rec: "Honda Elevate / Toyota Hyryder" },
    { icon: "🏔️", label: "Weekend Adventurer", rec: "Renault Duster" },
    { icon: "💵", label: "Budget Smart Buyer", rec: "MG Astor / C3 Aircross" }
  ],
  sources: [
    { name: "CarWale", url: "https://www.carwale.com/" },
    { name: "CarDekho", url: "https://www.cardekho.com/" },
    { name: "V3Cars", url: "https://www.v3cars.com/" },
    { name: "Autocar India", url: "https://www.autocarindia.com/" },
    { name: "Hyundai India", url: "https://www.hyundai.com/in/en/find-a-car/creta/price" },
    { name: "Kia India", url: "https://www.kia.com/in/our-vehicles/seltos/showroom.html" },
    { name: "Tata Motors", url: "https://cars.tatamotors.com/sierra/ice.html" },
    { name: "Honda India", url: "https://www.hondacarindia.com/honda-elevate" },
    { name: "Volkswagen India", url: "https://www.volkswagen.co.in/en/models/taigun.html" },
    { name: "Skoda India", url: "https://www.skoda-auto.co.in/models/kushaq/kushaq" },
    { name: "Maruti Suzuki", url: "https://www.marutisuzuki.com/grand-vitara" },
    { name: "Toyota India", url: "https://www.toyotabharat.com/models/urban-cruiser-hyryder" },
    { name: "MG Motor India", url: "https://www.mgmotor.co.in/vehicles/astor" },
    { name: "Citroën India", url: "https://www.citroen.in/c3-aircross" },
    { name: "Renault India", url: "https://www.renault.co.in" }
  ]
};
