import { PromptPackage } from './themePromptBuilder';
import {
  AIProvider,
  ProviderRequest,
  NormalizedGenerationResult,
  generateImage,
  cancelGeneration,
  buildProviderRequest
} from './aiProviderAdapter';

export type JobPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
export type JobStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'retrying';

export interface GenerationJob {
  id: string;
  status: JobStatus;
  priority: JobPriority;
  provider: AIProvider;
  promptPackage: PromptPackage;
  request: ProviderRequest;
  result?: NormalizedGenerationResult;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  retryCount: number;
  maxRetries: number;
  error?: string;
  fallbackChain: AIProvider[];
  abortController?: AbortController;
}

export interface QueueProgress {
  total: number;
  completed: number;
  pending: number;
  running: number;
  failed: number;
  cancelled: number;
  percentComplete: number;
  estimatedRemainingTimeMs: number;
}

export interface QueueStatistics {
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  cancelledJobs: number;
  retryAttempts: number;
  averageDurationMs: number;
  providerUsage: Record<AIProvider, number>;
  failureRate: number;
}

export interface QueueSnapshot {
  timestamp: number;
  jobs: Array<Omit<GenerationJob, 'abortController'>>;
  isPaused: boolean;
  maxConcurrentJobs: number;
}

export interface QueueEventListener {
  onJobStarted?: (job: GenerationJob) => void;
  onJobCompleted?: (job: GenerationJob, result: NormalizedGenerationResult) => void;
  onJobFailed?: (job: GenerationJob, error: string) => void;
  onQueueUpdated?: (stats: QueueStatistics, progress: QueueProgress) => void;
}

const PRIORITY_SCORES: Record<JobPriority, number> = {
  CRITICAL: 400,
  HIGH: 300,
  NORMAL: 200,
  LOW: 100
};

const DEFAULT_FALLBACK_CHAIN: AIProvider[] = ['gemini', 'imagen', 'flux', 'sdxl', 'generic'];

export class GenerationQueue {
  private jobs: Map<string, GenerationJob> = new Map();
  private maxConcurrentJobs: number;
  private isPaused: boolean = false;
  private activeCount: number = 0;
  private listeners: Set<QueueEventListener> = new Set();
  private cleanupTimeoutMs: number = 300000;
  private cleanupTimer?: any;

  constructor(maxConcurrentJobs: number = 3, cleanupTimeoutMs: number = 300000) {
    this.maxConcurrentJobs = maxConcurrentJobs;
    this.cleanupTimeoutMs = cleanupTimeoutMs;
    this.startAutoCleanup();
  }

  public addListener(listener: QueueEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public enqueue(
    promptPackage: PromptPackage,
    priority: JobPriority = 'NORMAL',
    provider: AIProvider = 'gemini',
    overrides: Partial<ProviderRequest> = {},
    maxRetries: number = 3
  ): GenerationJob {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const request = buildProviderRequest(promptPackage, provider, overrides);

    const fallbackChain = DEFAULT_FALLBACK_CHAIN.filter(p => p !== provider);
    fallbackChain.unshift(provider);

    const job: GenerationJob = {
      id: jobId,
      status: 'pending',
      priority,
      provider,
      promptPackage,
      request,
      createdAt: Date.now(),
      retryCount: 0,
      maxRetries,
      fallbackChain
    };

    this.jobs.set(jobId, job);
    this.notifyQueueUpdated();
    this.processNext();
    return job;
  }

  public dequeue(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job) return false;

    if (job.status === 'running') {
      this.cancel(jobId);
    }
    const removed = this.jobs.delete(jobId);
    this.notifyQueueUpdated();
    return removed;
  }

  public cancel(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job || job.status === 'completed' || job.status === 'cancelled') {
      return false;
    }

    if (job.abortController) {
      job.abortController.abort();
    }
    cancelGeneration(job.request.id);

    job.status = 'cancelled';
    job.completedAt = Date.now();
    if (this.activeCount > 0 && job.startedAt) {
      this.activeCount--;
    }

    this.notifyQueueUpdated();
    this.processNext();
    return true;
  }

  public clear(): void {
    for (const [id, job] of this.jobs.entries()) {
      if (job.status === 'running') {
        this.cancel(id);
      }
    }
    this.jobs.clear();
    this.activeCount = 0;
    this.notifyQueueUpdated();
  }

  public pause(): void {
    this.isPaused = true;
    this.notifyQueueUpdated();
  }

  public resume(): void {
    this.isPaused = false;
    this.notifyQueueUpdated();
    this.processNext();
  }

  public restart(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job) return false;

    job.status = 'pending';
    job.retryCount = 0;
    job.error = undefined;
    job.result = undefined;
    job.startedAt = undefined;
    job.completedAt = undefined;

    this.notifyQueueUpdated();
    this.processNext();
    return true;
  }

  public getJob(jobId: string): GenerationJob | undefined {
    return this.jobs.get(jobId);
  }

  public getAllJobs(): GenerationJob[] {
    return Array.from(this.jobs.values());
  }

  public getProgress(): QueueProgress {
    const all = Array.from(this.jobs.values());
    const total = all.length;
    let completed = 0;
    let pending = 0;
    let running = 0;
    let failed = 0;
    let cancelled = 0;

    for (const j of all) {
      if (j.status === 'completed') completed++;
      else if (j.status === 'pending') pending++;
      else if (j.status === 'running' || j.status === 'retrying') running++;
      else if (j.status === 'failed') failed++;
      else if (j.status === 'cancelled') cancelled++;
    }

    const percentComplete = total === 0 ? 100 : Math.round((completed / total) * 100);

    const completedJobs = all.filter(j => j.status === 'completed' && j.startedAt && j.completedAt);
    const avgTime = completedJobs.length > 0
      ? completedJobs.reduce((sum, j) => sum + (j.completedAt! - j.startedAt!), 0) / completedJobs.length
      : 5000;

    const remainingJobs = pending + running;
    const estimatedRemainingTimeMs = Math.round((remainingJobs * avgTime) / this.maxConcurrentJobs);

    return {
      total,
      completed,
      pending,
      running,
      failed,
      cancelled,
      percentComplete,
      estimatedRemainingTimeMs
    };
  }

  public getStatistics(): QueueStatistics {
    const all = Array.from(this.jobs.values());
    const totalJobs = all.length;
    let completedJobs = 0;
    let failedJobs = 0;
    let cancelledJobs = 0;
    let retryAttempts = 0;
    let totalDurationMs = 0;

    const providerUsage: Record<AIProvider, number> = {
      gemini: 0,
      imagen: 0,
      sdxl: 0,
      flux: 0,
      generic: 0
    };

    for (const j of all) {
      providerUsage[j.provider] = (providerUsage[j.provider] || 0) + 1;
      retryAttempts += j.retryCount;

      if (j.status === 'completed') {
        completedJobs++;
        if (j.startedAt && j.completedAt) {
          totalDurationMs += j.completedAt - j.startedAt;
        }
      } else if (j.status === 'failed') {
        failedJobs++;
      } else if (j.status === 'cancelled') {
        cancelledJobs++;
      }
    }

    const averageDurationMs = completedJobs > 0 ? Math.round(totalDurationMs / completedJobs) : 0;
    const failureRate = totalJobs > 0 ? Math.round((failedJobs / totalJobs) * 100) / 100 : 0;

    return {
      totalJobs,
      completedJobs,
      failedJobs,
      cancelledJobs,
      retryAttempts,
      averageDurationMs,
      providerUsage,
      failureRate
    };
  }

  public exportSnapshot(): QueueSnapshot {
    const jobsWithoutController = Array.from(this.jobs.values()).map(j => {
      const { abortController, ...rest } = j;
      return rest;
    });

    return {
      timestamp: Date.now(),
      jobs: jobsWithoutController,
      isPaused: this.isPaused,
      maxConcurrentJobs: this.maxConcurrentJobs
    };
  }

  public importSnapshot(snapshot: QueueSnapshot): void {
    this.clear();
    this.maxConcurrentJobs = snapshot.maxConcurrentJobs;
    this.isPaused = snapshot.isPaused;

    for (const rawJob of snapshot.jobs) {
      const job: GenerationJob = {
        ...rawJob,
        status: rawJob.status === 'running' ? 'pending' : rawJob.status
      };
      this.jobs.set(job.id, job);
    }

    this.notifyQueueUpdated();
    this.processNext();
  }

  private processNext(): void {
    if (this.isPaused || this.activeCount >= this.maxConcurrentJobs) {
      return;
    }

    const pendingJobs = Array.from(this.jobs.values())
      .filter(j => j.status === 'pending')
      .sort((a, b) => {
        const scoreA = PRIORITY_SCORES[a.priority] || 200;
        const scoreB = PRIORITY_SCORES[b.priority] || 200;
        if (scoreA !== scoreB) {
          return scoreB - scoreA;
        }
        return a.createdAt - b.createdAt;
      });

    if (pendingJobs.length === 0) {
      return;
    }

    const job = pendingJobs[0];
    this.executeJob(job);
  }

  private async executeJob(job: GenerationJob): Promise<void> {
    job.status = job.retryCount > 0 ? 'retrying' : 'running';
    job.startedAt = Date.now();
    job.abortController = new AbortController();
    this.activeCount++;

    this.notifyJobStarted(job);
    this.notifyQueueUpdated();

    const currentProvider = job.fallbackChain[job.retryCount % job.fallbackChain.length] || job.provider;
    job.provider = currentProvider;

    try {
      const result = await generateImage(job.promptPackage, {
        ...job.request,
        provider: currentProvider
      });

      if ((job.status as JobStatus) === 'cancelled') {
        return;
      }

      if (result.success) {
        job.status = 'completed';
        job.result = result;
        job.completedAt = Date.now();
        this.activeCount--;

        this.notifyJobCompleted(job, result);
        this.notifyQueueUpdated();
        this.processNext();
      } else {
        throw new Error(result.error || 'Provider returned unsuccessful state');
      }
    } catch (err: any) {
      if ((job.status as JobStatus) === 'cancelled') {
        return;
      }

      const errorMessage = err.message || 'Unknown generation failure';
      job.error = errorMessage;

      if (job.retryCount < job.maxRetries) {
        job.retryCount++;
        job.status = 'pending';
        const backoffMs = Math.pow(2, job.retryCount) * 1000;

        setTimeout(() => {
          this.notifyQueueUpdated();
          this.processNext();
        }, backoffMs);
      } else {
        job.status = 'failed';
        job.completedAt = Date.now();
        this.activeCount--;

        this.notifyJobFailed(job, errorMessage);
        this.notifyQueueUpdated();
        this.processNext();
      }
    }
  }

  private startAutoCleanup(): void {
    if (typeof window !== 'undefined') {
      this.cleanupTimer = setInterval(() => {
        const now = Date.now();
        for (const [id, job] of this.jobs.entries()) {
          if (
            (job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled') &&
            job.completedAt &&
            now - job.completedAt > this.cleanupTimeoutMs
          ) {
            this.jobs.delete(id);
          }
        }
      }, 60000);
    }
  }

  private notifyJobStarted(job: GenerationJob): void {
    for (const listener of this.listeners) {
      try {
        listener.onJobStarted?.(job);
      } catch (_) {}
    }
  }

  private notifyJobCompleted(job: GenerationJob, result: NormalizedGenerationResult): void {
    for (const listener of this.listeners) {
      try {
        listener.onJobCompleted?.(job, result);
      } catch (_) {}
    }
  }

  private notifyJobFailed(job: GenerationJob, error: string): void {
    for (const listener of this.listeners) {
      try {
        listener.onJobFailed?.(job, error);
      } catch (_) {}
    }
  }

  private notifyQueueUpdated(): void {
    const stats = this.getStatistics();
    const progress = this.getProgress();
    for (const listener of this.listeners) {
      try {
        listener.onQueueUpdated?.(stats, progress);
      } catch (_) {}
    }
  }
}

export const globalGenerationQueue = new GenerationQueue(3, 300000);
