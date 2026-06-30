import { VectorMemoryStore, VectorRecord } from "./VectorMemoryStore";

/**
 * =========================================================================
 * 1. USER FASHION PROFILE SCHEMA
 * =========================================================================
 */

export interface AestheticPreference {
  archetypes: Record<string, number>; // e.g., { "Classic Minimalism": 0.8, "Techwear": 0.2 }
  dominantColors: string[];
  excludedColors: string[];
  favoredSilhouettes: string[];
  textiles: string[];
}

export interface UserStyleProfile {
  userId: string;
  preferences: AestheticPreference;
  styleDNAVector: number[]; // 1536-dimensional semantic representation
  sartorialMaturityScore: number; // 0.0 to 1.0 (evolution level of user style definition)
  lastUpdated: Date;
}

export interface OutfitHistoryRecord {
  id: string;
  userId: string;
  outfitId: string;
  components: Array<{
    id: string;
    category: string;
    name: string;
    tags: string[];
  }>;
  userRating: number; // 1 to 5 stars or binary satisfaction indicator
  occasion: string;
  wornDate: Date;
  feedbackVerbatim?: string;
}

/**
 * =========================================================================
 * 2. STYLE PREFERENCE TRACKING SYSTEM & BEHAVIOR LEARNING ENGINE
 * =========================================================================
 */

export class StyleMemorySystem {
  private vectorStore: VectorMemoryStore;

  constructor(vectorStore: VectorMemoryStore) {
    this.vectorStore = vectorStore;
  }

  /**
   * Updates user preference archetype weights dynamically based on client feed interactions.
   * Leverages exponential moving average to decay stale sartorial preferences.
   */
  public trackInteraction(
    currentProfile: UserStyleProfile,
    interactionType: "like" | "dismiss" | "purchase",
    itemMetadata: { archetypes: string[]; colors: string[]; silhouettes: string[] },
    decayRate: number = 0.1
  ): UserStyleProfile {
    const updatedProfile = { ...currentProfile, lastUpdated: new Date() };
    const preferences = { ...updatedProfile.preferences };

    // Decay current archetype weights
    for (const archetype in preferences.archetypes) {
      preferences.archetypes[archetype] *= (1 - decayRate);
    }

    // Amplify archetypes corresponding to interaction
    const multiplier = interactionType === "purchase" ? 1.5 : interactionType === "like" ? 1.0 : -0.8;
    const boost = decayRate * multiplier;

    itemMetadata.archetypes.forEach(archetype => {
      if (!preferences.archetypes[archetype]) {
        preferences.archetypes[archetype] = 0;
      }
      preferences.archetypes[archetype] = Math.max(0, Math.min(1.0, preferences.archetypes[archetype] + boost));
    });

    // Color preference evolution (frequency-based queue with deduplication)
    if (interactionType !== "dismiss") {
      itemMetadata.colors.forEach(color => {
        if (!preferences.dominantColors.includes(color)) {
          preferences.dominantColors.unshift(color);
        }
      });
      preferences.dominantColors = preferences.dominantColors.slice(0, 10); // Keep top 10
    } else {
      itemMetadata.colors.forEach(color => {
        if (!preferences.excludedColors.includes(color)) {
          preferences.excludedColors.push(color);
        }
      });
    }

    updatedProfile.preferences = preferences;
    return updatedProfile;
  }

  /**
   * =========================================================================
   * 3. OUTFIT HISTORY MEMORY
   * =========================================================================
   */

  /**
   * Commits a record of an executed/worn outfit into the distributed semantic store.
   */
  public async archiveOutfitHistory(record: OutfitHistoryRecord, styleVector: number[]): Promise<void> {
    const memoryId = `episodic-outfit-${record.id}`;
    const vectorRecord: VectorRecord = {
      id: memoryId,
      userId: record.userId,
      vector: styleVector,
      metadata: {
        namespace: "outfit-episodic-history",
        outfitId: record.outfitId,
        occasion: record.occasion,
        rating: record.userRating,
        wornDate: record.wornDate.toISOString(),
        feedback: record.feedbackVerbatim || ""
      },
      timestamp: new Date()
    };

    await this.vectorStore.upsertVector(vectorRecord);
    console.log(`[STYLE MEMORY SYSTEM] Archived outfit transaction history item ${record.id} in episodic store.`);
  }

  /**
   * Retrieves similar historical outfits worn by the user for comparison.
   */
  public async retrieveHistoricalAnalogies(
    userId: string,
    queryVector: number[],
    limit: number = 3
  ): Promise<any[]> {
    const results = await this.vectorStore.searchSimilarVectors(queryVector, limit, {
      namespace: "outfit-episodic-history",
      userId
    });

    return results.map(match => ({
      outfitId: match.record.metadata.outfitId,
      occasion: match.record.metadata.occasion,
      rating: match.record.metadata.rating,
      wornDate: new Date(match.record.metadata.wornDate),
      feedback: match.record.metadata.feedback,
      similarityScore: match.similarity
    }));
  }

  /**
   * =========================================================================
   * 4. EMBEDDING-BASED STYLE VECTOR REPRESENTATION
   * =========================================================================
   */

  /**
   * High-dimensional synthesis utility to calculate the resultant vector of combined stylistic elements.
   */
  public computeSynthesizedStyleVector(
    baseVector: number[],
    interactingVectors: number[][],
    weights: number[]
  ): number[] {
    if (interactingVectors.length !== weights.length) {
      throw new Error("[STYLE MEMORY ERROR] Vector weighting array mismatch.");
    }

    const dimensionalSize = baseVector.length;
    const resultant = [...baseVector];

    for (let d = 0; d < dimensionalSize; d++) {
      let weightSum = 1.0;
      for (let i = 0; i < interactingVectors.length; i++) {
        resultant[d] += interactingVectors[i][d] * weights[i];
        weightSum += weights[i];
      }
      resultant[d] /= weightSum;
    }

    return this.normalize(resultant);
  }

  /**
   * =========================================================================
   * 5. PERSONALIZATION ENGINE
   * =========================================================================
   */

  /**
   * Filters and ranks candidate garments based on cosine similarity scores matching the active style DNA vector.
   */
  public personalizeCandidates<T extends { styleVector: number[] }>(
    userStyleVector: number[],
    candidates: T[],
    relevanceThreshold: number = 0.5
  ): Array<{ item: T; alignmentScore: number }> {
    const matches: Array<{ item: T; alignmentScore: number }> = [];

    candidates.forEach(candidate => {
      const score = this.cosineSimilarity(userStyleVector, candidate.styleVector);
      if (score >= relevanceThreshold) {
        matches.push({ item: candidate, alignmentScore: score });
      }
    });

    return matches.sort((a, b) => b.alignmentScore - a.alignmentScore);
  }

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

  private normalize(vec: number[]): number[] {
    const magnitude = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
    if (magnitude === 0) return vec;
    return vec.map(val => val / magnitude);
  }
}
