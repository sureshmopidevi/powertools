# BMI Calculator - PRD
**Date:** February 2026  
**Version:** 1.0  
**Category:** Finance & Lifestyle Tool  
**Priority:** Phase 1 (MVP)

---

## Product Overview
**Purpose:** Help adults estimate Body Mass Index (BMI), category, and healthy weight range quickly.  
**Target Users:** Adults (18+) who want a simple lifestyle screening metric before planning fitness goals.  
**Why This:** High utility, low complexity, and strong fit for quick decision support.

---

## Features

### Core Functionality
- **Unit Systems:** Metric and Imperial
- **Metric Inputs:**
  - Height (cm, range: 90 to 250)
  - Weight (kg, range: 20 to 300)
- **Imperial Inputs:**
  - Height (ft + in, total range: 36 to 96 inches)
  - Weight (lb, range: 44 to 660)
- **Primary Output:**
  - BMI score (1 decimal)
  - WHO adult category label
  - Healthy weight range for entered height
- **Live Calculation:** Updates on every input change (no calculate button required)

### UI/UX
- 3-zone layout:
  - Header (title, purpose, Home button, theme toggle)
  - Decision surface (BMI, category, healthy range, timestamp)
  - Action surface (unit toggle, inputs, educational disclaimer)
- Mobile-first responsive behavior (single-column on small screens)
- Inline validation messages under the exact input fields
- Copy result action for quick sharing

### Content and Safety
- Educational-only disclaimer shown near result
- Guidance to consult a qualified healthcare professional
- No diagnosis or treatment language

---

## Technical Requirements

### Formula
- **Metric:** `BMI = kg / (m^2)`
- **Imperial:** `BMI = 703 * lb / (in^2)`
- **Healthy Weight Range:**
  - Min = `18.5 * m^2`
  - Max = `24.9 * m^2`

### Adult Category Thresholds (WHO)
- Underweight: `<18.5`
- Normal: `18.5-24.9`
- Overweight: `25.0-29.9`
- Obesity Class I: `30.0-34.9`
- Obesity Class II: `35.0-39.9`
- Obesity Class III: `>=40.0`

### Frontend Stack
- **Language:** Vanilla JS (ES modules)
- **Styling:** Tailwind CSS (CDN) aligned with project conventions
- **Theme:** Shared `ThemeManager` integration
- **Storage:** No persisted history in V1
- **Performance:** Instant calculations in normal browser conditions

### Components Needed
1. **Header:** Home button, title, category context, theme toggle
2. **Result Card:** BMI value, category badge, healthy range, timestamp
3. **Input Card:** Unit toggle and unit-specific fields
4. **Validation Layer:** Inline errors mapped by field
5. **Disclaimer Card:** Educational and safety copy
6. **Action Control:** Copy result button

### Public Interfaces
- `calculateBMI(input)`
- `validateInput(input)`
- `getHealthyWeightRange(heightMeters, unitSystem)`
- `getBMICategory(bmi)`

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Monthly visits | 500+ by month 2 |
| Calculation completion rate | 70%+ |
| Mobile share | 50%+ |
| Avg session duration | >60 sec |
| Bounce rate | <60% |
| Page load time | <1s |

---

## User Stories

- **As an** adult user, **I want to** enter my height and weight and see BMI instantly, **so that** I can understand my current category quickly.
- **As an** Imperial-unit user, **I want to** use ft/in and lb, **so that** I do not need manual conversion.
- **As a** cautious user, **I want to** see clear disclaimers and next-step guidance, **so that** I treat BMI as screening info, not diagnosis.

---

## Non-Goals (V1)
- Pediatric BMI percentile logic
- Medical diagnosis or treatment recommendations
- Long-term history, account sync, or cloud storage
- Advanced body composition metrics (body fat, waist-to-hip, etc.)

---

## Success Criteria (Launch)
- Accurate BMI output to 1 decimal
- Correct category thresholds at boundaries
- Healthy range output correct in selected unit system
- Inline validation prevents invalid or unsafe inputs
- Educational disclaimer always visible
- Home navigation and theme toggle function correctly
- Mobile responsive at 360px width
- No console errors in normal user flow
- Lighthouse score target >90

