/**
 * LOOK VISION v2.4 - Multi-User Reality Simulation Engine
 * Manages demo persona state, Style DNA, Theme Intelligence sync, ARIA context adaptation, and Firestore readiness.
 */

import { DemoPersona, DemoPersonaId, FirestoreStyleDNADoc, FirestoreThemeProfileDoc, FirestoreARIAProfileDoc } from './personaSimulationTypes';
import { PersonalFashionMemoryEngine } from '../../engine/personalMemory';

export const DEMO_PERSONAS: Record<Exclude<DemoPersonaId, 'CUSTOM'>, DemoPersona> = {
  LUXURY_MINIMALIST: {
    id: 'LUXURY_MINIMALIST',
    userId: 'user_luxury_minimalist_01',
    name: 'Elena Vance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    roleTitle: 'Haute Couture & Architectural Stylist',
    bio: 'Pioneering quiet luxury aesthetics focused on monochrome structural tailoring, pure cashmere, and champagne gold accents.',
    styleDNA: {
      primaryVibe: 'Architectural Cashmere & Quiet Luxury',
      formalityPreference: 0.90,
      experimentalIndex: 0.60,
      favColors: ['Alabaster White', 'Midnight Onyx', 'Camel Cashmere', 'Deep Espresso', 'Champagne Gold'],
      favGarmentTypes: ['Tailored Cashmere Coat', 'Silk Pleated Trousers', 'Structured Wool Blazer', 'Minimalist Crepe Dress'],
      favMaterials: ['Loro Piana Cashmere', 'Mulberry Silk', 'Virgin Wool', 'High-Count Cotton Poplin'],
      favBrands: ['The Row', 'Lemaire', 'Jil Sander', 'Brunello Cucinelli'],
      favSilhouettes: ['A-Line Tailored', 'Columnar Minimalist', 'Boxy Oversized Blazer'],
      dislikes: {
        colors: ['neon green', 'hot pink', 'electric yellow'],
        garments: ['distressed denim', 'graphic hoodies', 'synthetic fleece'],
        materials: ['polyester leather', 'nylon mesh']
      }
    },
    themeProfile: {
      activeThemeName: 'luxury fashion',
      colorPalette: ['#0D0D12', '#F5F5F0', '#C5A059', '#1C1C24'],
      atmosphere: 'High-contrast monochrome champagne gold, serene architectural elegance',
      glowIntensity: 0.45,
      refractionBlurPx: 14
    },
    ariaProfile: {
      activeWorkspace: 'HauteCoutureStudio',
      primaryAgentId: 'ag_personal_stylist_02',
      agentName: 'Aura Couture AI',
      reasoningMode: 'ELEGANCE_OPTIMIZED',
      systemPromptContext: 'Prioritize flawless tailoring, monochrome harmony, structural proportions, and quiet luxury materials.',
      accuracyEstimate: 96.4,
      topRecommendation: 'Loro Piana Double-Breasted Cashmere Overcoat paired with Mulberry Silk Pleated Trousers',
      suggestedAction: 'Curate Evening Symphony Look'
    },
    wardrobePreset: [
      {
        id: 'elena-item-1',
        title: 'Loro Piana Double-Breasted Cashmere Coat',
        category: 'Outerwear',
        primaryColor: 'Camel Cashmere',
        description: 'Hand-stitched 100% virgin cashmere overcoat with storm flap and horn buttons.',
        brand: 'The Row'
      },
      {
        id: 'elena-item-2',
        title: 'Mulberry Silk Pleated Trousers',
        category: 'Formal',
        primaryColor: 'Alabaster White',
        description: 'High-waisted wide-leg trousers crafted from heavyweight Mulberry silk crepe.',
        brand: 'Lemaire'
      },
      {
        id: 'elena-item-3',
        title: 'Structured Virgin Wool Blazer',
        category: 'Formal',
        primaryColor: 'Midnight Onyx',
        description: 'Tailored single-breasted blazer with sharp shoulders and satin lapels.',
        brand: 'Jil Sander'
      },
      {
        id: 'elena-item-4',
        title: 'Minimalist Silk Crepe Blouse',
        category: 'Casual',
        primaryColor: 'Champagne Gold',
        description: 'Fluid silk blouse with concealed placket and french cuffs.',
        brand: 'Brunello Cucinelli'
      },
      {
        id: 'elena-item-5',
        title: 'Calfskin Leather Chelsea Boots',
        category: 'Footwear',
        primaryColor: 'Midnight Onyx',
        description: 'Sleek Italian calfskin boots with almond toe profile.',
        brand: 'The Row'
      }
    ]
  },

  CYBER_FUTURISTIC: {
    id: 'CYBER_FUTURISTIC',
    userId: 'user_cyber_futuristic_02',
    name: 'Kaelen Voss',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    roleTitle: 'Neo-Tokyo Cybernetics & Techwear Designer',
    bio: 'Architecting modular techwear, weather-resilient exoskeletons, laser-violet neon accents, and cybernetic urban shells.',
    styleDNA: {
      primaryVibe: 'Neo-Tokyo Cyber Avant-Garde',
      formalityPreference: 0.70,
      experimentalIndex: 0.95,
      favColors: ['Electric Indigo', 'Neon Cyan', 'Carbon Onyx', 'Laser Violet', 'Reflective Silver'],
      favGarmentTypes: ['Modular Tactical Vest', 'Holographic Visor Shell', 'Techwear Cargo Trousers', 'Exoskeleton Sneakers'],
      favMaterials: ['Gore-Tex Pro 3L', 'Carbon Fiber Weave', 'Ballistic Ripstop Nylon', 'Reflective Polyurethane'],
      favBrands: ['Acronym', 'Stone Island Shadow Project', 'Y-3', 'Rick Owens Tech'],
      favSilhouettes: ['Modular Asymmetric', 'High-Neck Tactical', 'Drop-Crotch Tech Taper'],
      dislikes: {
        colors: ['pastel pink', 'beige', 'mustard yellow'],
        garments: ['tweed jackets', 'linen kaftans', 'bow ties'],
        materials: ['raw linen', 'chiffon']
      }
    },
    themeProfile: {
      activeThemeName: 'cyber ai',
      colorPalette: ['#05050A', '#6366F1', '#06B6D4', '#101022'],
      atmosphere: 'Deep dark obsidian slate with electric indigo glow & high-velocity pulse grids',
      glowIntensity: 0.85,
      refractionBlurPx: 20
    },
    ariaProfile: {
      activeWorkspace: 'CyberneticLab',
      primaryAgentId: 'ag_cyber_orchestrator_01',
      agentName: 'Nexus Cyber AI',
      reasoningMode: 'FUTURISTIC_SYNTHESIS',
      systemPromptContext: 'Prioritize modular functionality, weather resilience, cybernetic aesthetics, and avant-garde silhouettes.',
      accuracyEstimate: 98.2,
      topRecommendation: 'Acronym 3L Gore-Tex Tactical Shell integrated with Holographic LED Fiber Cargo Pants',
      suggestedAction: 'Execute Storm-Resistant Cyber Scan'
    },
    wardrobePreset: [
      {
        id: 'kaelen-item-1',
        title: 'Acronym 3L Gore-Tex Modular Shell',
        category: 'Outerwear',
        primaryColor: 'Carbon Onyx',
        description: 'Waterproof storm-proof shell with interops system and expandable hood.',
        brand: 'Acronym'
      },
      {
        id: 'kaelen-item-2',
        title: 'Techwear Ballistic Cargo Trousers',
        category: 'Casual',
        primaryColor: 'Electric Indigo',
        description: 'Modular utility cargo trousers with magnetic Fidlock buckles and articulated knees.',
        brand: 'Stone Island Shadow Project'
      },
      {
        id: 'kaelen-item-3',
        title: 'Holographic Visor Jacket',
        category: 'Outerwear',
        primaryColor: 'Laser Violet',
        description: 'Reflective light-reactive bomber jacket with integrated collar thermal wire.',
        brand: 'Y-3'
      },
      {
        id: 'kaelen-item-4',
        title: 'Cybernetic Exoskeleton Sneakers',
        category: 'Footwear',
        primaryColor: 'Neon Cyan',
        description: '3D-printed sole unit with quick-lace BOA system and shock absorption.',
        brand: 'Rick Owens Tech'
      },
      {
        id: 'kaelen-item-5',
        title: 'Modular Tactical Sling Pouch',
        category: 'Accessories',
        primaryColor: 'Carbon Onyx',
        description: 'Waterproof Dyneema composite sling pouch with laser-cut MOLLE webbing.',
        brand: 'Acronym'
      }
    ]
  },

  NATURE_ORGANIC: {
    id: 'NATURE_ORGANIC',
    userId: 'user_nature_organic_03',
    name: 'Sora Lin',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    roleTitle: 'Eco-Botanical Sustainable Sartorialist',
    bio: 'Pioneering zero-waste botanical dye processes, organic flax linen, terracotta earth tones, and natural drape dynamics.',
    styleDNA: {
      primaryVibe: 'Earthy Sustainable & Botanical Linen',
      formalityPreference: 0.45,
      experimentalIndex: 0.75,
      favColors: ['Sage Green', 'Terracotta Earth', 'Oatmeal Linen', 'Warm Sand', 'Olive Bark'],
      favGarmentTypes: ['Organic Linen Robe', 'Hemp Fibre Trench', 'Plant-Dyed Cotton Tunic', 'Raw Denim Trousers'],
      favMaterials: ['Organic Flax Linen', 'Unbleached Hemp', 'Plant-Dyed Cotton', 'Recycled Merino Wool'],
      favBrands: ['Story mfg.', 'Bode', 'Toogood', 'Eileen Fisher Organic'],
      favSilhouettes: ['Relaxed Kimono Drape', 'Voluminous Tunic', 'Straight Raw Taper'],
      dislikes: {
        colors: ['neon pink', 'bright cyan', 'metallic silver'],
        garments: ['skinny vinyl pants', 'stiff shoulder suits', 'synthetic sequins'],
        materials: ['polyester', 'acrylic']
      }
    },
    themeProfile: {
      activeThemeName: 'nature',
      colorPalette: ['#0A0F0D', '#2E5A44', '#D4A373', '#16221C'],
      atmosphere: 'Deep organic forest slate with serene sage green and warm terracotta luminescence',
      glowIntensity: 0.35,
      refractionBlurPx: 10
    },
    ariaProfile: {
      activeWorkspace: 'EcoSartorialWorkspace',
      primaryAgentId: 'ag_eco_sartorial_03',
      agentName: 'Gaia Botanical AI',
      reasoningMode: 'BOTANICAL_HARMONY',
      systemPromptContext: 'Prioritize zero-waste eco materials, earthy botanical color palettes, relaxed drape, and natural textures.',
      accuracyEstimate: 94.8,
      topRecommendation: 'Hand-Dyed Organic Flax Linen Robe Tunic with Terracotta Botanical Chinos',
      suggestedAction: 'Analyze Garment Lifecycle & Material Traceability'
    },
    wardrobePreset: [
      {
        id: 'sora-item-1',
        title: 'Hand-Dyed Organic Flax Linen Robe Tunic',
        category: 'Casual',
        primaryColor: 'Oatmeal Linen',
        description: 'Zero-waste hand-spun flax robe with indigo resist dyeing details.',
        brand: 'Story mfg.'
      },
      {
        id: 'sora-item-2',
        title: 'Unbleached Hemp Fibre Trench Coat',
        category: 'Outerwear',
        primaryColor: 'Terracotta Earth',
        description: 'Breathable eco-trench coated with natural beeswax water repellent.',
        brand: 'Toogood'
      },
      {
        id: 'sora-item-3',
        title: 'Plant-Dyed Cotton Chino Pants',
        category: 'Casual',
        primaryColor: 'Sage Green',
        description: 'Relaxed fit chinos dyed with avocado pit and madder root extracts.',
        brand: 'Bode'
      },
      {
        id: 'sora-item-4',
        title: 'Japanese Raw Selvedge Denim Jacket',
        category: 'Outerwear',
        primaryColor: 'Olive Bark',
        description: 'Unwashed organic cotton selvedge denim jacket with recycled copper hardware.',
        brand: 'Eileen Fisher Organic'
      },
      {
        id: 'sora-item-5',
        title: 'Handcrafted Vegetable-Tanned Leather Sandals',
        category: 'Footwear',
        primaryColor: 'Warm Sand',
        description: 'Minimalist crossover strap sandals with natural crepe rubber sole.',
        brand: 'Story mfg.'
      }
    ]
  }
};

/**
 * Applies a demo persona to local fashion memory and returns synced attributes
 */
export function applyPersonaToLocalMemory(persona: DemoPersona) {
  const memory = PersonalFashionMemoryEngine.getMemory(persona.userId);
  memory.favColors = [...persona.styleDNA.favColors];
  memory.favGarmentTypes = [...persona.styleDNA.favGarmentTypes];
  memory.favMaterials = [...persona.styleDNA.favMaterials];
  memory.favBrands = [...persona.styleDNA.favBrands];
  memory.styleDNA.primaryVibe = persona.styleDNA.primaryVibe;
  memory.styleDNA.formalityPreference = persona.styleDNA.formalityPreference;
  memory.styleDNA.experimentalIndex = persona.styleDNA.experimentalIndex;
  memory.dislikes.colors = [...persona.styleDNA.dislikes.colors];
  memory.dislikes.garments = [...persona.styleDNA.dislikes.garments];
  memory.dislikes.materials = [...persona.styleDNA.dislikes.materials];
  memory.accuracyEstimate = persona.ariaProfile.accuracyEstimate;

  // Sync to store for both user ID and fallback user-1
  (PersonalFashionMemoryEngine as any).store?.set(persona.userId, memory);
  (PersonalFashionMemoryEngine as any).store?.set('user-1', memory);
  (PersonalFashionMemoryEngine as any).store?.set('guest-sartorialist-user-100', memory);

  try {
    localStorage.setItem(`fashion_memory_${persona.userId}`, JSON.stringify(memory));
    localStorage.setItem('active_persona_id', persona.id);
  } catch (e) {
    // Ignored in headless environments
  }

  return memory;
}

/**
 * Firebase Firestore Multi-User State Synchronizer
 * Prepares Firestore documents for user persona persistence:
 * - users/{uid}/styleDNA
 * - users/{uid}/themeProfile
 * - users/{uid}/ariaProfile
 */
export async function syncPersonaToFirestore(persona: DemoPersona): Promise<{ success: boolean; mode: 'firestore' | 'local_fallback'; message: string }> {
  try {
    const { doc, setDoc } = await import('firebase/firestore');
    const { db } = await import('../../firebase');

    if (!db) {
      return {
        success: true,
        mode: 'local_fallback',
        message: `Firestore offline. Persona ${persona.name} synced to local memory.`
      };
    }

    const now = new Date().toISOString();

    const styleDocRef = doc(db, 'users', persona.userId, 'styleDNA', 'profile');
    const styleData: FirestoreStyleDNADoc = {
      userId: persona.userId,
      updatedAt: now,
      styleDNA: persona.styleDNA
    };
    await setDoc(styleDocRef, styleData, { merge: true });

    const themeDocRef = doc(db, 'users', persona.userId, 'themeProfile', 'active');
    const themeData: FirestoreThemeProfileDoc = {
      userId: persona.userId,
      updatedAt: now,
      themeProfile: persona.themeProfile
    };
    await setDoc(themeDocRef, themeData, { merge: true });

    const ariaDocRef = doc(db, 'users', persona.userId, 'ariaProfile', 'context');
    const ariaData: FirestoreARIAProfileDoc = {
      userId: persona.userId,
      updatedAt: now,
      ariaProfile: persona.ariaProfile
    };
    await setDoc(ariaDocRef, ariaData, { merge: true });

    return {
      success: true,
      mode: 'firestore',
      message: `Successfully persisted ${persona.name} to Firestore (users/${persona.userId}/[styleDNA, themeProfile, ariaProfile]).`
    };
  } catch (err: any) {
    console.warn('[PersonaSimulationEngine] Firestore sync warning (falling back to local):', err?.message);
    return {
      success: true,
      mode: 'local_fallback',
      message: `Persona ${persona.name} active via local memory (Firestore offline or restricted).`
    };
  }
}
