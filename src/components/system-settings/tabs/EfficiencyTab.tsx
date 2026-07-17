import React from 'react';
import { motion } from 'motion/react';

interface EfficiencyTabProps {
  pipelineReport: any;
  resetPipelineStats: () => void;
}

export const EfficiencyTab: React.FC<EfficiencyTabProps> = ({
  pipelineReport,
  resetPipelineStats
}) => {
  return (
    <motion.div
      key="efficiency"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 text-left"
    >
      {/* KPI ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl">
          <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block font-light">
            Total Requests
          </span>
          <span className="text-2xl font-mono font-medium text-white block mt-1">
            {pipelineReport?.overallSummary?.totalRequestsHandled ?? 0}
          </span>
          <span className="text-[10px] text-white/30 block mt-0.5 font-sans">
            Processed locally/API
          </span>
        </div>

        <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl">
          <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block font-light">
            Cache Hit Rate
          </span>
          <span className="text-2xl font-mono font-medium text-emerald-400 block mt-1">
            {pipelineReport?.cacheArchitecture?.effectivenessPercent ?? 100}%
          </span>
          <span className="text-[10px] text-white/30 block mt-0.5 font-sans">
            {pipelineReport?.overallSummary?.cacheHits ?? 0} direct lookup hits
          </span>
        </div>

        <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl">
          <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block font-light">
            Est. Cost Reduction
          </span>
          <span className="text-2xl font-mono font-medium text-violet-400 block mt-1">
            {pipelineReport?.overallSummary?.estimatedCostReductionPercent ?? 0}%
          </span>
          <span className="text-[10px] text-white/30 block mt-0.5 font-sans">
            ${pipelineReport?.overallSummary?.totalUsdSaved?.toFixed(4) ?? '0.0000'} saved
          </span>
        </div>

        <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl">
          <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block font-light">
            Avg Latency Reduction
          </span>
          <span className="text-2xl font-mono font-medium text-cyan-400 block mt-1">
            {pipelineReport?.overallSummary?.expectedPerformanceImprovementPercent ?? 0}%
          </span>
          <span className="text-[10px] text-white/30 block mt-0.5 font-sans">
            {pipelineReport?.overallSummary?.averageLatencyMs ?? 0}ms avg response
          </span>
        </div>
      </div>

      {/* CACHE DETAILS & SIMILARITY DE-DUPLICATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ADVANCED CACHE INVENTORY */}
        <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block font-light">
              Level 3 Cache Registry
            </span>
            <span className="text-[9px] font-mono text-white/30">
              {pipelineReport?.cacheArchitecture?.cacheStatus?.entriesCount ?? 0} entries ({pipelineReport?.cacheArchitecture?.cacheStatus?.percentageFull ?? 0}% full)
            </span>
          </div>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {pipelineReport?.cacheArchitecture?.entries && pipelineReport.cacheArchitecture.entries.length > 0 ? (
              pipelineReport.cacheArchitecture.entries.map((entry: any, idx: number) => (
                <div key={idx} className="flex justify-between items-start bg-white/[0.01] border border-white/5 p-2 rounded-lg text-[10px] font-mono">
                  <div className="space-y-0.5">
                    <span className="text-white/80 block font-medium max-w-[200px] truncate">{entry.key}</span>
                    <span className="text-white/30 uppercase text-[8px] block">{entry.type}</span>
                  </div>
                  <div className="text-right space-y-0.5">
                    <span className="text-emerald-400 block font-semibold">{entry.hits} hits</span>
                    <span className="text-white/30 text-[8px] block">{entry.sizeBytes} bytes</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-white/30 font-serif italic">
                "Level 3 cache is currently clean. Request some recommendations to hydrate the storage layers."
              </div>
            )}
          </div>
        </div>

        {/* COALESCING & SIMILARITY REGISTRY */}
        <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block font-light">
              Level 8 & 9 Duplication Log
            </span>
            <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-semibold">
              ACTIVE CONTROL
            </span>
          </div>

          <div className="space-y-4 text-xs font-serif text-white/60 leading-relaxed">
            <p>
              Our <strong>Intelligent Request Pipeline</strong> intercepts duplicate styling calls using in-flight promise coalescing and smart prompt reuse.
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-left border-t border-white/5 pt-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-white/30 uppercase block font-light">
                  Simultaneous Blocked
                </span>
                <span className="text-lg font-mono text-white">
                  {pipelineReport?.duplicateRequestReport?.coalescedPreventionCount ?? 0}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-mono text-white/30 uppercase block font-light">
                  Prompt Commits
                </span>
                <span className="text-lg font-mono text-white">
                  {pipelineReport?.duplicateRequestReport?.promptSimilarityRegistrySize ?? 0}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={resetPipelineStats}
                className="w-full border border-white/10 hover:border-white/20 bg-white/5 text-white py-2.5 rounded-xl font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer"
              >
                [ Flush Stats & Reset Cache ]
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
