-- =========================================================================
-- Enterprise Autonomous Fashion Operating System (EAOS) PostgreSQL Schema
-- Targets PostgreSQL 16+ with 'pgvector' extension for semantic styling DNA
-- =========================================================================

-- Enable high-performance vector operations extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Namespace schema containerization
CREATE SCHEMA IF NOT EXISTS eaos;

-- =========================================================================
-- 1. STYLISTIC DNA AND CONTEXT MEMORY SYSTEM
-- =========================================================================

-- Style Profiles (User Style DNA representations)
CREATE TABLE IF NOT EXISTS eaos.style_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL UNIQUE,
    aesthetic_preferences JSONB NOT NULL DEFAULT '{}',
    sartorial_fingerprint VECTOR(1536), -- Vector representation of user visual style DNA
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS style_profiles_sartorial_vector_idx 
ON eaos.style_profiles USING hnsw (sartorial_fingerprint vector_cosine_ops);

-- Context Memory Chunk store (Semantic long-term episodic storage)
CREATE TABLE IF NOT EXISTS eaos.episodic_memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    session_id VARCHAR(255),
    content TEXT NOT NULL,
    embedding VECTOR(1536) NOT NULL, -- Semantic text embeddings
    metadata JSONB NOT NULL DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS episodic_memories_embedding_idx 
ON eaos.episodic_memories USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS episodic_memories_user_idx ON eaos.episodic_memories (user_id);

-- =========================================================================
-- 2. CHAT AND INTERACTIVE COLLABORATION
-- =========================================================================

CREATE TABLE IF NOT EXISTS eaos.sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) DEFAULT 'New Sartorial Exploration',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS eaos.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL REFERENCES eaos.sessions(id) ON DELETE CASCADE,
    sender VARCHAR(50) NOT NULL, -- 'user' | 'assistant' | 'agent'
    content TEXT NOT NULL,
    tokens_consumed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- 3. AUTONOMOUS AGENT ORCHESTRATION LEDGER
-- =========================================================================

CREATE TABLE IF NOT EXISTS eaos.agents (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    capabilities VARCHAR(100)[] NOT NULL,
    status VARCHAR(50) DEFAULT 'idle', -- 'idle' | 'executing' | 'offline'
    last_heartbeat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS eaos.agent_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255),
    task_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending' | 'assigned' | 'completed' | 'failed'
    assigned_agent VARCHAR(100) REFERENCES eaos.agents(id),
    input_payload JSONB NOT NULL DEFAULT '{}',
    output_result JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- =========================================================================
-- 4. STATEFUL WORKFLOW ENGINE (DAG REGISTRY)
-- =========================================================================

CREATE TABLE IF NOT EXISTS eaos.workflows (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    definition JSONB NOT NULL, -- Declarative description of DAG nodes and dependencies
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS eaos.workflow_instances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id VARCHAR(100) NOT NULL REFERENCES eaos.workflows(id),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending' | 'executing' | 'succeeded' | 'failed'
    context JSONB NOT NULL DEFAULT '{}',
    history JSONB NOT NULL DEFAULT '[]', -- Execution audit logs
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE
);

-- =========================================================================
-- 5. CENTRALIZED TELEMETRY & SYSTEM Heartbeats
-- =========================================================================

CREATE TABLE IF NOT EXISTS eaos.system_telemetry (
    id BIGSERIAL PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    cpu_utilization NUMERIC(5,2),
    memory_utilization NUMERIC(5,2),
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS eaos.resource_ledger (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    transaction_type VARCHAR(100) NOT NULL,
    tokens_consumed INTEGER DEFAULT 0,
    cost_usd NUMERIC(10,7) DEFAULT 0.0000000,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
