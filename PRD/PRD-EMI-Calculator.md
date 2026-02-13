# EMI Calculator - PRD
**Date:** February 2026  
**Version:** 1.0  
**Category:** Finance Tool  
**Priority:** Phase 1 (MVP)

---

## Product Overview
**Purpose:** Calculate Equated Monthly Installment (EMI) for loans (home, car, personal).  
**Target Users:** Indians planning loans; primary audience: car/home loan seekers aged 25-50.  
**Why This:** High search volume in India; low build complexity; monetization potential (affiliate with lenders).

---

## Features

### Core Functionality
- **Inputs:** 
  - Loan Amount (₹ slider + text box, range: ₹50K–₹1Cr)
  - Interest Rate (% slider, 5–25%)
  - Loan Tenure (months dropdown or slider, 6–360 months)
- **Output:** 
  - Monthly EMI
  - Total Amount Payable
  - Total Interest
  - Amortization Schedule (table: month, principal, interest, balance)
- **Real-time Calculation:** Updates on every input change (no "Calculate" button needed)

### UI/UX
- Horizontal layout: 3 input cards (left) + results + chart (right)
- Interactive pie chart: Principal vs Interest split
- Line chart: EMI breakdown over tenure
- Mobile: Stacked vertical cards
- Dark/Light mode toggle

### Additional Features
- Pre-calculated tenure comparisons: "How does 5-year vs 10-year differ?" cards
- Share button (Twitter/WhatsApp) with calculated results
- No login, no tracking (privacy-first)
- Copy EMI calculation to clipboard

---

## Technical Requirements

### Formula
**EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)**
- P = Principal (loan amount)
- r = Monthly interest rate (annual rate / 12 / 100)
- n = Number of months (tenure in months)

### Frontend Stack
- **Language:** Vanilla JS with Chart.js for graphs
- **Data Storage:** LocalStorage for user's last entered values (optional)
- **Performance:** <200ms calculation time
- **Browser Support:** Chrome, Firefox, Safari, Edge (last 2 versions)

### Components Needed
1. **Input Section:** Sliders/text inputs for principal, rate, tenure
2. **Results Card:** Large display of EMI, total payable, total interest
3. **Charts:** Pie chart (Principal vs Interest), Line chart (monthly breakdown)
4. **Amortization Table:** Scrollable table with month-wise details
5. **Action Buttons:** Share, Copy, Download PDF
6. **Comparison Cards:** Quick tenure comparison snapshots

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Monthly organic visits | 1000+ (month 2) |
| Share rate | 10%+ (click-to-share action) |
| Page load time | <1s |
| Mobile traffic | 40%+ |
| Avg session duration | >2 min |
| Bounce rate | <55% |

---

## User Stories

- **As a** 30-year-old planning a car purchase, **I want to** see monthly EMI for different loan amounts, **so that** I can decide affordability before visiting dealer.
- **As a** loan officer, **I want to** generate amortization schedules quickly, **so that** I can show clients during consultations.
- **As a** home loan applicant, **I want to** see how tenure affects EMI, **so that** I can choose optimal loan term.

---

## Monetization Opportunities

- **Affiliate Links:** Link to loan platforms (BankBazaar, Paisabazaar, direct bank links)
- **Banner Ads:** Non-intrusive ads after calculation (optional)
- **Premium Version:** Ad-free, PDF exports, batch calculations (future)

---

## Competitive Analysis

| Competitor | Advantage | Our Differentiation |
|-----------|-----------|-------------------|
| Paisabazaar | Large ecosystem | Cleaner UI, faster, no tracking |
| BankBazaar | Established | India-optimized, privacy-first |
| Bank websites | Official | More user-friendly, comparison features |

---

## Success Criteria (Launch)
- ✅ All calculations accurate to 2 decimal places
- ✅ Mobile responsive and touch-friendly
- ✅ <1s load time
- ✅ Amortization table generates correctly
- ✅ Share buttons work (Twitter, WhatsApp)
- ✅ Dark mode toggle functional
- ✅ Lighthouse score >90

