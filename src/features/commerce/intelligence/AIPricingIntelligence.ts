export interface PricingAnalysisInput {
  title: string;
  category: string;
  fabric: string;
  luxuryIntensity?: number;
  creatorRating?: number;
  salesCount?: number;
  trendVelocity?: 'high' | 'viral' | 'steady' | 'niche';
}

export interface PricingSuggestion {
  suggestedPrice: number;
  confidenceScore: number; // 0 - 100
  marketPosition: 'Value Luxury' | 'Premium Designer' | 'Ultra Haute Couture' | 'Exclusive Bespoke';
  priceRange: {
    min: number;
    max: number;
  };
  reasoning: string[];
  demandMultiplier: number;
  suggestedCommission: number;
}

const CATEGORY_BASE_PRICES: Record<string, number> = {
  'Jacket': 280,
  'Outerwear': 350,
  'Couture Dress': 420,
  'Suit': 480,
  'Outfit': 220,
  'Footwear': 260,
  'Accessories': 140,
  'Default': 180
};

export function calculateAIPricingSuggestion(input: PricingAnalysisInput): PricingSuggestion {
  const base = CATEGORY_BASE_PRICES[input.category] || CATEGORY_BASE_PRICES['Default'];

  // Fabric multiplier
  let fabricMultiplier = 1.0;
  const fLower = input.fabric.toLowerCase();
  if (fLower.includes('silk') || fLower.includes('cashmere')) fabricMultiplier = 1.45;
  else if (fLower.includes('metallic') || fLower.includes('leather')) fabricMultiplier = 1.35;
  else if (fLower.includes('nylon') || fLower.includes('wool')) fabricMultiplier = 1.2;

  // Trend velocity multiplier
  let trendMultiplier = 1.1;
  if (input.trendVelocity === 'viral') trendMultiplier = 1.5;
  else if (input.trendVelocity === 'high') trendMultiplier = 1.3;
  else if (input.trendVelocity === 'niche') trendMultiplier = 1.25;

  // Creator reputation multiplier
  const rating = input.creatorRating || 4.8;
  const reputationMultiplier = 1 + ((rating - 4.0) * 0.25);

  // Luxury intensity score
  const luxury = input.luxuryIntensity || 85;
  const luxuryMultiplier = 0.8 + (luxury / 100) * 0.5;

  // Final calculated price
  const rawPrice = base * fabricMultiplier * trendMultiplier * reputationMultiplier * luxuryMultiplier;
  const suggestedPrice = Math.round(rawPrice / 5) * 5;

  let marketPosition: PricingSuggestion['marketPosition'] = 'Premium Designer';
  if (suggestedPrice > 600) marketPosition = 'Ultra Haute Couture';
  else if (suggestedPrice > 350) marketPosition = 'Exclusive Bespoke';
  else if (suggestedPrice < 200) marketPosition = 'Value Luxury';

  const confidenceScore = Math.min(98, Math.round(82 + (rating * 2) + (luxury > 90 ? 5 : 0)));

  const reasoning = [
    `Material Valuation: ${input.fabric} commands +${Math.round((fabricMultiplier - 1) * 100)}% premium in secondary luxury markets.`,
    `Trend Velocity: Current category demand index triggers a ${Math.round((trendMultiplier - 1) * 100)}% dynamic price surge.`,
    `Creator Equity: High reputation score (${rating}★) supports an elevated upper-quartile position.`
  ];

  return {
    suggestedPrice,
    confidenceScore,
    marketPosition,
    priceRange: {
      min: Math.round(suggestedPrice * 0.85),
      max: Math.round(suggestedPrice * 1.22)
    },
    reasoning,
    demandMultiplier: Number(trendMultiplier.toFixed(2)),
    suggestedCommission: Math.round(suggestedPrice * 0.12)
  };
}
