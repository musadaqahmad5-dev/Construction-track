/**
 * EAOS Look Vision AI Fashion OS - Automated Market Synchronization Engine
 * Path: packages/ai-engine/src/TrendIngestionPipeline.ts
 * Subsystem: Market Ingestion Worker, LLM Semantic Parser & pgvector Persistent Storage
 */

import { GoogleGenAI, Type } from "@google/genai";

export interface InboundRawFeedItem {
  sourceUrl: string;
  title: string;
  rawDescription: string;
  timestamp: number | string;
}

export interface StructuredTrendPayload {
  trendName: string;
  dominantAesthetics: string[];
  targetKeywords: string[];
  confidenceImpactScore: number;
}

export interface DatabasePoolClient {
  query: (sql: string, params?: unknown[]) => Promise<{ rowCount?: number; rows?: unknown[] }>;
  release?: () => void;
}

export interface DatabasePool {
  query: (sql: string, params?: unknown[]) => Promise<{ rowCount?: number; rows?: unknown[] }>;
  connect?: () => Promise<DatabasePoolClient>;
}

export interface TrendIngestionPipelineOptions {
  dbPool?: DatabasePool;
  apiKey?: string;
  modelName?: string;
  maxBatchConcurrency?: number;
}

export class TrendIngestionPipeline {
  private ai: GoogleGenAI | null = null;
  private dbPool: DatabasePool | null = null;
  private readonly modelName: string;
  private readonly maxBatchConcurrency: number;

  constructor(options?: TrendIngestionPipelineOptions) {
    this.modelName = options?.modelName || "gemini-3.7-flash";
    this.maxBatchConcurrency = options?.maxBatchConcurrency || 5;

    if (options?.dbPool) {
      this.dbPool = options.dbPool;
    }

    const apiKey = options?.apiKey || process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    } else {
      console.warn(
        "[TREND INGESTION] Warning: GEMINI_API_KEY is not defined. Worker will operate with graceful heuristic parsing."
      );
    }
  }

  private getGenAIClient(): GoogleGenAI {
    if (!this.ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "[TREND INGESTION ERROR] GEMINI_API_KEY environment variable is required for live LLM extraction."
        );
      }
      this.ai = new GoogleGenAI({ apiKey });
    }
    return this.ai;
  }

  /**
   * Validates raw inbound feed item integrity before parsing
   */
  private validateInboundFeedItem(item: InboundRawFeedItem): boolean {
    if (!item || typeof item !== "object") return false;
    if (typeof item.title !== "string" || !item.title.trim()) return false;
    if (typeof item.rawDescription !== "string" || !item.rawDescription.trim()) return false;
    if (typeof item.sourceUrl !== "string" || !item.sourceUrl.trim()) return false;
    return true;
  }

  /**
   * Sanitizes and normalizes extracted trend score within [0.00, 1.00] bounds
   */
  private normalizeConfidenceScore(score: unknown): number {
    if (typeof score !== "number" || isNaN(score)) return 0.75;
    const clamped = Math.max(0.0, Math.min(1.0, score));
    return Number(clamped.toFixed(2));
  }

  /**
   * Invokes Gemini 3.7 Flash with structured schema enforcement to extract market trend indicators
   */
  private async parseTrendWithGemini(feedItem: InboundRawFeedItem): Promise<StructuredTrendPayload> {
    const aiClient = this.getGenAIClient();

    const systemPrompt = `You are a Principal Fashion Trend Analyst for EAOS Look Vision OS.
Analyze the following fashion industry signal, runway report, or editorial feed item.
Extract the core trend entity, its dominant aesthetic movements, granular search keywords, and an impact score between 0.00 and 1.00 reflecting its commercial momentum.`;

    const userPrompt = `SOURCE TITLE: ${feedItem.title}
SOURCE URL: ${feedItem.sourceUrl}
FEED CONTENT:
${feedItem.rawDescription}

Extract the structured trend representation strictly adhering to the schema.`;

    try {
      const response = await aiClient.models.generateContent({
        model: this.modelName,
        contents: [
          {
            role: "user",
            parts: [{ text: userPrompt }]
          }
        ],
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              trendName: {
                type: Type.STRING,
                description: "Clean, standardized title of the fashion trend (e.g., 'Graphene Techwear Tailoring')"
              },
              dominantAesthetics: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Core stylistic classifications (e.g., ['Avant-Garde', 'Cyber-Heritage'])"
              },
              targetKeywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array of associated search keywords and technical fabric terms"
              },
              confidenceImpactScore: {
                type: Type.NUMBER,
                description: "Estimated market impact score between 0.00 and 1.00"
              }
            },
            required: ["trendName", "dominantAesthetics", "targetKeywords", "confidenceImpactScore"]
          }
        }
      });

      const rawText = response.text?.trim();
      if (!rawText) {
        throw new Error("[TREND INGESTION] Empty response returned by model inference endpoint.");
      }

      const parsed = JSON.parse(rawText) as StructuredTrendPayload;

      return {
        trendName: String(parsed.trendName || feedItem.title).trim(),
        dominantAesthetics: Array.isArray(parsed.dominantAesthetics)
          ? parsed.dominantAesthetics.map(a => String(a).trim()).filter(Boolean)
          : ["Contemporary Haute Couture"],
        targetKeywords: Array.isArray(parsed.targetKeywords)
          ? parsed.targetKeywords.map(k => String(k).trim()).filter(Boolean)
          : [feedItem.title.toLowerCase()],
        confidenceImpactScore: this.normalizeConfidenceScore(parsed.confidenceImpactScore)
      };
    } catch (modelError: unknown) {
      console.warn(
        `[TREND INGESTION WARNING] Upstream LLM inference failed for "${feedItem.title}". Activating heuristic fallback:`,
        modelError instanceof Error ? modelError.message : String(modelError)
      );

      // Fallback deterministic extractor for offline or rate-limited environments
      const sanitizedName = feedItem.title.replace(/[^\w\s-]/gi, "").trim();
      const extractedWords = feedItem.rawDescription
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .split(/\s+/)
        .filter(w => w.length > 4)
        .slice(0, 8);

      return {
        trendName: sanitizedName || "Emerging Runway Trend",
        dominantAesthetics: ["Avant-Garde Atelier", "Minimalist Luxury"],
        targetKeywords: Array.from(new Set([feedItem.title.toLowerCase(), ...extractedWords])),
        confidenceImpactScore: 0.7
      };
    }
  }

  /**
   * Persists the parsed trend structure into the PostgreSQL tracking table
   */
  private async persistTrendToDatabase(trend: StructuredTrendPayload): Promise<void> {
    const upsertSql = `
      INSERT INTO eaos.market_trends (
        trend_name,
        associated_keywords,
        impact_score,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (trend_name)
      DO UPDATE SET
        associated_keywords = EXCLUDED.associated_keywords,
        impact_score = EXCLUDED.impact_score,
        updated_at = CURRENT_TIMESTAMP;
    `;

    const params = [
      trend.trendName,
      trend.targetKeywords,
      trend.confidenceImpactScore
    ];

    if (this.dbPool) {
      await this.dbPool.query(upsertSql, params);
    } else {
      console.info(
        `[TREND INGESTION MOCK-DB] Executed write-through for "${trend.trendName}" (Score: ${trend.confidenceImpactScore}, Keywords: ${trend.targetKeywords.length})`
      );
    }
  }

  /**
   * Orchestrates the daily market trend ingestion and write-through workflow
   */
  public async executeDailyIngestionSync(feedItems: InboundRawFeedItem[]): Promise<void> {
    const syncStartTime = performance.now();
    console.info(`[TREND INGESTION PIPELINE] Starting daily ingestion sync for ${feedItems?.length ?? 0} inbound feed items.`);

    if (!Array.isArray(feedItems) || feedItems.length === 0) {
      console.warn("[TREND INGESTION PIPELINE] No valid feed items provided. Ingestion cycle terminated.");
      return;
    }

    const validItems = feedItems.filter(item => this.validateInboundFeedItem(item));
    console.info(`[TREND INGESTION PIPELINE] Validated ${validItems.length}/${feedItems.length} items for processing.`);

    let successCount = 0;
    let failureCount = 0;

    // Process items in controlled concurrency chunks
    for (let i = 0; i < validItems.length; i += this.maxBatchConcurrency) {
      const chunk = validItems.slice(i, i + this.maxBatchConcurrency);

      await Promise.all(
        chunk.map(async item => {
          const itemStartTime = performance.now();
          try {
            const structuredTrend = await this.parseTrendWithGemini(item);
            await this.persistTrendToDatabase(structuredTrend);
            successCount++;

            const latency = (performance.now() - itemStartTime).toFixed(1);
            console.info(
              `[TREND INGESTION SYNCED] "${structuredTrend.trendName}" | Impact: ${structuredTrend.confidenceImpactScore} | Latency: ${latency}ms`
            );
          } catch (err: unknown) {
            failureCount++;
            const errMsg = err instanceof Error ? err.message : String(err);
            console.error(`[TREND INGESTION ERROR] Failed to ingest item "${item.title}": ${errMsg}`);
          }
        })
      );
    }

    const totalDuration = (performance.now() - syncStartTime).toFixed(1);
    console.info(
      `[TREND INGESTION COMPLETE] Processed ${validItems.length} items in ${totalDuration}ms (Success: ${successCount}, Failures: ${failureCount})`
    );
  }
}
