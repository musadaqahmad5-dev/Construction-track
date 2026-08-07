/**
 * LOOK VISION v2.4 - Multi-User Reality Simulation Layer
 * Persona Simulation & Firestore Multi-User State Types
 */

export type DemoPersonaId = 'LUXURY_MINIMALIST' | 'CYBER_FUTURISTIC' | 'NATURE_ORGANIC' | 'CUSTOM';

export interface StyleDNAProfileData {
  primaryVibe: string;
  formalityPreference: number; // 0 to 1
  experimentalIndex: number;  // 0 to 1
  favColors: string[];
  favGarmentTypes: string[];
  favMaterials: string[];
  favBrands: string[];
  favSilhouettes: string[];
  dislikes: {
    colors: string[];
    garments: string[];
    materials: string[];
  };
}

export interface ThemeProfileData {
  activeThemeName: string; // 'luxury fashion' | 'cyber ai' | 'nature'
  colorPalette: string[];
  atmosphere: string;
  glowIntensity: number;
  refractionBlurPx: number;
}

export interface ARIAProfileData {
  activeWorkspace: string;
  primaryAgentId: string;
  agentName: string;
  reasoningMode: 'ELEGANCE_OPTIMIZED' | 'FUTURISTIC_SYNTHESIS' | 'BOTANICAL_HARMONY' | 'STANDARD';
  systemPromptContext: string;
  accuracyEstimate: number;
  topRecommendation: string;
  suggestedAction: string;
}

export interface PersonaWardrobeItem {
  id: string;
  title: string;
  category: 'Outerwear' | 'Formal' | 'Casual' | 'Sportswear' | 'Footwear' | 'Accessories';
  primaryColor: string;
  description: string;
  brand?: string;
  imageUrl?: string;
}

export interface DemoPersona {
  id: DemoPersonaId;
  userId: string;
  name: string;
  avatar: string;
  roleTitle: string;
  bio: string;
  styleDNA: StyleDNAProfileData;
  themeProfile: ThemeProfileData;
  ariaProfile: ARIAProfileData;
  wardrobePreset: PersonaWardrobeItem[];
}

/**
 * Firestore Schema Mappings
 * users/{uid}/styleDNA
 * users/{uid}/themeProfile
 * users/{uid}/ariaProfile
 */
export interface FirestoreStyleDNADoc {
  userId: string;
  updatedAt: string;
  styleDNA: StyleDNAProfileData;
}

export interface FirestoreThemeProfileDoc {
  userId: string;
  updatedAt: string;
  themeProfile: ThemeProfileData;
}

export interface FirestoreARIAProfileDoc {
  userId: string;
  updatedAt: string;
  ariaProfile: ARIAProfileData;
}
