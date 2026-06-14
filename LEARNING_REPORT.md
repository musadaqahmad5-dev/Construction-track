# Closed Loop Learning Report

This report overviews the **Reinforcement Learning Loop** that powers style customization, explaining how user interaction history is parsed to update preferences over time.

## 1. The Closed Loop Pathway

```
[Recommendation Engine]
      │
      ▼
[User Action in UI]  ──► (Viewed, Accepted, Rejected, Saved, Worn, Shared)
      │
      ▼
 [Decision Tracker]  ──► Written as a transactional outcome in Firestore
      │
      ▼
[Preference Learner] ──► Updates style weights, boosts favorite colors, or adds blacklists
      │
      ├──────────────────► Accept/Wear: Promotes color to front of `favoriteColors`
      └──────────────────► Reject: Adds exact combo count IDs to `rejectedOutfitIds` blacklist
      │
      ▼
[Updated Profile]    ──► Saved in StyleProfileMemory
      │
      ▼
[Better Recommendation] (Next execution loads updated weights)
```

---

## 2. Preference Mutator Formulas

### A. Color & Category Promotion (Accept/Wear)
When an item with primary color $C$ and category $K$ is accepted or worn:

$$\text{favoriteColors} = [C, \dots] \setminus \{C\}$$
$$\text{preferredCategories} = [K, \dots] \setminus \{K\}$$

This moves the chosen attributes directly to the front (highest priority) of the array, ensuring subsequent recommendation scores prioritize them.

### B. Color Penalty & Blacklisting (Reject)
When an outfit combo $O = \{id_1, id_2, id_3\}$ is rejected:

1.  **Blacklist Insertion**:
    $$\text{rejectedOutfitIds} \leftarrow \text{rejectedOutfitIds} \cup \{O\}$$
    The orchestrator filters out any candidate combination that matches this set.

2.  **Color Demotion**:
    For each item in $O$ with color $C$:
    The element's position is shifted to the very end (lowest priority) of the `favoriteColors` array, reducing its probability of appearing in future recommendations.

---

## 3. Persistent Loop Evaluation

This pipeline provides continuous refinement that adapts to the user's changing style tastes:

*   **Zero Hardcodings**: Preference models are initiated from standard baselines and evolve organically based on user feedback.
*   **Decay Rules**: Collection sizing is capped (`favoriteColors` <= 10, `preferredCategories` <= 5) to prevent Firestore document inflation, ensuring high performance.
