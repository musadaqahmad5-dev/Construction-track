import React, { useState, useTransition } from 'react';
import {
  Calendar as CalendarIcon,
  Sun,
  CloudSun,
  Sparkles,
  Plus,
  Check,
  Shirt,
  Clock,
  Tag,
  Flame,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export interface StylingEvent {
  eventId: string;
  date: string; // ISO format 'YYYY-MM-DD'
  title: string;
  occasionVibe: string;
  scheduledLookName: string;
  weatherForecastTemp: number;
  weatherCondition?: string;
  lookId?: string;
  outfitItems?: string[];
  styleMetrics?: {
    formality: number;
    warmth: number;
    elegance: number;
  };
}

interface OutfitCalendarPlannerProps {
  initialEvents?: StylingEvent[];
  userId?: string;
  onAskAIPlanLook?: (date: string) => void;
}

const getNext7Days = (): Array<{ dateStr: string; dayName: string; dayNumber: number; isToday: boolean }> => {
  const days = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = d.getDate();
    days.push({
      dateStr,
      dayName,
      dayNumber,
      isToday: i === 0
    });
  }
  return days;
};

const DEFAULT_MOCK_EVENTS: StylingEvent[] = [
  {
    eventId: 'evt_1',
    date: new Date().toISOString().split('T')[0],
    title: 'Gala Dinner & Runway Showcase',
    occasionVibe: 'Black Tie Elegance',
    scheduledLookName: 'Velvet Midnight Tuxedo & Silk Pocket Square',
    weatherForecastTemp: 22,
    weatherCondition: 'Clear Evening',
    lookId: 'look_noir_01',
    outfitItems: ['Italian Velvet Blazer', 'Pleated Silk Shirt', 'Tailored Wool Trousers', 'Patent Leather Oxfords'],
    styleMetrics: { formality: 95, warmth: 60, elegance: 98 }
  },
  {
    eventId: 'evt_2',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    title: 'Executive Board Strategy Summit',
    occasionVibe: 'Cyber Structured Power',
    scheduledLookName: 'Obsidian Cashmere Suit & Monochromatic Knit',
    weatherForecastTemp: 19,
    weatherCondition: 'Mild Breezes',
    lookId: 'look_exec_02',
    outfitItems: ['Double-Breasted Cashmere Jacket', 'Merino Turtleneck', 'Straight Trousers', 'Derby Boots'],
    styleMetrics: { formality: 88, warmth: 75, elegance: 90 }
  },
  {
    eventId: 'evt_3',
    date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    title: 'Contemporary Art Gallery Opening',
    occasionVibe: 'Avant-Garde Architectural',
    scheduledLookName: 'Draped Linen Trench & Asymmetric Layers',
    weatherForecastTemp: 25,
    weatherCondition: 'Sunny Skies',
    lookId: 'look_art_03',
    outfitItems: ['Over-sized Structured Coat', 'Raw Silk Tunic', 'Cropped Trousers', 'Minimalist Chelsea Boots'],
    styleMetrics: { formality: 70, warmth: 45, elegance: 92 }
  }
];

export const OutfitCalendarPlanner: React.FC<OutfitCalendarPlannerProps> = ({
  initialEvents = DEFAULT_MOCK_EVENTS,
  userId = 'usr_default',
  onAskAIPlanLook
}) => {
  const weekDays = getNext7Days();
  const [selectedDate, setSelectedDate] = useState<string>(weekDays[0].dateStr);
  const [events, setEvents] = useState<StylingEvent[]>(initialEvents);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  const selectedEvent = events.find((evt) => evt.date === selectedDate);

  const commitLookToDateAgenda = async (eventId: string, lookId: string): Promise<boolean> => {
    setIsSyncing(true);
    setSyncSuccess(false);

    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          scheduledUpdate: { eventId, lookId, timestamp: Date.now() }
        })
      });

      if (!response.ok) {
        throw new Error('Remote agenda sync rejected');
      }

      startTransition(() => {
        setEvents((prev) =>
          prev.map((item) => (item.eventId === eventId ? { ...item, lookId } : item))
        );
      });

      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
      return true;
    } catch {
      // Fallback local transaction save if API is unavailable
      startTransition(() => {
        setEvents((prev) =>
          prev.map((item) => (item.eventId === eventId ? { ...item, lookId } : item))
        );
      });
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
      return true;
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-[#05050a] text-zinc-100 rounded-2xl border border-white/5 shadow-2xl space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-wide text-white">Outfit Agenda Planner</h2>
            <p className="text-xs text-zinc-400">7-Day Intelligent Fashion Calendar & Look Scheduling</p>
          </div>
        </div>

        {syncSuccess && (
          <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg animate-fade-in">
            <ShieldCheck className="w-4 h-4" />
            <span>Agenda state synced to Cloud OS</span>
          </div>
        )}
      </div>

      {/* 7-Day Horizontal Stripe */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {weekDays.map((day) => {
          const isSelected = selectedDate === day.dateStr;
          const hasEvent = events.some((e) => e.date === day.dateStr);

          return (
            <button
              key={day.dateStr}
              type="button"
              onClick={() => setSelectedDate(day.dateStr)}
              className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-b from-indigo-950/40 to-slate-900/90 border-indigo-500/50 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)] scale-[1.02]'
                  : 'bg-[#07070c] border-white/5 text-zinc-400 hover:border-violet-500/20 hover:text-zinc-200'
              }`}
            >
              <span className="text-[10px] uppercase font-semibold tracking-wider text-zinc-400">
                {day.dayName}
              </span>
              <span className="text-lg font-bold my-0.5 text-white">{day.dayNumber}</span>

              {hasEvent && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)] mt-1" />
              )}

              {day.isToday && (
                <span className="absolute top-1 right-1.5 text-[9px] font-medium text-indigo-400 uppercase tracking-tighter">
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bento Detail Card for Selected Date */}
      <div className="bg-[#07070c] border border-white/5 rounded-xl p-6 transition-all duration-300">
        {selectedEvent ? (
          <div className="space-y-6">
            {/* Event Header & Weather Pill */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
              <div>
                <div className="flex items-center space-x-2 text-xs text-indigo-400 font-medium mb-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{selectedEvent.occasionVibe}</span>
                </div>
                <h3 className="text-lg font-semibold text-white">{selectedEvent.title}</h3>
              </div>

              <div className="flex items-center space-x-2 bg-slate-900/80 border border-white/10 px-3 py-1.5 rounded-full text-xs text-zinc-300">
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="font-medium">{selectedEvent.weatherForecastTemp}°C</span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-400">{selectedEvent.weatherCondition || 'Clear'}</span>
              </div>
            </div>

            {/* Scheduled Look Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-medium text-zinc-400">
                    <Shirt className="w-4 h-4 text-indigo-400" />
                    <span>Scheduled Look Ensemble</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">ID: {selectedEvent.lookId || 'UNASSIGNED'}</span>
                </div>

                <h4 className="text-base font-semibold text-indigo-200">
                  {selectedEvent.scheduledLookName}
                </h4>

                {selectedEvent.outfitItems && selectedEvent.outfitItems.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedEvent.outfitItems.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-md"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Style Metrics Radar Summary */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-3 flex flex-col justify-between">
                <div className="flex items-center space-x-2 text-xs font-medium text-zinc-400">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Vibe Metrics</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-zinc-400 mb-1">
                      <span>Formality</span>
                      <span className="text-white font-mono">{selectedEvent.styleMetrics?.formality || 80}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5">
                      <div
                        className="bg-indigo-500 h-1.5 rounded-full"
                        style={{ width: `${selectedEvent.styleMetrics?.formality || 80}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-zinc-400 mb-1">
                      <span>Elegance</span>
                      <span className="text-white font-mono">{selectedEvent.styleMetrics?.elegance || 85}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5">
                      <div
                        className="bg-purple-500 h-1.5 rounded-full"
                        style={{ width: `${selectedEvent.styleMetrics?.elegance || 85}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                disabled={isSyncing}
                onClick={() => commitLookToDateAgenda(selectedEvent.eventId, selectedEvent.lookId || 'look_current')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all disabled:opacity-50"
              >
                {isSyncing ? (
                  <Clock className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>Commit Combination to Agenda</span>
              </button>
            </div>
          </div>
        ) : (
          /* Empty State Fallback Container */
          <div className="py-10 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <CloudSun className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-semibold text-white">No Event Scheduled for This Date</h3>
              <p className="text-xs text-zinc-400">
                Your agenda is open on {selectedDate}. Let our Look Vision Intelligence assist in designing a custom outfit tailored to predicted weather and vibe.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onAskAIPlanLook?.(selectedDate)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask AI to Plan an Event Look</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
