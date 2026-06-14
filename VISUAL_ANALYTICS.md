# Visual Decision Analytics Report

This report outlines the **Visual Decision Layer** that measures the visual effectiveness and engagement of styling recommendations.

---

## 1. Visual Interaction Telemetry

The platform tracks 5 action vectors to evaluate user confidence:

1.  **Preview Open (`preview_open`)**: Opened virtual try-on overlay to view layout.
2.  **Compare Looks (`compare_looks`)**: Compared alternative combinations side-by-side.
3.  **Complete Selected Outfit (`complete_outfit_click`)**: Inspected missing layers or bundle completers, signaling high conversion intent.
4.  **Aesthetic Acceptance (`visual_accept`)**: Saved lookbook with positive ratings.
5.  **Simulated Bundle Purchase (`bundle_purchase_simulate`)**: Added shoppable companion items directly to shopping cart.

---

## 2. Visual Outcome Score Math

The **Visual Outcome Score (VOS)** is calculated using a weighted additive formula:

$$\text{Visual Outcome Score} = \text{Clamp}\left( 60 + (3 \cdot O_{preview}) + (6 \cdot O_{compare}) + (10 \cdot A_{accept}) + (12 \cdot C_{complete}) + (15 \cdot P_{purchase}), \, 0, \, 100 \right)$$

Where $O_{preview}$ is preview opens, $O_{compare}$ is look comparisons, $A_{accept}$ is aesthetic acceptances, $C_{complete}$ is completion clicks, and $P_{purchase}$ is bundle purchases.

---

## 3. Visual Completion Rate

We evaluate the conversion efficiency of styling overlays using the formula:

$$\text{Visual Completion Rate} = \frac{\text{CompleteClicks} + \text{Accepts}}{\max(1, \text{PreviewOpens})} \times 100$$

A high completion rate indicates our virtual try-on helps users quickly lock in and trust recommend styling sets.
