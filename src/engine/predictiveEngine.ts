import { WardrobeItem } from '../types';
import { UnifiedStyleDNAEngine } from './visionIntelligence';
import { PersonalFashionMemoryEngine } from './personalMemory';
import { EnterpriseLearningEngine } from './learningEngine';
import { DecisionIntelligenceEngine } from './decisionIntelligence';

// ============================================================================
// ENTERPRISE PREDICTIVE ENGINE TYPINGS & DATA CONTRACTS
// ============================================================================

export type ForecastPeriod = '7 Days' | '14 Days' | '30 Days' | '90 Days' | '180 Days' | '365 Days';

export interface ForecastMetrics {
  timeline: ForecastPeriod;
  predictedOutfitSuccessRate: number; // 0-100
  wardrobeHealthScore: number;        // 0-100
  seasonComplianceScore: number;      // 0-100
  predictedPurchases: number;
  expectedBudgetBurn: number;         // USD
  laundryVelocityIndex: number;       // 0-100
  wearPredictionIndex: number;        // Average wears per active item
  favoriteAdoptionProbability: number;// 0-100
  trendAlignmentProbability: number;  // 0-100
  styleEvolutionIndex: number;        // Rate of drift
  occasionReadinessRate: number;      // 0-100
  inventoryGapsIdentified: number;
  travelPreparednessRate: number;     // 0-100
  climateAdaptationRating: number;    // 0-100
  closetUtilizationRate: number;      // 0-100
  fashionLifecycleIndex: number;      // 0-100 (Curation sustainability)
}

export interface SimulationResult {
  scenarioName: string;
  description: string;
  predictedConfidence: number;        // 0-100
  expectedImpact: string;             // Qualitative synthesis
  riskScore: number;                  // 0-100
  opportunityScore: number;           // 0-100
  affectedItemsCount: number;
  affectedItemsNames: string[];
  affectedPlanningGoals: string[];
  affectedWorkflows: string[];
  affectedAgents: string[];
  predictedRecommendationQuality: number; // 0-100
  colorPaletteShift: string[];
  styleIndexShift: number;            // -50 to +50
}

export interface ScenarioComparison {
  reality: { name: string; health: number; risk: number; budget: number; confidence: number; summary: string };
  scenarioA: { name: string; health: number; risk: number; budget: number; confidence: number; summary: string };
  scenarioB: { name: string; health: number; risk: number; budget: number; confidence: number; summary: string };
  scenarioC: { name: string; health: number; risk: number; budget: number; confidence: number; summary: string };
}

// ============================================================================
// ENTERPRISE PREDICTIVE INTELLIGENCE & SIMULATION ENGINE
// ============================================================================

export class EnterprisePredictiveEngine {
  private static PREDICTIVE_PROFILE_KEY = 'lookvision_predictive_intelligence_profile';

  /**
   * Generates a deterministic forecast for a given timeline period,
   * factoring in the active wardrobe items, memory cycles, and style DNA.
   */
  static getForecastForTimeline(
    userId: string = 'user-1',
    items: WardrobeItem[] = [],
    timeline: ForecastPeriod = '30 Days'
  ): ForecastMetrics {
    // 1. Establish core data properties from existing engines
    const dna = UnifiedStyleDNAEngine.generateUnifiedStyleDNA(userId);
    const learning = EnterpriseLearningEngine.getLearningProfile(userId, items);
    
    // 2. Base statistics of the wardrobe
    const totalItems = items.length || 15;
    const darkItems = items.filter(i => {
      const color = (i.primaryColor || '').toLowerCase();
      return color.includes('black') || color.includes('charcoal') || color.includes('slate') || color.includes('dark');
    }).length;
    
    const darkRatio = darkItems / totalItems;

    // 3. Mathematical forecast calculation varying by timeline days
    let multiplier = 1.0;
    let purchaseMultiplier = 1;
    let budgetMultiplier = 150;

    switch (timeline) {
      case '7 Days':
        multiplier = 0.98;
        purchaseMultiplier = 0;
        budgetMultiplier = 40;
        break;
      case '14 Days':
        multiplier = 1.02;
        purchaseMultiplier = 1;
        budgetMultiplier = 120;
        break;
      case '30 Days':
        multiplier = 1.05;
        purchaseMultiplier = 2;
        budgetMultiplier = 280;
        break;
      case '90 Days':
        multiplier = 1.12;
        purchaseMultiplier = 4;
        budgetMultiplier = 650;
        break;
      case '180 Days':
        multiplier = 1.25;
        purchaseMultiplier = 8;
        budgetMultiplier = 1400;
        break;
      case '365 Days':
        multiplier = 1.45;
        purchaseMultiplier = 15;
        budgetMultiplier = 3200;
        break;
    }

    // Synthesize timeline metrics deterministically
    const predictedOutfitSuccessRate = Math.min(100, Math.max(40, (learning.metrics?.predictionQuality || 88) * multiplier * 0.95));
    const wardrobeHealthScore = Math.min(100, Math.max(50, 85 + (totalItems > 30 ? 5 : -5) + (darkRatio > 0.4 ? 4 : 0)));
    const seasonComplianceScore = Math.min(100, Math.max(45, 90 + (timeline === '7 Days' ? 5 : -10)));
    const laundryVelocityIndex = Math.min(100, Math.max(30, 82 - (totalItems < 20 ? 15 : 0)));
    const wearPredictionIndex = parseFloat(Math.min(50, Math.max(2, 4 + (180 / totalItems) * multiplier)).toFixed(1));
    const favoriteAdoptionProbability = Math.min(100, Math.max(50, 78 + (learning.metrics?.personalizationScore || 95) * 0.15));
    const trendAlignmentProbability = Math.min(100, Math.max(30, 72 + (timeline === '365 Days' ? 12 : -5)));
    const styleEvolutionIndex = Math.min(100, Math.max(5, 12 * multiplier));
    const occasionReadinessRate = Math.min(100, Math.max(50, 84 + (totalItems > 40 ? 8 : -4)));
    const travelPreparednessRate = Math.min(100, Math.max(40, 75 + (totalItems > 35 ? 10 : -8)));
    const climateAdaptationRating = Math.min(100, Math.max(40, 81 + (darkRatio > 0.3 ? 5 : -5)));
    const closetUtilizationRate = Math.min(100, Math.max(20, 68 - (totalItems > 50 ? 18 : -10)));
    const fashionLifecycleIndex = Math.min(100, Math.max(50, 89 - (totalItems > 80 ? 15 : 0)));
    
    const inventoryGapsIdentified = totalItems < 25 ? 5 : totalItems < 45 ? 3 : 1;

    return {
      timeline,
      predictedOutfitSuccessRate,
      wardrobeHealthScore,
      seasonComplianceScore,
      predictedPurchases: purchaseMultiplier,
      expectedBudgetBurn: budgetMultiplier,
      laundryVelocityIndex,
      wearPredictionIndex,
      favoriteAdoptionProbability,
      trendAlignmentProbability,
      styleEvolutionIndex,
      occasionReadinessRate,
      inventoryGapsIdentified,
      travelPreparednessRate,
      climateAdaptationRating,
      closetUtilizationRate,
      fashionLifecycleIndex
    };
  }

  /**
   * Evaluates a deterministic simulation model of a proposed physical intervention or climate shift.
   */
  static runSimulation(
    userId: string = 'user-1',
    items: WardrobeItem[] = [],
    scenarioType: 'buy_jacket' | 'remove_black' | 'weather_change' | 'travel_abroad' | 'gain_pieces' | 'change_style',
    customParam?: string
  ): SimulationResult {
    const totalItems = items.length || 20;
    
    // Find black clothing items in the physical collection
    const blackItems = items.filter(i => {
      const color = (i.primaryColor || '').toLowerCase();
      return color.includes('black') || color.includes('charcoal') || color.includes('dark');
    });

    switch (scenarioType) {
      case 'buy_jacket':
        return {
          scenarioName: 'Acquire Premium Cashmere Blazer',
          description: 'Simulates acquiring a double-breasted structured Italian Cashmere Blazer in Midnight Blue.',
          predictedConfidence: 94.5,
          expectedImpact: 'Extremely high layering synergy across existing smart-casual trousers. Increases formal and weekend corporate ready ratings instantly.',
          riskScore: 12,
          opportunityScore: 92,
          affectedItemsCount: Math.max(3, Math.round(totalItems * 0.35)),
          affectedItemsNames: items.slice(0, 4).map(i => i.title || i.name || 'Tailored Trouser'),
          affectedPlanningGoals: ['Execute Q3 Corporate Curation', 'Optimize Cashmere Layering Standard'],
          affectedWorkflows: ['Smart Formal Recommendation Cycle', 'Dry Clean Curation Dispatch'],
          affectedAgents: ['FashionStylistAgent', 'DecisionAgent'],
          predictedRecommendationQuality: 96.2,
          colorPaletteShift: ['Midnight Blue', 'Charcoal', 'Earthy Terracotta'],
          styleIndexShift: 14
        };

      case 'remove_black':
        return {
          scenarioName: 'Purge Monochromatic Elements',
          description: 'Simulates the total removal of all black, charcoal, and ink-slate clothing items from the collection.',
          predictedConfidence: 88.0,
          expectedImpact: 'Severe disruption of current high-contrast layering DNA. Drastically reduces recommendation quality scores since dark anchors are purged.',
          riskScore: 84,
          opportunityScore: 15,
          affectedItemsCount: blackItems.length || Math.round(totalItems * 0.4),
          affectedItemsNames: blackItems.length > 0 ? blackItems.map(i => i.title || i.name || 'Black Item') : ['Matte Black Blazer', 'Ink-Slate Trouser', 'Charcoal Knit'],
          affectedPlanningGoals: ['Maintain Avant-Garde Minimal Base'],
          affectedWorkflows: ['Multi-layered Winter Curation Workflow'],
          affectedAgents: ['DecisionAgent', 'ConflictResolver'],
          predictedRecommendationQuality: 32.5,
          colorPaletteShift: ['Bone White', 'Camel Cream', 'Sky Blue'],
          styleIndexShift: -35
        };

      case 'weather_change':
        return {
          scenarioName: 'Sudden Climatic Arctic Drop',
          description: 'Simulates a sudden prolonged atmospheric temperature crash below 2°C with high windchill parameters.',
          predictedConfidence: 96.0,
          expectedImpact: 'High thermal strain on active inventory. Activates severe warning flags on light silk layers and thin cotton shirts.',
          riskScore: 48,
          opportunityScore: 78,
          affectedItemsCount: Math.max(5, Math.round(totalItems * 0.6)),
          affectedItemsNames: items.filter(i => (i.category || '').toLowerCase().includes('jacket') || (i.category || '').toLowerCase().includes('coat')).map(i => i.title || i.name || 'Heavy Outerwear'),
          affectedPlanningGoals: ['Survive Arctic Shift Curation', 'Transition Wardrobe Thermal Rating'],
          affectedWorkflows: ['Climate Alert Curation Trigger', 'Layering Density Backpropagation'],
          affectedAgents: ['FashionVisionAgent', 'FashionStylistAgent'],
          predictedRecommendationQuality: 89.5,
          colorPaletteShift: ['Matte Charcoal', 'Slate Black', 'Heavy Crimson'],
          styleIndexShift: 22
        };

      case 'travel_abroad':
        return {
          scenarioName: 'Equatorial Relocation Travel',
          description: 'Simulates immediate travel to a high-humidity tropical zone (Singapore/Manaus) averaging 32°C.',
          predictedConfidence: 91.5,
          expectedImpact: 'Disables heavyweight wool layers, cashmere, and suede footwear. Demands lightweight linen-lyocell configurations.',
          riskScore: 35,
          opportunityScore: 81,
          affectedItemsCount: Math.max(2, Math.round(totalItems * 0.45)),
          affectedItemsNames: items.filter(i => (i.category || '').toLowerCase().includes('shirt') || (i.category || '').toLowerCase().includes('pant')).map(i => i.title || i.name || 'Linen Shirt'),
          affectedPlanningGoals: ['Execute Equatorial Travel Packlist'],
          affectedWorkflows: ['Travel Bag Optimization Sequence'],
          affectedAgents: ['FashionMemoryAgent', 'FashionStylistAgent'],
          predictedRecommendationQuality: 87.0,
          colorPaletteShift: ['Alabaster White', 'Sand Beige', 'Sage Green'],
          styleIndexShift: -12
        };

      case 'gain_pieces':
        return {
          scenarioName: 'Acquire 5x Avant-Garde Pieces',
          description: 'Simulates gaining 5 high-concept asymmetrical drape layers, linen-wool shirts, and geometric shoes.',
          predictedConfidence: 93.0,
          expectedImpact: 'Accelerates style evolution towards avant-garde metrics by 300%. Integrates beautiful asymmetrical layering options.',
          riskScore: 18,
          opportunityScore: 94,
          affectedItemsCount: 5,
          affectedItemsNames: ['Asymmetrical Drape Knit Tunic', 'Heavyweight Slate French Terry', 'Linen-Wool Structured Shirt', 'Drape Tailored Hakama Pant', 'Minimal Geometric Leather Boots'],
          affectedPlanningGoals: ['Complete Avant-Garde Transformation', 'Establish Aesthetic Premium Curation'],
          affectedWorkflows: ['Asymmetrical Curation Dispatch', 'Style DNA Recalibration'],
          affectedAgents: ['FashionVisionAgent', 'FashionKnowledgeAgent', 'FashionStylistAgent'],
          predictedRecommendationQuality: 98.0,
          colorPaletteShift: ['Ink Slate', 'Bone White', 'Matte Charcoal'],
          styleIndexShift: 38
        };

      case 'change_style':
        const target = customParam || 'High-Contrast Minimalist';
        return {
          scenarioName: `Shift Target Aesthetic to [${target}]`,
          description: `Simulates manually configuring user preferred style target to "${target}" to force immediate preference drift.`,
          predictedConfidence: 95.0,
          expectedImpact: 'Forces immediate backpropagation across style ranking coefficients. Optimizes recommendation vectors to align with minimalist aesthetics.',
          riskScore: 25,
          opportunityScore: 89,
          affectedItemsCount: Math.max(4, Math.round(totalItems * 0.55)),
          affectedItemsNames: items.slice(0, 6).map(i => i.title || i.name || 'Minimal item'),
          affectedPlanningGoals: ['Align Goal Index with Minimal Aesthetics', 'Calibrate Style DNA Matrix'],
          affectedWorkflows: ['Preference Recalibration Workflow', 'Multi-Agent Strategy Tuning'],
          affectedAgents: ['DecisionAgent', 'FashionMemoryAgent', 'ConflictResolver'],
          predictedRecommendationQuality: 94.5,
          colorPaletteShift: ['Jet Black', 'Off-White', 'Cream Gray'],
          styleIndexShift: 18
        };
    }
  }

  /**
   * Compares the Current Reality against three distinct speculative simulation models (Scenarios A, B, C).
   */
  static getScenarioComparison(userId: string = 'user-1', items: WardrobeItem[] = []): ScenarioComparison {
    const totalItems = items.length || 20;
    
    // Reality baseline
    const baseHealth = 88;
    const baseRisk = 15;
    const baseBudget = 250;
    const baseConfidence = 95;

    // Speculative scenario simulations
    const simA = this.runSimulation(userId, items, 'buy_jacket');
    const simB = this.runSimulation(userId, items, 'remove_black');
    const simC = this.runSimulation(userId, items, 'weather_change');

    return {
      reality: {
        name: 'Current Wardrobe State',
        health: baseHealth,
        risk: baseRisk,
        budget: baseBudget,
        confidence: baseConfidence,
        summary: `Stable enterprise curation with ${totalItems} active units. Optimal climate compliance index.`
      },
      scenarioA: {
        name: simA.scenarioName,
        health: Math.min(100, baseHealth + 6),
        risk: simA.riskScore,
        budget: baseBudget + 450,
        confidence: simA.predictedConfidence,
        summary: simA.expectedImpact
      },
      scenarioB: {
        name: simB.scenarioName,
        health: Math.max(30, baseHealth - 45),
        risk: simB.riskScore,
        budget: baseBudget,
        confidence: simB.predictedConfidence,
        summary: simB.expectedImpact
      },
      scenarioC: {
        name: simC.scenarioName,
        health: Math.max(40, baseHealth - 12),
        risk: simC.riskScore,
        budget: baseBudget + 180,
        confidence: simC.predictedConfidence,
        summary: simC.expectedImpact
      }
    };
  }
}
