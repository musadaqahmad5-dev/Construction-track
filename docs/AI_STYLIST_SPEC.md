# AIStyleHub AI Stylist Behavior Specification
## Live Cognitive Stylist Intelligence & Personalization Architecture

This specification outlines the behavioral model, decision flows, and reinforcement loop of the **AIStyleHub Live AI Stylist System**, which drives high-fidelity personalized visual direction inside the **Enterprise Autonomous Fashion Operating System (EAOS)**.

---

### 1. Stylist Behavioral Intelligence Core

The AI Stylist is modeled as an elite visual director capable of digesting multi-dimensional client inputs, episodic wardrobe interactions, and real-time trend signals to curate high-concept outfits with granular high-fashion justifications.

```
       +-------------------------------------------------------------+
       |                        Stylist Context                      |
       |  - Active User Style DNA (Aesthetic Archetypes, Textile, etc)|
       |  - Episodic Memory (Analogous historically successful runs) |
       |  - Trend Feeds (Paris/London current seasonal direction)    |
       |  - Inbound Live Prompt Context ("Sophisticated gallery vibe")|
       +------------------------------+------------------------------+
                                      |
                                      v
       +-------------------------------------------------------------+
       |             Cognitive Multi-Variable Planner (Gemini)       |
       |  - Overrides DNA exclusions if explicitly named in prompt  |
       |  - Coordinates complementary colors, silhouettes, & weights |
       +------------------------------+------------------------------+
                                      |
                                      v
       +-------------------------------------------------------------+
       |               Curated Outfit & Styling Decisions            |
       |  - Cohesiveness Metrics (Color harmony, silhouette ratio)   |
       |  - Haute Justification & Directives ("drapes effortlessly")  |
       +-------------------------------------------------------------+
```

---

### 2. Decision Flow System

The styling request undergoes a structured logical evaluation:

1.  **Aesthetic Conflict Resolution**: Compares user-defined style exclusions with prompt keywords. If conflict arises (e.g., "magenta" is excluded but explicitly requested in prompt), the prompt override takes highest priority.
2.  **Episodic Memory Alignment**: Loads historic ratings of similar scenario combinations to suppress items with low past satisfaction scores.
3.  **Macro-Trend Alignment**: Injects current macro-trend styling elements to lift cohesiveness relevance.
4.  **Wardrobe Constraint Matching**: Iterates over actual wardrobe inventory items to assemble a complete complementary outfit ensemble.

---

### 3. Personalization & Evolution Loop (Reinforcement Learning)

The stylist's precision scales over time via a localized backpropagation of satisfaction ratings ($1.0$ to $5.0$):

*   **Aesthetic Alignment Lift**: High satisfaction ratings ($\ge 4.0$) trigger positive weight reinforcements, amplifying associated archetypes and appending textile/silhouette configurations to preferred DNA arrays.
*   **Correction Shift**: Poor feedback ($\le 2.0$) decreases active archetype weights relative to the session's estimated shift footprint, suppressing recurring undesirable recommendations.

$$W_{\text{new}} = W_{\text{old}} + \Delta_{\text{session}} \cdot \alpha \cdot \text{multiplier}$$

*Where $\alpha$ is the adaptation rate, and the multiplier is determined by the feedback rating.*

---

### 4. Registered API Endpoints

These modules are integrated and compiled in `/apps/api-gateway/src/routes.ts`:
*   `POST /api/v1/stylist/consult`: Launches live styling analysis, returns curated outfits and high-concept justification.
*   `POST /api/v1/stylist/feedback`: Feeds satisfaction back into the learning engine to evolve the user's permanent Style DNA.
