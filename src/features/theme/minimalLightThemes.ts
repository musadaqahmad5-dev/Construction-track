/**
 * LOOK VISION AI Fashion Operating System
 * Minimal Light Palette Theme System & Firestore Synchronizer
 * 
 * Strict Invariants:
 * - MINIMAL_OFFWHITE: #FBFBFA (High-contrast minimal off-white)
 * - WARM_STUDIO_SAND: #F5F4F0 (Warm studio sand)
 * - SOFT_LINEN: #F7F6F2 (Soft natural linen)
 */

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export type MinimalLightPaletteId = 'MINIMAL_OFFWHITE' | 'WARM_STUDIO_SAND' | 'SOFT_LINEN';

export interface MinimalLightPalette {
  id: MinimalLightPaletteId;
  name: string;
  tagline: string;
  description: string;
  canvasBg: string;
  surfaceCard: string;
  surfaceSubtle: string;
  textPrimary: string;
  textSecondary: string;
  accentPrimary: string;
  accentSecondary: string;
  borderSubtle: string;
  contrastRatio: number;
  wcagCompliant: boolean;
  swatch: {
    canvas: string;
    card: string;
    accent: string;
    text: string;
  };
}

export const MINIMAL_LIGHT_PALETTES: Record<MinimalLightPaletteId, MinimalLightPalette> = {
  MINIMAL_OFFWHITE: {
    id: 'MINIMAL_OFFWHITE',
    name: 'Minimal Off-White',
    tagline: 'High-Contrast Atelier Canvas',
    description: 'Pristine, architectural off-white foundation offering maximum clarity and typography contrast.',
    canvasBg: '#FBFBFA',
    surfaceCard: '#FFFFFF',
    surfaceSubtle: '#F5F4F0',
    textPrimary: '#1C1B1A',
    textSecondary: '#575551',
    accentPrimary: '#4F46E5',
    accentSecondary: '#16A34A',
    borderSubtle: 'rgba(28, 27, 26, 0.08)',
    contrastRatio: 16.8,
    wcagCompliant: true,
    swatch: {
      canvas: '#FBFBFA',
      card: '#FFFFFF',
      accent: '#4F46E5',
      text: '#1C1B1A'
    }
  },
  WARM_STUDIO_SAND: {
    id: 'WARM_STUDIO_SAND',
    name: 'Warm Studio Sand',
    tagline: 'Refined Earthy Studio Ambiance',
    description: 'Warm organic sand background evoking bespoke tailoring ateliers and physical textile cutting tables.',
    canvasBg: '#F5F4F0',
    surfaceCard: '#FFFFFF',
    surfaceSubtle: '#EDECE6',
    textPrimary: '#1C1B1A',
    textSecondary: '#575551',
    accentPrimary: '#4F46E5',
    accentSecondary: '#16A34A',
    borderSubtle: 'rgba(28, 27, 26, 0.09)',
    contrastRatio: 15.6,
    wcagCompliant: true,
    swatch: {
      canvas: '#F5F4F0',
      card: '#FFFFFF',
      accent: '#4F46E5',
      text: '#1C1B1A'
    }
  },
  SOFT_LINEN: {
    id: 'SOFT_LINEN',
    name: 'Soft Linen',
    tagline: 'Airy Editorial Textile Neutral',
    description: 'Subtle woven linen neutral delivering high editorial sophistication with zero visual fatigue.',
    canvasBg: '#F7F6F2',
    surfaceCard: '#FFFFFF',
    surfaceSubtle: '#EFEFE8',
    textPrimary: '#1C1B1A',
    textSecondary: '#575551',
    accentPrimary: '#4F46E5',
    accentSecondary: '#16A34A',
    borderSubtle: 'rgba(28, 27, 26, 0.085)',
    contrastRatio: 16.1,
    wcagCompliant: true,
    swatch: {
      canvas: '#F7F6F2',
      card: '#FFFFFF',
      accent: '#4F46E5',
      text: '#1C1B1A'
    }
  }
};

export const DEFAULT_MINIMAL_LIGHT_PALETTE: MinimalLightPalette = MINIMAL_LIGHT_PALETTES.MINIMAL_OFFWHITE;

const STORAGE_KEY = 'lookvision_minimal_light_palette';

/**
 * Retrieves the currently persisted minimal light palette ID
 */
export function getStoredPaletteId(): MinimalLightPaletteId {
  if (typeof localStorage === 'undefined') return 'MINIMAL_OFFWHITE';
  const saved = localStorage.getItem(STORAGE_KEY) as MinimalLightPaletteId;
  if (saved && MINIMAL_LIGHT_PALETTES[saved]) {
    return saved;
  }
  return 'MINIMAL_OFFWHITE';
}

/**
 * Appends attributes and CSS custom properties to the HTML root (<html ...>)
 */
export function applyThemeToHtmlRoot(palette: MinimalLightPalette): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  
  // Set explicit semantic data attributes on <html>
  root.setAttribute('data-theme', palette.id);
  root.setAttribute('data-palette-variant', palette.id);
  root.setAttribute('data-palette-name', palette.name);
  root.setAttribute('data-canvas-bg', palette.canvasBg);
  root.setAttribute('data-theme-mode', 'light');

  // Inject CSS custom variables directly into root style
  root.style.setProperty('--lookvision-canvas-bg', palette.canvasBg);
  root.style.setProperty('--lookvision-surface-card', palette.surfaceCard);
  root.style.setProperty('--lookvision-surface-subtle', palette.surfaceSubtle);
  root.style.setProperty('--lookvision-text-primary', palette.textPrimary);
  root.style.setProperty('--lookvision-text-secondary', palette.textSecondary);
  root.style.setProperty('--lookvision-accent-primary', palette.accentPrimary);
  root.style.setProperty('--lookvision-accent-secondary', palette.accentSecondary);
  root.style.setProperty('--lookvision-border-subtle', palette.borderSubtle);

  // Set document body style for smooth transitions
  if (document.body) {
    document.body.style.backgroundColor = palette.canvasBg;
    document.body.style.color = palette.textPrimary;
    document.body.style.transition = 'background-color 300ms ease, color 300ms ease';
  }

  // Persist locally
  try {
    localStorage.setItem(STORAGE_KEY, palette.id);
    localStorage.setItem('lookvision_active_theme_skin', palette.id);
  } catch (e) {
    console.warn('[ThemeEngine] localStorage write failed:', e);
  }

  // Broadcast event across UI
  window.dispatchEvent(
    new CustomEvent('lookvision_theme_changed', {
      detail: {
        palette,
        paletteId: palette.id,
        canvasBg: palette.canvasBg
      }
    })
  );
}

/**
 * Updates the user's active theme selection inside Google Cloud Firestore
 */
export async function syncThemeToFirestore(
  userId: string,
  palette: MinimalLightPalette
): Promise<{ success: boolean; mode: 'firestore' | 'offline_cached'; error?: string }> {
  const timestamp = new Date().toISOString();

  // Validate user ID
  if (!userId) {
    return { success: false, mode: 'offline_cached', error: 'User ID missing' };
  }

  // Always update local storage first as defensive fallback
  try {
    localStorage.setItem(`user_theme_${userId}`, palette.id);
  } catch (_) {}

  // If db is not initialized or user is guest, handle gracefully
  if (!db || userId.startsWith('guest-') || userId === 'preview-user') {
    return { success: true, mode: 'offline_cached' };
  }

  try {
    // 1. Update user profile document: users/{userId}
    const userDocRef = doc(db, 'users', userId);
    await setDoc(
      userDocRef,
      {
        preferredTheme: palette.id,
        themeProfile: {
          activeTheme: palette.id,
          name: palette.name,
          canvasBg: palette.canvasBg,
          mode: 'light',
          updatedAt: timestamp
        },
        updatedAt: timestamp
      },
      { merge: true }
    );

    // 2. Update dedicated subcollection: users/{userId}/themeProfile/active
    try {
      const activeThemeSubDoc = doc(db, 'users', userId, 'themeProfile', 'active');
      await setDoc(
        activeThemeSubDoc,
        {
          activeThemeName: palette.id,
          name: palette.name,
          canvasBg: palette.canvasBg,
          colorPalette: [palette.canvasBg, palette.surfaceCard, palette.accentPrimary, palette.textPrimary],
          mode: 'light',
          contrastRatio: palette.contrastRatio,
          wcagCompliant: palette.wcagCompliant,
          updatedAt: timestamp
        },
        { merge: true }
      );
    } catch (subErr) {
      console.warn('[ThemeEngine] Subdocument update notice:', subErr);
    }

    // 3. Update styleProfiles/{userId} for collaborative compatibility
    try {
      const styleProfileDoc = doc(db, 'styleProfiles', userId);
      await setDoc(
        styleProfileDoc,
        {
          activeTheme: palette.id,
          canvasBg: palette.canvasBg,
          updatedAt: timestamp
        },
        { merge: true }
      );
    } catch (_) {}

    return { success: true, mode: 'firestore' };
  } catch (error: any) {
    console.warn('[ThemeEngine] Firestore synchronization notice (fallback to local state active):', error?.message || error);
    return { success: false, mode: 'offline_cached', error: error?.message || String(error) };
  }
}
