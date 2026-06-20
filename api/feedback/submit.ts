import { UnifiedFashionOS } from "../../src/features/ai-core/UnifiedFashionOS";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(455).json({ error: "Method Not Allowed" });
  }

  try {
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

    if (!outfitId || !outfitName || !signal) {
      return res.status(400).json({
        error: "Missing required parameters: outfitId, outfitName, or signal are required."
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
