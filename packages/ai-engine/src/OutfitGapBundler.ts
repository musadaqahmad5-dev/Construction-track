/**
 * EAOS Look Vision AI Fashion OS - Programmatic Wardrobe Deficit Analyzer & Bundling Engine
 * Path: packages/ai-engine/src/OutfitGapBundler.ts
 * Subsystem: Intelligent Gap Detection, Climate-Aware Layering & Multi-Item Conversion Engine
 */

import crypto from 'crypto';
import { getFirestore } from 'firebase-admin/firestore';

// ============================================================================
// STRICT DOMAIN CONTRACTS & TYPE DEFINITIONS
// ============================================================================

export type GarmentCategory =
  | 'Top'
  | 'Bottom'
  | 'Outerwear'
  | 'Footwear'
  | 'Accessory'
  | 'Knitwear'
  | 'Dress'
  | 'Tailoring';

export type GapSeverity = 'HIGH' | 'MEDIUM' | 'SUGGESTION';

export interface OutfitComponentSpec {
  id: string;
  category: GarmentCategory | string;
  color: string;
}

export interface DeficitScanReport {
  gapSeverity: GapSeverity;
  missingCategory: GarmentCategory;
  colorHarmonyRecommendation: string;
  rationale: string;
}

export interface BundledMerchantProduct {
  id: string;
  title: string;
  category: string;
  price: number;
  currency: string;
  imageUrl: string;
  sku: string;
  merchantDomain: string;
  matchedHarmonyColor: string;
}

export interface ShoppableBundle {
  recommendedProducts: BundledMerchantProduct[];
  retailPriceSum: number;
  appliedDiscountPercent: number;
  finalBundlePrice: number;
  currency: string;
  checkoutTraceId: string;
  generatedAt: string;
}

export interface OutfitGapBundlerOptions {
  firestoreInstance?: any;
  defaultCurrency?: string;
}

// Fallback curated staple catalog for offline/standalone execution
const FALLBACK_MERCHANT_STAPLES: BundledMerchantProduct[] = [
  {
    id: 'prod_atelier_trench_noir_01',
    title: 'Bonded Basalt Trench Coat',
    category: 'Outerwear',
    price: 420.0,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    sku: 'SKU-OUTER-BASALT-01',
    merchantDomain: 'atelier-milan.eaos.io',
    matchedHarmonyColor: 'Basalt Obsidian'
  },
  {
    id: 'prod_cashmere_knit_slate_02',
    title: 'Brushed Cashmere Cocoon Knit',
    category: 'Knitwear',
    price: 280.0,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
    sku: 'SKU-KNIT-SLATE-02',
    merchantDomain: 'atelier-paris.eaos.io',
    matchedHarmonyColor: 'Minimal Slate'
  },
  {
    id: 'prod_chelsea_boot_leather_03',
    title: 'Vibram-Sole Leather Chelsea Boot',
    category: 'Footwear',
    price: 360.0,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
    sku: 'SKU-BOOT-LEATHER-03',
    merchantDomain: 'nordic-craft.eaos.io',
    matchedHarmonyColor: 'Basalt Obsidian'
  },
  {
    id: 'prod_silk_scarf_emerald_04',
    title: 'Mulberry Silk Architectural Scarf',
    category: 'Accessory',
    price: 140.0,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80',
    sku: 'SKU-ACC-SILK-04',
    merchantDomain: 'atelier-kyoto.eaos.io',
    matchedHarmonyColor: 'Neo Emerald'
  }
];

// ============================================================================
// OUTFIT GAP BUNDLER ENGINE IMPLEMENTATION
// ============================================================================

export class OutfitGapBundler {
  private customFirestore: any;
  private defaultCurrency: string;

  constructor(options?: OutfitGapBundlerOptions) {
    this.customFirestore = options?.firestoreInstance || null;
    this.defaultCurrency = options?.defaultCurrency || 'USD';
  }

  /**
   * Resolves harmonic counterpart color based on existing garment palettes
   */
  private computeColorHarmonyRecommendation(existingColors: string[]): string {
    const colorString = existingColors.join(' ').toLowerCase();

    if (colorString.includes('black') || colorString.includes('obsidian') || colorString.includes('dark')) {
      return 'Minimal Slate';
    }
    if (colorString.includes('white') || colorString.includes('cream') || colorString.includes('beige')) {
      return 'Basalt Obsidian';
    }
    if (colorString.includes('green') || colorString.includes('emerald') || colorString.includes('olive')) {
      return 'Warm Alabaster';
    }
    if (colorString.includes('blue') || colorString.includes('indigo') || colorString.includes('navy')) {
      return 'Neo Emerald';
    }
    return 'Basalt Obsidian';
  }

  /**
   * Evaluates current outfit against environmental and category invariants
   */
  private inspectOutfitDeficits(
    currentOutfit: OutfitComponentSpec[],
    weatherCondition: string,
    currentTempCelsius: number
  ): DeficitScanReport[] {
    const reports: DeficitScanReport[] = [];
    const normalizedCategories = new Set(
      currentOutfit.map(item => (item.category || '').toLowerCase().trim())
    );
    const existingColors = currentOutfit.map(item => item.color || 'Neutral');
    const harmonyColor = this.computeColorHarmonyRecommendation(existingColors);

    const isRainy = (weatherCondition || '').toLowerCase().includes('rain');
    const isCold = currentTempCelsius < 15;
    const isFreezing = currentTempCelsius < 8;

    // Rule 1: Outerwear Gap Evaluation
    if (!normalizedCategories.has('outerwear')) {
      if (isRainy || isCold) {
        reports.push({
          gapSeverity: 'HIGH',
          missingCategory: 'Outerwear',
          colorHarmonyRecommendation: harmonyColor,
          rationale: `Climate conditions (${weatherCondition}, ${currentTempCelsius}°C) necessitate a protective outer shell layer.`
        });
      } else {
        reports.push({
          gapSeverity: 'SUGGESTION',
          missingCategory: 'Outerwear',
          colorHarmonyRecommendation: harmonyColor,
          rationale: 'Lightweight layering enhances silhouette structure and visual maturity.'
        });
      }
    }

    // Rule 2: Knitwear Mid-layer Gap
    if (isFreezing && !normalizedCategories.has('knitwear')) {
      reports.push({
        gapSeverity: 'MEDIUM',
        missingCategory: 'Knitwear',
        colorHarmonyRecommendation: harmonyColor,
        rationale: `Sub-optimal thermal retention detected at ${currentTempCelsius}°C. Mid-layer cashmere insulation recommended.`
      });
    }

    // Rule 3: Footwear Gap
    if (!normalizedCategories.has('footwear')) {
      reports.push({
        gapSeverity: isRainy ? 'HIGH' : 'MEDIUM',
        missingCategory: 'Footwear',
        colorHarmonyRecommendation: harmonyColor,
        rationale: isRainy
          ? 'Water-resistant bonded footwear required for precipitation conditions.'
          : 'Grounding footwear needed to complete stylistic balance.'
      });
    }

    // Rule 4: Accessory Accent Gap
    if (!normalizedCategories.has('accessory') && currentOutfit.length >= 2) {
      reports.push({
        gapSeverity: 'SUGGESTION',
        missingCategory: 'Accessory',
        colorHarmonyRecommendation: harmonyColor,
        rationale: 'High-contrast accessory element recommended to elevate aesthetic index score.'
      });
    }

    return reports;
  }

  /**
   * Queries Firestore /merchantProducts collection for matching staple products
   */
  private async queryMatchingProductsForDeficits(
    deficits: DeficitScanReport[],
    traceId: string
  ): Promise<BundledMerchantProduct[]> {
    const matchedProducts: BundledMerchantProduct[] = [];
    const targetCategories = new Set(deficits.map(d => d.missingCategory.toLowerCase()));

    try {
      const db = this.customFirestore || getFirestore();
      const snapshot = await db.collection('merchantProducts').limit(30).get();

      if (!snapshot.empty) {
        snapshot.forEach((doc: any) => {
          const data = doc.data();
          const docCategory = (data.category || '').toLowerCase();

          for (const deficit of deficits) {
            if (docCategory.includes(deficit.missingCategory.toLowerCase())) {
              matchedProducts.push({
                id: doc.id,
                title: data.title || 'Atelier Garment',
                category: data.category || deficit.missingCategory,
                price: typeof data.price === 'number' ? data.price : parseFloat(data.price) || 250.0,
                currency: data.currency || this.defaultCurrency,
                imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
                sku: data.sku || `SKU-${doc.id}`,
                merchantDomain: data.merchantDomain || 'atelier.eaos.io',
                matchedHarmonyColor: deficit.colorHarmonyRecommendation
              });
              break;
            }
          }
        });
      }
    } catch (firestoreErr: unknown) {
      console.warn(
        JSON.stringify({
          level: 'WARN',
          event: 'MERCHANT_PRODUCTS_QUERY_FALLBACK',
          'x-trace-id': traceId,
          message: firestoreErr instanceof Error ? firestoreErr.message : String(firestoreErr)
        })
      );
    }

    // If database matches are insufficient, draw from verified fallback staples
    if (matchedProducts.length === 0) {
      for (const deficit of deficits) {
        const fallback = FALLBACK_MERCHANT_STAPLES.find(
          item => item.category.toLowerCase() === deficit.missingCategory.toLowerCase()
        );
        if (fallback && !matchedProducts.some(p => p.id === fallback.id)) {
          matchedProducts.push({
            ...fallback,
            matchedHarmonyColor: deficit.colorHarmonyRecommendation
          });
        }
      }
    }

    // Deduplicate and cap bundle to top 3 relevant deficit items
    const seenIds = new Set<string>();
    return matchedProducts.filter(p => {
      if (seenIds.has(p.id)) return false;
      seenIds.add(p.id);
      return true;
    }).slice(0, 3);
  }

  /**
   * Calculates programmatically discounted bundle pricing according to strict formula:
   * FinalPrice = Sum(RetailPrice) * (1.0 - DiscountRatePercent)
   */
  private calculateBundlePricing(products: BundledMerchantProduct[]): {
    retailPriceSum: number;
    appliedDiscountPercent: number;
    finalBundlePrice: number;
  } {
    if (!products || products.length === 0) {
      return { retailPriceSum: 0, appliedDiscountPercent: 0, finalBundlePrice: 0 };
    }

    const retailPriceSum = products.reduce((acc, p) => acc + (p.price || 0), 0);

    // Dynamic tiered discount rule: 1 item = 10%, Multiple items = 20%
    const appliedDiscountPercent = products.length === 1 ? 10 : 20;
    const discountFactor = appliedDiscountPercent / 100;
    const finalBundlePrice = retailPriceSum * (1.0 - discountFactor);

    return {
      retailPriceSum: Number(retailPriceSum.toFixed(2)),
      appliedDiscountPercent,
      finalBundlePrice: Number(finalBundlePrice.toFixed(2))
    };
  }

  /**
   * Scans an outfit for climate and structural gaps, returning a discounted shoppable bundle
   *
   * @param userId Target user identity
   * @param currentOutfit Active outfit components
   * @param weatherCondition Real-time climate string (e.g., 'Rainy', 'Clear', 'Snow')
   * @param currentTempCelsius Ambient temperature in Celsius
   */
  public async scanOutfitAndGenerateBundle(
    userId: string,
    currentOutfit: OutfitComponentSpec[],
    weatherCondition: string,
    currentTempCelsius: number
  ): Promise<ShoppableBundle | null> {
    const startTime = performance.now();
    const traceId = `trc_bundle_${crypto.randomBytes(6).toString('hex')}`;
    const generatedAt = new Date().toISOString();

    if (!userId || typeof userId !== 'string' || !userId.trim()) {
      throw new Error('[OUTFIT BUNDLER ERROR] Parameter validation failed: userId is required.');
    }

    if (!Array.isArray(currentOutfit)) {
      throw new Error('[OUTFIT BUNDLER ERROR] Parameter validation failed: currentOutfit must be an array.');
    }

    console.info(
      JSON.stringify({
        level: 'INFO',
        event: 'OUTFIT_DEFICIT_SCAN_STARTED',
        'x-trace-id': traceId,
        userId: userId.trim(),
        componentCount: currentOutfit.length,
        weather: weatherCondition,
        tempC: currentTempCelsius,
        timestamp: generatedAt
      })
    );

    try {
      // 1. Inspect wardrobe deficits
      const deficits = this.inspectOutfitDeficits(currentOutfit, weatherCondition, currentTempCelsius);

      if (deficits.length === 0) {
        console.info(
          JSON.stringify({
            level: 'INFO',
            event: 'OUTFIT_COMPLETE_NO_GAPS',
            'x-trace-id': traceId,
            userId: userId.trim(),
            timestamp: generatedAt
          })
        );
        return null;
      }

      console.info(
        JSON.stringify({
          level: 'INFO',
          event: 'OUTFIT_DEFICITS_IDENTIFIED',
          'x-trace-id': traceId,
          deficitCount: deficits.length,
          deficits,
          timestamp: generatedAt
        })
      );

      // 2. Query matching products
      const recommendedProducts = await this.queryMatchingProductsForDeficits(deficits, traceId);

      if (recommendedProducts.length === 0) {
        return null;
      }

      // 3. Calculate bundle pricing
      const { retailPriceSum, appliedDiscountPercent, finalBundlePrice } =
        this.calculateBundlePricing(recommendedProducts);

      const checkoutTraceId = `chk_${crypto.randomBytes(8).toString('hex')}`;

      const bundle: ShoppableBundle = {
        recommendedProducts,
        retailPriceSum,
        appliedDiscountPercent,
        finalBundlePrice,
        currency: recommendedProducts[0]?.currency || this.defaultCurrency,
        checkoutTraceId,
        generatedAt
      };

      const latencyMs = (performance.now() - startTime).toFixed(2);
      console.info(
        JSON.stringify({
          level: 'INFO',
          event: 'SHOPPABLE_BUNDLE_GENERATED',
          'x-trace-id': traceId,
          checkoutTraceId,
          itemCount: recommendedProducts.length,
          retailTotal: retailPriceSum,
          discount: `${appliedDiscountPercent}%`,
          finalPrice: finalBundlePrice,
          latencyMs,
          timestamp: generatedAt
        })
      );

      return bundle;
    } catch (bundleError: unknown) {
      const latencyMs = (performance.now() - startTime).toFixed(2);
      const errMsg = bundleError instanceof Error ? bundleError.message : String(bundleError);

      console.error(
        JSON.stringify({
          level: 'ERROR',
          event: 'OUTFIT_BUNDLE_GENERATION_FAILED',
          'x-trace-id': traceId,
          userId: userId.trim(),
          error: errMsg,
          latencyMs,
          timestamp: generatedAt
        })
      );

      throw bundleError;
    }
  }
}
