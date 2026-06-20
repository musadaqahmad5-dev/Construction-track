// SYSTEM_CONFIG: Single source of truth for SaaS configurations, limits, tiers, feature flags, and environment details.
export const SYSTEM_CONFIG = {
  limits: {
    wardrobe_items_max: 300,
    feedback_signals_max: 5000,
    outfit_history_max: 1000,
    analytics_events_max: 150,
    audit_trail_max: 100, // Capped at exactly 100 events for memory safety
    generation_response_time_budget_ms: 150, // SLA Alerting limit (ms)
    storage_capacity_bytes_limit: 5 * 1024 * 1024, // 5MB localStorage budget
  },
  tiers: {
    Free: {
      hasAdvancedAnalytics: false,
      hasDynamicDNA: false,
      hasPlanner: false,
      wardrobeLimit: 5,
    },
    Pro: {
      hasAdvancedAnalytics: true,
      hasDynamicDNA: true,
      hasPlanner: true,
      wardrobeLimit: 100,
    },
    Studio: {
      hasAdvancedAnalytics: true,
      hasDynamicDNA: true,
      hasPlanner: true,
      wardrobeLimit: 300,
    }
  },
  feature_flags: {
    enable_autopilot: true,
    enable_offline_mode: true,
    enable_incident_drill: true,
    enable_telemetry: false, // Architectural honesty (no AI slop logs)
  },
  environment: {
    NODE_ENV: 'production',
    port: 3000,
    api_endpoint: '/api/v1',
    storage_key_wardrobe: 'local_wardrobe_items',
    storage_key_streak: 'retention_streak_count',
    storage_key_signup_date: 'retention_signup_date',
    storage_key_simulate_d1: 'retention_simulate_d1',
    storage_key_simulate_d7: 'retention_simulate_d7',
    storage_key_simulate_d30: 'retention_simulate_d30',
  }
};
