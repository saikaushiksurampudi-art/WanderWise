import { motion } from 'motion/react';
import { Compass, CloudSun, Sparkles } from 'lucide-react';

const FEATURES = [
  { icon: <Compass className="w-3.5 h-3.5 text-indigo-600" />, label: 'Budget-Optimized Routing' },
  { icon: <CloudSun className="w-3.5 h-3.5 text-sky-600" />, label: 'Live Weather & FX Rates' },
  { icon: <Sparkles className="w-3.5 h-3.5 text-emerald-600" />, label: 'AI Concierge Included' }
];

export function PlannerHero() {
  return (
    <div className="relative text-center pt-4 pb-8 sm:pt-8 sm:pb-12 overflow-hidden">
      <motion.div
        className="absolute top-0 left-1/4 w-56 h-56 bg-indigo-200/50 rounded-full blur-3xl pointer-events-none"
        animate={{ y: [0, -18, 0], x: [0, 12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-6 right-1/4 w-56 h-56 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none"
        animate={{ y: [0, 16, 0], x: [0, -14, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-[11px] font-bold text-indigo-700 mb-5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>AI-Engineered Travel Planning</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight leading-[1.05]">
          <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 bg-clip-text text-transparent">
            Plan smarter.
          </span>
          <br />
          <span className="text-slate-900">Wander further.</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-500 mt-4 max-w-xl mx-auto leading-relaxed">
          Tell us your destination and budget — WanderWise builds a day-by-day itinerary that never breaks the bank, down to the dollar.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
          {FEATURES.map(f => (
            <span key={f.label} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-[11px] font-semibold text-slate-600">
              {f.icon}
              {f.label}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
