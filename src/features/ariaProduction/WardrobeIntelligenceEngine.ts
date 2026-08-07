/**
 * ARIA Wardrobe Intelligence Engine
 * Product: LOOK VISION v2.4.0-telemetry
 * Handles garment metadata, color profile, material profile, usage history, and outfit relationships.
 */

import {
  UserWardrobeProfile,
  WardrobeItemMetadata,
  OutfitRelationship,
  ColorProfile,
  MaterialProfile
} from './ProductionUserTypes';

export class WardrobeIntelligenceEngine {
  /**
   * Generates default baseline wardrobe items if user wardrobe is empty
   */
  public static getInitialSeedItems(): WardrobeItemMetadata[] {
    return [
      {
        id: 'witem_seed_1',
        name: 'Cyberpunk Asymmetric Structural Trenchcoat',
        category: 'Outerwear',
        subCategory: 'Trenchcoat',
        imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800',
        colorProfile: {
          primaryColor: '#0A0A10',
          secondaryColors: ['#3B82F6', '#64748B'],
          colorHarmonyFamily: 'Deep Monochromatic Accent',
          warmthScore: 25
        },
        materialProfile: {
          fabricType: 'Water-repellent Tech Cotton & Kevlar Blend',
          drapeWeight: 'Structured',
          seasonality: ['Autumn', 'Winter', 'Spring'],
          textureNotes: 'Matte architectural weave with hydrophobic coating'
        },
        usageHistory: {
          timesWorn: 14,
          lastWornDate: '2026-08-01',
          versatilityRating: 92,
          userRating: 5
        },
        synergyScore: 96,
        tags: ['Outerwear', 'Statement', 'Waterproof', 'Architectural'],
        addedAt: '2026-07-15T10:00:00.000Z'
      },
      {
        id: 'witem_seed_2',
        name: 'Monochrome Tailored Tapered Trousers',
        category: 'Bottoms',
        subCategory: 'Trousers',
        imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800',
        colorProfile: {
          primaryColor: '#12121A',
          secondaryColors: ['#1E1E2D'],
          colorHarmonyFamily: 'Onyx Monochrome',
          warmthScore: 30
        },
        materialProfile: {
          fabricType: 'Tropical Merino Wool & Elastane',
          drapeWeight: 'Medium',
          seasonality: ['All Season'],
          textureNotes: 'Smooth creased front with elasticized rear waistband'
        },
        usageHistory: {
          timesWorn: 22,
          lastWornDate: '2026-08-03',
          versatilityRating: 98,
          userRating: 5
        },
        synergyScore: 98,
        tags: ['Essential', 'Workwear', 'Tapered', 'Creased'],
        addedAt: '2026-07-16T12:30:00.000Z'
      },
      {
        id: 'witem_seed_3',
        name: 'Minimalist Modular Tech Shell Top',
        category: 'Tops',
        subCategory: 'Knit & Shell',
        imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800',
        colorProfile: {
          primaryColor: '#E2E8F0',
          secondaryColors: ['#94A3B8'],
          colorHarmonyFamily: 'High-Contrast Platinum',
          warmthScore: 40
        },
        materialProfile: {
          fabricType: 'Seamless 3D Knitted Bamboo Microfiber',
          drapeWeight: 'Light',
          seasonality: ['Spring', 'Summer', 'Autumn'],
          textureNotes: 'Breathable ribbed micro-knit with ergonomic stretch'
        },
        usageHistory: {
          timesWorn: 19,
          lastWornDate: '2026-08-04',
          versatilityRating: 90,
          userRating: 4
        },
        synergyScore: 91,
        tags: ['Base Layer', 'Breathable', 'Minimalist', '3D Knit'],
        addedAt: '2026-07-18T09:15:00.000Z'
      },
      {
        id: 'witem_seed_4',
        name: 'Titanium Accent Sculpted Chelsea Boots',
        category: 'Footwear',
        subCategory: 'Boots',
        imageUrl: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=80&w=800',
        colorProfile: {
          primaryColor: '#05050A',
          secondaryColors: ['#64748B', '#000000'],
          colorHarmonyFamily: 'Obsidian Metallic',
          warmthScore: 20
        },
        materialProfile: {
          fabricType: 'Full-grain Calfskin & Vibram Lightweight Sole',
          drapeWeight: 'Heavy',
          seasonality: ['Autumn', 'Winter', 'Spring'],
          textureNotes: 'Burnished toe cap with anodized metallic heel trim'
        },
        usageHistory: {
          timesWorn: 16,
          lastWornDate: '2026-08-02',
          versatilityRating: 88,
          userRating: 5
        },
        synergyScore: 94,
        tags: ['Footwear', 'Leather', 'Vibram', 'Sculpted'],
        addedAt: '2026-07-20T14:40:00.000Z'
      }
    ];
  }

  /**
   * Recalculates metrics (color & category distribution, average synergy score)
   */
  public static recalculateWardrobeMetrics(items: WardrobeItemMetadata[], existingOutfits: OutfitRelationship[] = []): UserWardrobeProfile {
    const colorDist: Record<string, number> = {};
    const catDist: Record<string, number> = {};
    let totalSynergy = 0;

    items.forEach((item) => {
      catDist[item.category] = (catDist[item.category] || 0) + 1;
      const primaryColor = item.colorProfile?.primaryColor || '#000000';
      colorDist[primaryColor] = (colorDist[primaryColor] || 0) + 1;
      totalSynergy += item.synergyScore || 80;
    });

    const synergyScoreAvg = items.length > 0 ? Math.round(totalSynergy / items.length) : 0;

    return {
      totalItems: items.length,
      items,
      colorDistribution: colorDist,
      categoryDistribution: catDist,
      favoriteOutfits: existingOutfits,
      synergyScoreAvg
    };
  }

  /**
   * Adds a new garment to wardrobe profile
   */
  public static addWardrobeItem(
    currentProfile: UserWardrobeProfile,
    newItemData: Omit<WardrobeItemMetadata, 'id' | 'addedAt'>
  ): { updatedWardrobe: UserWardrobeProfile; newItem: WardrobeItemMetadata } {
    const newItem: WardrobeItemMetadata = {
      ...newItemData,
      id: `witem_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      addedAt: new Date().toISOString()
    };

    const updatedItems = [newItem, ...currentProfile.items];
    const updatedWardrobe = this.recalculateWardrobeMetrics(updatedItems, currentProfile.favoriteOutfits);

    return { updatedWardrobe, newItem };
  }

  /**
   * Removes a garment from wardrobe profile
   */
  public static removeWardrobeItem(currentProfile: UserWardrobeProfile, itemId: string): UserWardrobeProfile {
    const updatedItems = currentProfile.items.filter((item) => item.id !== itemId);
    return this.recalculateWardrobeMetrics(updatedItems, currentProfile.favoriteOutfits);
  }

  /**
   * Records usage for an item
   */
  public static recordUsage(currentProfile: UserWardrobeProfile, itemId: string): UserWardrobeProfile {
    const updatedItems = currentProfile.items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          usageHistory: {
            ...item.usageHistory,
            timesWorn: item.usageHistory.timesWorn + 1,
            lastWornDate: new Date().toISOString().split('T')[0]
          }
        };
      }
      return item;
    });

    return this.recalculateWardrobeMetrics(updatedItems, currentProfile.favoriteOutfits);
  }

  /**
   * Creates an outfit relationship
   */
  public static createOutfit(
    currentProfile: UserWardrobeProfile,
    outfitData: Omit<OutfitRelationship, 'id'>
  ): { updatedWardrobe: UserWardrobeProfile; newOutfit: OutfitRelationship } {
    const newOutfit: OutfitRelationship = {
      ...outfitData,
      id: `outfit_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    };

    const updatedOutfits = [newOutfit, ...currentProfile.favoriteOutfits];
    const updatedWardrobe = {
      ...currentProfile,
      favoriteOutfits: updatedOutfits
    };

    return { updatedWardrobe, newOutfit };
  }

  /**
   * Calculates synergy between two items
   */
  public static analyzeSynergy(itemA: WardrobeItemMetadata, itemB: WardrobeItemMetadata): number {
    let score = 70;
    // Category complementary check
    if (itemA.category !== itemB.category) score += 15;
    // Color harmony check
    if (itemA.colorProfile.colorHarmonyFamily === itemB.colorProfile.colorHarmonyFamily) score += 10;
    return Math.min(100, score);
  }
}
