/**
 * ARIA v2.5 Civilization Memory Dashboard
 * Product: LOOK VISION v2.4
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Database, RefreshCw, Network, Shield, Sparkles } from 'lucide-react';
import { useARIA } from '../../aria/core/ARIAContext';
import { DomainHealthCard } from './DomainHealthCard';
import { KnowledgeGraphPanel } from './KnowledgeGraphPanel';
import { MemorySearchPanel } from './MemorySearchPanel';
import { RelationshipInspector } from './RelationshipInspector';
import { MemoryTimelineExplorer } from './MemoryTimelineExplorer';
import {
  MemoryNodeRef,
  MemoryDomainType,
  SearchResultItem
} from '../../aria/civilization/CivilizationMemoryTypes';

export const CivilizationMemoryDashboard: React.FC = () => {
  const {
    civilizationMemory,
    knowledgeGraph,
    searchCivilization,
    refreshCivilization
  } = useARIA();

  const [selectedNode, setSelectedNode] = useState<MemoryNodeRef | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (knowledgeGraph && knowledgeGraph.nodes.length > 0 && !selectedNode) {
      setSelectedNode(knowledgeGraph.nodes[0]);
    }
  }, [knowledgeGraph]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshCivilization();
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSearch = (query: string, domain?: MemoryDomainType) => {
    const results = searchCivilization({ query, domain });
    setSearchResults(results);
  };

  const domainList: MemoryDomainType[] = [
    'personal',
    'fashion',
    'creative',
    'decision',
    'simulation',
    'visual',
    'digital_twin',
    'community_metadata'
  ];

  const getDomainNodeCount = (d: MemoryDomainType) => {
    if (!knowledgeGraph) return 0;
    return knowledgeGraph.nodes.filter((n) => n.domain === d).length;
  };

  const connectedEdges = selectedNode && knowledgeGraph
    ? knowledgeGraph.edges.filter(
        (e) => e.sourceNodeId === selectedNode.nodeId || e.targetNodeId === selectedNode.nodeId
      )
    : [];

  return (
    <div className="min-h-screen bg-[#05050a] text-zinc-100 p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-violet-500/10 rounded-xl text-violet-400">
              <Database className="w-6 h-6" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-white">
              ARIA AI Civilization Memory Platform
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Unified long-term intelligence memory layer. Organizes cross-domain knowledge graphs, temporal evolution, and semantic indexing while maintaining strict domain isolation and privacy.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 px-4 py-2 rounded-xl text-xs font-medium transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Re-Index Memory</span>
          </button>
        </div>
      </div>

      {/* Domain Health Grid */}
      <div>
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center">
          <Shield className="w-3.5 h-3.5 mr-1.5 text-violet-400" /> Memory Domain Status
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {domainList.map((domain) => (
            <DomainHealthCard
              key={domain}
              domain={domain}
              nodeCount={getDomainNodeCount(domain)}
              lastUpdated={knowledgeGraph?.lastUpdated}
            />
          ))}
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Knowledge Graph Panel */}
        <div className="lg:col-span-2 space-y-6">
          <KnowledgeGraphPanel
            graph={knowledgeGraph}
            onSelectNode={(node) => setSelectedNode(node)}
          />

          <MemorySearchPanel onSearch={handleSearch} results={searchResults} />
        </div>

        {/* Right Column: Relationship Inspector & Timeline */}
        <div className="space-y-6">
          <RelationshipInspector
            selectedNode={selectedNode}
            connectedEdges={connectedEdges}
          />

          <MemoryTimelineExplorer snapshots={civilizationMemory?.getSnapshots('guest_user') || []} />
        </div>
      </div>
    </div>
  );
};
