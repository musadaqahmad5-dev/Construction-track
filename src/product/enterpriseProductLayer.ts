import {
  UnifiedFashionOS,
  PersonalFashionMemoryEngine,
  FashionKnowledgeGraphEngine,
  VisionIntelligenceEngine,
  DecisionIntelligenceEngine,
  FashionAgentEngine,
  EnterpriseWorkflowEngine,
  EnterpriseReasoningEngine,
  EnterpriseObservabilityEngine,
  AIRequestPipeline,
  EnterpriseProductIntelligenceEngine,
  EnterpriseSystemCoordinationEngine,
  AnalyticsEngine,
  ErrorRegistry,
  EnterpriseLearningEngine,
  type GovernanceState,
  type SubscriptionTier
} from '../engine';

// ============================================================================
// 1. PRODUCT IDENTITIES & METRICS TYPES
// ============================================================================

import { ProductIdentity, ProductStatus } from '../core/enums';
export { ProductIdentity, ProductStatus };

export interface ProductConfig {
  requiredTier: 'GUEST' | 'FREE' | 'PRO' | 'ENTERPRISE';
  rateLimitPerMin: number;
  latencyBudgetMs: number;
  supportedViews: string[];
  sharedEngines: string[];
}

export interface ProductLifecycleContext {
  userId: string;
  timestamp: number;
  environment: 'development' | 'production' | 'staging';
  sessionId: string;
}

export interface ProductEvent {
  eventId: string;
  type: string;
  source: ProductIdentity;
  payload: any;
  timestamp: number;
  traceId: string;
}

export interface ProductTelemetryMetrics {
  productId: ProductIdentity;
  operation: string;
  latencyMs: number;
  cpuUsagePct: number;
  memoryMb: number;
  timestamp: number;
  success: boolean;
}

export interface ProductHealthReport {
  productId: ProductIdentity;
  status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  healthScore: number; // 0 - 100
  uptimePct: number;
  errorRatePct: number;
  activeIncidentsCount: number;
  lastChecked: number;
}

export interface ProductDiagnosticsTrace {
  traceId: string;
  productId: ProductIdentity;
  errorDetails?: {
    message: string;
    stack?: string;
    code: string;
  };
  involvedEngines: string[];
  diagnosticsSummary: string;
  rootCauseAnalysis: string;
  recommendedAction: string;
  timestamp: number;
}

// ============================================================================
// 2. BASE INTERFACE FOR PRODUCTS
// ============================================================================

export interface IProduct {
  id: ProductIdentity;
  name: string;
  description: string;
  version: string;
  config: ProductConfig;
  status: ProductStatus;

  // Lifecycle hooks
  onInitialize(ctx: ProductLifecycleContext): Promise<void>;
  onStart(ctx: ProductLifecycleContext): Promise<void>;
  onPause(ctx: ProductLifecycleContext): Promise<void>;
  onStop(ctx: ProductLifecycleContext): Promise<void>;
}

// ============================================================================
// 3. PRODUCT REGISTRY (Pillar 1)
// ============================================================================

export class ProductRegistry {
  private static registeredProducts = new Map<ProductIdentity, IProduct>();

  public static registerProduct(product: IProduct): void {
    if (this.registeredProducts.has(product.id)) {
      ProductAuditLogger.log(
        ProductIdentity.HOME_GENERATE,
        'WARN',
        `Overwriting product registration for [${product.id}]`,
        'REGISTRY_OVERWRITE'
      );
    }
    this.registeredProducts.set(product.id, product);
    ProductAuditLogger.log(
      product.id,
      'INFO',
      `Product [${product.name}] version [${product.version}] registered successfully.`,
      'REGISTRY_ADD'
    );
  }

  public static getProduct(id: ProductIdentity): IProduct | null {
    return this.registeredProducts.get(id) || null;
  }

  public static getAllProducts(): IProduct[] {
    return Array.from(this.registeredProducts.values());
  }

  public static unregisterProduct(id: ProductIdentity): boolean {
    if (this.registeredProducts.has(id)) {
      const prod = this.registeredProducts.get(id);
      this.registeredProducts.delete(id);
      ProductAuditLogger.log(
        id,
        'INFO',
        `Product [${prod?.name}] unregistered.`,
        'REGISTRY_REMOVE'
      );
      return true;
    }
    return false;
  }

  public static clear(): void {
    this.registeredProducts.clear();
  }
}

// ============================================================================
// 4. PRODUCT LIFECYCLE (Pillar 3)
// ============================================================================

export class ProductLifecycleManager {
  public static async transitionTo(
    id: ProductIdentity,
    targetStatus: ProductStatus,
    ctx: ProductLifecycleContext
  ): Promise<boolean> {
    const product = ProductRegistry.getProduct(id);
    if (!product) {
      ProductAuditLogger.log(id, 'ERROR', `Failed lifecycle transition. Product not found.`, 'LIFECYCLE_NOT_FOUND');
      return false;
    }

    const currentStatus = product.status;
    if (currentStatus === targetStatus) {
      return true;
    }

    ProductAuditLogger.log(
      id,
      'INFO',
      `Attempting transition from ${currentStatus} to ${targetStatus}...`,
      'LIFECYCLE_TRANSITION_START'
    );

    try {
      switch (targetStatus) {
        case ProductStatus.INITIALIZING:
          product.status = ProductStatus.INITIALIZING;
          await product.onInitialize(ctx);
          break;

        case ProductStatus.ACTIVE:
          if (product.status === ProductStatus.INACTIVE) {
            product.status = ProductStatus.INITIALIZING;
            await product.onInitialize(ctx);
          }
          product.status = ProductStatus.ACTIVE;
          await product.onStart(ctx);
          // Sync with global system states
          ProductStateManager.syncWithSystemOS(id);
          break;

        case ProductStatus.PAUSED:
          if (product.status !== ProductStatus.ACTIVE) {
            throw new Error(`Cannot pause a product that is in state ${product.status}`);
          }
          product.status = ProductStatus.PAUSED;
          await product.onPause(ctx);
          break;

        case ProductStatus.TERMINATED:
          product.status = ProductStatus.TERMINATED;
          await product.onStop(ctx);
          ProductStateManager.clearSandbox(id);
          break;

        case ProductStatus.INACTIVE:
          product.status = ProductStatus.INACTIVE;
          break;

        default:
          throw new Error(`Unsupported lifecycle status: ${targetStatus}`);
      }

      ProductAuditLogger.log(
        id,
        'INFO',
        `Successfully transitioned from ${currentStatus} to ${product.status}.`,
        'LIFECYCLE_TRANSITION_SUCCESS'
      );
      
      // Dispatch product event
      ProductEventBroker.publish({
        eventId: `evt_lifecycle_${Date.now()}`,
        type: 'PRODUCT_LIFECYCLE_CHANGED',
        source: id,
        payload: { previous: currentStatus, current: product.status },
        timestamp: Date.now(),
        traceId: ctx.sessionId
      });

      return true;
    } catch (err: any) {
      product.status = ProductStatus.PAUSED; // Fallback status
      ProductAuditLogger.log(
        id,
        'ERROR',
        `Lifecycle transition failed: ${err.message}`,
        'LIFECYCLE_TRANSITION_FAILED',
        ctx.sessionId
      );
      
      // Trigger diagnostics automatically on failure
      await ProductDiagnosticsEngine.diagnoseFailure(id, {
        message: err.message,
        stack: err.stack,
        code: 'LIFECYCLE_FAILURE'
      }, product.config.sharedEngines);

      return false;
    }
  }
}

// ============================================================================
// 5. PRODUCT CONTROLLER (Pillar 2)
// ============================================================================

export class ProductController {
  private static activeProduct: ProductIdentity | null = null;
  private static activeSessionId: string = `sess_${Date.now()}`;

  public static async activateProduct(
    id: ProductIdentity,
    userId: string,
    tier: SubscriptionTier = 'Free'
  ): Promise<boolean> {
    // 1. Permissions Check
    const isAuthorized = ProductPermissionsManager.hasAccess(id, tier);
    if (!isAuthorized) {
      ProductAuditLogger.log(
        id,
        'SECURITY',
        `User ${userId} with tier ${tier} denied access to ${id}.`,
        'AUTH_DENIED'
      );
      return false;
    }

    const ctx: ProductLifecycleContext = {
      userId,
      timestamp: Date.now(),
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
      sessionId: this.activeSessionId
    };

    // 2. Stop current active product if running
    if (this.activeProduct && this.activeProduct !== id) {
      await ProductLifecycleManager.transitionTo(this.activeProduct, ProductStatus.TERMINATED, ctx);
    }

    // 3. Start new target product
    const success = await ProductLifecycleManager.transitionTo(id, ProductStatus.ACTIVE, ctx);
    if (success) {
      this.activeProduct = id;
      ProductRoutingEngine.routeTo(id, 'INDEX');
      ProductAnalyticsTracker.trackUserEntry(id, userId);
      return true;
    }

    return false;
  }

  public static getActiveProduct(): ProductIdentity | null {
    return this.activeProduct;
  }

  public static getSessionId(): string {
    return this.activeSessionId;
  }
}

// ============================================================================
// 6. PRODUCT CONFIGURATION (Pillar 4)
// ============================================================================

export class ProductConfigurationManager {
  private static configs = new Map<ProductIdentity, ProductConfig>([
    [
      ProductIdentity.HOME_GENERATE,
      {
        requiredTier: 'FREE',
        rateLimitPerMin: 15,
        latencyBudgetMs: 3000,
        supportedViews: ['INDEX', 'GENERATOR', 'HISTORY'],
        sharedEngines: ['FaceEngine', 'BodyEngine', 'PoseEngine', 'FashionKnowledgeGraphEngine']
      }
    ],
    [
      ProductIdentity.AI_CREATIONS,
      {
        requiredTier: 'PRO',
        rateLimitPerMin: 30,
        latencyBudgetMs: 5000,
        supportedViews: ['INDEX', 'ATELIER', 'GALLERY'],
        sharedEngines: ['FaceEngine', 'AIGenerationEngine', 'FashionKnowledgeGraphEngine', 'EnterpriseWorkflowEngine']
      }
    ],
    [
      ProductIdentity.COMMUNITY,
      {
        requiredTier: 'FREE',
        rateLimitPerMin: 60,
        latencyBudgetMs: 1500,
        supportedViews: ['FEED', 'DISCOVER', 'CREATOR_PROFILE'],
        sharedEngines: ['PersonalFashionMemoryEngine', 'VisionIntelligenceEngine']
      }
    ],
    [
      ProductIdentity.MARKETPLACE,
      {
        requiredTier: 'GUEST',
        rateLimitPerMin: 100,
        latencyBudgetMs: 1000,
        supportedViews: ['CATALOG', 'PRODUCT_DETAIL', 'SELLER_DASHBOARD'],
        sharedEngines: ['MarketplaceMatchingEngine', 'DecisionIntelligenceEngine']
      }
    ],
    [
      ProductIdentity.FACE_AI,
      {
        requiredTier: 'ENTERPRISE',
        rateLimitPerMin: 10,
        latencyBudgetMs: 4000,
        supportedViews: ['FACE_SCAN', 'BODY_SCAN', 'TRY_ON_PREVIEW'],
        sharedEngines: ['FaceEngine', 'BodyEngine', 'PoseEngine', 'VisionIntelligenceEngine']
      }
    ]
  ]);

  public static getConfig(id: ProductIdentity): ProductConfig {
    const config = this.configs.get(id);
    if (!config) {
      throw new Error(`No configuration registered for Product ID: ${id}`);
    }
    return config;
  }

  public static updateConfig(id: ProductIdentity, patch: Partial<ProductConfig>): void {
    const existing = this.getConfig(id);
    this.configs.set(id, { ...existing, ...patch });
    ProductAuditLogger.log(id, 'INFO', `Config updated: ${JSON.stringify(patch)}`, 'CONFIG_UPDATE');
  }
}

// ============================================================================
// 7. PRODUCT PERMISSIONS (Pillar 5)
// ============================================================================

export class ProductPermissionsManager {
  private static tierHierarchy: Record<string, number> = {
    GUEST: 0,
    FREE: 1,
    PRO: 2,
    ENTERPRISE: 3
  };

  private static userTierMapping: Record<SubscriptionTier, 'GUEST' | 'FREE' | 'PRO' | 'ENTERPRISE'> = {
    'Free': 'FREE',
    'Pro': 'PRO',
    'Studio': 'ENTERPRISE'
  };

  public static hasAccess(id: ProductIdentity, userTier: SubscriptionTier): boolean {
    const config = ProductConfigurationManager.getConfig(id);
    const requiredLevelName = config.requiredTier;
    const userLevelName = this.userTierMapping[userTier] || 'FREE';

    const requiredLevel = this.tierHierarchy[requiredLevelName] ?? 1;
    const userLevel = this.tierHierarchy[userLevelName] ?? 1;

    return userLevel >= requiredLevel;
  }
}

// ============================================================================
// 8. PRODUCT ROUTING (Pillar 6)
// ============================================================================

export class ProductRoutingEngine {
  private static activeRoutes = new Map<ProductIdentity, string>();

  public static routeTo(productId: ProductIdentity, view: string): void {
    const config = ProductConfigurationManager.getConfig(productId);
    if (!config.supportedViews.includes(view) && view !== 'INDEX') {
      throw new Error(`View [${view}] is not supported by product [${productId}]`);
    }

    const previousRoute = this.activeRoutes.get(productId) || 'NONE';
    this.activeRoutes.set(productId, view);

    ProductAuditLogger.log(
      productId,
      'INFO',
      `Navigated view from [${previousRoute}] to [${view}]`,
      'ROUTE_CHANGE'
    );

    ProductEventBroker.publish({
      eventId: `evt_route_${Date.now()}`,
      type: 'PRODUCT_ROUTE_CHANGED',
      source: productId,
      payload: { previousRoute, activeRoute: view },
      timestamp: Date.now(),
      traceId: ProductController.getSessionId()
    });
  }

  public static getActiveView(productId: ProductIdentity): string {
    return this.activeRoutes.get(productId) || 'INDEX';
  }
}

// ============================================================================
// 9. PRODUCT STATE (Pillar 7)
// ============================================================================

export class ProductStateManager {
  private static productSandboxes = new Map<ProductIdentity, Map<string, any>>();

  public static getSandbox(id: ProductIdentity): Map<string, any> {
    let sandbox = this.productSandboxes.get(id);
    if (!sandbox) {
      sandbox = new Map<string, any>();
      this.productSandboxes.set(id, sandbox);
    }
    return sandbox;
  }

  public static set(id: ProductIdentity, key: string, value: any): void {
    const sandbox = this.getSandbox(id);
    sandbox.set(key, value);
  }

  public static get(id: ProductIdentity, key: string): any {
    const sandbox = this.getSandbox(id);
    return sandbox.get(key);
  }

  public static clearSandbox(id: ProductIdentity): void {
    this.productSandboxes.delete(id);
    ProductAuditLogger.log(id, 'INFO', `Cleared state sandbox memory.`, 'STATE_SANDBOX_CLEAR');
  }

  public static syncWithSystemOS(id: ProductIdentity): void {
    const systemState = UnifiedFashionOS.getState();
    const sandbox = this.getSandbox(id);
    
    // Sync current style profiles, memory structures or user configs to local sandbox
    if (systemState.unifiedStyleMemory) {
      sandbox.set('userPreferences', systemState.unifiedStyleMemory.user_preferences_vector);
      sandbox.set('wardrobeCount', systemState.unifiedStyleMemory.wardrobe_items.length);
    }
    ProductAuditLogger.log(id, 'INFO', `Synchronized sandboxed state with UnifiedFashionOS.`, 'STATE_OS_SYNC');
  }

  public static createSnapshot(id: ProductIdentity): Record<string, any> {
    const sandbox = this.getSandbox(id);
    const snapshot: Record<string, any> = {};
    sandbox.forEach((value, key) => {
      snapshot[key] = value;
    });
    return snapshot;
  }

  public static restoreSnapshot(id: ProductIdentity, snapshot: Record<string, any>): void {
    const sandbox = this.getSandbox(id);
    sandbox.clear();
    Object.keys(snapshot).forEach(key => {
      sandbox.set(key, snapshot[key]);
    });
    ProductAuditLogger.log(id, 'INFO', `Restored state sandbox from snapshot.`, 'STATE_RESTORE');
  }
}

// ============================================================================
// 10. PRODUCT ANALYTICS (Pillar 8)
// ============================================================================

export class ProductAnalyticsTracker {
  private static userEntriesCount = new Map<ProductIdentity, number>();
  private static operationsCount = new Map<ProductIdentity, number>();

  public static trackUserEntry(productId: ProductIdentity, userId: string): void {
    const current = this.userEntriesCount.get(productId) || 0;
    this.userEntriesCount.set(productId, current + 1);

    AnalyticsEngine.track('planner_used', {
      action: 'product_entry',
      productId,
      userId,
      timestamp: Date.now()
    });
  }

  public static trackOperation(productId: ProductIdentity, operation: string, metadata: any = {}): void {
    const current = this.operationsCount.get(productId) || 0;
    this.operationsCount.set(productId, current + 1);

    AnalyticsEngine.track('planner_used', {
      action: `product_op_${operation}`,
      productId,
      ...metadata,
      timestamp: Date.now()
    });

    // Notify telemetry on operation
    ProductTelemetrySystem.recordMetric({
      productId,
      operation,
      latencyMs: metadata.duration || 100,
      cpuUsagePct: Math.floor(Math.random() * 15) + 5, // Simulated real-time performance indexing
      memoryMb: Math.floor(Math.random() * 20) + 40,
      timestamp: Date.now(),
      success: metadata.success !== false
    });
  }

  public static getAnalyticsSummary(productId: ProductIdentity): { entries: number; operations: number } {
    return {
      entries: this.userEntriesCount.get(productId) || 0,
      operations: this.operationsCount.get(productId) || 0
    };
  }
}

// ============================================================================
// 11. PRODUCT HEALTH (Pillar 9)
// ============================================================================

export class ProductHealthMonitor {
  private static activeIncidents = new Map<ProductIdentity, string[]>();
  private static errorCounts = new Map<ProductIdentity, number>();
  private static successfulOps = new Map<ProductIdentity, number>();

  public static logError(productId: ProductIdentity, errorCode: string): void {
    const errCount = this.errorCounts.get(productId) || 0;
    this.errorCounts.set(productId, errCount + 1);
  }

  public static logSuccess(productId: ProductIdentity): void {
    const successCount = this.successfulOps.get(productId) || 0;
    this.successfulOps.set(productId, successCount + 1);
  }

  public static addIncident(productId: ProductIdentity, issue: string): void {
    const incidents = this.activeIncidents.get(productId) || [];
    if (!incidents.includes(issue)) {
      incidents.push(issue);
      this.activeIncidents.set(productId, incidents);
    }
  }

  public static resolveIncident(productId: ProductIdentity, issue: string): void {
    const incidents = this.activeIncidents.get(productId) || [];
    const index = incidents.indexOf(issue);
    if (index > -1) {
      incidents.splice(index, 1);
      this.activeIncidents.set(productId, incidents);
    }
  }

  public static getHealthReport(productId: ProductIdentity): ProductHealthReport {
    const errorCount = this.errorCounts.get(productId) || 0;
    const successCount = this.successfulOps.get(productId) || 0;
    const totalOps = errorCount + successCount;

    let errorRatePct = 0;
    if (totalOps > 0) {
      errorRatePct = parseFloat(((errorCount / totalOps) * 100).toFixed(2));
    }

    const incidents = this.activeIncidents.get(productId) || [];
    const activeIncidentsCount = incidents.length;

    // Calculate score
    let healthScore = 100;
    healthScore -= errorRatePct * 2; // Deduct score based on error rate
    healthScore -= activeIncidentsCount * 15; // Major deductions for active system outages/incidents
    healthScore = Math.max(0, Math.min(100, Math.round(healthScore)));

    let status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL' = 'HEALTHY';
    if (healthScore < 50 || activeIncidentsCount >= 3) {
      status = 'CRITICAL';
    } else if (healthScore < 85 || activeIncidentsCount > 0) {
      status = 'DEGRADED';
    }

    return {
      productId,
      status,
      healthScore,
      uptimePct: totalOps === 0 ? 100 : parseFloat(((successCount / totalOps) * 100).toFixed(2)),
      errorRatePct,
      activeIncidentsCount,
      lastChecked: Date.now()
    };
  }
}

// ============================================================================
// 12. PRODUCT TELEMETRY (Pillar 10)
// ============================================================================

export class ProductTelemetrySystem {
  private static telemetryHistory: ProductTelemetryMetrics[] = [];
  private static readonly MAX_HISTORY = 1000;

  public static recordMetric(metric: ProductTelemetryMetrics): void {
    this.telemetryHistory.push(metric);
    if (this.telemetryHistory.length > this.MAX_HISTORY) {
      this.telemetryHistory.shift();
    }

    // Check budget violations
    const config = ProductConfigurationManager.getConfig(metric.productId);
    if (metric.latencyMs > config.latencyBudgetMs && metric.success) {
      ProductAuditLogger.log(
        metric.productId,
        'WARN',
        `Operation [${metric.operation}] exceeded latency budget: ${metric.latencyMs}ms > ${config.latencyBudgetMs}ms`,
        'TELEMETRY_LATENCY_VIOLATION'
      );
    }
  }

  public static getAverageLatency(productId: ProductIdentity, operation?: string): number {
    const filtered = this.telemetryHistory.filter(m => 
      m.productId === productId && (!operation || m.operation === operation)
    );
    if (filtered.length === 0) return 0;
    const sum = filtered.reduce((acc, curr) => acc + curr.latencyMs, 0);
    return parseFloat((sum / filtered.length).toFixed(1));
  }

  public static getTelemetryStream(productId: ProductIdentity): ProductTelemetryMetrics[] {
    return this.telemetryHistory.filter(m => m.productId === productId);
  }
}

// ============================================================================
// 13. PRODUCT DIAGNOSTICS (Pillar 11)
// ============================================================================

export class ProductDiagnosticsEngine {
  private static diagnosticTraces: ProductDiagnosticsTrace[] = [];

  public static async diagnoseFailure(
    productId: ProductIdentity,
    error: { message: string; stack?: string; code: string },
    involvedEngines: string[]
  ): Promise<ProductDiagnosticsTrace> {
    const traceId = `diag_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    
    // Log in error registry
    ErrorRegistry.registerError('PRODUCT_LAYER_EXCEPTION', error.message, 'critical', productId);
    
    // Increment health error counts
    ProductHealthMonitor.logError(productId, error.code);
    ProductHealthMonitor.addIncident(productId, `Exception in engine pipeline [${error.code}]: ${error.message}`);

    // Query enterprise observability for diagnosis
    const obsReport = EnterpriseObservabilityEngine.evaluateDiagnostics();
    const isEngineDegraded = obsReport && (obsReport.criticalErrorsCount > 0 || obsReport.engineStabilityIndex < 80);

    const summary = `Product layer failure occurred within [${productId}] on [${error.code}].`;
    let rootCause = `The operation failed with message: "${error.message}". `;
    let action = "Check network availability and clear browser storage. Then retry.";

    if (isEngineDegraded) {
      rootCause += "System-level engine degradations were observed inside underlying microservices.";
      action = "Initiating system re-synchronization. Please wait a moment for fallback services to launch.";
    } else {
      rootCause += "No global engine issues detected. It appears to be localized within the components pipeline.";
    }

    const trace: ProductDiagnosticsTrace = {
      traceId,
      productId,
      errorDetails: error,
      involvedEngines,
      diagnosticsSummary: summary,
      rootCauseAnalysis: rootCause,
      recommendedAction: action,
      timestamp: Date.now()
    };

    this.diagnosticTraces.unshift(trace);
    
    ProductAuditLogger.log(
      productId,
      'ERROR',
      `Diagnosed Root Cause: ${rootCause} Recommended Action: ${action}`,
      'DIAGNOSTIC_TRACE_GEN',
      traceId
    );

    return trace;
  }

  public static getDiagnosticHistory(productId?: ProductIdentity): ProductDiagnosticsTrace[] {
    if (productId) {
      return this.diagnosticTraces.filter(t => t.productId === productId);
    }
    return this.diagnosticTraces;
  }
}

// ============================================================================
// 14. PRODUCT EVENTS (Pillar 12)
// ============================================================================

type ProductEventListener = (evt: ProductEvent) => void;

export class ProductEventBroker {
  private static listeners = new Map<string, Set<ProductEventListener>>();

  public static subscribe(eventType: string, listener: ProductEventListener): () => void {
    let bucket = this.listeners.get(eventType);
    if (!bucket) {
      bucket = new Set<ProductEventListener>();
      this.listeners.set(eventType, bucket);
    }
    bucket.add(listener);

    return () => {
      const b = this.listeners.get(eventType);
      if (b) {
        b.delete(listener);
      }
    };
  }

  public static publish(event: ProductEvent): void {
    const bucket = this.listeners.get(event.type);
    if (bucket) {
      bucket.forEach(listener => {
        try {
          listener(event);
        } catch (err: any) {
          console.error(`Error in event listener for ${event.type}:`, err);
        }
      });
    }

    // Also distribute to the wildcard listeners
    const wildcardBucket = this.listeners.get('*');
    if (wildcardBucket) {
      wildcardBucket.forEach(listener => {
        try {
          listener(event);
        } catch (err) {
          console.error(`Error in wildcard event listener:`, err);
        }
      });
    }
  }
}

// ============================================================================
// 15. PRODUCT LOGGING (Pillar 13)
// ============================================================================

export interface StructuredAuditLog {
  productId: ProductIdentity;
  severity: 'INFO' | 'WARN' | 'ERROR' | 'SECURITY';
  message: string;
  category: string;
  traceId?: string;
  timestamp: string;
}

export class ProductAuditLogger {
  private static auditLogs: StructuredAuditLog[] = [];
  private static readonly MAX_LOG_SIZE = 500;

  public static log(
    productId: ProductIdentity,
    severity: 'INFO' | 'WARN' | 'ERROR' | 'SECURITY',
    message: string,
    category: string,
    traceId?: string
  ): void {
    const logEntry: StructuredAuditLog = {
      productId,
      severity,
      message,
      category,
      traceId,
      timestamp: new Date().toISOString()
    };

    this.auditLogs.push(logEntry);
    if (this.auditLogs.length > this.MAX_LOG_SIZE) {
      this.auditLogs.shift();
    }

    // Format console output to match lookvision / AI Style Hub aesthetic guidelines
    const consoleColor = 
      severity === 'ERROR' ? '\x1b[31m' :
      severity === 'SECURITY' ? '\x1b[35m' :
      severity === 'WARN' ? '\x1b[33m' : '\x1b[32m';

    console.log(
      `[${logEntry.timestamp}] [${consoleColor}${severity}\x1b[0m] [${productId}] [${category}]: ${message}`
    );
  }

  public static getLogs(productId?: ProductIdentity): StructuredAuditLog[] {
    if (productId) {
      return this.auditLogs.filter(l => l.productId === productId);
    }
    return this.auditLogs;
  }
}

// ============================================================================
// 16. PRODUCT MEMORY BRIDGE (Pillar 14)
// ============================================================================

export class ProductMemoryBridge {
  /**
   * Fetches the contextual memory of a user tailored to the current product's view.
   */
  public static async fetchProductMemoryContext(
    productId: ProductIdentity,
    userId: string
  ): Promise<{ styleProfile: any; knownVibes: string[]; reasoningNodes: string[] }> {
    // 1. Query PersonalFashionMemoryEngine
    const personalMemory = PersonalFashionMemoryEngine.getMemory(userId);
    const styleProfile = {
      preferredCategories: personalMemory?.favGarmentTypes || [],
      favoriteColors: personalMemory?.favColors || []
    };

    // 2. Query Knowledge Graph Engine
    const graphStats = FashionKnowledgeGraphEngine.getStats();
    
    // Combine knowledge and construct a localized profile for the product view
    const knownVibes = styleProfile.preferredCategories;
    const reasoningNodes = [
      `NodeCount: ${graphStats.nodeCount}`,
      `EdgeCount: ${graphStats.relationshipCount}`,
      `CentralTheme: ${graphStats.categories[0] || 'Minimalist Elegance'}`
    ];

    ProductAuditLogger.log(
      productId,
      'INFO',
      `Loaded structured Memory context containing ${knownVibes.length} category bounds and graph dimensions.`,
      'MEM_BRIDGE_FETCH'
    );

    return {
      styleProfile,
      knownVibes,
      reasoningNodes
    };
  }

  /**
   * Commits localized user choice back into the unified Knowledge Graph.
   */
  public static commitProductDecisionToGraph(
    productId: ProductIdentity,
    userId: string,
    styleVibe: string,
    actionType: 'liked' | 'worn' | 'created'
  ): void {
    // Evolve preferences using the learning engine
    EnterpriseLearningEngine.processInteractionFeedback(
      userId,
      actionType === 'liked' ? 'accepted' : 'rejected',
      []
    );

    ProductAuditLogger.log(
      productId,
      'INFO',
      `Committed preferences update based on interaction: ${actionType} with vibe: ${styleVibe}`,
      'MEM_BRIDGE_COMMIT'
    );
  }
}

// ============================================================================
// 17. PRE-REGISTER THE CURRENT SYSTEM PRODUCTS
// ============================================================================

class HomeGenerateProductModule implements IProduct {
  id = ProductIdentity.HOME_GENERATE;
  name = 'Home Generator & Try-On';
  description = 'Real-time personalized avatar rendering and synthetic runway inspirations.';
  version = '1.2.0';
  config = ProductConfigurationManager.getConfig(this.id);
  status = ProductStatus.INACTIVE;

  async onInitialize(ctx: ProductLifecycleContext): Promise<void> {
    ProductStateManager.set(this.id, 'initializedAt', ctx.timestamp);
    ProductHealthMonitor.logSuccess(this.id);
  }

  async onStart(ctx: ProductLifecycleContext): Promise<void> {
    ProductStateManager.set(this.id, 'activeSession', ctx.sessionId);
    ProductHealthMonitor.logSuccess(this.id);
  }

  async onPause(ctx: ProductLifecycleContext): Promise<void> {
    ProductHealthMonitor.logSuccess(this.id);
  }

  async onStop(ctx: ProductLifecycleContext): Promise<void> {
    ProductHealthMonitor.logSuccess(this.id);
  }
}

class AICreationsProductModule implements IProduct {
  id = ProductIdentity.AI_CREATIONS;
  name = 'AI Creations Studio';
  description = 'High-concept virtual modeling, synthetic fashion drapery, and artwork editor.';
  version = '2.1.4';
  config = ProductConfigurationManager.getConfig(this.id);
  status = ProductStatus.INACTIVE;

  async onInitialize(ctx: ProductLifecycleContext): Promise<void> {
    ProductStateManager.set(this.id, 'initializedAt', ctx.timestamp);
    ProductHealthMonitor.logSuccess(this.id);
  }

  async onStart(ctx: ProductLifecycleContext): Promise<void> {
    ProductStateManager.set(this.id, 'activeSession', ctx.sessionId);
    ProductHealthMonitor.logSuccess(this.id);
  }

  async onPause(ctx: ProductLifecycleContext): Promise<void> {
    ProductHealthMonitor.logSuccess(this.id);
  }

  async onStop(ctx: ProductLifecycleContext): Promise<void> {
    ProductHealthMonitor.logSuccess(this.id);
  }
}

class CommunityProductModule implements IProduct {
  id = ProductIdentity.COMMUNITY;
  name = 'Community Fashion Stream';
  description = 'The decentralized fashion social layers for sharing user-approved style works.';
  version = '1.0.8';
  config = ProductConfigurationManager.getConfig(this.id);
  status = ProductStatus.INACTIVE;

  async onInitialize(ctx: ProductLifecycleContext): Promise<void> {
    ProductStateManager.set(this.id, 'initializedAt', ctx.timestamp);
    ProductHealthMonitor.logSuccess(this.id);
  }

  async onStart(ctx: ProductLifecycleContext): Promise<void> {
    ProductStateManager.set(this.id, 'activeSession', ctx.sessionId);
    ProductHealthMonitor.logSuccess(this.id);
  }

  async onPause(ctx: ProductLifecycleContext): Promise<void> {
    ProductHealthMonitor.logSuccess(this.id);
  }

  async onStop(ctx: ProductLifecycleContext): Promise<void> {
    ProductHealthMonitor.logSuccess(this.id);
  }
}

class MarketplaceProductModule implements IProduct {
  id = ProductIdentity.MARKETPLACE;
  name = 'Fashion Marketplace';
  description = 'E-commerce directory linking virtual aesthetic blueprints with physical clothing alternatives.';
  version = '1.5.0';
  config = ProductConfigurationManager.getConfig(this.id);
  status = ProductStatus.INACTIVE;

  async onInitialize(ctx: ProductLifecycleContext): Promise<void> {
    ProductStateManager.set(this.id, 'initializedAt', ctx.timestamp);
    ProductHealthMonitor.logSuccess(this.id);
  }

  async onStart(ctx: ProductLifecycleContext): Promise<void> {
    ProductStateManager.set(this.id, 'activeSession', ctx.sessionId);
    ProductHealthMonitor.logSuccess(this.id);
  }

  async onPause(ctx: ProductLifecycleContext): Promise<void> {
    ProductHealthMonitor.logSuccess(this.id);
  }

  async onStop(ctx: ProductLifecycleContext): Promise<void> {
    ProductHealthMonitor.logSuccess(this.id);
  }
}

class FaceAIProductModule implements IProduct {
  id = ProductIdentity.FACE_AI;
  name = 'Face AI & Real Body Scan';
  description = 'Professional anthropometric body shape diagnostics and 3D facial mesh modeling.';
  version = '3.0.0';
  config = ProductConfigurationManager.getConfig(this.id);
  status = ProductStatus.INACTIVE;

  async onInitialize(ctx: ProductLifecycleContext): Promise<void> {
    ProductStateManager.set(this.id, 'initializedAt', ctx.timestamp);
    ProductHealthMonitor.logSuccess(this.id);
  }

  async onStart(ctx: ProductLifecycleContext): Promise<void> {
    ProductStateManager.set(this.id, 'activeSession', ctx.sessionId);
    ProductHealthMonitor.logSuccess(this.id);
  }

  async onPause(ctx: ProductLifecycleContext): Promise<void> {
    ProductHealthMonitor.logSuccess(this.id);
  }

  async onStop(ctx: ProductLifecycleContext): Promise<void> {
    ProductHealthMonitor.logSuccess(this.id);
  }
}

// Auto-register core components
ProductRegistry.registerProduct(new HomeGenerateProductModule());
ProductRegistry.registerProduct(new AICreationsProductModule());
ProductRegistry.registerProduct(new CommunityProductModule());
ProductRegistry.registerProduct(new MarketplaceProductModule());
ProductRegistry.registerProduct(new FaceAIProductModule());
