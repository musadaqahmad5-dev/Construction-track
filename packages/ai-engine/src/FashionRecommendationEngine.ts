import { UserStyleProfile } from "../../memory-engine/src/StyleMemorySystem";
import { Garment } from "./OutfitRecommender";
import { FashionTrend } from "./TrendDetector";

export interface RecommendationContext {
  occasion: string;
  season?: string;
  temperatureCelsius?: number;
  trendWeight: number; // 0.0 to 1.0 (how heavily to weight current macro trends over traditional user DNA)
}

export interface ScoredGarment {
  garment: Garment;
  scores: {
    personalizationScore: number; // User style DNA cosine alignment
    trendScore: number;           // Alignment with active fashion trends
    seasonScore: number;          // Seasonal appropriateness
    harmonyScore: number;         // Palette / color wheel synergy
    totalScore: number;           // Weighted composite ranking score
  };
}

export interface RecommendationResponse {
  curatedEnsembles: Array<{
    name: string;
    items: Garment[];
    compositeFitnessScore: number;
    designRationale: string;
  }>;
  rankedIndividualGarments: ScoredGarment[];
  scoringWeightsApplied: {
    dnaPersonalization: number;
    trendInfluence: number;
    seasonalContext: number;
  };
}

export class FashionRecommendationEngine {
  constructor() {
    console.log("[RECOMMENDATION ENGINE] Real-time fashion recommendation processor initialized.");
  }

  /**
   * 1. PERSONALIZATION SCORING SYSTEM
   * Computes the mathematical affinity of a garment against a user's Style DNA.
   */
  public calculatePersonalizationScore(profile: UserStyleProfile, garment: Garment): number {
    let score = 0.5; // Base line neutral score

    // Weight 1: Archetype matching based on tags
    let archetypeSum = 0;
    let matchingArchetypesCount = 0;
    garment.tags.forEach(tag => {
      // Find matches in user's preferred archetypes
      for (const [archetype, weight] of Object.entries(profile.preferences.archetypes)) {
        if (archetype.toLowerCase().includes(tag.toLowerCase()) || tag.toLowerCase().includes(archetype.toLowerCase())) {
          archetypeSum += weight;
          matchingArchetypesCount++;
        }
      }
    });
    if (matchingArchetypesCount > 0) {
      score += (archetypeSum / matchingArchetypesCount) * 0.3;
    }

    // Weight 2: Dominant color check
    const hexColor = garment.color.toUpperCase();
    if (profile.preferences.dominantColors.some(c => c.toUpperCase() === hexColor)) {
      score += 0.15;
    }

    // Weight 3: Hard exclusion rules (Zeroing out or heavily penalizing excluded colors/silhouettes)
    if (profile.preferences.excludedColors.some(c => c.toUpperCase() === hexColor)) {
      score -= 0.45;
    }
    if (profile.preferences.favoredSilhouettes.some(s => s.toLowerCase() === garment.silhouette.toLowerCase())) {
      score += 0.1;
    }

    return Math.max(0.0, Math.min(1.0, score));
  }

  /**
   * 2. TREND INFLUENCE WEIGHTING
   * Computes how well a garment matches the active global micro and macro trends.
   */
  public calculateTrendScore(garment: Garment, activeTrends: FashionTrend[]): number {
    if (!activeTrends || activeTrends.length === 0) return 0.5;

    let score = 0.0;
    let matchedTrends = 0;

    activeTrends.forEach(trend => {
      let isMatch = false;

      // Check silhouette intersection
      if (trend.keySilhouettes.some(s => s.toLowerCase() === garment.silhouette.toLowerCase())) {
        isMatch = true;
      }

      // Check material intersection
      if (trend.recommendedMaterials.some(m => m.toLowerCase() === garment.material.toLowerCase())) {
        isMatch = true;
      }

      // Check color intersection
      if (trend.coreColors.some(c => c.toLowerCase() === garment.color.toLowerCase())) {
        isMatch = true;
      }

      if (isMatch) {
        // Higher trajectories (e.g. rising) and higher sentiments give larger boosts
        const trajectoryWeight = trend.trajectory === "rising" ? 1.0 : trend.trajectory === "peaking" ? 0.8 : 0.4;
        score += trend.sentimentScore * trajectoryWeight;
        matchedTrends++;
      }
    });

    return matchedTrends > 0 ? Math.min(1.0, score / matchedTrends) : 0.1;
  }

  /**
   * 3. SEASONAL & ENVIRONMENTAL APPROPRIATENESS SCORING
   */
  public calculateSeasonalScore(garment: Garment, season?: string, tempCelsius?: number): number {
    let score = 0.7; // Base appropriate level

    if (tempCelsius !== undefined) {
      // Hot weather filters (tops/bottoms preferred over heavy outerwear)
      if (tempCelsius > 28) {
        if (garment.category === "outerwear") score -= 0.5;
        if (garment.material.toLowerCase() === "wool") score -= 0.4;
        if (garment.material.toLowerCase() === "linen") score += 0.2;
      } 
      // Cold weather filters (outerwear, heavy materials boosted)
      else if (tempCelsius < 10) {
        if (garment.category === "outerwear") score += 0.25;
        if (garment.material.toLowerCase() === "wool") score += 0.2;
      }
    }

    if (season) {
      const s = season.toLowerCase();
      if (s === "summer" && garment.material.toLowerCase() === "linen") score += 0.1;
      if (s === "winter" && garment.category === "outerwear") score += 0.15;
    }

    return Math.max(0.0, Math.min(1.0, score));
  }

  /**
   * 4. HIGH-PERFORMANCE MULTI-DIMENSIONAL RANKING SYSTEM
   * Ranks candidate garments and compiles cohesive ensembles using weighted factors.
   */
  public generateRecommendations(
    profile: UserStyleProfile,
    candidates: Garment[],
    activeTrends: FashionTrend[],
    context: RecommendationContext
  ): RecommendationResponse {
    console.log(`[RECOMMENDATION ENGINE] Processing candidate set of ${candidates.length} garments.`);

    // Define multi-dimensional weights dynamically based on context trend bias
    const wTrend = context.trendWeight;
    const wDna = 1.0 - wTrend;
    const wSeason = 0.2; // Constant seasonal weight multiplier

    // Score and rank individual items
    const scoredGarments: ScoredGarment[] = candidates.map(garment => {
      const personalizationScore = this.calculatePersonalizationScore(profile, garment);
      const trendScore = this.calculateTrendScore(garment, activeTrends);
      const seasonScore = this.calculateSeasonalScore(garment, context.season, context.temperatureCelsius);

      // Compute weighted composite score
      const totalScore = (personalizationScore * wDna) + (trendScore * wTrend) + (seasonScore * wSeason);
      const normalizedTotalScore = totalScore / (wDna + wTrend + wSeason);

      return {
        garment,
        scores: {
          personalizationScore,
          trendScore,
          seasonScore,
          harmonyScore: 0.8, // Baseline color harmonic factor
          totalScore: Math.round(normalizedTotalScore * 100) / 100
        }
      };
    });

    // Sort descending by highest composite score
    const rankedIndividualGarments = scoredGarments.sort((a, b) => b.scores.totalScore - a.scores.totalScore);

    // Group items into categories to synthesize coordinate ensembles
    const tops = rankedIndividualGarments.filter(g => g.garment.category === "top").slice(0, 3);
    const bottoms = rankedIndividualGarments.filter(g => g.garment.category === "bottom").slice(0, 3);
    const outerwear = rankedIndividualGarments.filter(g => g.garment.category === "outerwear").slice(0, 2);
    const footwear = rankedIndividualGarments.filter(g => g.garment.category === "footwear").slice(0, 2);

    const curatedEnsembles: Array<{
      name: string;
      items: Garment[];
      compositeFitnessScore: number;
      designRationale: string;
    }> = [];

    // Formulate a high-harmony casual or formal ensemble based on occasion context
    if (tops.length > 0 && bottoms.length > 0) {
      const top = tops[0];
      const bottom = bottoms[0];
      const outer = outerwear[0];
      const shoes = footwear[0];

      const ensembleItems: Garment[] = [top.garment, bottom.garment];
      if (outer) ensembleItems.push(outer.garment);
      if (shoes) ensembleItems.push(shoes.garment);

      const scoreSum = top.scores.totalScore + bottom.scores.totalScore + (outer?.scores.totalScore || 0) + (shoes?.scores.totalScore || 0);
      const compositeFitnessScore = Math.round((scoreSum / ensembleItems.length) * 100) / 100;

      curatedEnsembles.push({
        name: `Curated Elite ${context.occasion} Coordinate`,
        items: ensembleItems,
        compositeFitnessScore,
        designRationale: `A balanced styling ensemble assembled specifically for ${context.occasion}, pairing a ${top.garment.color} ${top.garment.silhouette} silhouette with a structured ${bottom.garment.color} base, tailored to match your personal Style DNA with ${Math.round(wTrend * 100)}% trend-forward influence weighting.`
      });
    }

    return {
      curatedEnsembles,
      rankedIndividualGarments,
      scoringWeightsApplied: {
        dnaPersonalization: wDna,
        trendInfluence: wTrend,
        seasonalContext: wSeason
      }
    };
  }
}
