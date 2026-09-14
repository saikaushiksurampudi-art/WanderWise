import React from 'react';
import { motion } from 'motion/react';
import { CityTemplate } from '../types';
import { Compass, Calendar, Users, Sparkles, ArrowRight } from 'lucide-react';

interface ExploreCitiesProps {
  templates: CityTemplate[];
  onSelectTemplate: (template: CityTemplate) => void;
  isLoading: boolean;
  isBootstrapping?: boolean;
}

export const ExploreCities: React.FC<ExploreCitiesProps> = ({
  templates,
  onSelectTemplate,
  isLoading,
  isBootstrapping
}) => {
  return (
    <div className="space-y-8">

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold mb-3">
            <Compass className="w-3.5 h-3.5" /> Curated City Vacation Packages
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Explore Handcrafted Itineraries
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Pre-optimized travel templates tested by local guides. 1-click load into WanderWise to customize dates, adjust group size, or book instantly.
          </p>
        </div>
      </div>

      {/* Grid of Templates (Bento Cards) */}
      {isBootstrapping && templates.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-80 bg-white border border-slate-200 rounded-[2rem] animate-pulse" />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center text-sm text-slate-500">
          City templates could not be loaded. Refresh the page to try again.
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, idx) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(idx * 0.07, 0.35) }}
            className="group bg-white border border-slate-200 hover:border-slate-300 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Cover Image & Badges */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={template.coverImage}
                  alt={template.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {template.badges.map((badge, idx2) => (
                    <span
                      key={idx2}
                      className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-emerald-300 border border-emerald-500/30 shadow-xs"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wide">
                      {template.country}
                    </span>
                    <h3 className="text-lg font-extrabold leading-tight">
                      {template.destination}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-300 uppercase block">Starting from</span>
                    <span className="text-lg font-extrabold font-mono text-emerald-400">
                      ${template.baseBudget.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Body details */}
              <div className="p-5 space-y-4">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {template.tagline}
                </p>

                {/* Meta pills */}
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    {template.duration} Days
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-sky-600" />
                    {template.travelers} Travelers
                  </span>
                </div>

                {/* Highlights */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Featured Highlights:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {template.highlights.map((h, i) => (
                      <span key={i} className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-50 text-slate-700 border border-slate-200">
                        • {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Load Button CTA */}
            <div className="p-5 pt-0">
              <motion.button
                type="button"
                disabled={isLoading}
                onClick={() => onSelectTemplate(template)}
                whileHover={isLoading ? undefined : { scale: 1.02 }}
                whileTap={isLoading ? undefined : { scale: 0.98 }}
                className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all duration-200 shadow-sm flex items-center justify-center gap-2 group-hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Building itinerary...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-indigo-300" />
                    <span>Customize & Plan This Trip</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>

          </motion.div>
        ))}
      </div>
      )}

    </div>
  );
};
