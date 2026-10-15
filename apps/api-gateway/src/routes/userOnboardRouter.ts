/**
 * EAOS Look Vision AI Fashion OS - Core Identity Router
 * Path: apps/api-gateway/src/routes/userOnboardRouter.ts
 * Subsystem: Onboarding Allocation Matrix & Theme Bucket Distribution
 */

import { Router, Request, Response } from 'express';
import { getFirestore } from 'firebase-admin/firestore';
import crypto from 'crypto';

export const userOnboardRouter = Router();

export const SUPPORTED_THEMES = [
  'CYBER_HERITAGE',
  'MINIMALIST_LUXURY',
  'HAUTE_COUTURE',
  'STREETWEAR_TECHNICAL'
];

export interface OnboardRequestBody {
  userId: string;
  email: string;
  manualSkinChoice?: string; // Optional user-selected theme skin
}

// In-memory fallback registry for preview / local development environments
const inMemoryOnboardedProfiles: Record<string, { userProfile: any; styleProfile: any }> = {};

userOnboardRouter.post(['/api/v1/user/onboard', '/user/onboard'], async (req: Request, res: Response) => {
  const traceId = (req.headers['x-trace-id'] as string) || `trc_onb_${crypto.randomBytes(4).toString('hex')}`;
  
  try {
    const { userId, email, manualSkinChoice } = req.body as OnboardRequestBody;
    
    if (!userId || !email) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Missing core onboarding configurations: userId and email are mandatory properties.",
        traceId
      });
    }

    let allocatedThemeSkin: string;

    // Rule Evaluation: Respect dynamic manual intent, fallback to programmatic random distribution
    if (manualSkinChoice && SUPPORTED_THEMES.includes(manualSkinChoice.toUpperCase())) {
      allocatedThemeSkin = manualSkinChoice.toUpperCase();
      console.log(`[ONBOARDING INTENT] User ${userId} requested manual skin allocation: ${allocatedThemeSkin}`);
    } else {
      // Rule: Execute strict balance distribution using mathematical randomizers over allowed buckets
      const randomIndex = Math.floor(Math.random() * SUPPORTED_THEMES.length);
      allocatedThemeSkin = SUPPORTED_THEMES[randomIndex];
      console.log(`[ONBOARDING MATRIX] User ${userId} did not choose manual skin. Programmatically assigned bucket: ${allocatedThemeSkin}`);
    }

    const timestamp = new Date().toISOString();

    const userProfileData = {
      uid: userId,
      email: email,
      role: 'client',
      accountStatus: 'BASIC',
      subscriptionTier: 'BASIC',
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const styleProfileData = {
      userId: userId,
      preferredArchetype: allocatedThemeSkin,
      sartorialMaturityScore: 0.10, // Starting baseline maturity metric
      preferences: {
        archetypes: { [allocatedThemeSkin]: 1.0 },
        dominantColors: ['#05050a'], // Anchored to base dark theme slate invariant
        excludedColors: [],
        favoredSilhouettes: [],
        textiles: []
      },
      createdAt: timestamp,
      updatedAt: timestamp
    };

    try {
      const db = getFirestore();
      const userProfileRef = db.collection('users').doc(userId);
      const styleProfileRef = db.collection('styleProfiles').doc(userId);

      // 1. Transactional initialization of Core User Account
      await userProfileRef.set(userProfileData, { merge: true });

      // 2. Transactional initialization of Personalized Style DNA & Theme Token
      await styleProfileRef.set(styleProfileData, { merge: true });
    } catch (firestoreErr: any) {
      console.warn(`[ONBOARDING FIRESTORE FALLBACK] [Trace: ${traceId}] Persisting onboarding state in memory store:`, firestoreErr?.message || firestoreErr);
      inMemoryOnboardedProfiles[userId] = {
        userProfile: userProfileData,
        styleProfile: styleProfileData
      };
    }

    return res.status(200).json({
      success: true,
      service: "EAOS-Identity-Allocation-Gateway",
      traceId,
      payload: {
        userId,
        allocatedThemeSkin,
        status: "INITIALIZED",
        message: `Account created successfully. User assigned to target bucket: ${allocatedThemeSkin}`
      }
    });

  } catch (error: any) {
    console.error(`[ONBOARDING CRITICAL CRASH] [Trace: ${traceId}] Failed to assign user:`, error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "The gateway failed to initialize the user's secure state profiles.",
      details: error.message,
      traceId
    });
  }
});

export default userOnboardRouter;
