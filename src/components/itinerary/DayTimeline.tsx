import { motion } from 'motion/react';
import { Train } from 'lucide-react';
import { DayPlan, TripPlan } from '../../types';
import { ActivityCard } from './ActivityCard';

interface DayTimelineProps {
  trip: TripPlan;
  days: DayPlan[];
  savedPlaceIds: string[];
  convertPrice: (amount: number) => string;
  onToggleSavePlace: (activity: DayPlan['activities'][number]) => void;
  onRequestReplaceActivity: (activity: DayPlan['activities'][number]) => void;
}

export function DayTimeline({
  trip,
  days,
  savedPlaceIds,
  convertPrice,
  onToggleSavePlace,
  onRequestReplaceActivity
}: DayTimelineProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex gap-3.5 items-start">
          <img
            src={trip.accommodation.imageUrl}
            alt={trip.accommodation.name}
            className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-indigo-600">Lodging Base</span>
              <span className="text-xs text-amber-500 font-bold">★ {trip.accommodation.rating}</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">{trip.accommodation.name}</h4>
            <p className="text-[11px] text-slate-500">
              {convertPrice(trip.accommodation.costPerNight)}/night • {convertPrice(trip.accommodation.totalCost)} total
            </p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1 truncate">✓ {trip.accommodation.perks[0]}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex gap-3.5 items-start">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Train className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-amber-600">Transportation</span>
              <span className="text-xs text-emerald-600 font-bold">{convertPrice(trip.costs.transportation)} total</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">{trip.transportation[0]?.title}</h4>
            <p className="text-[11px] text-slate-500 truncate">{trip.transportation[0]?.details}</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1">✓ Unlimited rides included</p>
          </div>
        </div>
      </div>

      {days.map((day, dayIdx) => (
        <motion.div
          key={day.day}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: Math.min(dayIdx * 0.08, 0.32) }}
          className="bg-white border border-slate-200 rounded-[2rem] p-5 sm:p-6 shadow-sm space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
                Day {day.day} • {day.date}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">{day.theme}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Day Est.</span>
              <p className="text-sm font-bold font-mono text-emerald-600">{convertPrice(day.dailyProjectedCost)}</p>
            </div>
          </div>

          <div className="relative pl-8 sm:pl-10">
            <div className="absolute left-[13px] sm:left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-indigo-200 via-slate-200 to-transparent" />
            <div className="space-y-4">
              {day.activities.map((act, actIdx) => (
                <div key={act.id} className="relative">
                  <div className="absolute -left-8 sm:-left-10 top-5 w-[26px] h-[26px] rounded-full bg-indigo-600 border-4 border-white shadow-sm flex items-center justify-center text-[10px] font-extrabold text-white z-10">
                    {actIdx + 1}
                  </div>
                  <ActivityCard
                    activity={act}
                    isSaved={savedPlaceIds.includes(act.id)}
                    convertPrice={convertPrice}
                    onToggleSave={() => onToggleSavePlace(act)}
                    onReplace={() => onRequestReplaceActivity(act)}
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
