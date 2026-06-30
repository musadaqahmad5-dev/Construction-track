# AIStyleHub Real-Time Fashion Recommendation Engine
## High-Performance Personalization and Multi-Dimensional Ranking Specification

This document details the production-grade architectural specification, mathematical formulas, and JSON communication schemas of the **AIStyleHub Real-Time Fashion Recommendation Engine**, operating within the **Enterprise Autonomous Fashion Operating System (EAOS)** ecosystem.

---

### 1. Engine Architecture Topology

The recommendation engine evaluates incoming candidate inventories dynamically by checking alignment against the user's core Style DNA profile, seasonal contexts, and active global fashion trends.

```
       +-------------------------------------------------------------+
       |                     Recommendation Inputs                    |
       |  - User Style Profile DNA (Aesthetics, Preferred Textiles)  |
       |  - Active Fashion Trend Vectors (Silhouettes, Materials)     |
       |  - Context Constraints (Occasion, Season, Temp Celsius)     |
       +------------------------------+------------------------------+
                                      |
                                      v
       +-------------------------------------------------------------+
       |            High-Performance Matching & Scoring Core          |
       |  - Personalization Scoring (Exclusion rules, Archetypes)    |
       |  - Trend Influence Weighting (Trajectory and Sentiment maps)|
       |  - Seasonal Appropriateness (Thermodynamic clothing bounds)  |
       +------------------------------+------------------------------+
                                      |
                                      v
       +-------------------------------------------------------------+
       |              Multi-Dimensional Ranking System               |
       |  - Calculates Weighted Composite Fitness Scores             |
       |  - Combines items into cohesive coordinate ensembles        |
       +------------------------------+------------------------------+
```

---

### 2. Personalization Scoring System

The personalization score ($S_{\text{pers}}$) models the compatibility between a candidate garment ($g$) and the user's style profile preferences ($P$):

$$S_{\text{pers}}(g, P) = S_{\text{base}} + S_{\text{archetype}} + S_{\text{color}} - S_{\text{exclusion}}$$

*   **Base Line Score ($S_{\text{base}}$)**: Starts at `0.5`.
*   **Archetype Affinity ($S_{\text{archetype}}$)**: Iterates over candidate tags. If tag matching user preferred archetypes exists, adds average weight scaled by `0.3`.
*   **Color Matching ($S_{\text{color}}$)**: Adds `0.15` if the garment hex matches preferred dominant colors. Adds `0.1` if the silhouette matches preferred profiles.
*   **Exclusion Penalty ($S_{\text{exclusion}}$)**: Deducts `0.45` if the garment color is present in the user's hard-coded exclusion array, ensuring the engine filters out undesired styles.

---

### 3. Trend Influence Weighting

Active macro-trends dynamically bias the scores. If a garment matches key silhouettes, recommended materials, or colors associated with an active fashion trend, a trend compatibility score is computed:

$$S_{\text{trend}}(g) = \frac{1}{N} \sum_{i=1}^{N} \text{Sentiment}_i \cdot \text{TrajectoryWeight}_i$$

*   **Trajectory Weights**:
    *   `rising`: `1.0`
    *   `peaking`: `0.8`
    *   `declining`: `0.4`

The final composite ranking score ($S_{\text{total}}$) is defined as:

$$S_{\text{total}} = \frac{(S_{\text{pers}} \cdot W_{\text{dna}}) + (S_{\text{trend}} \cdot W_{\text{trend}}) + (S_{\text{season}} \cdot W_{\text{season}})}{W_{\text{dna}} + W_{\text{trend}} + W_{\text{season}}}$$

Where $W_{\text{trend}}$ represents the context's specific trend-bias rating, allowing the frontend to dynamically toggle between pure personalization ($W_{\text{trend}} = 0$) and highly-forward fashion curation ($W_{\text{trend}} = 1.0$).

---

### 4. Schema Specifications

#### A. Ingress Request Payload (`POST /api/fashion/recommend`)

```json
{
  "profile": {
    "userId": "usr_9921_sartor",
    "preferences": {
      "archetypes": {
        "Classic Minimalism": 0.85,
        "Techwear": 0.45
      },
      "dominantColors": ["#111111", "#FFFFFF"],
      "excludedColors": ["#FF00FF"],
      "favoredSilhouettes": ["Structured Overcoat"],
      "textiles": ["Worsted Wool"]
    },
    "sartorialMaturityScore": 0.89
  },
  "candidates": [
    {
      "id": "garm_901",
      "name": "Classic Wool Overcoat",
      "category": "outerwear",
      "color": "#111111",
      "material": "Worsted Wool",
      "silhouette": "Structured Overcoat",
      "tags": ["Classic Minimalism"]
    }
  ],
  "activeTrends": [
    {
      "trendId": "trend_paris_2026",
      "name": "Relaxed Overcoats",
      "trajectory": "rising",
      "sentimentScore": 0.95,
      "keySilhouettes": ["Structured Overcoat"],
      "recommendedMaterials": ["Worsted Wool"],
      "coreColors": ["#111111"]
    }
  ],
  "context": {
    "occasion": "Gallery Opening",
    "season": "winter",
    "temperatureCelsius": 5,
    "trendWeight": 0.4
  }
}
```

#### B. Successful Response Payload

```json
{
  "success": true,
  "service": "AIStyleHub-Fashion-Recommendation-Engine",
  "timestamp": "2026-06-29T10:14:00.000Z",
  "payload": {
    "curatedEnsembles": [
      {
        "name": "Curated Elite Gallery Opening Coordinate",
        "items": [
          {
            "id": "garm_901",
            "name": "Classic Wool Overcoat",
            "category": "outerwear",
            "color": "#111111",
            "material": "Worsted Wool",
            "silhouette": "Structured Overcoat"
          }
        ],
        "compositeFitnessScore": 0.94,
        "designRationale": "A balanced styling ensemble assembled specifically for Gallery Opening..."
      }
    ],
    "rankedIndividualGarments": [
      {
        "garment": {
          "id": "garm_901",
          "name": "Classic Wool Overcoat",
          "category": "outerwear",
          "color": "#111111",
          "material": "Worsted Wool"
        },
        "scores": {
          "personalizationScore": 0.95,
          "trendScore": 0.95,
          "seasonScore": 0.85,
          "harmonyScore": 0.8,
          "totalScore": 0.94
        }
      }
    ],
    "scoringWeightsApplied": {
      "dnaPersonalization": 0.6,
      "trendInfluence": 0.4,
      "seasonalContext": 0.2
    }
  }
}
```

---

### 5. Deployment Verification Registry

*   **Core Module**: `/packages/ai-engine/src/FashionRecommendationEngine.ts`
*   **API Inbound Integration Handler**: `/apps/api-gateway/src/routes.ts`
*   **Validation Status**: `SUCCESS`
