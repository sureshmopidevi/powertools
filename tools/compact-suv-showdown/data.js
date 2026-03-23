// =========================================
// DATA
// =========================================
const DATA = {
  cars: [
    {
      name: "Skoda Kushaq", short: "Kushaq", brand: "Skoda", year: "2026 Facelift",
      color: "#4ba82e", priceMin: 10.69, priceMax: 18.99,
      maxPower: 150, maxTorque: 250, bestMileage: 19.66, gc: 155, boot: 385,
      ncap: 5, ncapBody: "GNCAP", airbags: 6,
      adas: false, cam360: false, allDisc: false, discNote: "1.5 only",
      fuelOptions: ["Petrol"],
      engines: [
        { name: "1.0 TSI", cc: 999, power: 115, torque: 178, trans: "6-MT / 8-AT", mileage: "19.09–19.66 kmpl" },
        { name: "1.5 TSI", cc: 1498, power: 150, torque: 250, trans: "7-DSG", mileage: "18.72 kmpl" }
      ],
      pros: ["Turbo engine fun-to-drive", "5-star GNCAP safety", "Rear massage seats", "New 8-speed AT smooth", "Loaded base variant"],
      cons: ["No ADAS in any variant", "No 360° camera", "No diesel", "No wireless charging", "Low ground clearance (155mm)"],
      badge: null
    },
    {
      name: "Hyundai Creta", short: "Creta", brand: "Hyundai", year: "2024 (New Gen)",
      color: "#002c5f", priceMin: 10.79, priceMax: 20.20,
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
      cons: ["Crowded variant lineup confusing", "Top variants expensive (₹20L+)", "NA petrol engine feels weak", "Turbo only with DCT"],
      badge: "Best Mileage"
    },
    {
      name: "Kia Seltos", short: "Seltos", brand: "Kia", year: "2026 (New Gen)",
      color: "#bb162b", priceMin: 10.99, priceMax: 19.99,
      maxPower: 158, maxTorque: 253, bestMileage: 20.8, gc: 190, boot: 433,
      ncap: 0, ncapBody: "Not tested", airbags: 6,
      adas: true, cam360: true, allDisc: true, discNote: "All variants",
      fuelOptions: ["Petrol", "Diesel", "Turbo Petrol"],
      engines: [
        { name: "1.5 NA Petrol", cc: 1497, power: 115, torque: 144, trans: "6-MT / IVT", mileage: "17.7 kmpl" },
        { name: "1.5 Diesel", cc: 1493, power: 116, torque: 250, trans: "6-MT / 6-AT", mileage: "19.7–20.8 kmpl" },
        { name: "1.5 Turbo GDi", cc: 1482, power: 158, torque: 253, trans: "6-iMT / 7-DCT", mileage: "18.3 kmpl" }
      ],
      pros: ["ADAS Level 2+", "Best-in-class infotainment (12.3-inch)", "Bose audio", "Turbo iMT option", "Longest in segment", "Premium cabin"],
      cons: ["New gen untested NCAP", "Complex variant naming", "Top variants near ₹20L", "iMT has learning curve"],
      badge: null
    },
    {
      name: "VW Taigun", short: "Taigun", brand: "Volkswagen", year: "2025 (Updated)",
      color: "#001e50", priceMin: 10.58, priceMax: 19.19,
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
      name: "Honda Elevate", short: "Elevate", brand: "Honda", year: "2024",
      color: "#cc0000", priceMin: 11.64, priceMax: 16.67,
      maxPower: 121, maxTorque: 145, bestMileage: 16.92, gc: 220, boot: 458,
      ncap: 5, ncapBody: "JNCAP", airbags: 6,
      adas: true, cam360: false, allDisc: true, discNote: "All variants",
      fuelOptions: ["Petrol"],
      engines: [
        { name: "1.5 i-VTEC", cc: 1498, power: 121, torque: 145, trans: "6-MT / CVT", mileage: "15.31–16.92 kmpl" }
      ],
      pros: ["Honda ADAS", "Best ground clearance (220mm)", "Honda reliability & low maintenance", "Spacious cabin", "Largest boot (458L)", "All-disc brakes"],
      cons: ["Underpowered NA engine", "No turbo/diesel", "No panoramic sunroof", "Missing premium features", "Below-average mileage"],
      badge: "Best GC"
    },
    {
      name: "Tata Sierra", short: "Sierra", brand: "Tata", year: "2026 (New)",
      color: "#1c3c6b", priceMin: 11.49, priceMax: 21.29,
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
      cons: ["Long waiting periods", "Top variants over ₹21L", "NA petrol underpowered", "Tata service quality inconsistent", "Heavier than rivals"],
      badge: "Best Boot"
    }
  ],
  comparisonMatrix: [
    {
      category: "Price", metrics: [
        { label: "Starting Price", values: ["₹10.69L", "₹10.79L", "₹10.99L", "₹10.58L", "₹11.64L", "₹11.49L"], winner: 3 },
        { label: "Top Variant Price", values: ["₹18.99L", "₹20.20L", "₹19.99L", "₹19.19L", "₹16.67L", "₹21.29L"], winner: 4 }
      ]
    },
    {
      category: "Performance", metrics: [
        { label: "Max Power", values: ["150 PS", "160 PS", "158 PS", "150 PS", "121 PS", "158 PS"], winner: 1 },
        { label: "Max Torque", values: ["250 Nm", "253 Nm", "253 Nm", "250 Nm", "145 Nm", "260 Nm"], winner: 5 },
        { label: "Best Mileage", values: ["19.66 kmpl", "21.8 kmpl", "20.8 kmpl", "19.87 kmpl", "16.92 kmpl", "20 kmpl"], winner: 1 }
      ]
    },
    {
      category: "Dimensions", metrics: [
        { label: "Length", values: ["4225 mm", "4330 mm", "4460 mm", "4221 mm", "4312 mm", "4370 mm"], winner: 2 },
        { label: "Wheelbase", values: ["2651 mm", "2610 mm", "2690 mm", "2651 mm", "2650 mm", "2650 mm"], winner: 2 },
        { label: "Ground Clearance", values: ["155 mm", "190 mm", "190 mm", "188 mm", "220 mm", "205 mm"], winner: 4 },
        { label: "Boot Space", values: ["385L", "433L", "433L", "385L", "458L", "622L"], winner: 5 }
      ]
    },
    {
      category: "Safety", metrics: [
        { label: "NCAP Rating", values: ["5★ GNCAP", "5★ GNCAP", "Not tested", "5★ GNCAP", "5★ JNCAP", "5★ BNCAP"], winner: -1 },
        { label: "Airbags", values: ["6", "6", "6", "6", "6", "6"], winner: -1 },
        { label: "ADAS", values: ["✗", "✓", "✓", "✗", "✓", "✓"], winner: -1 },
        { label: "360° Camera", values: ["✗", "✓", "✓", "✗", "✗", "✓"], winner: -1 },
        { label: "All Disc Brakes", values: ["1.5 only", "✓", "✓", "✗", "✓", "✓"], winner: -1 }
      ]
    },
    {
      category: "Features", metrics: [
        { label: "Panoramic Sunroof", values: ["✓", "✓", "✓ (Dual)", "✗", "✗", "✓ (Alpine)"], winner: -1 },
        { label: "Ventilated Seats", values: ["✓", "✓", "✓", "✓", "✗", "✓"], winner: -1 },
        { label: "Wireless Charging", values: ["✗", "✓", "✓", "✓", "✗", "✓"], winner: -1 },
        { label: "Rear Massage", values: ["✓", "✗", "✗", "✗", "✗", "✗"], winner: -1 },
        { label: "Connected Car", values: ["✓", "✓", "✓", "✓", "✓", "✓"], winner: -1 },
        { label: "Diesel Option", values: ["✗", "✓", "✓", "✗", "✗", "✓"], winner: -1 },
        { label: "Turbo Petrol", values: ["✓", "✓", "✓", "✓", "✗", "✓"], winner: -1 }
      ]
    }
  ],
  featureHeatmap: [
    { feature: "ADAS", values: ["missing", "available", "available", "missing", "available", "available"] },
    { feature: "360° Camera", values: ["missing", "available", "available", "missing", "missing", "available"] },
    { feature: "Panoramic Sunroof", values: ["available", "available", "available", "missing", "missing", "available"] },
    { feature: "Ventilated Seats", values: ["available", "available", "available", "available", "missing", "available"] },
    { feature: "Wireless Charging", values: ["missing", "available", "available", "available", "missing", "available"] },
    { feature: "Rear Massage", values: ["available", "missing", "missing", "missing", "missing", "missing"] },
    { feature: "Diesel Option", values: ["missing", "available", "available", "missing", "missing", "available"] },
    { feature: "Turbo Petrol", values: ["available", "available", "available", "available", "missing", "available"] },
    { feature: "All Disc Brakes", values: ["partial", "available", "available", "missing", "available", "available"] },
    { feature: "Connected Car", values: ["available", "available", "available", "available", "available", "available"] },
    { feature: "AR HUD", values: ["missing", "missing", "missing", "missing", "missing", "available"] },
    { feature: "Dual-zone AC", values: ["missing", "available", "available", "missing", "missing", "available"] }
  ],
  verdicts: [
    { icon: "🏆", category: "Best Overall", car: "Hyundai Creta", reason: "Most complete package — ADAS, diesel, turbo, 360° cam, best resale value. The segment benchmark." },
    { icon: "⚡", category: "Best Features", car: "Tata Sierra", reason: "AR HUD, triple screens, JBL Dolby Atmos, 622L boot, ADAS — most feature-loaded car here." },
    { icon: "🏎️", category: "Best Driving", car: "Skoda Kushaq / VW Taigun", reason: "TSI turbo engines deliver the best driving experience. German build quality and highway stability." },
    { icon: "💰", category: "Best Value", car: "Kia Seltos", reason: "ADAS + 12.3-inch screens + Bose audio + turbo iMT — loads of tech for the money." },
    { icon: "🔧", category: "Best Reliability", car: "Honda Elevate", reason: "Honda's proven i-VTEC reliability, lowest maintenance costs, ADAS standard. But misses on power and features." },
    { icon: "📦", category: "Best Practical", car: "Tata Sierra", reason: "Largest boot (622L), highest ground clearance after Elevate, 3 engine options, ADAS." }
  ],
  personas: [
    { icon: "🛣️", label: "Highway Commuter", rec: "Skoda Kushaq / VW Taigun" },
    { icon: "✨", label: "Feature Seeker", rec: "Tata Sierra" },
    { icon: "👨‍👩‍👧‍👦", label: "All-rounder Family", rec: "Hyundai Creta" },
    { icon: "💻", label: "Tech Enthusiast", rec: "Kia Seltos" },
    { icon: "🛡️", label: "Reliability Focused", rec: "Honda Elevate" }
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
    { name: "Skoda India", url: "https://www.skoda-auto.co.in/models/kushaq/kushaq" }
  ]
};
