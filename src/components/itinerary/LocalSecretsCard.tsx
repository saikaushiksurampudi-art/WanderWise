import { Luggage } from 'lucide-react';
import { TripPlan } from '../../types';

export function LocalSecretsCard({ trip }: { trip: TripPlan }) {
  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <Luggage className="w-4 h-4 text-sky-600" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Local Secrets & Essentials
        </h4>
      </div>
      <div className="space-y-2 text-xs text-slate-600">
        {trip.aiInsights.localHacks.map((hack, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>{hack}</span>
          </div>
        ))}
      </div>
      <div className="pt-3 border-t border-slate-100">
        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Packing Essentials:</p>
        <div className="flex flex-wrap gap-1.5">
          {trip.aiInsights.packingEssentials.map((item, idx) => (
            <span key={idx} className="px-2.5 py-1 rounded-xl bg-slate-50 text-[11px] text-slate-700 border border-slate-200">
              🎒 {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
