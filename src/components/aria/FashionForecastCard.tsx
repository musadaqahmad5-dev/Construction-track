/**
 * ARIA v2.5 Fashion Forecast Card
 * Product: LOOK VISION v2.4
 */

import React from 'react';
import { motion } from 'motion/react';
import { Compass, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { FashionForecastSignal } from '../../aria/digitalTwin/DigitalTwinTypes';

interface FashionForecastCardProps {
  forecasts: FashionForecastSignal[];
}

export const FashionForecastCard: React.FC<FashionForecastCardProps> = ({ forecasts }) => {
  return (
    <div className="p-6 rounded-3xl bg-[#07070c] border border-white/10 space-y-6 shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <Compass className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-serif font-medium text-white">Future Style Forecast Engine</h3>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono font-semibold">
          ARIA v2.5 Forecast
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {forecasts.map((f, idx) => (
          <motion.div
            key={f.forecastId || idx}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#0a0a14] via-[#07070c] to-[#0d091a] border border-white/5 space-y-3 flex flex-col justify-between hover:border-amber-500/30 transition-all duration-300"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase border border-amber-500/30">
                  {f.dimension.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono">
                  <Clock className="w-3 h-3 text-indigo-400" />
                  <span>{f.horizonMonths} Month Horizon</span>
                </div>
              </div>

              <h4 className="text-sm font-serif font-semibold text-white">
                {f.title}
              </h4>

              <p className="text-xs text-zinc-300 font-light leading-relaxed">
                {f.forecastText}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="text-[10px] text-zinc-400 font-mono font-semibold">Reasoning Signals:</div>
              <ul className="space-y-1">
                {f.reasoningSignals.map((sig, sIdx) => (
                  <li key={sIdx} className="text-[11px] text-zinc-300 font-light flex items-center gap-1.5">
                    <ArrowRight className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                    <span>{sig}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
