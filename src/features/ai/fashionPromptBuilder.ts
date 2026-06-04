import { WardrobeItem } from '../../types';
import { WeatherContext } from './weatherAdapter';
import { StyleMemory } from './profileEngine';

export class FashionPromptBuilder {
  /**
   * Constructs the full instruction package and data structures for recommended matched outfit coordination.
   */
  static buildRecommendationPrompt(
    wardrobe: WardrobeItem[],
    weather: WeatherContext,
    profile: StyleMemory,
    agenda: string = 'General Outing'
  ): { systemInstruction: string; prompt: string } {
    
    // 1. Compile wardrobe summary to feed the model
    const wardrobeText = wardrobe.map((item, idx) => {
      return `[ID: ${item.id}] "${item.title}" - ${item.category} | Colors: ${item.primaryColor || 'Neutral shade'}, ${item.secondaryColor || 'Contrast hue'} | Wear frequency: ${item.wearCount || 0}x | Season: ${item.season || 'All-Season'} | Body: ${item.description || 'No description provided'}`;
    }).join('\n');

    const systemInstruction = `You are a professional haute-couture sartorial director and elite wardrobe auditor.
Your job is to match perfect clothing items based on styling harmony, thermal levels, and personal aesthetics.

### OBJECTIVE:
Given a list of available garments, recommend a highly compatible matched outfit comprising optimal coordinates.
- Recommend between 1 to 3 items that form a logical, visually pleasing ensemble (e.g., standard Upper/Lower/Casual + Outerwear layer + optional accessory).
- Only select garments from the provided available list. Never invent IDs that are not present.
- Scoring rules: High confidence (0.8 - 0.99) should represent exceptional style compatibility, appropriate insulation level, and low wear counts (fresher items). Low confidence means wardrobe limitations require mismatched pieces.

### SYSTEM BOUNDS & GUARDRAILS:
1. NEVER overwrite or alter the active wardrobe database files directly.
2. NEVER prescribe item deletions or auto-washing statuses.
3. Keep results precise. Strictly follow the requested JSON schema.`;

    const prompt = `### CONTEXT:
1. AVAILABLE WARDROBE PIECES:
${wardrobeText}

2. METEOROLOGICAL STATE:
- Current weather: ${weather.condition} (${weather.tempRange})
- Key physical focus: ${weather.keySartorialFocus}
- Thermoregulation recommendation: ${weather.layeringNeeds ? 'Layering highly suggested' : 'Lightweight breathable options'}

3. STYLE MEMORY PROFILE:
- Preferred Vibe Mode: "${profile.styleMode}" aesthetics (minimalist, classic, streetwear, vintage, bold)
- Favorite colorways: ${profile.favoriteColors.join(', ')}
- Repeat Patterns / Textures in use: ${profile.repeatPatterns.join(', ')}
- Colors to avoid (to rest fabric fibers): ${profile.avoidHistory.join(', ') || 'None'}

4. MORNING AGENDA:
- Forecasted Agenda setting: "${agenda}"

### REQUEST:
Select the best matched items from the available garments. Provide:
1. 'todaySuggestion': list of item IDs forming the outfit ensemble.
2. 'tomorrowSuggestion': list of alternative item IDs for staging if requested (else empty).
3. 'confidence': numeric score (0.0 to 1.0) indicating how perfectly this matches the weather, agenda, and style profile.
4. 'reasoning': a concise, beautiful explanation justifying the combination and describing the layering architecture with precision (2-3 sentences max).

Ensure your output is a single JSON block. Do NOT include any codeblocks or markdown wraps outside of standard JSON if asked. Just output standard raw JSON conforming directly to this structure.`;

    return { systemInstruction, prompt };
  }

  /**
   * Constructs the strategy prompt for a single garment styling recommendation.
   */
  static buildSingleGarmentStrategyPrompt(
    title: string,
    category: string,
    description: string
  ): { systemInstruction: string; prompt: string } {
    const systemInstruction = `You are an elite wardrobe architect. Provide professional, crisp, tactical styling tips for a single garment. Keeping advice actionable, stylish, and brief.`;
    
    const prompt = `Focus garment:
Name: "${title}"
Category: "${category}"
Details: "${description}"

Provide:
1. Perfect color combinations (neutrals vs. accents)
2. Layering/silhouette advice (e.g. relaxed, tailored contrast)
3. Typical occasion appropriateness for this specific item

Format output as professional, clear Markdown list nodes with emojis. Max 4-5 bullet points.`;

    return { systemInstruction, prompt };
  }
}
