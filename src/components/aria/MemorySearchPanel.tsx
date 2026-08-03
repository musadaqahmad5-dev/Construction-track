/**
 * ARIA v2.5 Memory Search Panel
 * Product: LOOK VISION v2.4
 */

import React, { useState } from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';
import {
  MemoryDomainType,
  SearchResultItem
} from '../../aria/civilization/CivilizationMemoryTypes';

interface MemorySearchPanelProps {
  onSearch: (query: string, domain?: MemoryDomainType) => void;
  results: SearchResultItem[];
}

export const MemorySearchPanel: React.FC<MemorySearchPanelProps> = ({ onSearch, results }) => {
  const [query, setQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<MemoryDomainType | undefined>(undefined);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, selectedDomain);
  };

  const domains: { label: string; value: MemoryDomainType | undefined }[] = [
    { label: 'All Domains', value: undefined },
    { label: 'Personal', value: 'personal' },
    { label: 'Fashion', value: 'fashion' },
    { label: 'Creative', value: 'creative' },
    { label: 'Decision', value: 'decision' },
    { label: 'Simulation', value: 'simulation' },
    { label: 'Visual', value: 'visual' },
    { label: 'Digital Twin', value: 'digital_twin' },
    { label: 'Community', value: 'community_metadata' }
  ];

  return (
    <div className="bg-[#07070c] border border-white/5 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <div className="flex items-center space-x-2">
          <Search className="w-5 h-5 text-violet-400" />
          <h3 className="text-sm font-semibold text-zinc-100">Unified Memory Retrieval</h3>
        </div>
        <span className="text-xs text-zinc-400">{results.length} Matches</span>
      </div>

      <form onSubmit={handleSearchSubmit} className="space-y-3">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cross-domain intelligence..."
              className="w-full bg-[#05050a] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
            />
          </div>
          <button
            type="submit"
            className="bg-violet-600 hover:bg-violet-500 text-white text-xs px-4 py-2 rounded-xl transition-all font-medium flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-zinc-500 mr-1 flex-shrink-0" />
          {domains.map((d) => (
            <button
              key={d.label}
              type="button"
              onClick={() => {
                setSelectedDomain(d.value);
                onSearch(query, d.value);
              }}
              className={`px-2.5 py-1 rounded-lg border text-xs whitespace-nowrap transition-all ${
                selectedDomain === d.value
                  ? 'bg-violet-500/20 border-violet-500/40 text-violet-300 font-medium'
                  : 'bg-[#05050a] border-white/5 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </form>

      {results.length > 0 && (
        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-1">
          {results.map((res, idx) => (
            <div
              key={idx}
              className="bg-[#05050a] border border-white/5 rounded-xl p-3 hover:border-violet-500/20 transition-all"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-zinc-200">{res.node.title}</span>
                <span className="text-violet-400 font-mono text-[11px]">
                  Score: {Math.round(res.relevanceScore * 100)}%
                </span>
              </div>
              <p className="text-xs text-zinc-400 line-clamp-2">{res.node.summary}</p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
                <span className="uppercase text-[10px] bg-zinc-800 px-2 py-0.5 rounded">
                  {res.node.domain}
                </span>
                <span>{res.connectedEdges.length} connected relationships</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
