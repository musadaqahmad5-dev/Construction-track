import crypto from 'crypto';
import fs from 'fs';
import { getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export type GarmentCategory = 'Top' | 'Bottom' | 'Outerwear' | 'Footwear' | 'Accessory' | 'Knitwear';
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

// Curated artisan fallback staples for offline/sandbox execution
const ARTISAN_FALLBACK_STAPLES: Record<string, { title: string; price: number; imageUrl: string; sku: string; shopName: string }> = {
  outerwear: {
    title: 'Bonded Basalt Trench Coat',
    price: 420,
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    sku: 'SKU-OUTER-BASALT-01',
    shopName: 'atelier-milan.eaos.io'
  },
  footwear: {
    title: 'Vibram-Sole Leather Chelsea Boot',
    price: 360,
    imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
    sku: 'SKU-BOOT-LEATHER-03',
    shopName: 'nordic-craft.eaos.io'
  },
  accessory: {
    title: 'Mulberry Silk Architectural Scarf',
    price: 140,
    imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80',
    sku: 'SKU-ACC-SILK-04',
    shopName: 'atelier-kyoto.eaos.io'
  },
  knitwear: {
    title: 'Brushed Cashmere Cocoon Knit',
    price: 280,
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
    sku: 'SKU-KNIT-SLATE-02',
    shopName: 'atelier-paris.eaos.io'
  }
};

export class OutfitGapBundler {
  private hasAdminCredentials(): boolean {
    try {
      const saEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (saEnv && saEnv.trim().length > 0) {
        try {
          const parsed = JSON.parse(saEnv);
          if (parsed.private_key && parsed.client_email) return true;
        } catch (_) {}
      }
      const gacFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      if (gacFile && fs.existsSync(gacFile)) return true;
    } catch (_) {}
    return false;
  }

  private computeColorHarmonyRecommendation(existingColors: string[]): string {
    const colorString = existingColors.join(' ').toLowerCase();
    if (colorString.includes('black') || colorString.includes('dark')) return 'Warm Alabaster';
    if (colorString.includes('white') || colorString.includes('cream')) return 'Basalt Obsidian';
    return 'Minimal Slate';
  }

  private inspectOutfitDeficits(currentOutfit: OutfitComponentSpec[], weatherCondition: string, currentTempCelsius: number): DeficitScanReport[] {
    const reports: DeficitScanReport[] = [];
    const normalizedCategories = new Set(currentOutfit.map(item => (item.category || '').toLowerCase().trim()));
    const existingColors = currentOutfit.map(item => item.color || 'Neutral');
    const harmonyColor = this.computeColorHarmonyRecommendation(existingColors);
    
    const isRainy = (weatherCondition || '').toLowerCase().includes('rain');
    const isCold = currentTempCelsius < 18;

    if (!normalizedCategories.has('outerwear') && (isRainy || isCold)) {
      reports.push({
        gapSeverity: 'HIGH',
        missingCategory: 'Outerwear',
        colorHarmonyRecommendation: harmonyColor,
        rationale: `Climate conditions (${weatherCondition}, ${currentTempCelsius}°C) require a structured protective outer layer.`
      });
    }

    if (!normalizedCategories.has('footwear')) {
      reports.push({
        gapSeverity: isRainy ? 'HIGH' : 'MEDIUM',
        missingCategory: 'Footwear',
        colorHarmonyRecommendation: harmonyColor,
        rationale: 'Complete your styling ensemble with coordinated weather-appropriate footwear.'
      });
    }

    return reports;
  }

  public async scanOutfitAndGenerateBundle(userId: string, currentOutfit: OutfitComponentSpec[], weatherCondition: string, currentTempCelsius: number): Promise<ShoppableBundle | null> {
    const deficits = this.inspectOutfitDeficits(currentOutfit, weatherCondition, currentTempCelsius);
    
    if (deficits.length === 0) return null;

    const recommendedProducts: BundledMerchantProduct[] = [];

    // Query live Firestore products only if valid admin service account credentials exist
    if (this.hasAdminCredentials() && getApps().length > 0) {
      try {
        const db = getFirestore();
        const snapshot = await db.collection('products').limit(10).get();

        snapshot.forEach((doc: any) => {
          const data = doc.data();
          const docCategory = (data.category || '').toLowerCase();
          
          for (const deficit of deficits) {
            if (docCategory.includes(deficit.missingCategory.toLowerCase()) && recommendedProducts.length < 3) {
              recommendedProducts.push({
                id: doc.id,
                title: data.title || 'Artisan Staple',
                category: data.category || deficit.missingCategory,
                price: Number(data.price) || 150,
                currency: data.currency || 'USD',
                imageUrl: data.imageUrl || 'https://unsplash.com',
                sku: data.sku || `SKU-${doc.id}`,
                merchantDomain: data.shopName || 'partner-boutique.eaos.io',
                matchedHarmonyColor: deficit.colorHarmonyRecommendation
              });
              break;
            }
          }
        });
      } catch (err: any) {
        console.warn(`[OutfitGapBundler] Firestore product catalog query unavailable (${err?.message || 'insufficient credentials'}). Utilizing curated artisan staples fallback.`);
      }
    }

    // Gracefully populate from curated artisan staples if database collection has no matches or credentials are in fallback mode
    if (recommendedProducts.length === 0) {
      for (const deficit of deficits) {
        const catKey = deficit.missingCategory.toLowerCase();
        const fallback = ARTISAN_FALLBACK_STAPLES[catKey];
        if (fallback && recommendedProducts.length < 3) {
          recommendedProducts.push({
            id: `artisan_${catKey}_${deficit.missingCategory.toLowerCase()}`,
            title: fallback.title,
            category: deficit.missingCategory,
            price: fallback.price,
            currency: 'USD',
            imageUrl: fallback.imageUrl,
            sku: fallback.sku,
            merchantDomain: fallback.shopName,
            matchedHarmonyColor: deficit.colorHarmonyRecommendation
          });
        }
      }
    }

    if (recommendedProducts.length === 0) return null;

    const retailPriceSum = recommendedProducts.reduce((acc, p) => acc + p.price, 0);
    const appliedDiscountPercent = recommendedProducts.length === 1 ? 10 : 20;
    const finalBundlePrice = retailPriceSum * (1.0 - (appliedDiscountPercent / 100));

    return {
      recommendedProducts,
      retailPriceSum: Number(retailPriceSum.toFixed(2)),
      appliedDiscountPercent,
      finalBundlePrice: Number(finalBundlePrice.toFixed(2)),
      currency: recommendedProducts[0].currency,
      checkoutTraceId: `chk_${crypto.randomBytes(8).toString('hex')}`,
      generatedAt: new Date().toISOString()
    };
  }
}
