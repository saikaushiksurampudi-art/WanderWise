import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ActivityItem, InterestCategory, TripPlan } from '../types';
import { X, RefreshCw, Sparkles } from 'lucide-react';

interface ReplaceActivityModalProps {
  activity: ActivityItem | null;
  trip: TripPlan;
  onClose: () => void;
  onConfirmReplace: (activityId: string, preferredCategory: InterestCategory) => void;
  isLoading: boolean;
  errorMessage?: string | null;
}

const CATEGORIES: InterestCategory[] = [
  'Food & Dining',
  'Museums & Culture',
  'Nature & Outdoors',
  'Nightlife & Bars',
  'Shopping & Fashion',
  'Adventure & Thrills',
  'Relaxation & Wellness',
  'Photography & Views',
  'History & Heritage'
];

export const ReplaceActivityModal: React.FC<ReplaceActivityModalProps> = ({
  activity,
  onClose,
  onConfirmReplace,
  isLoading,
  errorMessage
}) => {
  const [selectedCategory, setSelectedCategory] = useState<InterestCategory>(
    activity?.category ?? 'Food & Dining'
  );

  if (!activity) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg bg-white border border-slate-200 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden"
      >

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 font-display">Customize & Swap Activity</h3>
            <p className="text-xs text-slate-500">Select a new interest or let AI find a matching alternative.</p>
          </div>
        </div>

        {/* Current Activity Overview */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-5">
          <span className="text-[10px] uppercase font-extrabold text-indigo-600 block mb-1">
            Current Activity ({activity.timeSlot})
          </span>
          <h4 className="text-sm font-bold text-slate-900">{activity.title}</h4>
          <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{activity.description}</p>
          <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-slate-200 text-xs">
            <span className="text-slate-500">Current Cost:</span>
            <span className="font-bold text-emerald-600 font-mono">${activity.totalCost} total</span>
          </div>
        </div>

        {/* Category Selector */}
        <div className="space-y-2 mb-6">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Choose Replacement Category:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`p-2.5 rounded-2xl text-xs font-bold text-left transition border ${
                  selectedCategory === cat
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {errorMessage && (
          <p role="alert" className="mb-3 text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
            {errorMessage}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
          >
            Cancel
          </button>

          <motion.button
            type="button"
            disabled={isLoading}
            onClick={() => onConfirmReplace(activity.id, selectedCategory)}
            whileHover={isLoading ? undefined : { scale: 1.02 }}
            whileTap={isLoading ? undefined : { scale: 0.98 }}
            className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-300" />
                <span>Replace Activity</span>
              </>
            )}
          </motion.button>
        </div>

      </motion.div>
    </motion.div>
  );
};
