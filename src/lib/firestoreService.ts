import { 
  db, 
  auth, 
  handleFirestoreError, 
  OperationType 
} from '../firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';

export interface FirestoreUser {
  uid: string;
  displayName: string;
  email: string;
  stylePreference?: string;
  occasionPreference?: string;
  fashionMaturityScore?: number;
  styleDriftIndex?: number;
  trendAdoptionLevel?: number;
  updatedAt: any;
}

export interface FirestoreOutfit {
  id?: string;
  title: string;
  description?: string;
  userId: string;
  items: any[];
  imageUrl?: string;
  createdAt: any;
}

export interface FirestoreStyle {
  id?: string;
  title: string;
  description?: string;
  userId: string;
  tags: string[];
  createdAt: any;
}

export interface FirestoreRecommendation {
  id?: string;
  title: string;
  userId: string;
  finalRecommendation: string;
  outfits: any[];
  createdAt: any;
}

export class FirestoreService {
  // --- USER PROFILE CRUD ---
  static async saveUserProfile(uid: string, profile: Partial<FirestoreUser>): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        uid,
        ...profile,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
    }
  }

  static async getUserProfile(uid: string): Promise<FirestoreUser | null> {
    try {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        return snap.data() as FirestoreUser;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${uid}`);
    }
  }

  // --- OUTFIT CRUD ---
  static async createOutfit(outfit: Omit<FirestoreOutfit, 'createdAt' | 'userId'>): Promise<string> {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Unauthenticated');
    try {
      const docRef = await addDoc(collection(db, 'outfits'), {
        ...outfit,
        userId,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      return handleFirestoreError(error, OperationType.CREATE, 'outfits');
    }
  }

  static async getOutfits(): Promise<FirestoreOutfit[]> {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
    try {
      const q = query(
        collection(db, 'outfits'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirestoreOutfit[];
    } catch (error) {
      return handleFirestoreError(error, OperationType.LIST, 'outfits');
    }
  }

  static async deleteOutfit(outfitId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'outfits', outfitId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `outfits/${outfitId}`);
    }
  }

  // --- STYLES CRUD ---
  static async createStyle(style: Omit<FirestoreStyle, 'createdAt' | 'userId'>): Promise<string> {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Unauthenticated');
    try {
      const docRef = await addDoc(collection(db, 'styles'), {
        ...style,
        userId,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      return handleFirestoreError(error, OperationType.CREATE, 'styles');
    }
  }

  static async getStyles(): Promise<FirestoreStyle[]> {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
    try {
      const q = query(
        collection(db, 'styles'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirestoreStyle[];
    } catch (error) {
      return handleFirestoreError(error, OperationType.LIST, 'styles');
    }
  }

  static async deleteStyle(styleId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'styles', styleId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `styles/${styleId}`);
    }
  }

  // --- RECOMMENDATIONS CRUD ---
  static async createRecommendation(rec: Omit<FirestoreRecommendation, 'createdAt' | 'userId'>): Promise<string> {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Unauthenticated');
    try {
      const docRef = await addDoc(collection(db, 'recommendations'), {
        ...rec,
        userId,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      return handleFirestoreError(error, OperationType.CREATE, 'recommendations');
    }
  }

  static async getRecommendations(): Promise<FirestoreRecommendation[]> {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
    try {
      const q = query(
        collection(db, 'recommendations'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirestoreRecommendation[];
    } catch (error) {
      return handleFirestoreError(error, OperationType.LIST, 'recommendations');
    }
  }

  static async deleteRecommendation(recId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'recommendations', recId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `recommendations/${recId}`);
    }
  }
}
