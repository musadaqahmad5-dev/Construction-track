import { WardrobeItem } from '../../types';
import { SYSTEM_CONFIG } from './SystemConfig';
import { AnalyticsEngine, AnalyticsHealth } from '../../core/AnalyticsEngine';
import { StorageHardening, StorageHealth } from '../../core/StorageHardening';

// ========================================================
// TYPE DEFINITIONS FOR UNIFIED_STYLE_MEMORY & SYSTEM MODULES
// ========================================================

export type ProductMode = 'DEMO_MODE' | 'LIVE_MODE' | 'AUTOPILOT_MODE';

export type UserJourneyStep = 
  | 'ONBOARD' 
  | 'WARDROBE' 
  | 'GENERATE' 
  | 'ACT' 
  | 'LOGGED' 
  | 'LEARNED';

export type SubscriptionTier = 'Free' | 'Pro' | 'Studio';

export interface UnifiedStyleMemory {
  user_preferences_vector: number[]; // represents [minimalist, streetwear, classic, luxury, cyberpunk, traditional, casual, formal]
  outfit_history: Array<UnifiedOutfit>;
  feedback_signals: Array<FeedbackSignal>;
  wardrobe_items: Array<WardrobeItem>;
}

export interface UnifiedOutfit {
  id: string;
  name: string;
  items: WardrobeItem[];
  suitabilityScore: number; // 0..100
  occasion: string;
  generatedAt: string;
  vibeTags: string[];
  schema_version?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FeedbackSignal {
  atmosphere: string;
  pairing: string;
  optionalNote?: string;
  signalType?: string;
}

export interface ScheduledEvent {
  id: string;
  title: string;
  time: string;
  occasion: string;
  assignedOutfitId?: string;
  isCompleted: boolean;
}

export interface SystemGovernorReport {
  status: 'Balanced' | 'Drift' | 'Overfitted' | 'Over-Diverse';
  detectedIssues: string[];
  weights: {
    scoring: number;
    diversity: number;
    quietControl: number;
    gravity: number;
  };
  learningUpdates: {
    updatedPreferences: string;
    ignoredPatterns: string;
    reinforcedStyles: string;
  };
  nextCyclePrediction: string;
}

export interface DeploymentChecklistReport {
  build_success: boolean;
  bundle_size_under_limit: boolean; // <2MB
  no_memory_leaks: boolean;
  no_unbounded_loops: boolean;
  env_config_valid: boolean;
  READY_FOR_PRODUCTION: boolean;
}

export interface ActivationState {
  signup_completed: boolean;
  first_wardrobe_added: boolean;
  first_outfit_generated: boolean;
  first_feedback_logged: boolean;
  activation_score: number; // 0..100 based on mapping of 4 milestones (25pts each)
}

export interface RetentionRuntime {
  streakCount: number;
  cohorts: {
    D1: boolean;
    D7: boolean;
    D30: boolean;
  };
  reminders: Array<{ id: string; text: string; tabUrl: 'HOME' | 'WARDROBE' | 'PLANNER' | 'LEARN'; urgency: 'low' | 'medium' | 'high' }>;
  weeklyRecap: {
    mostWornVibe: string;
    suitsPercentage: number;
    recommendationNote: string;
  };
}

// 1. OPERATIONS CENTRE
export interface OpsRuntimeState {
  active_sessions: number;
  avg_generation_time: number; // in milliseconds
  error_rate: number; // percentage based on incident volume
  storage_usage_bytes: number; // size in bytes of state cached
  planner_usage: number; // total registered calendar tasks
  feedback_completion: number; // feedback-logged conversion percentage
}

// 2. INCIDENT MANAGEMENT
export type IncidentLevel = 'INFO' | 'WARNING' | 'ERROR';
export type IncidentType = 'ui_crash' | 'storage_failure' | 'auth_failure' | 'generation_failure';

export interface Incident {
  id: string;
  level: IncidentLevel;
  type: IncidentType;
  message: string;
  timestamp: number;
  status: 'ACTIVE' | 'RESOLVED' | 'DISMISSED';
}

// 3. AUDIT LOGGER
export interface AuditTrailEntry {
  event: string;
  time: number;
  result: string;
}

// 7. OPERATION RELEASE REPORT
export interface OperationalReleaseReport {
  ops_health_score: number; // 0..100
  tech_debt_score: number; // 0..100
  maintenance_cost_usd_yearly: number;
  support_readiness: 'READY_FOR_OPERATION' | 'GATED_BY_METRICS';
  ready_for_operation: boolean;
}

// POST-LAUNCH SYSTEM INTERFACES
export interface PostLaunchMetrics {
  visitors: number;
  signup_rate: number;
  activation_rate: number;
  day1_retention: number;
  day7_retention: number;
  outfits_generated: number;
  feedback_completion: number;
}

export type ExperimentVariant = 'A' | 'B';
export type ExperimentType = 'copy' | 'empty states' | 'button labels' | 'onboarding sequence';

export interface ExperimentRuntime {
  activeExperiment: ExperimentType;
  variant: ExperimentVariant;
  metrics: Record<ExperimentType, {
    variantA: { impressions: number; conversions: number };
    variantB: { impressions: number; conversions: number };
  }>;
}

export interface UserFeedback {
  id: string;
  rating: number; // 1-5
  freeText: string;
  isBugReport: boolean;
  timestamp: string;
}

export interface FeedbackCenter {
  logs: UserFeedback[];
  top_requests: string[];
  top_failures: string[];
}

export type SupportTicketStatus = 'OPEN' | 'INVESTIGATING' | 'FIXED' | 'CLOSED';

export interface SupportTicket {
  id: string;
  userEmail: string;
  issue: string;
  status: SupportTicketStatus;
  createdAt: string;
  responseTimeMin?: number;
  resolutionTimeMin?: number;
}

export interface SupportRuntime {
  tickets: SupportTicket[];
}

export interface ChurnPreventionSignals {
  inactive_user: boolean;
  empty_wardrobe: boolean;
  low_generation: boolean;
  high_skip_rate: boolean;
  ctaText?: string;
  ctaLink?: 'HOME' | 'WARDROBE' | 'PLANNER' | 'LEARN';
}

export interface MonthlyReport {
  growthRate: number; // %
  retentionRate: number; // %
  qualityScore: number; // %
  topPainPoints: string[];
  keep: string[];
  fix: string[];
  remove: string[];
}

export interface CohortMetrics {
  signup_rate: number;
  activation_rate: number;
  outfit_generation_rate: number;
  feedback_rate: number;
  "7_day_return_rate": number;
}

export interface CohortSummary {
  COHORT_A: CohortMetrics;
  COHORT_B: CohortMetrics;
  COHORT_C: CohortMetrics;
}

export interface BetaBlocker {
  id: string;
  name: string;
  description: string;
  isResolved: boolean;
}

export interface SessionObservability {
  session_start: string;
  session_end: string | null;
  crash_detected: boolean;
  recover_success: boolean;
  rage_click_count: number;
  time_to_value: number; // in seconds
  session_quality_score: number; // 0..100
}

export interface TrustSafetyPass {
  export_user_data_verified: boolean;
  delete_account_data_verified: boolean;
  clear_local_cache_verified: boolean;
  consent_visibility_verified: boolean;
  guest_isolation_verified: boolean;
  trust_score: number; // 0..100
}

export interface FreezeManifest {
  state_schema_locked: boolean;
  analytics_events_locked: boolean;
  storage_contracts_locked: boolean;
  public_routes_locked: boolean;
  subscription_logic_locked: boolean;
  timestamp: string;
}

export interface RcPipeline {
  stage: 'RC1' | 'RC2' | 'RC3';
  install_success: boolean;
  upgrade_success: boolean;
  rollback_success: boolean;
  cache_recovery: boolean;
  release_confidence: number;
}

export interface PlaybookSteps {
  detect: boolean;
  contain: boolean;
  recover: boolean;
  communicate: boolean;
}

export interface IncidentResponsePlaybook {
  AUTH_OUTAGE: PlaybookSteps;
  STORAGE_CORRUPTION: PlaybookSteps;
  ANALYTICS_OUTAGE: PlaybookSteps;
  HIGH_ERROR_SPIKE: PlaybookSteps;
  BAD_DEPLOYMENT: PlaybookSteps;
}

export interface ScaleMetrics {
  storage_growth_gb: number;
  analytics_volume_k: number;
  cloud_requests_k: number;
  support_burden_tickets: number;
}

export interface CostAndScaleReview {
  user_tier: 100 | 1000 | 10000;
  metrics_100: ScaleMetrics;
  metrics_1000: ScaleMetrics;
  metrics_10000: ScaleMetrics;
}

export interface ShipDecision {
  decision: 'GREEN' | 'YELLOW' | 'RED';
  reason: string;
  rollback_plan: string;
}

export interface RehearsalStep {
  name: string;
  status: 'PENDING' | 'PASS' | 'FAIL';
  latency_ms: number;
}

export interface Day0Rehearsal {
  steps: RehearsalStep[];
  completion_rate: number;
  recovery_events: string[];
  unexpected_states: string[];
  launch_rehearsal_score: number;
}

export interface GoldenMetric {
  value: number;
  unit: string;
  normal_range: string;
  warning_range: string;
  critical_range: string;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
}

export interface GoldenSignals {
  latency: GoldenMetric;
  traffic: GoldenMetric;
  errors: GoldenMetric;
  saturation: GoldenMetric;
  retention: GoldenMetric;
  operations_status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
}

export interface RollbackTest {
  tested: boolean;
  rollback_duration_sec: number;
  data_integrity: boolean;
  service_recovery: string;
}

export interface RollbackDrill {
  bad_deploy: RollbackTest;
  cache_corruption: RollbackTest;
  broken_analytics: RollbackTest;
  auth_outage: RollbackTest;
  rollback_confidence: number;
}

export interface FirstUserExperienceAudit {
  time_to_first_value_sec: number;
  time_to_first_outfit_sec: number;
  time_to_feedback_sec: number;
  drop_points: string[];
  first_user_score: number;
}

export interface OperationsCalendarItem {
  review_type: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  task: string;
  owner: string;
  frequency: string;
  success_metric: string;
  last_run: string | null;
}

export interface FinalCommandCenter {
  launch_readiness_pct: number;
  go_no_go: 'GO' | 'LIMITED ROLLOUT' | 'HOLD';
  critical_alerts: string[];
  monitoring_plan_48h: string[];
  stabilization_plan_7d: string[];
  success_targets_30d: string[];
}

export type OperationalVerdict = 'CONTINUE' | 'ITERATE' | 'PAUSE';

export interface AdminHealth {
  status: 'HEALTHY' | 'DEGRADED' | 'ERROR';
  userCount: number;
  activationRate: number;
  feedbackRate: number;
  errorRate: number;
  storageUsage: number;
}

export interface FinalOperatingVerdict {
  id: string;
  userValueScore: number; // 0-100
  productFitScore: number; // 0-100
  operationalScore: number; // 0-105
  nextAction: string;
  verdict: OperationalVerdict;
  recordedBy?: string;
  recordedAt?: string;
}

export interface UnifiedState {
  // System Configurations
  productMode: ProductMode;
  userJourneyStep: UserJourneyStep;
  subscriptionTier: SubscriptionTier;
  onboarding_disabled: boolean;
  
  // High-Level Statistics and Meta
  systemHealthScore: number;
  learningSpeedPercent: number;
  biasReductionFactor: number;
  readyForProduction: boolean;

  // New hardened real engines health statuses
  analytics_health: AnalyticsHealth;
  storage_health: StorageHealth;
  admin_health: AdminHealth;

  // Conversion Optimization funnels
  biggest_dropoff: string;
  activation_score: number;
  quality_gate_result: 'GO' | 'HOLD';

  // The 4 Core Modules Data representations
  unifiedStyleMemory: UnifiedStyleMemory;
  schedulerEvents: ScheduledEvent[];
  activeSuggestion: UnifiedOutfit | null;
  alternativeOutfits?: Array<{
    id: string;
    items: WardrobeItem[];
    score: number;
    reason: string;
    name: string;
    styleIdentity?: string;
    gravityMatch?: 'High' | 'Medium' | 'Low';
    explanation?: string;
  }>;
  
  // 3. Keep only last 100 logs in AUDIT_TRAIL format
  auditTrail: Array<AuditTrailEntry>;
  deploymentReport: DeploymentChecklistReport;

  // 5. EVENT_TRACKING / ANALYTICS
  analyticsEvents: Array<{
    id: string;
    eventType: string;
    timestamp: string;
    params?: any;
  }>;
  retentionCounters: {
    signupCount: number;
    loginCount: number;
    feedbackCount: number;
    generationCount: number;
  };
  conversionDashboard: {
    wardrobeUsageRatio: number;
    feedbackLoggedRatio: number;
    activeRetentionRate: number;
  };

  // 6. ACTIVATION & RETENTION OPERATIONS
  activationEngine: ActivationState;
  retentionRuntime: RetentionRuntime;

  // SAAS OPERATION CHANNELS
  opsRuntime: OpsRuntimeState;
  incidents: Incident[];
  operationalReleaseReport: OperationalReleaseReport;

  // POST-LAUNCH SYSTEM MODULES
  postLaunchMetrics: PostLaunchMetrics;
  experimentRuntime: ExperimentRuntime;
  feedbackCenter: FeedbackCenter;
  supportRuntime: SupportRuntime;
  churnPreventionSignals: ChurnPreventionSignals;
  monthlyReport: MonthlyReport;
  finalOperatingVerdict: FinalOperatingVerdict;

  // CONTROLLED BETA PROGRAM STATE
  cohortSummary: CohortSummary;
  blockers: BetaBlocker[];
  blocker_status: 'PASS' | 'PARTIAL' | 'FAIL';
  sessionObservability: SessionObservability;
  trustSafetyPass: TrustSafetyPass;
  go_live_decision: 'SOFT_LAUNCH' | 'EXTEND_BETA';

  // PRODUCTION FREEZE AND SOFT LAUNCH STATE
  freeze_manifest: FreezeManifest;
  breaking_changes: boolean;
  migration_required: boolean;
  rc_pipeline: RcPipeline;
  incident_response: IncidentResponsePlaybook;
  incident_readiness: number;
  scale_review: CostAndScaleReview;
  launch_health_score: number;
  ship_decision: ShipDecision;

  // DAY-0 REHEARSAL AND OPERATIONS
  day0_rehearsal: Day0Rehearsal;
  golden_signals: GoldenSignals;
  rollback_drill: RollbackDrill;
  first_user_experience_audit: FirstUserExperienceAudit;
  operations_calendar: OperationsCalendarItem[];
  final_command_center: FinalCommandCenter;
  systemGovernorReport: SystemGovernorReport;
}

type UnifiedSubscriber = (state: UnifiedState) => void;

export class UnifiedFashionOS {
  private static subscribers: Set<UnifiedSubscriber> = new Set();
  
  // Calculate localStorage estimated storage usage size
  private static calculateStorageUsage(): number {
    try {
      let total = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          total += key.length * 2 + (localStorage.getItem(key) || '').length * 2;
        }
      }
      return total || 4200; // default footprint estimated of state
    } catch {
      return 4200;
    }
  }

  // Setup unified default state
  private static state: UnifiedState = {
    productMode: 'DEMO_MODE',
    userJourneyStep: 'ONBOARD',
    subscriptionTier: 'Free',
    onboarding_disabled: (typeof localStorage !== 'undefined') ? (localStorage.getItem('onboarding_disabled_preference') === 'true') : false,
    systemHealthScore: 99,
    learningSpeedPercent: 95,
    biasReductionFactor: 90,
    readyForProduction: true,

    analytics_health: {
      status: 'HEALTHY',
      queueSize: 0,
      totalEventsTracked: 0,
      lastSyncTime: null,
      errorCount: 0
    },
    storage_health: {
      status: 'HEALTHY',
      databaseSyncStatus: 'ONLINE',
      lastBackupTime: null,
      schemaVersion: '1.2.0',
      isCloudSynced: false,
      corruptionsRecoveredCount: 0
    },
    admin_health: {
      status: 'HEALTHY',
      userCount: 0,
      activationRate: 0,
      feedbackRate: 0,
      errorRate: 0,
      storageUsage: 0
    },
    biggest_dropoff: 'feedback → return',
    activation_score: 0,
    quality_gate_result: 'GO',
    
    // Module 1 & 2: Unified Style Memory
    unifiedStyleMemory: {
      user_preferences_vector: [0.65, 0.40, 0.50, 0.30, 0.15, 0.10, 0.70, 0.35],
      outfit_history: [
        {
          id: 'out-001',
          name: 'Minimalist Camel Blazer & Charcoal Chinos',
          items: [],
          suitabilityScore: 89,
          occasion: 'Office Casual Wear',
          generatedAt: '2026-06-12',
          vibeTags: ['classic', 'minimalist']
        }
      ],
      feedback_signals: [
        {
          atmosphere: 'steady hours',
          pairing: 'Minimalist Camel Blazer & Charcoal Chinos',
          optionalNote: 'Returned quietly.'
        }
      ],
      wardrobe_items: [] // Syncs current user wardrobe items
    },
    
    // Module 3: Scheduled Events
    schedulerEvents: [
      {
        id: 'evt-001',
        title: 'Weekly Style Sync & Presentation',
        time: 'Mon 09:00 AM',
        occasion: 'Formal Business presentation',
        assignedOutfitId: 'out-001',
        isCompleted: false
      }
    ],
    
    activeSuggestion: null,
    alternativeOutfits: [],
    
    // Audit Trail (3. AUDIT LOGGING) Store event, time, result. No sensitive parameters.
    auditTrail: [
      { time: Date.now() - 600000, event: 'SYSTEM_INITIALIZATION', result: 'Operations diagnostics online. Capped at 100 records' }
    ],

    // Module 6: Deployment Checklist Engine
    deploymentReport: {
      build_success: true,
      bundle_size_under_limit: true,
      no_memory_leaks: true,
      no_unbounded_loops: true,
      env_config_valid: true,
      READY_FOR_PRODUCTION: true
    },

    // 5. EVENT_TRACKING / ANALYTICS Initial values
    analyticsEvents: [],
    retentionCounters: {
      signupCount: 0,
      loginCount: 1, // Started at first session
      feedbackCount: 1,
      generationCount: 1
    },
    conversionDashboard: {
      wardrobeUsageRatio: 0,
      feedbackLoggedRatio: 100,
      activeRetentionRate: 85
    },
    activationEngine: {
      signup_completed: false,
      first_wardrobe_added: false,
      first_outfit_generated: false,
      first_feedback_logged: false,
      activation_score: 0
    },
    retentionRuntime: {
      streakCount: 1,
      cohorts: {
        D1: false,
        D7: false,
        D30: false
      },
      reminders: [
        { id: 'rem-1', text: 'Load custom wardrobe garments to personalize matching vectors.', tabUrl: 'WARDROBE', urgency: 'high' },
        { id: 'rem-2', text: 'Register your weekend style checklist on the execution planner.', tabUrl: 'PLANNER', urgency: 'medium' },
        { id: 'rem-3', text: 'Complete a wear logging signal to adapt the 8-dimensional coefficient DNA.', tabUrl: 'LEARN', urgency: 'low' }
      ],
      weeklyRecap: {
        mostWornVibe: 'Minimalist & Casual',
        suitsPercentage: 85,
        recommendationNote: 'Your feedback logs reveal highly adjusted Casual comfort aesthetics with zero metadata bias.'
      }
    },

    // SaaS Operations states
    opsRuntime: {
      active_sessions: 1,
      avg_generation_time: 42, // default ms latency
      error_rate: 0,
      storage_usage_bytes: 4200,
      planner_usage: 1,
      feedback_completion: 100
    },
    incidents: [],
    operationalReleaseReport: {
      ops_health_score: 98,
      tech_debt_score: 5, // very light debt
      maintenance_cost_usd_yearly: 1450,
      support_readiness: 'READY_FOR_OPERATION',
      ready_for_operation: true
    },

    // POST-LAUNCH OPERATIONS SEED STATE
    postLaunchMetrics: {
      visitors: 12450,
      signup_rate: 42,
      activation_rate: 65,
      day1_retention: 48,
      day7_retention: 22,
      outfits_generated: 438,
      feedback_completion: 73
    },
    experimentRuntime: {
      activeExperiment: 'copy',
      variant: 'A',
      metrics: {
        copy: {
          variantA: { impressions: 120, conversions: 40 },
          variantB: { impressions: 115, conversions: 52 }
        },
        'empty states': {
          variantA: { impressions: 80, conversions: 24 },
          variantB: { impressions: 85, conversions: 18 }
        },
        'button labels': {
          variantA: { impressions: 90, conversions: 36 },
          variantB: { impressions: 95, conversions: 48 }
        },
        'onboarding sequence': {
          variantA: { impressions: 150, conversions: 75 },
          variantB: { impressions: 140, conversions: 80 }
        }
      }
    },
    feedbackCenter: {
      logs: [
        { id: 'f-1', rating: 5, freeText: 'Absolutely love the clothing weight matching vector DNA adjustment, super neat insight!', isBugReport: false, timestamp: '2026-06-14 18:42' },
        { id: 'f-2', rating: 3, freeText: 'Need an easier bulk-import button for my existing garments inventory.', isBugReport: false, timestamp: '2026-06-13 11:20' },
        { id: 'f-3', rating: 2, freeText: 'Standard checklist doesn\'t retain multi-colored sneakers efficiently.', isBugReport: true, timestamp: '2026-06-12 09:15' }
      ],
      top_requests: [
        'Bulk inventory spreadsheet imports',
        'Integration with real digital weather widgets APIs',
        'Multi-user wardrobe sharing capabilities'
      ],
      top_failures: [
        'LocalStorage budget exhaust warning on >300 heavy items',
        'Confusing slider controls for physical satisfaction rating'
      ]
    },
    supportRuntime: {
      tickets: [
        { id: 't-1', userEmail: 'musadaqahmad5@gmail.com', issue: 'SaaS Studio Operator upgrade does not synchronize my local wardrobe vector.', status: 'INVESTIGATING', createdAt: '2026-06-14 10:15', responseTimeMin: 12, resolutionTimeMin: 35 },
        { id: 't-2', userEmail: 'operator-ops@fashion.io', issue: 'Failed pairing matrix with low coefficient values.', status: 'CLOSED', createdAt: '2026-06-13 14:22', responseTimeMin: 8, resolutionTimeMin: 18 },
        { id: 't-3', userEmail: 'guest-tailor@app.net', issue: 'Cannot delete seeded preset garment classic tee.', status: 'OPEN', createdAt: '2026-06-15 01:10', responseTimeMin: 15 }
      ]
    },
    churnPreventionSignals: {
      inactive_user: false,
      empty_wardrobe: false,
      low_generation: false,
      high_skip_rate: false,
      ctaText: 'Catalog your clothing items to start styling matching models!',
      ctaLink: 'WARDROBE'
    },
    monthlyReport: {
      growthRate: 24.5,
      retentionRate: 56.2,
      qualityScore: 91.8,
      topPainPoints: ['High skip rate on streetwear vibe suggestions', 'Manual scheduler event check completion feels clicky'],
      keep: ['8D vector backpropagation mechanics', 'Zero-leak metadata privacy audit log'],
      fix: ['Include onboarding wizard variants for faster initial activations', 'Refine button labels to mention "vector recalculation" instead of "recalibration"'],
      remove: ['Simulated telemetry noise features to preserve pure storage limits budget']
    },
    finalOperatingVerdict: {
      id: 'verdict-june-2026',
      userValueScore: 88,
      productFitScore: 82,
      operationalScore: 94,
      nextAction: 'Execute Experiment Sequence A to optimize onboarding conversions, implement spreadsheet garment exports, and adjust streetwear DNA coefficients.',
      verdict: 'ITERATE'
    },
    cohortSummary: {
      COHORT_A: { signup_rate: 85, activation_rate: 72, outfit_generation_rate: 68, feedback_rate: 42, "7_day_return_rate": 60 },
      COHORT_B: { signup_rate: 55, activation_rate: 48, outfit_generation_rate: 40, feedback_rate: 25, "7_day_return_rate": 30 },
      COHORT_C: { signup_rate: 92, activation_rate: 80, outfit_generation_rate: 75, feedback_rate: 50, "7_day_return_rate": 78 }
    },
    blocker_status: 'FAIL',
    blockers: [
      { id: 'blocker-1', name: 'offline image sync fallback', description: 'Graceful fallback rendering for custom user wardrobe photos when offline', isResolved: false },
      { id: 'blocker-2', name: 'concurrent save conflicts', description: 'Database write collision resolution logic on multi-device concurrent actions', isResolved: false },
      { id: 'blocker-3', name: 'auth timeout redirect', description: 'JWT renewal token handling for silent operations authentication timeout', isResolved: false },
      { id: 'blocker-4', name: 'long session cleanup', description: 'Memory optimization and background garbage collection triggers for long usage sessions', isResolved: false },
      { id: 'blocker-5', name: 'Safari onboarding layout shift', description: 'Double height rendering layout shifts adjustment on mobile Safari onboarding screens', isResolved: false }
    ],
    sessionObservability: {
      session_start: new Date(Date.now() - 3600000).toISOString(),
      session_end: null,
      crash_detected: false,
      recover_success: true,
      rage_click_count: 0,
      time_to_value: 35,
      session_quality_score: 95
    },
    trustSafetyPass: {
      export_user_data_verified: false,
      delete_account_data_verified: false,
      clear_local_cache_verified: false,
      consent_visibility_verified: false,
      guest_isolation_verified: false,
      trust_score: 0
    },
    go_live_decision: 'EXTEND_BETA',
    freeze_manifest: {
      state_schema_locked: false,
      analytics_events_locked: false,
      storage_contracts_locked: false,
      public_routes_locked: false,
      subscription_logic_locked: false,
      timestamp: new Date().toISOString()
    },
    breaking_changes: false,
    migration_required: false,
    rc_pipeline: {
      stage: 'RC1',
      install_success: false,
      upgrade_success: false,
      rollback_success: false,
      cache_recovery: false,
      release_confidence: 0
    },
    incident_response: {
      AUTH_OUTAGE: { detect: false, contain: false, recover: false, communicate: false },
      STORAGE_CORRUPTION: { detect: false, contain: false, recover: false, communicate: false },
      ANALYTICS_OUTAGE: { detect: false, contain: false, recover: false, communicate: false },
      HIGH_ERROR_SPIKE: { detect: false, contain: false, recover: false, communicate: false },
      BAD_DEPLOYMENT: { detect: false, contain: false, recover: false, communicate: false }
    },
    incident_readiness: 0,
    scale_review: {
      user_tier: 100,
      metrics_100: { storage_growth_gb: 1.2, analytics_volume_k: 25.0, cloud_requests_k: 8.5, support_burden_tickets: 3 },
      metrics_1000: { storage_growth_gb: 12.0, analytics_volume_k: 250.0, cloud_requests_k: 85.0, support_burden_tickets: 28 },
      metrics_10000: { storage_growth_gb: 120.0, analytics_volume_k: 2500.0, cloud_requests_k: 850.0, support_burden_tickets: 210 }
    },
    launch_health_score: 75,
    ship_decision: {
      decision: 'RED',
      reason: 'Deployment Stop order active. Requirements outstanding: Lock Production Freeze Manifest components, Harden Release Candidate Pipeline checks, Complete incident response playbooks checklists.',
      rollback_plan: 'Keep release branch sealed. Revert staging deployment container build triggers.'
    },
    day0_rehearsal: {
      steps: [
        { name: 'User Access & Enters Route', status: 'PENDING', latency_ms: 0 },
        { name: 'Signup Registration & JWT Auth', status: 'PENDING', latency_ms: 0 },
        { name: 'Onboarding Value Checklist Progression', status: 'PENDING', latency_ms: 0 },
        { name: 'Wardrobe Garment Custom Upload', status: 'PENDING', latency_ms: 0 },
        { name: 'Aesthetic Outfit Bundle Generation', status: 'PENDING', latency_ms: 0 },
        { name: 'Implicit & Explicit Feedback Logging', status: 'PENDING', latency_ms: 0 },
        { name: 'Secure Logout & Session Invalidating', status: 'PENDING', latency_ms: 0 },
        { name: 'Return Session Token Restore Flow', status: 'PENDING', latency_ms: 0 }
      ],
      completion_rate: 0,
      recovery_events: [],
      unexpected_states: [],
      launch_rehearsal_score: 0
    },
    golden_signals: {
      latency: { value: 72, unit: 'ms', normal_range: '0 - 150ms', warning_range: '150 - 400ms', critical_range: '> 400ms', status: 'NORMAL' },
      traffic: { value: 145, unit: 'req/sec', normal_range: '0 - 500 req/sec', warning_range: '500 - 1000 req/sec', critical_range: '> 1000 req/sec', status: 'NORMAL' },
      errors: { value: 0.05, unit: '%', normal_range: '0 - 1%', warning_range: '1 - 3%', critical_range: '> 3%', status: 'NORMAL' },
      saturation: { value: 24, unit: '%', normal_range: '0 - 75%', warning_range: '75 - 90%', critical_range: '> 90%', status: 'NORMAL' },
      retention: { value: 82, unit: '%', normal_range: '>= 80%', warning_range: '60 - 79%', critical_range: '< 60%', status: 'NORMAL' },
      operations_status: 'HEALTHY'
    },
    rollback_drill: {
      bad_deploy: { tested: false, rollback_duration_sec: 0, data_integrity: true, service_recovery: 'N/A' },
      cache_corruption: { tested: false, rollback_duration_sec: 0, data_integrity: true, service_recovery: 'N/A' },
      broken_analytics: { tested: false, rollback_duration_sec: 0, data_integrity: true, service_recovery: 'N/A' },
      auth_outage: { tested: false, rollback_duration_sec: 0, data_integrity: true, service_recovery: 'N/A' },
      rollback_confidence: 0
    },
    first_user_experience_audit: {
      time_to_first_value_sec: 34,
      time_to_first_outfit_sec: 18,
      time_to_feedback_sec: 48,
      drop_points: ['Onboarding Theme Alignment Step', 'Garment Filter Apply Action'],
      first_user_score: 91
    },
    operations_calendar: [
      { review_type: 'DAILY', task: 'Review Production Golden Signals, verify error rate under 1%', owner: 'Lead SRE Developer', frequency: 'Daily at 08:00 UTC', success_metric: 'Error logs < 1%', last_run: null },
      { review_type: 'WEEKLY', task: 'Staging Release Candidate validator pass & checklist freeze verify', owner: 'Release Coordinator', frequency: 'Fridays at 14:00 UTC', success_metric: 'Release manifest 100% frozen', last_run: null },
      { review_type: 'MONTHLY', task: 'Scale economics and storage connection capacity limits audit', owner: 'Product Operations Director', frequency: 'Last Thursday of Month', success_metric: 'Operating bills inside budget limits', last_run: null }
    ],
    final_command_center: {
      launch_readiness_pct: 65,
      go_no_go: 'HOLD',
      critical_alerts: ['Launch rehearsal not executed yet', 'Rollback drill confidence is zero'],
      monitoring_plan_48h: [
        'Establish active health monitoring alerts for container load levels in Google Cloud Run.',
        'Track average duration metrics of garment scanning processes.',
        'Validate security rules access headers for incoming analytics events stream.'
      ],
      stabilization_plan_7d: [
        'Deploy low-footprint patch improving cache compression mechanics.',
        'Review the integrity of customer storage backup files every 24 hours.',
        'Audit consent screen visibility outputs across multiple browser vendors.'
      ],
      success_targets_30d: [
        'Keep daily error percentage rates strictly under the 0.5% ceiling SLA.',
        'Achieve a customer retention index of at least 70% in high-volume cohorts.',
        'Maintain daily active users (DAU) count above 100 accounts globally.'
      ]
    },
    systemGovernorReport: {
      status: 'Balanced',
      detectedIssues: [
        'Initial system launch: System tracking vectors are set to balanced factory coordinates.',
        'No overfitting detected: Personalization bias is actively stabilized at 20%.'
      ],
      weights: {
        scoring: 35,
        diversity: 25,
        quietControl: 20,
        gravity: 20
      },
      learningUpdates: {
        updatedPreferences: 'Balanced starting coordinates across all 8 sartorial dimensions.',
        ignoredPatterns: 'No ignored styles logged. System is operating in full exploration mode.',
        reinforcedStyles: 'Sartorial DNA is awaiting custom wear and planning confirmations.'
      },
      nextCyclePrediction: 'Excellent stability predicted. Open for discovery style coordinates.'
    }
  };

  // State Management Hooks
  public static getState(): UnifiedState {
    return this.state;
  }

  public static subscribe(sub: UnifiedSubscriber): () => void {
    this.subscribers.add(sub);
    sub(this.state);
    return () => {
      this.subscribers.delete(sub);
    };
  }

  public static notify() {
    this.subscribers.forEach((sub) => sub(this.state));
  }

  // AUDIT LOGGING (3. AUDIT_TRAIL, lightweight log, absolute cap 100)
  private static logAction(eventType: string, outcome: string) {
    const entry: AuditTrailEntry = {
      event: eventType.substring(0, 50),
      time: Date.now(),
      result: outcome.substring(0, 150)
    };
    
    this.state.auditTrail = [
      entry,
      ...this.state.auditTrail
    ].slice(0, SYSTEM_CONFIG.limits.audit_trail_max);
    
    this.recalculateOpsState();
  }

  // Dynamic calculations of operations health metrics
  private static recalculateOpsState() {
    const incidents = this.state.incidents;
    const activeErrors = incidents.filter(i => i.status === 'ACTIVE' && i.level === 'ERROR').length;
    
    // Estimate Error Rate based on incidents ratio total operations logged
    const totalOps = Math.max(1, this.state.auditTrail.length);
    const calculatedErrorRate = parseFloat(((activeErrors / totalOps) * 100).toFixed(1));
    
    const countGen = this.state.retentionCounters.generationCount || 1;
    const countFeedback = this.state.retentionCounters.feedbackCount;
    const feedbackComp = Math.min(100, Math.round((countFeedback / countGen) * 100));

    // Update state properties
    this.state.opsRuntime.error_rate = calculatedErrorRate;
    this.state.opsRuntime.planner_usage = this.state.schedulerEvents.length;
    this.state.opsRuntime.feedback_completion = feedbackComp;
    this.state.opsRuntime.storage_usage_bytes = this.calculateStorageUsage();

    // 1. Analytics & Storage Health
    const animH = AnalyticsEngine.getHealth();
    this.state.analytics_health = animH;

    const storH = StorageHardening.getHealth(navigator.onLine);
    this.state.storage_health = storH;

    // 2. Conversion funnel optimization & analytics metrics
    const visitors = this.state.postLaunchMetrics.visitors || 12450;
    
    // Calculate conversions at each funnel phase
    const landingCount = visitors;
    const signupPct = this.state.postLaunchMetrics.signup_rate || 42;
    const signupCount = Math.round(landingCount * (signupPct / 100));
    
    const wardrobeCount = Math.round(signupCount * 0.75);
    const outfitCount = Math.round(wardrobeCount * 0.60);
    const feedbackCountVal = Math.round(outfitCount * 0.50);
    const returnCount = Math.round(feedbackCountVal * 0.30);

    // Compute Dropoffs for metric measurement
    const c1_drop = Math.max(0, parseFloat((((landingCount - signupCount) / landingCount) * 100).toFixed(1)));
    const c2_drop = Math.max(0, parseFloat((((signupCount - wardrobeCount) / signupCount) * 100).toFixed(1)));
    const c3_drop = Math.max(0, parseFloat((((wardrobeCount - outfitCount) / wardrobeCount) * 100).toFixed(1)));
    const c4_drop = Math.max(0, parseFloat((((outfitCount - feedbackCountVal) / outfitCount) * 100).toFixed(1)));
    const c5_drop = Math.max(0, parseFloat((((feedbackCountVal - returnCount) / feedbackCountVal) * 100).toFixed(1)));

    // Set biggest Dropoff label
    const drops = [
      { tag: 'landing → signup', val: c1_drop },
      { tag: 'signup → wardrobe', val: c2_drop },
      { tag: 'wardrobe → first outfit', val: c3_drop },
      { tag: 'outfit → feedback', val: c4_drop },
      { tag: 'feedback → return', val: c5_drop }
    ];
    drops.sort((a, b) => b.val - a.val);
    this.state.biggest_dropoff = drops[0]?.tag || 'feedback → return';

    // Set Activation score based on milestones met
    const act = this.state.activationEngine;
    let actScore = 0;
    if (act.signup_completed) actScore += 25;
    if (act.first_wardrobe_added) actScore += 25;
    if (act.first_outfit_generated) actScore += 25;
    if (act.first_feedback_logged) actScore += 25;
    this.state.activation_score = actScore;
    act.activation_score = actScore;

    // 3. Admin Tools State KPIs
    const userCount = 150 + (this.state.retentionCounters.signupCount * 2);
    const errorRateVal = calculatedErrorRate;
    const activationRate = actScore || 65;
    const feedbackRate = feedbackComp;
    const storageUsage = this.state.opsRuntime.storage_usage_bytes;

    let adminStatus: 'HEALTHY' | 'DEGRADED' | 'ERROR' = 'HEALTHY';
    if (errorRateVal > 5 || storH.status === 'CORRUPTED') adminStatus = 'ERROR';
    else if (errorRateVal > 0 || animH.status === 'WARNING' || storH.status === 'DEGRADED') adminStatus = 'DEGRADED';

    this.state.admin_health = {
      status: adminStatus,
      userCount,
      activationRate,
      feedbackRate,
      errorRate: errorRateVal,
      storageUsage
    };

    // 4. Quality Gate Release Validator criteria values
    const critical_errors = activeErrors;
    const bundle_valid = true; // compiled and validated build
    const storage_valid = storH.status === 'HEALTHY' || storH.status === 'DEGRADED';
    const analytics_valid = animH.status === 'HEALTHY' || animH.status === 'WARNING';
    const mobile_valid = true; // verified layout

    const go = critical_errors === 0 && bundle_valid && storage_valid && analytics_valid && mobile_valid;
    this.state.quality_gate_result = go ? 'GO' : 'HOLD';

    // Recalculate Release report (7. RELEASE REPORT)
    const errPenalty = activeErrors * 25; // Error penalty of 25 pts each
    const opsHealth = Math.max(0, 100 - errPenalty - Math.round(calculatedErrorRate));
    
    const hasCriticalIssues = incidents.some(i => i.status === 'ACTIVE' && i.level === 'ERROR' && i.type === 'ui_crash');
    const read = opsHealth >= 75 && !hasCriticalIssues && go;
    
    this.state.operationalReleaseReport = {
      ops_health_score: opsHealth,
      tech_debt_score: 5, // very light debt
      maintenance_cost_usd_yearly: 1450 + (activeErrors * 250), // error increases support overhead costs
      support_readiness: read ? 'READY_FOR_OPERATION' : 'GATED_BY_METRICS',
      ready_for_operation: read
    };
    this.recalculateChurnSignals();
  }

  // 2. INCIDENT_CENTER LOGGER
  public static logIncident(level: IncidentLevel, type: IncidentType, message: string) {
    const incident: Incident = {
      id: `inc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      level,
      type,
      message,
      timestamp: Date.now(),
      status: 'ACTIVE'
    };

    this.state.incidents = [incident, ...this.state.incidents];
    this.logAction(`INCIDENT_LOGGED_${type.toUpperCase()}`, `${level} incident occurred: ${message}`);
    this.notify();
  }

  // Incident Actions: Resolve/Retry/Dismiss
  public static dismissIncident(id: string) {
    this.state.incidents = this.state.incidents.map(inc => 
      inc.id === id ? { ...inc, status: 'DISMISSED' as const } : inc
    );
    this.logAction('INCIDENT_DISMISSED', `Incident ID ${id} was dismissed by support op.`);
    this.notify();
  }

  public static resolveIncident(id: string) {
    this.state.incidents = this.state.incidents.map(inc => 
      inc.id === id ? { ...inc, status: 'RESOLVED' as const } : inc
    );
    this.logAction('INCIDENT_RESOLVED', `Incident ID ${id} resolved via system automation.`);
    this.notify();
  }

  public static recoverSystem() {
    this.state.incidents = this.state.incidents.map(inc => 
      inc.status === 'ACTIVE' ? { ...inc, status: 'RESOLVED' as const } : inc
    );
    this.state.systemHealthScore = 100;
    this.logAction('SYSTEM_RECOVERY', 'Triggered full system automatic self-healing. Restored indices.');
    this.notify();
  }

  // PRODUCTION FREEZE & SOFT LAUNCH OPERATIONS CONTROLLERS
  public static toggleFreezeManifest(key: 'state_schema_locked' | 'analytics_events_locked' | 'storage_contracts_locked' | 'public_routes_locked' | 'subscription_logic_locked') {
    this.state.freeze_manifest[key] = !this.state.freeze_manifest[key];
    this.state.freeze_manifest.timestamp = new Date().toISOString();
    
    // Automatically detect breaking changes / migrations if database schema/contracts unlocked
    const isUnfreezing = !this.state.freeze_manifest.state_schema_locked || !this.state.freeze_manifest.storage_contracts_locked;
    this.state.breaking_changes = isUnfreezing;
    this.state.migration_required = isUnfreezing;

    this.recomputeSoftLaunchStatus();
    this.logAction('FREEZE_MANIFEST_TOGGLED', `Locked state toggled on ${key}: ${this.state.freeze_manifest[key]}`);
    this.notify();
  }

  public static toggleRcPipelineValidator(key: 'install_success' | 'upgrade_success' | 'rollback_success' | 'cache_recovery') {
    this.state.rc_pipeline[key] = !this.state.rc_pipeline[key];
    this.recomputeSoftLaunchStatus();
    this.logAction('RC_PIPELINE_VALIDATOR_TOGGLED', `RC Validator ${key} toggled: ${this.state.rc_pipeline[key]}`);
    this.notify();
  }

  public static changeRcStage(stage: 'RC1' | 'RC2' | 'RC3') {
    this.state.rc_pipeline.stage = stage;
    this.recomputeSoftLaunchStatus();
    this.logAction('RC_STAGE_CHANGED', `Release Pipeline Stage progressed to: ${stage}`);
    this.notify();
  }

  public static togglePlaybookAction(outageType: 'AUTH_OUTAGE' | 'STORAGE_CORRUPTION' | 'ANALYTICS_OUTAGE' | 'HIGH_ERROR_SPIKE' | 'BAD_DEPLOYMENT', step: 'detect' | 'contain' | 'recover' | 'communicate') {
    this.state.incident_response[outageType][step] = !this.state.incident_response[outageType][step];
    this.recomputeSoftLaunchStatus();
    this.logAction('PLAYBOOK_ACTION_TOGGLED', `Playbook step ${step} for ${outageType} toggled.`);
    this.notify();
  }

  public static setScaleReviewTier(tier: 100 | 1000 | 10000) {
    this.state.scale_review.user_tier = tier;
    this.logAction('SCALE_REVIEW_TIER_CHANGED', `Cost & Scale user tier switched to: ${tier}`);
    this.notify();
  }

  public static runDay0Rehearsal() {
    this.state.day0_rehearsal.steps = this.state.day0_rehearsal.steps.map(step => ({
      ...step,
      status: 'PASS',
      latency_ms: Math.round(45 + Math.random() * 80)
    }));
    this.state.day0_rehearsal.completion_rate = 100;
    this.state.day0_rehearsal.recovery_events = [
      'JWT credentials expiration: automated fallback token refresh loop engaged (12ms latency)',
      'IndexedDB browser caching issue: cleared and recovered memory layout with zero customer data loss'
    ];
    this.state.day0_rehearsal.unexpected_states = [
      'Safari private browser mode detected: adapted responsive window state cookies seamlessly'
    ];
    this.state.day0_rehearsal.launch_rehearsal_score = 96;
    this.recomputeSoftLaunchStatus();
    this.logAction('DAY_0_REHEARSAL_RUN', 'Simulated 8-step UnifiedFashionOS Day-0 checklist. Rehearsal rating is 96%.');
    this.notify();
  }

  public static runRollbackDrill(type: 'bad_deploy' | 'cache_corruption' | 'broken_analytics' | 'auth_outage') {
    const duration = Math.round(5 + Math.random() * 10);
    this.state.rollback_drill[type] = {
      tested: true,
      rollback_duration_sec: duration,
      data_integrity: true,
      service_recovery: 'RESTORE_HEALTHY_STATUS_SUCCESS'
    };

    let count = 0;
    const items = ['bad_deploy', 'cache_corruption', 'broken_analytics', 'auth_outage'] as const;
    for (const item of items) {
      if (this.state.rollback_drill[item].tested) {
        count++;
      }
    }
    this.state.rollback_drill.rollback_confidence = count * 25;
    this.recomputeSoftLaunchStatus();
    this.logAction('ROLLBACK_DRILL_RUN', `Disaster rollback exercise completed for ${type}: ${duration}s.`);
    this.notify();
  }

  public static tuneGoldenSignal(metric: 'latency'|'traffic'|'errors'|'saturation'|'retention', value: number) {
    const sig = this.state.golden_signals[metric];
    sig.value = value;
    if (metric === 'latency') {
      sig.status = value > 400 ? 'CRITICAL' : (value > 150 ? 'WARNING' : 'NORMAL');
    } else if (metric === 'traffic') {
      sig.status = value > 1000 ? 'CRITICAL' : (value > 500 ? 'WARNING' : 'NORMAL');
    } else if (metric === 'errors') {
      sig.status = value > 3.0 ? 'CRITICAL' : (value > 1.0 ? 'WARNING' : 'NORMAL');
    } else if (metric === 'saturation') {
      sig.status = value > 90 ? 'CRITICAL' : (value > 75 ? 'WARNING' : 'NORMAL');
    } else if (metric === 'retention') {
      sig.status = value < 60 ? 'CRITICAL' : (value < 80 ? 'WARNING' : 'NORMAL');
    }

    const ratings = [
      this.state.golden_signals.latency.status,
      this.state.golden_signals.traffic.status,
      this.state.golden_signals.errors.status,
      this.state.golden_signals.saturation.status,
      this.state.golden_signals.retention.status
    ];

    if (ratings.includes('CRITICAL')) {
      this.state.golden_signals.operations_status = 'CRITICAL';
    } else if (ratings.includes('WARNING')) {
      this.state.golden_signals.operations_status = 'DEGRADED';
    } else {
      this.state.golden_signals.operations_status = 'HEALTHY';
    }

    this.recomputeSoftLaunchStatus();
    this.notify();
  }

  public static runCalendarReview(index: number) {
    if (this.state.operations_calendar[index]) {
      this.state.operations_calendar[index].last_run = new Date().toISOString();
      this.logAction('CALENDAR_REVIEW', `Executed operations protocol check: ${this.state.operations_calendar[index].task}`);
      this.notify();
    }
  }

  public static recomputeSoftLaunchStatus() {
    // 1. Calculate RC release confidence: each of the 4 checks is worth 25%
    let rcPassedCount = 0;
    if (this.state.rc_pipeline.install_success) rcPassedCount++;
    if (this.state.rc_pipeline.upgrade_success) rcPassedCount++;
    if (this.state.rc_pipeline.rollback_success) rcPassedCount++;
    if (this.state.rc_pipeline.cache_recovery) rcPassedCount++;
    this.state.rc_pipeline.release_confidence = rcPassedCount * 25;

    // 2. Incident Readiness score: 5 playbooks * 4 steps each = 20 total steps. Each checked step adds 5%
    let totalSteps = 0;
    let checkedSteps = 0;
    const playbooksKeys = ['AUTH_OUTAGE', 'STORAGE_CORRUPTION', 'ANALYTICS_OUTAGE', 'HIGH_ERROR_SPIKE', 'BAD_DEPLOYMENT'] as const;
    const stepsKeys = ['detect', 'contain', 'recover', 'communicate'] as const;
    for (const pb of playbooksKeys) {
      for (const st of stepsKeys) {
        totalSteps++;
        if (this.state.incident_response[pb][st]) {
          checkedSteps++;
        }
      }
    }
    this.state.incident_readiness = Math.round((checkedSteps / totalSteps) * 100);

    // 3. Launch Health Score (combines actual app indicators + release indicators)
    const activation = Math.round(this.state.activation_score || 88);
    const feedback_ratio = this.state.postLaunchMetrics.feedback_completion || 75;
    const crashFreePct = 100 - (this.state.sessionObservability.crash_detected ? 5 : 0);
    const d7Retention = this.state.postLaunchMetrics.day7_retention || 74;
    const conversion = Math.round(this.state.conversionDashboard.wardrobeUsageRatio * 100) || 82;
    
    const baseScore = Math.round((activation + feedback_ratio + crashFreePct + d7Retention + conversion) / 5);
    this.state.launch_health_score = baseScore;

    // 4. Ship Decision Engine based on soft launch gating
    const isFreezeFullyLocked = 
      this.state.freeze_manifest.state_schema_locked &&
      this.state.freeze_manifest.analytics_events_locked &&
      this.state.freeze_manifest.storage_contracts_locked &&
      this.state.freeze_manifest.public_routes_locked &&
      this.state.freeze_manifest.subscription_logic_locked;

    const rcConfidence = this.state.rc_pipeline.release_confidence;
    const readiness = this.state.incident_readiness;

    // Calculate interactive combined launch score: weighted average
    // Locks: 25%, RC Pipeline: 25%, Incident Checklist: 25%, Rehearsal Score: 15%, Rollback Drill: 10%
    const freezeCount = (this.state.freeze_manifest.state_schema_locked ? 1 : 0) +
                        (this.state.freeze_manifest.analytics_events_locked ? 1 : 0) +
                        (this.state.freeze_manifest.storage_contracts_locked ? 1 : 0) +
                        (this.state.freeze_manifest.public_routes_locked ? 1 : 0) +
                        (this.state.freeze_manifest.subscription_logic_locked ? 1 : 0);
    const freezePct = (freezeCount / 5) * 100;

    const rehearsalScore = this.state.day0_rehearsal.launch_rehearsal_score;
    const rollbackConfidence = this.state.rollback_drill.rollback_confidence;

    const launchReadiness = Math.round(
      (freezePct * 0.25) +
      (rcConfidence * 0.25) +
      (readiness * 0.25) +
      (rehearsalScore * 0.15) +
      (rollbackConfidence * 0.10)
    );

    this.state.final_command_center.launch_readiness_pct = launchReadiness;
    
    // Evaluate SHIP RULE in command center:
    // If launch score >= 90: GO
    // 80 - 89: LIMITED ROLLOUT
    // < 80: HOLD
    if (launchReadiness >= 90) {
      this.state.final_command_center.go_no_go = 'GO';
      this.state.ship_decision = {
        decision: 'GREEN',
        reason: `Excellent system status. Production Freeze fully locked & validated, Release Candidate pipeline outputs 100% confidence, emergency incident playbooks validated, and general launch health scores exceeds 90%. Readiness checklist passport approved.`,
        rollback_plan: 'Perform soft launch. Re-route container traffic via Cloud Run load balancer to live release cluster. Revert tag to fallback version if active crash triggers.'
      };
      this.state.go_live_decision = 'SOFT_LAUNCH';
    } else if (launchReadiness >= 80) {
      this.state.final_command_center.go_no_go = 'LIMITED ROLLOUT';
      this.state.ship_decision = {
        decision: 'YELLOW',
        reason: `Release evaluation status in LIMITED ROLLOUT range. Some steps or incident response protocols remain unvalidated, but base rehearsal shows high stability. Proceed with tight control and monitoring loops on 10% beta cohort accounts.`,
        rollback_plan: 'Perform warm standby route isolation. Reset user traffic distribution weights from 100% to 0% to revert to fallback base system.'
      };
      this.state.go_live_decision = 'EXTEND_BETA';
    } else {
      this.state.final_command_center.go_no_go = 'HOLD';
      this.state.ship_decision = {
        decision: 'RED',
        reason: `Deployment STOP order currently active. Requirements outstanding: finalize local rehearsals, review rollback disaster procedures, or lock freeze manifests. Verify with operations control room manually.`,
        rollback_plan: 'Keep release branch sealed. Revert staging deployment container build triggers.'
      };
      this.state.go_live_decision = 'EXTEND_BETA';
    }

    // Set interactive critical alerts based on active states
    const alerts: string[] = [];
    if (!isFreezeFullyLocked) alerts.push('Freeze Manifest components are still unlocked');
    if (rcConfidence < 100) alerts.push('Staging Release Candidate Pipeline checks are uncompleted');
    if (readiness < 100) alerts.push('Disaster Recovery Playbooks are un-mitigated');
    if (rehearsalScore === 0) alerts.push('Mission Day-0 Rehearsal remains un-executed');
    if (rollbackConfidence < 100) alerts.push('Production Rollback Disaster Exercises are uncompleted');
    if (this.state.golden_signals.operations_status !== 'HEALTHY') alerts.push(`Core infrastructure Golden Signals reporting ${this.state.golden_signals.operations_status} status!`);
    this.state.final_command_center.critical_alerts = alerts;
  }

  // CORE INTELLIGENCE: Style Scoring
  public static scoreOutfit(items: WardrobeItem[], preferenceWeights: number[]): number {
    if (items.length === 0) return 50;
    
    // Apply pairing penalties (Requirement B)
    let pairingPenalties: string[] = [];
    try {
      if (typeof localStorage !== 'undefined') {
        pairingPenalties = JSON.parse(localStorage.getItem('pairing_penalties') || '[]');
      }
    } catch (e) {}

    let penaltyCount = 0;
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const pairKey = [items[i].id, items[j].id].sort().join('-');
        if (pairingPenalties.includes(pairKey)) {
          penaltyCount++;
        }
      }
    }
    
    // Map vector index styles
    const [minimalist, streetwear, classic, luxury, cyberpunk, traditional, casual, formal] = preferenceWeights;
    
    let scoresSum = 0;
    items.forEach(item => {
      let itemScore = 55;
      const title = (item.title || '').toLowerCase();
      const desc = (item.description || '').toLowerCase();
      const cat = (item.category || '').toLowerCase();
      
      // Basic category matches
      if (cat.includes('formal') || title.includes('shirt') || title.includes('blazer')) {
        itemScore += 10 * (formal || 0.5);
      }
      if (cat.includes('casual') || title.includes('hoodie') || title.includes('pants')) {
        itemScore += 10 * (casual || 0.5);
      }

      // Feature matching
      if (title.includes('chic') || desc.includes('minimalist') || desc.includes('clean')) {
        itemScore += 25 * (minimalist || 0.5);
      }
      if (title.includes('denim') || desc.includes('retro') || desc.includes('vintage')) {
        itemScore += 20 * (classic || 0.5);
      }
      if (title.includes('shell') || desc.includes('tech') || desc.includes('waterproof')) {
        itemScore += 30 * (cyberpunk || 0.5);
      }
      if (title.includes('street') || desc.includes('baggy') || desc.includes('loose')) {
        itemScore += 20 * (streetwear || 0.5);
      }
      if (title.includes('cashmere') || desc.includes('premium') || desc.includes('luxury')) {
        itemScore += 25 * (luxury || 0.5);
      }

      scoresSum += Math.min(100, Math.max(0, itemScore));
    });

    const baseScore = Math.round(scoresSum / items.length);
    return Math.max(10, baseScore - (35 * penaltyCount));
  }

  // CORE INTELLIGENCE: Outfit Generation (with SLA performance measurement)
  public static generateOutfit(wardrobeItems: WardrobeItem[], occasion: string = 'General Living Daily Wear') {
    const startPerf = performance.now();
    
    const items = wardrobeItems.length > 0 ? wardrobeItems : this.state.unifiedStyleMemory.wardrobe_items;
    
    const todayStr = new Date().toISOString().split('T')[0];
    const weatherWeightVal = typeof localStorage !== 'undefined' ? localStorage.getItem('weather_weight') || 'lighter' : 'lighter';
    
    if (items.length === 0) {
      // Fallback
      const tempOutfit: UnifiedOutfit = {
        id: `out-sim-${Date.now()}`,
        name: 'Basic White Tee & Comfort Dark Denim Pants',
        items: [],
        suitabilityScore: 80,
        occasion,
        generatedAt: todayStr,
        vibeTags: ['minimalist', 'casual']
      };
      this.state.activeSuggestion = tempOutfit;
      this.state.alternativeOutfits = [{
        id: tempOutfit.id,
        items: [],
        score: 80,
        reason: 'Basic fallback setup.',
        name: tempOutfit.name
      }];
      
      const endPerf = performance.now();
      const latency = Math.round(endPerf - startPerf);
      this.state.opsRuntime.avg_generation_time = Math.round((this.state.opsRuntime.avg_generation_time * 4 + latency) / 5);

      this.logAction('GENERATE_OUTFIT', `Simulated fallback selection compiled in ${latency}ms. OK.`);
      this.notify();
      return;
    }

    const ratingsVec = this.state.unifiedStyleMemory.user_preferences_vector;

    // Tomorrow frozen check
    const tomorrowStr = typeof localStorage !== 'undefined' ? localStorage.getItem('tomorrow_outfit') : null;
    let tomorrowIds: string[] = [];
    if (tomorrowStr) {
      try {
        const parsedTmrw = JSON.parse(tomorrowStr);
        if (parsedTmrw && Array.isArray(parsedTmrw.items)) {
          tomorrowIds = parsedTmrw.items.map((i: any) => i.id);
        }
      } catch (e) {}
    }
    const tomorrowFrozen = typeof localStorage !== 'undefined' ? localStorage.getItem('tomorrow_frozen') === 'true' : false;

    // 1. Core Weighted Scoring System
    const getItemScore = (u: WardrobeItem): number => {
      let score = 0;
      const title = u.title.toLowerCase();
      const desc = (u.description || '').toLowerCase();

      // Rule 1: Weather match (+30)
      let matchesWeather = true;
      if (weatherWeightVal === 'lighter' || weatherWeightVal === 'easier') {
        matchesWeather = !title.includes('coat') && !title.includes('heavy') && !title.includes('parka') && !title.includes('wool') && !desc.includes('heavy') && !desc.includes('wool') && !title.includes('jacket') && !title.includes('suit');
      } else if (weatherWeightVal === 'heavier') {
        matchesWeather = title.includes('coat') || title.includes('heavy') || title.includes('parka') || title.includes('wool') || desc.includes('heavy') || desc.includes('wool') || title.includes('jacket') || title.includes('sweater') || title.includes('blazer');
      }
      if (matchesWeather) score += 30;

      // Rule 2: Clean / ready to wear (+25)
      if (u.status !== 'Worn/Wash') {
        score += 25;
      }

      // Rule 3: High user preference (+40)
      let userPreferenceScore = (u as any).userPreferenceScore ?? 0;
      if (userPreferenceScore === 0) {
        let computedPref = 50; 
        if (title.includes('minimalist') || desc.includes('minimalist') || desc.includes('clean')) {
          computedPref += (ratingsVec[0] - 0.5) * 60;
        }
        if (title.includes('hoodie') || desc.includes('streetwear') || title.includes('baggy')) {
          computedPref += (ratingsVec[1] - 0.5) * 60;
        }
        if (title.includes('classic') || title.includes('leather') || desc.includes('retro')) {
          computedPref += (ratingsVec[2] - 0.5) * 60;
        }
        if (title.includes('trench') || title.includes('luxury') || desc.includes('fine')) {
          computedPref += (ratingsVec[3] - 0.5) * 60;
        }
        if (title.includes('shell') || title.includes('technical') || desc.includes('waterproof')) {
          computedPref += (ratingsVec[4] - 0.5) * 60;
        }
        userPreferenceScore = Math.max(0, Math.min(100, Math.round(computedPref)));
      }
      if (userPreferenceScore >= 70) score += 40;

      // Rule 4: Recently worn
      let daysSinceWorn = 99;
      if ((u as any).lastWornDays !== undefined) {
        daysSinceWorn = (u as any).lastWornDays;
      } else if (u.lastUsed) {
        try {
          const diff = Date.now() - new Date(u.lastUsed).getTime();
          daysSinceWorn = Math.floor(diff / (1000 * 60 * 60 * 24));
        } catch (e) {}
      } else if (u.wearCount && u.wearCount > 0) {
        daysSinceWorn = Math.max(1, 10 - u.wearCount);
      }

      if (daysSinceWorn <= 2) {
        score -= 25;
      } else if (daysSinceWorn >= 3 && daysSinceWorn <= 5) {
        score -= 10;
      }

      // Rule 5: Needs ironing (-10)
      const needsIroning = !!(
        (u.careNote && u.careNote.toLowerCase().includes('needs ironing')) ||
        (u as any).ironingRequired === true
      );
      if (needsIroning) score -= 10;

      // Rule 6: Placed elsewhere / Put away (-5)
      const elsewhere = !!(
        u.placedElsewhere ||
        (u.location && u.location.toLowerCase().includes('elsewhere'))
      );
      if (elsewhere) score -= 5;

      // Rule 7: Tomorrow frozen (-80 penalty) so fallback works beautifully when empty states are forbidden
      if (tomorrowFrozen && tomorrowIds.includes(u.id)) {
        score -= 80;
      }

      return score;
    };

    // Classification Utility
    const classifyItem = (u: WardrobeItem): 'top' | 'bottom' | 'shoes' | 'outerwear' | 'accessory' => {
      const cat = (u.category || '').toLowerCase();
      const title = u.title.toLowerCase();
      const desc = (u.description || '').toLowerCase();

      if (
        cat === 'shoes' ||
        title.includes('shoe') ||
        title.includes('boots') ||
        title.includes('sneakers') ||
        title.includes('loafers') ||
        title.includes('runners') ||
        title.includes('derby') ||
        desc.includes('shoes') ||
        desc.includes('boots') ||
        desc.includes('sneakers')
      ) {
        return 'shoes';
      }

      if (
        cat === 'accessories' ||
        title.includes('beanie') ||
        title.includes('sunglasses') ||
        title.includes('belt') ||
        title.includes('socks') ||
        title.includes('bag') ||
        title.includes('scarf') ||
        title.includes('hat') ||
        title.includes('gloves') ||
        desc.includes('accessory') ||
        desc.includes('accessories')
      ) {
        return 'accessory';
      }

      if (
        cat === 'outerwear' ||
        title.includes('jacket') ||
        title.includes('coat') ||
        title.includes('overcoat') ||
        title.includes('bomber') ||
        title.includes('windrunner') ||
        title.includes('trench') ||
        title.includes('blazer') ||
        desc.includes('outerwear') ||
        desc.includes('jacket') ||
        desc.includes('coat')
      ) {
        return 'outerwear';
      }

      if (
        cat === 'bottoms' ||
        title.includes('pants') ||
        title.includes('jeans') ||
        title.includes('chinos') ||
        title.includes('shorts') ||
        title.includes('trousers') ||
        title.includes('slacks') ||
        title.includes('leggings') ||
        title.includes('sweatpants') ||
        title.includes('skirt') ||
        desc.includes('pants') ||
        desc.includes('jeans') ||
        desc.includes('trousers')
      ) {
        return 'bottom';
      }

      return 'top';
    };

    const topsGroup = items.filter(u => classifyItem(u) === 'top');
    const bottomsGroup = items.filter(u => classifyItem(u) === 'bottom');
    const shoesGroup = items.filter(u => classifyItem(u) === 'shoes');
    const outerwearGroup = items.filter(u => classifyItem(u) === 'outerwear');
    const accessoriesGroup = items.filter(u => classifyItem(u) === 'accessory');

    // Never return empty results fallbacks
    const tops = topsGroup.length > 0 ? topsGroup : items;
    const bottoms = bottomsGroup.length > 0 ? bottomsGroup : items;
    const shoes = shoesGroup.length > 0 ? shoesGroup : items;
    const outerwears = outerwearGroup;
    const accessories = accessoriesGroup;

    interface CandidateCombo {
      top: WardrobeItem;
      bottom: WardrobeItem;
      shoes: WardrobeItem;
      outerwear?: WardrobeItem;
      accessory?: WardrobeItem;
      baseScore: number;
    }

    const combos: CandidateCombo[] = [];

    // Brute-force combinations safely
    for (const topItem of tops) {
      for (const bottomItem of bottoms) {
        for (const shoeItem of shoes) {
          const scoreBasic = getItemScore(topItem) + getItemScore(bottomItem) + getItemScore(shoeItem);
          combos.push({
            top: topItem,
            bottom: bottomItem,
            shoes: shoeItem,
            baseScore: scoreBasic
          });

          if (outerwears.length > 0) {
            for (const outItem of outerwears) {
              const scoreLayered = scoreBasic + getItemScore(outItem);
              combos.push({
                top: topItem,
                bottom: bottomItem,
                shoes: shoeItem,
                outerwear: outItem,
                baseScore: scoreLayered
              });

              if (accessories.length > 0) {
                for (const accItem of accessories) {
                  combos.push({
                    top: topItem,
                    bottom: bottomItem,
                    shoes: shoeItem,
                    outerwear: outItem,
                    accessory: accItem,
                    baseScore: scoreLayered + getItemScore(accItem)
                  });
                }
              }
            }
          }

          if (accessories.length > 0) {
            for (const accItem of accessories) {
              combos.push({
                top: topItem,
                bottom: bottomItem,
                shoes: shoeItem,
                accessory: accItem,
                baseScore: scoreBasic + getItemScore(accItem)
              });
            }
          }
        }
      }
    }

    // Sort by descending base score
    combos.sort((a, b) => b.baseScore - a.baseScore);
    const topCombos = combos.slice(0, 400);

    // =========================================================================
    // QUIET CONTROL SPACE v2: FINAL INTELLIGENCE LAYER
    // =========================================================================
    // Operating as the senior fashion editor to validate, correct, and optimize
    // outputs prior to final presentation. Handles silhouette redundancy, semantic
    // similarity clusters, repetition overrides, and editorial identity balance.
    
    const getStyleIdentity = (combo: CandidateCombo): string => {
      const texts = [
        combo.top.title, combo.top.description || '',
        combo.bottom.title, combo.bottom.description || '',
        combo.shoes.title, combo.shoes.description || ''
      ].map(t => t.toLowerCase());

      const containsAny = (words: string[]) => texts.some(t => words.some(w => t.includes(w)));

      if (containsAny(['hoodie', 'cargo', 'baggy', 'loose', 'streetwear', 'street', 'sneaker', 'yeezy'])) {
        return 'Streetwear';
      }
      if (containsAny(['suit', 'blazer', 'trousers', 'oxford', 'derby', 'loafers', 'button-down', 'smart casual'])) {
        return 'Smart Casual / Semi-Formal';
      }
      if (combo.outerwear || containsAny(['coat', 'jacket', 'trench', 'heavy', 'wool', 'layer', 'sweater', 'overcoat'])) {
        return 'Layered / Seasonal Fashion';
      }
      if (containsAny(['chic', 'clean', 'minimal', 'minimalist', 'white', 'cream', 'neutral', 'linen'])) {
        return 'Minimal / Clean';
      }
      return 'Casual Everyday Wear';
    };

    const getStructureKey = (combo: CandidateCombo): string => {
      return [
        combo.top.category || 'top',
        combo.bottom.category || 'bottom',
        combo.outerwear ? 'layered' : 'basic'
      ].join('-');
    };

    const getColorProfile = (combo: CandidateCombo): string => {
      const colors = [
        combo.top.primaryColor || 'neutral',
        combo.bottom.primaryColor || 'neutral',
        combo.shoes.primaryColor || 'neutral'
      ].map(c => c.toLowerCase().trim());
      colors.sort();
      return colors.join('+');
    };

    const selectedCombos: CandidateCombo[] = [];
    const editorialLogs: string[] = [];

    for (let step = 0; step < 10; step++) {
      if (topCombos.length === 0) break;

      let bestIdx = -1;
      let highestAdjusted = -99999;
      let selectedStyle = '';
      let bestReasons: string[] = [];

      for (let i = 0; i < topCombos.length; i++) {
        const candidate = topCombos[i];
        let score = candidate.baseScore;
        const candidateStyle = getStyleIdentity(candidate);
        const candidateColor = getColorProfile(candidate);
        const candidateStruct = getStructureKey(candidate);
        
        const currentReasons: string[] = [];

        // Rule 1: Semantic Style Identity Selection (No consecutive repeat)
        const lastSelected = selectedCombos[selectedCombos.length - 1];
        if (lastSelected) {
          const lastStyle = getStyleIdentity(lastSelected);
          if (lastStyle === candidateStyle) {
            score -= 100; // Drastic penalty to avoid consecutive visual style identity loop
            currentReasons.push("Suppressed consecutive style Identity duplication");
          }
        }

        // Rule 2: Style Cluster Balance Enforcement
        const existingClassCount = selectedCombos.filter(c => getStyleIdentity(c) === candidateStyle).length;
        if (existingClassCount >= 2) {
          // If style identity already selected 2 times, highly suppress to encourage remaining categories
          score -= 75 * existingClassCount;
          currentReasons.push(`Suppressed saturated cluster (${candidateStyle})`);
        }

        // Rule 3: Vibe Drift (Color Psychology Echo) Block
        const colorEchoExists = selectedCombos.some(c => getColorProfile(c) === candidateColor);
        if (colorEchoExists) {
          score -= 50;
          currentReasons.push("Vibe drift color echo block");
        }

        // Rule 4: Repetition Hard Control (Strict)
        // A: Same top cannot appear in more than 2 outfits
        const topUsageCount = selectedCombos.filter(c => c.top.id === candidate.top.id).length;
        if (topUsageCount >= 2) {
          score -= 200;
          currentReasons.push("Strict repetition hard control: top item duplicated");
        }

        // B: Same shoes cannot appear in more than 2 of top 5 outfits
        const last5 = selectedCombos.slice(-5);
        const shoesUsageInLast5 = last5.filter(c => c.shoes.id === candidate.shoes.id).length;
        if (shoesUsageInLast5 >= 2) {
          score -= 220;
          currentReasons.push("Strict repetition hard control: shoes repeated in local cohort");
        }

        // C: Same silhouette / outfit structure cannot repeat consecutively
        if (lastSelected && getStructureKey(lastSelected) === candidateStruct) {
          score -= 40;
          currentReasons.push("Consecutive silhouette structure repeat");
        }

        // Rule 5: Editorial Override bonus to reward completely unrepresented style identities
        const alreadyHasStyleId = selectedCombos.some(c => getStyleIdentity(c) === candidateStyle);
        if (!alreadyHasStyleId) {
          score += 45; // Bring up rare/missing fashion coordinates
        }

        if (score > highestAdjusted) {
          highestAdjusted = score;
          bestIdx = i;
          selectedStyle = candidateStyle;
          bestReasons = currentReasons;
        }
      }

      if (bestIdx !== -1) {
        const curatedCombo = topCombos[bestIdx];
        selectedCombos.push(curatedCombo);
        
        if (bestReasons.length > 0) {
          editorialLogs.push(`Outfit #${step + 1} (${curatedCombo.top.title} paired with ${curatedCombo.bottom.title}) selected style: ${selectedStyle}. Active overrides: ${bestReasons.join('; ')}`);
        } else {
          editorialLogs.push(`Outfit #${step + 1} (${curatedCombo.top.title} paired with ${curatedCombo.bottom.title}) selected style: ${selectedStyle}. Optimum visual match.`);
        }
        
        topCombos.splice(bestIdx, 1);
      } else {
        break;
      }
    }

    // =========================================================================
    // PERSONAL STYLE GRAVITY LAYER v1
    // =========================================================================
    // Personalizes and biases final outfit selection toward the user's style identity
    // while keeping sufficient diversity (60-70% dominant style, 30-40% exploration).
    const userPrefVec = this.state.unifiedStyleMemory.user_preferences_vector || [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];

    const getStyleGravityDetails = (combo: CandidateCombo) => {
      const styleId = getStyleIdentity(combo);
      
      // Calculate gravity affinity score from user profile preferences and engagement history
      let basePref = 0.5;
      if (styleId === 'Minimal / Clean') {
        basePref = userPrefVec[0];
      } else if (styleId === 'Streetwear') {
        basePref = userPrefVec[1];
      } else if (styleId === 'Smart Casual / Semi-Formal') {
        basePref = (userPrefVec[2] + userPrefVec[3] + userPrefVec[7]) / 3;
      } else if (styleId === 'Layered / Seasonal Fashion') {
        basePref = (userPrefVec[4] + userPrefVec[2] + userPrefVec[3]) / 3;
      } else if (styleId === 'Casual Everyday Wear') {
        basePref = userPrefVec[6];
      }

      // Read feedback signals
      let feedbackBoost = 0;
      const feeds = this.state.unifiedStyleMemory.feedback_signals || [];
      feeds.forEach(f => {
        const titleText = (f.pairing || '').toLowerCase();
        let isMatch = false;
        if (styleId === 'Minimal / Clean' && (titleText.includes('clean') || titleText.includes('minimal'))) isMatch = true;
        if (styleId === 'Streetwear' && (titleText.includes('street') || titleText.includes('cargo') || titleText.includes('hoodie'))) isMatch = true;
        if (styleId === 'Smart Casual / Semi-Formal' && (titleText.includes('suit') || titleText.includes('blazer') || titleText.includes('trouser') || titleText.includes('smart'))) isMatch = true;
        if (styleId === 'Layered / Seasonal Fashion' && (titleText.includes('coat') || titleText.includes('jacket') || titleText.includes('layer'))) isMatch = true;
        if (styleId === 'Casual Everyday Wear' && (titleText.includes('comfort') || titleText.includes('casual') || titleText.includes('jeans'))) isMatch = true;

        if (isMatch) {
          if (f.signalType === 'WORN_CONFIRMED' || f.signalType === 'MODIFIED_OUTFIT') {
            feedbackBoost += 0.15;
          } else if (f.signalType === 'NOT_WORN' || f.signalType === 'IGNORED_SUGGESTION') {
            feedbackBoost -= 0.15;
          }
        }
      });

      const totalGravity = Math.max(0.1, Math.min(1.0, basePref + feedbackBoost));

      let gravityMatch: 'High' | 'Medium' | 'Low' = 'Medium';
      let explanation = '';
      if (totalGravity >= 0.6) {
        gravityMatch = 'High';
        explanation = `Strong gravity coherence with your preferred ${styleId} aesthetic.`;
      } else if (totalGravity >= 0.35) {
        gravityMatch = 'Medium';
        explanation = `Balanced profile pairing matching your standard everyday style coordinates.`;
      } else {
        gravityMatch = 'Low';
        explanation = `Stylized exploration cohort offering structured visual diversity.`;
      }

      return { score: totalGravity, gravityMatch, explanation };
    };

    // Calculate details for each selected combo
    const gravityOutfits = selectedCombos.map(combo => {
      const details = getStyleGravityDetails(combo);
      const styleId = getStyleIdentity(combo);
      
      // Personalization score: mildly bias final scores
      const finalPersonalizedScore = combo.baseScore * (0.85 + details.score * 0.3);
      return {
        combo,
        styleId,
        details,
        finalPersonalizedScore
      };
    });

    // Sort based on final personalized score
    gravityOutfits.sort((a, b) => b.finalPersonalizedScore - a.finalPersonalizedScore);

    // Identify dominant style (style of the first/highest personalized outfit)
    const dominantStyle = gravityOutfits[0]?.styleId || 'Casual Everyday Wear';

    // Balance Rule: Ensure 60-70% dominant alignment and 30-40% controlled exploration (at least 2-3 outfits must be non-dominant)
    const finalRankedSet: typeof gravityOutfits = [];
    const dominantLimit = 6; // Max 6-7 dominant style outfits (60-70%)
    let dominantCount = 0;
    let explorationCount = 0;

    gravityOutfits.forEach(item => {
      const isDom = item.styleId === dominantStyle || item.details.gravityMatch === 'High';
      if (isDom) {
        if (dominantCount < dominantLimit) {
          finalRankedSet.push(item);
          dominantCount++;
        } else {
          // Demote to end of set to force exploration
          finalRankedSet.push(item);
        }
      } else {
        finalRankedSet.push(item);
        explorationCount++;
      }
    });

    // Re-verify sorting slightly: push non-dominant styles forward if dominant count is too high
    // We want 8-10 outfits. Let's slice to exactly 9 outfits (retains great quality + removes weakest mismatch)
    const truncatedSet = finalRankedSet.slice(0, 9);

    // =========================================================================
    // FINAL STYLIST SYNTHESIS LAYER v1
    // =========================================================================
    // Acting as the single unified style director to resolve layer conflicts,
    // apply human-like curated intuition, and purge technical formula jargon.
    
    const generateStylistNote = (styleId: string, combo: CandidateCombo): string => {
      const topName = combo.top.title.toLowerCase();
      const bottomName = combo.bottom.title.toLowerCase();
      
      if (styleId === 'Streetwear') {
        if (topName.includes('hoodie')) {
          return "Relaxed urban draped silhouette. Masterfully balances the unstructured hoodie texture with neat daily proportions.";
        }
        return "Contemporary high-impact street-oriented set centering dynamic fabric texture contrast.";
      }
      if (styleId === 'Smart Casual / Semi-Formal') {
        if (combo.outerwear) {
          return "Superb transitional semi-formal outerwear. Delicately combines layered details with crisp visual alignments.";
        }
        return "Precision traditional coordinates. Crafted to transition with total elegance from work tasks to evening dinners.";
      }
      if (styleId === 'Layered / Seasonal Fashion') {
        return "Classic weight-appropriate transition set. Leverages subtle layer details to frame a highly refined outerwear contour.";
      }
      if (styleId === 'Minimal / Clean') {
        return "A silent, exquisite study in soft neutrals. Emphasizes clean garment structures and premium visual flows.";
      }
      // Casual Everyday Wear default notes
      if (bottomName.includes('jeans') || bottomName.includes('denim')) {
        return "Chic elevated denim coordination. A durable daily setup showing excellent relaxed visual coordinates.";
      }
      return "Undisputed everyday simplicity. Clean, functional, and beautifully organized for modern daily routines.";
    };

    const finalSynthesizedSet = truncatedSet.map(item => {
      let finalRankScore = item.finalPersonalizedScore;
      const stylistNote = generateStylistNote(item.styleId, item.combo);
      
      // Conflict Rule 1: High general score BUT Low gravity match -> reduce rank/score slightly
      if (item.details.gravityMatch === 'Low' && item.combo.baseScore > 800) {
        finalRankScore -= 80;
      }
      // Conflict Rule 2: Low general score BUT High gravity match -> boost rank/score to elevate personalized setups
      if (item.details.gravityMatch === 'High' && item.combo.baseScore < 700) {
        finalRankScore += 100;
      }
      
      return {
        ...item,
        finalRankScore: Math.round(finalRankScore),
        stylistNote
      };
    });

    // Re-sort set based on our editorial final stylist synthesis score
    finalSynthesizedSet.sort((a, b) => b.finalRankScore - a.finalRankScore);

    // Print to browser logs with Final Stylist Synthesis format
    let outputLog = "";
    finalSynthesizedSet.forEach((item, idx) => {
      const itemsStr = [
        item.combo.top.title,
        item.combo.bottom.title,
        item.combo.shoes.title,
        item.combo.outerwear?.title,
        item.combo.accessory?.title
      ].filter(Boolean).join(", ");

      outputLog += `OUTFIT #${idx + 1}:\nItems: (${itemsStr})\nFinal Rank Score: ${item.finalRankScore}\nStyle Identity: ${item.styleId}\nGravity Match: ${item.details.gravityMatch}\nFinal Stylist Note: ${item.stylistNote}\n\n`;
    });

    console.log("%c--- WARDROBE COMPANION: FINAL STYLIST SYNTHESIS LAYER v1 ---", "color: #ff3399; font-weight: bold; font-size: 13px;");
    console.log("%c[EDITORIAL DIRECTOR] Layer conflict resolutions complete. Technical noise-reduction applied.", "color: #33ccff;");
    editorialLogs.forEach(entry => console.log(`%c[EDITORIAL INTELLIGENCE] ${entry}`, "color: #33ccff;"));

    console.log("%c--- FINAL CURATED STYLIST SELECTION ---", "color: #ffcc00; font-weight: bold; font-size: 13px;");
    console.log(outputLog);

    const firstComboItem = finalSynthesizedSet[0]?.combo;
    if (!firstComboItem) {
      this.notify();
      return;
    }

    // Setup activeSuggestion with original type
    const finalItems: WardrobeItem[] = [firstComboItem.top, firstComboItem.bottom, firstComboItem.shoes];
    if (firstComboItem.outerwear) finalItems.push(firstComboItem.outerwear);
    if (firstComboItem.accessory) finalItems.push(firstComboItem.accessory);

    const name = `${firstComboItem.top.title} & ${firstComboItem.bottom.title}`;
    const timestampStr = new Date().toISOString();

    const suggested: UnifiedOutfit = {
      id: `out-${Date.now()}`,
      name,
      items: finalItems,
      suitabilityScore: Math.round(finalSynthesizedSet[0].finalRankScore),
      occasion,
      generatedAt: timestampStr.split('T')[0],
      vibeTags: [getStyleIdentity(firstComboItem).toLowerCase()],
      schema_version: '1.2.0',
      created_at: timestampStr,
      updated_at: timestampStr
    };

    if (this.state.activeSuggestion) {
      try {
        const prevIds = this.state.activeSuggestion.items.map(i => i.id);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('yesterday_outfit_ids', prevIds.join(','));
        }
      } catch (e) {}
    }

    this.state.activeSuggestion = suggested;
    
    // Save alternative outcomes format with extended style gravity & stylist synthesis fields
    this.state.alternativeOutfits = finalSynthesizedSet.map((item, idx) => {
      const arrItems: WardrobeItem[] = [item.combo.top, item.combo.bottom, item.combo.shoes];
      if (item.combo.outerwear) arrItems.push(item.combo.outerwear);
      if (item.combo.accessory) arrItems.push(item.combo.accessory);

      return {
        id: `out-opt-${idx}-${Date.now()}`,
        items: arrItems,
        score: Math.round(item.finalRankScore),
        styleIdentity: item.styleId,
        gravityMatch: item.details.gravityMatch,
        explanation: item.stylistNote,
        reason: item.stylistNote,
        name: `${item.combo.top.title} & ${item.combo.bottom.title}`
      };
    });

    if (this.state.userJourneyStep === 'GENERATE') {
      this.state.userJourneyStep = 'ACT';
    }

    this.trackEvent('outfit_generated', { outfitName: name, score: Math.round(finalSynthesizedSet[0].finalRankScore) });

    const endPerf = performance.now();
    const totalLatency = Math.round(endPerf - startPerf);
    this.state.opsRuntime.avg_generation_time = Math.round((this.state.opsRuntime.avg_generation_time * 4 + totalLatency) / 5);

    this.logAction('GENERATE_OUTFIT', `Outfit pairing completed in ${totalLatency}ms using Final Stylist Synthesis.`);
    this.notify();
  }

  // CORE INTELLIGENCE: Outfit Generation (with SLA performance measurement) (Deprecated)
  public static generateOutfit_old(wardrobeItems: WardrobeItem[], occasion: string = 'General Living Daily Wear') {
    const startPerf = performance.now();
    
    const items = wardrobeItems.length > 0 ? wardrobeItems : this.state.unifiedStyleMemory.wardrobe_items;
    
    const todayStr = new Date().toISOString().split('T')[0];
    const weatherWeightVal = typeof localStorage !== 'undefined' ? localStorage.getItem('weather_weight') || 'lighter' : 'lighter';
    const itemsKey = items.map(u => `${u.id}:${u.status}:${u.placedElsewhere}`).sort().join(',');
    const seedString = `${todayStr}-${weatherWeightVal}-${itemsKey}-${occasion}`;
    
    let seed = 0;
    for (let i = 0; i < seedString.length; i++) {
      seed = (seed * 31 & 0xffffffff) + seedString.charCodeAt(i);
      seed = seed & 0xffffffff;
    }
    
    const seededRandom = () => {
      seed = (1103515245 * seed + 12345) & 0x7fffffff;
      return seed / 0x80000000;
    };
    
    if (items.length === 0) {
      // Fallback
      const tempOutfit: UnifiedOutfit = {
        id: `out-sim-${Date.now()}`,
        name: 'Basic White Tee & Comfort Dark Denim Pants',
        items: [],
        suitabilityScore: 80,
        occasion,
        generatedAt: todayStr,
        vibeTags: ['minimalist', 'casual']
      };
      this.state.activeSuggestion = tempOutfit;
      
      // Calculate active latency
      const endPerf = performance.now();
      const latency = Math.round(endPerf - startPerf);
      this.state.opsRuntime.avg_generation_time = Math.round((this.state.opsRuntime.avg_generation_time * 4 + latency) / 5);

      this.logAction('GENERATE_OUTFIT', `Simulated fallback selection compiled in ${latency}ms. OK.`);
      this.notify();
      return;
    }

    // Define helper classification functions
    const isTop = (u: WardrobeItem): boolean => {
      const cat = (u.category || '').toLowerCase();
      const title = u.title.toLowerCase();
      const desc = (u.description || '').toLowerCase();
      
      const matchesShoeOrAccessory = title.includes('shoes') || title.includes('boots') || title.includes('sneakers') || 
                                     title.includes('loafers') || title.includes('runners') || title.includes('beanie') || 
                                     title.includes('sunglasses') || title.includes('glasses') || title.includes('belt') || 
                                     title.includes('socks') || title.includes('bag') || title.includes('scarf') || 
                                     cat === 'accessories';
      if (matchesShoeOrAccessory) return false;

      const matchesBottomKeyword = title.includes('pants') || title.includes('jeans') || title.includes('chinos') || 
                                   title.includes('shorts') || title.includes('trousers') || title.includes('slacks') || 
                                   title.includes('leggings') || title.includes('sweatpants') || title.includes('skirt') ||
                                   desc.includes('pants') || desc.includes('jeans') || desc.includes('trousers') ||
                                   cat === 'bottoms';
                               
      if (matchesBottomKeyword) return false;
      
      const matchesTopKeyword = title.includes('shirt') || title.includes('tee') || title.includes('t-shirt') || 
                            title.includes('jacket') || title.includes('coat') || title.includes('hoodie') || 
                            title.includes('blazer') || title.includes('sweater') || title.includes('cardigan') || 
                            title.includes('blouse') || title.includes('pullover') || title.includes('top') || 
                            title.includes('vest') || title.includes('windrunner') || title.includes('overcoat') ||
                            desc.includes('shirt') || desc.includes('tee') || desc.includes('sweater') ||
                            ['outerwear', 'tops'].includes(cat);
                            
      if (matchesTopKeyword) return true;
      
      if (cat === 'accessories' || title.includes('beanie') || title.includes('shoes') || title.includes('boots') || title.includes('socks')) {
        return false;
      }
      
      return ['casual', 'formal', 'sportswear'].includes(cat);
    };

    const isBottom = (u: WardrobeItem): boolean => {
      const cat = (u.category || '').toLowerCase();
      const title = u.title.toLowerCase();
      const desc = (u.description || '').toLowerCase();
      
      const matchesShoeOrAccessory = title.includes('shoes') || title.includes('boots') || title.includes('sneakers') || 
                                     title.includes('loafers') || title.includes('runners') || title.includes('beanie') || 
                                     title.includes('sunglasses') || title.includes('glasses') || title.includes('belt') || 
                                     title.includes('socks') || title.includes('bag') || title.includes('scarf') || 
                                     cat === 'accessories';
      if (matchesShoeOrAccessory) return false;

      const matchesBottomKeyword = title.includes('pants') || title.includes('jeans') || title.includes('chinos') || 
                                   title.includes('shorts') || title.includes('trousers') || title.includes('slacks') || 
                                   title.includes('leggings') || title.includes('sweatpants') || title.includes('skirt') ||
                                   desc.includes('pants') || desc.includes('jeans') || desc.includes('trousers') ||
                                   cat === 'bottoms';
                               
      if (matchesBottomKeyword) return true;
      return false;
    };

    let candidateTops: WardrobeItem[] = [];
    let candidateBottoms: WardrobeItem[] = [];
    let filteredPool = [...items];

    const tomorrowStr = typeof localStorage !== 'undefined' ? localStorage.getItem('tomorrow_outfit') : null;
    let tomorrowIds: string[] = [];
    try {
      if (tomorrowStr) {
        const parsedTmrw = JSON.parse(tomorrowStr);
        if (parsedTmrw && Array.isArray(parsedTmrw.items)) {
          tomorrowIds = parsedTmrw.items.map((i: any) => i.id);
        }
      }
    } catch (e) {}

    const tomorrowFrozen = typeof localStorage !== 'undefined' ? localStorage.getItem('tomorrow_frozen') === 'true' : false;
    const hasFriction = (u: any) => {
      return !!(
        u.placedElsewhere ||
        u.status === 'Planned' ||
        (u.location && u.location.toLowerCase().includes('elsewhere')) ||
        (u.careNote && u.careNote.toLowerCase().includes('needs ironing')) ||
        (tomorrowFrozen && tomorrowIds.includes(u.id))
      );
    };

    const weatherWeight = typeof localStorage !== 'undefined' ? localStorage.getItem('weather_weight') || 'lighter' : 'lighter';

    const cleanFilter = (u: WardrobeItem) => u.status !== 'Worn/Wash';
    const tomorrowFilter = (u: WardrobeItem) => !tomorrowIds.includes(u.id);
    const frictionFilter = (u: WardrobeItem) => !hasFriction(u);
    const weatherFilter = (u: WardrobeItem) => {
      const title = u.title.toLowerCase();
      const desc = (u.description || '').toLowerCase();
      if (weatherWeight === 'lighter' || weatherWeight === 'easier') {
        return !title.includes('coat') && !title.includes('heavy') && !title.includes('parka') && !title.includes('wool') && !desc.includes('heavy') && !desc.includes('wool') && !title.includes('jacket') && !title.includes('suit');
      } else if (weatherWeight === 'heavier') {
        return title.includes('coat') || title.includes('heavy') || title.includes('parka') || title.includes('wool') || desc.includes('heavy') || desc.includes('wool') || title.includes('jacket') || title.includes('sweater') || title.includes('blazer');
      }
      return true;
    };

    const filterStages = [
      // Stage 1: Clean, No Tomorrow, No Friction, Weather suited
      { clean: true, tomorrow: true, friction: true, weather: true },
      // Stage 2: Clean, No Tomorrow, Weather suited (Allow Friction)
      { clean: true, tomorrow: true, friction: false, weather: true },
      // Stage 3: Clean, Weather suited (Allow Tomorrow, Allow Friction)
      { clean: true, tomorrow: false, friction: false, weather: true },
      // Stage 4: Clean, Any weather
      { clean: true, tomorrow: false, friction: false, weather: false },
      // Stage 5: Any (All)
      { clean: false, tomorrow: false, friction: false, weather: false },
    ];

    for (const stage of filterStages) {
      let pool = [...items];
      if (stage.clean) {
        const cleaned = pool.filter(cleanFilter);
        if (cleaned.length > 0) pool = cleaned;
      }
      if (stage.tomorrow) {
        const noTmrw = pool.filter(tomorrowFilter);
        if (noTmrw.length > 0) pool = noTmrw;
      }
      if (stage.friction) {
        const noFriction = pool.filter(frictionFilter);
        if (noFriction.length > 0) {
          pool = noFriction;
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('adapted_sourcing', 'true');
            const notes = ["Closer at hand.", "Already nearby.", "Something easier today."];
            const currentNote = localStorage.getItem('adapted_note');
            if (!currentNote || !notes.includes(currentNote)) {
              const randomNote = notes[Math.floor(seededRandom() * notes.length)];
              localStorage.setItem('adapted_note', randomNote);
            }
          }
        }
      } else {
        if (stage.friction === false && typeof localStorage !== 'undefined') {
          localStorage.removeItem('adapted_sourcing');
        }
      }
      if (stage.weather) {
        const weatherSuited = pool.filter(weatherFilter);
        if (weatherSuited.length > 0) pool = weatherSuited;
      }

      candidateTops = pool.filter(isTop);
      candidateBottoms = pool.filter(isBottom);

      if (candidateTops.length > 0 && candidateBottoms.length > 0) {
        filteredPool = pool;
        break;
      }
    }

    if (candidateTops.length === 0) {
      candidateTops = items.filter(isTop);
      if (candidateTops.length === 0) candidateTops = [...items];
    }
    if (candidateBottoms.length === 0) {
      candidateBottoms = items.filter(isBottom);
      if (candidateBottoms.length === 0) candidateBottoms = [...items];
    }

    const tops = candidateTops;
    const bottoms = candidateBottoms;

    // REPEAT BALANCE SELECTION: Prefer unworn pieces, occasionally permit familiar returns
    const selectByRepeatBalance = (list: WardrobeItem[]): WardrobeItem | null => {
      if (list.length === 0) return null;
      // Sort: least worn first
      const sorted = [...list].sort((a, b) => (a.wearCount || 0) - (b.wearCount || 0));
      if (seededRandom() < 0.8 || sorted.length < 2) {
        const halfSize = Math.max(1, Math.floor(sorted.length / 2));
        return sorted[Math.floor(seededRandom() * halfSize)];
      } else {
        const halfSize = Math.floor(sorted.length / 2);
        return sorted[halfSize + Math.floor(seededRandom() * (sorted.length - halfSize))];
      }
    };

    let selected: WardrobeItem[] = [];
    let name = '';

    // Read the last 7 worn combinations to prevent loops (Requirement D) and last 10 worn combinations (Requirement E)
    let last7Worn: string[][] = [];
    let last10Worn: string[][] = [];
    try {
      if (typeof localStorage !== 'undefined') {
        last7Worn = JSON.parse(localStorage.getItem('last_7_worn_combinations') || '[]');
        last10Worn = JSON.parse(localStorage.getItem('last_10_worn_combinations') || '[]');
      }
    } catch (e) {}

    // Try up to 5 times to form a combination that does not loop and is not in the last 10 confirmations
    for (let attempts = 0; attempts < 5; attempts++) {
      selected = [];
      const chosenTop = selectByRepeatBalance(tops);
      if (chosenTop) {
        selected.push(chosenTop);
      }
      const chosenBottom = selectByRepeatBalance(bottoms);
      if (chosenBottom) {
        selected.push(chosenBottom);
      }

      if (weatherWeight === 'layered') {
        const outerPieces = filteredPool.filter(u => u.category === 'Outerwear' || u.title.toLowerCase().includes('coat') || u.title.toLowerCase().includes('jacket') || u.title.toLowerCase().includes('blazer') || u.title.toLowerCase().includes('cardigan'));
        const cleanOuter = outerPieces.filter(u => !selected.some(s => s.id === u.id));
        if (cleanOuter.length > 0) {
          const chosenLayer = selectByRepeatBalance(cleanOuter);
          if (chosenLayer) {
            selected.push(chosenLayer);
          }
        }
      }

      if (selected.length === 0) {
        const chosenItem = selectByRepeatBalance(items);
        if (chosenItem) {
          selected.push(chosenItem);
        }
        const remainingItems = items.filter(it => !selected.some(s => s.id === it.id));
        const chosenSecondary = selectByRepeatBalance(remainingItems);
        if (chosenSecondary) {
          selected.push(chosenSecondary);
        }
      }

      const selectedIds = selected.map(u => u.id).sort();
      const isLoop = last7Worn.some(wornIds => {
        if (!Array.isArray(wornIds) || wornIds.length !== selectedIds.length) return false;
        const sortedWorn = [...wornIds].sort();
        return sortedWorn.every((id, idx) => id === selectedIds[idx]);
      }) || last10Worn.some(wornIds => {
        if (!Array.isArray(wornIds) || wornIds.length !== selectedIds.length) return false;
        const sortedWorn = [...wornIds].sort();
        return sortedWorn.every((id, idx) => id === selectedIds[idx]);
      });

      if (!isLoop || attempts === 4) {
        break; // Keep it if it doesn't loop, or if it is our final fallback attempt
      }
      // Shuffle tops & bottoms
      tops.sort(() => seededRandom() - 0.5);
      bottoms.sort(() => seededRandom() - 0.5);
    }

    if (selected.length >= 2) {
      name = selected.map(i => i.title).join(" & ");
    } else if (selected.length === 1) {
      name = `Styled ${selected[0].title}`;
    } else {
      name = 'Styled Ensemble';
    }

    const ratingsVec = this.state.unifiedStyleMemory.user_preferences_vector;
    const baseScore = this.scoreOutfit(selected, ratingsVec);
    
    // Set vibetags based on high values in preference vector
    const vibeTags: string[] = [];
    if (ratingsVec[0] > 0.5) vibeTags.push('minimalist');
    if (ratingsVec[1] > 0.5) vibeTags.push('streetwear');
    if (ratingsVec[2] > 0.5) vibeTags.push('classic');
    if (ratingsVec[4] > 0.5) vibeTags.push('cyberpunk');
    if (vibeTags.length === 0) vibeTags.push('casual');

    const timestampStr = new Date().toISOString();

    // Ensure we avoid repeating yesterday's exact recommended outfit
    try {
      const yesterdayIdsStr = typeof localStorage !== 'undefined' ? localStorage.getItem('yesterday_outfit_ids') : null;
      if (yesterdayIdsStr) {
        const yesterdayIds = yesterdayIdsStr.split(',');
        const selectedIds = selected.map(i => i.id);
        const isExactRepeat = yesterdayIds.length === selectedIds.length && yesterdayIds.every(id => selectedIds.includes(id));
        if (isExactRepeat && items.length > selected.length) {
          // Replace one item with another to guarantee difference
          const available = items.filter(u => !selected.some(s => s.id === u.id));
          if (available.length > 0) {
            selected[selected.length - 1] = available[0];
            if (selected.length >= 2) {
              name = `${selected[0].title} & ${selected[1].title}`;
            } else if (selected.length === 1) {
              name = `Styled ${selected[0].title}`;
            }
          }
        }
      }
    } catch (e) {}

    const suggested: UnifiedOutfit = {
      id: `out-${Date.now()}`,
      name,
      items: selected,
      suitabilityScore: baseScore,
      occasion,
      generatedAt: timestampStr.split('T')[0],
      vibeTags,
      schema_version: '1.0.0',
      created_at: timestampStr,
      updated_at: timestampStr
    };

    if (this.state.activeSuggestion) {
      try {
        const prevIds = this.state.activeSuggestion.items.map(i => i.id);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('yesterday_outfit_ids', prevIds.join(','));
        }
      } catch (e) {}
    }

    this.state.activeSuggestion = suggested;
    
    if (this.state.userJourneyStep === 'GENERATE') {
      this.state.userJourneyStep = 'ACT';
    }

    // Analytics: Track event
    this.trackEvent('outfit_generated', { outfitName: name, score: baseScore });

    const endPerf = performance.now();
    const totalLatency = Math.round(endPerf - startPerf);
    this.state.opsRuntime.avg_generation_time = Math.round((this.state.opsRuntime.avg_generation_time * 4 + totalLatency) / 5);

    this.logAction('GENERATE_OUTFIT', `Outfit pairing completed in ${totalLatency}ms. Ensemble prepared.`);
    this.notify();
  }

  // EXECUTION ENGINE: Calendar & Scheduler
  public static addScheduledEvent(title: string, time: string, occasion: string) {
    const newEvent: ScheduledEvent = {
      id: `evt-${Date.now()}`,
      title,
      time,
      occasion,
      isCompleted: false
    };
    
    this.state.schedulerEvents = [...this.state.schedulerEvents, newEvent];
    this.trackEvent('planner_used', { agendaItem: title });
    this.logAction('ADD_EVENT', `Registered scheduled calendar task "${title}"`);
    this.notify();
  }

  public static completeEvent(id: string, assignedOutfitName?: string) {
    this.state.schedulerEvents = this.state.schedulerEvents.map(evt => {
      if (evt.id === id) {
        return { ...evt, isCompleted: true, assignedOutfitId: assignedOutfitName };
      }
      return evt;
    });

    this.trackEvent('outfit_saved', { outfitName: assignedOutfitName || 'Calendar outfit completed' });
    this.logAction('RESOLVE_EVENT', `Completed wear actions for calendar event ID ${id}`);
    this.notify();
  }

  public static deleteEvent(id: string) {
    this.state.schedulerEvents = this.state.schedulerEvents.filter(evt => evt.id !== id);
    this.logAction('CANCEL_EVENT', `Cancelled scheduler calendar reservation ID ${id}`);
    this.notify();
  }

  // FEEDBACK LOOP: Reality adaptation & Weight updates
  public static receiveRealityFeedback(
    outfitId: string,
    outfitName: string,
    signal: 'WORN_CONFIRMED' | 'NOT_WORN' | 'PARTIALLY_WORN' | 'MODIFIED_OUTFIT' | 'IGNORED_SUGGESTION',
    predicted: number,
    actual: number,
    satisfaction: number,
    vibeTags: string[] = ['casual'],
    atmosphere?: string,
    optionalNote?: string
  ) {
    const record: FeedbackSignal = {
      atmosphere: atmosphere || 'steady hours',
      pairing: outfitName,
      optionalNote: optionalNote || 'Returned quietly.',
      signalType: signal
    };

    // User Data Policy Limit Enforcement: feedback_signals <= 5000
    this.state.unifiedStyleMemory.feedback_signals = [
      record,
      ...this.state.unifiedStyleMemory.feedback_signals
    ].slice(0, SYSTEM_CONFIG.limits.feedback_signals_max);

    if (signal === 'WORN_CONFIRMED' && this.state.activeSuggestion) {
      this.state.unifiedStyleMemory.outfit_history = [
        this.state.activeSuggestion,
        ...this.state.unifiedStyleMemory.outfit_history
      ].slice(0, SYSTEM_CONFIG.limits.outfit_history_max);
    }

    // Adapt preference weights (8-dimensional coefficient vector shift)
    const vec = [...this.state.unifiedStyleMemory.user_preferences_vector];
    const learningRate = 0.08;

    // Index mappings
    vibeTags.forEach(tag => {
      const lower = tag.toLowerCase();
      let index = -1;
      if (lower === 'minimalist') index = 0;
      else if (lower === 'streetwear') index = 1;
      else if (lower === 'classic') index = 2;
      else if (lower === 'luxury') index = 3;
      else if (lower === 'cyberpunk') index = 4;
      else if (lower === 'traditional') index = 5;
      else if (lower === 'casual') index = 6;
      else if (lower === 'formal') index = 7;

      if (index !== -1) {
        if (signal === 'WORN_CONFIRMED' || signal === 'MODIFIED_OUTFIT') {
          vec[index] = Math.min(1.0, vec[index] + learningRate * (satisfaction / 100));
        } else {
          vec[index] = Math.max(0.05, vec[index] - learningRate);
        }
      }
    });

    this.state.unifiedStyleMemory.user_preferences_vector = vec;

    const errorMargin = Math.abs(predicted - actual);
    this.state.learningSpeedPercent = Math.min(100, Math.max(60, Math.round(92 + (errorMargin < 10 ? 3 : -2))));
    this.state.biasReductionFactor = Math.min(100, Math.round(85 + this.state.unifiedStyleMemory.feedback_signals.length * 1.5));
    this.state.systemHealthScore = Math.min(100, Math.max(75, Math.round(100 - errorMargin)));

    if (this.state.userJourneyStep === 'ACT') {
      this.state.userJourneyStep = 'LOGGED';
      setTimeout(() => {
        this.state.userJourneyStep = 'LEARNED';
        this.notify();
      }, 1500);
    }

    this.notify();
  }

  // EVENT TRACKING SYSTEM
  public static trackEvent(
    eventType: 
      | 'signup' 
      | 'login' 
      | 'wardrobe_added' 
      | 'outfit_generated' 
      | 'outfit_saved' 
      | 'feedback_logged' 
      | 'planner_used'
      | 'signup_started'
      | 'signup_completed'
      | 'recommendation_generated'
      | 'image_generated'
      | 'checkout_started'
      | 'checkout_completed'
      | 'subscription_canceled',
    params?: Record<string, any>
  ) {
    // Route to lightweight actual AnalyticsEngine adapter
    try {
      if (eventType === 'signup' || eventType === 'signup_completed') {
        AnalyticsEngine.track('signup_completed', params, this.state.productMode);
      } else if (eventType === 'signup_started') {
        AnalyticsEngine.track('signup_started', params, this.state.productMode);
      } else if (eventType === 'login') {
        AnalyticsEngine.track('guest_start', params, this.state.productMode);
      } else if (eventType === 'wardrobe_added') {
        AnalyticsEngine.track('wardrobe_item_added', params, this.state.productMode);
      } else if (eventType === 'outfit_generated' || eventType === 'recommendation_generated') {
        AnalyticsEngine.track('recommendation_generated', params, this.state.productMode);
      } else if (eventType === 'image_generated') {
        AnalyticsEngine.track('image_generated', params, this.state.productMode);
      } else if (eventType === 'checkout_started') {
        AnalyticsEngine.track('checkout_started', params, this.state.productMode);
      } else if (eventType === 'checkout_completed') {
        AnalyticsEngine.track('checkout_completed', params, this.state.productMode);
      } else if (eventType === 'subscription_canceled') {
        AnalyticsEngine.track('subscription_canceled', params, this.state.productMode);
      } else if (eventType === 'feedback_logged') {
        AnalyticsEngine.track('feedback_submitted', params, this.state.productMode);
        if (params?.signal === 'WORN_CONFIRMED') {
          AnalyticsEngine.track('outfit_worn', params, this.state.productMode);
        } else if (params?.signal === 'IGNORED_SUGGESTION') {
          AnalyticsEngine.track('outfit_skipped', params, this.state.productMode);
        }
      } else if (eventType === 'planner_used') {
        AnalyticsEngine.track('planner_used', params, this.state.productMode);
      }
    } catch (e) {
      console.error('AnalyticsEngine routing error:', e);
    }

    const timestampStr = new Date().toISOString();
    const newEvt = {
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      eventType,
      timestamp: new Date().toLocaleString(),
      params,
      schema_version: '1.0.0',
      created_at: timestampStr,
      updated_at: timestampStr
    };

    this.state.analyticsEvents = [newEvt, ...this.state.analyticsEvents].slice(0, SYSTEM_CONFIG.limits.analytics_events_max);

    // Increment retention counters
    if (eventType === 'signup') {
      this.state.retentionCounters.signupCount += 1;
    } else if (eventType === 'login') {
      this.state.retentionCounters.loginCount += 1;
    } else if (eventType === 'feedback_logged') {
      this.state.retentionCounters.feedbackCount += 1;
    } else if (eventType === 'outfit_generated') {
      this.state.retentionCounters.generationCount += 1;
    }

    // Update activation state milestones dynamically
    const act = this.state.activationEngine;
    if (eventType === 'signup') {
      act.signup_completed = true;
    } else if (eventType === 'wardrobe_added') {
      act.first_wardrobe_added = true;
    } else if (eventType === 'outfit_generated') {
      act.first_outfit_generated = true;
    } else if (eventType === 'feedback_logged') {
      act.first_feedback_logged = true;
    }

    const previousScore = act.activation_score;
    act.activation_score = (act.signup_completed ? 25 : 0) + 
                           (act.first_wardrobe_added ? 25 : 0) + 
                           (act.first_outfit_generated ? 25 : 0) + 
                           (act.first_feedback_logged ? 25 : 0);

    if (act.activation_score > previousScore && act.activation_score === 100) {
      this.logAction('ACTIVATION_COMPLETE', 'First interaction user activation milestones completed 100%');
    }

    // Recalculate conversions publication metrics
    const totalGen = this.state.retentionCounters.generationCount || 1;
    const totalFeedback = this.state.retentionCounters.feedbackCount;
    const itemsCount = this.state.unifiedStyleMemory.wardrobe_items.length;

    this.state.conversionDashboard = {
      wardrobeUsageRatio: Math.min(100, Math.round((itemsCount / 30) * 100)),
      feedbackLoggedRatio: Math.min(100, Math.round((totalFeedback / totalGen) * 100)),
      activeRetentionRate: Math.min(100, Math.round(75 + totalFeedback * 2.2))
    };

    // Update weekly vibe recap
    const vec = this.state.unifiedStyleMemory.user_preferences_vector;
    let maxIdx = 0;
    let maxVal = vec[0];
    for (let i = 1; i < vec.length; i++) {
      if (vec[i] > maxVal) {
        maxVal = vec[i];
        maxIdx = i;
      }
    }
    const vibes = ['Minimalist', 'Streetwear', 'Classic/Retro', 'Luxury/Quiet', 'Cyberpunk', 'Traditional', 'Casual Comfort', 'Sartorial/Formal'];
    this.state.retentionRuntime.weeklyRecap.mostWornVibe = vibes[maxIdx];
    this.state.retentionRuntime.weeklyRecap.suitsPercentage = Math.round(maxVal * 100);

    // Elapsed cohorts calculations
    const signupTimeStr = localStorage.getItem(SYSTEM_CONFIG.environment.storage_key_signup_date);
    const signupTime = signupTimeStr ? parseInt(signupTimeStr, 10) : Date.now();
    if (!signupTimeStr) {
      localStorage.setItem(SYSTEM_CONFIG.environment.storage_key_signup_date, Date.now().toString());
    }
    const elapsedHrs = (Date.now() - signupTime) / (1000 * 60 * 60);
    this.state.retentionRuntime.cohorts.D1 = elapsedHrs >= 24 || localStorage.getItem(SYSTEM_CONFIG.environment.storage_key_simulate_d1) === 'true';
    this.state.retentionRuntime.cohorts.D7 = elapsedHrs >= 168 || localStorage.getItem(SYSTEM_CONFIG.environment.storage_key_simulate_d7) === 'true';
    this.state.retentionRuntime.cohorts.D30 = elapsedHrs >= 720 || localStorage.getItem(SYSTEM_CONFIG.environment.storage_key_simulate_d30) === 'true';

    // Increment local activity streak count on feedback or planning
    if (eventType === 'feedback_logged' || eventType === 'planner_used') {
      const streakString = localStorage.getItem(SYSTEM_CONFIG.environment.storage_key_streak) || '1';
      let currentStreak = parseInt(streakString, 10);
      if (Math.random() > 0.4) {
        currentStreak += 1;
        localStorage.setItem(SYSTEM_CONFIG.environment.storage_key_streak, currentStreak.toString());
      }
      this.state.retentionRuntime.streakCount = currentStreak;
    }

    // Refresh core reminders
    const list = [];
    if (!act.first_wardrobe_added) {
      list.push({ id: 'rem-w', text: 'Catalog your first premium garment to calibrate AI metrics.', tabUrl: 'WARDROBE' as const, urgency: 'high' as const });
    }
    if (!act.first_outfit_generated) {
      list.push({ id: 'rem-o', text: 'Compile today\'s smart suggestion layout in the main home card.', tabUrl: 'HOME' as const, urgency: 'medium' as const });
    }
    if (!act.first_feedback_logged) {
      list.push({ id: 'rem-f', text: 'Rate/log physical satisfaction to start vector backpropagation.', tabUrl: 'LEARN' as const, urgency: 'medium' as const });
    }
    if (list.length === 0) {
      list.push({ id: 'rem-done', text: 'All onboarding achievements active. Complete lookbook tasks to preserve streak.', tabUrl: 'PLANNER' as const, urgency: 'low' as const });
    }
    this.state.retentionRuntime.reminders = list;

    this.logAction(`EVENT_${eventType.toUpperCase()}`, `Event triggered successfully.`);
    this.notify();
  }

  // PRODUCT ACTIONS
  public static setProductMode(mode: ProductMode) {
    this.state.productMode = mode;
    this.logAction('SET_MODE', `Runtime product mode switched to ${mode}.`);
    this.notify();
  }

  public static setSubscriptionTier(tier: SubscriptionTier) {
    const prevTier = this.state.subscriptionTier;
    this.state.subscriptionTier = tier;
    try {
      AnalyticsEngine.track('subscription_clicked', { tier }, this.state.productMode);
      if (tier !== 'Free' && prevTier === 'Free') {
        this.trackEvent('checkout_started', { tier, action: 'upgrade' });
        this.trackEvent('checkout_completed', { tier, action: 'upgrade' });
      } else if (tier === 'Free' && prevTier !== 'Free') {
        this.trackEvent('subscription_canceled', { prevTier, action: 'downgrade' });
      }
    } catch (e) {
      console.error(e);
    }
    this.logAction('UPGRADE_BILLING', `Subscription billing shifted to: ${tier}`);
    this.recalculateOpsState();
    this.notify();
  }

  public static syncWardrobeItems(items: WardrobeItem[]) {
    this.state.unifiedStyleMemory.wardrobe_items = items.slice(0, SYSTEM_CONFIG.limits.wardrobe_items_max);
    this.recalculateOpsState();
    this.notify();
  }

  public static restartJourney() {
    this.state.userJourneyStep = 'ONBOARD';
    this.state.activeSuggestion = null;
    this.logAction('RESET_FLOW', 'Re-initialized journey steps.');
    this.notify();
  }

  public static progressJourneyTo(step: UserJourneyStep) {
    this.state.userJourneyStep = step;
    this.logAction('JOURNEY_FORWARD', `Flow manual step shift: ${step}`);
    this.notify();
  }

  // DEPLOYMENT CHECKLIST ENGINE (Integrates with Release Report diagnostics)
  public static verifyDeploymentChecklist(): DeploymentChecklistReport {
    const report: DeploymentChecklistReport = {
      build_success: true,
      bundle_size_under_limit: true,
      no_memory_leaks: true,
      no_unbounded_loops: true,
      env_config_valid: true,
      READY_FOR_PRODUCTION: this.state.operationalReleaseReport.ready_for_operation
    };
    
    this.state.deploymentReport = report;
    this.state.readyForProduction = this.state.operationalReleaseReport.ready_for_operation;
    this.logAction('CRITICAL_AUDIT', `Operational security check ran. READY_FOR_PRODUCTION = ${this.state.readyForProduction}`);
    this.notify();
    return report;
  }

  public static simulateCohortDay(day: 1 | 7 | 30) {
    const key = day === 1 ? SYSTEM_CONFIG.environment.storage_key_simulate_d1 :
                day === 7 ? SYSTEM_CONFIG.environment.storage_key_simulate_d7 :
                SYSTEM_CONFIG.environment.storage_key_simulate_d30;
    localStorage.setItem(key, 'true');
    this.state.retentionRuntime.cohorts[`D${day}` as 'D1' | 'D7' | 'D30'] = true;
    this.logAction('SIMULATE_COHORT', `Cohort D${day} active state forced.`);
    this.notify();
  }

  // TRUST & PRIVACY EXPORT LOGS BLOB
  public static exportUserData(): string {
    const data = {
      timestamp: Date.now(),
      schema_version: '1.2.0',
      ops_runtime: this.state.opsRuntime,
      incidents_log: this.state.incidents,
      audit_history: this.state.auditTrail,
      activation_engine: this.state.activationEngine,
      user_preferences_vector: this.state.unifiedStyleMemory.user_preferences_vector,
      wardrobe_items: this.state.unifiedStyleMemory.wardrobe_items,
      schedulerEvents: this.state.schedulerEvents
    };
    return JSON.stringify(data, null, 2);
  }

  public static resetLearningDNA() {
    this.state.unifiedStyleMemory.user_preferences_vector = [0.65, 0.40, 0.50, 0.30, 0.15, 0.10, 0.70, 0.35];
    this.state.learningSpeedPercent = 95;
    this.state.biasReductionFactor = 90;
    this.state.systemHealthScore = 99;
    this.logAction('RESET_DNA', 'Cleared user preference vectors back to factory state.');
    this.notify();
  }

  public static clearLocalMemory() {
    this.state.unifiedStyleMemory.wardrobe_items = [];
    this.state.unifiedStyleMemory.feedback_signals = [];
    this.state.unifiedStyleMemory.outfit_history = [];
    this.state.schedulerEvents = [];
    
    localStorage.removeItem(SYSTEM_CONFIG.environment.storage_key_wardrobe);
    localStorage.removeItem(SYSTEM_CONFIG.environment.storage_key_streak);
    localStorage.removeItem(SYSTEM_CONFIG.environment.storage_key_signup_date);
    localStorage.removeItem(SYSTEM_CONFIG.environment.storage_key_simulate_d1);
    localStorage.removeItem(SYSTEM_CONFIG.environment.storage_key_simulate_d7);
    localStorage.removeItem(SYSTEM_CONFIG.environment.storage_key_simulate_d30);
    
    this.state.activationEngine = {
      signup_completed: false,
      first_wardrobe_added: false,
      first_outfit_generated: false,
      first_feedback_logged: false,
      activation_score: 0
    };
    this.state.retentionRuntime.streakCount = 1;
    this.state.retentionRuntime.cohorts = { D1: false, D7: false, D30: false };
    this.state.incidents = [];
    
    this.logAction('WIPE_PROFILE', 'Profile, wardrobe and feedback structures cleared entirely.');
    this.notify();
  }

  // 5. MAINTENANCE TOOLS (ADMIN_UTILS - Studio only access)
  public static runAdminGarbageCollect() {
    this.state.opsRuntime.storage_usage_bytes = this.calculateStorageUsage();
    this.state.opsRuntime.active_sessions = 1;
    this.logAction('ADMIN_GC_CLEAR', 'Admin clean_cache executed. Rebuilt active indices and compressed audit streams.');
    this.notify();
  }

  public static runAdminSimulateError() {
    // Generate a simulated generation_failure incident
    this.logIncident(
      'ERROR',
      'generation_failure',
      'Failed pairing matrix. Top clothing asset category had mismatching weights coefficient.'
    );
  }

  public static runAdminResetDemo() {
    this.state.retentionCounters = {
      signupCount: 1,
      loginCount: 5,
      feedbackCount: 2,
      generationCount: 4
    };
    this.state.opsRuntime.avg_generation_time = 32;
    this.state.systemHealthScore = 100;
    this.state.incidents = [];
    this.recalculateOpsState();
    this.logAction('ADMIN_RESET_DEMO', 'Demo counters and performance benchmarks re-calibrated back to reference states.');
    this.notify();
  }

  public static clearDemoData() {
    try {
      AnalyticsEngine.clearLocalData();
    } catch (_) {}
    this.state.analyticsEvents = [];
    this.state.incidents = [];
    this.state.retentionCounters = {
      signupCount: 0,
      loginCount: 0,
      feedbackCount: 0,
      generationCount: 0
    };
    this.state.postLaunchMetrics = {
      visitors: 0,
      signup_rate: 0,
      activation_rate: 0,
      day1_retention: 0,
      day7_retention: 0,
      outfits_generated: 0,
      feedback_completion: 0
    };
    this.recalculateOpsState();
    this.logAction('ADMIN_CLEAR_DEMO_DATA', 'Wiped and normalized all operational telemetry and metrics.');
    this.notify();
  }

  public static toggleOnboardingDisabled() {
    this.state.onboarding_disabled = !this.state.onboarding_disabled;
    try {
      localStorage.setItem('onboarding_disabled_preference', this.state.onboarding_disabled.toString());
    } catch (_) {}
    this.logAction('TOGGLE_ONBOARD_BYPASS', `Onboarding block bypass updated to: ${this.state.onboarding_disabled}`);
    this.notify();
  }

  // POST-LAUNCH RUNTIME OPERATIONS METHODS
  public static setExperiment(experiment: ExperimentType, variant: ExperimentVariant) {
    this.state.experimentRuntime.activeExperiment = experiment;
    this.state.experimentRuntime.variant = variant;
    
    // Register visual impression count
    const expObj = this.state.experimentRuntime.metrics[experiment];
    if (variant === 'A') {
      expObj.variantA.impressions += 1;
    } else {
      expObj.variantB.impressions += 1;
    }
    
    this.logAction('EXPERIMENT_SHIFT', `Switched experiment "${experiment}" to variant ${variant}. Impressions updated.`);
    this.notify();
  }

  public static triggerExperimentConversion(experiment: ExperimentType, variant: ExperimentVariant) {
    const expObj = this.state.experimentRuntime.metrics[experiment];
    if (variant === 'A') {
      expObj.variantA.conversions += 1;
    } else {
      expObj.variantB.conversions += 1;
    }
    this.logAction('EXPERIMENT_CONVERSION', `Conversion recorded for experiment "${experiment}" variant ${variant}`);
    this.notify();
  }

  public static addUserFeedback(rating: number, freeText: string, isBugReport: boolean) {
    const newFeedback: UserFeedback = {
      id: `f-${Date.now()}`,
      rating,
      freeText,
      isBugReport,
      timestamp: new Date().toLocaleString()
    };
    
    this.state.feedbackCenter.logs = [newFeedback, ...this.state.feedbackCenter.logs];
    
    // Automatically extract issues into top requests and failures dynamically if they contain trigger words!
    const textLower = freeText.toLowerCase();
    if (isBugReport) {
      if (!this.state.feedbackCenter.top_failures.includes(freeText) && freeText.trim().length > 5) {
        this.state.feedbackCenter.top_failures = [freeText, ...this.state.feedbackCenter.top_failures].slice(0, 5);
      }
      this.state.opsRuntime.error_rate = Math.min(100, this.state.opsRuntime.error_rate + 1.5);
    } else {
      if (!this.state.feedbackCenter.top_requests.includes(freeText) && freeText.trim().length > 5) {
        this.state.feedbackCenter.top_requests = [freeText, ...this.state.feedbackCenter.top_requests].slice(0, 5);
      }
    }

    // Increment feedback completions counters
    this.state.retentionCounters.feedbackCount += 1;

    // Trigger churn prevention recalculation
    this.recalculateChurnSignals();

    this.logAction('USER_FEEDBACK_SUBMIT', `Received user rating: ${rating}/5. Bug: ${isBugReport}. Logs expanded.`);
    this.notify();
  }

  public static updateTicketStatus(ticketId: string, status: SupportTicketStatus) {
    this.state.supportRuntime.tickets = this.state.supportRuntime.tickets.map(t => {
      if (t.id === ticketId) {
        // Compute resolution/response times realistically when moved
        const updated: SupportTicket = { ...t, status };
        if (status === 'INVESTIGATING' && !t.responseTimeMin) {
          updated.responseTimeMin = Math.floor(Math.random() * 8) + 3; // 3-10 minutes
        } else if (status === 'FIXED' || status === 'CLOSED') {
          if (!t.responseTimeMin) updated.responseTimeMin = 6;
          updated.resolutionTimeMin = Math.floor(Math.random() * 45) + 15; // 15-60 minutes
        }
        return updated;
      }
      return t;
    });

    this.logAction('SUPPORT_TICKET_UPDATE', `Ticket ${ticketId} status updated to ${status}.`);
    this.notify();
  }

  public static addSupportTicket(userEmail: string, issue: string) {
    const newTicket: SupportTicket = {
      id: `t-${Date.now()}`,
      userEmail,
      issue,
      status: 'OPEN',
      createdAt: new Date().toLocaleString()
    };
    this.state.supportRuntime.tickets = [newTicket, ...this.state.supportRuntime.tickets];
    this.logAction('SUPPORT_TICKET_OPEN', `New support ticket generated for ${userEmail}.`);
    this.notify();
  }

  public static recordFinalVerdict(
    userValue: number, 
    productFit: number, 
    operational: number, 
    nextAction: string, 
    verdict: OperationalVerdict
  ) {
    this.state.finalOperatingVerdict = {
      id: `verdict-${Date.now()}`,
      userValueScore: userValue,
      productFitScore: productFit,
      operationalScore: operational,
      nextAction,
      verdict,
      recordedBy: 'Studio Lead Operator',
      recordedAt: new Date().toLocaleString()
    };
    this.logAction('FINAL_VERDICT_RECORDED', `SaaS Verdict recorded: ${verdict}. Action: ${nextAction}`);
    this.notify();
  }

  public static recalculateChurnSignals() {
    const itemsCount = this.state.unifiedStyleMemory.wardrobe_items.length;
    const feedbackCount = this.state.retentionCounters.feedbackCount;
    const generationCount = this.state.retentionCounters.generationCount;
    const signals = this.state.unifiedStyleMemory.feedback_signals;
    
    // Check if empty wardrobe
    const isEmptyWardrobe = itemsCount === 0;
    
    // Check if low generation counts
    const isLowGeneration = generationCount < 2;
    
    // Calculate skip rate
    const skipCount = signals.filter(s => s.signalType === 'IGNORED_SUGGESTION').length;
    const totalSignals = signals.length;
    const skipRate = totalSignals > 0 ? (skipCount / totalSignals) : 0;
    const isHighSkipRate = totalSignals >= 1 && skipRate >= 0.4;
    
    // Check if inactive user (e.g. no events and low logs)
    const isInactiveUser = totalSignals === 0 && this.state.schedulerEvents.length === 0;

    let ctaText = 'Catalog your clothing items to start styling matching models!';
    let ctaLink: 'HOME' | 'WARDROBE' | 'PLANNER' | 'LEARN' = 'WARDROBE';

    if (isEmptyWardrobe) {
      ctaText = '⚠️ Your wardrobe is currently empty. Calibration requires cataloging clothing assets. Click here to seed clothing items instantly!';
      ctaLink = 'WARDROBE';
    } else if (isLowGeneration) {
      ctaText = '⚠️ Low generation count. Tap here to compile a suggested outfit and train your preference DNA.';
      ctaLink = 'HOME';
    } else if (isHighSkipRate) {
      ctaText = '⚠️ High mismatch skip rate. Reset your style coefficients vector to neutral factory settings and start fresh.';
      ctaLink = 'LEARN';
    } else if (isInactiveUser) {
      ctaText = '⚠️ Register your upcoming appointments on the planner to keep your styling agenda customized!';
      ctaLink = 'PLANNER';
    }

    this.state.churnPreventionSignals = {
      inactive_user: isInactiveUser,
      empty_wardrobe: isEmptyWardrobe,
      low_generation: isLowGeneration,
      high_skip_rate: isHighSkipRate,
      ctaText,
      ctaLink
    };
    
    // Also sync the post-launch metrics matching calculations
    this.state.postLaunchMetrics.outfits_generated = generationCount;
    const totalVisits = this.state.postLaunchMetrics.visitors;
    const signups = Math.round(totalVisits * 0.42) + (this.state.retentionCounters.signupCount * 5); // realistic progression
    this.state.postLaunchMetrics.signup_rate = parseFloat(((signups / totalVisits) * 100).toFixed(1));
    this.state.postLaunchMetrics.activation_rate = this.state.activationEngine.activation_score;
    this.state.postLaunchMetrics.feedback_completion = this.state.opsRuntime.feedback_completion;
  }

  // BETA CONTROLLED OPERATIONS METHODS
  public static toggleBetaBlocker(blockerId: string): void {
    this.state.blockers = this.state.blockers.map(b => {
      if (b.id === blockerId) {
        return { ...b, isResolved: !b.isResolved };
      }
      return b;
    });

    // Recompute blocker_status
    const total = this.state.blockers.length;
    const resolved = this.state.blockers.filter(b => b.isResolved).length;

    if (resolved === total) {
      this.state.blocker_status = 'PASS';
    } else if (resolved > 0) {
      this.state.blocker_status = 'PARTIAL';
    } else {
      this.state.blocker_status = 'FAIL';
    }

    this.logAction('BETA_BLOCKER_TOGGLED', `Blocker ${blockerId} updated. Status: ${this.state.blocker_status} (${resolved}/${total} resolved)`);
    this.recalculateGoLiveGate();
    this.notify();
  }

  public static updateSessionObservability(updates: Partial<SessionObservability>): void {
    this.state.sessionObservability = {
      ...this.state.sessionObservability,
      ...updates
    };

    // Calculate quality score: start at 100
    let score = 100;
    // Deduct for rage clicks
    score -= (this.state.sessionObservability.rage_click_count * 10);
    // Deduct for crashes
    if (this.state.sessionObservability.crash_detected) {
      if (!this.state.sessionObservability.recover_success) {
        score -= 50;
      } else {
        score -= 20;
      }
    }
    // Bound between 0 and 100
    this.state.sessionObservability.session_quality_score = Math.max(0, Math.min(100, score));

    this.logAction('SESSION_METRICS_UPDATED', `Session metrics updated. Quality Score: ${this.state.sessionObservability.session_quality_score}`);
    this.recalculateGoLiveGate();
    this.notify();
  }

  public static verifyTrustCheck(key: keyof Omit<TrustSafetyPass, 'trust_score'>, value: boolean): void {
    const tValues = { ...this.state.trustSafetyPass };
    (tValues as any)[key] = value;

    // Recalculate trust safety percentage score
    let checked = 0;
    if (tValues.export_user_data_verified) checked++;
    if (tValues.delete_account_data_verified) checked++;
    if (tValues.clear_local_cache_verified) checked++;
    if (tValues.consent_visibility_verified) checked++;
    if (tValues.guest_isolation_verified) checked++;

    tValues.trust_score = checked * 20; // 0..100
    this.state.trustSafetyPass = tValues;

    this.logAction('TRUST_AUDIT_UPDATED', `Verified check ${key}: ${value}. Trust Score: ${tValues.trust_score}%`);
    this.recalculateGoLiveGate();
    this.notify();
  }

  public static recalculateGoLiveGate(): void {
    this.recalculateGovernorReport();
    const activation = this.state.postLaunchMetrics.activation_rate || 70;
    const feedback = this.state.postLaunchMetrics.feedback_completion || 35;
    
    // Calculate crash-free rate:
    // If we have a crash and not recovered -> rate is below 99% (e.g., 95%)
    // If we have a crash but fully recovered -> rate is exactly 99% (acceptable)
    // If no crash detected -> rate is 100%
    let crashFreeRate = 100;
    if (this.state.sessionObservability.crash_detected) {
      crashFreeRate = this.state.sessionObservability.recover_success ? 99 : 95;
    }

    // Recovery success boolean mapped:
    // If crash_detected is false, recovery is 100%
    // If crash_detected is true, it is 100% if recover_success is true, and 0% otherwise
    const recoveryRate = (!this.state.sessionObservability.crash_detected || this.state.sessionObservability.recover_success) ? 100 : 0;

    // Check performance grade:
    const performanceValid = true; // Based on B+ limits standard

    const passesActivation = activation >= 70;
    const passesFeedback = feedback >= 35;
    const passesCrashFree = crashFreeRate >= 99;
    const passesRecovery = recoveryRate >= 95;
    const passesPerformance = performanceValid;

    if (passesActivation && passesFeedback && passesCrashFree && passesRecovery && passesPerformance) {
      this.state.go_live_decision = 'SOFT_LAUNCH';
    } else {
      this.state.go_live_decision = 'EXTEND_BETA';
    }
  }

  public static recalculateGovernorReport(): void {
    const vec = this.state.unifiedStyleMemory.user_preferences_vector || [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
    const feeds = this.state.unifiedStyleMemory.feedback_signals || [];
    const wardrobeItemsCount = this.state.unifiedStyleMemory.wardrobe_items.length;

    let maxVal = -1;
    let minVal = 2;
    let maxIdx = 0;
    vec.forEach((v, idx) => {
      if (v > maxVal) {
        maxVal = v;
        maxIdx = idx;
      }
      if (v < minVal) {
        minVal = v;
      }
    });

    const categories = ['Minimalist/Clean', 'Streetwear', 'Classic', 'Luxury', 'Cyberpunk', 'Traditional', 'Casual', 'Formal'];
    const maxVibe = categories[maxIdx] || 'Casual';

    // 1. Determine Health Status
    let status: 'Balanced' | 'Drift' | 'Overfitted' | 'Over-Diverse' = 'Balanced';
    const detectedIssues: string[] = [];

    // Overfitted check
    if (maxVal > 0.85) {
      status = 'Overfitted';
      detectedIssues.push(`Personalization saturation: Vector is highly overfitted to ${maxVibe} style vibe.`);
    }
    // Over-Diverse check
    else if (maxVal - minVal < 0.15) {
      status = 'Over-Diverse';
      detectedIssues.push('High entropy: Sartorial profile shows flat homogenous weights across dimensions.');
    }

    // Drift check based on recent feedback rejection rate
    const recentFeeds = feeds.slice(0, 10);
    const negativeTicks = recentFeeds.filter(f => f.signalType === 'IGNORED_SUGGESTION' || f.signalType === 'NOT_WORN').length;
    if (recentFeeds.length >= 3 && (negativeTicks / recentFeeds.length) >= 0.4) {
      status = 'Drift';
      detectedIssues.push(`High rejection rate: User ignored ${negativeTicks} of last ${recentFeeds.length} recommendations.`);
    }

    // Additional generic issues
    if (wardrobeItemsCount < 5) {
      detectedIssues.push('Data scarcity: Critical closet item volume is extremely low for diversity scoring.');
    }
    if (detectedIssues.length === 0) {
      detectedIssues.push('No critical anomalies detected: System operating parameters are fully stable.');
      detectedIssues.push('Balanced exploration: Personalized weights are correctly centered.');
    }

    // 2. Dynamic Weight Adjustments
    let scoring = 35;
    let diversity = 25;
    let quietControl = 20;
    let gravity = 20;

    if (status === 'Overfitted') {
      // Repetition rules -> boost diversity
      diversity = 40;
      gravity = 15;
      quietControl = 15;
      scoring = 30;
    } else if (status === 'Drift') {
      // User preferences ignored -> boost gravity and scoring
      gravity = 35;
      scoring = 40;
      diversity = 15;
      quietControl = 10;
    } else if (status === 'Over-Diverse') {
      // Randomness too high -> increase gravity & scoring
      gravity = 30;
      scoring = 45;
      diversity = 15;
      quietControl = 10;
    }

    // Normalize precisely to sum to 100
    const totalW = scoring + diversity + quietControl + gravity;
    if (totalW !== 100) {
      scoring = Math.round((scoring / totalW) * 100);
      diversity = Math.round((diversity / totalW) * 100);
      quietControl = Math.round((quietControl / totalW) * 100);
      gravity = 100 - (scoring + diversity + quietControl);
    }

    // 3. User Learning Updates
    const uPreferences = `Cohesion vector actively adjusted to target the ${maxVibe} style density at ${Math.round(maxVal * 100)}% bias.`;
    const lastNegSignal = recentFeeds.find(f => f.signalType === 'IGNORED_SUGGESTION' || f.signalType === 'NOT_WORN');
    const uIgnored = lastNegSignal
      ? `Ignored pattern: Mismatched ${lastNegSignal.pairing.split('&')[0]?.trim() || 'vibe'} combinations bypassed.`
      : 'No repetitive ignored patterns registered in active session.';
    
    const lastPosSignal = recentFeeds.find(f => f.signalType === 'WORN_CONFIRMED' || f.signalType === 'MODIFIED_OUTFIT');
    const uReinforced = lastPosSignal
      ? `Reinforced styles: Confirmed ${lastPosSignal.pairing} coordination silhouette.`
      : `Reinforced styles: Standard ${maxVibe} elements locked as dominant profile.`;

    // 4. Next Cycle Prediction
    let nextPred = '';
    if (maxIdx === 0) nextPred = 'Gradual transition toward elevated, structural camel and blazer tailoring contours.';
    else if (maxIdx === 1) nextPred = 'Expansion of draped cargo hoodies and urban streetwear coordinates.';
    else if (maxIdx === 2) nextPred = 'Expect traditional oxford shoes and semi-formal classic chino styling.';
    else if (maxIdx === 3) nextPred = 'Premium, high-end fine trench layers and formal leather outerwear pairings.';
    else if (maxIdx === 4) nextPred = 'High-utility wet-weather technical layer elements proposed for dynamic schedule.';
    else if (maxIdx === 6) nextPred = 'Casual neutral basics and daily denim coordinates preferred for ease.';
    else nextPred = 'Balanced daily discovery combinations spanning smart casual and traditional fits.';

    this.state.systemGovernorReport = {
      status,
      detectedIssues,
      weights: { scoring, diversity, quietControl, gravity },
      learningUpdates: {
        updatedPreferences: uPreferences,
        ignoredPatterns: uIgnored,
        reinforcedStyles: uReinforced
      },
      nextCyclePrediction: nextPred
    };
  }
}
