import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BookingRecord, TripPlan } from '../types';
import { Briefcase, Calendar, MapPin, Download, CheckCircle2, Eye, Sparkles } from 'lucide-react';
import { generateTripPDF } from '../services/pdfGenerator';

interface MyBookingsProps {
  bookings: BookingRecord[];
  onPlanNewTrip: () => void;
  onLoadItinerary?: (trip: TripPlan) => void;
}

export const MyBookings: React.FC<MyBookingsProps> = ({
  bookings,
  onPlanNewTrip
}) => {
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  const handleDownloadPDF = (booking: BookingRecord) => {
    if (booking.itinerarySnapshot) {
      generateTripPDF(booking.itinerarySnapshot, booking);
    } else {
      // Create minimal trip plan for PDF
      const fallbackTrip: any = {
        id: booking.tripId,
        title: booking.tripTitle,
        destination: booking.destination,
        country: 'Global',
        startDate: booking.travelDates.split(' ')[0],
        duration: booking.duration,
        travelers: booking.travelers,
        totalBudget: booking.totalPaid,
        costs: booking.breakdown,
        remainingBudget: 0,
        interests: ['Food & Dining', 'Museums & Culture'],
        days: [],
        accommodation: {
          name: booking.accommodationName,
          type: 'Boutique Hotel',
          costPerNight: Math.round(booking.breakdown.accommodation / booking.duration),
          totalCost: booking.breakdown.accommodation,
          perks: ['Confirmed Booking', 'Breakfast Included']
        },
        transportation: [
          {
            type: 'City Metro Pass',
            title: `${booking.destination} All-Access Transit Pass`,
            cost: booking.breakdown.transportation,
            details: 'Unlimited public transit pass'
          }
        ],
        aiInsights: {
          vibeSummary: `Confirmed booking for ${booking.destination}.`,
          budgetAdvice: 'Package is paid in full.',
          localHacks: ['Keep confirmation code handy upon hotel check-in.'],
          packingEssentials: ['Passport / ID', 'Mobile vouchers'],
          savingsEstimated: 250
        }
      };
      generateTripPDF(fallbackTrip, booking);
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold mb-2">
            <Briefcase className="w-3.5 h-3.5" /> Booked Vacations & Vouchers
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            My Travel Bookings ({bookings.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access your itinerary PDFs, QR boarding passes, and receipts at any time.
          </p>
        </div>

        <motion.button
          onClick={onPlanNewTrip}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2 flex-shrink-0"
        >
          <Sparkles className="w-4 h-4 text-indigo-300" />
          <span>Plan Another Trip</span>
        </motion.button>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-12 text-center shadow-sm space-y-4">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Bookings Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Design a custom itinerary with WanderWise AI and complete the checkout to see your bookings here.
          </p>
          <button
            onClick={onPlanNewTrip}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-sm hover:bg-slate-800 transition"
          >
            Start Planning
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking, idx) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(idx * 0.06, 0.3) }}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-[2rem] p-5 sm:p-6 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {booking.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    Ref: {booking.confirmationCode}
                  </span>
                  <span className="text-xs text-slate-400">
                    Booked on {booking.bookingDate}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {booking.tripTitle}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-pink-500" />
                    {booking.destination}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    {booking.travelDates}
                  </span>
                  <span className="text-slate-500">
                    • {booking.travelers} Pax • {booking.itemsBookedCount} Booked Items
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-1">
                  🏨 {booking.accommodationName}
                </p>
              </div>

              {/* Price & Action Buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Paid</span>
                  <p className="text-xl font-extrabold font-mono text-emerald-600">
                    ${booking.totalPaid.toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Receipt & Vouchers</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPDF(booking)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5"
                    title="Download Itinerary PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      )}

      {/* Booking Receipt Detail Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg bg-white border border-slate-200 rounded-[2rem] p-6 shadow-2xl relative my-8"
            >
              <button
                onClick={() => setSelectedBooking(null)}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-900 bg-slate-100 transition text-xs font-bold"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedBooking.tripTitle}</h3>
                  <p className="text-xs text-slate-500">Confirmation Code: <strong className="text-emerald-600 font-mono">{selectedBooking.confirmationCode}</strong></p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs text-slate-700 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Traveler:</span>
                  <span className="font-semibold text-slate-900">{selectedBooking.paymentDetails.cardholderName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Card Used:</span>
                  <span className="font-mono text-slate-900">{selectedBooking.paymentDetails.cardBrand} ending in {selectedBooking.paymentDetails.last4}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email Delivery:</span>
                  <span className="text-indigo-600 font-medium">{selectedBooking.paymentDetails.billingEmail}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm">
                  <span className="text-slate-900">Amount Charged:</span>
                  <span className="text-emerald-600 font-mono">${selectedBooking.totalPaid.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Included Reservations ({selectedBooking.itemsBookedCount} Total):
                </span>
                <div className="space-y-1 text-xs text-slate-600">
                  <p>• {selectedBooking.accommodationName} (Full Stay)</p>
                  {selectedBooking.activitiesSummary.map((act, i) => (
                    <p key={i}>• {act}</p>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownloadPDF(selectedBooking)}
                  className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Ticket & Itinerary</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
