export interface CatalogProduct {
  productId: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  sizeOptions: string[];
  color: string;
  fabric: string;
  storeLink: string;
  score: number;
  imageAccent: string;
}

export class CatalogResolver {
  private static mockCatalog: CatalogProduct[] = [
    {
      productId: 'prod-01',
      name: 'Eco-Cotton Heavy box t-shirt',
      category: 'base',
      brand: 'Arket',
      price: 35,
      sizeOptions: ['S', 'M', 'L', 'XL'],
      color: '#F5F5F4',
      fabric: 'Supima Cotton',
      storeLink: 'https://www.arket.com/eco-heavy-tee',
      score: 98,
      imageAccent: 'from-stone-200 to-stone-400'
    },
    {
      productId: 'prod-02',
      name: 'Pleated Drape Charcoal Trouser',
      category: 'mid',
      brand: 'COS',
      price: 115,
      sizeOptions: ['29', '30', '31', '32', '33'],
      color: '#78716C',
      fabric: 'Tencel Wool',
      storeLink: 'https://www.cos.com/pleated-drape-trouser',
      score: 95,
      imageAccent: 'from-stone-500 to-stone-700'
    },
    {
      productId: 'prod-03',
      name: 'Heavyweight Fine Merino Wool Overcoat',
      category: 'outer',
      brand: 'A.P.C.',
      price: 490,
      sizeOptions: ['M', 'L', 'XL'],
      color: '#1C1917',
      fabric: 'Recycled Wool Blend',
      storeLink: 'https://www.apc.fr/merino-overcoat',
      score: 97,
      imageAccent: 'from-neutral-800 to-stone-950'
    },
    {
      productId: 'prod-04',
      name: 'Compression Baselayer Tech Top',
      category: 'inner',
      brand: 'Salomon',
      price: 65,
      sizeOptions: ['S', 'M', 'L'],
      color: '#18181B',
      fabric: 'Thermo-Knit Polyester',
      storeLink: 'https://www.salomon.com/baselayer-tech',
      score: 94,
      imageAccent: 'from-zinc-800 to-zinc-950'
    },
    {
      productId: 'prod-05',
      name: 'Ripstop Multi-Pocket Cargo Trousers',
      category: 'mid',
      brand: 'Acronym',
      price: 380,
      sizeOptions: ['S', 'M', 'L'],
      color: '#09090B',
      fabric: 'Nylon Ripstop',
      storeLink: 'https://acrnm.com/ripstop-cargo',
      score: 96,
      imageAccent: 'from-black to-slate-900'
    },
    {
      productId: 'prod-06',
      name: 'Waterproof 3L Asymmetric Shell Jacket',
      category: 'outer',
      brand: 'Arc\'teryx Veilance',
      price: 720,
      sizeOptions: ['S', 'M', 'L', 'XL'],
      color: '#064E3B',
      fabric: 'Gore-Tex Pro 3L',
      storeLink: 'https://veilance.arcteryx.com/waterproof-shell',
      score: 99,
      imageAccent: 'from-emerald-900 to-black'
    },
    {
      productId: 'prod-07',
      name: 'Silk-Rib Cashmere Lounge shirt',
      category: 'inner',
      brand: 'Loro Piana',
      price: 1100,
      sizeOptions: ['S', 'M', 'L', 'XL'],
      color: '#F7F7F7',
      fabric: 'Silk-Cashmere Blend',
      storeLink: 'https://www.loropiana.com/silk-cashmere-lounge',
      score: 99,
      imageAccent: 'from-stone-50 to-amber-100'
    },
    {
      productId: 'prod-08',
      name: 'Fine Wool Pleated Savile Row Trousers',
      category: 'mid',
      brand: 'Orazio Luciano',
      price: 640,
      sizeOptions: ['46', '48', '50', '52'],
      color: '#292524',
      fabric: 'Super 130s Merino',
      storeLink: 'https://orazioluciano.com/savile-trousers',
      score: 95,
      imageAccent: 'from-stone-700 to-amber-950'
    },
    {
      productId: 'prod-09',
      name: 'Suede Tailored Blazer Overjacket',
      category: 'outer',
      brand: 'Brunello Cucinelli',
      price: 3200,
      sizeOptions: ['48', '50', '52'],
      color: '#78350F',
      fabric: 'Lambskin Suede',
      storeLink: 'https://www.brunellocucinelli.com/suede-blazer',
      score: 98,
      imageAccent: 'from-amber-800 to-amber-950'
    },
    {
      productId: 'prod-10',
      name: 'Signature Brass Frame Aviators',
      category: 'acc',
      brand: 'Jacques Marie Mage',
      price: 850,
      sizeOptions: ['One Size'],
      color: '#111111',
      fabric: 'Japanese Acetate & Gold-plated Brass',
      storeLink: 'https://jacquesmariemage.com/brass-aviators',
      score: 96,
      imageAccent: 'from-neutral-700 to-black'
    }
  ];

  static queryProducts(category: string, preferredFabric?: string): CatalogProduct[] {
    let matches = this.mockCatalog.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
    if (matches.length === 0) {
      // Fallback
      matches = this.mockCatalog.filter(p => p.category === 'base');
    }
    return matches;
  }

  static getProductById(id: string): CatalogProduct | undefined {
    return this.mockCatalog.find(p => p.productId === id);
  }

  static getFullCatalog(): CatalogProduct[] {
    return this.mockCatalog;
  }
}
