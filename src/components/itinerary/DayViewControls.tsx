import { motion } from 'motion/react';
import { TripPlan } from '../../types';

export type DayFilter = number | 'all';
export type ViewMode = 'timeline' | 'map' | 'both';

interface DayViewControlsProps {
  trip: TripPlan;
  activeDay: DayFilter;
  viewMode: ViewMode;
  onDayChange: (day: DayFilter) => void;
  onViewModeChange: (mode: ViewMode) => void;
  convertPrice: (amount: number) => string;
}

export function DayViewControls({
  trip,
  activeDay,
  viewMode,
  onDayChange,
  onViewModeChange,
  convertPrice
}: DayViewControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
      <div className="flex items-center gap-2 overflow-x-auto py-1">
        <button
          type="button"
          onClick={() => onDayChange('all')}
          className={`relative px-4 py-2 rounded-2xl text-xs font-bold transition-colors ${
            activeDay === 'all' ? 'text-white' : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          {activeDay === 'all' && (
            <motion.span layoutId="day-pill" className="absolute inset-0 rounded-2xl bg-slate-900 shadow-sm" transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />
          )}
          <span className="relative z-10">All {trip.duration} Days</span>
        </button>
        {trip.days.map(d => (
          <button
            key={d.day}
            type="button"
            onClick={() => onDayChange(d.day)}
            className={`relative px-4 py-2 rounded-2xl text-xs font-bold transition-colors flex items-center gap-2 ${
              activeDay === d.day ? 'text-white' : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {activeDay === d.day && (
              <motion.span layoutId="day-pill" className="absolute inset-0 rounded-2xl bg-slate-900 shadow-sm" transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />
            )}
            <span className="relative z-10">Day {d.day}</span>
            <span className={`relative z-10 text-[10px] ${activeDay === d.day ? 'text-indigo-300' : 'text-slate-400'}`}>
              {convertPrice(d.dailyProjectedCost)}
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
        {(['both', 'timeline', 'map'] as ViewMode[]).map(mode => (
          <button
            key={mode}
            type="button"
            onClick={() => onViewModeChange(mode)}
            className={`relative px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              viewMode === mode ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {viewMode === mode && (
              <motion.span layoutId="view-mode-pill" className="absolute inset-0 rounded-xl bg-white shadow-xs" transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />
            )}
            <span className="relative z-10">
              {mode === 'both' ? 'Split View' : mode === 'timeline' ? 'Timeline Only' : 'Map Only'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
