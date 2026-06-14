# Wardrobe Health & Longevity Report

This report explains the metrics, wear calculations, and category gap algorithms of the **Wardrobe Health System** built in Phase L5.

## 1. System Overview
The Wardrobe Health System (`coverageAnalyzer.ts`, `rotationHealth.ts`, `wearLifecycle.ts`) assesses closet readiness against climate requirements, balances usage across items, and predicts wear fatigue.

## 2. Core Capabilities & Mechanics
*   **Rotation Variance Audit**: Computes mathematical standard deviation skew across all item wear counts, categorizing the closet's overall balance rate (e.g. *Optimal Rotation*, *Skewed Usage Fatigue*).
*   **Fabric Longevity & Lifecycle Predictor**: Calculates garment fiber durability scales (depreciating with high wear counts) and handles wash alarms tailored to textile categories (*Sportswear* needs faster cycle turnaround than *Formal* suit jackets).
*   **Seasonal Gaps Finder**: Cross-checks category counts against expected weather protection. Highlights high-severity gaps (e.g., missing Outerwear layers in cold weather blizzards) so the user has immediate insight into catalog requirements.
