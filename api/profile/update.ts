import { UnifiedFashionOS } from "../../src/features/ai-core/UnifiedFashionOS";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(455).json({ error: "Method Not Allowed" });
  }

  try {
    const { userId, styleVector, vibe } = req.body || {};

    if (!userId) {
      return res.status(400).json({ error: "Missing required parameter: userId" });
    }

    // Sync state into UnifiedFashionOS in-memory store
    const state = UnifiedFashionOS.getState();
    if (styleVector && Array.isArray(styleVector)) {
      state.unifiedStyleMemory.user_preferences_vector = styleVector;
    }

    UnifiedFashionOS.recalculateGoLiveGate();

    return res.status(200).json({
      success: true,
      message: "Style profile vector updated on server state",
      userId,
      vector: state.unifiedStyleMemory.user_preferences_vector,
      governorReport: state.systemGovernorReport
    });
  } catch (err: any) {
    console.error("[API ERROR] Profile update failed:", err);
    return res.status(500).json({ error: "Failed to update profile: " + err.message });
  }
}
