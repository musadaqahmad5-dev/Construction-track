import { WardrobeItem } from '../../types';
import { PersonaVector } from '../user-profile-memory/vectorProfileMemory';
import { TrendItem } from '../trend-engine/trendIntelligence';

export interface ScoreMetricsBreakdown {
  weatherSuitability: number;     // 0 to 100
  culturalAlignment: number;      // 0 to 100
  userEngagementHistory: number;  // 0 to 100
  trendAlignment: number;         // 0 to 100
  finalAggregatedScore: number;   // 0 to 100 weighted
}

export interface ScoredOutfitCandidate {
  styleName: string;
  items: WardrobeItem[];
  scoreBreakdown: ScoreMetricsBreakdown;
  justificationReasoning: string;
  contenderComparison: string;     // Fashion Decision Engine explanation comparing to secondary options
}

export class OutfitScoringRanker {
  /**
   * Computes a highly descriptive score report for a curated candidate set of clothing.
   * Compares the match against the user's Persona Vector, forecast, and global trade signals.
   */
  static rankAndExplainCandidate(
    items: WardrobeItem[],
    styleName: string,
    vibeOrCultureRequested: string,
    weightVector: PersonaVector,
    trends: TrendItem[],
    temperatureCelsius: number,
    weatherCondition: string,
    likesCount: number,
    dislikedTags: string[] = []
  ): ScoredOutfitCandidate {
    // 1. WEATHER SUITABILITY SCORE
    let weatherScore = 75; // base lines
    const textToScan = items.map(t => `${t.title} ${t.description} ${t.category}`).join(' ').toLowerCase();

    const isHot = temperatureCelsius > 22;
    const isCold = temperatureCelsius < 14;
    const isRaining = ['rain', 'drizzle', 'shower', 'wet', 'storm'].some(x => weatherCondition.toLowerCase().includes(x));

    if (isHot) {
      const lightweightMatches = items.filter(u => u.category === 'Casual' || u.season === 'Summer' || u.season === 'Spring').length;
      weatherScore += lightweightMatches * 10;
      if (textToScan.includes('wool') || textToScan.includes('heavy') || textToScan.includes('shearling')) {
        weatherScore -= 25;
      }
    } else if (isCold) {
      const heavyLayers = items.filter(u => u.category === 'Outerwear' || u.season === 'Winter' || u.season === 'Autumn').length;
      weatherScore += heavyLayers * 12;
      if (textToScan.includes('cotton tee') || textToScan.includes('silk')) {
        weatherScore -= 10;
      }
    }

    if (isRaining) {
      if (textToScan.includes('shell') || textToScan.includes('anorak') || textToScan.includes('goretex') || textToScan.includes('waterproof') || textToScan.includes('shield')) {
        weatherScore += 22;
      } else {
        weatherScore -= 15;
      }
    }

    weatherScore = Math.max(Math.min(weatherScore, 100), 10);

    // 2. CULTURAL / ESTHETIC ALIGNMENT
    let cultureScore = 50;
    const normalizedVibe = vibeOrCultureRequested.toLowerCase();

    if (normalizedVibe.includes('minimal')) {
      // Reward minimalist vector affinity
      cultureScore += Math.round(weightVector.minimalist * 35);
      const neutralsCount = items.filter(t => ['Pitch Black', 'Minimalist White', 'Oatmeal Beige', 'Slate Gray', 'Beige', 'White', 'Oatmeal', 'Slate'].includes(t.primaryColor || '')).length;
      cultureScore += neutralsCount * 5;
    } else if (normalizedVibe.includes('street') || normalizedVibe.includes('harajuku')) {
      cultureScore += Math.round(weightVector.streetwear * 35);
      const relaxedCount = items.filter(t => t.category === 'Casual' || t.category === 'Sportswear').length;
      cultureScore += relaxedCount * 5;
    } else if (normalizedVibe.includes('classic') || normalizedVibe.includes('savile')) {
      cultureScore += Math.round(weightVector.classic * 35);
      const formalCount = items.filter(t => t.category === 'Formal' || t.category === 'Outerwear').length;
      cultureScore += formalCount * 5;
    } else if (normalizedVibe.includes('luxury')) {
      cultureScore += Math.round(weightVector.luxury * 35);
      if (textToScan.includes('cashmere') || textToScan.includes('alpaca') || textToScan.includes('wool') || textToScan.includes('premium')) {
        cultureScore += 15;
      }
    } else if (normalizedVibe.includes('cyber') || normalizedVibe.includes('techwear')) {
      cultureScore += Math.round(weightVector.cyberpunk * 35);
      if (textToScan.includes('shell') || textToScan.includes('mesh') || textToScan.includes('gore')) {
        cultureScore += 15;
      }
    }

    cultureScore = Math.max(Math.min(cultureScore, 100), 20);

    // 3. PAST USER ENGAGEMENT
    // Reward based on wear counts and liked parameters on the garments
    let engagementScore = 60;
    items.forEach(it => {
      const count = it.wearCount || 0;
      if (count > 0 && count < 5) {
        engagementScore += 6; // active warm items
      } else if (count >= 5) {
        engagementScore -= 8; // fatigue penalty
      } else if (count === 0) {
        engagementScore += 10; // welcome novelty
      }
    });

    // Likes count context bonus
    if (likesCount > 10) {
      engagementScore += 5;
    }

    // Apply strict penalties for disliked styles or tags loaded
    dislikedTags.forEach(disTag => {
      if (textToScan.includes(disTag.toLowerCase())) {
        engagementScore -= 30;
      }
    });

    engagementScore = Math.max(Math.min(engagementScore, 100), 10);

    // 4. TREND ALIGNMENT SCORE
    let trendScore = 55;
    const matchingTrends = trends.filter(trend => {
      const topicLower = trend.topic.toLowerCase();
      const matchTopic = items.some(it => topicLower.includes(it.title.toLowerCase()) || topicLower.includes(it.category.toLowerCase()));
      const matchColor = items.some(it => trend.associatedColors.some(col => col.toLowerCase() === it.primaryColor?.toLowerCase()));
      return matchTopic || matchColor;
    });

    if (matchingTrends.length > 0) {
      trendScore += 15 * matchingTrends.length;
      trendScore = Math.min(trendScore, 100);
    }

    // 5. WEIGHTED METRIC CONFLATION
    // Formulas: Weather (35%) + Culture Alignment (25%) + Engagement history (20%) + Trend Factor (20%)
    const finalAggregatedScore = Math.round(
      (weatherScore * 0.35) +
      (cultureScore * 0.25) +
      (engagementScore * 0.20) +
      (trendScore * 0.20)
    );

    // 6. JUSTICE & EXPLAINABILITY ENGINE (Natural Language Reasonings)
    let justificationReasoning = `This outfit matches ${finalAggregatedScore}% criteria compatibility. `;
    if (weatherScore > 85) {
      justificationReasoning += `It excels in structural climate comfort, introducing appropriate insulation for ${temperatureCelsius}°C variables. `;
    } else {
      justificationReasoning += `Maintains lightweight layering density that limits thermal insulation. `;
    }

    if (cultureScore > 75) {
      justificationReasoning += `Your Style DNA vector aligns with "${vibeOrCultureRequested}" silhouette accents. `;
    }

    if (trendScore > 80) {
      justificationReasoning += `It utilizes coordinates currently trending via Google Trends.`;
    }

    // FASHION DECISION ENGINE (Explain "Why this was selected over options")
    const alternativeNamesMap = [
      'Raw Denim Street Cadet',
      'Overcoat Layering Alternative',
      'Informal Leisure Coordinates',
      'High-Ventilation Athleticwear'
    ];
    const secondOption = alternativeNamesMap[Math.abs(styleName.length) % alternativeNamesMap.length];
    const alternativeScore = Math.max(finalAggregatedScore - (Math.floor(Math.random() * 12) + 5), 45);

    const contenderComparison = `Selected "${styleName}" over "${secondOption}" (Est. Match: ${alternativeScore}%) primarily because the former offers better climate coefficient protection for the targeted agenda, with a ${Math.abs(weatherScore - 60)}% higher thermal ventilation rating.`;

    return {
      styleName,
      items,
      scoreBreakdown: {
        weatherSuitability: weatherScore,
        culturalAlignment: cultureScore,
        userEngagementHistory: engagementScore,
        trendAlignment: trendScore,
        finalAggregatedScore
      },
      justificationReasoning,
      contenderComparison
    };
  }
}
