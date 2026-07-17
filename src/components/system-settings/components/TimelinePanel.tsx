import React from 'react';

interface TimelineEvent {
  id: string | number;
  time: string;
  type?: string;
  message: string;
  severity?: 'Info' | 'Warning' | 'Error' | string;
}

interface TimelinePanelProps {
  title: string;
  events: TimelineEvent[];
  maxHeight?: string;
}

export const TimelinePanel: React.FC<TimelinePanelProps> = ({
  title,
  events,
  maxHeight = 'max-h-72'
}) => {
  return (
    <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
      <div className="pb-2 border-b border-white/5 flex justify-between items-center">
        <h4 className="text-xs font-bold text-white tracking-tight">{title}</h4>
        <span className="text-[8px] font-mono text-zinc-500 uppercase">Live Trace Log</span>
      </div>

      <div className={`${maxHeight} overflow-y-auto custom-scrollbar space-y-3 pr-1`}>
        {events.length === 0 ? (
          <div className="text-center py-6 text-zinc-500 text-xs font-mono">
            No logged telemetry in this segment buffer.
          </div>
        ) : (
          events.map((evt, idx) => {
            let colorDot = 'bg-indigo-400';
            if (evt.severity === 'Warning') colorDot = 'bg-amber-400';
            if (evt.severity === 'Error') colorDot = 'bg-rose-400';

            return (
              <div key={evt.id || idx} className="p-3 bg-black/20 rounded-xl border border-white/5 flex gap-3 items-start">
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${colorDot}`} />
                <div className="space-y-1 w-full">
                  <div className="flex justify-between items-center text-[8.5px] font-mono text-zinc-500">
                    <span>{evt.type || 'EVENT'}</span>
                    <span>{evt.time}</span>
                  </div>
                  <p className="text-[10.5px] text-zinc-300 font-mono leading-relaxed break-words">{evt.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
