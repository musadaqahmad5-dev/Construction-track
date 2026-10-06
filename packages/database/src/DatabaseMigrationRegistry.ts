/**
 * EAOS Look Vision AI Fashion OS - Schema Migration & Vector Database Seeding Engine
 * Path: packages/database/src/DatabaseMigrationRegistry.ts
 * Subsystem: PostgreSQL / pgvector Schema Provisioning, Atomic DDL Migration & Agent Seed Registry
 */

import crypto from 'crypto';
import pg from 'pg';

const { Pool } = pg;

// ============================================================================
// STRICT DOMAIN CONTRACTS & TYPE DEFINITIONS
// ============================================================================

export interface MigrationScriptReceipt {
  batchId: string;
  appliedSchemaVersion: string;
  completedStepsCount: number;
  executionDurationMs: number;
  cryptographicVerificationHash: string;
  status: 'COMMITTED' | 'ROLLED_BACK';
  executedAt: string;
}

export interface SystemAgentSeedRecord {
  agentId: string;
  agentName: string;
  role: string;
  capabilities: string[];
  cognitivePromptTemplate: string;
  systemStatus: 'ACTIVE' | 'STANDBY' | 'DEGRADED';
}

export interface MarketplaceConfigSeed {
  defaultCurrency: string;
  platformCommissionRate: number;
  syndicationRefreshIntervalMin: number;
  supportedLocales: string[];
}

export interface TenantIsolationMask {
  tenantId: string;
  tenantName: string;
  tier: 'ENTERPRISE_HAUTE_COUTURE' | 'BOUTIQUE_ATELIER' | 'INDIE_CREATOR';
  featureFlags: Record<string, boolean>;
}

export interface SeedPayloadSpec {
  defaultSystemAgents: SystemAgentSeedRecord[];
  baseMarketplaceConfig: MarketplaceConfigSeed;
  baselineTenantMasks: TenantIsolationMask[];
}

export interface DatabaseMigrationOptions {
  statementTimeoutMs?: number;
  connectionTimeoutMs?: number;
  targetSchemaVersion?: string;
}

// ============================================================================
// SYSTEM DEFAULT SEED SPECIFICATIONS
// ============================================================================

const DEFAULT_SYSTEM_AGENTS: SystemAgentSeedRecord[] = [
  {
    agentId: 'agent-sartorial-planner',
    agentName: 'Sartorial Blueprint Coordinator',
    role: 'Aesthetic Coordination & Silhouette Architecture',
    capabilities: [
      'COLOR_HARMONY_OPTIMIZATION',
      'LAYER_DEFICIT_ANALYSIS',
      'CLIMATE_AESTHETIC_MATCHING',
      'AVATAR_PROPORTION_MAPPING'
    ],
    cognitivePromptTemplate:
      'You are the Master Sartorial Planner of EAOS Look Vision AI. Analyze silhouette geometry, color palette relationships, and microclimate parameters to curate refined luxury garments.',
    systemStatus: 'ACTIVE'
  },
  {
    agentId: 'agent-material-governor',
    agentName: 'Material & Physics Governor',
    role: 'Textile Physics & Sustainability Constraint Checking',
    capabilities: [
      'FABRIC_DRAPE_SIMULATION',
      'GSM_WEIGHT_VALIDATION',
      'THERMAL_RETENTION_VERIFICATION',
      'SUSTAINABILITY_INDEX_SCORING'
    ],
    cognitivePromptTemplate:
      'You are the Material Governor. Validate fabric tensile limits, environmental durability, and textile sustainability certifications across all generated garment meshes.',
    systemStatus: 'ACTIVE'
  },
  {
    agentId: 'agent-syndication-curator',
    agentName: 'Omnichannel Commerce Syndicator',
    role: 'Merchant Catalog Mapping & Real-time Inventory Harmonization',
    capabilities: [
      'SHOPIFY_STOREFRONT_INGESTION',
      'SKU_DETERMINISTIC_MATRIX_MAPPING',
      'MULTI_ITEM_BUNDLE_PRICING',
      'CURRENCY_ARBITRAGE_ALIGNMENT'
    ],
    cognitivePromptTemplate:
      'You are the Commerce Syndicator. Monitor real-time merchant catalog inventories, calculate programmatic bundle discounts, and maintain synchronous multi-tenant checkout feeds.',
    systemStatus: 'ACTIVE'
  }
];

const DEFAULT_MARKETPLACE_CONFIG: MarketplaceConfigSeed = {
  defaultCurrency: 'USD',
  platformCommissionRate: 0.12,
  syndicationRefreshIntervalMin: 15,
  supportedLocales: ['en-US', 'fr-FR', 'it-IT', 'ja-JP']
};

const DEFAULT_BASELINE_TENANTS: TenantIsolationMask[] = [
  {
    tenantId: 'tenant-atelier-global-01',
    tenantName: 'EAOS Sovereign Atelier Collective',
    tier: 'ENTERPRISE_HAUTE_COUTURE',
    featureFlags: {
      enableGemini3DGeneration: true,
      enableLiveShopifySync: true,
      enableHighThroughputDag: true,
      enablePgVectorSearch: true
    }
  }
];

// ============================================================================
// DATABASE MIGRATION REGISTRY IMPLEMENTATION
// ============================================================================

export class DatabaseMigrationRegistry {
  private readonly statementTimeoutMs: number;
  private readonly connectionTimeoutMs: number;
  private readonly schemaVersion: string;

  constructor(options?: DatabaseMigrationOptions) {
    this.statementTimeoutMs = options?.statementTimeoutMs ?? 30000;
    this.connectionTimeoutMs = options?.connectionTimeoutMs ?? 10000;
    this.schemaVersion = options?.targetSchemaVersion ?? '2026.08.v2_vector_core';
  }

  /**
   * Generates a deterministic SHA-256 hash verifying migration execution integrity
   */
  private generateVerificationHash(
    batchId: string,
    version: string,
    stepsCount: number,
    timestamp: string
  ): string {
    const payload = `${batchId}:${version}:${stepsCount}:${timestamp}:EAOS_PGVECTOR_PROVISIONED`;
    return crypto.createHash('sha256').update(payload).digest('hex');
  }

  /**
   * Executes atomic DDL statements to build schemas, enable extensions, and create tables
   */
  private async applySchemaDDL(client: pg.PoolClient, traceId: string): Promise<number> {
    let stepsExecuted = 0;

    // Step 1: Initialize Core Namespace
    await client.query(`CREATE SCHEMA IF NOT EXISTS eaos;`);
    stepsExecuted++;

    // Step 2: Enable pgvector Extension for High-Dimensional Style Embeddings
    await client.query(`CREATE EXTENSION IF NOT EXISTS "vector";`);
    stepsExecuted++;

    // Step 3: Migration Registry Tracking Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS eaos.schema_migrations (
        id SERIAL PRIMARY KEY,
        batch_id VARCHAR(64) NOT NULL UNIQUE,
        schema_version VARCHAR(64) NOT NULL,
        verification_hash VARCHAR(64) NOT NULL,
        completed_steps INTEGER NOT NULL,
        execution_duration_ms NUMERIC(10, 2) NOT NULL,
        status VARCHAR(32) NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    stepsExecuted++;

    // Step 4: Style Profiles Table (Vector embeddings of user aesthetics)
    await client.query(`
      CREATE TABLE IF NOT EXISTS eaos.style_profiles (
        id VARCHAR(64) PRIMARY KEY,
        tenant_id VARCHAR(64) NOT NULL,
        user_id VARCHAR(64) NOT NULL,
        aesthetic_archetype VARCHAR(128) NOT NULL,
        primary_color_palette TEXT[] NOT NULL DEFAULT '{}',
        preferred_materials TEXT[] NOT NULL DEFAULT '{}',
        style_embedding vector(1536),
        climate_adaptation_rules JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_style_profiles_tenant_user ON eaos.style_profiles(tenant_id, user_id);
    `);
    stepsExecuted++;

    // Step 5: User Themes & Atelier Configurations Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS eaos.user_themes (
        id VARCHAR(64) PRIMARY KEY,
        tenant_id VARCHAR(64) NOT NULL,
        user_id VARCHAR(64) NOT NULL,
        theme_name VARCHAR(128) NOT NULL,
        color_scheme JSONB NOT NULL DEFAULT '{"background": "#05050a", "accent": "#6366f1"}'::jsonb,
        typography_spec JSONB NOT NULL DEFAULT '{"display": "Cinzel", "body": "Inter"}'::jsonb,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_user_themes_tenant_user ON eaos.user_themes(tenant_id, user_id);
    `);
    stepsExecuted++;

    // Step 6: Market Trends & Real-Time E-Commerce Aggregation Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS eaos.market_trends (
        id VARCHAR(64) PRIMARY KEY,
        tenant_id VARCHAR(64) NOT NULL,
        trend_keyword VARCHAR(128) NOT NULL,
        category VARCHAR(64) NOT NULL,
        sentiment_score NUMERIC(5, 4) NOT NULL DEFAULT 0.5000,
        demand_velocity_index NUMERIC(6, 2) NOT NULL DEFAULT 100.00,
        trend_vector vector(1536),
        source_signals JSONB NOT NULL DEFAULT '[]'::jsonb,
        recorded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_market_trends_tenant_cat ON eaos.market_trends(tenant_id, category);
    `);
    stepsExecuted++;

    // Step 7: Multi-Tenant Billing & Token Usage Counters Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS eaos.billing_counters (
        id VARCHAR(64) PRIMARY KEY,
        tenant_id VARCHAR(64) NOT NULL,
        billing_cycle_month VARCHAR(7) NOT NULL,
        gemini_token_count BIGINT NOT NULL DEFAULT 0,
        mesh_renders_count INTEGER NOT NULL DEFAULT 0,
        syndicated_checkouts_count INTEGER NOT NULL DEFAULT 0,
        total_accrued_cost_cents BIGINT NOT NULL DEFAULT 0,
        last_incremented_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unq_tenant_billing_cycle UNIQUE (tenant_id, billing_cycle_month)
      );
      CREATE INDEX IF NOT EXISTS idx_billing_counters_tenant ON eaos.billing_counters(tenant_id);
    `);
    stepsExecuted++;

    // Step 8: System Multi-Agent Registry Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS eaos.agent_registries (
        agent_id VARCHAR(64) PRIMARY KEY,
        agent_name VARCHAR(128) NOT NULL,
        role VARCHAR(128) NOT NULL,
        capabilities TEXT[] NOT NULL DEFAULT '{}',
        cognitive_prompt_template TEXT NOT NULL,
        system_status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
        last_heartbeat TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    stepsExecuted++;

    // Step 9: System Configuration & Tenant Masks Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS eaos.system_configurations (
        config_key VARCHAR(64) PRIMARY KEY,
        config_payload JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS eaos.tenant_isolation_masks (
        tenant_id VARCHAR(64) PRIMARY KEY,
        tenant_name VARCHAR(128) NOT NULL,
        tier VARCHAR(64) NOT NULL,
        feature_flags JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    stepsExecuted++;

    console.info(
      JSON.stringify({
        level: 'INFO',
        event: 'SCHEMA_DDL_APPLIED',
        'x-trace-id': traceId,
        stepsExecuted,
        schema: 'eaos',
        version: this.schemaVersion,
        timestamp: new Date().toISOString()
      })
    );

    return stepsExecuted;
  }

  /**
   * Seeds baseline system multi-agent registries and tenant configuration masks
   */
  private async applySystemSeedPayload(
    client: pg.PoolClient,
    seedSpec: SeedPayloadSpec,
    traceId: string
  ): Promise<number> {
    let seedCount = 0;

    // 1. Seed Multi-Agent Telemetry Registries
    for (const agent of seedSpec.defaultSystemAgents) {
      await client.query(
        `
        INSERT INTO eaos.agent_registries (
          agent_id, agent_name, role, capabilities, cognitive_prompt_template, system_status, last_heartbeat
        )
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
        ON CONFLICT (agent_id) DO UPDATE SET
          agent_name = EXCLUDED.agent_name,
          role = EXCLUDED.role,
          capabilities = EXCLUDED.capabilities,
          cognitive_prompt_template = EXCLUDED.cognitive_prompt_template,
          system_status = EXCLUDED.system_status,
          last_heartbeat = CURRENT_TIMESTAMP;
      `,
        [
          agent.agentId,
          agent.agentName,
          agent.role,
          agent.capabilities,
          agent.cognitivePromptTemplate,
          agent.systemStatus
        ]
      );
      seedCount++;
    }

    // 2. Seed Base Marketplace Config
    await client.query(
      `
      INSERT INTO eaos.system_configurations (config_key, config_payload, updated_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      ON CONFLICT (config_key) DO UPDATE SET
        config_payload = EXCLUDED.config_payload,
        updated_at = CURRENT_TIMESTAMP;
    `,
      ['MARKETPLACE_BASE_CONFIG', JSON.stringify(seedSpec.baseMarketplaceConfig)]
    );
    seedCount++;

    // 3. Seed Baseline Tenant Masks
    for (const tenant of seedSpec.baselineTenantMasks) {
      await client.query(
        `
        INSERT INTO eaos.tenant_isolation_masks (tenant_id, tenant_name, tier, feature_flags)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (tenant_id) DO UPDATE SET
          tenant_name = EXCLUDED.tenant_name,
          tier = EXCLUDED.tier,
          feature_flags = EXCLUDED.feature_flags;
      `,
        [tenant.tenantId, tenant.tenantName, tenant.tier, JSON.stringify(tenant.featureFlags)]
      );
      seedCount++;
    }

    console.info(
      JSON.stringify({
        level: 'INFO',
        event: 'SYSTEM_SEED_COMPLETED',
        'x-trace-id': traceId,
        seededEntitiesCount: seedCount,
        timestamp: new Date().toISOString()
      })
    );

    return seedCount;
  }

  /**
   * Executes complete database migration and transactional seed orchestrator
   *
   * @param clusterConnectionString Target PostgreSQL connection string
   * @returns Cryptographically verified migration receipt
   */
  public async executeFullDatabaseMigration(
    clusterConnectionString: string
  ): Promise<MigrationScriptReceipt> {
    const startTime = performance.now();
    const batchId = `mig_${crypto.randomBytes(8).toString('hex')}`;
    const traceId = `trc_mig_${crypto.randomBytes(6).toString('hex')}`;
    const executedAt = new Date().toISOString();

    if (!clusterConnectionString || typeof clusterConnectionString !== 'string' || !clusterConnectionString.trim()) {
      throw new Error('[MIGRATION REGISTRY ERROR] clusterConnectionString is required and cannot be empty.');
    }

    console.info(
      JSON.stringify({
        level: 'INFO',
        event: 'FULL_DATABASE_MIGRATION_INITIATED',
        'x-trace-id': traceId,
        batchId,
        targetSchemaVersion: this.schemaVersion,
        timestamp: executedAt
      })
    );

    const pool = new Pool({
      connectionString: clusterConnectionString,
      connectionTimeoutMillis: this.connectionTimeoutMs,
      statement_timeout: this.statementTimeoutMs,
      max: 5
    });

    let client: pg.PoolClient | null = null;

    try {
      client = await pool.connect();

      // Begin isolated ACID transaction block
      await client.query('BEGIN;');

      // Set multi-tenant isolation and strict search path defaults
      await client.query(`SET LOCAL search_path TO eaos, public;`);

      // 1. Apply DDL Migrations
      const ddlSteps = await this.applySchemaDDL(client, traceId);

      // 2. Apply Cognitive Agent & Configuration Seed
      const seedSpec: SeedPayloadSpec = {
        defaultSystemAgents: DEFAULT_SYSTEM_AGENTS,
        baseMarketplaceConfig: DEFAULT_MARKETPLACE_CONFIG,
        baselineTenantMasks: DEFAULT_BASELINE_TENANTS
      };

      const seedSteps = await this.applySystemSeedPayload(client, seedSpec, traceId);
      const totalSteps = ddlSteps + seedSteps;

      const durationMs = Number((performance.now() - startTime).toFixed(2));
      const verificationHash = this.generateVerificationHash(
        batchId,
        this.schemaVersion,
        totalSteps,
        executedAt
      );

      // 3. Record Migration Run in Audit Table
      await client.query(
        `
        INSERT INTO eaos.schema_migrations (
          batch_id, schema_version, verification_hash, completed_steps, execution_duration_ms, status, applied_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7);
      `,
        [batchId, this.schemaVersion, verificationHash, totalSteps, durationMs, 'COMMITTED', executedAt]
      );

      // Commit transaction atomically
      await client.query('COMMIT;');

      const receipt: MigrationScriptReceipt = {
        batchId,
        appliedSchemaVersion: this.schemaVersion,
        completedStepsCount: totalSteps,
        executionDurationMs: durationMs,
        cryptographicVerificationHash: verificationHash,
        status: 'COMMITTED',
        executedAt
      };

      console.info(
        JSON.stringify({
          level: 'INFO',
          event: 'DATABASE_MIGRATION_COMMITTED',
          'x-trace-id': traceId,
          batchId,
          verificationHash,
          completedSteps: totalSteps,
          durationMs,
          timestamp: new Date().toISOString()
        })
      );

      return receipt;
    } catch (migrationError: unknown) {
      const durationMs = Number((performance.now() - startTime).toFixed(2));
      const errMsg = migrationError instanceof Error ? migrationError.message : String(migrationError);

      if (client) {
        try {
          // Strict rollback on any single failure
          await client.query('ROLLBACK;');
          console.warn(
            JSON.stringify({
              level: 'WARN',
              event: 'DATABASE_MIGRATION_TRANSACTION_ROLLED_BACK',
              'x-trace-id': traceId,
              batchId,
              reason: errMsg,
              timestamp: new Date().toISOString()
            })
          );
        } catch (rollbackErr: unknown) {
          console.error(
            JSON.stringify({
              level: 'ERROR',
              event: 'ROLLBACK_EXECUTION_FAILED',
              'x-trace-id': traceId,
              error: rollbackErr instanceof Error ? rollbackErr.message : String(rollbackErr),
              timestamp: new Date().toISOString()
            })
          );
        }
      }

      console.error(
        JSON.stringify({
          level: 'ERROR',
          event: 'FULL_DATABASE_MIGRATION_FAILED',
          'x-trace-id': traceId,
          batchId,
          error: errMsg,
          durationMs,
          timestamp: new Date().toISOString()
        })
      );

      throw migrationError;
    } finally {
      if (client) {
        client.release();
      }
      await pool.end().catch(() => {});
    }
  }
}
