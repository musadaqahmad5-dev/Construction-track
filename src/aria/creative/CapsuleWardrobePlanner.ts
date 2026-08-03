/**
 * ARIA v2.5 Capsule Wardrobe Planner
 * Product: LOOK VISION v2.4
 */

import { CapsuleItem } from './CreativeTypes';
import { StyleDNAProfile } from '../styleDNA/StyleDNATypes';

export class CapsuleWardrobePlanner {
  public static planCapsule(
    styleDNA: StyleDNAProfile | null,
    desiredPieceCount: number = 8,
    season?: string
  ): CapsuleItem[] {
    const primaryColor = styleDNA?.colorProfile[0]?.value || 'Deep Charcoal';
    const secondaryColor = styleDNA?.colorProfile[1]?.value || 'Warm Cream / Oat';
    const accentColor = styleDNA?.colorProfile[2]?.value || 'Midnight Indigo';

    const primaryMaterial = styleDNA?.materialProfile[0]?.value || 'Virgin Wool Blend';
    const secondaryMaterial = styleDNA?.materialProfile[1]?.value || 'Heavyweight Cotton Silk';

    const seasonalContext = season || 'Trans-Seasonal';

    const baseTemplate: Array<Omit<CapsuleItem, 'id'>> = [
      {
        name: `Structured Single-Breasted Blazer`,
        category: 'Outerwear',
        color: primaryColor,
        material: primaryMaterial,
        versatilityScore: 0.95,
        pairings: ['Pleated Trousers', 'Silk Cashmere Knit', 'Classic Denim']
      },
      {
        name: `Pleated Wide-Leg Trousers`,
        category: 'Bottoms',
        color: primaryColor,
        material: primaryMaterial,
        versatilityScore: 0.92,
        pairings: ['Blazer', 'Crewneck Knit', 'Tailored Overshirt']
      },
      {
        name: `Fine-Gauge Silk Cashmere Crewneck`,
        category: 'Knitwear',
        color: secondaryColor,
        material: 'Silk Cashmere',
        versatilityScore: 0.90,
        pairings: ['Blazer', 'Wide-Leg Trousers', 'Structure Overshirt']
      },
      {
        name: `Architectural Poplin Button-Down Shirt`,
        category: 'Tops',
        color: 'Crisp Optic White',
        material: 'Crisp Cotton Poplin',
        versatilityScore: 0.88,
        pairings: ['Wide-Leg Trousers', 'Knit Tank', 'Blazer']
      },
      {
        name: `Tailored Minimalist Overshirt / Shacket`,
        category: 'Outerwear Layer',
        color: accentColor,
        material: secondaryMaterial,
        versatilityScore: 0.85,
        pairings: ['Poplin Shirt', 'Straight-Leg Denim', 'Crewneck']
      },
      {
        name: `Straight-Cut Selvedge Indigo Denim`,
        category: 'Bottoms',
        color: 'Deep Raw Indigo',
        material: 'Selvedge Cotton Denim',
        versatilityScore: 0.89,
        pairings: ['Blazer', 'Poplin Shirt', 'Cashmere Knit']
      },
      {
        name: `Minimalist Leather Chelsea / Loafer`,
        category: 'Footwear',
        color: 'Nero Black Leather',
        material: 'Full-Grain Italian Calfskin',
        versatilityScore: 0.94,
        pairings: ['All Tops & Bottoms']
      },
      {
        name: `Sculptural Structured Tote / Bag`,
        category: 'Accessories',
        color: primaryColor,
        material: 'Smooth Calfskin',
        versatilityScore: 0.90,
        pairings: ['All Capsule Ensembles']
      }
    ];

    const count = Math.min(Math.max(desiredPieceCount, 4), baseTemplate.length);

    return baseTemplate.slice(0, count).map((item, idx) => ({
      ...item,
      id: `cap_item_${Date.now()}_${idx + 1}`
    }));
  }
}
