import { db } from '../../../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export interface CreatorIdentityProfile {
  creatorId: string;
  creatorName: string;
  avatarUrl: string;
  bio: string;
  primaryStyleDNA: string[];
  signatureTheme: string;
  designQualityScore: number; // 0 - 100
  creativityScore: number;
  popularCategories: { category: string; count: number; revenue: number }[];
  customerPreferenceAlignment: number; // %
  totalSalesVolume: number;
  totalRevenueUSD: number;
  featuredCreationsCount: number;
  tier: 'Emerging Artisan' | 'Master Atelier' | 'Couture House' | 'A.I. Design Icon';
  verifiedStatus: boolean;
  lastUpdated: string;
}

export const SEED_CREATOR_PROFILES: Record<string, CreatorIdentityProfile> = {
  'cr-01': {
    creatorId: 'cr-01',
    creatorName: 'Valerie Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    bio: 'Architectural precision meets bespoke Italian silk drapes. Master of monochrome cyber couture.',
    primaryStyleDNA: ['Architectural', 'Quiet Luxury', 'Monochrome', 'Minimalist'],
    signatureTheme: 'Architectural Minimal Luxury',
    designQualityScore: 94,
    creativityScore: 96,
    popularCategories: [
      { category: 'Outerwear & Jackets', count: 42, revenue: 14800 },
      { category: 'Bespoke Suits', count: 28, revenue: 11200 }
    ],
    customerPreferenceAlignment: 96,
    totalSalesVolume: 124,
    totalRevenueUSD: 38400,
    featuredCreationsCount: 18,
    tier: 'A.I. Design Icon',
    verifiedStatus: true,
    lastUpdated: '2026-08-01'
  },
  'cr-02': {
    creatorId: 'cr-02',
    creatorName: 'Aero Labs Design',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    bio: 'Futuristic technical outerwear infused with liquid metallic weaves and bio-adaptive fabrics.',
    primaryStyleDNA: ['Cyberpunk', 'Technical Outerwear', 'Liquid Metallic'],
    signatureTheme: 'Futuristic Technical Cyberpunk',
    designQualityScore: 91,
    creativityScore: 94,
    popularCategories: [
      { category: 'Cyber Jackets', count: 35, revenue: 11500 },
      { category: 'Modular Footwear', count: 19, revenue: 5800 }
    ],
    customerPreferenceAlignment: 91,
    totalSalesVolume: 88,
    totalRevenueUSD: 24600,
    featuredCreationsCount: 12,
    tier: 'Master Atelier',
    verifiedStatus: true,
    lastUpdated: '2026-08-01'
  }
};

export async function fetchCreatorProfile(creatorId: string): Promise<CreatorIdentityProfile> {
  if (SEED_CREATOR_PROFILES[creatorId]) {
    return SEED_CREATOR_PROFILES[creatorId];
  }

  try {
    const docRef = doc(db, 'creators', creatorId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return snap.data() as CreatorIdentityProfile;
    }
  } catch (err) {
    console.warn('Firestore creator profile fetch notice:', err);
  }

  // Fallback default
  return {
    creatorId,
    creatorName: 'A.I. Atelier Creator',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    bio: 'Bespoke creator specializing in AI-synthesized haute couture.',
    primaryStyleDNA: ['Architectural', 'Minimalist'],
    signatureTheme: 'Architectural Minimal Luxury',
    designQualityScore: 89,
    creativityScore: 90,
    popularCategories: [{ category: 'Jacket', count: 12, revenue: 3400 }],
    customerPreferenceAlignment: 88,
    totalSalesVolume: 32,
    totalRevenueUSD: 9800,
    featuredCreationsCount: 6,
    tier: 'Emerging Artisan',
    verifiedStatus: true,
    lastUpdated: new Date().toISOString().slice(0, 10)
  };
}

export async function updateCreatorProfile(profile: CreatorIdentityProfile): Promise<void> {
  try {
    const docRef = doc(db, 'creators', profile.creatorId);
    await setDoc(docRef, {
      ...profile,
      lastUpdated: new Date().toISOString().slice(0, 10)
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore creator profile update notice:', err);
  }
}
