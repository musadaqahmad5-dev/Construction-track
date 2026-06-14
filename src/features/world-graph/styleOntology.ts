export interface TaxonomyTerm {
  term: string;
  category: 'Aesthetic' | 'Silhouette' | 'Luster' | 'MaterialClass';
  parentTerm?: string;
  crossReferences: string[];
}

export class StyleOntology {
  private static terms: TaxonomyTerm[] = [
    {
      term: 'Minimalist',
      category: 'Aesthetic',
      crossReferences: ['Silent Luxury', 'Bauhaus Architectural']
    },
    {
      term: 'Cyberpunk',
      category: 'Aesthetic',
      parentTerm: 'Futurism',
      crossReferences: ['Stealth Techwear', 'Magnetic Closures']
    },
    {
      term: 'Raw Cotton',
      category: 'MaterialClass',
      crossReferences: ['Supima', 'Organic Denim']
    },
    {
      term: 'Asymmetric Shell',
      category: 'Silhouette',
      crossReferences: ['Stealth Techwear', 'Layered Oversize']
    }
  ];

  static queryOntology(term: string): TaxonomyTerm | undefined {
    return this.terms.find(t => t.term.toLowerCase() === term.toLowerCase());
  }

  static getCatalogTaxonomy(): TaxonomyTerm[] {
    return this.terms;
  }
}
