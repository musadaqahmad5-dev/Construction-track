export interface WorkloadJob {
  id: string;
  weight: 'light' | 'medium' | 'intensive';
  priority: 'high' | 'normal' | 'background';
  action: () => void;
}

export class WorkloadBalancer {
  private static queue: WorkloadJob[] = [];
  private static activeRunnersCount = 0;
  private static maxConcurrency = 2; // Simulated concurrent threads

  static enqueueJob(job: WorkloadJob) {
    this.queue.push(job);
    this.queue.sort((a, b) => {
      // Priority sorting
      const prioMap = { high: 0, normal: 1, background: 2 };
      return prioMap[a.priority] - prioMap[b.priority];
    });
    this.scheduleNextDrain();
  }

  private static scheduleNextDrain() {
    if (this.queue.length === 0 || this.activeRunnersCount >= this.maxConcurrency) return;

    this.activeRunnersCount++;
    const nextJob = this.queue.shift();

    if (nextJob) {
      // Run non-blocking using requestAnimationFrame/requestIdleCallback style simulation
      requestAnimationFrame(() => {
        try {
          nextJob.action();
        } catch (e) {
          console.error('Workload Balance job error', e);
        } finally {
          this.activeRunnersCount--;
          this.scheduleNextDrain();
        }
      });
    }
  }

  static getQueueStatus() {
    return {
      pendingJobs: this.queue.length,
      activeWorkers: this.activeRunnersCount,
      fpsIndicated: 60 - Math.min(2, this.activeRunnersCount) // UI thread remaining frames
    };
  }
}
