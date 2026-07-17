/**
 * AIStyleHub - Product Layer Entry Point
 * 
 * The Product Layer represents the user-facing surface of the application.
 * These components render views, handle interactive user gestures, and trigger 
 * state-changes via the underlying Engine and Platform services.
 * 
 * In accordance with clean enterprise architecture guidelines:
 * - Components in this layer do not contain reusable business logic.
 * - They rely on the Engine Layer for styling decisions, recommendation logic, and state.
 * - They rely on the Platform Layer for data persistence, auth, and infrastructure.
 */

// 1. Core Workspace Shell & Router
export { AIStyleHub } from '../components/AIStyleHub';

// 2. High-Fidelity Screens & Core Tabs
export { HomeFeed } from '../components/HomeFeed';
export { AIFashionMVPSuite } from '../components/AIFashionMVPSuite';
export { VirtualStudioTryOn } from '../components/VirtualStudioTryOn';
export { MarketplaceModule } from '../components/MarketplaceModule';
export { CognitivePassport } from '../components/CognitivePassport';

// 3. Subsidiary Product Components
export { StyleCollections } from '../components/StyleCollections';
export { SartorialControlCenter } from '../components/SartorialControlCenter';
export { StyleFavorites } from '../components/StyleFavorites';
export { StyleHistoryArchive } from '../components/StyleHistoryArchive';
export { StyleMessageCenter } from '../components/StyleMessageCenter';
export { AuthModule } from '../components/AuthModule';
export { OnboardingFlow } from '../components/OnboardingFlow';
export { SellerDashboard } from '../components/SellerDashboard';
export { FounderDashboard } from '../components/FounderDashboard';
export { SaaSPricingUpsell } from '../components/SaaSPricingUpsell';
export { SystemHealthPanel } from '../components/SystemHealthPanel';
export { SystemSettingsAudit } from '../components/SystemSettingsAudit';

// 4. UI Layout Widgets & Cards
export { FeedCard } from '../components/FeedCard';
export { LazyFeedCard } from '../components/LazyFeedCard';
export { OutfitCard } from '../components/OutfitCard';
export { FeedbackButtons } from '../components/FeedbackButtons';
export { FloatingAIChat } from '../components/FloatingAIChat';
export { StyleBadge } from '../components/StyleBadge';
export { EmptyStateLibrary } from '../components/EmptyStateLibrary';
export { ErrorBoundary } from '../components/ErrorBoundary';
export { LookVisionMainDashboard } from '../components/LookVisionMainDashboard';
export { ArchitectureMap } from '../components/ArchitectureMap';

// 5. High-Integrity Separated Business Products
export {
  HomeGenerateProduct,
  AICreationsProduct,
  MarketplaceProduct,
  CommunityProduct,
  type HomeGenerateRequest,
  type HomeGenerateResult,
  type AICreationRequest,
  type AICreationResult,
  type MarketplaceProductItem,
  type CommunityPost
} from './products';

// 6. Unified Enterprise Product Layer Systems
export {
  ProductIdentity,
  ProductStatus,
  type ProductConfig,
  type ProductLifecycleContext,
  type ProductEvent,
  type ProductTelemetryMetrics,
  type ProductHealthReport,
  type ProductDiagnosticsTrace,
  type IProduct,
  ProductRegistry,
  ProductLifecycleManager,
  ProductController,
  ProductConfigurationManager,
  ProductPermissionsManager,
  ProductRoutingEngine,
  ProductStateManager,
  ProductAnalyticsTracker,
  ProductHealthMonitor,
  ProductTelemetrySystem,
  ProductDiagnosticsEngine,
  ProductEventBroker,
  ProductAuditLogger,
  ProductMemoryBridge
} from './enterpriseProductLayer';

export {
  type ProductManifest,
  ProductCapabilities,
  type CrossProductMessage,
  CrossProductCommunicationEngine,
  CrossProductDiscovery,
  CrossProductRecommendation,
  type ResourceAllocation,
  SharedResourceAllocator,
  type ProductTransaction,
  ProductRevenueTracker,
  type ProductUsageSummary,
  ProductUsageStatisticsEngine,
  ProductFeatureFlagsEngine,
  ProductMigrationEngine,
  type IProductPlugin,
  ProductExtensionSystem,
  ProductDependencyInjectionContainer,
  ProductManifestRegistry,
  EnterpriseProductSDK
} from './enterpriseProductSDK';



