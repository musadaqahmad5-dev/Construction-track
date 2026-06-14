# Commerce Intelligence Report

This report outlines the **Commerce Intelligence Layer** designed to analyze wardrobe gaps and generate complete multi-item shopping bundles.

---

## 1. Outfit Gap Scanner

The `MissingItemDetector` inspects the active outfit suggestion and compares it against standard layered profiles. Deficits are surfaced with three levels of severity:

*   **HIGH Severity**: Missing basic essentials such as tops, bottoms, or outerwear in cold/rainy conditions.
*   **MEDIUM Severity**: Lack of coordinate layer options like suits under formal settings.
*   **SUGGESTION Severity**: Aesthetic gaps like missing accessories (bags, belts, scarves) that help unify colors.

---

## 2. Partner Catalog Matching

When gaps are identified, the system queries a mock premium collection featuring classic staples to suggest matching items:

1.  **Oatmeal Wool Trench Coat**: Outerwear ($145 USD) in beige, perfect for neutral style palettes.
2.  **Dry Sage Waterproof Windbreaker**: Outerwear ($95 USD) in sage green, perfect for stormy forecasts.
3.  **Chelsea Chocolate Leather Boots**: Accessories ($125 USD) in brown, providing solid grounding.
4.  **Sartorial Double-Breasted Blazer**: Formal ($160 USD) in navy, great for corporate events.

---

## 3. Completer Discount Bundling

Recommended items are grouped into automated completion bundles to encourage outfitting purchases:

*   **Solo Completion**: 1 items get an automatic $10\%$ discount.
*   **Set Completer Bundle**: Multiple items get an automatic $20\%$ discount to encourage larger basket sizes.

$$\text{Bundle Price} = \sum (\text{RetailPrice}) \times (1.0 - \text{DiscountRatePercent})$$

This model shifts recommendations from conversational text suggestions to shoppable outfitting solutions.
