import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckoutFormData, TripPlan } from '../types';
import { X, CreditCard, Lock, ShieldCheck, Mail, Phone } from 'lucide-react';

interface CheckoutModalProps {
  trip: TripPlan;
  onClose: () => void;
  onSubmitCheckout: (formData: CheckoutFormData) => void;
  isProcessing: boolean;
  errorMessage?: string | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  trip,
  onClose,
  onSubmitCheckout,
  isProcessing,
  errorMessage
}) => {
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: 'Alex',
    lastName: 'Traveler',
    email: 'demo@wanderwise.example',
    phone: '+1 (555) 010-0100',
    cardNumber: '4242 4242 4242 4242',
    expiryDate: '08/29',
    cvv: '123',
    billingAddress: '1 Demo Street',
    city: 'San Francisco',
    zipCode: '94107',
    agreeTerms: true
  });

  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setFormError('Enter the traveler first and last name.');
      return;
    }
    if (!formData.email.includes('@')) {
      setFormError('Enter a valid email for tickets and vouchers.');
      return;
    }
    if (!formData.agreeTerms) {
      setFormError('Please agree to the booking terms to continue.');
      return;
    }
    setFormError(null);
    onSubmitCheckout(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.22 }}
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-2xl relative my-8"
      >

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                Secure Checkout & Instant Booking
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                Sandbox Mode
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Confirm your itinerary. Tickets, hotel voucher, and PDF receipt will be dispatched to your email.
            </p>
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 mb-6 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900">
              {trip.title} ({trip.duration} Days • {trip.travelers} Travelers)
            </span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">{trip.destination}</span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500">• {trip.accommodation.name} ({trip.duration} Nights):</span>
              <span className="font-mono font-bold text-slate-800">${trip.costs.accommodation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">• All Reserved Activities & Passes ({trip.travelers} Pax):</span>
              <span className="font-mono font-bold text-slate-800">${trip.costs.activities}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">• City Transit Pass & Airport Transfers:</span>
              <span className="font-mono font-bold text-slate-800">${trip.costs.transportation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">• Estimated Local Taxes & Service Surcharge:</span>
              <span className="font-mono font-bold text-slate-800">${trip.costs.taxesAndService}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2.5 border-t border-slate-200 text-sm">
            <span className="font-bold text-slate-900">Total Amount Due:</span>
            <span className="font-extrabold font-mono text-emerald-600 text-base">
              ${trip.costs.totalProjected.toLocaleString()} USD
            </span>
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Primary Traveler & Voucher Recipient
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Email (For Ticket Delivery)</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Card Info (Mock) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Payment Method (Mock Card Test)
              </h4>
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" /> 256-Bit Encrypted
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div>
                <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Card Number</label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.cardNumber}
                    onChange={e => setFormData({ ...formData, cardNumber: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-xs"
                    placeholder="4242 4242 4242 4242"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    required
                    value={formData.expiryDate}
                    onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-xs"
                    placeholder="12/28"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Security Code (CVC)</label>
                  <input
                    type="text"
                    required
                    value={formData.cvv}
                    onChange={e => setFormData({ ...formData, cvv: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-xs"
                    placeholder="884"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Guarantee Badge */}
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>100% money-back guarantee with free cancellation up to 48 hours prior.</span>
          </div>

          {(formError || errorMessage) && (
            <p role="alert" className="text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              {formError || errorMessage}
            </p>
          )}

          {/* Submit Button */}
          <motion.button
            id="btn-confirm-mock-payment"
            type="submit"
            disabled={isProcessing}
            whileHover={isProcessing ? undefined : { scale: 1.01 }}
            whileTap={isProcessing ? undefined : { scale: 0.99 }}
            className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authorizing & Reserving Vouchers...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Pay ${trip.costs.totalProjected.toLocaleString()} & Complete Booking</span>
              </>
            )}
          </motion.button>
        </form>

      </motion.div>
    </motion.div>
  );
};
