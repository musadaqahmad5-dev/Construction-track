# User Acceptance Testing (UAT) Specifications
**Target Sandbox Version**: 2.0.0-PROD  
**Coverage Level**: 100% Core End-to-End User Flow Mapping  

This document outlines the strict behavioral validation scripts representing standard user interactions with the AI Closet & Wardrobe Intelligence OS.

---

## Task-Based Acceptance Tests

### UAT-01: User Signup & First-Time Auth Setup
* **Objective**: Ensure new users can initiate Google Identity-based registration.
* **Prerequisites**: No previous local state or active browser session.
* **Step-by-Step Execution**:
  1. Load the main portal page.
  2. Locate and click **"Connect with Google"** in the authentication drawer.
  3. Enter valid sandbox Google email credentials in the secure popup.
  4. Confirm redirect and check page header elements.
* **Expected Result**: 
  * Active UI displays the user's avatar card.
  * Local state shifts from unauthenticated to authenticated.
  * System launches dynamic database listener `onSnapshot()` pointing to `/wardrobe`.

---

### UAT-02: Wardrobe Camera Ingestion & Visual Upload
* **Objective**: Verify that adding a picture of clothing translates into an parsed wardrobe item.
* **Prerequisites**: User is successfully authenticated.
* **Step-by-Step Execution**:
  1. Open the **"Visual Scan Portal"** panel.
  2. Select a sample garment image file (e.g. `beige_trench.png`) or use the browser media camera module.
  3. Click **"Execute AI Vision Parsing"** to trigger `/api/ai/analyze-visual`.
  4. Analyze the item metadata form that populates on screen.
  5. Select garment category matching `'Outerwear'` and click **"Commit to Closet"**.
* **Expected Result**:
  * Multimodal parsing extracts the correct category (`Outerwear`), primary color (`Oatmeal/Beige`), and fabric texture.
  * Item is successfully committed to the user's online Firestore collection `/wardrobe`.
  * Wardrobe grid reactively appends the new garment card.

---

### UAT-03: Dynamic Recommendation Matrix Run
* **Objective**: Trigger weather and vibe adapted outfit planning.
* **Prerequisites**: At least 3 clothing items represent active states in the wardrobe database.
* **Step-by-Step Execution**:
  1. Find and open the **"Style Assistant Portal"** tab.
  2. Toggle target weather condition selectors to `'Rainy'` and climate index to `'Chilly / Crisp'`.
  3. Select style vibe as `'Minimalist / Editorial'`.
  4. Select calendar target agenda detail as `'Creative Design Meeting'`.
  5. Click **"Synthesize Outfit Recommendation"**.
* **Expected Result**:
  * API route `POST /api/ai/recommend` matches available closet pieces to the environmental criteria.
  * UI displays cohesive styling advice with visual layout tags.
  * Recommendation reasoning card renders dynamic textual design advice.

---

### UAT-04: High-Aesthetic Image & Lookbook Generation
* **Objective**: Generate a photorealistic design preview from the compiled prompt.
* **Prerequisites**: Lookbook composition options are chosen in the editor.
* **Step-by-Step Execution**:
  1. Select style theme as `'Avant-Garde'` and model gender as `'Unisex'`.
  2. Click **"Generate Creative Lookbook Image"**.
  3. Monitor progress wheel (latency check).
* **Expected Result**:
  * System constructs a descriptive paragraph via `FashionPromptBuilder.buildOutfitPrompt()`.
  * Posts to `POST /api/image-generation/generate` where server executes Imagen 4.0 or triggers Picsum fallbacks if offline.
  * Displays a high-contrast aspect-correct image representing the specified garments.

---

### UAT-05: Look Saving & Historical Recall
* **Objective**: Persist generated model lookbooks to the cloud for retrospective styling.
* **Prerequisites**: Look generation (UAT-04) resolves successfully.
* **Step-by-Step Execution**:
  1. Locate the active look canvas.
  2. Click the **"Save to Style History"** button.
  3. Refresh the browser page or clear local client memory.
  4. Navigate to the **"Lookbook History Grid"** tab.
  5. Observe previously stored items.
* **Expected Result**:
  * Look metadata and URL are committed to `/generatedLooks` in Firestore.
  * Clearing memory does not wipe records. On refresh, `GenerationHistory.getHistory()` queries Firestore, displaying the historical entry card with its original photo asset.

---

### UAT-06: Portal Sign-Out / Session Cessation
* **Objective**: Terminate user authentication securely.
* **Prerequisites**: Standard authenticated profile session is active.
* **Step-by-Step Execution**:
  1. Locate and press **"Sign Out"** in the nav rail.
  2. Observe interface components.
* **Expected Result**:
  * Firebase Auth session tokens are invalidated client-side.
  * Wardrobe grid is hidden or cleared to prevent local DOM leaks.
  * User is prompted back to the clean authentication gate.
