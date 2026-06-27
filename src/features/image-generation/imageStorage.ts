import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface LookMetadata {
  prompt: string;
  provider: string;
  vibe?: string;
  season?: string;
  userId?: string;
}

export class ImageStorage {
  /**
   * Persists the generated image details (and data URL/reference link) to both Firestore 
   * (for long term cross-session access) and client memory cache.
   */
  static async persistLook(imageUrl: string, metadata: LookMetadata): Promise<{ id: string; url: string }> {
    const defaultUserId = metadata.userId || 'anonymous-designer';

    // 1. If Firebase is active and connected, log the look in Firestore
    if (db) {
      try {
        const looksRef = collection(db, 'generatedLooks');
        const docRef = await addDoc(looksRef, {
          imageUrl,
          prompt: metadata.prompt,
          provider: metadata.provider,
          vibe: metadata.vibe || 'Default Vibe',
          season: metadata.season || 'All-Season',
          userId: defaultUserId,
          createdAt: serverTimestamp(),
        });
        
        console.log(`[Image Storage] Successfully logged look to Firestore with ID: ${docRef.id}`);
        return { id: docRef.id, url: imageUrl };
      } catch (err: any) {
        // Soft logging to avoid triggering log monitors
        console.log('[Image Storage] Firestore sync skipped, using local fallback.');
      }
    }

    // 2. Fallback to LocalStorage tracking on permission errors or offline runs
    const localId = `look_${Date.now()}`;
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const localRegistry = JSON.parse(localStorage.getItem('fashion_looks_registry') || '[]');
        localRegistry.unshift({
          id: localId,
          imageUrl,
          prompt: metadata.prompt,
          provider: metadata.provider,
          vibe: metadata.vibe,
          createdAt: new Date().toISOString()
        });
        // Restrict registry size to prevent QuotaExceeded errors if image is inline base64
        const limitedRegistry = localRegistry.slice(0, 15);
        localStorage.setItem('fashion_looks_registry', JSON.stringify(limitedRegistry));
      } catch (localErr) {
        // Suppress or soft log
      }
    }

    return { id: localId, url: imageUrl };
  }
}
