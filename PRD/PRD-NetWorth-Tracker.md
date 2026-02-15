# Net Worth Tracker - PRD
**Date:** February 2026  
**Version:** 1.0  
**Category:** Finance Tool  
**Priority:** Phase 3

---

## Product Overview
**Purpose:** Calculate total net worth (assets - liabilities snapshot).  
**Target Users:** Professionals tracking wealth accumulation; complementary to Budget Planner.  
**Why This:** Medium-term metric; low complexity; good for financial planning articles.

---

## Features

### Core Functionality
- **Assets Input:**
  - Bank Balance
  - Savings Account
  - Investments (MF, Stocks, Crypto)
  - Real Estate Value
  - Gold & Jewelry
  - Other Assets
- **Liabilities Input:**
  - Home Loan
  - Car Loan
  - Personal Loan
  - Credit Card Debt
  - Other Liabilities
- **Calculation:** Net Worth = Total Assets - Total Liabilities

### Output Display
- **Net Worth Amount:** Large, prominent display with trend indicator (↑ green or ↓ red)
- **Asset Allocation Pie Chart:** Visual breakdown of asset types
- **Liability Breakdown:** Visual breakdown of debt types
- **Net Worth Trend:** Quarterly snapshots with trend graph (last 4 quarters)
- **Percentage Changes:** Show quarter-over-quarter change

### UI/UX
- Two-column layout: Assets (left, green theme) vs Liabilities (right, red theme)
- Add/Edit asset cards with currency selector (₹/USD/EUR)
- Date picker: Compare net worth across specific dates
- Mobile: Stacked cards instead of columns
- Summary section with key metrics:
  - Total Assets
  - Total Liabilities
  - Net Worth
  - Assets-to-Liabilities Ratio

### Additional Features
- Milestone badges: "₹50 Lakh milestone reached!", "₹1 Crore milestone!"
- Benchmark comparison: "Your net worth is top X% vs Indians in same age group" (generic, anonymized)
- Quarterly tracker: Store 4 snapshots with auto-suggest quarterly entry
- PDF summary export with charts and snapshot date
- Note field for each asset/liability (e.g., "Home value estimated", "Car loan 5 years remaining")
- Category icons for better visual organization

---

## Technical Requirements

### Frontend Stack
- **Framework:** React with form validation
- **Storage:** IndexedDB (larger storage than LocalStorage) for multi-year data
- **Charts:** Recharts for pie charts and trend line chart
- **Export:** jsPDF for PDF generation
- **Currency Conversion:** Fixed conversion rates (API optional, hardcoded for Phase 1)

### Components Needed
1. **Asset Input Section:** Add/Edit cards for each asset type
2. **Liability Input Section:** Add/Edit cards for each liability type
3. **Summary Card:** Large net worth display with trend indicator
4. **Pie Charts:** Asset allocation and liability breakdown
5. **Trend Chart:** Line chart showing net worth over quarters
6. **Milestone Badges:** Achievement display
7. **Benchmark Card:** Percentile comparison (with disclaimer)
8. **Quarterly Snapshots:** Timeline view of all saved snapshots
9. **Export Button:** PDF generation
10. **Currency Selector:** ₹/USD/EUR toggle

### Data Structure
```json
{
  "snapshots": [
    {
      "date": "2026-02-13",
      "assets": {
        "bank_balance": 500000,
        "savings": 2000000,
        "mf_investments": 5000000,
        ...
      },
      "liabilities": {
        "home_loan": 3000000,
        "car_loan": 500000,
        ...
      }
    }
  ]
}
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Monthly visits | 200+ |
| Quarterly returning users | 20%+ |
| Avg session duration | 2–3 min |
| Snapshots saved per user | 2+ (quarterly pattern) |
| PDF exports | 12%+ |
| Milestone achievement | 5%+ users hit milestone |
| Mobile traffic | 45%+ |

---

## User Stories

- **As a** professional, **I want to** track my net worth quarterly, **so that** I can monitor wealth growth over time.
- **As a** couple, **I want to** see our combined net worth, **so that** we can plan for retirement together.
- **As an** investor, **I want to** see how my investments contribute to net worth, **so that** I can rebalance my portfolio.
- **As a** young high-earner, **I want to** see milestone achievements, **so that** I stay motivated to grow wealth.

---

## Benchmark Data (Generic)

**Age 25–30:**
- 25th percentile: ₹5 Lakh
- 50th percentile: ₹15 Lakh
- 75th percentile: ₹40 Lakh

**Age 30–35:**
- 25th percentile: ₹20 Lakh
- 50th percentile: ₹50 Lakh
- 75th percentile: ₹1.5 Crore

**Age 35–40:**
- 25th percentile: ₹50 Lakh
- 50th percentile: ₹1.5 Crore
- 75th percentile: ₹5 Crore

*Note: Generic benchmark; actual depends on income, location, profession*

---

## Monetization Opportunities

- **Premium Version:** Multi-user support, advanced charts, wealth advisory
- **Financial Advisor Referrals:** High net-worth users → advisor matchmaking
- **Investment Tools:** Link to portfolio trackers (Moneycontrol, Smallcase)
- **API Access:** Accountants/financial advisors integration

---

## Success Criteria (Launch)
- ✅ Add/edit assets and liabilities functional
- ✅ Net worth calculation accurate to ₹
- ✅ Pie charts render correctly with color coding
- ✅ Quarterly snapshot storage working (IndexedDB)
- ✅ Trend chart displays snapshots chronologically
- ✅ PDF export includes summary and charts
- ✅ Currency conversion working (basic)
- ✅ Milestone badges trigger correctly
- ✅ Mobile responsive (stacked layout)
- ✅ Lighthouse score >85

