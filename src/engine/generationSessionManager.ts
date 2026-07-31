import {
  ThemeExecutionResult,
  analyseTheme
} from './themeOrchestrator';

import {
  PromptPackage,
  buildPromptPackage
} from './themePromptBuilder';

import {
  AIProvider,
  NormalizedGenerationResult,
  ProviderRequest
} from './aiProviderAdapter';

import {
  GenerationJob,
  JobPriority,
  globalGenerationQueue,
  GenerationQueue
} from './generationQueue';

export type SessionStatus = 'created' | 'queued' | 'generating' | 'completed' | 'failed' | 'cancelled' | 'archived';

export interface SessionHistoryEntry {
  id: string;
  timestamp: number;
  provider: AIProvider;
  seed: number;
  promptPackage: PromptPackage;
  result?: NormalizedGenerationResult;
  durationMs?: number;
  status: SessionStatus;
  action: 'initial' | 'regenerate' | 'version_restore' | 'provider_switch';
}

export interface SessionVersion {
  versionId: string;
  versionNumber: number;
  timestamp: number;
  promptPackage: PromptPackage;
  results: NormalizedGenerationResult[];
  provider: AIProvider;
  seed: number;
  notes?: string;
}

export interface SessionMetadata {
  fusedConcept: string;
  primaryEntity: string;
  category: string;
  mood: string;
  dominantColor: string;
  cameraStyle: string;
  lightingStyle: string;
  totalCost: number;
  totalDurationMs: number;
  tags: string[];
}

export interface GenerationSession {
  id: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
  status: SessionStatus;
  theme: string;
  executionResult: ThemeExecutionResult;
  promptPackage: PromptPackage;
  provider: AIProvider;
  queueJobIds: string[];
  results: NormalizedGenerationResult[];
  history: SessionHistoryEntry[];
  versions: SessionVersion[];
  activeVersionId: string;
  metadata: SessionMetadata;
}

export interface SessionSearchQuery {
  theme?: string;
  provider?: AIProvider;
  status?: SessionStatus;
  mood?: string;
  category?: string;
  entity?: string;
  tags?: string[];
  startDate?: number;
  endDate?: number;
}

export interface SessionComparisonResult {
  sessionAId: string;
  sessionBId: string;
  promptDifference: string;
  providerMatch: boolean;
  seedMatch: boolean;
  entityMatch: boolean;
  colorMatch: boolean;
  resultsDiff: {
    aCount: number;
    bCount: number;
  };
}

export interface SessionManagerStatistics {
  totalSessions: number;
  successfulSessions: number;
  failedSessions: number;
  archivedSessions: number;
  averageDurationMs: number;
  providerUsage: Record<AIProvider, number>;
  totalCostEstimate: number;
}

export interface SessionEventListener {
  onSessionCreated?: (session: GenerationSession) => void;
  onSessionUpdated?: (session: GenerationSession) => void;
  onSessionCompleted?: (session: GenerationSession) => void;
  onSessionFailed?: (session: GenerationSession, error: string) => void;
  onSessionDeleted?: (sessionId: string) => void;
}

export class GenerationSessionManager {
  private sessions: Map<string, GenerationSession> = new Map();
  private queue: GenerationQueue;
  private listeners: Set<SessionEventListener> = new Set();

  constructor(queue: GenerationQueue = globalGenerationQueue) {
    this.queue = queue;
    this.setupQueueListeners();
  }

  public addListener(listener: SessionEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public createSession(
    themePrompt: string,
    userId: string = 'guest_user',
    provider: AIProvider = 'gemini',
    priority: JobPriority = 'NORMAL'
  ): GenerationSession {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const executionResult = analyseTheme(themePrompt);
    const promptPackage = buildPromptPackage(executionResult);

    const initialVersion: SessionVersion = {
      versionId: `v1_${Date.now()}`,
      versionNumber: 1,
      timestamp: Date.now(),
      promptPackage,
      results: [],
      provider,
      seed: 42,
      notes: 'Initial session creation'
    };

    const initialHistory: SessionHistoryEntry = {
      id: `hist_${Date.now()}_0`,
      timestamp: Date.now(),
      provider,
      seed: 42,
      promptPackage,
      status: 'created',
      action: 'initial'
    };

    const metadata: SessionMetadata = {
      fusedConcept: executionResult.fusedConcept,
      primaryEntity: executionResult.themeDNA.primaryEntity.name,
      category: executionResult.themeDNA.primaryEntity.category,
      mood: executionResult.themeMood.primary,
      dominantColor: executionResult.palette.primary,
      cameraStyle: executionResult.cameraComposition.cameraStyle,
      lightingStyle: executionResult.lighting.style,
      totalCost: 0,
      totalDurationMs: 0,
      tags: [
        executionResult.themeDNA.primaryEntity.category,
        executionResult.themeMood.primary,
        executionResult.cameraComposition.cameraStyle
      ]
    };

    const session: GenerationSession = {
      id: sessionId,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'created',
      theme: themePrompt,
      executionResult,
      promptPackage,
      provider,
      queueJobIds: [],
      results: [],
      history: [initialHistory],
      versions: [initialVersion],
      activeVersionId: initialVersion.versionId,
      metadata
    };

    this.sessions.set(sessionId, session);

    const job = this.queue.enqueue(
      promptPackage,
      priority,
      provider,
      { metadata: { sessionId, versionId: initialVersion.versionId } }
    );

    session.queueJobIds.push(job.id);
    session.status = 'queued';
    session.updatedAt = Date.now();

    this.notifySessionCreated(session);
    return session;
  }

  public getSession(sessionId: string): GenerationSession | undefined {
    return this.sessions.get(sessionId);
  }

  public updateSession(sessionId: string, updates: Partial<GenerationSession>): GenerationSession | undefined {
    const session = this.sessions.get(sessionId);
    if (!session) return undefined;

    const updatedSession: GenerationSession = {
      ...session,
      ...updates,
      updatedAt: Date.now()
    };

    this.sessions.set(sessionId, updatedSession);
    this.notifySessionUpdated(updatedSession);
    return updatedSession;
  }

  public deleteSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    for (const jobId of session.queueJobIds) {
      this.queue.cancel(jobId);
    }

    const removed = this.sessions.delete(sessionId);
    if (removed) {
      this.notifySessionDeleted(sessionId);
    }
    return removed;
  }

  public archiveSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    session.status = 'archived';
    session.updatedAt = Date.now();
    this.notifySessionUpdated(session);
    return true;
  }

  public restoreSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session || session.status !== 'archived') return false;

    session.status = session.results.length > 0 ? 'completed' : 'created';
    session.updatedAt = Date.now();
    this.notifySessionUpdated(session);
    return true;
  }

  public duplicateSession(sessionId: string): GenerationSession | undefined {
    const original = this.sessions.get(sessionId);
    if (!original) return undefined;

    return this.createSession(original.theme, original.userId, original.provider);
  }

  public async regenerate(
    sessionId: string,
    options: {
      newSeed?: boolean;
      seed?: number;
      newProvider?: AIProvider;
      modifiedPrompt?: string;
      priority?: JobPriority;
    } = {}
  ): Promise<NormalizedGenerationResult | undefined> {
    const session = this.sessions.get(sessionId);
    if (!session) return undefined;

    const targetProvider = options.newProvider || session.provider;
    let targetPromptPkg = session.promptPackage;

    if (options.modifiedPrompt) {
      const updatedExec = analyseTheme(options.modifiedPrompt);
      targetPromptPkg = buildPromptPackage(updatedExec);
      session.executionResult = updatedExec;
      session.promptPackage = targetPromptPkg;
    }

    const nextSeed = options.seed ?? (options.newSeed ? Math.floor(Math.random() * 1000000) : 42);

    session.status = 'queued';
    session.provider = targetProvider;
    session.updatedAt = Date.now();

    const historyEntry: SessionHistoryEntry = {
      id: `hist_${Date.now()}_${session.history.length}`,
      timestamp: Date.now(),
      provider: targetProvider,
      seed: nextSeed,
      promptPackage: targetPromptPkg,
      status: 'queued',
      action: options.newProvider ? 'provider_switch' : 'regenerate'
    };

    session.history.push(historyEntry);

    const job = this.queue.enqueue(
      targetPromptPkg,
      options.priority || 'HIGH',
      targetProvider,
      { seed: nextSeed, metadata: { sessionId, historyId: historyEntry.id } }
    );

    session.queueJobIds.push(job.id);
    this.notifySessionUpdated(session);

    return new Promise(resolve => {
      const removeListener = this.queue.addListener({
        onJobCompleted: (completedJob, result) => {
          if (completedJob.id === job.id) {
            removeListener();
            resolve(result);
          }
        },
        onJobFailed: (failedJob) => {
          if (failedJob.id === job.id) {
            removeListener();
            resolve(undefined);
          }
        }
      });
    });
  }

  public createVersion(sessionId: string, notes?: string): SessionVersion | undefined {
    const session = this.sessions.get(sessionId);
    if (!session) return undefined;

    const versionNumber = session.versions.length + 1;
    const version: SessionVersion = {
      versionId: `v${versionNumber}_${Date.now()}`,
      versionNumber,
      timestamp: Date.now(),
      promptPackage: session.promptPackage,
      results: [...session.results],
      provider: session.provider,
      seed: 42,
      notes
    };

    session.versions.push(version);
    session.activeVersionId = version.versionId;
    session.updatedAt = Date.now();

    this.notifySessionUpdated(session);
    return version;
  }

  public restoreVersion(sessionId: string, versionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    const targetVersion = session.versions.find(v => v.versionId === versionId);
    if (!targetVersion) return false;

    session.activeVersionId = targetVersion.versionId;
    session.promptPackage = targetVersion.promptPackage;
    session.results = [...targetVersion.results];
    session.provider = targetVersion.provider;
    session.updatedAt = Date.now();

    const historyEntry: SessionHistoryEntry = {
      id: `hist_${Date.now()}_${session.history.length}`,
      timestamp: Date.now(),
      provider: targetVersion.provider,
      seed: targetVersion.seed,
      promptPackage: targetVersion.promptPackage,
      status: 'completed',
      action: 'version_restore'
    };

    session.history.push(historyEntry);
    this.notifySessionUpdated(session);
    return true;
  }

  public compareSessions(sessionAId: string, sessionBId: string): SessionComparisonResult | undefined {
    const sessionA = this.sessions.get(sessionAId);
    const sessionB = this.sessions.get(sessionBId);

    if (!sessionA || !sessionB) return undefined;

    const promptDifference = sessionA.promptPackage.positivePrompt !== sessionB.promptPackage.positivePrompt
      ? 'Prompts differ'
      : 'Identical prompt';

    return {
      sessionAId,
      sessionBId,
      promptDifference,
      providerMatch: sessionA.provider === sessionB.provider,
      seedMatch: sessionA.metadata.fusedConcept === sessionB.metadata.fusedConcept,
      entityMatch: sessionA.metadata.primaryEntity === sessionB.metadata.primaryEntity,
      colorMatch: sessionA.metadata.dominantColor === sessionB.metadata.dominantColor,
      resultsDiff: {
        aCount: sessionA.results.length,
        bCount: sessionB.results.length
      }
    };
  }

  public searchSessions(query: SessionSearchQuery): GenerationSession[] {
    return Array.from(this.sessions.values()).filter(session => {
      if (query.theme && !session.theme.toLowerCase().includes(query.theme.toLowerCase())) {
        return false;
      }
      if (query.provider && session.provider !== query.provider) {
        return false;
      }
      if (query.status && session.status !== query.status) {
        return false;
      }
      if (query.mood && session.metadata.mood.toLowerCase() !== query.mood.toLowerCase()) {
        return false;
      }
      if (query.category && session.metadata.category.toLowerCase() !== query.category.toLowerCase()) {
        return false;
      }
      if (query.entity && session.metadata.primaryEntity.toLowerCase() !== query.entity.toLowerCase()) {
        return false;
      }
      if (query.startDate && session.createdAt < query.startDate) {
        return false;
      }
      if (query.endDate && session.createdAt > query.endDate) {
        return false;
      }
      return true;
    });
  }

  public getStatistics(): SessionManagerStatistics {
    const all = Array.from(this.sessions.values());
    const totalSessions = all.length;
    let successfulSessions = 0;
    let failedSessions = 0;
    let archivedSessions = 0;
    let totalDurationMs = 0;
    let totalCostEstimate = 0;

    const providerUsage: Record<AIProvider, number> = {
      gemini: 0,
      imagen: 0,
      sdxl: 0,
      flux: 0,
      generic: 0
    };

    for (const session of all) {
      providerUsage[session.provider] = (providerUsage[session.provider] || 0) + 1;
      totalCostEstimate += session.metadata.totalCost;
      totalDurationMs += session.metadata.totalDurationMs;

      if (session.status === 'completed') {
        successfulSessions++;
      } else if (session.status === 'failed') {
        failedSessions++;
      } else if (session.status === 'archived') {
        archivedSessions++;
      }
    }

    const averageDurationMs = totalSessions > 0 ? Math.round(totalDurationMs / totalSessions) : 0;

    return {
      totalSessions,
      successfulSessions,
      failedSessions,
      archivedSessions,
      averageDurationMs,
      providerUsage,
      totalCostEstimate
    };
  }

  public exportSession(sessionId: string): string | undefined {
    const session = this.sessions.get(sessionId);
    if (!session) return undefined;
    return JSON.stringify(session, null, 2);
  }

  public importSession(jsonString: string): GenerationSession | undefined {
    try {
      const session = JSON.parse(jsonString) as GenerationSession;
      if (!session || !session.id || !session.theme) {
        return undefined;
      }
      this.sessions.set(session.id, session);
      this.notifySessionCreated(session);
      return session;
    } catch (_) {
      return undefined;
    }
  }

  private setupQueueListeners(): void {
    this.queue.addListener({
      onJobStarted: (job) => {
        const session = this.findSessionByJobId(job.id);
        if (session) {
          session.status = 'generating';
          session.updatedAt = Date.now();
          this.notifySessionUpdated(session);
        }
      },
      onJobCompleted: (job, result) => {
        const session = this.findSessionByJobId(job.id);
        if (session) {
          session.status = 'completed';
          session.results.push(result);
          session.metadata.totalCost += result.costEstimate;
          session.metadata.totalDurationMs += result.generationTimeMs;
          session.updatedAt = Date.now();

          const activeHist = session.history[session.history.length - 1];
          if (activeHist) {
            activeHist.status = 'completed';
            activeHist.result = result;
            activeHist.durationMs = result.generationTimeMs;
          }

          this.notifySessionCompleted(session);
          this.notifySessionUpdated(session);
        }
      },
      onJobFailed: (job, error) => {
        const session = this.findSessionByJobId(job.id);
        if (session) {
          session.status = 'failed';
          session.updatedAt = Date.now();

          const activeHist = session.history[session.history.length - 1];
          if (activeHist) {
            activeHist.status = 'failed';
          }

          this.notifySessionFailed(session, error);
          this.notifySessionUpdated(session);
        }
      }
    });
  }

  private findSessionByJobId(jobId: string): GenerationSession | undefined {
    for (const session of this.sessions.values()) {
      if (session.queueJobIds.includes(jobId)) {
        return session;
      }
    }
    return undefined;
  }

  private notifySessionCreated(session: GenerationSession): void {
    for (const listener of this.listeners) {
      try {
        listener.onSessionCreated?.(session);
      } catch (_) {}
    }
  }

  private notifySessionUpdated(session: GenerationSession): void {
    for (const listener of this.listeners) {
      try {
        listener.onSessionUpdated?.(session);
      } catch (_) {}
    }
  }

  private notifySessionCompleted(session: GenerationSession): void {
    for (const listener of this.listeners) {
      try {
        listener.onSessionCompleted?.(session);
      } catch (_) {}
    }
  }

  private notifySessionFailed(session: GenerationSession, error: string): void {
    for (const listener of this.listeners) {
      try {
        listener.onSessionFailed?.(session, error);
      } catch (_) {}
    }
  }

  private notifySessionDeleted(sessionId: string): void {
    for (const listener of this.listeners) {
      try {
        listener.onSessionDeleted?.(sessionId);
      } catch (_) {}
    }
  }
}

export const globalSessionManager = new GenerationSessionManager(globalGenerationQueue);
