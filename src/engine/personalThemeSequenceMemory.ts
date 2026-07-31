import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ThemePhenomenonDNA,
  PRESET_THEME_OUTPUTS,
  globalThemePhenomenonEngine
} from './themePhenomenonEngine';
import {
  ThemeTokens,
  UIShellTokens,
  globalThemeDNAVisualTokenGenerator
} from './themeTokenGenerator';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import {
  db,
  isFirestoreOfflineFallbackActive
} from '../firebase';

export interface UserThemeCoatSettings {
  intensity: number;
  depthLevel: number;
  grainOpacity: number;
  glassmorphismBlurPx: number;
  sheenIntensity: number;
  blendMode: 'soft-light' | 'overlay' | 'screen' | 'color-dodge' | 'multiply';
  atmosphereFeeling: string;
}

export interface UserFoundationSettings {
  hapticPattern: number[];
  rippleDurationMs: number;
  shockwaveRadiusPx: number;
  scaleFactor: number;
  waveType: string;
}

export interface ColorSequenceBehavior {
  spectrumTimingMultiplier: number;
  animationRhythm: 'smooth' | 'pulsating' | 'staccato' | 'wave';
  glowIntensityMultiplier: number;
  spectralShiftStep: number;
}

export interface UserThemeProfile {
  userId: string;
  themeName: string;
  sequenceId: string;
  themeDNA: ThemePhenomenonDNA;
  themeTokens: ThemeTokens;
  shellTokens: UIShellTokens;
  coatSettings: UserThemeCoatSettings;
  foundationSettings: UserFoundationSettings;
  colorSequenceBehavior: ColorSequenceBehavior;
  personalizationVersion: number;
  createdAt: number;
  updatedAt: number;
}

export class ThemeSequenceGenerator {
  private static sequenceCounters: Record<string, number> = {};

  public static generateSequenceId(themeName: string, userId: string = 'guest'): string {
    const cleanPrefix = themeName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const prefix = cleanPrefix.length > 0 ? cleanPrefix : 'THEME';

    // Hash userId to create a deterministic baseline sequence number
    let userHash = 0;
    for (let i = 0; i < userId.length; i++) {
      userHash = (userHash << 5) - userHash + userId.charCodeAt(i);
      userHash |= 0;
    }
    const seed = Math.abs(userHash) % 900 + 100;

    const counterKey = `${prefix}_${userId}`;
    const nextVal = (ThemeSequenceGenerator.sequenceCounters[counterKey] || 0) + 1;
    ThemeSequenceGenerator.sequenceCounters[counterKey] = nextVal;

    const sequenceNum = String(seed + nextVal).padStart(3, '0');
    return `${prefix}-${sequenceNum}`;
  }

  public static createPersonalizedProfile(
    themeName: string,
    userId: string = 'guest',
    existingSequenceId?: string
  ): UserThemeProfile {
    const preset = globalThemePhenomenonEngine.getPreset(themeName);
    const baseDNA = preset || globalThemePhenomenonEngine.generate(themeName);

    const sequenceId = existingSequenceId || ThemeSequenceGenerator.generateSequenceId(themeName, userId);

    // Compute deterministic variation parameters from sequenceId & userId
    const strForHash = `${sequenceId}_${userId}`;
    let hash = 0;
    for (let i = 0; i < strForHash.length; i++) {
      hash = (hash << 5) - hash + strForHash.charCodeAt(i);
      hash |= 0;
    }
    const norm = Math.abs(hash);

    const spectrumTimingMultiplier = 0.85 + (norm % 50) / 100; // 0.85x to 1.35x
    const rhythms: ColorSequenceBehavior['animationRhythm'][] = ['smooth', 'pulsating', 'wave', 'staccato'];
    const animationRhythm = rhythms[norm % rhythms.length];
    const glowIntensityMultiplier = 0.8 + (norm % 60) / 100; // 0.8x to 1.4x

    const colorSequenceBehavior: ColorSequenceBehavior = {
      spectrumTimingMultiplier,
      animationRhythm,
      glowIntensityMultiplier,
      spectralShiftStep: norm % 10
    };

    const personalizedDNA: ThemePhenomenonDNA = {
      ...baseDNA,
      phenomenonEntity: {
        ...baseDNA.phenomenonEntity,
        glowIntensity: Math.min(1.0, baseDNA.phenomenonEntity.glowIntensity * glowIntensityMultiplier),
        animationVelocitySec: Math.max(1.0, baseDNA.phenomenonEntity.animationVelocitySec * spectrumTimingMultiplier)
      }
    };

    const visualTokens = globalThemeDNAVisualTokenGenerator.generateTokens(personalizedDNA);

    const coatSettings: UserThemeCoatSettings = {
      intensity: baseDNA.themeCoat.luxurySheenLevel,
      depthLevel: baseDNA.permanentEntity.depthIndex,
      grainOpacity: baseDNA.themeCoat.noiseGrainFactor,
      glassmorphismBlurPx: baseDNA.shellCoat.glassmorphicBlurRadiusPx,
      sheenIntensity: baseDNA.themeCoat.luxurySheenLevel,
      blendMode: (baseDNA.themeCoat.blendMode as UserThemeCoatSettings['blendMode']) || 'overlay',
      atmosphereFeeling: baseDNA.permanentEntity.atmosphereFeeling
    };

    const foundationSettings: UserFoundationSettings = {
      hapticPattern: baseDNA.clickResponse.hapticPattern || [15, 30, 15],
      rippleDurationMs: baseDNA.clickResponse.rippleDurationMs || 300,
      shockwaveRadiusPx: baseDNA.clickResponse.shockwaveRadiusPx || 130,
      scaleFactor: baseDNA.clickResponse.scaleFactor || 1.03,
      waveType: baseDNA.foundationEntity.name
    };

    const now = Date.now();

    return {
      userId,
      themeName: baseDNA.themeName,
      sequenceId,
      themeDNA: personalizedDNA,
      themeTokens: visualTokens.themeTokens,
      shellTokens: visualTokens.shellTokens,
      coatSettings,
      foundationSettings,
      colorSequenceBehavior,
      personalizationVersion: 1,
      createdAt: now,
      updatedAt: now
    };
  }
}

export class PersonalThemeSequenceMemoryService {
  private static STORAGE_PREFIX = 'look_vision_theme_sequence_';

  public static async loadUserProfile(
    userId: string,
    themeName?: string
  ): Promise<UserThemeProfile | null> {
    const targetTheme = themeName || 'cyber ai';
    const storageKey = `${PersonalThemeSequenceMemoryService.STORAGE_PREFIX}${userId}_${targetTheme.toLowerCase()}`;

    // 1. Local Cache Check (Offline First)
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const cached = localStorage.getItem(storageKey);
        if (cached) {
          const parsed = JSON.parse(cached) as UserThemeProfile;
          if (parsed && parsed.sequenceId) {
            return parsed;
          }
        }
      } catch (_) {
        // Fallback to Firestore
      }
    }

    // 2. Firestore Sync Check
    if (!isFirestoreOfflineFallbackActive && db) {
      try {
        const docRef = doc(db, 'user_theme_profiles', `${userId}_${targetTheme.toLowerCase().replace(/\s+/g, '_')}`);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data() as UserThemeProfile;
          PersonalThemeSequenceMemoryService.cacheLocally(storageKey, data);
          return data;
        }
      } catch (err) {
        console.warn('[ThemeSequenceMemory] Firestore read failed, returning null for fallback:', err);
      }
    }

    return null;
  }

  public static async saveUserProfile(profile: UserThemeProfile): Promise<boolean> {
    const storageKey = `${PersonalThemeSequenceMemoryService.STORAGE_PREFIX}${profile.userId}_${profile.themeName.toLowerCase()}`;
    const updatedProfile: UserThemeProfile = {
      ...profile,
      updatedAt: Date.now()
    };

    // 1. Cache Locally First
    PersonalThemeSequenceMemoryService.cacheLocally(storageKey, updatedProfile);

    // 2. Persist to Firestore
    if (!isFirestoreOfflineFallbackActive && db) {
      try {
        const docRef = doc(db, 'user_theme_profiles', `${profile.userId}_${profile.themeName.toLowerCase().replace(/\s+/g, '_')}`);
        await setDoc(docRef, updatedProfile, { merge: true });
        return true;
      } catch (err) {
        console.warn('[ThemeSequenceMemory] Firestore save failed, local cache used:', err);
        return false;
      }
    }

    return true;
  }

  public static async getOrGenerateProfile(
    userId: string = 'guest',
    themeName: string = 'cyber ai'
  ): Promise<UserThemeProfile> {
    const existing = await PersonalThemeSequenceMemoryService.loadUserProfile(userId, themeName);
    if (existing) {
      return existing;
    }

    const newProfile = ThemeSequenceGenerator.createPersonalizedProfile(themeName, userId);
    await PersonalThemeSequenceMemoryService.saveUserProfile(newProfile);
    return newProfile;
  }

  public static async updateProfilePersonalization(
    userId: string,
    themeName: string,
    updates: Partial<UserThemeProfile>
  ): Promise<UserThemeProfile> {
    const current = await PersonalThemeSequenceMemoryService.getOrGenerateProfile(userId, themeName);
    const merged: UserThemeProfile = {
      ...current,
      ...updates,
      updatedAt: Date.now()
    };

    await PersonalThemeSequenceMemoryService.saveUserProfile(merged);
    return merged;
  }

  private static cacheLocally(key: string, data: UserThemeProfile): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (_) {}
    }
  }
}

export const globalPersonalThemeSequenceMemoryService = PersonalThemeSequenceMemoryService;

// ==========================================
// REACT HOOK FOR PERSONAL THEME MEMORY
// ==========================================

export interface UsePersonalThemeSequenceReturn {
  profile: UserThemeProfile | null;
  loading: boolean;
  error: string | null;
  switchTheme: (newThemeName: string) => Promise<UserThemeProfile>;
  regenerateSequence: () => Promise<UserThemeProfile>;
  updateCoatSettings: (settings: Partial<UserThemeCoatSettings>) => Promise<UserThemeProfile | undefined>;
  updateFoundationSettings: (settings: Partial<UserFoundationSettings>) => Promise<UserThemeProfile | undefined>;
  saveProfile: (updatedProfile: UserThemeProfile) => Promise<boolean>;
}

export function usePersonalThemeSequence(
  userId: string = 'guest',
  initialThemeName: string = 'cyber ai'
): UsePersonalThemeSequenceReturn {
  const [profile, setProfile] = useState<UserThemeProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (uid: string, theme: string) => {
    setLoading(true);
    setError(null);
    try {
      const p = await PersonalThemeSequenceMemoryService.getOrGenerateProfile(uid, theme);
      setProfile(p);
    } catch (err: any) {
      console.error('[usePersonalThemeSequence] Error loading profile:', err);
      setError(err?.message || 'Failed to load theme memory');
      // Emergency fallback
      const fallback = ThemeSequenceGenerator.createPersonalizedProfile(theme, uid);
      setProfile(fallback);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile(userId, initialThemeName);
  }, [userId, initialThemeName, fetchProfile]);

  const switchTheme = useCallback(async (newThemeName: string): Promise<UserThemeProfile> => {
    setLoading(true);
    try {
      const p = await PersonalThemeSequenceMemoryService.getOrGenerateProfile(userId, newThemeName);
      setProfile(p);
      return p;
    } catch (err: any) {
      const fallback = ThemeSequenceGenerator.createPersonalizedProfile(newThemeName, userId);
      setProfile(fallback);
      return fallback;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const regenerateSequence = useCallback(async (): Promise<UserThemeProfile> => {
    if (!profile) return ThemeSequenceGenerator.createPersonalizedProfile(initialThemeName, userId);
    setLoading(true);
    try {
      const newSeqId = ThemeSequenceGenerator.generateSequenceId(profile.themeName, userId);
      const newP = ThemeSequenceGenerator.createPersonalizedProfile(profile.themeName, userId, newSeqId);
      await PersonalThemeSequenceMemoryService.saveUserProfile(newP);
      setProfile(newP);
      return newP;
    } finally {
      setLoading(false);
    }
  }, [profile, userId, initialThemeName]);

  const updateCoatSettings = useCallback(async (
    settings: Partial<UserThemeCoatSettings>
  ): Promise<UserThemeProfile | undefined> => {
    if (!profile) return undefined;
    const updated: UserThemeProfile = {
      ...profile,
      coatSettings: {
        ...profile.coatSettings,
        ...settings
      },
      updatedAt: Date.now()
    };
    await PersonalThemeSequenceMemoryService.saveUserProfile(updated);
    setProfile(updated);
    return updated;
  }, [profile]);

  const updateFoundationSettings = useCallback(async (
    settings: Partial<UserFoundationSettings>
  ): Promise<UserThemeProfile | undefined> => {
    if (!profile) return undefined;
    const updated: UserThemeProfile = {
      ...profile,
      foundationSettings: {
        ...profile.foundationSettings,
        ...settings
      },
      updatedAt: Date.now()
    };
    await PersonalThemeSequenceMemoryService.saveUserProfile(updated);
    setProfile(updated);
    return updated;
  }, [profile]);

  const saveProfile = useCallback(async (updatedProfile: UserThemeProfile): Promise<boolean> => {
    const success = await PersonalThemeSequenceMemoryService.saveUserProfile(updatedProfile);
    if (success) {
      setProfile(updatedProfile);
    }
    return success;
  }, []);

  return {
    profile,
    loading,
    error,
    switchTheme,
    regenerateSequence,
    updateCoatSettings,
    updateFoundationSettings,
    saveProfile
  };
}
