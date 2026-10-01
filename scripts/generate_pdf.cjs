/**
 * Atmo SHEILD - 7-Page A4 Presentation PDF Generator
 * Uses jsPDF to create a high-fidelity, beautifully formatted 7-page A4 document.
 */

const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

function createAtmoShieldPDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 16;
  const contentWidth = pageWidth - 2 * marginX;

  // Helper colors
  const emeraldDark = [4, 120, 87];      // #047857
  const emeraldLight = [209, 250, 229];  // #d1fae5
  const slateDark = [15, 23, 42];        // #0f172a
  const slateGray = [100, 116, 139];     // #64748b
  const slateLight = [248, 250, 252];    // #f8fafc
  const amberDark = [180, 83, 9];        // #b45309
  const amberLight = [254, 243, 199];    // #fef3c7
  const roseDark = [225, 29, 72];        // #e11d48
  const roseLight = [255, 228, 230];     // #ffe4e6

  function drawHeader(pageNum, categoryTitle) {
    // Top emerald line
    doc.setFillColor(...emeraldDark);
    doc.rect(0, 0, pageWidth, 5, 'F');

    // Header banner
    doc.setFillColor(...slateLight);
    doc.rect(marginX, 10, contentWidth, 14, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(marginX, 10, contentWidth, 14, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...emeraldDark);
    doc.text('ATMO SHEILD', marginX + 4, 19);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...slateGray);
    doc.text('|   AI Air Pollution & Health Advisory System', marginX + 33, 19);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...slateDark);
    doc.text(`PAGE 0${pageNum} / 07  •  ${categoryTitle.toUpperCase()}`, pageWidth - marginX - 4, 19, { align: 'right' });
  }

  function drawFooter(pageNum) {
    // Bottom border line
    doc.setDrawColor(226, 232, 240);
    doc.line(marginX, pageHeight - 14, pageWidth - marginX, pageHeight - 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...slateGray);
    doc.text('Atmo SHEILD Technical Presentation & Architecture Whitepaper  •  Confidential', marginX, pageHeight - 9);
    doc.text(`Page ${pageNum} of 7`, pageWidth - marginX, pageHeight - 9, { align: 'right' });
  }

  // ==========================================
  // PAGE 1: TITLE & EXECUTIVE OVERVIEW
  // ==========================================
  drawHeader(1, 'Executive Overview');

  // Title Box
  doc.setFillColor(...emeraldLight);
  doc.roundedRect(marginX, 30, contentWidth, 42, 3, 3, 'F');
  doc.setDrawColor(...emeraldDark);
  doc.roundedRect(marginX, 30, contentWidth, 42, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...emeraldDark);
  doc.text('Atmo SHEILD', marginX + 8, 44);

  doc.setFontSize(13);
  doc.setTextColor(...slateDark);
  doc.text('AI Air Pollution & Health Advisory System', marginX + 8, 53);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(5, 150, 105);
  doc.text('"Breathe smarter. Understand your air."', marginX + 8, 62);

  // Section 1: Executive Summary
  let y = 80;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...slateDark);
  doc.text('1. Executive Summary & Vision', marginX, y);

  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const p1Text = 'Atmo SHEILD is an intelligent environmental telemetry platform engineered to translate raw atmospheric data into understandable, proactive human health actions. Designed to address the global crisis of airborne particulate exposure, the application combines open meteorological models, physical IoT sensor detectors, an intuitive 3-tier circular AQI meter, neighborhood station mapping, and automated AI health advisories customized across 7 distinct physiological vulnerability cohorts.';
  doc.text(doc.splitTextToSize(p1Text, contentWidth), marginX, y);

  // Section 2: The Problem vs The Solution
  y += 26;
  const boxW = (contentWidth - 6) / 2;

  // The Problem Card
  doc.setFillColor(254, 242, 242);
  doc.roundedRect(marginX, y, boxW, 58, 2, 2, 'F');
  doc.setDrawColor(...roseDark);
  doc.roundedRect(marginX, y, boxW, 58, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...roseDark);
  doc.text('THE PROBLEM', marginX + 5, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const probText = [
    '• Ambient particulate matter (PM2.5, PM10) causes millions of premature pulmonary and cardiovascular complications annually.',
    '• Standard weather services display isolated numerical indices (e.g., "AQI 142") with zero health translation.',
    '• High-risk groups (children, seniors, asthmatics) lack actionable, physiology-specific precautions.'
  ];
  let py = y + 15;
  probText.forEach(line => {
    const split = doc.splitTextToSize(line, boxW - 10);
    doc.text(split, marginX + 5, py);
    py += split.length * 4.2 + 2;
  });

  // The Solution Card
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(marginX + boxW + 6, y, boxW, 58, 2, 2, 'F');
  doc.setDrawColor(...emeraldDark);
  doc.roundedRect(marginX + boxW + 6, y, boxW, 58, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...emeraldDark);
  doc.text('THE SOLUTION', marginX + boxW + 11, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const solText = [
    '• Universal 3-tier classification: LOW (0-50), MEDIUM (51-100), and HIGH (>100) with clear layman definitions.',
    '• Contextual AI health advisory tailored to 7 sensitivity groups (General, Kids, Seniors, Respiratory, Athletes, Workers, Farming).',
    '• Dual telemetry architecture bridging physical IoT laser sensors and global atmospheric model APIs.'
  ];
  let sy = y + 15;
  solText.forEach(line => {
    const split = doc.splitTextToSize(line, boxW - 10);
    doc.text(split, marginX + boxW + 11, sy);
    sy += split.length * 4.2 + 2;
  });

  // Section 3: Core Innovation Pillars
  y += 68;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...slateDark);
  doc.text('2. Core Platform Capabilities', marginX, y);

  y += 6;
  const pillarW = (contentWidth - 8) / 5;
  const pillars = [
    { title: 'Real-Time AQI', desc: '7 Pollutants & Weather telemetry' },
    { title: 'Local Stations', desc: 'A-Z Search & GPS Leaflet map' },
    { title: '3-Tier Gauge', desc: 'Circular SVG color-sweep meter' },
    { title: 'AI Advisory', desc: '7 physiological precaution groups' },
    { title: 'Air History', desc: 'Weekly & Monthly verified trends' }
  ];

  pillars.forEach((p, idx) => {
    const px = marginX + idx * (pillarW + 2);
    doc.setFillColor(...slateLight);
    doc.roundedRect(px, y, pillarW, 30, 2, 2, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(px, y, pillarW, 30, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...emeraldDark);
    doc.text(p.title, px + pillarW / 2, y + 9, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...slateGray);
    const splitDesc = doc.splitTextToSize(p.desc, pillarW - 4);
    doc.text(splitDesc, px + pillarW / 2, y + 16, { align: 'center' });
  });

  drawFooter(1);

  // ==========================================
  // PAGE 2: CODING LANGUAGES & TECHNOLOGY STACK
  // ==========================================
  doc.addPage();
  drawHeader(2, 'Technology Stack & Coding Languages');

  y = 30;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...slateDark);
  doc.text('Coding Languages & Technologies Used', marginX, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...slateGray);
  doc.text('Atmo SHEILD implements a production-grade decoupled architecture with a Python backend and TypeScript React frontend.', marginX, y);

  y += 10;
  const techStack = [
    {
      name: 'PYTHON (Python 3.10)',
      role: 'Backend Core & REST API',
      color: emeraldDark,
      details: [
        'Used for core logic in app.py and services (aqi_service.py, weather_service.py, location_service.py, health_advisory.py, history_service.py, database.py).',
        'Flask framework provides REST API endpoints (/api/aqi, /api/nearby, /api/advisory, /api/history).',
        'Handles sensor packet processing, Haversine spherical distance calculations, and rolling statistical models.'
      ]
    },
    {
      name: 'SQL (SQLite3)',
      role: 'Database & Relational Persistence',
      color: [14, 116, 144], // Cyan
      details: [
        'ACID-compliant relational database located at database/aqi_history.db.',
        'Structured tables: aqi_readings (telemetry), locations (geo-coordinates), and user_profiles.',
        'Powers 30-day historical time-series analytics and period-over-period trend validation queries.'
      ]
    },
    {
      name: 'TYPESCRIPT (TypeScript 5.8)',
      role: 'Type-Safe Frontend Interface',
      color: [37, 99, 235], // Blue
      details: [
        'Component development with strict interfaces (AirQualityData, LocationItem, HealthAdvisory, MonthlyHistory).',
        'Eliminates runtime null reference errors during environmental sensor and telemetry parsing.',
        'React 19 hooks manage state synchronization across maps, gauges, and dynamic health advisory selectors.'
      ]
    },
    {
      name: 'JAVASCRIPT (ES2022)',
      role: 'Client Execution & Map Drivers',
      color: [202, 138, 4], // Yellow
      details: [
        'Executes browser Geolocation API handlers and asynchronous fetch pipelines.',
        'Drives Leaflet.js interactive OpenStreetMap tile caching and marker events.',
        'Standalone static script bundled in static/js/script.js for direct Jinja view execution.'
      ]
    },
    {
      name: 'HTML5 & CSS3 / TAILWIND CSS v4',
      role: 'Accessible Markup & Modern Design System',
      color: [13, 148, 136], // Teal
      details: [
        'Semantic HTML5 structure with W3C web accessibility guidelines and OpenGraph metadata.',
        'Tailwind CSS v4 utility architecture featuring soft glassmorphism, responsive grids, and zero-pill discipline.',
        'Dynamic CSS animations for the 240-degree SVG circular AQI meter and subtle atmospheric flow effects.'
      ]
    }
  ];

  techStack.forEach(t => {
    doc.setFillColor(...slateLight);
    doc.roundedRect(marginX, y, contentWidth, 34, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(marginX, y, contentWidth, 34, 2, 2, 'S');

    doc.setFillColor(...t.color);
    doc.rect(marginX, y, 3, 34, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...t.color);
    doc.text(t.name, marginX + 7, y + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...slateDark);
    doc.text(t.role, pageWidth - marginX - 6, y + 7, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(71, 85, 105);
    let dy = y + 13;
    t.details.forEach(item => {
      const split = doc.splitTextToSize(`• ${item}`, contentWidth - 14);
      doc.text(split, marginX + 7, dy);
      dy += split.length * 3.8 + 1.2;
    });

    y += 38;
  });

  drawFooter(2);

  // ==========================================
  // PAGE 3: SENSOR TELEMETRY & 3-TIER AQI METER
  // ==========================================
  doc.addPage();
  drawHeader(3, 'Sensor Telemetry & 3-Tier AQI');

  y = 30;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...slateDark);
  doc.text('Live AQI, Weather & 3-Tier Classification', marginX, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...slateGray);
  doc.text('Atmo SHEILD integrates dual telemetry feeds with an intuitive 3-tier visual gauge and zero-synthetic data policy.', marginX, y);

  // 3-Tier Cards
  y += 10;
  const tierW = (contentWidth - 6) / 3;

  const tiers = [
    {
      level: 'LOW (0 - 50 AQI)',
      badge: '🟢 CLEAN AIR',
      color: emeraldDark,
      bg: emeraldLight,
      desc: 'Air quality is relatively good. Atmospheric particulates are well within safe thresholds. Optimal for all school recess, senior morning walks, and marathon training.'
    },
    {
      level: 'MEDIUM (51 - 100 AQI)',
      badge: '🟡 MODERATE',
      color: amberDark,
      bg: amberLight,
      desc: 'Moderate pollution. May affect sensitive individuals (asthma, COPD, children) during prolonged outdoor exposure. Consider pacing cardio workouts away from heavy traffic.'
    },
    {
      level: 'HIGH (> 100 AQI)',
      badge: '🔴 ELEVATED RISK',
      color: roseDark,
      bg: roseLight,
      desc: 'Significant particulate burden. Everyone may experience adverse health effects. Sensitive cohorts should stay indoors with HEPA filtration; wear N95 respirators if outside.'
    }
  ];

  tiers.forEach((tier, i) => {
    const tx = marginX + i * (tierW + 3);
    doc.setFillColor(...tier.bg);
    doc.roundedRect(tx, y, tierW, 55, 2, 2, 'F');
    doc.setDrawColor(...tier.color);
    doc.roundedRect(tx, y, tierW, 55, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...tier.color);
    doc.text(tier.badge, tx + tierW / 2, y + 8, { align: 'center' });

    doc.setFontSize(10.5);
    doc.setTextColor(...slateDark);
    doc.text(tier.level, tx + tierW / 2, y + 16, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(51, 65, 85);
    const splitDesc = doc.splitTextToSize(tier.desc, tierW - 8);
    doc.text(splitDesc, tx + 4, y + 24);
  });

  // 7 Monitored Pollutants & Weather Grid
  y += 64;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...slateDark);
  doc.text('Monitored Environmental Parameters', marginX, y);

  y += 6;
  const params = [
    { name: 'PM2.5', desc: 'Fine respirable soot ≤ 2.5µm' },
    { name: 'PM10', desc: 'Inhalable coarse dust ≤ 10µm' },
    { name: 'CO', desc: 'Carbon Monoxide (mg/m³)' },
    { name: 'NO2', desc: 'Nitrogen Dioxide from traffic' },
    { name: 'SO2', desc: 'Sulfur Dioxide from industry' },
    { name: 'O3', desc: 'Ground-level Photochemical Ozone' },
    { name: 'Temperature', desc: 'Ambient thermal gradient (°C)' },
    { name: 'Humidity & Wind', desc: 'Atmospheric dispersion factor' }
  ];

  const colW = (contentWidth - 6) / 4;
  params.forEach((param, idx) => {
    const col = idx % 4;
    const row = Math.floor(idx / 4);
    const px = marginX + col * (colW + 2);
    const py = y + row * 22;

    doc.setFillColor(...slateLight);
    doc.roundedRect(px, py, colW, 19, 1.5, 1.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(px, py, colW, 19, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...emeraldDark);
    doc.text(param.name, px + 3, py + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...slateGray);
    doc.text(param.desc, px + 3, py + 12);
  });

  // Telemetry Policy Note
  y += 54;
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(marginX, y, contentWidth, 26, 2, 2, 'F');
  doc.setDrawColor(...emeraldDark);
  doc.roundedRect(marginX, y, contentWidth, 26, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...emeraldDark);
  doc.text('Strict Zero-Synthetic Data Protocol', marginX + 6, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const polText = 'In strict compliance with environmental health reliability standards, if live IoT sensor telemetry or atmospheric station endpoints are unreachable, Atmo SHEILD displays "Data unavailable" with clear diagnostics instead of fabricating simulated numbers.';
  doc.text(doc.splitTextToSize(polText, contentWidth - 12), marginX + 6, y + 13);

  drawFooter(3);

  // ==========================================
  // PAGE 4: GEOSPATIAL SEARCH & NEIGHBORHOOD MAPPING
  // ==========================================
  doc.addPage();
  drawHeader(4, 'Geospatial Search & Mapping');

  y = 30;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...slateDark);
  doc.text('Omni-Search Engine & Interactive Station Map', marginX, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...slateGray);
  doc.text('Combines real-time autocompletion, global geocoding, A-Z filtering, and Leaflet OpenStreetMap telemetry.', marginX, y);

  y += 10;
  const features = [
    {
      title: '1. Debounced Omni-Search Bar (Fixed & Enhanced)',
      desc: 'Users can search local pre-loaded stations (Master Canteen, Janpath Road, Kalpana Square, Khandagiri, Patia) as well as any city globally (Paris, Tokyo, New York, Delhi). Features live dropdown suggestions with distance tags, clear button, and keyboard Enter/Escape support.'
    },
    {
      title: '2. Strict Alphabetical Order (A-Z) Dropdown',
      desc: 'Synchronized select element sorting all monitoring hubs alphabetically from Bengaluru to Tokyo, enabling rapid non-typing navigation for mobile and tablet users.'
    },
    {
      title: '3. Browser GPS Geolocation with Haversine Math',
      desc: 'One-click position detection calculates spherical kilometer distance to all regional stations using the Haversine equation: d = 2R · atan2(√a, √(1-a)), dynamically snapping the user to their closest monitoring sensor.'
    },
    {
      title: '4. Interactive Leaflet OpenStreetMap Layer',
      desc: 'Dynamic interactive map rendering color-coded live AQI pins (🟢 Low, 🟡 Med, 🔴 High). Clicking any marker or station card immediately refreshes the active dashboard, weather parameters, and AI health advisory.'
    }
  ];

  features.forEach(f => {
    doc.setFillColor(...slateLight);
    doc.roundedRect(marginX, y, contentWidth, 30, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(marginX, y, contentWidth, 30, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...emeraldDark);
    doc.text(f.title, marginX + 6, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const split = doc.splitTextToSize(f.desc, contentWidth - 12);
    doc.text(split, marginX + 6, y + 14);

    y += 34;
  });

  // Pre-loaded Stations Table
  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...slateDark);
  doc.text('Sample Regional Stations Telemetry (Bhubaneswar Hub)', marginX, y);

  y += 5;
  const stationRows = [
    ['Station Name', 'Area / Sector', 'Coordinates', 'AQI Index', 'Level Status'],
    ['Master Canteen', 'Station Square, Bhubaneswar', '20.2644° N, 85.8394° E', '85 AQI', 'MEDIUM 🟡'],
    ['Janpath Road', 'Commercial Corridor', '20.2818° N, 85.8436° E', '78 AQI', 'MEDIUM 🟡'],
    ['Kalpana Square', 'South Junction', '20.2520° N, 85.8378° E', '110 AQI', 'HIGH 🔴'],
    ['Patia IT Corridor', 'North Tech Zone', '20.3588° N, 85.8164° E', '48 AQI', 'LOW 🟢']
  ];

  stationRows.forEach((row, rIdx) => {
    const isHead = rIdx === 0;
    doc.setFillColor(isHead ? 226 : (rIdx % 2 === 0 ? 255 : 248), isHead ? 232 : (rIdx % 2 === 0 ? 255 : 250), isHead ? 240 : (rIdx % 2 === 0 ? 255 : 252));
    doc.rect(marginX, y, contentWidth, 7, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(marginX, y, contentWidth, 7, 'S');

    doc.setFont('helvetica', isHead ? 'bold' : 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(isHead ? 15 : 71, isHead ? 23 : 85, isHead ? 42 : 105);

    const widths = [38, 50, 44, 22, 24];
    let cx = marginX + 2;
    row.forEach((cell, cIdx) => {
      doc.text(cell, cx, y + 4.8);
      cx += widths[cIdx];
    });
    y += 7;
  });

  drawFooter(4);

  // ==========================================
  // PAGE 5: AI HEALTH ADVISORY & PHYSIOLOGY
  // ==========================================
  doc.addPage();
  drawHeader(5, 'AI Health Advisory Engine');

  y = 30;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...slateDark);
  doc.text('Contextual AI Health Advisory System', marginX, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...slateGray);
  doc.text('Evaluates real-time pollutants and meteorological variables to generate customized guidance across 7 cohorts.', marginX, y);

  // 7 Sensitivity Cohorts Grid
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...slateDark);
  doc.text('7 Physiological Sensitivity Cohorts', marginX, y);

  y += 5;
  const cohorts = [
    { title: 'General Public', sub: 'Baseline cellular health; standard hydration & ventilation routines.' },
    { title: 'Children', sub: 'Developing alveoli; higher respiratory air intake per kg body weight.' },
    { title: 'Elderly (65+)', sub: 'Aging cardiovascular defenses; particulate stroke & ischemic risks.' },
    { title: 'Respiratory-Sensitive', sub: 'Asthma, COPD, allergies; prevention of acute bronchospasms.' },
    { title: 'Outdoor / Sports', sub: 'High-ventilation endurance training; deep alveolar soot mitigation.' },
    { title: 'Outdoor Workers', sub: 'Construction & traffic crews; extended shifts & N95 shift rotation.' },
    { title: 'Farming & Pets', sub: 'Trough water cleanliness, livestock plume shelter, domestic pets.' }
  ];

  cohorts.forEach((c, idx) => {
    const cy = y + idx * 11;
    doc.setFillColor(...slateLight);
    doc.roundedRect(marginX, cy, contentWidth, 9.5, 1, 1, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(marginX, cy, contentWidth, 9.5, 1, 1, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...emeraldDark);
    doc.text(`• ${c.title}:`, marginX + 3, cy + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(c.sub, marginX + 38, cy + 6);
  });

  // What to Do & What Not to Do Cards
  y += 84;
  const actW = (contentWidth - 6) / 2;

  // What to Do Card
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(marginX, y, actW, 60, 2, 2, 'F');
  doc.setDrawColor(...emeraldDark);
  doc.roundedRect(marginX, y, actW, 60, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...emeraldDark);
  doc.text('WHAT TO DO', marginX + 5, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  const dos = [
    '• Stay hydrated to keep respiratory mucus membranes moist and resilient.',
    '• Wear snug-fitted N95 / KN95 particulate respirators when AQI exceeds 100.',
    '• Seal indoor windows and operate HEPA purifiers during peak morning traffic.',
    '• Check Atmo SHEILD hourly trend curves before planning outdoor departures.',
    '• Move cardio training indoors when elevated particulates are detected.'
  ];
  let dy1 = y + 14;
  dos.forEach(d => {
    const split = doc.splitTextToSize(d, actW - 8);
    doc.text(split, marginX + 5, dy1);
    dy1 += split.length * 3.8 + 2;
  });

  // What Not to Do Card
  doc.setFillColor(254, 242, 242);
  doc.roundedRect(marginX + actW + 6, y, actW, 60, 2, 2, 'F');
  doc.setDrawColor(...roseDark);
  doc.roundedRect(marginX + actW + 6, y, actW, 60, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...roseDark);
  doc.text('WHAT NOT TO DO', marginX + actW + 11, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  const donts = [
    '• Avoid unnecessary prolonged outdoor exposure during high pollution.',
    '• Avoid strenuous aerobic workouts along arterial highway corridors.',
    '• Avoid burning trash, leaves, or agricultural biomass.',
    '• Avoid unventilated indoor smoking, frying, or heavy incense burning.',
    '• Never ignore severe municipal air pollution alerts or symptoms.'
  ];
  let dy2 = y + 14;
  donts.forEach(d => {
    const split = doc.splitTextToSize(d, actW - 8);
    doc.text(split, marginX + actW + 11, dy2);
    dy2 += split.length * 3.8 + 2;
  });

  // Medical Disclaimer
  y += 65;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(...slateGray);
  doc.text('Medical Disclaimer: Atmo SHEILD provides general environmental wellness guidance based on WHO/EPA ambient standards and does not diagnose, treat, or replace professional medical advice.', marginX, y);

  drawFooter(5);

  // ==========================================
  // PAGE 6: HISTORICAL RECAP & TREND VERIFICATION
  // ==========================================
  doc.addPage();
  drawHeader(6, 'Historical Analytics & Trends');

  y = 30;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...slateDark);
  doc.text('Weekly & Monthly Pollution Trend Engine', marginX, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...slateGray);
  doc.text('Time-series analysis using SQLite database logs, rolling arithmetic averages, and verified comparisons.', marginX, y);

  // Weekly Recap Box
  y += 10;
  doc.setFillColor(...slateLight);
  doc.roundedRect(marginX, y, contentWidth, 48, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(marginX, y, contentWidth, 48, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...emeraldDark);
  doc.text('WEEKLY RECAP (7-DAY ROLLING METRICS)', marginX + 6, y + 8);

  const wMetrics = [
    { label: 'Average AQI', val: '82 AQI', sub: '7-day mean' },
    { label: 'Lowest Day', val: '45 AQI', sub: 'Pruned clean air' },
    { label: 'Highest Peak', val: '142 AQI', sub: 'Episode spike' },
    { label: 'Category Count', val: '2 Low / 4 Med / 1 High', sub: 'Days distribution' },
    { label: 'Average PM2.5', val: '34.4 µg/m³', sub: 'Ambient burden' }
  ];

  const wColW = (contentWidth - 12) / 5;
  wMetrics.forEach((m, i) => {
    const mx = marginX + 6 + i * wColW;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...slateGray);
    doc.text(m.label, mx, y + 17);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...slateDark);
    doc.text(m.val, mx, y + 25);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(100, 116, 139);
    doc.text(m.sub, mx, y + 31);
  });

  // Monthly Recap Box
  y += 54;
  doc.setFillColor(...slateLight);
  doc.roundedRect(marginX, y, contentWidth, 48, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(marginX, y, contentWidth, 48, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...emeraldDark);
  doc.text('MONTHLY RECAP (30-DAY OBSERVATIONS)', marginX + 6, y + 8);

  const mMetrics = [
    { label: 'Monthly Mean', val: '86 AQI', sub: 'September average' },
    { label: 'Lowest Day', val: '48 AQI', sub: 'September 15' },
    { label: 'Highest Day', val: '114 AQI', sub: 'September 20' },
    { label: 'High-AQI Days', val: '3 Days', sub: 'Exceeded AQI 100' },
    { label: 'Trend Direction', val: 'Improved', sub: '-6 pts vs August' }
  ];

  mMetrics.forEach((m, i) => {
    const mx = marginX + 6 + i * wColW;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...slateGray);
    doc.text(m.label, mx, y + 17);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...slateDark);
    doc.text(m.val, mx, y + 25);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(100, 116, 139);
    doc.text(m.sub, mx, y + 31);
  });

  // Strict Verification Principle
  y += 54;
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(marginX, y, contentWidth, 34, 2, 2, 'F');
  doc.setDrawColor(...emeraldDark);
  doc.roundedRect(marginX, y, contentWidth, 34, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...emeraldDark);
  doc.text('Mathematical Verification Guarantee (Zero Hallucination)', marginX + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const verText = 'Statements such as "AQI improved compared with last month" are strictly governed by an automated regression comparator in history_service.py. If historical rows stored in the SQLite database do not corroborate a lower period-over-period mean by at least 2 AQI points, the system displays neutral consistency rather than false improvements.';
  doc.text(doc.splitTextToSize(verText, contentWidth - 12), marginX + 6, y + 15);

  // Smart Alert Engine
  y += 40;
  doc.setFillColor(255, 241, 242);
  doc.roundedRect(marginX, y, contentWidth, 24, 2, 2, 'F');
  doc.setDrawColor(...roseDark);
  doc.roundedRect(marginX, y, contentWidth, 24, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...roseDark);
  doc.text('Smart Pollution Alert Trigger Engine', marginX + 6, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(71, 85, 105);
  doc.text('When local telemetry crosses 100 AQI, an active high-alert notification banner triggers across the UI with audible bells and protective guidance. Users can toggle alerts ON/OFF or mute them at any time.', marginX + 6, y + 14);

  drawFooter(6);

  // ==========================================
  // PAGE 7: DATABASE SCHEMA & SYSTEM DESIGN
  // ==========================================
  doc.addPage();
  drawHeader(7, 'System Architecture & Schema');

  y = 30;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...slateDark);
  doc.text('Relational Database Schema & API Contracts', marginX, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...slateGray);
  doc.text('Clean modular design ensuring scale-to-zero efficiency, low latency (<150ms), and zero external dependencies.', marginX, y);

  // Database Schema Box
  y += 10;
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.roundedRect(marginX, y, contentWidth, 68, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(52, 211, 153); // Emerald 400
  doc.text('SQLITE DATABASE SCHEMA: database/aqi_history.db', marginX + 6, y + 8);

  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(226, 232, 240);
  const sqlLines = [
    'CREATE TABLE aqi_readings (',
    '  id INTEGER PRIMARY KEY AUTOINCREMENT,',
    '  location_name TEXT NOT NULL,',
    '  aqi INTEGER NOT NULL, pm2_5 REAL, pm10 REAL,',
    '  co REAL, no2 REAL, so2 REAL, o3 REAL,',
    '  temperature REAL, humidity REAL, wind_speed REAL,',
    '  weather_condition TEXT, aqi_level TEXT NOT NULL,',
    '  source_type TEXT DEFAULT "api",',
    '  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    ');',
    'CREATE TABLE locations (id INTEGER PRIMARY KEY, name TEXT UNIQUE, city TEXT, lat REAL, lon REAL);',
    'CREATE TABLE user_profiles (id INTEGER PRIMARY KEY, username TEXT, sensitivity_group TEXT, alerts INTEGER);'
  ];

  let sqly = y + 14;
  sqlLines.forEach(l => {
    doc.text(l, marginX + 6, sqly);
    sqly += 4.2;
  });

  // REST API Endpoints Table
  y += 74;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...slateDark);
  doc.text('REST API Specification', marginX, y);

  y += 5;
  const apiRows = [
    ['Method', 'Endpoint', 'Query Parameters', 'Output Payload'],
    ['GET', '/api/aqi', 'location, lat, lon, source', 'AQI, 7 pollutants, weather, status'],
    ['GET', '/api/nearby', 'lat, lon, limit', 'Array of regional stations & AQIs'],
    ['POST', '/api/advisory', 'aqi, pm2_5, group, weather', 'Contextual AI advisory & action lists'],
    ['GET', '/api/history/weekly', 'location', '7-day rolling statistics & line points'],
    ['GET', '/api/history/monthly', 'location', '30-day stats & verified trend statement'],
    ['GET', '/api/locations', 'q (query)', 'Alphabetically sorted location list']
  ];

  apiRows.forEach((row, rIdx) => {
    const isHead = rIdx === 0;
    doc.setFillColor(isHead ? 226 : (rIdx % 2 === 0 ? 255 : 248), isHead ? 232 : (rIdx % 2 === 0 ? 255 : 250), isHead ? 240 : (rIdx % 2 === 0 ? 255 : 252));
    doc.rect(marginX, y, contentWidth, 6.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(marginX, y, contentWidth, 6.5, 'S');

    doc.setFont(isHead ? 'helvetica' : 'courier', isHead ? 'bold' : 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(isHead ? 15 : 51, isHead ? 23 : 65, isHead ? 42 : 85);

    const widths = [18, 46, 52, 62];
    let cx = marginX + 2;
    row.forEach((cell, cIdx) => {
      doc.text(cell, cx, y + 4.5);
      cx += widths[cIdx];
    });
    y += 6.5;
  });

  // Roadmap & Conclusion
  y += 6;
  doc.setFillColor(...slateLight);
  doc.roundedRect(marginX, y, contentWidth, 22, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(marginX, y, contentWidth, 22, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...emeraldDark);
  doc.text('Production Roadmap:', marginX + 5, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('• Phase 1 (Completed): Full-stack Flask REST API, SQLite persistence, React 19 UI, and 3-tier circular gauge.', marginX + 5, y + 11);
  doc.text('• Phase 2 (Near-Term): Direct MQTT websocket integration for physical ESP32 / Arduino PMS5003 WiFi sensor nodes.', marginX + 5, y + 15.5);
  doc.text('• Phase 3 (Scale): Progressive Web App (PWA) offline caching and municipal emergency broadcast webhooks.', marginX + 5, y + 20);

  drawFooter(7);

  return doc;
}

// Generate the PDF file
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const outputPath = path.join(publicDir, 'Atmo_SHEILD_Presentation_7Pages_A4.pdf');
const doc = createAtmoShieldPDF();
const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
fs.writeFileSync(outputPath, pdfBuffer);

console.log(`Successfully generated 7-Page A4 Presentation PDF at: ${outputPath} (${pdfBuffer.length} bytes)`);
