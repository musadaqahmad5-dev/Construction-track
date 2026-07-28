import { UnifiedFashionOS } from "../../src/features/ai-core/UnifiedFashionOS";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: ["Request body must be a valid JSON object"]
      });
    }

    const {
      outfitId,
      outfitName,
      signal,
      predicted,
      actual,
      satisfaction,
      vibeTags,
      atmosphere,
      optionalNote
    } = req.body || {};

    const errors: string[] = [];
    if (!outfitId || typeof outfitId !== "string" || !outfitId.trim()) {
      errors.push("outfitId is required and must be a non-empty string");
    }
    if (!outfitName || typeof outfitName !== "string" || !outfitName.trim()) {
      errors.push("outfitName is required and must be a non-empty string");
    }
    if (!signal || typeof signal !== "string" || !signal.trim()) {
      errors.push("signal is required and must be a non-empty string");
    }

    if (errors.length > 0) {
      return res.status(422).json({
        success: false,
        error: "Validation failed",
        details: errors
      });
    }

    // Call Fashion OS's feedback system
    UnifiedFashionOS.receiveRealityFeedback(
      outfitId,
      outfitName,
      signal,
      predicted ?? 85,
      actual ?? 90,
      satisfaction ?? 5,
      vibeTags || ['casual'],
      atmosphere || 'steady hours',
      optionalNote || ''
    );

    UnifiedFashionOS.recalculateGoLiveGate();

    const state = UnifiedFashionOS.getState();

    return res.status(200).json({
      success: true,
      message: "Reality feedback logged successfully into UnifiedFashionOS memory loop",
      governorReport: state.systemGovernorReport
    });
  } catch (err: any) {
    console.error("[API ERROR] Feedback logging failed:", err);
    return res.status(500).json({ error: "Feedback submit failed: " + err.message });
  }
}
