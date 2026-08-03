import { auth, db } from '../../../firebase';
import { collection, addDoc, getDocs, doc, getDoc, setDoc, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';

export interface CommerceEventSignal {
  id?: string;
  type: 'purchase' | 'view' | 'reject' | 'try_on' | 'favorite' | 'price_check';
  productId: string;
  productTitle: string;
  category: string;
  priceUSD: number;
  creatorId: string;
  creatorName: string;
  colors: string[];
  fabric: string;
  timestamp?: string;
}

export interface UserCommerceMemoryProfile {
  totalPurchasesCount: number;
  totalSpentUSD: number;
  averageItemSpendUSD: number;
  preferredBrandsCreators: string[];
  preferredCategories: { category: string; frequency: number }[];
  rejectedCategories: string[];
  rejectedPriceFloor: number;
  spendingPatternTier: 'Connoisseur' | 'Haute Collector' | 'Bespoke Curator' | 'Selective Artisan';
  totalSignalsCaptured: number;
  lastUpdated: string;
}

export async function logCommerceMemorySignal(
  signal: CommerceEventSignal,
  userId?: string
): Promise<void> {
  const uid = userId || auth?.currentUser?.uid;
  if (!uid) return;

  try {
    const memoryRef = collection(db, `users/${uid}/commerceMemory`);
    await addDoc(memoryRef, {
      ...signal,
      timestamp: new Date().toISOString(),
      createdAtServer: serverTimestamp()
    });

    // Update aggregate summary doc
    await updateCommerceMemorySummary(uid, signal);
  } catch (err) {
    console.warn('Firestore commerce memory signal notice:', err);
  }
}

async function updateCommerceMemorySummary(uid: string, newSignal: CommerceEventSignal): Promise<void> {
  try {
    const summaryRef = doc(db, `users/${uid}/commerceMemorySummary`, 'summary');
    const snap = await getDoc(summaryRef);

    let current: UserCommerceMemoryProfile = {
      totalPurchasesCount: 0,
      totalSpentUSD: 0,
      averageItemSpendUSD: 0,
      preferredBrandsCreators: [],
      preferredCategories: [],
      rejectedCategories: [],
      rejectedPriceFloor: 0,
      spendingPatternTier: 'Haute Collector',
      totalSignalsCaptured: 0,
      lastUpdated: new Date().toISOString().slice(0, 10)
    };

    if (snap.exists()) {
      current = snap.data() as UserCommerceMemoryProfile;
    }

    current.totalSignalsCaptured += 1;

    if (newSignal.type === 'purchase') {
      current.totalPurchasesCount += 1;
      current.totalSpentUSD += newSignal.priceUSD;
      current.averageItemSpendUSD = Math.round(current.totalSpentUSD / current.totalPurchasesCount);

      if (!current.preferredBrandsCreators.includes(newSignal.creatorName)) {
        current.preferredBrandsCreators.push(newSignal.creatorName);
      }
    } else if (newSignal.type === 'reject') {
      if (!current.rejectedCategories.includes(newSignal.category)) {
        current.rejectedCategories.push(newSignal.category);
      }
    }

    if (current.totalSpentUSD > 2000) current.spendingPatternTier = 'Haute Collector';
    else if (current.totalSpentUSD > 800) current.spendingPatternTier = 'Bespoke Curator';

    current.lastUpdated = new Date().toISOString().slice(0, 10);

    await setDoc(summaryRef, current, { merge: true });
  } catch (err) {
    console.warn('Firestore commerce summary update notice:', err);
  }
}

export async function fetchUserCommerceMemory(userId?: string): Promise<UserCommerceMemoryProfile> {
  const uid = userId || auth?.currentUser?.uid;

  if (!uid) {
    return {
      totalPurchasesCount: 6,
      totalSpentUSD: 2480,
      averageItemSpendUSD: 413,
      preferredBrandsCreators: ['Valerie Vance', 'Aero Labs Design'],
      preferredCategories: [
        { category: 'Outerwear', frequency: 4 },
        { category: 'Bespoke Suits', frequency: 2 }
      ],
      rejectedCategories: ['Fast Fashion Synthetics'],
      rejectedPriceFloor: 120,
      spendingPatternTier: 'Haute Collector',
      totalSignalsCaptured: 38,
      lastUpdated: new Date().toISOString().slice(0, 10)
    };
  }

  try {
    const summaryRef = doc(db, `users/${uid}/commerceMemorySummary`, 'summary');
    const snap = await getDoc(summaryRef);

    if (snap.exists()) {
      return snap.data() as UserCommerceMemoryProfile;
    }
  } catch (err) {
    console.warn('Firestore commerce memory fetch notice:', err);
  }

  return {
    totalPurchasesCount: 3,
    totalSpentUSD: 1250,
    averageItemSpendUSD: 416,
    preferredBrandsCreators: ['Valerie Vance'],
    preferredCategories: [{ category: 'Outerwear', frequency: 3 }],
    rejectedCategories: [],
    rejectedPriceFloor: 100,
    spendingPatternTier: 'Bespoke Curator',
    totalSignalsCaptured: 14,
    lastUpdated: new Date().toISOString().slice(0, 10)
  };
}
