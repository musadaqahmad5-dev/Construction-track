import { PersonaVector } from '../user-profile-memory/vectorProfileMemory';

export interface RenderedLook {
  renderId: string;
  heroLook: {
    title: string;
    description: string;
    aestheticVibe: string;
    imageUrl: string; // Generative / thematic gradient representation
  };
  alternates: {
    title: string;
    description: string;
    aestheticVibe: string;
    imageUrl: string;
    category?: string; // Fallback
    fabric?: string; // Fallback
  }[];
  palette: {
    name: string;
    hexes: string[];
  };
  garmentLayers: {
    layer: 'base' | 'inner' | 'mid' | 'outer' | 'acc';
    layerId?: string; // Fallback
    title: string;
    name?: string; // Fallback
    description: string;
    color: string;
    category?: string; // Fallback
    fabric?: string; // Fallback
    opacityPercent?: number; // Fallback
  }[];
  confidence: number;
}

export class OutfitRenderer {
  /**
   * Deterministically produces premium wardrobe layout representations
   */
  static renderLook(
    vector: PersonaVector,
    occasion: string,
    weather: { temperature: number; condition: string },
    trendSignals: string[],
    budget: number
  ): RenderedLook {
    // 1. Establish core vibe
    let vibe = 'Minimalist';
    let maxWeight = vector.minimalist;

    if (vector.streetwear > maxWeight) { vibe = 'Streetwear'; maxWeight = vector.streetwear; }
    if (vector.classic > maxWeight) { vibe = 'Classic'; maxWeight = vector.classic; }
    if (vector.luxury > maxWeight) { vibe = 'Luxury'; maxWeight = vector.luxury; }
    if (vector.cyberpunk > maxWeight) { vibe = 'Cyberpunk'; maxWeight = vector.cyberpunk; }
    if (vector.traditional > maxWeight) { vibe = 'Traditional'; maxWeight = vector.traditional; }

    // Generative title and layers based on weather and budget
    const isCold = weather.temperature < 15;
    const isBudgetFriendly = budget < 150;

    let heroTitle = `${vibe} Urban Explorer`;
    let heroDesc = `A perfectly balanced ensemble curated for a ${weather.condition.toLowerCase()} day.`;
    let primaryGradient = 'from-slate-800 to-indigo-950';

    const layers: { layer: 'base' | 'inner' | 'mid' | 'outer' | 'acc'; title: string; description: string; color: string }[] = [];
    const hexes: string[] = [];

    // Setup visual themes
    if (vibe === 'Minimalist') {
      primaryGradient = 'from-stone-100 to-stone-400';
      hexes.push('#F5F5F4', '#E7E5E4', '#D6D3D1', '#78716C', '#1C1917');
      heroTitle = 'Architectural Soft-Plated Minimalist Set';
      heroDesc = 'Focuses on structured silhouettes, soft cottons, and high-quality neutral drapes.';
      layers.push(
        { layer: 'inner', title: 'Supima Heavy-Knit Cotton Tee', description: 'Oversized luxury modular base', color: '#F5F5F4' },
        { layer: 'mid', title: 'Pleated Straight Drape Trouser', description: 'Tailored relaxed structure', color: '#78716C' }
      );
      if (isCold) {
        layers.push({ layer: 'outer', title: 'Structured Pure Wool Topcoat', description: 'Unstructured double-faced drop shoulder', color: '#1C1917' });
      }
    } else if (vibe === 'Cyberpunk') {
      primaryGradient = 'from-zinc-900 via-emerald-950 to-black';
      hexes.push('#09090B', '#10B981', '#064E3B', '#18181B', '#3E3E3E');
      heroTitle = 'Modular Water-Shield Stealth Set';
      heroDesc = 'Dynamic high-mobility fabrics equipped with tactical attachment anchors and magnetic harnesses.';
      layers.push(
        { layer: 'inner', title: 'Thermo-Knit Skin Compression Layer', description: 'Wicks moisture, stays breathable', color: '#18181B' },
        { layer: 'mid', title: 'Ripstop Heavy Cargo Utility Pants', description: 'Articulated knees, quick-release cinch straps', color: '#09090B' },
        { layer: 'outer', title: '3-Layer Waterproof Shell Jacket', description: 'Taped seams, asymmetric neck cover', color: '#064E3B' }
      );
    } else if (vibe === 'Luxury') {
      primaryGradient = 'from-amber-900 to-stone-900';
      hexes.push('#78350F', '#F59E0B', '#F7F7F7', '#292524', '#451A03');
      heroTitle = 'Sartorial Cashmere Statement Double-Breast';
      heroDesc = 'Opulent, warm natural fibers compiled with exceptional soft-tailor hand finishing.';
      layers.push(
        { layer: 'inner', title: 'Silk-Blend Fine Rib Longsleeve', description: 'Sheen and ultra-soft fit', color: '#F7F7F7' },
        { layer: 'mid', title: 'Fine Wool Pleated Tapered Slate Trousers', description: 'Savile Row signature drape', color: '#292524' },
        { layer: 'outer', title: 'Suede Single-Breasted Tailored Coat', description: 'Hand-polished horn buttons, premium lining', color: '#78350F' }
      );
    } else if (vibe === 'Streetwear') {
      primaryGradient = 'from-orange-600 via-rose-950 to-stone-950';
      hexes.push('#EA580C', '#27272A', '#F4F4F5', '#881337', '#09090B');
      heroTitle = 'Heavy Loopback Graffiti Remixed Layered Fit';
      heroDesc = 'Aggressive proportions centering comfort, drop-shoulder silhouettes, and raw sneaker highlights.';
      layers.push(
        { layer: 'inner', title: 'Box-Fit Graphic Tee 260GSM', description: 'Retro enzyme washed heavy jersey', color: '#F4F4F5' },
        { layer: 'mid', title: 'Baggy Raw Selvedge Denim Jeans', description: 'Deep indigo dye, stacked ankle pooling', color: '#09090B' },
        { layer: 'outer', title: 'Nylon Panel Windbreaker Hoodie', description: 'Bold color-blocked technical mesh liner', color: '#EA580C' }
      );
    } else {
      // Classic / Default
      primaryGradient = 'from-blue-900 to-indigo-950';
      hexes.push('#1E3A8A', '#3B82F6', '#FFFFFF', '#1E293B', '#F1F5F9');
      heroTitle = 'Evergreen Heritage Wardrobe Uniform';
      heroDesc = 'Charming, approachable classic standards highlighting crisp cuts and durable textures.';
      layers.push(
        { layer: 'inner', title: 'Oxford Cotton Button Down Shirt', description: 'Reinforced standard clean collar', color: '#FFFFFF' },
        { layer: 'mid', title: 'Structured Double-Pleated Cotton Chino', description: 'Standard taper, clean crease lines', color: '#1E293B' }
      );
      if (isCold) {
        layers.push({ layer: 'outer', title: 'Milano Knit Trench Cardigan', description: 'Premium heavyweight extra-fine merino', color: '#1E3A8A' });
      }
    }

    if (layers.length === 0) {
      layers.push({ layer: 'inner', title: 'Premium Blend Tee', description: 'Universal lightweight custom-molded tee', color: '#AAAAAA' });
    }

    // Always append accessories
    layers.push({ layer: 'acc', title: 'Heritage Brass Frame Sunglasses', description: 'Minimalist zero-branding UV sunglasses', color: '#111111' });

    // Alternates generator
    const alternates = [
      {
        title: `Casual Alternated ${vibe} Outfit`,
        description: `Strips back outerwear layer for high ambient indoor comfort in ${occasion}.`,
        aestheticVibe: vibe,
        imageUrl: primaryGradient
      },
      {
        title: `High-Performance ${vibe} Deck`,
        description: 'Enhanced insulation modules and water-repellent shell upgrade.',
        aestheticVibe: vibe,
        imageUrl: 'from-gray-700 via-stone-850 to-neutral-900'
      }
    ];

    const confidence = Math.round(maxWeight * 100);

    const finalLayers = layers.map(lyr => ({
      ...lyr,
      layerId: `layer-${lyr.layer}`,
      name: lyr.title,
      category: lyr.layer === 'acc' ? 'Accessories' : lyr.layer === 'outer' ? 'Outerwear' : 'Casual',
      fabric: 'Premium Blend Cotton/Linen',
      opacityPercent: 100
    }));

    const finalAlternates = alternates.map(alt => ({
      ...alt,
      category: 'Casual',
      fabric: 'Fine Drape Wool/Knit Blend'
    }));

    return {
      renderId: `rnd-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      heroLook: {
        title: heroTitle,
        description: heroDesc,
        aestheticVibe: vibe,
        imageUrl: primaryGradient
      },
      alternates: finalAlternates,
      palette: {
        name: `${vibe} Master Palette Map`,
        hexes
      },
      garmentLayers: finalLayers,
      confidence
    };
  }
}
