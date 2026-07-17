import React from 'react';
import { motion } from 'motion/react';
import { LOOK_VISION_THEMES } from '../../AIStyleHub';

interface SettingsTabProps {
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
  weatherWeight: 'lighter' | 'heavier' | 'layered';
  saveWeatherWeight: (weight: 'lighter' | 'heavier' | 'layered') => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  currentTheme,
  setCurrentTheme,
  weatherWeight,
  saveWeatherWeight
}) => {
  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left"
    >
      {/* THEME SELECTOR CARD */}
      <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
        <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest block font-light">
          Select Look Vision Active Theme
        </span>

        <div className="space-y-3">
          {LOOK_VISION_THEMES.map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => {
                  setCurrentTheme(theme.id);
                  localStorage.setItem('look_vision_theme', theme.id);
                }}
                className={`w-full p-4 rounded-xl border text-left transition-all flex justify-between items-center cursor-pointer ${
                  isSelected 
                    ? 'bg-white/5 border-white shadow-md' 
                    : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                }`}
              >
                <div>
                  <strong className="block text-xs font-serif text-white font-medium">{theme.name}</strong>
                  <span className="text-[9px] font-mono text-white/30 uppercase mt-0.5 block leading-none">
                    {theme.id.replace('-', ' ')}
                  </span>
                </div>
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* WEATHER WEIGHT CARD */}
      <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
        <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest block font-light">
          Weather Weight Tuning
        </span>

        <p className="text-[11px] font-serif text-white/50 italic leading-normal pb-2 border-b border-white/5">
          "Tune weather-awareness sensors to bias compilation towards lightweight airiness, cozy weights, or layered balances."
        </p>

        <div className="space-y-3 pt-2">
          {[
            { id: 'lighter', label: 'Lighter Layers', desc: 'Bias toward linen, tees, short silhouettes' },
            { id: 'heavier', label: 'Heavier Cozy Layers', desc: 'Bias toward sweaters, thick wool, coats' },
            { id: 'layered', label: 'Layered Balance', desc: 'Tops layered with blazers and active items' }
          ].map((wt) => {
            const isSelected = weatherWeight === wt.id;
            return (
              <button
                key={wt.id}
                onClick={() => saveWeatherWeight(wt.id as any)}
                className={`w-full p-4 rounded-xl border text-left transition-all flex justify-between items-center cursor-pointer ${
                  isSelected 
                    ? 'bg-white/5 border-white' 
                    : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                }`}
              >
                <div>
                  <strong className="block text-xs font-mono text-white uppercase tracking-wider font-semibold">{wt.label}</strong>
                  <span className="text-[9px] font-mono text-white/30 block mt-0.5 leading-none">{wt.desc}</span>
                </div>
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
