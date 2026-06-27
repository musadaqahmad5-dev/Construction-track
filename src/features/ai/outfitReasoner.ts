import { WardrobeItem } from '../../types';
import { WeatherContext } from './weatherAdapter';
import { StyleMemory } from './profileEngine';

export interface ScoreReport {
  itemId: string;
  item: WardrobeItem;
  score: number;
  reasons: string[];
}

export interface OutfitRecommendationResult {
  todaySuggestion: string[];        // Array of WardrobeItem IDs
  tomorrowSuggestion: string[];     // Array of WardrobeItem IDs (alternative secondary)
  confidence: number;
  reasoning: string;
}

export class OutfitReasoner {
  /**
   * Performs local, robust deterministic scoring, ranking, and selection.
   * Serving as both the backbone score mechanism and a flawless fallback engine when Gemini API is offline.
   */
  static reason(
    wardrobe: WardrobeItem[],
    weather: WeatherContext,
    profile: StyleMemory,
    agenda: string
  ): OutfitRecommendationResult {
    if (!wardrobe || wardrobe.length === 0) {
      return {
        todaySuggestion: [],
        tomorrowSuggestion: [],
        confidence: 0.1,
        reasoning: "Wardrobe is completely empty. No items registered to analyze style rules."
      };
    }

    // Filter to available items (In Closet)
    const availableItems = wardrobe.filter(item => item.status === 'In Closet');
    if (availableItems.length === 0) {
      return {
        todaySuggestion: wardrobe.slice(0, 2).map(i => i.id),
        tomorrowSuggestion: [],
        confidence: 0.3,
        reasoning: "No clean clothes remaining 'In Closet'. Defaulting to worn items as fallback matching set."
      };
    }

    // 1. COLLECT & SCORE each garment independently
    const reports: ScoreReport[] = availableItems.map(item => {
      let score = 50; // base score
      const reasons: string[] = [];

      // Warmth/Weather adjustment
      const isWarmWeat = ['sunny', 'summer', 'warm'].some(x => weather.condition.toLowerCase().includes(x));
      const isColdWeat = ['cold', 'winter', 'snow', 'rain', 'breezy'].some(x => weather.condition.toLowerCase().includes(x));

      if (isWarmWeat) {
        if (item.category === 'Casual' || item.category === 'Sportswear' || item.category === 'Accessories') {
          score += 15;
          reasons.push("Lightweight category aligns with warm weather indicators");
        }
        if (item.season === 'Summer' || item.season === 'Spring') {
          score += 15;
          reasons.push("Summer-focused fabrics support breathability expectations");
        } else if (item.season === 'Winter') {
          score -= 20;
          reasons.push("Heavier winter items penalized for summer heat");
        }
      } else if (isColdWeat) {
        if (item.category === 'Outerwear' || item.category === 'Formal') {
          score += 15;
          reasons.push("Structured layers or outerwear fit thermal defense goals");
        }
        if (item.season === 'Winter' || item.season === 'Autumn') {
          score += 15;
          reasons.push("High heat-retention fabrics balance cold conditions");
        } else if (item.season === 'Summer') {
          score -= 20;
          reasons.push("Lightweight summer piece provides insufficient thermal barrier");
        }
      }

      // Profile aesthetics matching
      if (profile.styleMode === 'minimalist') {
        const minimalColors = ['Pitch Black', 'Minimalist White', 'Oatmeal Beige', 'Gray', 'Slate'];
        if (minimalColors.includes(item.primaryColor || '')) {
          score += 15;
          reasons.push("Neutral shading corresponds with minimalist coordinates");
        }
      } else if (profile.styleMode === 'streetwear') {
        if (item.category === 'Casual' || item.category === 'Sportswear') {
          score += 10;
          reasons.push("Relaxed profiles compliment street comfort focus");
        }
      }

      // Wear fatigue control
      const wearCount = item.wearCount || 0;
      if (wearCount >= 5) {
        score -= 20;
        reasons.push("Wear fatigue alert: Garment should rest to preserve fabric contours");
      } else if (wearCount === 0) {
        score += 10;
        reasons.push("Garment is brand new or rotated low; boosts novelty score");
      }

      // Favorite brand preference boost
      if (profile.favoriteBrands) {
        const matchedBrand = profile.favoriteBrands.find(b => 
          item.title.toLowerCase().includes(b.toLowerCase()) || 
          (item.description || '').toLowerCase().includes(b.toLowerCase())
        );
        if (matchedBrand) {
          score += 15;
          reasons.push(`Matches favored brand: "${matchedBrand}"`);
        }
      }

      // Repetition fatigue control (avoid recommending items in saved outfits or recent recommendations)
      let isRecentlyUsed = false;
      if (profile.savedOutfitsDetails) {
        profile.savedOutfitsDetails.forEach(detail => {
          if (detail.includes(item.id)) {
            isRecentlyUsed = true;
          }
        });
      }
      if (profile.recentHistoryDetails) {
        profile.recentHistoryDetails.forEach(detail => {
          if (detail.includes(item.id)) {
            isRecentlyUsed = true;
          }
        });
      }
      if (isRecentlyUsed) {
        score -= 15;
        reasons.push("Item rest: item was recently recommended or saved in looks");
      }

      // Agenda suitability
      const agendaLower = agenda.toLowerCase();
      if (agendaLower.includes('work') || agendaLower.includes('office') || agendaLower.includes('formal')) {
        if (item.category === 'Formal' || item.category === 'Outerwear') {
          score += 15;
          reasons.push("Formal blazer / layering structures match standard office business agendas");
        }
      } else if (agendaLower.includes('sport') || agendaLower.includes('gym') || agendaLower.includes('active')) {
        if (item.category === 'Sportswear') {
          score += 20;
          reasons.push("Active apparel selection is highly cohesive with physical tasks");
        }
      } else { // Casual/Social
        if (item.category === 'Casual' || item.category === 'Accessories') {
          score += 10;
          reasons.push("Informal comfortable styles match casual relaxed agendas");
        }
      }

      return {
        itemId: item.id,
        item,
        score,
        reasons
      };
    });

    // 2. RANK reports descending
    reports.sort((a, b) => b.score - a.score);

    // 3. EXPLAIN & SUGGEST
    // Construct matched set: pick top items from different categories if possible, or top 2 items
    const suggestedToday: string[] = [];
    const suggestedTomorrow: string[] = [];

    // Let's pick 1 Principal piece (Casual, Formal, Sportswear)
    const principalItem = reports.find(r => ['Casual', 'Formal', 'Sportswear'].includes(r.item.category));
    if (principalItem) {
      suggestedToday.push(principalItem.itemId);
    }

    // Let's pick 1 layering/outerwear piece
    const layeringItem = reports.find(r => r.item.category === 'Outerwear' && r.itemId !== principalItem?.itemId);
    if (layeringItem) {
      suggestedToday.push(layeringItem.itemId);
    }

    // Let's pick 1 accessory
    const accessoryItem = reports.find(r => r.item.category === 'Accessories' && r.itemId !== principalItem?.itemId && r.itemId !== layeringItem?.itemId);
    if (accessoryItem) {
      suggestedToday.push(accessoryItem.itemId);
    }

    // Fallbacks if set compilation is insufficient
    if (suggestedToday.length === 0 && reports.length > 0) {
      suggestedToday.push(reports[0].itemId);
      if (reports.length > 1) suggestedToday.push(reports[1].itemId);
    }

    // Get tomorrow suggestions (e.g. next top available entries not chosen for today)
    reports.forEach(r => {
      if (!suggestedToday.includes(r.itemId) && suggestedTomorrow.length < 2) {
        suggestedTomorrow.push(r.itemId);
      }
    });

    const highestScore = reports[0]?.score || 50;
    const normalizedConfidence = Math.min(Math.max((highestScore - 20) / 100, 0.4), 0.95);

    // Reasonings list
    const topItemReasons = reports[0]?.reasons.slice(0, 2).join(' and ') || 'balanced garment rotation';
    const reasoning = `Coordinating a customized ${profile.styleMode} look for your ${agenda} agenda, optimized for ${weather.condition} conditions. We prioritize ${reports[0]?.item.title || 'selected coordinates'} because ${topItemReasons || 'it rotationally maintains clothing variety'}.`;

    return {
      todaySuggestion: suggestedToday,
      tomorrowSuggestion: suggestedTomorrow,
      confidence: Math.round(normalizedConfidence * 100) / 100,
      reasoning
    };
  }
}
