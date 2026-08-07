/**
 * ARIA Preview Mock Data Engine
 * Product: LOOK VISION v2.4.0-telemetry
 * Provides realistic demo user sessions, wardrobe items, and recommendation outputs.
 */

export interface DemoWardrobeItem {
  id: string;
  name: string;
  category: 'Outerwear' | 'Tops' | 'Bottoms' | 'Footwear' | 'Accessories';
  color: string;
  fabric: string;
  synergyScore: number;
  imageUrl?: string;
  timesWorn: number;
}

export interface DemoUserSession {
  userId: string;
  displayName: string;
  email: string;
  subscriptionPlan: string;
  styleDNA: {
    archetype: string;
    colorProfile: string;
    silhouette: string;
    vibe: string;
    formalityIndex: number;
    experimentalIndex: number;
    styleVector: number[];
  };
  wardrobe: DemoWardrobeItem[];
  evolutionStage: string;
  confidenceScore: number;
}

export const PREVIEW_DEMO_USER: DemoUserSession = {
  userId: 'preview_user',
  displayName: 'Aria Visionary',
  email: 'visionary@lookvision.ai',
  subscriptionPlan: 'PRO_STYLIST_PREVIEW',
  styleDNA: {
    archetype: 'Architectural Minimalist',
    colorProfile: 'Neutral Luxury & Slate Accents',
    silhouette: 'Structured & Tapered Layering',
    vibe: 'Cyberpunk Professional',
    formalityIndex: 0.82,
    experimentalIndex: 0.88,
    styleVector: [0.85, 0.92, 0.78, 0.88, 0.75, 0.84, 0.80, 0.86]
  },
  wardrobe: [
    {
      id: 'prev_w1',
      name: 'Double-Breasted Wool Architecture Blazer',
      category: 'Outerwear',
      color: '#0A0A10 (Obsidian Onyx)',
      fabric: 'Super 130s Merino Wool & Silk Satin Facing',
      synergyScore: 98,
      imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800',
      timesWorn: 18
    },
    {
      id: 'prev_w2',
      name: 'Tapered High-Waist Creased Trousers',
      category: 'Bottoms',
      color: '#12121A (Charcoal Slate)',
      fabric: 'Stretch Tropical Wool Blend',
      synergyScore: 96,
      imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800',
      timesWorn: 24
    },
    {
      id: 'prev_w3',
      name: 'Anodized Trim Sculpted Chelsea Loafers',
      category: 'Footwear',
      color: '#05050A (Burnished Leather)',
      fabric: 'Full-Grain Calfskin & Vibram Ergonomic Sole',
      synergyScore: 94,
      imageUrl: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=80&w=800',
      timesWorn: 14
    },
    {
      id: 'prev_w4',
      name: 'Seamless 3D Ribbed Micro-Knit Base Top',
      category: 'Tops',
      color: '#E2E8F0 (Platinum Frost)',
      fabric: 'Seamless Bamboo Microfiber',
      synergyScore: 92,
      imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800',
      timesWorn: 20
    }
  ],
  evolutionStage: 'Phase III: High-Synergy Sartorial Alignment',
  confidenceScore: 96.4
};

export const PREVIEW_SAMPLE_RESPONSES = {
  luxuryTravelOutfit: {
    recommendationTitle: 'Architectural Executive Travel Ensemble',
    archetype: 'Architectural Minimalist',
    confidenceScore: 96.8,
    explanation: 'Designed for high-level executive mobility. Combines wrinkle-resistant Merino wool blazer structure with seamless bamboo base layers and ergonomically cushioned leather loafers.',
    items: [
      'Double-Breasted Wool Architecture Blazer',
      'Seamless 3D Ribbed Micro-Knit Base Top',
      'Tapered High-Waist Creased Trousers',
      'Anodized Trim Sculpted Chelsea Loafers'
    ],
    reasoningTrace: [
      { step: 'Intent Resolution', note: 'Identified Executive Luxury Travel requirement with high-formality constraints.' },
      { step: 'Wardrobe Synergy', note: 'Selected 4 wardrobe items with average synergy rating of 95%.' },
      { step: 'Climatic Adaptation', note: 'Adjusted for temperature-controlled transit environments (18-22°C).' },
      { step: 'Decision Synthesis', note: 'Calculated 96.8% confidence match based on user Style DNA.' }
    ]
  }
};
