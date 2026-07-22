export interface UnifiedProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  imageUrl: string;
  sku: string;
  source: string;
}

export class ProductMapper {
  /**
   * Maps raw Shopify Product responses to unified structures.
   */
  static fromShopify(shopifyNode: any): UnifiedProduct {
    const node = shopifyNode.node || shopifyNode;
    const variant = node.variants?.edges?.[0]?.node;

    return {
      id: node.id || `sh_${Math.random()}`,
      title: node.title || 'In-store Apparel',
      description: node.description || 'Premium design segment item.',
      category: 'Outerwear',
      price: parseFloat(variant?.price?.amount || '0.00'),
      currency: variant?.price?.currencyCode || 'USD',
      imageUrl: variant?.image?.url || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop',
      sku: variant?.sku || 'SKU-SHOPIFY',
      source: 'Shopify Storefront'
    };
  }

  /**
   * Maps raw WooCommerce Product structures.
   */
  static fromWooCommerce(wooProduct: any): UnifiedProduct {
    return {
      id: wooProduct.id?.toString() || `woo_${Math.random()}`,
      title: wooProduct.name || 'Woo Apparel',
      description: wooProduct.description?.replace(/<[^>]*>/g, '') || '',
      category: 'Casual',
      price: parseFloat(wooProduct.price || '0.00'),
      currency: 'USD',
      imageUrl: wooProduct.images?.[0]?.src || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop',
      sku: wooProduct.sku || 'SKU-WOO',
      source: 'WooCommerce'
    };
  }
}
