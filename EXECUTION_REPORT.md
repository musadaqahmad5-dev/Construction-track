# Outfit Execution Layer Report

This report outlines the **Outfit Execution Layer** and its travel coordination algorithms.

---

## 1. Multi-Day Wear Planner

The `WearPlanGenerator` coordinates closet clothing allocations for journeys or multi-day schedules:

*   **Rotation Allocation**: Schedules unique Tops and Outerwear items sequentially to avoid repeat wear wearout.
*   **Context Safety**: Tailors layers daily based on individual day agendas (e.g., formal work conferences vs. casual park outings).
*   **Layer Hints**: Inserts situational suggestions (e.g., single-layered comfort vs. cozy heavy wool thermal insulation).

---

## 2. Baggage Weight Thresholds

To prevent airport over-limit fees, the `PackingAssistant` sums individual garment weights:

*   **Jackets / Active Outerwear**: $1.2$ kg
*   **Pants / Jeans**: $0.6$ kg
*   **Sweaters / Casual Shirts**: $0.3$ kg

If the computed luggage weights go over threshold sizes, bag рекомендации scale accordingly:

$$\text{Weight} \le 4\text{kg} \implies \text{Compact Carry-on}$$
$$4\text{kg} < \text{Weight} \le 8\text{kg} \implies \text{Medium Checked Bag}$$
$$\text{Weight} > 8\text{kg} \implies \text{Heavy Expedition Case}$$

---

## 3. Travel Packing Methods
The execution planner suggests efficient packing techniques to maximize suitcase space:
*   **Ranger Roll Method**: Tightly rolls shirts and light clothes to save space and reduce wrinkles.
*   **Heavy Duty Plane Hack**: Recommends wearing heavy outerwear coats directly on the flight to save weight limits.
