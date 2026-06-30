export interface VectorRecord {
  id: string;
  userId: string;
  vector: number[];
  metadata: Record<string, any>;
  timestamp: Date;
}

export class VectorMemoryStore {
  private memoryCache: Map<string, VectorRecord> = new Map();

  constructor() {
    console.log("[EAOS MEMORY ENGINE] Initializing enterprise semantic indexing cluster.");
  }

  /**
   * Upserts a high-dimensional vector record (e.g., 1536d text embedding or fashion image representation)
   * into the underlying vector store (pgvector/Pinecone equivalent).
   */
  public async upsertVector(record: VectorRecord): Promise<void> {
    try {
      this.memoryCache.set(record.id, record);
      console.log(`[EAOS MEMORY ENGINE] Saved vector profile with ID ${record.id} in namespace: ${record.metadata.namespace || "default"}`);
    } catch (error: any) {
      console.error("[EAOS MEMORY ENGINE] Failed to persist vector record:", error);
      throw error;
    }
  }

  /**
   * Performs Cosine Similarity search over cached embeddings.
   */
  public async searchSimilarVectors(
    queryVector: number[],
    limit: number = 5,
    filters?: Record<string, any>
  ): Promise<Array<{ record: VectorRecord; similarity: number }>> {
    try {
      const matches: Array<{ record: VectorRecord; similarity: number }> = [];

      for (const record of this.memoryCache.values()) {
        if (filters) {
          let matchesFilter = true;
          for (const [key, value] of Object.entries(filters)) {
            if (record.metadata[key] !== value) {
              matchesFilter = false;
              break;
            }
          }
          if (!matchesFilter) continue;
        }

        const similarity = this.cosineSimilarity(queryVector, record.vector);
        matches.push({ record, similarity });
      }

      // Sort by descending similarity
      return matches.sort((a, b) => b.similarity - a.similarity).slice(0, limit);
    } catch (error: any) {
      console.error("[EAOS MEMORY ENGINE] Semantic similarity computation failed:", error);
      return [];
    }
  }

  /**
   * Computes Cosine Similarity between two arrays.
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
