/**
 * ARIA v2.5 Relationship Inspector Component
 * Product: LOOK VISION v2.4
 */

import React from 'react';
import { motion } from 'motion/react';
import { Link2, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { MemoryNodeRef, KnowledgeEdge } from '../../aria/civilization/CivilizationMemoryTypes';

interface RelationshipInspectorProps {
  selectedNode: MemoryNodeRef | null;
  connectedEdges: KnowledgeEdge[];
}

export const RelationshipInspector: React.FC<RelationshipInspectorProps> = ({
  selectedNode,
  connectedEdges
}) => {
  if (!selectedNode) {
    return (
      <div className="bg-[#07070c] border border-white/5 rounded-2xl p-6 text-center text-zinc-400">
        <Link2 className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
        <p className="text-sm">Select a knowledge node to inspect cross-domain relationships.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#07070c] border border-white/5 rounded-2xl p-5 shadow-xl"
    >
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-violet-400" />
          <h3 className="text-sm font-semibold text-zinc-100">Relationship Inspector</h3>
        </div>
        <span className="text-xs uppercase font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
          {selectedNode.domain}
        </span>
      </div>

      <div className="bg-[#05050a] border border-white/5 rounded-xl p-4 mb-4">
        <h4 className="text-sm font-semibold text-white">{selectedNode.title}</h4>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{selectedNode.summary}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {selectedNode.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md border border-white/5"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <h4 className="text-xs font-medium text-zinc-400 mb-2 flex items-center">
        <Link2 className="w-3.5 h-3.5 mr-1 text-violet-400" /> Connected Edges ({connectedEdges.length})
      </h4>

      {connectedEdges.length === 0 ? (
        <p className="text-xs text-zinc-500 italic">No direct edges linked to this node.</p>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {connectedEdges.map((edge) => (
            <div
              key={edge.edgeId}
              className="bg-[#05050a] border border-white/5 rounded-xl p-3 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-violet-400">{edge.sourceNodeId}</span>
                <span className="flex items-center text-zinc-400">
                  <ArrowRight className="w-3 h-3 mx-1 text-indigo-400" /> {edge.relationship}
                </span>
                <span className="text-indigo-400">{edge.targetNodeId}</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-tight">{edge.evidence}</p>
              <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-white/5">
                <span>Weight: {edge.weight}</span>
                <span className="flex items-center text-emerald-400">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Governance Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
