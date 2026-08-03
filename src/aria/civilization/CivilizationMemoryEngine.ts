/**
 * ARIA v2.5 Civilization Memory Engine (Singleton Orchestrator)
 * Product: LOOK VISION v2.4
 */

import {
  KnowledgeGraphData,
  CivilizationMemoryEngineStatus,
  SearchQueryOptions,
  SearchResultItem,
  TemporalSnapshot
} from './CivilizationMemoryTypes';
import { KnowledgeGraphBuilder } from './KnowledgeGraphBuilder';
import { MemoryIndexer } from './MemoryIndexer';
import { TemporalMemoryEngine } from './TemporalMemoryEngine';
import { MemorySearchEngine } from './MemorySearchEngine';
import { KnowledgeConsolidator } from './KnowledgeConsolidator';
import { MemoryGovernance } from './MemoryGovernance';
import { CivilizationStorage } from './CivilizationStorage';
import { CivilizationHistory } from './CivilizationHistory';

export class CivilizationMemoryEngine {
  private static instance: CivilizationMemoryEngine;
  private currentGraph: KnowledgeGraphData | null = null;
  private status: CivilizationMemoryEngineStatus = {
    isInitialized: false,
    isIndexing: false,
    totalIndexedNodes: 0,
    totalGraphEdges: 0
  };

  private constructor() {}

  public static getInstance(): CivilizationMemoryEngine {
    if (!CivilizationMemoryEngine.instance) {
      CivilizationMemoryEngine.instance = new CivilizationMemoryEngine();
    }
    return CivilizationMemoryEngine.instance;
  }

  public async initialize(userId: string = 'guest_user'): Promise<KnowledgeGraphData> {
    this.status.isIndexing = true;
    try {
      const stored = CivilizationStorage.loadGraph(userId);
      if (stored) {
        this.currentGraph = stored;
      } else {
        this.currentGraph = await this.indexAndConsolidate(userId);
      }

      MemoryIndexer.indexNodes(this.currentGraph.nodes);
      this.status.isInitialized = true;
      this.status.isIndexing = false;
      this.status.totalIndexedNodes = this.currentGraph.nodes.length;
      this.status.totalGraphEdges = this.currentGraph.edges.length;
      this.status.lastIndexedAt = this.currentGraph.lastUpdated;

      return this.currentGraph;
    } catch (err: any) {
      this.status.isIndexing = false;
      this.status.lastError = err.message || 'Civilization memory initialization failed';
      throw err;
    }
  }

  public async indexAndConsolidate(userId: string = 'guest_user'): Promise<KnowledgeGraphData> {
    this.status.isIndexing = true;
    try {
      const rawGraph = await KnowledgeGraphBuilder.buildGraph(userId);
      const sanitizedNodes = rawGraph.nodes.map((n) => MemoryGovernance.enforcePrivacyFilter(n));
      const sanitizedGraph: KnowledgeGraphData = { ...rawGraph, nodes: sanitizedNodes };

      const consolidated = KnowledgeConsolidator.consolidate(sanitizedGraph);
      MemoryIndexer.indexNodes(consolidated.nodes);

      const snapshot = TemporalMemoryEngine.createSnapshot(consolidated);
      CivilizationHistory.addSnapshot(userId, snapshot);
      CivilizationStorage.saveGraph(userId, consolidated);

      this.currentGraph = consolidated;
      this.status.isInitialized = true;
      this.status.isIndexing = false;
      this.status.totalIndexedNodes = consolidated.nodes.length;
      this.status.totalGraphEdges = consolidated.edges.length;
      this.status.lastIndexedAt = consolidated.lastUpdated;

      return consolidated;
    } catch (err: any) {
      this.status.isIndexing = false;
      this.status.lastError = err.message || 'Indexing failed';
      throw err;
    }
  }

  public search(queryOptions: SearchQueryOptions): SearchResultItem[] {
    if (!this.currentGraph) return [];
    return MemorySearchEngine.search(queryOptions, this.currentGraph);
  }

  public getGraph(): KnowledgeGraphData | null {
    return this.currentGraph;
  }

  public getStatus(): CivilizationMemoryEngineStatus {
    return { ...this.status };
  }

  public getSnapshots(userId: string): TemporalSnapshot[] {
    return CivilizationHistory.getHistory(userId);
  }
}

export const civilizationMemoryEngine = CivilizationMemoryEngine.getInstance();
