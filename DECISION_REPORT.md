# Fashion Decision Outcome Layer Report

This report outlines the design, execution, and performance indices of the **Decision Outcome Layer** established in Phase L3. It tracks how users interact with outfit proposals and evaluates selection effectiveness.

## 1. Core KPIs (Key Performance Indicators)

| KPI | Formula / Definition | Target Threshold | Description |
| :--- | :--- | :--- | :--- |
| **Acceptance Rate (AR)** | `(Accepted / Total Recommendations) * 100` | **> 65%** | Indicates general styling match relevance. |
| **Wear Rate (WR)** | `(Worn / Total Recommendations) * 100` | **> 40%** | Measures real-world utility and outfit application. |
| **Decline Rate (DR)** | `(Rejected / Total Recommendations) * 100` | **< 15%** | Highlights styling failure and mismatch frequency. |
| **Save Rate (SR)** | `(Saved / Total Recommendations) * 100` | **> 30%** | Measures aesthetic retention and outfit satisfaction. |
| **Platform Outcome Score** | Weighted summation of outcomes over a trailing session sliding window | **> 75 / 100** | Primary index of adaptive fashion recommendation quality. |

---

## 2. Interaction Weights & Value Scaling

The `FeedbackInterpreter` translates qualitative user interactions into quantitative feedback weights to construct the learning gradient:

*   **Viewed (`viewed`)**: `+0.1` — Establishes baseline recommendation exposure.
*   **Accepted (`accepted`)**: `+0.8` — Indicates clear intent and styling synergy.
*   **Saved (`saved`)**: `+0.7` — High aesthetic value; logged in the user's permanent lookbook.
*   **Shared (`shared`)**: `+0.6` — Social validation and outward styling interest.
*   **Worn (`worn`)**: `+1.0` — Maximum validation; garment is put on and wear counts updated.
*   **Rejected (`rejected`)**: `-0.8` — Major mismatch; triggers color penalties and layout combination blacklists.
*   **Abandoned (`abandoned`)**: `-0.2` — Implicit decay; suggestion skipped or expired without interaction.

---

## 3. Outcome Confidence Score calculation
The trailing outcome score is computed over the user's last `N` sessions using the formula:

$$\text{RecommendationOutcomeScore} = \text{Clamp}\left( \frac{\sum (w_i \times \text{speed\_modifier})}{\sum w_{\text{max}}} \times 100, \, 0, \, 100 \right)$$

Where the decision speed modifier decreases if a user takes more than 120 seconds to make an outfit choice, penalizing sluggish alignment.

---

## 4. Database Schema Alignment

Decisions are written to the `decisionOutcomes` collection in **Firestore**:

```json
{
  "userId": "usr_992xap",
  "recommendationId": "rec_1714529340",
  "action": "worn",
  "timestamp": "2026-06-13T07:32:10.592Z",
  "items": ["garment_top_01", "garment_bot_03"]
}
```

This guarantees full audit logs of user responses used to calculate the real-time Outcome Score.
