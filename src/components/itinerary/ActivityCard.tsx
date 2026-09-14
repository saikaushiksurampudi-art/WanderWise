import { motion } from 'motion/react';
import { Clock, Heart, MessageSquareQuote, RefreshCw } from 'lucide-react';
import { ActivityItem } from '../../types';

interface ActivityCardProps {
  activity: ActivityItem;
  isSaved: boolean;
  convertPrice: (amount: number) => string;
  onToggleSave: () => void;
  onReplace: () => void;
}

export function ActivityCard({
  activity,
  isSaved,
  convertPrice,
  onToggleSave,
  onReplace
}: ActivityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-slate-50 hover:bg-slate-100/70 border border-slate-200 hover:border-indigo-300 rounded-2xl p-4 transition-all duration-200"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-28 h-32 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
          <img
            src={activity.imageUrl}
            alt={activity.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {activity.category}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {activity.timeSlot}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 font-mono">
                  {convertPrice(activity.totalCost)}
                </span>
                <span className="text-[10px] text-slate-500">
                  ({activity.cost > 0 ? `${convertPrice(activity.cost)}/person` : 'Free'})
                </span>
              </div>
            </div>

            <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              {activity.title}
            </h4>
            <p className="text-xs text-slate-600 line-clamp-2 mt-1">{activity.description}</p>
            <div className="mt-2.5 p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900 flex items-start gap-2">
              <MessageSquareQuote className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <span className="italic leading-snug">{activity.reason}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-200">
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="text-amber-500 font-bold">★ {activity.rating}</span>
              <span>({activity.reviewsCount} reviews)</span>
              <span>• {activity.bookingType}</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                type="button"
                onClick={onToggleSave}
                whileTap={{ scale: 0.9 }}
                className={`p-1.5 rounded-xl border text-xs transition ${
                  isSaved
                    ? 'bg-pink-50 border-pink-200 text-pink-600'
                    : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-pink-500' : ''}`} />
              </motion.button>
              <motion.button
                type="button"
                onClick={onReplace}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-3 py-1 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center gap-1.5 transition shadow-xs"
              >
                <RefreshCw className="w-3 h-3 text-indigo-600" />
                <span>Swap / Replace</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
