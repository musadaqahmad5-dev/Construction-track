/**
 * ARIA v2.5 Color Palette Widget
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React from 'react';
import { Palette, Sparkles } from 'lucide-react';
import { ExtractedColorSwatch } from '../../aria/vision/VisionTypes';

interface ColorPaletteWidgetProps {
  palette: ExtractedColorSwatch[];
  className?: string;
}

export const ColorPaletteWidget: React.FC<ColorPaletteWidgetProps> = ({
  palette,
  className = ''
}) => {
  return (
    <div className={`space-y-2 text-left ${className}`}>
      <div className="flex items-center justify-between pb-1 border-b border-white/5">
        <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-indigo-400" />
          Extracted Color Palette ({palette.length} Swatches)
        </h5>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {palette.map((swatch, idx) => (
          <div
            key={idx}
            className="p-2 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5"
          >
            <div
              className="w-7 h-7 rounded-xl border border-white/20 shadow-inner shrink-0"
              style={{ backgroundColor: swatch.hex }}
            />
            <div className="overflow-hidden space-y-0.5">
              <span className="text-xs font-mono font-bold text-white block truncate">
                {swatch.colorName}
              </span>
              <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-400">
                <span>{swatch.percentage}%</span>
                {swatch.isDominant && (
                  <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1 rounded font-bold">
                    Dominant
                  </span>
                )}
                {swatch.isAccent && (
                  <span className="text-[9px] bg-pink-500/20 text-pink-300 px-1 rounded font-bold">
                    Accent
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
