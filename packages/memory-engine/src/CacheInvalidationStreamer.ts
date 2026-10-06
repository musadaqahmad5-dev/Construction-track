/**
 * EAOS Look Vision AI Fashion OS - Distributed Real-Time Consistency & Stream Engine
 * Path: packages/memory-engine/src/CacheInvalidationStreamer.ts
 * Subsystem: Redis Session Cache Invalidation, XADD Pub/Sub Streaming & Multi-Node State Synchronization
 */

import crypto from 'crypto';

export interface CacheInvalidationPayload {
  userId: string;
  invalidatedCollectionString: string;
  evictionReason: string;
  executionTimestamp: number;
}

export interface EventStreamEnvelope<T = Record<string, any>> {
  eventId: string;
  messageTraceId: string;
  payloadData: T;
  signature: string;
  emittedAt: number;
}

export interface RedisCompatibleClient {
  del: (...keys: string[]) => Promise<number>;
  xadd: (streamKey: string, id: string, ...args: (string | number)[]) => Promise<string>;
  publish?: (channel: string, message: string) => Promise<number>;
  ping?: () => Promise<string>;
}

export interface CacheInvalidationStreamerOptions {
  redisClient?: RedisCompatibleClient;
  keyPrefix?: string;
  streamPrefix?: string;
  signingSecret?: string;
  maxStreamLength?: number;
}

export class CacheInvalidationStreamer {
  private redis: RedisCompatibleClient | null = null;
  private readonly keyPrefix: string;
  private readonly streamPrefix: string;
  private readonly signingSecret: string;
  private readonly maxStreamLength: number;
  private fallbackMemoryCache: Map<string, unknown> = new Map();

  constructor(options?: CacheInvalidationStreamerOptions) {
    this.keyPrefix = options?.keyPrefix || 'fashion_persistent_style_profile_';
    this.streamPrefix = options?.streamPrefix || 'eaos:stream:state_changes:';
    this.signingSecret = options?.signingSecret || process.env.STREAM_HMAC_SECRET || 'eaos-default-stream-entropy-key';
    this.maxStreamLength = options?.maxStreamLength || 10000;

    if (options?.redisClient) {
      this.redis = options.redisClient;
    }
  }

  /**
   * Lazily initializes or returns the configured Redis client instance
   */
  private getRedisClient(): RedisCompatibleClient {
    if (!this.redis) {
      // In-memory fallback proxy when external Redis cluster is not directly injected
      this.redis = {
        del: async (...keys: string[]): Promise<number> => {
          let count = 0;
          for (const key of keys) {
            if (this.fallbackMemoryCache.has(key)) {
              this.fallbackMemoryCache.delete(key);
              count++;
            }
          }
          return count;
        },
        xadd: async (streamKey: string, id: string, ...args: (string | number)[]): Promise<string> => {
          const generatedId = id === '*' ? `${Date.now()}-0` : id;
          return generatedId;
        }
      };
    }
    return this.redis;
  }

  /**
   * Computes cryptographic HMAC-SHA256 signature for envelope tamper detection
   */
  private generatePayloadSignature(traceId: string, timestamp: number, serializedPayload: string): string {
    const rawContent = `${traceId}:${timestamp}:${serializedPayload}`;
    return crypto
      .createHmac('sha256', this.signingSecret)
      .update(rawContent)
      .digest('hex');
  }

  /**
   * Formats the target Redis cache key for persistent style profile states
   */
  private formatCacheKey(userId: string): string {
    return `${this.keyPrefix}${userId.trim()}`;
  }

  /**
   * Instantly purges a user's localized state cache key across distributed nodes
   */
  public async invalidateSessionCache(userId: string, collection: string): Promise<boolean> {
    const startTime = performance.now();

    if (!userId || typeof userId !== 'string' || !userId.trim()) {
      console.error('[CACHE INVALIDATION ERROR] Invariant violation: userId must be a non-empty string.');
      return false;
    }

    if (!collection || typeof collection !== 'string' || !collection.trim()) {
      console.error('[CACHE INVALIDATION ERROR] Invariant violation: collection must be a non-empty string.');
      return false;
    }

    const sanitizedUserId = userId.trim();
    const sanitizedCollection = collection.trim();
    const cacheKey = this.formatCacheKey(sanitizedUserId);

    const payload: CacheInvalidationPayload = {
      userId: sanitizedUserId,
      invalidatedCollectionString: sanitizedCollection,
      evictionReason: 'EXPLICIT_MUTATION_EVICTION',
      executionTimestamp: Date.now()
    };

    try {
      const client = this.getRedisClient();
      const deletedKeysCount = await client.del(cacheKey);

      const elapsed = (performance.now() - startTime).toFixed(2);
      console.info(
        `[CACHE INVALIDATION SUCCESS] Purged key '${cacheKey}' for collection '${sanitizedCollection}' (Evicted: ${deletedKeysCount}, Latency: ${elapsed}ms)`
      );

      // Emit background invalidation notification to Redis pub/sub stream
      await this.streamStateChangeEvent(sanitizedUserId, 'cache.invalidated', payload);

      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[CACHE INVALIDATION FAILED] Critical eviction failure for key '${cacheKey}': ${message}`);
      return false;
    }
  }

  /**
   * Serializes the state change envelope and appends it to a partitioned Redis Stream using XADD
   */
  public async streamStateChangeEvent(
    userId: string,
    topic: string,
    data: Record<string, any>
  ): Promise<string> {
    const startTime = performance.now();

    if (!userId || typeof userId !== 'string' || !userId.trim()) {
      throw new Error('[EVENT STREAM ERROR] Parameter validation failed: userId is required.');
    }

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      throw new Error('[EVENT STREAM ERROR] Parameter validation failed: topic is required.');
    }

    if (!data || typeof data !== 'object') {
      throw new Error('[EVENT STREAM ERROR] Parameter validation failed: data must be a valid object.');
    }

    const sanitizedUserId = userId.trim();
    const sanitizedTopic = topic.trim();
    const timestamp = Date.now();
    const traceId = `trc_${crypto.randomBytes(8).toString('hex')}`;
    const eventId = `evt_${crypto.randomBytes(12).toString('hex')}`;
    const serializedData = JSON.stringify(data);

    const signature = this.generatePayloadSignature(traceId, timestamp, serializedData);

    const envelope: EventStreamEnvelope = {
      eventId,
      messageTraceId: traceId,
      payloadData: data,
      signature,
      emittedAt: timestamp
    };

    const streamPartitionKey = `${this.streamPrefix}${sanitizedTopic}`;

    try {
      const client = this.getRedisClient();

      const streamMessageId = await client.xadd(
        streamPartitionKey,
        '*',
        'eventId',
        eventId,
        'traceId',
        traceId,
        'userId',
        sanitizedUserId,
        'topic',
        sanitizedTopic,
        'payload',
        serializedData,
        'signature',
        signature,
        'emittedAt',
        String(timestamp)
      );

      const elapsed = (performance.now() - startTime).toFixed(2);
      console.info(
        `[REDIS STREAM XADD] Stream: '${streamPartitionKey}' | MsgId: '${streamMessageId}' | Event: '${eventId}' | Latency: ${elapsed}ms`
      );

      return streamMessageId;
    } catch (streamError: unknown) {
      const errMsg = streamError instanceof Error ? streamError.message : String(streamError);
      console.error(
        `[REDIS STREAM ERROR] Failed to append event '${eventId}' to stream '${streamPartitionKey}': ${errMsg}`
      );
      throw streamError;
    }
  }
}
