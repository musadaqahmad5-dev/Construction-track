# Fashion Confidence Engine Report

This report outlines the math, inputs, and indicators used by the **Fashion Confidence Engine** to grade the accuracy of recommendations before they are presented to the user.

## 1. Engine Core Formulas

Confidence is not a single guess, but a product of three independent structural indicators:

### A. Prediction Confidence ($C_{pred}$)
How many matching items exist in the user's closet for the target conditions?

$$C_{pred} = \text{Clamp}\left( \frac{\text{Matching Items Count in Wardrobe}}{\text{Min Required (3)}} \times 1.0, \, 0, \, 1.0 \right)$$

### B. Dynamic Model Uncertainty ($U_{sys}$)
Measures environmental variance, such as unexpected weather transitions or empty closet coverage. 

$$U_{sys} = w_{weather} \cdot \Delta T + w_{coverage} \cdot I_{missing} + w_{offline} \cdot I_{offline}$$

Where:
*   $\Delta T$ represents extreme thermal variations.
*   $I_{missing}$ indicates if critical categories (e.g. Tops, Pants, Outerwear) are missing from the closet.
*   $I_{offline}$ is a binary flag for network outages.

### C. Style Trust Score ($T_{style}$)
Assesses alignment with the user's long-term style profile:

$$T_{style} = \frac{\sum_{i \in \text{Selected}} [I(\text{Color}_i \in \text{Favorites}) + I(\text{Category}_i \in \text{Preferred})]}{2 \times \text{Outfit Items Length}}$$

---

## 2. Integrated Trust Score

The unified core score is synthesized as:

$$\text{Final Trust Score} = (C_{pred} \times (1.0 - U_{sys})) \times T_{style}$$

If the Integrated Trust Score falls below **0.40**, a fallback indicator is triggered and a notification is displayed to warn the user about mismatched or incomplete closet state.

---

## 3. Explainer Core Rules (5-Point Framework)

To guarantee full transparency, the `ConfidenceExplainer` translates these metrics into human-readable rationale:

1.  **Why Selected**: Details weather, temperature bounds, and agenda match logic.
2.  **Color Match**: Evaluates contrast ratios and favorite color representation.
3.  **Season Fit**: Inspects garment material weights against temperature.
4.  **Rotation Reason**: Reports the garment's usage count and fabric wear fatigue.
5.  **Alternative Choice**: Recommends catalog replacements to modify the styling.
