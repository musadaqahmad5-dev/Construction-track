export interface CatalogProvider {
  id: string;
  name: string;
  endpointUrl: string;
  authType: 'Bearer' | 'ApiKey' | 'Public';
  fetchFeed(): Promise<any[]>;
}

export class ProviderRegistry {
  private static providers: Map<string, CatalogProvider> = new Map();

  /**
   * Registers custom merchant catalog providers.
   */
  static registerProvider(provider: CatalogProvider) {
    console.log(`[ProviderRegistry] Registering catalog merchant: ${provider.name} [ID: ${provider.id}]`);
    this.providers.set(provider.id, provider);
  }

  static getProvider(id: string): CatalogProvider | undefined {
    return this.providers.get(id);
  }

  static listProviders(): CatalogProvider[] {
    return Array.from(this.providers.values());
  }
}

/**
 * Shopify Storefront JSON Feed Provider Integration
 */
export class ShopifyStorefrontProvider implements CatalogProvider {
  id = 'shopify-storefront';
  name = 'Shopify Merchant Storefront API';
  endpointUrl: string;
  authType: 'Bearer' = 'Bearer';

  constructor(endpointUrl: string = 'https://mock-shop.shopify.dev/api/2023-01/graphql') {
    this.endpointUrl = endpointUrl;
  }

  async fetchFeed(): Promise<any[]> {
    try {
      const query = `{
        products(first: 10) {
          edges {
            node {
              id
              title
              description
              variants(first: 1) {
                edges {
                  node {
                    price { amount currencyCode }
                    sku
                    image { url }
                  }
                }
              }
            }
          }
        }
      }`;

      const res = await fetch(this.endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': 'public-mock-token-ai-fashion-os'
        },
        body: JSON.stringify({ query })
      });

      if (!res.ok) throw new Error(`Shopify API responded with: ${res.status}`);
      const data = await res.json();
      return data.data?.products?.edges || [];
    } catch (err: any) {
      console.warn('[ShopifyStorefrontProvider] Fetch failed, returning empty catalog stream:', err.message);
      return [];
    }
  }
}

/**
 * WooCommerce REST Provider Integration
 */
export class WooCommerceProvider implements CatalogProvider {
  id = 'woocommerce-rest';
  name = 'WooCommerce Merchant Core';
  endpointUrl: string;
  authType: 'ApiKey' = 'ApiKey';

  constructor(endpointUrl: string = 'https://example.com/wp-json/wc/v3') {
    this.endpointUrl = endpointUrl;
  }

  async fetchFeed(): Promise<any[]> {
    try {
      const res = await fetch(`${this.endpointUrl}/products?per_page=10`, {
        headers: {
          'Authorization': 'Basic ' + btoa('consumer_key:consumer_secret')
        }
      });
      if (!res.ok) throw new Error(`WooCommerce responded with: ${res.status}`);
      return await res.json();
    } catch (err: any) {
      console.warn('[WooCommerceProvider] Fetch failed:', err.message);
      return [];
    }
  }
}

// Auto register standard storefront integration blueprints
ProviderRegistry.registerProvider(new ShopifyStorefrontProvider());
ProviderRegistry.registerProvider(new WooCommerceProvider());
