import { ArrowLeft, Calendar, CheckCircle2, CreditCard, Download, MapPin, Sparkles, Users } from 'lucide-react';
import { TripPlan } from '../../types';

interface TripHeroProps {
  trip: TripPlan;
  onBack: () => void;
  onOpenAIConcierge: () => void;
  onDownloadPDF: () => void;
  onBookNow: () => void;
}

export function TripHero({ trip, onBack, onOpenAIConcierge, onDownloadPDF, onBookNow }: TripHeroProps) {
  return (
    <div className="relative rounded-[2rem] overflow-hidden bg-slate-900 border border-slate-800 shadow-sm p-6 sm:p-8">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white mb-5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back</span>
      </button>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Budget Optimized
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {trip.country}
            </span>
            <span className="text-xs text-slate-400">
              Created {new Date(trip.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            {trip.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs sm:text-sm text-slate-300">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-400" />
              {trip.startDate} ({trip.duration} Days)
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-sky-400" />
              {trip.travelers} Traveler{trip.travelers > 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-pink-400" />
              {trip.destination}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onOpenAIConcierge}
            className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Ask AI Concierge</span>
            <span className="sm:hidden">Ask AI</span>
          </button>

          <button
            type="button"
            onClick={onDownloadPDF}
            className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Export PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>

          <button
            type="button"
            onClick={onBookNow}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>Book Complete Trip</span>
          </button>
        </div>
      </div>
    </div>
  );
}
