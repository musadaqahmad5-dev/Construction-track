/**
 * ARIA v2.5 Scenario Builder Panel
 * Product: LOOK VISION v2.4
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Sliders, Layers, DollarSign, Calendar, Sparkles, Shirt } from 'lucide-react';
import { SimulationScenarioType } from '../../aria/simulation/SimulationTypes';

interface ScenarioBuilderPanelProps {
  onRunSimulation: (
    type: SimulationScenarioType,
    params: Record<string, any>,
    title?: string,
    desc?: string
  ) => Promise<void>;
  isSimulating: boolean;
}

export const ScenarioBuilderPanel: React.FC<ScenarioBuilderPanelProps> = ({
  onRunSimulation,
  isSimulating
}) => {
  const [selectedType, setSelectedType] = useState<SimulationScenarioType>('capsule_conversion');
  const [itemCategory, setItemCategory] = useState<string>('Structured Overcoat');
  const [targetSeason, setTargetSeason] = useState<string>('Autumn/Winter');
  const [budgetLimit, setBudgetLimit] = useState<number>(600);
  const [targetOccasion, setTargetOccasion] = useState<string>('Executive Keynote & Evening Reception');
  const [colorHex, setColorHex] = useState<string>('#334155');

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    const params: Record<string, any> = {
      itemCategory,
      targetSeason,
      budgetLimit,
      targetOccasion,
      colorHex
    };
    await onRunSimulation(selectedType, params);
  };

  const scenarioOptions: { type: SimulationScenarioType; label: string; icon: any }[] = [
    { type: 'capsule_conversion', label: 'Capsule Conversion', icon: Layers },
    { type: 'add_item', label: 'Add Item Impact', icon: Shirt },
    { type: 'budget_plan', label: 'Budget Shopping Plan', icon: DollarSign },
    { type: 'seasonal_transition', label: 'Seasonal Transition', icon: Calendar },
    { type: 'occasion_planning', label: 'Occasion Planning', icon: Sparkles },
    { type: 'palette_change', label: 'Color Palette Shift', icon: Sliders }
  ];

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-[#07070c] via-[#0b0c16] to-[#05050a] border border-white/10 shadow-2xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-serif font-medium text-white">Fashion Scenario Builder</h3>
        </div>
        <span className="text-xs text-zinc-400 font-mono">Simulate Future Outcomes</span>
      </div>

      <form onSubmit={handleRun} className="space-y-6">
        {/* Scenario Type Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {scenarioOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedType === opt.type;
            return (
              <button
                key={opt.type}
                type="button"
                onClick={() => setSelectedType(opt.type)}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-indigo-950/80 to-purple-950/60 border-indigo-500/50 text-white shadow-lg'
                    : 'bg-[#080911] border-white/5 text-zinc-400 hover:border-white/20'
                }`}
              >
                <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-amber-400' : 'text-zinc-500'}`} />
                <span className="text-xs font-serif font-medium leading-tight">{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Parameter Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#080911] border border-white/5">
          {selectedType === 'add_item' && (
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-mono">Item Category / Name</label>
              <input
                type="text"
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {selectedType === 'budget_plan' && (
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-mono">Budget Limit ($ USD)</label>
              <input
                type="number"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {selectedType === 'seasonal_transition' && (
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-mono">Target Season</label>
              <input
                type="text"
                value={targetSeason}
                onChange={(e) => setTargetSeason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {selectedType === 'occasion_planning' && (
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-mono">Target Occasion</label>
              <input
                type="text"
                value={targetOccasion}
                onChange={(e) => setTargetOccasion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {selectedType === 'palette_change' && (
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-mono">Accent Color Hex</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="w-9 h-9 rounded-lg bg-transparent border border-white/10 cursor-pointer"
                />
                <input
                  type="text"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
            <label className="text-xs text-zinc-400 font-mono">Execution Context</label>
            <p className="text-xs text-zinc-300 font-light pt-1">
              Cross-references ARIA Memory, Style DNA, Decision History & Digital Twin.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSimulating}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white text-xs font-serif font-medium shadow-xl hover:shadow-amber-500/20 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Running Intelligence Simulation...' : 'Execute Fashion Simulation'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
