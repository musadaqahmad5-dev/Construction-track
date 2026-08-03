/**
 * ARIA v2.5 Knowledge Graph Builder
 * Product: LOOK VISION v2.4
 */

import { KnowledgeGraphData, KnowledgeEdge, MemoryNodeRef } from './CivilizationMemoryTypes';
import { memoryEngine } from '../memory/MemoryEngine';
import { styleDNAEngine } from '../styleDNA/StyleDNAEngine';
import { decisionEngine } from '../decision/DecisionEngine';
import { creativeEngine } from '../creative/CreativeEngine';
import { visualIntelligenceEngine } from '../vision/VisualIntelligenceEngine';
import { digitalTwinEngine } from '../digitalTwin/DigitalTwinEngine';
import { simulationEngine } from '../simulation/SimulationEngine';

export class KnowledgeGraphBuilder {
  public static async buildGraph(userId: string = 'guest_user'): Promise<KnowledgeGraphData> {
    const nodes: MemoryNodeRef[] = [];
    const edges: KnowledgeEdge[] = [];

    // 1. Ingest Personal & Fashion Memory references
    const memories = memoryEngine.getMemories();
    memories.forEach((m, idx) => {
      const nodeId = `node_mem_${m.id || idx}`;
      const memoryVal = typeof m.value === 'string' ? m.value : JSON.stringify(m.value);
      const tags = m.metadata?.tags || ['fashion', m.category];

      nodes.push({
        nodeId,
        domain: 'fashion',
        sourceId: m.id || `mem_${idx}`,
        title: m.category || 'Fashion Memory Item',
        summary: memoryVal || 'Stored fashion preference memory',
        tags,
        confidence: m.confidence || 0.9,
        createdAt: m.createdAt || new Date().toISOString(),
        updatedAt: m.updatedAt || new Date().toISOString()
      });
    });

    // 2. Ingest Style DNA Node
    const dnaProfile = styleDNAEngine.getProfile();
    if (dnaProfile) {
      const dnaNodeId = `node_dna_${userId}`;
      nodes.push({
        nodeId: dnaNodeId,
        domain: 'personal',
        sourceId: dnaProfile.id || 'style_dna_profile',
        title: `Style DNA Archetype: ${dnaProfile.identityName}`,
        summary: `Archetype profile with overall confidence of ${Math.round(dnaProfile.overallConfidence * 100)}%`,
        tags: ['style_dna', 'archetype', dnaProfile.identityName.toLowerCase()],
        confidence: dnaProfile.overallConfidence,
        createdAt: dnaProfile.createdAt || new Date().toISOString(),
        updatedAt: dnaProfile.updatedAt || new Date().toISOString()
      });
    }

    // 3. Ingest Digital Twin Node
    const twin = digitalTwinEngine.getProfile();
    if (twin) {
      const twinNodeId = `node_twin_${twin.twinId}`;
      nodes.push({
        nodeId: twinNodeId,
        domain: 'digital_twin',
        sourceId: twin.twinId,
        title: twin.identitySummary.archetypeTitle,
        summary: twin.identitySummary.description,
        tags: ['digital_twin', 'avatar', twin.identitySummary.styleMaturityLevel.toLowerCase()],
        confidence: twin.identitySummary.styleMaturityScore,
        createdAt: twin.lastUpdated,
        updatedAt: twin.lastUpdated
      });

      // Edge: Digital Twin DERIVED_FROM Style DNA
      if (dnaProfile) {
        edges.push({
          edgeId: `edge_twin_dna_${twin.twinId}`,
          sourceNodeId: twinNodeId,
          targetNodeId: `node_dna_${userId}`,
          relationship: 'DERIVED_FROM',
          weight: 0.95,
          evidence: 'Digital Twin avatar is anchored on primary Style DNA archetype',
          createdAt: new Date().toISOString()
        });
      }
    }

    // 4. Ingest Simulation Engine Reports
    const simReports = simulationEngine.getHistory(userId);
    simReports.forEach((sim) => {
      const simNodeId = `node_sim_${sim.simulationId}`;
      nodes.push({
        nodeId: simNodeId,
        domain: 'simulation',
        sourceId: sim.simulationId,
        title: sim.scenario.title,
        summary: sim.expectedStyleImpact,
        tags: ['simulation', sim.scenario.type],
        confidence: sim.confidence,
        createdAt: sim.timestamp,
        updatedAt: sim.timestamp
      });

      // Edge: Simulation VALIDATES Digital Twin
      if (twin) {
        edges.push({
          edgeId: `edge_sim_twin_${sim.simulationId}`,
          sourceNodeId: simNodeId,
          targetNodeId: `node_twin_${twin.twinId}`,
          relationship: 'VALIDATES',
          weight: sim.versatilityScore,
          evidence: `Versatility score of ${Math.round(sim.versatilityScore * 100)}% validates Digital Twin profile`,
          createdAt: new Date().toISOString()
        });
      }
    });

    // 5. Ingest Creative Concepts
    const creativeConcepts = await creativeEngine.getHistory();
    creativeConcepts.forEach((c) => {
      const cNodeId = `node_creative_${c.creativeId}`;
      nodes.push({
        nodeId: cNodeId,
        domain: 'creative',
        sourceId: c.creativeId,
        title: c.title,
        summary: c.description || c.title,
        tags: ['creative', c.category],
        confidence: c.confidence || 0.9,
        createdAt: c.createdAt || new Date().toISOString(),
        updatedAt: c.createdAt || new Date().toISOString()
      });
    });

    // 6. Ingest Visual Analysis History
    const visionHistory = await visualIntelligenceEngine.getHistory();
    visionHistory.forEach((v) => {
      const vNodeId = `node_vision_${v.analysisId}`;
      const garmentCount = v.garments?.length || 0;
      const primaryCategory = garmentCount > 0 ? v.garments[0].category : 'Fashion Snapshot';
      const conf = v.overallConfidence || 0.9;

      nodes.push({
        nodeId: vNodeId,
        domain: 'visual',
        sourceId: v.analysisId,
        title: `Visual Scan: ${primaryCategory}`,
        summary: `Detected ${garmentCount} garments with confidence of ${Math.round(conf * 100)}%`,
        tags: ['visual_scan', primaryCategory.toLowerCase()],
        confidence: conf,
        createdAt: v.createdAt || new Date().toISOString(),
        updatedAt: v.createdAt || new Date().toISOString()
      });
    });

    return {
      nodes,
      edges,
      lastUpdated: new Date().toISOString()
    };
  }
}
