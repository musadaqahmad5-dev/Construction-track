# Failure Modes & Resiliency Validation Testing (FMEA)
**System Version**: 2.0.0-PROD  
**Failure Mitigation Integrity Class**: Tier-1 (Self-Healing & Graceful Degradation)  

This document tracks expected behaviors, recovery actions, and fallbacks when external dependencies fail, ensuring that client interfaces never display raw system crashes or indefinite load spinners.

---

## 1. Failure Scenario Matrix

| Risk Vector | Root Cause | System Catch | Graceful UI Fallback Behavior |
| :--- | :--- | :--- | :--- |
| **Missing API Key** | `GEMINI_API_KEY` or Firebase tokens not provided in runtime enviroment. | Module checks environment on boot or lazily at run-time. | Displays a human-readable banner advising setup instructions. Disables advanced styling bots, switching to `OutfitReasoner` fallback. |
| **Firestore Outage** | Cloud database connection drop or rate-limiting (daily reads quota exceeded). | Wrapped in structured `handleFirestoreError()` try-catch blocks. | Warns the user of session offline status. Automatically initializes `localStorage` container so users can continue organizing locally. |
| **Gemini Outage** | Google GenAI service experiencing transit timeouts or 503 HTTP rates. | Catch block around server model calls with structured JSON mapping. | Coordinates fallback styling templates. Replaces dynamic advice with safe, curated recommendations depending on the category. |
| **Image Engine Outage** | Imagen 4.0 generation fails due to safety filters or service blocks. | Evaluated in `ImageGenerationRegistry` multi-provider cascade. | Cascades down: Google-Imagen -> Gemini-Multimodal-Canvas -> Picsum deterministic fashion seed image list. Visual compiles in < 500ms. |
| **Network Timeout / Iframe Drop** | Client container network latency exceeding standard 15s transit bounds. | Wrapped in connection checkers and offline event listeners. | Emits alerts pointing out low connectivity. Re-enables transaction buttons once browser signals online. |

---

## 2. Playbook Action Steps for Failures

### Case A: Quota Exceeded (Daily Read Units)
1. **Error Detection**: Firestore returns Code 8: `RESOURCE_EXHAUSTED` with message `"Quota exceeded for quota metric 'Free daily read units per project...'"`.
2. **System Behavior**: The custom `handleFirestoreError()` intercepts this, logs a structured JSON dump on the server, and notifies the client.
3. **UI Resolution**: The client renders an elegant notification modal:
   * *"We have reached our daily database quota for today. Your progress has been secured in our Local Offline Storage so you can keep planning your outfits without interruptions!"*
   * Displays the Firebase upgrade console shortcut link with parameters: `?openUpgradeDialog=true` for administrators.

### Case B: Imagen Prompt Safety Rejection
1. **Error Detection**: Client generates a prompt containing un-stylable content or restricted keywords; upstream API throws a safety evaluation filter block.
2. **System Behavior**: `ImageGenerationRegistry` catches the error within `ImagenProvider` and immediately fails-forward to the `FashionPicsumProvider`.
3. **UI Resolution**: Renders a matching physical mannequin placeholder look matching the garment category and outlines the design prompt below it, alongside a helpful warning:
   * *"Aesthetic filters prevented direct photorealistic lookbook compilation. Here is a high-fashion curated visual blueprint instead!"*
