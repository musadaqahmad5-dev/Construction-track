/**
 * ARIA v2.5 Knowledge Graph Panel
 * Product: LOOK VISION v2.4
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Network, Link2, Share2, Eye, ShieldAlert } from 'lucide-react';
import { KnowledgeGraphData, MemoryNodeRef } from '../../aria/civilization/CivilizationMemoryTypes';

interface KnowledgeGraphPanelProps {
  graph: KnowledgeGraphData | null;
  onSelectNode?: (node: MemoryNodeRef) => void;
}

export const KnowledgeGraphPanel: React.FC<KnowledgeGraphPanelProps> = ({
  graph,
  onSelectNode
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  if (!graph || graph.nodes.length === 0) {
    return (
      <div className="bg-[#07070c] border border-white/5 rounded-2xl p-8 text-center text-zinc-400">
        <Network className="w-8 h-8 mx-auto text-zinc-600 mb-2 animate-pulse" />
        <p className="text-sm">No knowledge graph nodes available. Index civilization memory to populate.</p>
      </div>
    );
  }

  const handleNodeClick = (node: MemoryNodeRef) => {
    setSelectedNodeId(node.nodeId);
    if (onSelectNode) onSelectNode(node);
  };

  return (
    <div className="bg-[#07070c] border border-white/5 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <div className="flex items-center space-x-2">
          <Network className="w-5 h-5 text-violet-400" />
          <h3 className="text-sm font-semibold text-zinc-100">Civilization Knowledge Graph</h3>
        </div>
        <div className="flex items-center space-x-3 text-xs text-zinc-400">
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block mr-1.5" />
            {graph.nodes.length} Nodes
          </span>
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-violet-400 inline-block mr-1.5" />
            {graph.edges.length} Relationships
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
        {graph.nodes.map((node) => {
          const isSelected = selectedNodeId === node.nodeId;
          const connectedEdgeCount = graph.edges.filter(
            (e) => e.sourceNodeId === node.nodeId || e.targetNodeId === node.nodeId
          ).length;

          return (
            <motion.div
              key={node.nodeId}
              whileHover={{ scale: 1.01 }}
              onClick={() => handleNodeClick(node)}
              className={`cursor-pointer rounded-xl p-3.5 border transition-all ${
                isSelected
                  ? 'bg-violet-900/20 border-violet-500/50 text-white shadow-lg shadow-violet-500/10'
                  : 'bg-[#05050a] border-white/5 hover:border-violet-500/20 text-zinc-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-md border border-violet-500/20">
                  {node.domain}
                </span>
                <span className="text-[11px] text-zinc-500 flex items-center">
                  <Link2 className="w-3 h-3 mr-1" /> {connectedEdgeCount} links
                </span>
              </div>

              <h4 className="text-sm font-medium mt-2 text-zinc-100 line-clamp-1">{node.title}</h4>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">{node.summary}</p>

              <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500">
                <span className="flex items-center">
                  <Eye className="w-3 h-3 mr-1 text-zinc-400" /> Confidence: {Math.round(node.confidence * 100)}%
                </span>
                <span className="text-zinc-600">ID: {node.sourceId.substring(0, 8)}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {graph.edges.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/5">
          <h4 className="text-xs font-medium text-zinc-400 mb-2 flex items-center">
            <Share2 className="w-3.5 h-3.5 mr-1 text-violet-400" /> Active Graph Relationships
          </h4>
          <div className="space-y-1.5 max-h-36 overflow-y-auto text-xs">
            {graph.edges.map((edge) => (
              <div
                key={edge.edgeId}
                className="bg-[#05050a] border border-white/5 rounded-lg p-2 flex items-center justify-between text-zinc-300"
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className="text-violet-400 font-mono text-[11px]">{edge.sourceNodeId}</span>
                  <span className="text-zinc-500 text-[10px] uppercase font-bold px-1.5 py-0.5 bg-zinc-800 rounded">
                    {edge.relationship}
                  </span>
                  <span className="text-indigo-400 font-mono text-[11px]">{edge.targetNodeId}</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">Weight: {edge.weight}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
