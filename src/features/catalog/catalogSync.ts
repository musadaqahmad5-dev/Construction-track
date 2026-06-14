import { ProviderRegistry } from './providerRegistry';
import { ProductMapper, UnifiedProduct } from './productMapper';
import { db } from '../../firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';

export class CatalogSync {
  private static activeCatalog: UnifiedProduct[] = [];

  /**
   * Triggers batch sync routines matching registered inventory streams.
   */
  static async syncAllProviders(userId: string = 'global-admin'): Promise<UnifiedProduct[]> {
    console.log('[CatalogSync] Launching merchant catalog pipeline updates...');
    const consolidated: UnifiedProduct[] = [];

    const providers = ProviderRegistry.listProviders();
    for (const provider of providers) {
      try {
        const rawFeed = await provider.fetchFeed();
        console.log(`[CatalogSync] Synchronizing ${rawFeed.length} feed entries from ${provider.name}`);

        for (const item of rawFeed) {
          let mapped: UnifiedProduct;
          if (provider.id === 'shopify-storefront') {
            mapped = ProductMapper.fromShopify(item);
          } else {
            mapped = ProductMapper.fromWooCommerce(item);
          }
          consolidated.push(mapped);
        }
      } catch (err: any) {
        console.error(`[CatalogSync] Sync failure on provider ${provider.name}:`, err.message);
      }
    }

    // Cache to local state
    this.activeCatalog = consolidated;

    // Optional: Write batches to Cloud Firestore if connected
    if (db && consolidated.length > 0) {
      try {
        const batch = writeBatch(db);
        const colRef = collection(db, 'merchantProducts');

        // Write top 5 items for testing sync
        consolidated.slice(0, 5).forEach((product) => {
          const docRef = doc(colRef, product.id.replace(/[^a-zA-Z0-9]/g, '_'));
          batch.set(docRef, {
            ...product,
            syncedBy: userId,
            lastSyncedAt: new Date().toISOString()
          });
        });

        await batch.commit();
        console.log('[CatalogSync] Ingested elements synced to Firestore collection merchantProducts.');
      } catch (err: any) {
        console.warn('[CatalogSync] Background Firestore bulk sync bypass (offline/index missing):', err.message);
      }
    }

    return consolidated;
  }

  static getCachedProducts(): UnifiedProduct[] {
    return this.activeCatalog;
  }
}
