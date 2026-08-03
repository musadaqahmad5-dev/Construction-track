export interface TypingPipelineOptions {
  baseDelayMs?: number;
  varianceMs?: number;
  punctuationPauseMs?: number;
  onTokenTyped?: (chunk: string, fullText: string) => void;
  onComplete?: (fullText: string) => void;
}

export class TypingPipeline {
  private queue: string[] = [];
  private fullText: string = '';
  private displayedText: string = '';
  private timer: NodeJS.Timeout | null = null;
  private isTyping: boolean = false;
  private isPaused: boolean = false;

  private baseDelayMs: number;
  private varianceMs: number;
  private punctuationPauseMs: number;
  private onTokenTyped?: (chunk: string, fullText: string) => void;
  private onComplete?: (fullText: string) => void;

  constructor(options: TypingPipelineOptions = {}) {
    this.baseDelayMs = options.baseDelayMs ?? 14;
    this.varianceMs = options.varianceMs ?? 8;
    this.punctuationPauseMs = options.punctuationPauseMs ?? 120;
    this.onTokenTyped = options.onTokenTyped;
    this.onComplete = options.onComplete;
  }

  public appendToken(token: string): void {
    if (!token) return;
    this.fullText += token;

    // Push individual characters or small chunks to queue
    const chars = token.split('');
    this.queue.push(...chars);

    if (!this.isTyping && !this.isPaused) {
      this.startTyping();
    }
  }

  public appendFullText(text: string): void {
    if (!text) return;
    const remaining = text.substring(this.displayedText.length);
    this.appendToken(remaining);
  }

  private startTyping(): void {
    this.isTyping = true;
    this.scheduleNextChar();
  }

  private scheduleNextChar(): void {
    if (this.isPaused) return;

    if (this.queue.length === 0) {
      this.isTyping = false;
      if (this.displayedText.length >= this.fullText.length && this.onComplete) {
        this.onComplete(this.displayedText);
      }
      return;
    }

    const nextChar = this.queue.shift()!;
    this.displayedText += nextChar;

    if (this.onTokenTyped) {
      this.onTokenTyped(nextChar, this.displayedText);
    }

    let delay = this.baseDelayMs + Math.floor(Math.random() * this.varianceMs);
    if (['.', '!', '?', '\n'].includes(nextChar)) {
      delay += this.punctuationPauseMs;
    } else if ([',', ';', ':'].includes(nextChar)) {
      delay += Math.floor(this.punctuationPauseMs * 0.5);
    }

    this.timer = setTimeout(() => {
      this.scheduleNextChar();
    }, delay);
  }

  public pause(): void {
    this.isPaused = true;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public resume(): void {
    if (!this.isPaused) return;
    this.isPaused = false;
    if (this.queue.length > 0 && !this.isTyping) {
      this.startTyping();
    }
  }

  public flush(): string {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.displayedText = this.fullText;
    this.queue = [];
    this.isTyping = false;
    this.isPaused = false;

    if (this.onTokenTyped) {
      this.onTokenTyped('', this.displayedText);
    }
    if (this.onComplete) {
      this.onComplete(this.displayedText);
    }

    return this.displayedText;
  }

  public stop(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.queue = [];
    this.isTyping = false;
    this.isPaused = false;
  }

  public reset(): void {
    this.stop();
    this.fullText = '';
    this.displayedText = '';
  }

  public getDisplayedText(): string {
    return this.displayedText;
  }

  public getFullText(): string {
    return this.fullText;
  }

  public isBusy(): boolean {
    return this.isTyping || this.queue.length > 0;
  }
}
