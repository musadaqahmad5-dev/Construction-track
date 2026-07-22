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
      imageUrl: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=400&auto=format&fit=crop',
      curationLabel: 'Classics Selection'
    },
    {
      id: 'store_coat_02',
      name: 'Dry Sage Waterproof Windbreaker',
      category: 'Outerwear',
      priceUsd: 95.00,
      primaryColor: '#8F9779',
      imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?q=80&w=400&auto=format&fit=crop',
      curationLabel: 'Tech Performance'
    },
    {
      id: 'store_jacket_03',
      name: 'Sartorial Double-Breasted Blazer',
      category: 'Formal',
      priceUsd: 160.00,
      primaryColor: '#0F172A',
      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=400&auto=format&fit=crop',
      curationLabel: 'Premium Tailored'
    },
    {
      id: 'store_pant_03',
      name: 'Pleated Dry Sage Trousers',
      category: 'Pants',
      priceUsd: 79.00,
      primaryColor: '#8F9779',
      imageUrl: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=400&auto=format&fit=crop',
      curationLabel: 'Minimalist Relaxed'
    },
    {
      id: 'store_boot_01',
      name: 'Chelsea Chocolate Leather Boots',
      category: 'Accessories',
      priceUsd: 125.00,
      primaryColor: '#5C4033',
      imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=400&auto=format&fit=crop',
      curationLabel: 'Wardrobe Foundation'
    },
    {
      id: 'store_jean_01',
      name: 'Classic Indigo Raw Selvedge Denim',
      category: 'Pants',
      priceUsd: 89.00,
      primaryColor: '#1E3A8A',
      imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=400&auto=format&fit=crop',
      curationLabel: 'Workwear Staples'
    },
    {
      id: 'store_scarf_01',
      name: 'Fine Oatmeal Cashmere Scarf',
      category: 'Accessories',
      priceUsd: 49.00,
      primaryColor: '#F5F5DC',
      imageUrl: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=400&auto=format&fit=crop',
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
