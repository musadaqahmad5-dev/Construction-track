# Virtual Try-On Engine Report

This report outlines the design, implementation, and calculation rules of the **Visual Try-On Engine** implemented in Phase L4.

---

## 1. Virtual Stack positioning Matrix

Garment layering relies on categories mapped to precise vertical body positions over an avatar wireframe:

*   **Outerwear**: Stacks on the ultimate coordinate layer (`zIndex: 15`), matching a generous $62\%$ parent bounds width to wrap undergarments cleanly.
*   **Casual (Tops/Shirts)**: Positioned at $24\%$ vertically (`zIndex: 10`), establishing the foundational body line coverage.
*   **Pants (Bottoms)**: Positioned at $55\%$ vertically (`zIndex: 8`), avoiding overlaps with chest items.
*   **Accessories (Bags/Hats)**: Stacked selectively at focal accents (`zIndex: 20`) to enrich styling depth.

---

## 2. Fit Estimation Formula

Garment fit compatibility assessment targets size differences using relative rating scales:

$$\text{SizeDelta} = \text{Rank}_{\text{GarmentSize}} - \text{Rank}_{\text{UserPreferredSize}}$$

Where size scales mapped are `[XS=1, S=2, M=3, L=4, XL=5, XXL=6]`.

### Fit Categorizations:
1.  **SizeDelta = 0**: *Perfect Synergy* ($98\%$ confidence) — Optimal standard sizing drapes.
2.  **SizeDelta = +1**: *Relaxed* ($85\%$ confidence) — Soft fluid layering, highly recommended for sweaters.
3.  **SizeDelta = -1**: *Slim Fit* ($80\%$ confidence) — Form-fitted tailored lining.
4.  **SizeDelta = -2**: *Tight / Restrictive* ($40\%$ confidence) — Body mobility cautions triggered.

---

## 3. Fallback Lookbook Path

If try-on conditions fail or categories violate stacking boundaries (such as a user trying on duplicate bottoms concurrently), the system automatically defaults to lookbook mode, fallback displaying structural flat product list arrangements.
