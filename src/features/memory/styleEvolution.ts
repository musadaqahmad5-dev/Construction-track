import { PersonaVector, UserStyleProfile } from '../user-profile-memory/vectorProfileMemory';

export interface StyleEvolutionState {
  userId: string;
  identityScore: number; // 0-100 indicating confidence in user's profile stability
  styleShiftIndex: number; // 0-10 indicating how rapidly preferences are shifting
  outfitConsistency: number; // 0-100 indicating how closely outfits match preferences
  shortTermMemory: Array<{ styleTag: string; action: 'like' | 'dislike'; timestamp: string }>;
  longTermIdentity: PersonaVector;
  lastUpdated: string;
}

export class StyleEvolution {
  /**
   * Generates or processes memory decay/updates to persona vectors.
   * DecayLogic states that over time, older interaction vectors decay back to the neutral 0.33 baseline,
   * allowing newer interactions to heavily dictate active recommendations (avoiding stagnation).
   */
  static applyDecayLogic(vector: PersonaVector, decayRate: number = 0.05): PersonaVector {
    const updated = { ...vector };
    const targetBaseline = 0.33; // Neutral baseline weight for a 6-vector coordinates space

    (Object.keys(updated) as Array<keyof PersonaVector>).forEach((key) => {
      const val = updated[key];
      // Gradually nudge weights back toward baseline
      if (val > targetBaseline) {
        updated[key] = Math.max(val - decayRate, targetBaseline);
      } else if (val < targetBaseline) {
        updated[key] = Math.min(val + decayRate, targetBaseline);
      }
    });

    return updated;
  }

  /**
   * Computes the consistency score between an active vector and actual selected items.
   */
  static calculateConsistency(vector: PersonaVector, shortTermList: Array<{ styleTag: string; action: 'like' | 'dislike' }>): number {
    if (shortTermList.length === 0) return 85; // healthy baseline

    let matchingScore = 0;
    shortTermList.forEach((it) => {
      const tagLower = it.styleTag.toLowerCase();
      let weight = 0.33;

      if (tagLower.includes('minimalist')) weight = vector.minimalist;
      else if (tagLower.includes('streetwear')) weight = vector.streetwear;
      else if (tagLower.includes('classic')) weight = vector.classic;
      else if (tagLower.includes('luxury')) weight = vector.luxury;
      else if (tagLower.includes('cyberpunk')) weight = vector.cyberpunk;
      else if (tagLower.includes('traditional')) weight = vector.traditional;

      if (it.action === 'like') {
        matchingScore += weight >= 0.4 ? 1 : 0.5;
      } else {
        matchingScore += weight < 0.3 ? 1 : 0.2;
      }
    });

    const val = Math.round((matchingScore / shortTermList.length) * 100);
    return Math.max(Math.min(val, 100), 40);
  }

  /**
   * Calculates the styleShiftIndex, indicating volatility/velocity of style swings.
   */
  static calculateShiftIndex(shortTermList: Array<{ styleTag: string; action: 'like' | 'dislike' }>): number {
    if (shortTermList.length < 3) return 3; // low shift activity

    // Count transitions or high polarity changes
    let shifts = 0;
    for (let i = 1; i < shortTermList.length; i++) {
      if (shortTermList[i].styleTag !== shortTermList[i - 1].styleTag) {
        shifts++;
      }
    }

    const ratio = (shifts / shortTermList.length) * 10;
    return Math.max(Math.min(parseFloat(ratio.toFixed(1)), 10.0), 1.0);
  }
}
