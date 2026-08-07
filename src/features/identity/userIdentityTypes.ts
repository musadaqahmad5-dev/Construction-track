/**
 * LOOK VISION v2.4 - User Identity Initialization System Types
 * Production User Identity & Schema Definitions
 */

import { StyleDNAProfileData, ThemeProfileData, ARIAProfileData } from '../simulation/personaSimulationTypes';

export type AppOperatingMode = 'PRODUCTION_USER' | 'DEVELOPER_SIMULATION';

export type UserRole = 'user' | 'creator' | 'curator' | 'admin' | 'super_admin';

export interface UserOnboardingProfile {
  userId: string;
  completedAt: string;
  fashionPersonality: string;
  lifestyleContext: string;
  preferredAesthetics: string[];
  colorPreferences: string[];
  formalityLevel: number; // 0 to 1
  fashionGoals: string[];
  shoppingBehavior: string;
}

export interface UserProfileIdentity {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  isBootstrapped: boolean;
  isOnboardingCompleted: boolean;
  createdAt: string;
  lastLoginAt: string;
}

/**
 * Firestore Production Schema Mappings:
 * 1. users/{uid}/identity (Doc: profile)
 * 2. users/{uid}/styleDNA (Doc: profile)
 * 3. users/{uid}/themeProfile (Doc: active)
 * 4. users/{uid}/ariaProfile (Doc: context)
 */
export interface UserIdentityState {
  identity: UserProfileIdentity;
  styleDNA: StyleDNAProfileData;
  themeProfile: ThemeProfileData;
  ariaProfile: ARIAProfileData;
  operatingMode: AppOperatingMode;
}

export interface UserBootstrapResult {
  success: boolean;
  isFirstLogin: boolean;
  mode: 'firestore' | 'local_fallback';
  state: UserIdentityState;
  message: string;
}
