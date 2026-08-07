/**
 * LOOK VISION v2.4 - User Identity Bootstrap Engine
 * Automatically initializes & synchronizes Production User Identity across:
 * - users/{uid}/identity
 * - users/{uid}/styleDNA/profile
 * - users/{uid}/themeProfile/active
 * - users/{uid}/ariaProfile/context
 */

import { UserProfileIdentity, UserIdentityState, UserBootstrapResult, AppOperatingMode } from './userIdentityTypes';
import { StyleDNAProfileData, ThemeProfileData, ARIAProfileData } from '../simulation/personaSimulationTypes';
import { PersonalFashionMemoryEngine } from '../../engine/personalMemory';

export class UserIdentityBootstrapEngine {
  private static operatingMode: AppOperatingMode = 'PRODUCTION_USER';
  private static activeUserState: UserIdentityState | null = null;

  public static getOperatingMode(): AppOperatingMode {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('lookvision_operating_mode') as AppOperatingMode;
      if (stored === 'DEVELOPER_SIMULATION' || stored === 'PRODUCTION_USER') {
        this.operatingMode = stored;
      }
    }
    return this.operatingMode;
  }

  public static setOperatingMode(mode: AppOperatingMode): void {
    this.operatingMode = mode;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('lookvision_operating_mode', mode);
      window.dispatchEvent(new CustomEvent('lookvision_operating_mode_changed', { detail: { mode } }));
    }
  }

  public static getActiveUserState(): UserIdentityState | null {
    return this.activeUserState;
  }

  /**
   * Securely purges cached identity state, Style DNA, ARIA memory, and localStorage tokens.
   * Call upon logout or prior to switching user accounts.
   */
  public static clearUserIdentityCache(userId?: string): void {
    this.activeUserState = null;

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem('lookvision_style_dna');
        localStorage.removeItem('aria_cached_state');
        localStorage.removeItem('lookvision_operating_mode');
        localStorage.removeItem('sartorial_engagement_metrics');
        localStorage.removeItem('sartorial_style_scores');
        localStorage.removeItem('sartorial_last_visit_time');
        localStorage.removeItem('aria_onboarding_completed_v2.4');

        if (userId) {
          localStorage.removeItem(`fashion_memory_${userId}`);
          localStorage.removeItem(`aria_onboarding_completed_${userId}`);
          localStorage.removeItem(`user_profile_${userId}`);
          localStorage.removeItem(`cached_wardrobe_${userId}`);
          localStorage.removeItem(`cached_constructions_${userId}`);
        } else {
          // Clear all user-specific cached keys if no explicit userId provided
          for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && (
              key.startsWith('fashion_memory_') ||
              key.startsWith('cached_wardrobe_') ||
              key.startsWith('cached_constructions_') ||
              key.startsWith('user_profile_') ||
              key.startsWith('aria_onboarding_completed_')
            )) {
              localStorage.removeItem(key);
            }
          }
        }
      } catch (e) {
        console.warn('[UserIdentityBootstrapEngine] Cache purge warning:', e);
      }
    }

    if (typeof sessionStorage !== 'undefined') {
      try {
        sessionStorage.removeItem('lookvision_style_dna');
        sessionStorage.removeItem('aria_cached_state');
      } catch (e) {}
    }

    // Clean up in-memory PersonalFashionMemoryEngine store
    try {
      if (userId) {
        (PersonalFashionMemoryEngine as any).clearMemory?.(userId);
        (PersonalFashionMemoryEngine as any).store?.delete?.(userId);
      } else {
        (PersonalFashionMemoryEngine as any).store?.clear?.();
      }
    } catch (e) {}

    // Dispatch clear event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lookvision_user_identity_ready', { detail: null }));
      window.dispatchEvent(new CustomEvent('lookvision_user_identity_cleared', { detail: { userId } }));
    }
  }

  /**
   * Primary entry point called upon user login / auth state resolution.
   * Bootstraps missing schema sub-documents and connects local memory.
   */
  public static async bootstrapUser(user: {
    uid: string;
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
  }): Promise<UserBootstrapResult> {
    const uid = user.uid || 'guest-sartorialist-user-100';

    // Ensure stale identity cache from previous account is cleared if switching accounts
    if (this.activeUserState && this.activeUserState.identity.uid !== uid) {
      this.clearUserIdentityCache(this.activeUserState.identity.uid);
    }
    const displayName = user.displayName || (uid.startsWith('guest-') ? 'Guest Sartorialist' : 'Sartorialist User');
    const email = user.email || (uid.startsWith('guest-') ? 'guest@companion.com' : `${uid}@user.lookvision.ai`);
    const photoURL = user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${uid}`;
    const now = new Date().toISOString();

    let isFirstLogin = false;
    let mode: 'firestore' | 'local_fallback' = 'local_fallback';

    // 1. Prepare default profiles for brand new users
    const defaultIdentity: UserProfileIdentity = {
      uid,
      displayName,
      email,
      photoURL,
      role: 'user',
      isBootstrapped: true,
      isOnboardingCompleted: false,
      createdAt: now,
      lastLoginAt: now,
    };

    const defaultStyleDNA: StyleDNAProfileData = {
      primaryVibe: 'Architectural Cyber Minimalist',
      formalityPreference: 0.75,
      experimentalIndex: 0.80,
      favColors: ['Midnight Onyx', 'Electric Indigo', 'Alabaster White', 'Deep Espresso'],
      favGarmentTypes: ['Tailored Cashmere Coat', 'Techwear Trousers', 'Silk Crepe Blouse', 'Leather Chelsea Boots'],
      favMaterials: ['Virgin Wool', 'Gore-Tex Pro 3L', 'Mulberry Silk', 'Loro Piana Cashmere'],
      favBrands: ['Acronym', 'The Row', 'Jil Sander', 'Lemaire'],
      favSilhouettes: ['A-Line Tailored', 'Asymmetric Modular', 'Boxy Oversized Blazer'],
      dislikes: {
        colors: ['neon pink', 'bright mustard'],
        garments: ['distressed denim'],
        materials: ['polyester leather']
      }
    };

    const defaultThemeProfile: ThemeProfileData = {
      activeThemeName: 'cyber ai',
      colorPalette: ['#05050A', '#6366F1', '#06B6D4', '#101022'],
      atmosphere: 'Deep obsidian slate with electric indigo glow & high-velocity pulse grids',
      glowIntensity: 0.75,
      refractionBlurPx: 16
    };

    const defaultARIAProfile: ARIAProfileData = {
      activeWorkspace: 'SartorialIntelligenceCore',
      primaryAgentId: 'ag_personal_stylist_02',
      agentName: 'ARIA Core AI Engine',
      reasoningMode: 'STANDARD',
      systemPromptContext: 'Autonomous Sartorial Intelligence Operating Layer initialized for user.',
      accuracyEstimate: 95.8,
      topRecommendation: 'Tailored Cashmere Coat paired with Techwear Trousers and Italian Leather Boots',
      suggestedAction: 'Execute Daily Style DNA Synchronization'
    };

    let finalIdentity = defaultIdentity;
    let finalStyleDNA = defaultStyleDNA;
    let finalThemeProfile = defaultThemeProfile;
    let finalARIAProfile = defaultARIAProfile;

    // 2. Attempt Firestore read / write if available
    try {
      const { doc, getDoc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../../firebase');

      if (db && !uid.startsWith('guest-')) {
        mode = 'firestore';
        // Check identity doc: users/{uid}/identity
        const identityDocRef = doc(db, 'users', uid, 'identity', 'profile');
        const identitySnap = await getDoc(identityDocRef);

        if (!identitySnap.exists()) {
          isFirstLogin = true;
          await setDoc(identityDocRef, defaultIdentity, { merge: true });
        } else {
          finalIdentity = { ...defaultIdentity, ...identitySnap.data(), lastLoginAt: now };
          await setDoc(identityDocRef, { lastLoginAt: now }, { merge: true });
        }

        // Check styleDNA doc: users/{uid}/styleDNA/profile
        const styleDocRef = doc(db, 'users', uid, 'styleDNA', 'profile');
        const styleSnap = await getDoc(styleDocRef);
        if (!styleSnap.exists()) {
          await setDoc(styleDocRef, { userId: uid, updatedAt: now, styleDNA: defaultStyleDNA }, { merge: true });
        } else {
          const data = styleSnap.data();
          if (data?.styleDNA) finalStyleDNA = data.styleDNA;
        }

        // Check themeProfile doc: users/{uid}/themeProfile/active
        const themeDocRef = doc(db, 'users', uid, 'themeProfile', 'active');
        const themeSnap = await getDoc(themeDocRef);
        if (!themeSnap.exists()) {
          await setDoc(themeDocRef, { userId: uid, updatedAt: now, themeProfile: defaultThemeProfile }, { merge: true });
        } else {
          const data = themeSnap.data();
          if (data?.themeProfile) finalThemeProfile = data.themeProfile;
        }

        // Check ariaProfile doc: users/{uid}/ariaProfile/context
        const ariaDocRef = doc(db, 'users', uid, 'ariaProfile', 'context');
        const ariaSnap = await getDoc(ariaDocRef);
        if (!ariaSnap.exists()) {
          await setDoc(ariaDocRef, { userId: uid, updatedAt: now, ariaProfile: defaultARIAProfile }, { merge: true });
        } else {
          const data = ariaSnap.data();
          if (data?.ariaProfile) finalARIAProfile = data.ariaProfile;
        }
      }
    } catch (err: any) {
      console.warn('[UserIdentityBootstrapEngine] Firestore sync notice (falling back to local memory):', err?.message || err);
    }

    // 3. Sync to local PersonalFashionMemoryEngine
    this.syncLocalMemory(uid, finalStyleDNA, finalARIAProfile.accuracyEstimate);

    // 4. Update active user state
    this.activeUserState = {
      identity: finalIdentity,
      styleDNA: finalStyleDNA,
      themeProfile: finalThemeProfile,
      ariaProfile: finalARIAProfile,
      operatingMode: this.getOperatingMode()
    };

    // 5. Broadcast user identity ready event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lookvision_user_identity_ready', {
        detail: this.activeUserState
      }));
    }

    return {
      success: true,
      isFirstLogin,
      mode,
      state: this.activeUserState,
      message: isFirstLogin
        ? `Successfully initialized identity for ${displayName} across Firestore sub-documents.`
        : `Restored identity for ${displayName} from ${mode}.`
    };
  }

  private static syncLocalMemory(userId: string, styleDNA: StyleDNAProfileData, accuracy: number) {
    const memory = PersonalFashionMemoryEngine.getMemory(userId);
    // Non-destructive array merging preserving newer local additions
    memory.favColors = Array.from(new Set([...(memory.favColors || []), ...styleDNA.favColors]));
    memory.favGarmentTypes = Array.from(new Set([...(memory.favGarmentTypes || []), ...styleDNA.favGarmentTypes]));
    memory.favMaterials = Array.from(new Set([...(memory.favMaterials || []), ...styleDNA.favMaterials]));
    memory.favBrands = Array.from(new Set([...(memory.favBrands || []), ...styleDNA.favBrands]));
    memory.styleDNA.primaryVibe = styleDNA.primaryVibe || memory.styleDNA.primaryVibe;
    memory.styleDNA.formalityPreference = styleDNA.formalityPreference ?? memory.styleDNA.formalityPreference;
    memory.styleDNA.experimentalIndex = styleDNA.experimentalIndex ?? memory.styleDNA.experimentalIndex;
    memory.dislikes.colors = Array.from(new Set([...(memory.dislikes?.colors || []), ...(styleDNA.dislikes?.colors || [])]));
    memory.dislikes.garments = Array.from(new Set([...(memory.dislikes?.garments || []), ...(styleDNA.dislikes?.garments || [])]));
    memory.dislikes.materials = Array.from(new Set([...(memory.dislikes?.materials || []), ...(styleDNA.dislikes?.materials || [])]));
    memory.accuracyEstimate = Math.max(accuracy, memory.accuracyEstimate || 0);

    (PersonalFashionMemoryEngine as any).store?.set(userId, memory);
    PersonalFashionMemoryEngine.saveMemory(memory);
  }

  /**
   * Completes ARIA Personal Onboarding Experience for authenticated user.
   * Generates Personal Style DNA, Theme Profile, and ARIA Reasoning Context,
   * saving to Firestore paths:
   * - users/{uid}/onboarding/profile
   * - users/{uid}/styleDNA/profile
   * - users/{uid}/themeProfile/active
   * - users/{uid}/ariaProfile/context
   * - users/{uid}/identity/profile (isOnboardingCompleted: true)
   */
  public static async completeOnboarding(
    userId: string,
    onboardingProfile: import('./userIdentityTypes').UserOnboardingProfile
  ): Promise<{ success: boolean; state: UserIdentityState; mode: 'firestore' | 'local_fallback' }> {
    const now = new Date().toISOString();
    let mode: 'firestore' | 'local_fallback' = 'local_fallback';

    // Build synthesized style DNA
    const styleDNA: StyleDNAProfileData = {
      primaryVibe: onboardingProfile.fashionPersonality || 'Architectural Modernist',
      formalityPreference: onboardingProfile.formalityLevel ?? 0.75,
      experimentalIndex: 0.82,
      favColors: onboardingProfile.colorPreferences?.length ? onboardingProfile.colorPreferences : ['Midnight Onyx', 'Alabaster White', 'Electric Indigo'],
      favGarmentTypes: onboardingProfile.preferredAesthetics?.length ? onboardingProfile.preferredAesthetics.map(a => `${a} Garment`) : ['Tailored Blazer', 'Cashmere Overcoat', 'Pleated Trousers'],
      favMaterials: ['Mulberry Silk', 'Virgin Wool', 'Gore-Tex Pro 3L', 'Loro Piana Cashmere'],
      favBrands: ['The Row', 'Acronym', 'Lemaire', 'Jil Sander'],
      favSilhouettes: ['A-Line Tailored', 'Asymmetric Structural', 'Boxy Oversized'],
      dislikes: {
        colors: ['neon yellow'],
        garments: ['distressed denim'],
        materials: ['polyester leather']
      }
    };

    // Determine theme based on aesthetics/personality
    let themeName = 'luxury fashion';
    const aestheticsStr = (onboardingProfile.preferredAesthetics || []).join(' ').toLowerCase();
    const personalityStr = (onboardingProfile.fashionPersonality || '').toLowerCase();
    if (aestheticsStr.includes('cyber') || aestheticsStr.includes('tech') || personalityStr.includes('cyber')) {
      themeName = 'cyber ai';
    } else if (aestheticsStr.includes('resort') || aestheticsStr.includes('organic') || aestheticsStr.includes('eco') || personalityStr.includes('eco')) {
      themeName = 'nature';
    }

    const themeProfile: ThemeProfileData = {
      activeThemeName: themeName,
      colorPalette: onboardingProfile.colorPreferences?.length ? onboardingProfile.colorPreferences : ['#0D0D12', '#6366F1', '#F5F5F0', '#1C1C24'],
      atmosphere: `Personalized workspace for ${onboardingProfile.lifestyleContext || 'Sartorialist'}`,
      glowIntensity: 0.70,
      refractionBlurPx: 16
    };

    const ariaProfile: ARIAProfileData = {
      activeWorkspace: 'SartorialIntelligenceCore',
      primaryAgentId: 'ag_personal_stylist_02',
      agentName: 'ARIA Sartorial Intelligence',
      reasoningMode: themeName === 'cyber ai' ? 'FUTURISTIC_SYNTHESIS' : (themeName === 'nature' ? 'BOTANICAL_HARMONY' : 'ELEGANCE_OPTIMIZED'),
      systemPromptContext: `Personalized for ${onboardingProfile.fashionPersonality}. Shopping behavior: ${onboardingProfile.shoppingBehavior}. Goals: ${(onboardingProfile.fashionGoals || []).join(', ')}.`,
      accuracyEstimate: 98.6,
      topRecommendation: `${styleDNA.favGarmentTypes[0]} in ${styleDNA.favColors[0]} paired with ${styleDNA.favMaterials[0]} trousers`,
      suggestedAction: 'Explore Tailored Outfit Synergy'
    };

    // Store in Firestore
    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../../firebase');

      if (db && !userId.startsWith('guest-')) {
        mode = 'firestore';
        const onbRef = doc(db, 'users', userId, 'onboarding', 'profile');
        await setDoc(onbRef, onboardingProfile, { merge: true });

        const styleRef = doc(db, 'users', userId, 'styleDNA', 'profile');
        await setDoc(styleRef, { userId, updatedAt: now, styleDNA }, { merge: true });

        const themeRef = doc(db, 'users', userId, 'themeProfile', 'active');
        await setDoc(themeRef, { userId, updatedAt: now, themeProfile }, { merge: true });

        const ariaRef = doc(db, 'users', userId, 'ariaProfile', 'context');
        await setDoc(ariaRef, { userId, updatedAt: now, ariaProfile }, { merge: true });

        const identRef = doc(db, 'users', userId, 'identity', 'profile');
        await setDoc(identRef, { isOnboardingCompleted: true, updatedAt: now }, { merge: true });
      }
    } catch (e: any) {
      console.warn('[UserIdentityBootstrapEngine] Onboarding Firestore sync note:', e?.message || e);
    }

    // Update local memory
    this.syncLocalMemory(userId, styleDNA, 98.6);

    // Update active user state
    const currentIdent = this.activeUserState?.identity || {
      uid: userId,
      displayName: 'Sartorialist User',
      email: `${userId}@user.lookvision.ai`,
      role: 'user',
      isBootstrapped: true,
      isOnboardingCompleted: true,
      createdAt: now,
      lastLoginAt: now
    };

    const updatedState: UserIdentityState = {
      identity: { ...currentIdent, isOnboardingCompleted: true },
      styleDNA,
      themeProfile,
      ariaProfile,
      operatingMode: this.getOperatingMode()
    };

    this.activeUserState = updatedState;

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`aria_onboarding_completed_${userId}`, 'true');
      localStorage.setItem('aria_onboarding_completed_v2.4', 'true');
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lookvision_user_identity_ready', { detail: updatedState }));
      window.dispatchEvent(new CustomEvent('lookvision_onboarding_completed', { detail: updatedState }));
    }

    return { success: true, state: updatedState, mode };
  }
}
