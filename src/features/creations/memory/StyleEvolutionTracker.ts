import { auth, db } from '../../../firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';

export interface StyleEvolutionMilestone {
  id: string;
  period: string; // e.g. 'Month 1', 'Month 3', 'Month 6'
  primaryTheme: string;
  dominantColors: string[];
  favoriteCategory: string;
  luxuryScore: number;
  modernityScore: number;
  timestamp: string;
  notes?: string;
}

export const INITIAL_EVOLUTION_TIMELINE: StyleEvolutionMilestone[] = [
  {
    id: 'evo-m1',
    period: 'Month 1',
    primaryTheme: 'Urban Streetwear & Minimal Basics',
    dominantColors: ['#05050A', '#27272A', '#A1A1AA'],
    favoriteCategory: 'Outfit',
    luxuryScore: 72,
    modernityScore: 88,
    timestamp: '2026-03-01',
    notes: 'Initial focus on versatile monochrome urban silhouettes.'
  },
  {
    id: 'evo-m3',
    period: 'Month 3',
    primaryTheme: 'Quiet Luxury & Tailored Cashmere',
    dominantColors: ['#09090D', '#D4AF37', '#1C1C28'],
    favoriteCategory: 'Jacket',
    luxuryScore: 88,
    modernityScore: 70,
    timestamp: '2026-05-15',
    notes: 'Transitioned towards high-density cashmere, Italian silk & structured shoulder drapes.'
  },
  {
    id: 'evo-m6',
    period: 'Month 6 (Current)',
    primaryTheme: 'Architectural Cyber Couture',
    dominantColors: ['#05050A', '#8B5CF6', '#D4AF37', '#22C55E'],
    favoriteCategory: 'Editorial Collection',
    luxuryScore: 95,
    modernityScore: 92,
    timestamp: '2026-08-01',
    notes: 'Mastered liquid metallic weaves, sculpted 3D geometry & bespoke ARIA intelligence.'
  }
];

export async function fetchStyleEvolutionMilestones(userId?: string): Promise<StyleEvolutionMilestone[]> {
  const uid = userId || auth?.currentUser?.uid;
  if (!uid) return INITIAL_EVOLUTION_TIMELINE;

  try {
    const q = query(collection(db, `users/${uid}/styleEvolution`), orderBy('timestamp', 'asc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return INITIAL_EVOLUTION_TIMELINE;

    const list: StyleEvolutionMilestone[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        period: data.period || 'Snapshot',
        primaryTheme: data.primaryTheme || 'Architectural Couture',
        dominantColors: data.dominantColors || ['#05050A', '#8B5CF6'],
        favoriteCategory: data.favoriteCategory || 'Outfit',
        luxuryScore: data.luxuryScore || 85,
        modernityScore: data.modernityScore || 75,
        timestamp: data.timestamp || new Date().toISOString().slice(0, 10),
        notes: data.notes
      });
    });

    return list.length > 0 ? list : INITIAL_EVOLUTION_TIMELINE;
  } catch (err) {
    console.warn('Firestore style evolution fetch notice:', err);
    return INITIAL_EVOLUTION_TIMELINE;
  }
}

export async function recordStyleEvolutionMilestone(
  milestone: Omit<StyleEvolutionMilestone, 'id'>,
  userId?: string
): Promise<StyleEvolutionMilestone> {
  const uid = userId || auth?.currentUser?.uid;
  const newMilestone: StyleEvolutionMilestone = {
    ...milestone,
    id: `evo-${Date.now()}`
  };

  if (uid) {
    try {
      const ref = await addDoc(collection(db, `users/${uid}/styleEvolution`), {
        ...milestone,
        createdAtServer: serverTimestamp()
      });
      newMilestone.id = ref.id;
    } catch (err) {
      console.warn('Firestore style evolution add notice:', err);
    }
  }

  return newMilestone;
}
