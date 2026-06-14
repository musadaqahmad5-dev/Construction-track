import { WardrobeItem } from '../../types';
import { PersonaVector } from '../user-profile-memory/vectorProfileMemory';

export interface ConfidenceReport {
  overallConfidence: number; // 0-100
  climateScore: number;
  preferenceScore: number;
  trendScore: number;
  cultureScore: number;
  contributingSignals: string[];
  explanation: string;
}

export class ConfidenceEngine {
  /**
   * Calculates deterministic confidence levels and signal contributors.
   */
  static evaluateOutfitConfidence(
    items: WardrobeItem[],
    vector: PersonaVector,
    temperature: number,
    weather: string,
    isTrending: boolean
  ): ConfidenceReport {
    // Climate calculation
    let climateScore = 70;
    const signals: string[] = [];
    
    const isCold = temperature < 15;
    const isWarm = temperature > 22;
    const textContext = items.map(i => `${i.title} ${i.description || ''}`).join(' ').toLowerCase();

    if (isCold) {
      if (textContext.includes('wool') || textContext.includes('knit') || textContext.includes('heavy') || textContext.includes('outerwear')) {
        climateScore += 20;
        signals.push('Thermal insulation layer matched for cooling conditions (+20%)');
      } else {
        climateScore -= 20;
        signals.push('Insufficient insulation warnings issued (-20%)');
      }
    } else if (isWarm) {
      if (textContext.includes('heavy') || textContext.includes('wool') || textContext.includes('fleece')) {
        climateScore -= 25;
        signals.push('Excess thermal traps detected for warm climate (-25%)');
      } else {
        climateScore += 15;
        signals.push('Lightweight fabrics matched for ventilation (+15%)');
      }
    } else {
      climateScore += 10;
      signals.push('Timeless modular standard layers aligned with temperate index (+10%)');
    }

    // Preference scoring based on vectors
    let preferenceScore = 50;
    let strongestVibe = 'Minimalist';
    let maxWeight = vector.minimalist;

    if (vector.streetwear > maxWeight) { strongestVibe = 'Streetwear'; maxWeight = vector.streetwear; }
    if (vector.classic > maxWeight) { strongestVibe = 'Classic'; maxWeight = vector.classic; }
    if (vector.luxury > maxWeight) { strongestVibe = 'Luxury'; maxWeight = vector.luxury; }
    if (vector.cyberpunk > maxWeight) { strongestVibe = 'Cyberpunk'; maxWeight = vector.cyberpunk; }
    if (vector.traditional > maxWeight) { strongestVibe = 'Traditional'; maxWeight = vector.traditional; }

    const matchedBonus = Math.round(maxWeight * 40);
    preferenceScore += matchedBonus;
    signals.push(`User style memory aligned strongly with ${strongestVibe} affinity vector (+${matchedBonus}%)`);

    // Trend matching
    let trendScore = isTrending ? 85 : 60;
    if (isTrending) {
      signals.push('Fuses directly with trending waves on social media (+25%)');
    } else {
      signals.push('Sustains a classic timelesness outside active trends (+0%)');
    }

    // Culture Alignment
    const cultureScore = 75;

    // Aggregate overall confidence score
    const weightedScore = Math.round(
      (climateScore * 0.35) +
      (preferenceScore * 0.35) +
      (trendScore * 0.15) +
      (cultureScore * 0.15)
    );

    const overallConfidence = Math.max(Math.min(weightedScore, 100), 10);

    // Draft precision explanation string
    const climateDelta = climateScore >= 70 ? `+${climateScore - 70}%` : `-${70 - climateScore}%`;
    const styleDelta = preferenceScore >= 50 ? `+${preferenceScore - 50}%` : `-${50 - preferenceScore}%`;
    const trendDelta = trendScore >= 60 ? `+${trendScore - 60}%` : `-${60 - trendScore}%`;

    const explanation = `Selected because climate comfort improved by ${climateDelta}, style affinity by ${styleDelta}, and trend alignment by ${trendDelta}.`;

    return {
      overallConfidence,
      climateScore,
      preferenceScore,
      trendScore,
      cultureScore,
      contributingSignals: signals,
      explanation
    };
  }
}
