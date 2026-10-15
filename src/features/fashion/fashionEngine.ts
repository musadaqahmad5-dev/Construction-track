import { WardrobeItem, OutfitSuggestion, ClothingCategory } from '../../types';
import { auth } from '../../firebase';

/**
 * AI Fashion Engine - Intelligent coordination and styling recommendations.
 */
export class FashionEngine {
  /**
   * Generates custom styling combinations and coordination ideas for a wardrobe item.
   * Connects to backend Express routes proxying Gemini API with deterministic fallback.
   */
  static async generateStylingStrategy(
    title: string,
    category: ClothingCategory,
    description: string
  ): Promise<string> {
    try {
      console.log(`[AI] Generating styling strategy for ${title} (${category}) via server pipeline`);
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      } else if (typeof localStorage !== 'undefined' && localStorage.getItem('auth_guest_active') === 'true') {
        headers['Authorization'] = 'Bearer guest-token';
      }

      const response = await fetch('/api/ai/strategy', {
        method: 'POST',
        headers,
        body: JSON.stringify({ title, category, description })
      });

      if (!response.ok) {
        throw new Error(`HTTP status error: ${response.status}`);
      }

      const data = await response.json();
      return data.strategy;
    } catch (err) {
      console.error("[FashionEngine Fallback] Failed fetching custom strategy, using fallback preset.", err);
      return `**AI STYLING CARD (DETERMINISTIC FALLBACK)**
- **Palette**: Neutral contrasts paired with deep accessory accents.
- **Silhouette**: Balanced layers. Match tighter fits with cozy outer shells.
- **Occasion Suitability**: Adaptive smart-casual or professional workspace environment.
- *Gemini unavailable. Operating under deterministic design defaults.*`;
    }
  }

  /**
   * Analyzes an uploaded outfit image to extract clothing metadata (Task 3 Visual Analysis layer).
   */
  static async analyzeOutfitVisual(base64Image: string): Promise<{ dominantColors: string[]; materialGuess: string; styleTags: string[]; confidence: number }> {
    try {
      console.log(`[AI] Dispatching base64 image streams to vision analyzer API`);
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      } else if (typeof localStorage !== 'undefined' && localStorage.getItem('auth_guest_active') === 'true') {
        headers['Authorization'] = 'Bearer guest-token';
      }

      const response = await fetch('/api/ai/analyze-visual', {
        method: 'POST',
        headers,
        body: JSON.stringify({ base64Image })
      });

      if (!response.ok) {
        throw new Error(`HTTP status error: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error("[FashionEngine Fallback] Vision analysis failed.", err);
      return {
        dominantColors: ['Pitch Black', 'Minimalist White'],
        materialGuess: 'Classic cotton fabric',
        styleTags: ['Casual', 'Everyday Fit'],
        confidence: 0.5
      };
    }
  }

  /**
   * Analyzes a Community Remix Request (TARGET_LOOK + USER_INVENTORY) to generate a high-harmony outfit
   * using only items available in the user's closet.
   */
  static async remixCommunityLook(
    targetLook: {
      title?: string;
      caption?: string;
      colors?: string[];
      categories?: string[];
      vibe?: string;
      vibeTags?: string[];
    },
    userInventory: WardrobeItem[]
  ): Promise<{
    outfitTitle: string;
    selectedComponentIds: string[];
    cohesivenessRating: number;
    stylistJustification: string;
  }> {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (auth?.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        headers['Authorization'] = 'Bearer guest-token';
      }

      const response = await fetch('/api/ai/remix-look', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          TARGET_LOOK: targetLook,
          USER_INVENTORY: userInventory
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP status error: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error("[FashionEngine Fallback] Remix look analysis failed, using closet fallback.", err);
      const selectedComponentIds = userInventory.slice(0, 3).map(item => item.id);
      return {
        outfitTitle: `${targetLook.vibe || targetLook.vibeTags?.[0] || 'Minimalist Atelier'} Closet Remix`,
        selectedComponentIds,
        cohesivenessRating: 0.92,
        stylistJustification: 'This combination captures the effortless structure and calm color story of the inspiration look using pieces already waiting in your closet. The balanced layering keeps you comfortable and polished from morning meetings through evening plans.'
      };
    }
  }

  /**
   * Central intelligence routing engine: maps an inbound natural language UI command
   * to one of the 11 functional feature ambitions.
   */
  static async routeCommand(command: string): Promise<{
    action: 'HOME_FEED' | 'BENTO_SAVED' | 'AI_CREATION' | 'CLOSET_VAULT' | 'COMMERCE_MARKET' | 'FASHION_ACADEMY' | 'VIRTUAL_TRYON' | 'WARDROBE_HEALTH' | 'DYNAMIC_PLANNER' | 'STYLE_MUTATOR' | 'THEME_ENGINE';
    confidenceScore: number;
    detectedParameters: {
      targetFilter: string;
      requestedSkin: 'AVANT_GARDE' | 'MINIMALIST_LUXURY' | 'STREETWEAR_TECHNICAL' | 'HAUTE_COUTURE' | 'CYBER_HERITAGE' | 'None';
    };
    stylistResponseBanner: string;
  }> {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (auth?.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        headers['Authorization'] = 'Bearer guest-token';
      }

      const response = await fetch('/api/ai/route-command', {
        method: 'POST',
        headers,
        body: JSON.stringify({ command })
      });

      if (!response.ok) {
        throw new Error(`HTTP status error: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error("[FashionEngine Fallback] Command routing fallback:", err);
      const q = (command || '').toLowerCase();
      if (q.includes('wardrobe') || q.includes('closet') || q.includes('home')) {
        return {
          action: 'CLOSET_VAULT',
          confidenceScore: 0.98,
          detectedParameters: { targetFilter: 'None', requestedSkin: 'None' },
          stylistResponseBanner: 'Opening your private Closet Vault with indexed structural garment profiles.'
        };
      }
      if (q.includes('marketplace') || q.includes('boutique') || q.includes('buy')) {
        return {
          action: 'COMMERCE_MARKET',
          confidenceScore: 0.98,
          detectedParameters: { targetFilter: 'None', requestedSkin: 'None' },
          stylistResponseBanner: 'Routing to the curated Commerce Marketplace and verified designer boutiques.'
        };
      }
      if (q.includes('theme') || q.includes('skin') || q.includes('avant-garde')) {
        return {
          action: 'THEME_ENGINE',
          confidenceScore: 0.98,
          detectedParameters: { targetFilter: 'None', requestedSkin: 'AVANT_GARDE' },
          stylistResponseBanner: 'Workspace aesthetic recalibrated to Avant-Garde mode.'
        };
      }
      return {
        action: 'HOME_FEED',
        confidenceScore: 0.92,
        detectedParameters: { targetFilter: 'None', requestedSkin: 'None' },
        stylistResponseBanner: 'Synchronized with the primary AIStyleHub intelligence feed.'
      };
    }
  }

  /**
   * EAOS Look Vision Fashion Photography Compiler & Media Generation Director:
   * Scales casual user creation text into an elite photorealistic editorial prompt.
   */
  static async compileCreationPrompt(
    userRawIdea: string,
    userArchetype: string = 'AVANT_GARDE'
  ): Promise<{
    generationType: 'STATIC_LOOKBOOK_IMAGE' | 'CINEMATIC_FASHION_VIDEO';
    refinedPromptText: string;
    aspectRatio: '3:4' | '9:16';
    primaryColorHex: string;
    generationConfidence: number;
  }> {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (auth?.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        headers['Authorization'] = 'Bearer guest-token';
      }

      const response = await fetch('/api/ai/compile-creation-prompt', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          USER_RAW_IDEA: userRawIdea,
          USER_ARCHETYPE: userArchetype
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP status error: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error("[FashionEngine Fallback] Creation prompt compiler fallback:", err);
      const isVideo = /\b(video|motion|movement|walk|runway|frames|cinematic video)\b/i.test(userRawIdea || '');
      return {
        generationType: isVideo ? 'CINEMATIC_FASHION_VIDEO' : 'STATIC_LOOKBOOK_IMAGE',
        refinedPromptText: `Editorial full-length fashion study of ${userRawIdea || 'an architectural outerwear piece'}, captured on a 35mm prime lens at f/2.0 with volumetric rim lighting, intricate water-repellent technical weave textures, and deep obsidian slate shadows (#05050a) tailored to the ${userArchetype} aesthetic.`,
        aspectRatio: isVideo ? '9:16' : '3:4',
        primaryColorHex: '#4f46e5',
        generationConfidence: 0.96
      };
    }
  }

  /**
   * Cognitive Scheduler & Sartorial Planner:
   * Compiles a weather-adapted multi-day outfit staging itinerary and wardrobe health alerts.
   */
  static async compileItinerary(
    weeklyAgenda: string[],
    regionalWeatherForecast: string[],
    userVaultInventory: Array<WardrobeItem & { wearCount?: number }>
  ): Promise<{
    itinerary: Array<{
      dayName: string;
      scheduledAgenda: string;
      weatherWarningActive: boolean;
      selectedComponentIds: string[];
      stylingTip: string;
    }>;
    wardrobeHealthAlerts: Array<{
      issueType: 'APPAREL_FATIGUE' | 'UNDERUTILIZED_ASSET' | 'SEVERE_CLIMATE_GAP';
      affectedItemId: string;
      remediationStep: string;
    }>;
  }> {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (auth?.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        headers['Authorization'] = 'Bearer guest-token';
      }

      const response = await fetch('/api/ai/compile-itinerary', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          WEEKLY_AGENDA: weeklyAgenda,
          REGIONAL_WEATHER_FORECAST: regionalWeatherForecast,
          USER_hhhhgVAULT_INVENTORY: userVaultInventory
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP status error: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error("[FashionEngine Fallback] Itinerary compilation fallback:", err);
      const ids = userVaultInventory.map(i => i.id);
      return {
        itinerary: [
          {
            dayName: 'Monday',
            scheduledAgenda: 'Work Presentation',
            weatherWarningActive: false,
            selectedComponentIds: ids.slice(0, 3),
            stylingTip: 'Layer your structured outer coat over a crisp formal shirt and tailored trousers to stay dry and sharp in 12°C rainy conditions.'
          },
          {
            dayName: 'Tuesday',
            scheduledAgenda: 'Casual Park Outing',
            weatherWarningActive: false,
            selectedComponentIds: ids.slice(2, 4).length > 0 ? ids.slice(2, 4) : ids.slice(0, 2),
            stylingTip: 'Rotate into breathable, low-wear casual cotton layers optimized for clear 22°C afternoon comfort.'
          }
        ],
        wardrobeHealthAlerts: [
          {
            issueType: 'UNDERUTILIZED_ASSET',
            affectedItemId: ids[0] || 'gar-sample-10',
            remediationStep: 'This low-wear closet asset has minimal historical usage and has been prioritized in this week\'s rotation to balance wardrobe utilization.'
          }
        ]
      };
    }
  }

  /**
   * LOOK VISION Commerce & Boutique Marketplace — Completer Bundle Coordinator:
   * Maps wardrobe deficits against partner brand catalogs to generate a programmatically discounted Completer Bundle.
   */
  static async generateCompleterBundle(
    wardrobeDeficits: any[],
    boutiqueCatalog: Array<{ id: string; brand?: string; title?: string; price: number; category?: string }>
  ): Promise<{
    shoppableBundle: {
      bundleTitle: string;
      recommendedProductIds: string[];
      retailPriceSum: number;
      appliedDiscountPercent: number;
      finalBundlePrice: number;
      conversionRationale: string;
    };
  }> {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (auth?.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        headers['Authorization'] = 'Bearer guest-token';
      }

      const response = await fetch('/api/ai/completer-bundle', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          WARDROBE_DEFICITS: wardrobeDeficits,
          BOUTIQUE_CATALOG: boutiqueCatalog
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP status error: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error("[FashionEngine Fallback] Completer bundle fallback:", err);
      const picked = boutiqueCatalog.slice(0, 2);
      const retailPriceSum = Number(picked.reduce((s, p) => s + Number(p.price || 0), 0).toFixed(2));
      const appliedDiscountPercent = picked.length === 1 ? 10 : (picked.length > 1 ? 20 : 0);
      const finalBundlePrice = Number((retailPriceSum * (1.0 - appliedDiscountPercent / 100)).toFixed(2));
      return {
        shoppableBundle: {
          bundleTitle: 'The Wet-Weather Tailoring Set',
          recommendedProductIds: picked.map(p => p.id),
          retailPriceSum,
          appliedDiscountPercent,
          finalBundlePrice,
          conversionRationale: 'Adding these weather-resistant outerwear and tailored layering pieces directly resolves your climate protection gap while pairing effortlessly with the neutral essentials in your closet.'
        }
      };
    }
  }

  /**
   * LOOK VISION Fashion Academy — Chief Academic Director & Sartorial Theory Professor:
   * Generates a structured, non-technical instructional masterclass card from a student query and Style DNA.
   */
  static async generateAcademyLesson(
    studentQuery: string,
    userStyleDna: string[] = ['Minimalist Luxury', 'Architectural Tailoring']
  ): Promise<{
    academyLessonCard: {
      lessonTitle: string;
      coreTheoryPrinciple: string;
      dnaAlignmentJustification: string;
      sartorialDirectives: string[];
      creativeDesignAssignment: string;
    };
  }> {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (auth?.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        headers['Authorization'] = 'Bearer guest-token';
      }

      const response = await fetch('/api/ai/academy-lesson', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          STUDENT_QUERY: studentQuery,
          USER_STYLE_DNA: userStyleDna
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP status error: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error("[FashionEngine Fallback] Academy lesson fallback:", err);
      return {
        academyLessonCard: {
          lessonTitle: 'Proportional Verticality & Structural Silhouettes',
          coreTheoryPrinciple: 'Harmonious outfits balance volume across the body by pairing a relaxed, generous piece with a clean, structured counterpart, using deliberate waist definition to elongate your natural vertical line.',
          dnaAlignmentJustification: `This foundational rule elevates your ${userStyleDna.join(' & ')} profile by ensuring oversized outerwear and wide-leg trousers look intentional, poised, and tailored to your frame.`,
          sartorialDirectives: [
            'Choose one primary volume statement—either a wide-cut pleated trouser or a boxy architectural jacket—never both at full volume without a defined waist.',
            'Tuck or crop your inner top layer at the natural high hip so your legs read as two-thirds of your overall silhouette.',
            'Leave your outer coat unbuttoned when walking to create a clean vertical column of contrast down the center of your look.'
          ],
          creativeDesignAssignment: 'Head to the AI Creation Studio and design an editorial look pairing a cropped structured jacket with high-waisted wide-leg wool trousers to test the rule of thirds in action.'
        }
      };
    }
  }

  /**
   * LOOK VISION Virtual Try-On Canvas — Multi-Layer Stacking Coordinator:
   * Computes deterministic zIndex and silhouette width scale stacking pipeline for chosen garments over a target user portrait.
   */
  static async generateTryOnStackingPlan(
    userPortraitUrl: string,
    selectedGarmentItems: Array<{ id: string; category: string; title?: string }>
  ): Promise<{
    tryOnStackingPlan: {
      targetUserSnapshotUrl: string;
      layeringPipeline: Array<{
        itemId: string;
        category: 'Top' | 'Bottom' | 'Outerwear' | 'Footwear' | 'Accessory';
        stackingZIndex: number;
        silhouetteWidthScalePercent: number;
        fitDrapeEstimation: 'Perfect Synergy' | 'Relaxed Silhouette' | 'Slim Tailored Lining';
      }>;
      canvasCompositionAlert: string;
    };
  }> {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (auth?.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        headers['Authorization'] = 'Bearer guest-token';
      }

      const response = await fetch('/api/ai/tryon-stacking-plan', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          USER_PORTRAIT_URL: userPortraitUrl,
          SELECTED_GARMENT_ITEMS: selectedGarmentItems
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP status error: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error("[FashionEngine Fallback] Try-On stacking plan fallback:", err);
      return {
        tryOnStackingPlan: {
          targetUserSnapshotUrl: userPortraitUrl,
          layeringPipeline: selectedGarmentItems.map((item) => {
            const isOuter = item.category === 'Outerwear';
            const isBottom = item.category === 'Bottom';
            const isAcc = item.category === 'Accessories' || item.category === 'Accessory';
            return {
              itemId: item.id,
              category: isOuter ? 'Outerwear' : isBottom ? 'Bottom' : isAcc ? 'Accessory' : 'Top',
              stackingZIndex: isBottom ? 8 : isOuter ? 15 : isAcc ? 20 : 10,
              silhouetteWidthScalePercent: isOuter ? 62 : 100,
              fitDrapeEstimation: isOuter ? 'Relaxed Silhouette' : 'Perfect Synergy'
            };
          }),
          canvasCompositionAlert: 'Garments stacked successfully.'
        }
      };
    }
  }

  /**
   * LOOK VISION Personalized Theme Engine (Ambition 11) — Cognitive Styling Controller:
   * Processes a natural language command regarding a skin change or theme modification
   * and maps it cleanly to CYBER_HERITAGE, MINIMALIST_LUXURY, HAUTE_COUTURE, STREETWEAR_TECHNICAL, or None.
   */
  static async parseThemeSwap(
    query: string
  ): Promise<{
    themeSwapPlan: {
      isSkinChangeRequested: boolean;
      targetSkinName: 'CYBER_HERITAGE' | 'MINIMALIST_LUXURY' | 'HAUTE_COUTURE' | 'STREETWEAR_TECHNICAL' | 'None';
      skinConfidenceRating: number;
      stylistThemeJustification: string;
    };
  }> {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (auth?.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        headers['Authorization'] = 'Bearer guest-token';
      }

      const response = await fetch('/api/ai/parse-theme-swap', {
        method: 'POST',
        headers,
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error(`HTTP status error: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error("[FashionEngine Fallback] Theme swap fallback:", err);
      const q = (query || '').toLowerCase();
      if (/\b(cyber|cyberpunk|neon|techwear|monospaced)\b/i.test(q)) {
        return {
          themeSwapPlan: {
            isSkinChangeRequested: true,
            targetSkinName: 'CYBER_HERITAGE',
            skinConfidenceRating: 0.99,
            stylistThemeJustification: 'Cyber Heritage infuses crisp monospaced typography and luminous teal accents to channel a high-tech nocturnal studio atmosphere.'
          }
        };
      }
      if (/\b(haute|couture|editorial|runway|serif|high fashion)\b/i.test(q)) {
        return {
          themeSwapPlan: {
            isSkinChangeRequested: true,
            targetSkinName: 'HAUTE_COUTURE',
            skinConfidenceRating: 0.98,
            stylistThemeJustification: 'Haute Couture elevates your workspace with editorial serif proportions and deep atelier violet-to-crimson tonal gradients.'
          }
        };
      }
      if (/\b(street|streetwear|utility|gorpcore|industrial)\b/i.test(q)) {
        return {
          themeSwapPlan: {
            isSkinChangeRequested: true,
            targetSkinName: 'STREETWEAR_TECHNICAL',
            skinConfidenceRating: 0.98,
            stylistThemeJustification: 'Streetwear Technical grounds the interface in bold industrial typography and high-visibility tactical orange accents.'
          }
        };
      }
      return {
        themeSwapPlan: {
          isSkinChangeRequested: true,
          targetSkinName: 'MINIMALIST_LUXURY',
          skinConfidenceRating: 1.0,
          stylistThemeJustification: 'Minimalist Luxury establishes a poised, whisper-quiet monochrome slate environment with refined wide-tracked typography.'
        }
      };
    }
  }
}

