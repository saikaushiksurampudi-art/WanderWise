import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { BookingRecord, TripPlan } from '../types';
import {
  CheckCircle2,
  Download,
  Mail,
  Briefcase,
  Eye,
  X
} from 'lucide-react';

interface BookingSuccessModalProps {
  booking: BookingRecord;
  trip: TripPlan;
  onClose: () => void;
  onViewBookings: () => void;
  onDownloadPDF: () => void;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  booking,
  trip,
  onClose,
  onViewBookings,
  onDownloadPDF
}) => {
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  useEffect(() => {
    let active = true;
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      if (!active) return;
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 }
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    return () => {
      active = false;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-xl bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-2xl relative my-8 text-center"
      >

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
          Booking Confirmed & Guaranteed
        </span>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-3">
          You're Going to {trip.destination}!
        </h2>

        <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
          Your travel package is officially booked. All reservations, vouchers, and transit passes have been assembled.
        </p>

        {/* Confirmation Code Card */}
        <div className="my-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-xs text-slate-500 font-semibold">Confirmation Code:</span>
            <span className="text-sm font-extrabold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              {booking.confirmationCode}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-700">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Destination:</span>
              <span className="font-semibold text-slate-900">{trip.destination}, {trip.country}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Dates:</span>
              <span className="font-semibold text-slate-900">{trip.startDate} ({trip.duration}d)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Accommodation:</span>
              <span className="font-semibold text-slate-900 truncate block">{trip.accommodation.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Paid:</span>
              <span className="font-semibold text-emerald-600 font-mono">${booking.totalPaid.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Mock Email Banner */}
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-left flex items-start justify-between gap-3 mb-6">
          <div className="flex items-start gap-2.5">
            <Mail className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-900">
                Tickets Dispatched to {booking.paymentDetails.billingEmail}
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Sent vouchers for {booking.itemsBookedCount} items with digital QR passes.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowEmailPreview(!showEmailPreview)}
            className="px-2.5 py-1 rounded-xl bg-white hover:bg-slate-50 border border-indigo-200 text-indigo-700 text-xs font-bold transition flex items-center gap-1 flex-shrink-0 shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Email</span>
          </button>
        </div>

        {/* Simulated Email Popout */}
        {showEmailPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-4 rounded-2xl bg-slate-50 text-slate-900 text-left shadow-md border border-slate-200 text-xs space-y-3 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold text-slate-800">From: concierge@wanderwise.ai</span>
              <span className="text-[10px] text-slate-500">Just Now</span>
            </div>
            <h4 className="font-bold text-sm text-slate-900">
              ✈️ Your Trip to {trip.destination} is Confirmed! (Ref: {booking.confirmationCode})
            </h4>
            <p className="text-slate-600">
              Dear {booking.paymentDetails.cardholderName}, thank you for planning with WanderWise AI. Your itinerary for {trip.destination} ({trip.duration} days) has been secured.
            </p>
            <div className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-1 font-mono text-[11px]">
              <p>• Hotel: {trip.accommodation.name} (Check-in: {trip.startDate})</p>
              <p>• Activities: {booking.activitiesSummary.slice(0, 3).join(', ')}</p>
              <p>• Total Charged: ${booking.totalPaid.toLocaleString()} (Paid with {booking.paymentDetails.cardBrand} •••• {booking.paymentDetails.last4})</p>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              Please present your digital pass on arrival or download your offline PDF below.
            </p>
          </motion.div>
        )}

        {/* Action CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <motion.button
            id="btn-download-pdf-success"
            onClick={onDownloadPDF}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Itinerary PDF</span>
          </motion.button>

          <motion.button
            id="btn-view-in-bookings"
            onClick={onViewBookings}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition flex items-center justify-center gap-2"
          >
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <span>View in My Bookings</span>
          </motion.button>
        </div>

      </motion.div>
    </motion.div>
  );
};
