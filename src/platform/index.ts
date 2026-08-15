/**
 * AIStyleHub - Platform Layer Entry Point
 * 
 * The Platform Layer encapsulates all underlying infrastructure, low-level services,
 * external API integrations, and developer-level configurations.
 * 
 * In accordance with clean enterprise architecture guidelines:
 * - This layer is completely agnostic to both visual products and business rules.
 * - It handles security, direct network communication, persistence mechanics, and device status.
 * - It provides highly resilient, safe-guard interfaces to keep upper levels stable.
 */

// 1. Direct Firebase & Authentication Bridges
export { auth, db } from '../firebase';

// 2. Platform Capability & Extension Registry
export { CapabilityRegistry } from './capabilityRegistry';
export { DependencyResolver } from './dependencyResolver';
export { RuntimeGuard } from './runtimeGuard';
export { PLATFORM_MODULES } from './moduleManifest';

// 3. Low-Level Database & Custom Service Connectors
export { ProfileService } from '../features/wardrobe/profileService';
export type { StyleProfile, StylistHistoryEntry } from '../features/wardrobe/profileService';

// 4. Global React Custom Hooks
export { useOnlineStatus } from '../hooks/useOnlineStatus';
export { useStyleProfile } from '../hooks/useStyleProfile';

// 5. Shared Types & Universal Contracts
export * from '../types';
export type { FeedItem } from '../features/feed/feedTypes';
export { LOCAL_SHOP_ITEMS } from '../features/feed/AIEngine';
export { AIStyleFeed } from '../components/AIStyleFeed';
export type { StyleFeedAsset, BundledProductItem, AIStyleFeedProps } from '../components/AIStyleFeed';
export { VendorOnboarding } from '../components/VendorOnboarding';
export type { VendorProfileState, FashionNiche, PayoutMethod, VendorOnboardingProps } from '../components/VendorOnboarding';

