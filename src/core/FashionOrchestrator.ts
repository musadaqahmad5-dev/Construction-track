import { WardrobeItem, ClothingCategory } from '../types';
import { FashionAI, GarmentVisionResult } from '../features/ai/fashionAI';
import { StyleProfileMemory, PersistentStyleProfile } from '../features/style-memory/styleProfile';
import { WeatherAdapter } from '../features/ai/weatherAdapter';
import { ExperimentManager } from '../features/experiments/experimentManager';
import { ConfidenceCalculator, ConfidencePayload } from './confidence/confidenceCalculator';
import { ConfidenceExplainer } from './confidence/confidenceExplainer';
import { OutcomeEvaluator } from '../features/decision-loop/outcomeEvaluator';

export interface StylistRequest {
  userId: string;
  wardrobe: WardrobeItem[];
  uploadedImageBase64?: string; // Optional camera scan Base64
  agenda?: string;             // Target context (e.g., "Board Meeting")
  vibe?: string;               // Vibe (e.g., "minimalist", "bold")
  weatherCondition?: string;   // Weather condition description
  tempRange?: string;          // Temperature bounds
}

export interface ScoredItemResult {
  item: WardrobeItem;
  scores: {
    base: number;
    styleScore: number;
    colorHarmony: number;
    occasionScore: number;
    closetAvailability: number;
    total: number;
  };
  reasons: string[];
}

export interface UnifiedRecommendationResult {
  todaySuggestion: string[];        // Array of WardrobeItem IDs (Primary outfit)
  tomorrowSuggestion: string[];     // Array of WardrobeItem IDs (Secondary alternative)
  confidence: number;               // 0.0 to 1.0
  reasoning: string;                // Detailed explanation of style harmonies
  scoreBreakdown?: {
    todayTotalScore: number;
    averageHarmony: number;
  };
  detectedGarment?: GarmentVisionResult; // Null if no visual upload processed
  isFallback: boolean;              // True if AI failed or fell back to local deterministic model
  reasonsAndBreakdown?: ScoredItemResult[];
  experimentVariant?: {
    experimentId: string;
    variantId: string;
    strategyName: string;
  };
  confidencePayload?: ConfidencePayload;
  recommendationOutcomeScore?: number;
}

export class FashionOrchestrator {
  /**
   * Orchestrates the Unified Recommendation Pipeline.
   * Steps:
   *  1. Base64 Vision Parse (Detect, extract colors, class style if image present)
   *  2. Loading user Persistent Style Profile
   *  3. Adapting Weather matrix
   *  4. Scoring all wardrobe items dynamically using a detailed multi-variable weighing engine
   *  5. Discarding active rejects
   *  6. Compiling final outfit sets (Today suggested, Tomorrow suggestions)
   */
  static async recommend(request: StylistRequest): Promise<UnifiedRecommendationResult> {
    console.log('[FashionOrchestrator] Directing style request pipeline...', request.userId);

    const agenda = request.agenda || 'Regular day';
    const vibe = request.vibe || 'minimalist';
    const condition = request.weatherCondition || 'Mild';
    const tempRange = request.tempRange || '15°C - 20°C';

    let detectedGarment: GarmentVisionResult | undefined;
    let fallbackVisionApplied = false;

    // STEP 1: Vision Ingestion Layer (Vision -> Garment Detection)
    if (request.uploadedImageBase64) {
      try {
        console.log('[FashionOrchestrator] Grounding recommendation with dynamic multi-modal vision...');
        detectedGarment = await FashionAI.analyzeOutfitVisual(request.uploadedImageBase64);
        console.log('[FashionOrchestrator] Multi-modal extraction resolved:', detectedGarment.name);
      } catch (err) {
        console.warn('[FashionOrchestrator] Vision sensor offline. Bypassing scan segment:', err);
        fallbackVisionApplied = true;
      }
    }

    // STEP 2: Persistent Style Memory Retrieval
    const profile: PersistentStyleProfile = await StyleProfileMemory.load(request.userId);

    // STEP 2B: Experiment Assignment (Task 2)
    const activeExperimentId = 'scoring_engine_tuning';
    const assignment = ExperimentManager.getAssignment(request.userId, activeExperimentId);
    console.log('[FashionOrchestrator] User A/B Experiment Assignment:', assignment.variantId);

    // STEP 3: Normalize Environmental Context
    const weatherCtx = WeatherAdapter.adapt(condition, tempRange);

    const availableItems = request.wardrobe;
    if (!availableItems || availableItems.length === 0) {
      return {
        todaySuggestion: [],
        tomorrowSuggestion: [],
        confidence: 0.2,
        reasoning: "Your wardrobe closet is currently empty. Please upload or scan new clothes to build recommendation cards.",
        isFallback: true,
        detectedGarment
      };
    }

    // STEP 4: Weighted Recommendation Scoring Engine
    // Weights: styleScore (30%), colorHarmony (25%), occasionScore (25%), closetAvailability (20%)
    const scoredReports: ScoredItemResult[] = availableItems.map(item => {
      const reasons: string[] = [];

      // A. Style Score (Vibe match and favored categories)
      let styleScore = 50;
      const themeMatches = item.description?.toLowerCase().includes(profile.styleVibe) || item.title?.toLowerCase().includes(profile.styleVibe);
      if (themeMatches) {
        styleScore += 25;
        reasons.push(`Aligned with persistent style theme: "${profile.styleVibe}"`);
      }
      if (profile.preferredCategories.includes(item.category)) {
        styleScore += 15;
        reasons.push(`Item category "${item.category}" matches user historical preference layout`);
      }

      // B. Color Harmony (Checking favoriteColors and harmonious pairings)
      let colorHarmony = 50;
      if (item.primaryColor && profile.favoriteColors.includes(item.primaryColor)) {
        colorHarmony += 30;
        reasons.push(`Primary color "${item.primaryColor}" is registered in user luxury brand selection`);
      } else {
        // Fallback checks for standard color harmonies
        const neutrals = ['Pitch Black', 'Minimalist White', 'Oatmeal Beige', 'Silver Gray'];
        if (item.primaryColor && neutrals.includes(item.primaryColor)) {
          colorHarmony += 15;
          reasons.push(`Neutral color tone "${item.primaryColor}" scales beautifully into styling combinations`);
        }
      }

      // Adjust scoring bias if in testing variant
      if (assignment.variantId === 'treatment_B') {
        // Boost style matching weight specifically
        styleScore += 10;
        reasons.push(`[Variant-B Run] Extra +10 theme bias applied dynamically`);
      }

      // C. Occasion Score (Formality match, Weather insulation index, and Agenda checks)
      let occasionScore = 50;
      const agendaLower = agenda.toLowerCase();
      const isFormalAgenda = agendaLower.includes('work') || agendaLower.includes('formal') || agendaLower.includes('meeting') || agendaLower.includes('dinner');
      const isSportAgenda = agendaLower.includes('gym') || agendaLower.includes('sport') || agendaLower.includes('run') || agendaLower.includes('active');

      if (isFormalAgenda) {
        if (item.category === 'Formal' || item.formality === 'Formal' || item.formality === 'Semi-formal') {
          occasionScore += 30;
          reasons.push(`Garment formality corresponds with busy work calendar: "${agenda}"`);
        } else if (item.category === 'Sportswear') {
          occasionScore -= 20;
          reasons.push('Sportswear is discouraged for administrative and formal meetings');
        }
      } else if (isSportAgenda) {
        if (item.category === 'Sportswear') {
          occasionScore += 30;
          reasons.push('Athletic fabrics keep body well insulated during physical agenda tasks');
        } else {
          occasionScore -= 15;
        }
      } else {
         if (item.category === 'Casual' || item.category === 'Accessories') {
           occasionScore += 15;
           reasons.push('Relaxed fitting profile coordinates seamlessly into social/casual agendas');
         }
      }

      // Weather checks
      const isCold = weatherCtx.insulationIndex >= 3;
      if (isCold) {
        if (item.category === 'Outerwear' || item.season === 'Winter' || item.season === 'Autumn') {
          occasionScore += 20;
          reasons.push('Adds high insulation factor for cold weather trends');
        }
      } else {
        if (item.season === 'Summer' || item.season === 'Spring') {
          occasionScore += 15;
          reasons.push('Lightweight breathable fabrics perfect for summer days');
        }
      }

      // D. Closet Availability (Active closet statuses and fatigue indicators)
      let closetAvailability = 50;
      if (item.status === 'In Closet') {
        closetAvailability += 30;
      } else {
        closetAvailability -= 25;
        reasons.push('Item is currently worn or dirty (Needs laundry)');
      }

      // Wear fatigue reduction
      const wearCount = item.wearCount || 0;
      if (wearCount > 4) {
        closetAvailability -= 20;
        reasons.push('Wear fatigue penalty: rotating item out preserves fabric shapes');
      }

      // Calculate weighted combination total
      const totalScore = (styleScore * 0.3) + (colorHarmony * 0.25) + (occasionScore * 0.25) + (closetAvailability * 0.2);

      return {
        item,
        scores: {
          base: 50,
          styleScore,
          colorHarmony,
          occasionScore,
          closetAvailability,
          total: Math.round(totalScore)
        },
        reasons
      };
    });

    // STEP 5: Memory Adjustment (Apply penalties if outfit was previously rejected)
    profile.rejectedOutfitIds.forEach(blacklistIds => {
      // If a subset of blacklisted items is selected, apply massive total penalties
      scoredReports.forEach(report => {
        if (blacklistIds.includes(report.item.id)) {
          report.scores.total -= 15;
          report.reasons.push('Penalized: In a combination previously rejected by user feedback loops');
        }
      });
    });

    // Rank scored outcomes descending
    scoredReports.sort((a, b) => b.scores.total - a.scores.total);

    // Filter down matching coordinates targets
    // Pick 1 Principal piece, 1 Outerwear layer, and 1 Accessory safely
    const proposedToday: string[] = [];
    const proposedTomorrow: string[] = [];

    const mainPiece = scoredReports.find(r => ['Casual', 'Formal', 'Sportswear'].includes(r.item.category) && r.item.status === 'In Closet');
    if (mainPiece) {
      proposedToday.push(mainPiece.item.id);
    }
    const outerPiece = scoredReports.find(r => r.item.category === 'Outerwear' && r.item.status === 'In Closet' && !proposedToday.includes(r.item.id));
    if (outerPiece) {
      proposedToday.push(outerPiece.item.id);
    }
    const accPiece = scoredReports.find(r => r.item.category === 'Accessories' && r.item.status === 'In Closet' && !proposedToday.includes(r.item.id));
    if (accPiece) {
      proposedToday.push(accPiece.item.id);
    }

    // Safety checks — if set compilation generated items <= 1, pad with topmost ranked items
    if (proposedToday.length === 0 && scoredReports.length > 0) {
      proposedToday.push(scoredReports[0].item.id);
      if (scoredReports.length > 1) {
        proposedToday.push(scoredReports[1].item.id);
      }
    }

    // Populate tomorrow alternatives sets
    scoredReports.forEach(r => {
      if (!proposedToday.includes(r.item.id) && r.item.status === 'In Closet' && proposedTomorrow.length < 2) {
        proposedTomorrow.push(r.item.id);
      }
    });

    // STEP 6: AI Failure Recovery & Synthesis (Step 5)
    // Run live Gemini API styling call if connected to produce a finalized beautiful summary reasoning, other fallback gracefully
    let confidence = 0.85;
    let isFallback = false;
    let reasoningText = '';

    const firstItem = scoredReports[0]?.item;
    const topReasons = scoredReports[0]?.reasons.slice(0, 2).join(' & ') || 'good rotation schedule';

    try {
      // Query LLM on backend or fall back
      const liveAiResult = await FashionAI.recommendOutfit(
        availableItems,
        condition,
        tempRange,
        vibe,
        agenda,
        request.userId
      );
      
      reasoningText = liveAiResult.reasoning;
      confidence = liveAiResult.confidence;
      isFallback = liveAiResult.reasoning.includes('[Fallback') || liveAiResult.reasoning.includes('[Offline');
    } catch (err) {
      isFallback = true;
      confidence = 0.65;
      reasoningText = `[Offline Fallback Mode] Due to connection limits, our engine calculated a local deterministic combination. The principal item is ${firstItem?.title || 'selected piece'} because ${topReasons}. Optimizes color harmony for style profile: ${profile.styleVibe}.`;
    }

    if (detectedGarment) {
      reasoningText += `\n\n[Scan Grounding] Detected freshly uploaded ${detectedGarment.name} (${detectedGarment.primaryColor} ${detectedGarment.category}) with a safety confidence of ${Math.round(detectedGarment.confidence * 100)}%. This scanner asset is aligned with styling recommendations.`;
    }

    // STEP 7: Confidence Engine (Prediction Confidence, Uncertainty, Trust Score, Fallback indicators)
    const confidencePayload = ConfidenceCalculator.calculate(
      scoredReports.filter(r => proposedToday.includes(r.item.id)).map(r => r.item),
      profile,
      isFallback,
      condition
    );

    // Appending dynamic explanation context text
    const explanationText = ConfidenceExplainer.compileExplanation(confidencePayload);
    reasoningText += `\n\n[Confidence Explainer] ${explanationText}`;

    // STEP 8: Closed Loop Evaluator (Retrieve previous metrics & outcome scores)
    let outcomeScore = 75;
    try {
      const evaluation = await OutcomeEvaluator.evaluateUserPerformance(request.userId);
      outcomeScore = evaluation.recommendationOutcomeScore;
    } catch (err) {
      console.warn('[FashionOrchestrator] OutcomeEvaluator error:', err);
    }

    return {
      todaySuggestion: proposedToday,
      tomorrowSuggestion: proposedTomorrow,
      confidence,
      reasoning: reasoningText,
      scoreBreakdown: {
        todayTotalScore: scoredReports[0]?.scores.total || 50,
        averageHarmony: Math.round(scoredReports.reduce((acc, current) => acc + current.scores.colorHarmony, 0) / scoredReports.length)
      },
      detectedGarment,
      isFallback,
      reasonsAndBreakdown: scoredReports.slice(0, 5),
      experimentVariant: assignment,
      confidencePayload,
      recommendationOutcomeScore: outcomeScore
    };
  }
}
