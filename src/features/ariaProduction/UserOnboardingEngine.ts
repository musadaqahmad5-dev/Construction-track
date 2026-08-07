/**
 * ARIA User Onboarding Engine
 * Product: LOOK VISION v2.4.0-telemetry
 * Manages style onboarding flow, preferences calibration, and persona initialization.
 */

import { OnboardingPreferences, UserFashionProfile } from './ProductionUserTypes';
import { UserFashionProfileEngine } from './UserFashionProfileEngine';
import { WardrobeIntelligenceEngine } from './WardrobeIntelligenceEngine';

export class UserOnboardingEngine {
  public static readonly ARCHETYPES = [
    { id: 'Cyberpunk Tailored', label: 'Cyberpunk Tailored', desc: 'Sleek dark monochrome with futuristic technical accents' },
    { id: 'Minimalist Monochrome', label: 'Minimalist Monochrome', desc: 'Clean architectural silhouettes in high-contrast neutrals' },
    { id: 'Avant-Garde Structural', label: 'Avant-Garde Structural', desc: 'Asymmetric cuts, sculptural draping, and bold form' },
    { id: 'Luxe Tech Utility', label: 'Luxe Tech Utility', desc: 'Premium hydrophobic fabrics with modular storage features' },
    { id: 'Refined Heritage', label: 'Refined Heritage', desc: 'Classic sartorial wools and tailored craftsmanship with modern edge' }
  ];

  public static readonly SILHOUETTES = [
    'Oversized Tailored',
    'Streamlined Minimal',
    'Layered Structural',
    'Fluid Draped',
    'Sharp Athleisure',
    'Vintage Boxy'
  ];

  public static readonly COLOR_PALETTES = [
    'Monochrome Onyx',
    'Warm Earth Tones',
    'High-Contrast Neon',
    'Soft Pastel Sheen',
    'Deep Jewel Tones',
    'Neutral Beige & Cream'
  ];

  public static readonly FASHION_GOALS = [
    'Elevate Professional Presence',
    'Curate Capsule Wardrobe',
    'Explore Experimental Avant-Garde',
    'Optimize Daily Efficiency',
    'Refine Sustainable Vintage'
  ];

  public static readonly LIFESTYLE_CONTEXTS = [
    'Metropolitan Tech Executive',
    'Creative Studio Lead',
    'Global Nomad',
    'Casual Weekend Enthusiast',
    'Formal Event & Gala'
  ];

  public static readonly BUDGET_TIERS = [
    'Accessible Essential',
    'Mid-Tier Premium',
    'High-End Luxury',
    'Custom Bespoke'
  ];

  /**
   * Generates default onboarding state for quick initialization
   */
  public static getDefaultOnboardingState(): OnboardingPreferences {
    return {
      displayName: 'Fashion Visionary',
      primaryArchetype: 'Cyberpunk Tailored',
      preferredSilhouettes: ['Oversized Tailored', 'Streamlined Minimal'],
      favoriteColors: ['Onyx Black', 'Titanium Silver', 'Deep Indigo'],
      dislikedColors: ['Muddy Brown'],
      fashionGoals: ['Elevate Professional Presence', 'Curate Capsule Wardrobe'],
      lifestyleContext: 'Metropolitan Tech Executive',
      budgetTier: 'High-End Luxury'
    };
  }

  /**
   * Builds complete UserFashionProfile from completed onboarding choices
   */
  public static processOnboardingSubmission(uid: string, preferences: OnboardingPreferences): UserFashionProfile {
    const profile = UserFashionProfileEngine.createInitialProfile(uid, preferences);
    // Seed initial baseline wardrobe items
    const seedItems = WardrobeIntelligenceEngine.getInitialSeedItems();
    profile.wardrobe = WardrobeIntelligenceEngine.recalculateWardrobeMetrics(seedItems);
    return profile;
  }
}
