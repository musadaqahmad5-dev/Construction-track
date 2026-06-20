import { UnifiedFashionOS } from "../../src/features/ai-core/UnifiedFashionOS";

function parseTopOutfits(primary: any, alternatives: any[]): any[] {
  const list: any[] = [];
  if (primary) {
    list.push({
      id: primary.id || "primary-look",
      name: primary.name || "Default Curated Look",
      items: primary.items || [],
      suitabilityScore: primary.suitabilityScore || 90,
      explanation: primary.explanation || "Primary custom recommendations.",
      styleIdentity: primary.styleIdentity || "Slate Minimalist",
      gravityMatch: primary.gravityMatch || "High",
    });
  }
  
  alternatives.forEach((alt, idx) => {
    list.push({
      id: alt.id || `alt-look-${idx}`,
      name: alt.name || `Alternative Silhouette ${idx + 1}`,
      items: alt.items || [],
      suitabilityScore: alt.suitabilityScore ?? alt.score ?? 80,
      explanation: alt.explanation ?? alt.reason ?? "Expanded coordination options.",
      styleIdentity: alt.styleIdentity || "Smart Casual Blend",
      gravityMatch: alt.gravityMatch || "Medium",
    });
  });
  
  return list;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(455).json({ error: "Method Not Allowed" });
  }

  try {
    const { wardrobe, userProfile } = req.body || {};
    const wardrobeItems = Array.isArray(wardrobe) ? wardrobe : [];
    
    // Seed wardrobe items to the global state (in-memory for this server request)
    if (wardrobeItems.length > 0) {
      UnifiedFashionOS.syncWardrobeItems(wardrobeItems);
    }
    
    // Seed user preference weights vector if provided
    if (userProfile?.user_preferences_vector) {
      UnifiedFashionOS.getState().unifiedStyleMemory.user_preferences_vector = userProfile.user_preferences_vector;
    }
    
    // Execute the completed 3-core engine layers
    UnifiedFashionOS.generateOutfit(wardrobeItems, "Today's Styled Spread");
    UnifiedFashionOS.recalculateGoLiveGate(); // triggers Governor Loop updates dynamically!
    
    const state = UnifiedFashionOS.getState();
    const currentSuggestion = state.activeSuggestion;
    
    // Gather top 10 suggestions (using alternativeOutfits array)
    const parsedAlternatives = state.alternativeOutfits || [];
    const suggestions = parseTopOutfits(currentSuggestion, parsedAlternatives);
    
    return res.status(200).json({
      success: true,
      outfits: suggestions.slice(0, 10),
      styleIdentity: 'Balanced Slate Aesthetic',
      gravityMatch: 'High',
      stylistNotes: (currentSuggestion as any)?.explanation || 'A curated selection adapted for your temporal rhythm.',
      governorReport: state.systemGovernorReport
    });
  } catch (err: any) {
    console.error("[API ERROR] Stylist generation pipeline failed:", err);
    return res.status(500).json({ error: "SaaS generation failed: " + err.message });
  }
}
