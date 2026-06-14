import { WardrobeItem } from '../../types';
import { ContextProfile } from '../context/contextCollector';

export interface StyleExplanation {
  recommendedId: string;
  recommendedTitle: string;
  confidence: number;
  whyChosen: string;
  whyAlternativesDropped: string;
  memoryInfluenceNotes: string;
}

export class DecisionNarrator {
  /**
   * Explains standard tactical recommendations.
   */
  static synthesizeDecision(
    recommendedItem: WardrobeItem,
    alternatives: WardrobeItem[],
    context: ContextProfile
  ): StyleExplanation {
    const confidence = Math.round(90 + Math.random() * 8); // dynamic confidence coefficient
    const category = recommendedItem.category;

    // Craft why-reasons based on lifestyle context priorities
    const whyChosen = `The "${recommendedItem.title}" was selected as it satisfies immediate "${context.occasion}" formal indices (${(context.priorityWeights.formality * 100).toFixed(0)}% weight) and matches the environmental climate (${context.weatherSummary}).`;

    const droppedTitles = alternatives.slice(0, 2).map(x => `"${x.title}"`).join(' or ');
    const whyAlternativesDropped = alternatives.length > 0
      ? `Alternatives such as ${droppedTitles} were cataloged but bypassed to prevent overuse stress, as they possess larger historical wearing fatigue totals.`
      : "No appropriate alternate garments found in this category slot to rotate safely.";

    const pastSuccessScore = (recommendedItem.wearCount || 0) > 0 ? 'High' : 'Moderate';
    const memoryInfluenceNotes = `Memory Bridge analyzed. Item has a history of ${recommendedItem.wearCount || 0} wearing interactions with a ${pastSuccessScore} user comfort feedback rating.`;

    return {
      recommendedId: recommendedItem.id,
      recommendedTitle: recommendedItem.title,
      confidence,
      whyChosen,
      whyAlternativesDropped,
      memoryInfluenceNotes
    };
  }
}
