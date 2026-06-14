# Fashion Experiment Framework Report

This document overviews the **A/B Testing and Experimentation Framework** in Phase L3. It details deterministic user variant assignment, metric collection, and live test variants.

## 1. Deterministic Variant Allocation

To guarantee zero-flicker experiments, the `VariantSelector` implements a custom, state-free string hashing algorithm rather than mathematical randomizers. 

The user's unique Firestore ID (`userId`) is combined with an `experimentId` to generate a stable variant index:

$$\text{Hash} = \sum_{i=0}^{L} \text{charCodeAt}(i) \times 7^i \pmod B$$

This ensures:
1.  **Immutability**: A user receives the exact same variant across all sessions of a specific experiment.
2.  **No Server-Side Side-Effects**: Variant matches require no lookups or write locks.
3.  **Orthogonality**: Distributes user assignments evenly across independent trials.

---

## 2. Active Experiments

The platform currently governs **two active experiments** running concurrently:

### Experiment 1: `scoring_engine_tuning`
Optimizes the weighting coefficients applied to closet rotation versus historical color compatibility.
*   **Control (`control_A`)**: standard item scoring rules.
*   **Variant B (`treatment_B`)**: multiplies the rotation weight by `1.5x` to maximize apparel rotation.
*   **Variant C (`treatment_C`)**: prioritizes favorite color styling weights.

### Experiment 2: `prompt_strategy`
Configures style description summaries sent to the Gemini API endpoint.
*   **Control (`control_A`)**: concise styling output.
*   **Variant B (`treatment_B`)**: prompts Gemini to output detailed narrative-driven styling.

---

## 3. Metric Aggregation & Evaluation

Active metrics are logged to the `experimentMetrics` collection on Firestore, tracking:

*   **Assignments Counting (`assignmentsCount`)**: Total users allocated per variant.
*   **Conversion Counting (`conversionsCount`)**: Users executing high-value operations ('worn', 'accepted', 'saved').
*   **Aggregate Score (`summedOutcomeScore`)**: Summed outcome accuracy percentages for significance testing.

$$\text{Variant Conversion Rate} = \frac{\text{ConversionsCount}}{\text{AssignmentsCount}} \times 100$$

A variant is promoted to standard production once it achieves a statistically significant **95% Confidence Interval** over the control.
