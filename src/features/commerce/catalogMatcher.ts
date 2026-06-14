export interface CatalogFashionProduct {
  id: string;
  name: string;
  category: 'Casual' | 'Formal' | 'Outerwear' | 'Pants' | 'Accessories';
  priceUsd: number;
  primaryColor: string;
  imageUrl: string;
  curationLabel: string;
}

export class CatalogMatcher {
  private static readonly COMMERCE_CATALOG: CatalogFashionProduct[] = [
    {
      id: 'store_coat_01',
      name: 'Oatmeal Wool Trench Coat',
      category: 'Outerwear',
      priceUsd: 145.00,
      primaryColor: '#F5F5DC',
      imageUrl: 'https://picsum.photos/seed/trench/300/400',
      curationLabel: 'Classics Selection'
    },
    {
      id: 'store_coat_02',
      name: 'Dry Sage Waterproof Windbreaker',
      category: 'Outerwear',
      priceUsd: 95.00,
      primaryColor: '#8F9779',
      imageUrl: 'https://picsum.photos/seed/windbreaker/300/400',
      curationLabel: 'Tech Performance'
    },
    {
      id: 'store_jacket_03',
      name: 'Sartorial Double-Breasted Blazer',
      category: 'Formal',
      priceUsd: 160.00,
      primaryColor: '#0F172A',
      imageUrl: 'https://picsum.photos/seed/blazer/300/400',
      curationLabel: 'Premium Tailored'
    },
    {
      id: 'store_pant_03',
      name: 'Pleated Dry Sage Trousers',
      category: 'Pants',
      priceUsd: 79.00,
      primaryColor: '#8F9779',
      imageUrl: 'https://picsum.photos/seed/trouser/300/400',
      curationLabel: 'Minimalist Relaxed'
    },
    {
      id: 'store_boot_01',
      name: 'Chelsea Chocolate Leather Boots',
      category: 'Accessories',
      priceUsd: 125.00,
      primaryColor: '#5C4033',
      imageUrl: 'https://picsum.photos/seed/boots/300/400',
      curationLabel: 'Wardrobe Foundation'
    },
    {
      id: 'store_jean_01',
      name: 'Classic Indigo Raw Selvedge Denim',
      category: 'Pants',
      priceUsd: 89.00,
      primaryColor: '#1E3A8A',
      imageUrl: 'https://picsum.photos/seed/denim/300/400',
      curationLabel: 'Workwear Staples'
    },
    {
      id: 'store_scarf_01',
      name: 'Fine Oatmeal Cashmere Scarf',
      category: 'Accessories',
      priceUsd: 49.00,
      primaryColor: '#F5F5DC',
      imageUrl: 'https://picsum.photos/seed/scarf/300/400',
      curationLabel: 'Soft Accents'
    }
  ];

  /**
   * Identifies candidate fashion store catalog suggestions to complete the gaps.
   */
  static matchSuggestions(missingCategories: string[]): CatalogFashionProduct[] {
    const categoriesLower = missingCategories.map(c => c.toLowerCase());
    return this.COMMERCE_CATALOG.filter(product => {
      // Direct category overlap check
      const prodCatLower = product.category.toLowerCase();
      if (categoriesLower.includes(prodCatLower)) return true;
      
      // Secondary fallback match (e.g. check subtext)
      if (prodCatLower === 'accessories' && categoriesLower.includes('accessories')) {
        return true;
      }
      return false;
    });
  }
}
