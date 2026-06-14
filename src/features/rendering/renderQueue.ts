import { RenderedLook } from './outfitRenderer';

export interface RenderTask {
  id: string;
  payload: any;
  status: 'queued' | 'rendering' | 'completed' | 'failed';
  progress: number; // 0 to 100
  result?: RenderedLook;
}

export class RenderQueue {
  private static taskList: RenderTask[] = [];
  private static activeRenderCount = 0;
  private static maxConcurrentRenders = 1; // Strict queue limit to maintain 60fps scrolling

  static pushTask(payload: any, onComplete: (task: RenderTask) => void) {
    const task: RenderTask = {
      id: `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      payload,
      status: 'queued',
      progress: 0
    };

    this.taskList.push(task);
    this.processQueue(onComplete);
  }

  static getActiveTasks(): RenderTask[] {
    return this.taskList;
  }

  private static processQueue(onComplete: (task: RenderTask) => void) {
    if (this.activeRenderCount >= this.maxConcurrentRenders) {
      return; // Wait for slot availability
    }

    const nextTask = this.taskList.find(t => t.status === 'queued');
    if (!nextTask) return;

    nextTask.status = 'rendering';
    this.activeRenderCount++;

    let progressTimer = 0;
    const interval = setInterval(() => {
      progressTimer += 25;
      nextTask.progress = progressTimer;

      if (progressTimer >= 100) {
        clearInterval(interval);
        nextTask.status = 'completed';
        this.activeRenderCount--;

        // Run client callback
        onComplete(nextTask);

        // Process next
        this.processQueue(onComplete);
      }
    }, 120); // 120ms tick simulating fast web worker GPU compilation
  }
}
