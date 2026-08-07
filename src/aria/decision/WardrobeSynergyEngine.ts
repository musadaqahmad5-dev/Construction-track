/**
 * ARIA v2.5 Wardrobe Intelligence Integration
 * Product: LOOK VISION v2.4
 * 
 * Connects Decision Engine with UnifiedFashionOS wardrobe data,
 * PersonalFashionMemoryEngine, and Style Evolution timeline.
 * STRICT RULE: Prioritizes owned items before suggesting new purchases.
 */

import { UnifiedFashionOS } from '../../features/ai-core/UnifiedFashionOS';
import { WardrobeItem } from '../../core/types';
import { OutfitComposition, OutfitItemReference, ContextProfile } from './DecisionTypes';
import { StyleDNAProfile } from '../styleDNA/StyleDNATypes';
import { FashionMemoryItem } from '../memory/MemoryTypes';

export class WardrobeSynergyEngine {
  /**
   * Retrieves active wardrobe items from UnifiedFashionOS state
   */
  public static getActiveWardrobeItems(): WardrobeItem[] {
    try {
      const state = UnifiedFashionOS.getState();
      const items = state?.unifiedStyleMemory?.wardrobe_items;
      if (Array.isArray(items) && items.length > 0) {
        return items;
      }
    } catch (err) {
      console.warn('[WardrobeSynergyEngine] Could not retrieve UnifiedFashionOS state:', err);
    }
    return [];
  }

  /**
   * Assembles an outfit prioritizing existing owned wardrobe items
   */
  public static assembleSynergisticOutfit(
    contextProfile: ContextProfile,
    styleDNA: StyleDNAProfile | null,
    memories: FashionMemoryItem[],
    overrideItems?: WardrobeItem[]
  ): { outfitComposition: OutfitComposition; ownedItemRatio: number } {
    const ownedItems = overrideItems || this.getActiveWardrobeItems();
    
    // Disliked item/color filters from memory
    const dislikedColors = memories
      .filter(m => (m.category === 'color_preference' && m.confidence < 0.3) || m.category === 'user_correction')
      .map(m => String(m.value).toLowerCase());

    const preferredColors = (styleDNA?.colorProfile || [])
      .map(c => c.value.toLowerCase());

    const topOwnedColor = preferredColors[0] || 'black';

    // Helper to find best owned item matching category
    const findOwnedItem = (
      categoryKeywords: string[],
      formalityReq: number
    ): WardrobeItem | null => {
      if (ownedItems.length === 0) return null;

      const candidates = ownedItems.filter(item => {
        if (!item || item.status === 'Worn/Wash') return false;
        
        // Check category match
        const catName = (item.category || '').toLowerCase();
        const titleName = (item.title || item.name || '').toLowerCase();
        const descName = (item.description || '').toLowerCase();
        const combined = `${catName} ${titleName} ${descName}`;

        const isMatch = categoryKeywords.some(kw => combined.includes(kw.toLowerCase()));
        if (!isMatch) return false;

        // Check color dislike filter
        if (item.primaryColor && dislikedColors.some(dc => item.primaryColor?.toLowerCase().includes(dc))) {
          return false;
        }

        return true;
      });

      if (candidates.length === 0) return null;

      // Sort candidate by wearCount or preferred color match
      candidates.sort((a, b) => {
        const aColorMatch = a.primaryColor && preferredColors.some(pc => a.primaryColor?.toLowerCase().includes(pc)) ? 1 : 0;
        const bColorMatch = b.primaryColor && preferredColors.some(pc => b.primaryColor?.toLowerCase().includes(pc)) ? 1 : 0;
        if (aColorMatch !== bColorMatch) return bColorMatch - aColorMatch;

        return (b.wearCount || 0) - (a.wearCount || 0);
      });

      return candidates[0];
    };

    // 1. Top Garment
    const ownedTop = findOwnedItem(['shirt', 'top', 'blouse', 'knit', 'sweater', 't-shirt', 'polo', 'jacket'], contextProfile.formalityRequirement);
    const topItemRef: OutfitItemReference = ownedTop ? {
      id: ownedTop.id,
      title: ownedTop.title || ownedTop.name || 'Owned Top',
      category: ownedTop.category || 'Top',
      color: ownedTop.primaryColor || topOwnedColor,
      brand: ownedTop.strategy || undefined,
      isOwned: true,
      sourceGarmentId: ownedTop.id
    } : {
      title: contextProfile.formalityRequirement >= 0.7 ? 'Tailored Silk/Cotton Dress Shirt' : 'Structured Minimalist Knit',
      category: 'Top',
      color: topOwnedColor,
      isOwned: false
    };

    // 2. Bottom Garment
    const ownedBottom = findOwnedItem(['trouser', 'pant', 'jean', 'skirt', 'bottom', 'slacks', 'chinos'], contextProfile.formalityRequirement);
    const bottomItemRef: OutfitItemReference = ownedBottom ? {
      id: ownedBottom.id,
      title: ownedBottom.title || ownedBottom.name || 'Owned Trousers',
      category: ownedBottom.category || 'Bottom',
      color: ownedBottom.primaryColor || 'Charcoal',
      isOwned: true,
      sourceGarmentId: ownedBottom.id
    } : {
      title: contextProfile.formalityRequirement >= 0.7 ? 'Precision Pleated Trousers' : 'Tailored Straight-Leg Denim',
      category: 'Bottom',
      color: 'Charcoal / Dark Navy',
      isOwned: false
    };

    // 3. Outerwear Garment (if cold or formal)
    let outerwearRef: OutfitItemReference | undefined = undefined;
    if (contextProfile.weatherCondition.temperatureC! < 22 || contextProfile.formalityRequirement >= 0.6) {
      const ownedOuter = findOwnedItem(['blazer', 'coat', 'jacket', 'outerwear', 'trench', 'cardigan'], contextProfile.formalityRequirement);
      outerwearRef = ownedOuter ? {
        id: ownedOuter.id,
        title: ownedOuter.title || ownedOuter.name || 'Owned Outerwear',
        category: ownedOuter.category || 'Outerwear',
        color: ownedOuter.primaryColor || 'Midnight Navy',
        isOwned: true,
        sourceGarmentId: ownedOuter.id
      } : {
        title: contextProfile.formalityRequirement >= 0.75 ? 'Single-Breasted Wool Blazer' : 'Lightweight Technical Overcoat',
        category: 'Outerwear',
        color: 'Midnight Navy',
        isOwned: false
      };
    }

    // 4. Footwear
    const ownedShoe = findOwnedItem(['shoe', 'boot', 'loafer', 'sneaker', 'heel', 'oxford'], contextProfile.formalityRequirement);
    const footwearRef: OutfitItemReference = ownedShoe ? {
      id: ownedShoe.id,
      title: ownedShoe.title || ownedShoe.name || 'Owned Footwear',
      category: ownedShoe.category || 'Footwear',
      color: ownedShoe.primaryColor || 'Black',
      isOwned: true,
      sourceGarmentId: ownedShoe.id
    } : {
      title: contextProfile.formalityRequirement >= 0.7 ? 'Italian Leather Oxfords / Derby Shoes' : 'Minimalist Calfskin Sneakers',
      category: 'Footwear',
      color: 'Black',
      isOwned: false
    };

    // 5. Accessories
    const ownedAcc = findOwnedItem(['accessory', 'watch', 'belt', 'bag', 'sunglasses', 'scarf'], contextProfile.formalityRequirement);
    const accessoryRefs: OutfitItemReference[] = ownedAcc ? [{
      id: ownedAcc.id,
      title: ownedAcc.title || ownedAcc.name || 'Owned Accessory',
      category: ownedAcc.category || 'Accessories',
      color: ownedAcc.primaryColor || 'Silver',
      isOwned: true,
      sourceGarmentId: ownedAcc.id
    }] : [{
      title: 'Architectural Leather Chronograph & Minimalist Belt',
      category: 'Accessories',
      color: 'Matte Black',
      isOwned: false
    }];

    const outfitComposition: OutfitComposition = {
      top: topItemRef,
      bottom: bottomItemRef,
      outerwear: outerwearRef,
      footwear: footwearRef,
      accessories: accessoryRefs
    };

    // Calculate Owned Item Ratio
    let totalPieces = 0;
    let ownedPieces = 0;

    if (outfitComposition.top) { totalPieces++; if (outfitComposition.top.isOwned) ownedPieces++; }
    if (outfitComposition.bottom) { totalPieces++; if (outfitComposition.bottom.isOwned) ownedPieces++; }
    if (outfitComposition.outerwear) { totalPieces++; if (outfitComposition.outerwear.isOwned) ownedPieces++; }
    if (outfitComposition.footwear) { totalPieces++; if (outfitComposition.footwear.isOwned) ownedPieces++; }
    if (outfitComposition.accessories) {
      outfitComposition.accessories.forEach(a => {
        totalPieces++;
        if (a.isOwned) ownedPieces++;
      });
    }

    const ownedItemRatio = totalPieces > 0 ? Number((ownedPieces / totalPieces).toFixed(2)) : 1.0;

    return {
      outfitComposition,
      ownedItemRatio
    };
  }
}
