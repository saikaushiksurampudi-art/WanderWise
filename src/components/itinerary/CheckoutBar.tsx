import { motion } from 'motion/react';
import { CreditCard, Download, ShieldCheck } from 'lucide-react';
import { TripPlan } from '../../types';

interface CheckoutBarProps {
  trip: TripPlan;
  onDownloadPDF: () => void;
  onBookNow: () => void;
}

export function CheckoutBar({ trip, onDownloadPDF, onBookNow }: CheckoutBarProps) {
  return (
    <div className="sticky bottom-4 z-30 max-w-4xl mx-auto bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900">Total Estimated Package:</span>
          <span className="text-base font-extrabold font-mono text-emerald-600">
            ${trip.costs.totalProjected.toLocaleString()}
          </span>
          <span className="text-xs text-slate-500">(Buffer: ${trip.remainingBudget})</span>
        </div>
        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Includes hotel, reserved activities, transit passes & taxes. Free cancellation.
        </p>
      </div>
      <div className="flex items-center gap-2.5">
        <motion.button
          type="button"
          onClick={onDownloadPDF}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5 text-slate-600" />
          <span>PDF</span>
        </motion.button>
        <motion.button
          type="button"
          onClick={onBookNow}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2"
        >
          <CreditCard className="w-4 h-4" />
          <span>Book Now</span>
        </motion.button>
      </div>
    </div>
  );
}
