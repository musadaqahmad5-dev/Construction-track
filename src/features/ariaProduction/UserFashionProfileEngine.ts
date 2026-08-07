/**
 * ARIA User Fashion Profile Engine
 * Product: LOOK VISION v2.4.0-telemetry
 * Connects Style DNA Engine, Personal Memory Engine, and Evolution Engine.
 */

import {
  UserFashionProfile,
  UserStyleIdentity,
  UserPreferenceModel,
  OnboardingPreferences,
  StyleEvolutionMilestone
} from './ProductionUserTypes';

export class UserFashionProfileEngine {
  /**
   * Generates a initial user style identity from user choices and Style DNA vector maps.
   */
  public static createStyleIdentity(onboarding: OnboardingPreferences): UserStyleIdentity {
    const primaryArchetype = onboarding.primaryArchetype || 'Cyberpunk Tailored';
    const secondaryArchetypes = ['Minimalist Monochrome', 'Avant-Garde Architectural'];
    
    // Compute 8-dimensional Style DNA vector [palette, silhouette, formality, vibe, brand, seasonality, texture, risk]
    const styleDNAVector = [
      0.82, // Palette affinity
      0.90, // Silhouette structure
      0.75, // Formality index
      0.88, // Vibe polarity
      0.70, // Brand affinity
      0.85, // Seasonality adaptability
      0.78, // Texture resonance
      0.84  // Style innovation/risk tolerance
    ];

    const aestheticTraits = [
      { name: 'Architectural Tailoring', score: 92 },
      { name: 'Monochrome Contrast', score: 88 },
      { name: 'Technical Utility', score: 85 },
      { name: 'Fluid Layering', score: 78 },
      { name: 'Subtle Sheen', score: 74 }
    ];

    return {
      styleDNAVector,
      primaryArchetype,
      secondaryArchetypes,
      aestheticTraits,
      formalityIndex: 78,
      vibePolarity: 'Futuristic Architectural'
    };
  }

  /**
   * Constructs a full default or onboarding-based UserFashionProfile.
   */
  public static createInitialProfile(uid: string, onboarding: OnboardingPreferences): UserFashionProfile {
    const identity = this.createStyleIdentity(onboarding);

    const preferences: UserPreferenceModel = {
      preferredSilhouettes: onboarding.preferredSilhouettes.length > 0
        ? onboarding.preferredSilhouettes
        : ['Oversized Tailored', 'Streamlined Minimal', 'Layered Structural'],
      avoidedSilhouettes: ['Unstructured Overly Casual', 'Clashing Patterns'],
      favoriteColors: onboarding.favoriteColors.length > 0
        ? onboarding.favoriteColors
        : ['Onyx Black', 'Titanium Silver', 'Deep Indigo', 'Charcoal Slate'],
      dislikedColors: onboarding.dislikedColors.length > 0
        ? onboarding.dislikedColors
        : ['Muddy Brown', 'Faded Pastel Pink'],
      fashionGoals: onboarding.fashionGoals.length > 0
        ? onboarding.fashionGoals
        : ['Elevate Professional Presence', 'Curate High-Synergy Wardrobe'],
      lifestyleContext: onboarding.lifestyleContext || 'Metropolitan Tech Executive',
      budgetTier: onboarding.budgetTier || 'High-End Premium'
    };

    const initialMilestone: StyleEvolutionMilestone = {
      id: `mstep_${Date.now()}_0`,
      date: new Date().toISOString().split('T')[0],
      title: 'ARIA Profile Calibration Completed',
      description: `User initialized profile with primary archetype: ${identity.primaryArchetype}.`,
      archetypeShift: identity.primaryArchetype,
      confidenceScore: 94
    };

    return {
      userId: uid,
      displayName: onboarding.displayName || 'Fashion Visionary',
      subscription: {
        plan: 'PRO_STYLIST',
        status: 'ACTIVE',
        features: [
          'Autonomous Wardrobe Synergy Matrix',
          'Multimodal Vision Garment Extraction',
          'ARIA 17-Engine Decision Intelligence',
          '12-Month Style Trajectory Forecast'
        ]
      },
      identity,
      preferences,
      wardrobe: {
        totalItems: 0,
        items: [],
        colorDistribution: {},
        categoryDistribution: {},
        favoriteOutfits: [],
        synergyScoreAvg: 0
      },
      evolutionMilestones: [initialMilestone],
      evolutionStage: 'Aesthetic Alignment Phase I',
      lastActive: new Date().toISOString(),
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Tracks style evolution by logging milestone updates and updating vector traits.
   */
  public static trackStyleEvolution(
    profile: UserFashionProfile,
    title: string,
    description: string,
    newArchetype?: string
  ): UserFashionProfile {
    const newMilestone: StyleEvolutionMilestone = {
      id: `mstep_${Date.now()}_${profile.evolutionMilestones.length}`,
      date: new Date().toISOString().split('T')[0],
      title,
      description,
      archetypeShift: newArchetype || profile.identity.primaryArchetype,
      confidenceScore: Math.min(99, 85 + Math.floor(Math.random() * 12))
    };

    const updatedMilestones = [newMilestone, ...profile.evolutionMilestones];

    // Slightly nudge style vector for dynamic evolution tracking
    const updatedVector = profile.identity.styleDNAVector.map((val) =>
      Math.min(1.0, Math.max(0.1, Number((val + (Math.random() * 0.04 - 0.02)).toFixed(3))))
    );

    return {
      ...profile,
      identity: {
        ...profile.identity,
        primaryArchetype: newArchetype || profile.identity.primaryArchetype,
        styleDNAVector: updatedVector
      },
      evolutionMilestones: updatedMilestones,
      evolutionStage: `Phase ${updatedMilestones.length}: ${newArchetype || profile.identity.primaryArchetype}`,
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Computes personalization score based on preference completeness and wardrobe synergy.
   */
  public static computePersonalizationScore(profile: UserFashionProfile): number {
    let score = 40; // Base score
    if (profile.onboardingCompleted) score += 20;
    if (profile.preferences.favoriteColors.length > 0) score += 10;
    if (profile.preferences.preferredSilhouettes.length > 0) score += 10;
    if (profile.wardrobe.totalItems > 0) score += 10;
    if (profile.wardrobe.synergyScoreAvg > 70) score += 10;

    return Math.min(99, score);
  }
}
