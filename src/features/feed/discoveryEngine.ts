import { PersonaVector } from '../user-profile-memory/vectorProfileMemory';

export interface DiscoverySpike {
  styleCategoryOffset: string;
  recommendedAdjustments: { [key: string]: number };
  explanation: string;
  serendipityIndex: number; // 0-100 indicating distance from usual profile
}

export class DiscoveryEngine {
  static scanForDiscoverySpikes(vector: PersonaVector): DiscoverySpike {
    // Determine the user's lowest weights to push unexpected styles
    let lowestCategory = 'luxury';
    let lowestVal = vector.luxury;

    if (vector.streetwear < lowestVal) { lowestCategory = 'streetwear'; lowestVal = vector.streetwear; }
    if (vector.minimalist < lowestVal) { lowestCategory = 'minimalist'; lowestVal = vector.minimalist; }
    if (vector.cyberpunk < lowestVal) { lowestCategory = 'cyberpunk'; lowestVal = vector.cyberpunk; }
    if (vector.traditional < lowestVal) { lowestCategory = 'traditional'; lowestVal = vector.traditional; }
    if (vector.classic < lowestVal) { lowestCategory = 'classic'; lowestVal = vector.classic; }

    const recommendedAdjustments: { [key: string]: number } = {};
    recommendedAdjustments[lowestCategory] = 0.8;

    let explanation = '';
    let serendipityIndex = 85;

    if (lowestCategory === 'cyberpunk') {
      explanation = 'Unexpected fusion of utility tactical shells with clean cashmere layers.';
      serendipityIndex = 90;
    } else if (lowestCategory === 'minimalist') {
      explanation = 'Stripping back high-vibe streetwear panels in favor of silent stone drapes.';
      serendipityIndex = 82;
    } else if (lowestCategory === 'traditional') {
      explanation = 'Infusing artisan dyed traditional textures into modern streetwear silhouettes.';
      serendipityIndex = 94;
    } else {
      explanation = 'Broadening technical profiles with tailored blazer cuts and high-quality oxford shirts.';
      serendipityIndex = 78;
    }

    return {
      styleCategoryOffset: lowestCategory.toUpperCase(),
      recommendedAdjustments,
      explanation,
      serendipityIndex
    };
  }
}
