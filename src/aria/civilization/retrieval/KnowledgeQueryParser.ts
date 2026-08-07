/**
 * ARIA v2.6 Knowledge Query Parser
 * Product: LOOK VISION v2.4
 * 
 * Converts user prompt, context, occasion, and style intent into structured query inputs
 * for Civilization Memory Graph retrieval.
 */

import { KnowledgeNodeType, KnowledgeRetrievalQuery } from '../CivilizationMemoryTypes';
import { ParsedUserIntent } from './RetrievalTypes';

export class KnowledgeQueryParser {
  /**
   * Parses raw prompt or context request into structured ParsedUserIntent
   */
  public static parseUserIntent(
    rawInput: {
      userPrompt?: string;
      occasion?: string;
      season?: string;
      styleGoals?: string[];
      personality?: string;
      wardrobeContext?: string;
      formalityRequirement?: number;
      preferredPalette?: string[];
    },
    userId: string = 'guest_user'
  ): ParsedUserIntent {
    const rawPrompt = rawInput.userPrompt || rawInput.occasion || 'General Fashion Styling';
    const promptLower = rawPrompt.toLowerCase();

    // Keywords extraction
    const extractedKeywords: string[] = [];
    const knownTerms = [
      'minimalism', 'quiet luxury', '90s', 'cashmere', 'silk', 'linen', 'wool',
      'tailored', 'executive', 'boardroom', 'casual', 'streetwear', 'chic', 'parisian',
      'monochrome', 'the row', 'phoebe philo', 'summer', 'winter', 'autumn', 'spring',
      'formal', 'travel', 'resort', 'cocktail', 'gala'
    ];

    knownTerms.forEach((term) => {
      if (promptLower.includes(term)) {
        extractedKeywords.push(term);
      }
    });

    // Detect target node types
    const targetNodeTypes: KnowledgeNodeType[] = [];
    if (promptLower.includes('formal') || promptLower.includes('meeting') || promptLower.includes('gala') || promptLower.includes('office') || rawInput.occasion) {
      targetNodeTypes.push('Occasion');
    }
    if (promptLower.includes('linen') || promptLower.includes('cashmere') || promptLower.includes('silk') || promptLower.includes('wool') || promptLower.includes('fabric')) {
      targetNodeTypes.push('Material');
    }
    if (promptLower.includes('tailored') || promptLower.includes('oversized') || promptLower.includes('silhouette') || promptLower.includes('fit')) {
      targetNodeTypes.push('Silhouette');
    }
    if (promptLower.includes('minimal') || promptLower.includes('luxury') || promptLower.includes('chic') || promptLower.includes('street')) {
      targetNodeTypes.push('Style Archetype');
    }
    if (promptLower.includes('monochrome') || promptLower.includes('color') || promptLower.includes('palette') || promptLower.includes('neutral')) {
      targetNodeTypes.push('Color Theory');
    }

    if (targetNodeTypes.length === 0) {
      targetNodeTypes.push('Style Archetype', 'Occasion', 'Material', 'Color Theory', 'Silhouette');
    }

    // Infer season if missing
    let season = rawInput.season;
    if (!season) {
      if (promptLower.includes('summer') || promptLower.includes('resort') || promptLower.includes('heat') || promptLower.includes('warm')) {
        season = 'Summer';
      } else if (promptLower.includes('winter') || promptLower.includes('cold') || promptLower.includes('snow')) {
        season = 'Winter';
      } else if (promptLower.includes('autumn') || promptLower.includes('fall')) {
        season = 'Autumn';
      } else if (promptLower.includes('spring')) {
        season = 'Spring';
      } else {
        season = 'All Season';
      }
    }

    // Infer formality requirement (0.0 to 1.0)
    let formality = rawInput.formalityRequirement;
    if (formality === undefined) {
      if (promptLower.includes('boardroom') || promptLower.includes('executive') || promptLower.includes('gala') || promptLower.includes('black tie')) {
        formality = 0.95;
      } else if (promptLower.includes('office') || promptLower.includes('business') || promptLower.includes('meeting')) {
        formality = 0.8;
      } else if (promptLower.includes('casual') || promptLower.includes('weekend') || promptLower.includes('streetwear')) {
        formality = 0.35;
      } else {
        formality = 0.65;
      }
    }

    return {
      rawPrompt,
      occasion: rawInput.occasion || (formality >= 0.8 ? 'Executive & Business' : 'Everyday Elegant'),
      season,
      styleGoals: rawInput.styleGoals || ['Sophisticated Elegance', 'Versatile Wardrobe Synergy'],
      personalityTraits: rawInput.personality ? [rawInput.personality] : ['Refined', 'Confident'],
      wardrobeContext: rawInput.wardrobeContext || 'Owned closet items prioritized',
      targetNodeTypes,
      preferredPalette: rawInput.preferredPalette || ['Black', 'Ivory', 'Slate Gray', 'Camel'],
      formalityRequirement: formality,
      extractedKeywords
    };
  }

  /**
   * Converts ParsedUserIntent into KnowledgeRetrievalQuery
   */
  public static buildQuery(parsedIntent: ParsedUserIntent, userId: string = 'guest_user'): KnowledgeRetrievalQuery {
    return {
      queryText: parsedIntent.rawPrompt,
      userId,
      targetNodeTypes: parsedIntent.targetNodeTypes,
      minConfidence: 0.5,
      minStrength: 0.5,
      limit: 25
    };
  }
}
