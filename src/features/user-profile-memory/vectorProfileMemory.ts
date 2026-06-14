import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface PersonaVector {
  minimalist: number;    // 0.0 to 1.0
  streetwear: number;    // 0.0 to 1.0
  classic: number;       // 0.0 to 1.0
  luxury: number;        // 0.0 to 1.0
  cyberpunk: number;     // 0.0 to 1.0
  traditional: number;   // 0.0 to 1.0
}

export interface UserStyleProfile {
  userId: string;
  vector: PersonaVector;
  interactionHistory: {
    action: 'like' | 'dislike' | 'click' | 'generate';
    itemIdOrTag: string;
    timestamp: string;
    weightDelta: Partial<PersonaVector>;
  }[];
  updatedAt: string;
}

// Default base embedding for standard user before iterations
export const DEFAULT_VECTOR: PersonaVector = {
  minimalist: 0.5,
  streetwear: 0.3,
  classic: 0.4,
  luxury: 0.3,
  cyberpunk: 0.1,
  traditional: 0.1,
};

export class VectorProfileMemory {
  /**
   * Loads user embedding representation either from Firestore or defaults safely.
   */
  static async loadProfile(userId: string): Promise<UserStyleProfile> {
    if (!userId || userId === 'anonymous-user') {
      return {
        userId: 'anonymous-user',
        vector: { ...DEFAULT_VECTOR },
        interactionHistory: [],
        updatedAt: new Date().toISOString()
      };
    }

    try {
      const docRef = doc(db, 'userStyleProfiles', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          userId: data.userId || userId,
          vector: data.vector || { ...DEFAULT_VECTOR },
          interactionHistory: data.interactionHistory || [],
          updatedAt: data.updatedAt || new Date().toISOString()
        };
      }
    } catch (error) {
      console.warn('Firestore loadProfile fallback to memory:', error);
    }

    return {
      userId,
      vector: { ...DEFAULT_VECTOR },
      interactionHistory: [],
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Persists user embedding vectors securely in Firestore.
   */
  static async saveProfile(profile: UserStyleProfile): Promise<void> {
    if (!profile.userId || profile.userId === 'anonymous-user') return;
    try {
      const docRef = doc(db, 'userStyleProfiles', profile.userId);
      await setDoc(docRef, {
        ...profile,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to persist vector profile memory in Firestore:', error);
    }
  }

  /**
   * Feedback loop training module: Mutates user embedding vector weights dynamically based on click/preference history.
   * Forces system continuous learning.
   */
  static adjustProfileWeights(
    profile: UserStyleProfile,
    action: 'like' | 'dislike' | 'click' | 'generate',
    tagOrStyle: string
  ): UserStyleProfile {
    const updatedProfile = { ...profile };
    const currentVector = { ...updatedProfile.vector };
    const lowercaseTag = tagOrStyle.toLowerCase();

    // Determine weight changes based on fashion taxonomy keywords
    const learningRate = action === 'like' ? 0.12 : action === 'dislike' ? -0.15 : 0.04;
    const delta: Partial<PersonaVector> = {};

    if (lowercaseTag.includes('minimal') || lowercaseTag.includes('scandinavian') || lowercaseTag.includes('clean')) {
      const diff = (1 - currentVector.minimalist) * learningRate;
      currentVector.minimalist = parseFloat(Math.min(Math.max(currentVector.minimalist + diff, 0), 1).toFixed(4));
      delta.minimalist = diff;
    }
    if (lowercaseTag.includes('street') || lowercaseTag.includes('harajuku') || lowercaseTag.includes('cargo') || lowercaseTag.includes('jogger')) {
      const diff = (1 - currentVector.streetwear) * learningRate;
      currentVector.streetwear = parseFloat(Math.min(Math.max(currentVector.streetwear + diff, 0), 1).toFixed(4));
      delta.streetwear = diff;
    }
    if (lowercaseTag.includes('classic') || lowercaseTag.includes('blazer') || lowercaseTag.includes('tailor') || lowercaseTag.includes('formal')) {
      const diff = (1 - currentVector.classic) * learningRate;
      currentVector.classic = parseFloat(Math.min(Math.max(currentVector.classic + diff, 0), 1).toFixed(4));
      delta.classic = diff;
    }
    if (lowercaseTag.includes('luxury') || lowercaseTag.includes('cashmere') || lowercaseTag.includes('savile') || lowercaseTag.includes('wool')) {
      const diff = (1 - currentVector.luxury) * learningRate;
      currentVector.luxury = parseFloat(Math.min(Math.max(currentVector.luxury + diff, 0), 1).toFixed(4));
      delta.luxury = diff;
    }
    if (lowercaseTag.includes('cyber') || lowercaseTag.includes('techwear') || lowercaseTag.includes('shell') || lowercaseTag.includes('goretex')) {
      const diff = (1 - currentVector.cyberpunk) * learningRate;
      currentVector.cyberpunk = parseFloat(Math.min(Math.max(currentVector.cyberpunk + diff, 0), 1).toFixed(4));
      delta.cyberpunk = diff;
    }
    if (lowercaseTag.includes('tradition') || lowercaseTag.includes('oriental') || lowercaseTag.includes('heritage') || lowercaseTag.includes('fringe')) {
      const diff = (1 - currentVector.traditional) * learningRate;
      currentVector.traditional = parseFloat(Math.min(Math.max(currentVector.traditional + diff, 0), 1).toFixed(4));
      delta.traditional = diff;
    }

    // Capture interaction node
    updatedProfile.interactionHistory = [
      {
        action,
        itemIdOrTag: tagOrStyle,
        timestamp: new Date().toISOString(),
        weightDelta: delta
      },
      ...updatedProfile.interactionHistory.slice(0, 19) // Cap at last 20 logs for fast document processing
    ];

    updatedProfile.vector = currentVector;
    updatedProfile.updatedAt = new Date().toISOString();

    return updatedProfile;
  }
}
