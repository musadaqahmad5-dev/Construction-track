import { db, handleFirestoreError, OperationType } from '../../firebase';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { WardrobeItem, ClothingCategory } from '../../types';

/**
 * Wardrobe Storage Service - Interface layer connecting Firestore collections with closets.
 * Handles dual-collection mapping (constructions / wardrobe) to ensure zero data loss.
 */
export class WardrobeService {
  /**
   * Add a new clothing piece to the user's remote Firestore closet.
   */
  static async addGarment(
    userId: string,
    title: string,
    description: string,
    category: ClothingCategory,
    extraOptions?: {
      season?: WardrobeItem['season'];
      primaryColor?: string;
      secondaryColor?: string;
      wearCount?: number;
      lastUsed?: string;
    }
  ): Promise<string> {
    try {
      // Write directly to the wardrobe namespace
      const docRef = await addDoc(collection(db, 'wardrobe'), {
        title,
        description,
        status: 'In Closet',
        category,
        userId,
        createdAt: serverTimestamp(),
        season: extraOptions?.season || 'All-Season',
        primaryColor: extraOptions?.primaryColor || 'Neutral shade',
        secondaryColor: extraOptions?.secondaryColor || 'Contrast hue',
        wearCount: extraOptions?.wearCount || 0,
        lastUsed: extraOptions?.lastUsed || ''
      });
      return docRef.id;
    } catch (error) {
      return handleFirestoreError(error, OperationType.CREATE, 'wardrobe');
    }
  }

  /**
   * Refactors or changes the status of an outfit/garment.
   */
  static async cycleGarmentStatus(
    itemId: string,
    currentStatus: WardrobeItem['status'],
    collectionName: 'wardrobe' | 'constructions' = 'wardrobe'
  ): Promise<void> {
    const nextStatusMap: Record<WardrobeItem['status'], WardrobeItem['status']> = {
      'In Closet': 'Planned',
      'Planned': 'Worn/Wash',
      'Worn/Wash': 'In Closet'
    };

    try {
      const nextStatus = nextStatusMap[currentStatus];
      await updateDoc(doc(db, collectionName, itemId), {
        status: nextStatus
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${collectionName}/${itemId}`);
    }
  }

  /**
   * Permanently delete an item from the user's closet.
   */
  static async removeGarment(
    itemId: string,
    collectionName: 'wardrobe' | 'constructions' = 'wardrobe'
  ): Promise<void> {
    try {
      await deleteDoc(doc(db, collectionName, itemId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${itemId}`);
    }
  }
}
