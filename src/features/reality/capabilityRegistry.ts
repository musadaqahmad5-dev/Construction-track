export type ExecutionStatus = 'REAL' | 'PARTIAL' | 'MOCK' | 'DISABLED';

export interface SystemCapability {
  id: string;
  name: string;
  group: 'AI' | 'DataFlow' | 'Auth' | 'Database' | 'Trends' | 'TryOn' | 'Catalog';
  status: ExecutionStatus;
  executionPath: string;
  evidenceNotes: string;
}

export class CapabilityRegistry {
  private static capabilities: SystemCapability[] = [
    // 1. AI Group
    {
      id: 'style-strategy',
      name: 'Dynamic Look Styling Advice',
      group: 'AI',
      status: 'PARTIAL',
      executionPath: 'server.ts -> FashionAI.generateStylingStrategy -> gemini-3.5-flash',
      evidenceNotes: 'Pulls dynamic, customized styled advice when Gemini API key is available; elegant static styling template on fallback.'
    },
    {
      id: 'ai-recommendations',
      name: 'Weather-Adapted Recommendations',
      group: 'AI',
      status: 'PARTIAL',
      executionPath: 'server.ts -> FashionAI.recommendOutfit -> gemini-3.5-flash',
      evidenceNotes: 'Calls Live Gemini JSON API on server route, cascades gracefully to OutfitReasoner scoring matrix offline.'
    },
    {
      id: 'lookbook-image-gen',
      name: 'Live Lookbook Image Creation',
      group: 'AI',
      status: 'REAL',
      executionPath: 'imageGenerationProvider.ts -> ImageGenerationRegistry -> ImagenProvider',
      evidenceNotes: 'Fully integrated live Imagen 4.0 and Gemini Flash Image with Picsum seed fallbacks.'
    },

    // 2. Data Flow Group
    {
      id: 'visual-scan-ingestion',
      name: 'Base64 Camera Scan Ingestion',
      group: 'DataFlow',
      status: 'REAL',
      executionPath: 'VisualAnalysisPanel.tsx -> server.ts -> FashionAI.analyzeOutfitVisual',
      evidenceNotes: 'Authentically pipes camera strings and Base64 source files to the multi-modal endpoint.'
    },
    {
      id: 'interaction-evolution',
      name: 'Reinforcement Profile Evolution',
      group: 'DataFlow',
      status: 'REAL',
      executionPath: 'vectorProfileMemory.ts -> firebase.ts -> Firestore userStyleProfiles',
      evidenceNotes: 'Learns preferences by applying specific positive/negative mutations based on client action logs.'
    },

    // 3. Database Group
    {
      id: 'firestore-wardrobe-io',
      name: 'Cloud Wardrobe Sync (onSnapshot)',
      group: 'Database',
      status: 'REAL',
      executionPath: 'WardrobeGrid.tsx -> firebase.ts -> Firestore wardrobe',
      evidenceNotes: 'Operates on continuous reactive collections synchronizing updates of categories and wear counts.'
    },

    // 4. Auth Group
    {
      id: 'google-popup-auth',
      name: 'Google Auth SignIn Gateway',
      group: 'Auth',
      status: 'REAL',
      executionPath: 'FashionHome.tsx -> firebase.ts -> signInWithPopup',
      evidenceNotes: 'Signs in via official Firebase Google provider popup, checking tenant scopes.'
    },

    // 5. Trends Group
    {
      id: 'live-trend-crawler',
      name: 'Active Trend Aggregator',
      group: 'Trends',
      status: 'REAL',
      executionPath: 'trendAggregator.ts -> GoogleTrendsRssAdapter & GeminiGroundingAdapter',
      evidenceNotes: 'Extracts real search spikes from live US Google Trends XML RSS and live Gemini Search Grounding.'
    },

    // 6. TryOn Group
    {
      id: 'tryon-physics-drape',
      name: '3D TryOn Fitting Drape',
      group: 'TryOn',
      status: 'MOCK',
      executionPath: 'tryOnEngine.ts -> bodyMapper.ts & garmentAligner.ts',
      evidenceNotes: 'Employs client canvas models and gradient tags instead of WebGL coordinate meshes.'
    },

    // 7. Catalog Group
    {
      id: 'catalog-provider-sync',
      name: 'Storefront Catalog Batch Synchronizer',
      group: 'Catalog',
      status: 'REAL',
      executionPath: 'catalogSync.ts -> ProviderRegistry -> ShopifyStorefrontProvider',
      evidenceNotes: 'Fetches product nodes from live GraphQL and basic rest endpoints, syncing to cloud database.'
    }
  ];

  static listAll(): SystemCapability[] {
    return this.capabilities;
  }
}
