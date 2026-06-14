# Visual World Model & Lookbook Report

This report documents the **Visual World Model** in Phase L4, describing how suggested outfits are framed in ambient contexts and comparatively ranked.

---

## 1. Scenario Context Composition

The `SceneComposer` matches the user's agenda to rich visual scenes dynamically styled with custom CSS gradients and lighting elements:

| Agenda Focus | Scenario Name | Background Theme | Lighting Tone |
| :--- | :--- | :--- | :--- |
| **Work** | Corporate Architecture | `from-slate-100 to-slate-200` | Soft Studio Glow |
| **Casual** | Sunlit Boulevard | `from-amber-50 to-orange-100` | Warm Golden Hour |
| **Sport** | Industrial Concrete Gym | `from-zinc-100 to-zinc-300` | Cold Natural Ambient |
| **Event / Night** | Spotlight Lounge | `from-slate-900 to-indigo-950` | Dramatic Night Contrast |

---

## 2. Visual Composition Scoring

The `VisualRanker` grades aesthetic coordinate matching through a multi-variable $100$-point balance algorithm:

### A. Chromatic Contrast Balance (Max 15 points)
*   **Monochromatic Sophistication**: Perfect shade unifications get $+12$ points.
*   **High Contrast Pairing**: Dynamic opposite colors get $+15$ points.
*   **Over-saturated Clutter (>= 4 colors)**: Excessively dense matches get penalized $-10$ points to caution against messy visual tones.

### B. Proportional Verticality (Max 30 points)
Coordinating both upper (casual/formal tops/sweaters) and lower physical layers (jeans/trousers) in a single set secures a structural $+30$ point boost. Failing to present both categories incurs a $-20$ points penalty due to missing coordinate layers.
```
Visual Score = 50 (Base) + ColorBonus + StructureBonus
```
This formula translates raw styles directly into quantifiable elegance ratings.
