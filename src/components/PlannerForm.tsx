import React, { useState } from 'react';
import { AccommodationType, InterestCategory, TravelPace, TripFormData } from '../types';
import {
  MapPin,
  Calendar,
  DollarSign,
  Sparkles,
  Utensils,
  Landmark,
  TreePine,
  PartyPopper,
  ShoppingBag,
  Compass,
  Flame,
  Smile,
  Coffee,
  Camera,
  ArrowRight
} from 'lucide-react';

interface PlannerFormProps {
  initialData?: Partial<TripFormData>;
  onGenerate: (data: TripFormData) => void | Promise<void>;
  isLoading: boolean;
}

const POPULAR_DESTINATIONS = [
  { name: 'Tokyo', country: 'Japan', image: '🇯🇵' },
  { name: 'Paris', country: 'France', image: '🇫🇷' },
  { name: 'Rome', country: 'Italy', image: '🇮🇹' },
  { name: 'Barcelona', country: 'Spain', image: '🇪🇸' },
  { name: 'New York City', country: 'USA', image: '🇺🇸' },
  { name: 'Bali', country: 'Indonesia', image: '🇮🇩' },
  { name: 'London', country: 'UK', image: '🇬🇧' },
  { name: 'Kyoto', country: 'Japan', image: '🇯🇵' }
];

const INTEREST_OPTIONS: Array<{
  category: InterestCategory;
  label: string;
  icon: React.ReactNode;
  color: string;
}> = [
  { category: 'Food & Dining', label: 'Food & Dining', icon: <Utensils className="w-4 h-4" />, color: 'text-orange-500' },
  { category: 'Museums & Culture', label: 'Museums & Art', icon: <Landmark className="w-4 h-4" />, color: 'text-indigo-600' },
  { category: 'Nature & Outdoors', label: 'Nature & Outdoors', icon: <TreePine className="w-4 h-4" />, color: 'text-emerald-600' },
  { category: 'Nightlife & Bars', label: 'Nightlife & Bars', icon: <PartyPopper className="w-4 h-4" />, color: 'text-pink-500' },
  { category: 'Shopping & Fashion', label: 'Shopping & Fashion', icon: <ShoppingBag className="w-4 h-4" />, color: 'text-purple-500' },
  { category: 'Adventure & Thrills', label: 'Adventure & Thrills', icon: <Flame className="w-4 h-4" />, color: 'text-red-500' },
  { category: 'Family & Kids', label: 'Family & Kids', icon: <Smile className="w-4 h-4" />, color: 'text-amber-500' },
  { category: 'Relaxation & Wellness', label: 'Relaxation & Spa', icon: <Coffee className="w-4 h-4" />, color: 'text-teal-500' },
  { category: 'Photography & Views', label: 'Scenic Photo Spots', icon: <Camera className="w-4 h-4" />, color: 'text-cyan-600' },
  { category: 'History & Heritage', label: 'History & Heritage', icon: <Compass className="w-4 h-4" />, color: 'text-amber-600' }
];

export const PlannerForm: React.FC<PlannerFormProps> = ({
  initialData,
  onGenerate,
  isLoading
}) => {
  const [destination, setDestination] = useState(initialData?.destination || 'Paris');
  const [budget, setBudget] = useState(initialData?.budget || 1800);
  const [duration, setDuration] = useState(initialData?.duration || 4);
  const [travelers, setTravelers] = useState(initialData?.travelers || 2);
  const [startDate, setStartDate] = useState(initialData?.startDate || '2026-10-15');
  const [interests, setInterests] = useState<InterestCategory[]>(
    initialData?.interests || ['Food & Dining', 'Museums & Culture', 'Photography & Views']
  );
  const [accommodationType, setAccommodationType] = useState<AccommodationType>(
    initialData?.accommodationType || 'Boutique Hotel'
  );
  const [travelPace, setTravelPace] = useState<TravelPace>(initialData?.travelPace || 'balanced');
  const [formError, setFormError] = useState<string | null>(null);

  const toggleInterest = (category: InterestCategory) => {
    if (interests.includes(category)) {
      if (interests.length > 1) {
        setInterests(interests.filter(i => i !== category));
      }
    } else {
      setInterests([...interests, category]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const trimmedDestination = destination.trim();
    const numericBudget = Number(budget);
    const numericDuration = Number(duration);
    const numericTravelers = Number(travelers);

    if (!trimmedDestination) {
      setFormError('Enter a destination city to generate an itinerary.');
      return;
    }
    if (!startDate) {
      setFormError('Choose a departure date.');
      return;
    }
    if (!Number.isFinite(numericBudget) || numericBudget < 300) {
      setFormError('Set a group budget of at least $300.');
      return;
    }
    if (!Number.isFinite(numericDuration) || numericDuration < 1) {
      setFormError('Trip duration must be at least 1 day.');
      return;
    }
    if (!Number.isFinite(numericTravelers) || numericTravelers < 1) {
      setFormError('Add at least one traveler.');
      return;
    }
    if (interests.length === 0) {
      setFormError('Select at least one interest so we can personalize activities.');
      return;
    }

    setFormError(null);
    onGenerate({
      destination: trimmedDestination,
      budget: numericBudget,
      duration: numericDuration,
      travelers: numericTravelers,
      startDate,
      interests,
      accommodationType,
      travelPace
    });
  };

  const perPersonTotal = Math.round(budget / (travelers || 1));
  const perPersonPerDay = Math.round(perPersonTotal / (duration || 1));

  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-sm relative overflow-hidden">
      {/* Background soft ambient accents */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-sky-50/60 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Design Your Personalized Journey
            </h2>
            <p className="text-xs text-slate-500">
              AI-engineered itineraries balancing bucket-list spots & hard budget constraints.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-6">
          {/* Destination */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Destination City & Country
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 w-5 h-5 text-indigo-600 pointer-events-none" />
              <input
                id="input-destination"
                type="text"
                value={destination}
                onChange={e => setDestination(e.target.value)}
                placeholder="e.g. Paris, Tokyo, Rome, New York, Bali..."
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium transition"
              />
            </div>

            {/* Quick destination suggestion pills */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-400 mr-1">Trending:</span>
              {POPULAR_DESTINATIONS.map(dest => (
                <button
                  key={dest.name}
                  type="button"
                  onClick={() => setDestination(dest.name)}
                  className={`text-[11px] font-semibold px-3 py-1 rounded-xl border transition-all ${
                    destination.toLowerCase() === dest.name.toLowerCase()
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold shadow-xs'
                      : 'bg-slate-100/70 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <span className="mr-1">{dest.image}</span> {dest.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dates, Duration, Travelers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Departure Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="input-start-date"
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Trip Duration ({duration} Days)
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="input-duration-range"
                  type="range"
                  min={1}
                  max={14}
                  value={duration}
                  onChange={e => setDuration(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <span className="w-12 text-center py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-indigo-700">
                  {duration}d
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Travelers ({travelers})
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 6].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTravelers(num)}
                    className={`flex-1 py-2 rounded-2xl text-xs font-bold border transition ${
                      travelers === num
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {num === 1 ? 'Solo' : num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Budget Setting & Dynamic Metric Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" /> Total Group Budget (USD)
              </label>
              <span className="text-xs text-slate-500">
                ~<strong className="text-emerald-600 font-mono">${perPersonPerDay}</strong> / person / day
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-base">$</span>
              <input
                id="input-budget"
                type="number"
                min={300}
                max={50000}
                step={50}
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-lg font-bold font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Quick preset buttons */}
            <div className="mt-2.5 flex flex-wrap gap-2">
              {[800, 1500, 2500, 4000, 6000].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setBudget(amt)}
                  className={`px-3 py-1 text-xs rounded-xl border font-semibold transition ${
                    budget === amt
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  ${amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Interests Multi-Select */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Select Your Interests & Passions ({interests.length} Selected)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {INTEREST_OPTIONS.map(opt => {
                const isSelected = interests.includes(opt.category);
                return (
                  <button
                    key={opt.category}
                    type="button"
                    onClick={() => toggleInterest(opt.category)}
                    className={`flex items-center gap-2 p-2.5 rounded-2xl border text-xs font-medium text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-xs ring-1 ring-indigo-300'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/80 hover:border-slate-300'
                    }`}
                  >
                    <span className={opt.color}>{opt.icon}</span>
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Style & Pace options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Lodging Style
              </label>
              <select
                id="select-accommodation"
                value={accommodationType}
                onChange={e => setAccommodationType(e.target.value as AccommodationType)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="Boutique Hotel">Boutique Hotel (Comfort & Charm)</option>
                <option value="Luxury Resort">Luxury Resort & Spa (5-Star)</option>
                <option value="Budget Hostel">Budget Hostels & Pods (Max Savings)</option>
                <option value="Charming Apartment">Charming City Apartment (Local Living)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Travel Pace
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['relaxed', 'balanced', 'packed'] as TravelPace[]).map(pace => (
                  <button
                    key={pace}
                    type="button"
                    onClick={() => setTravelPace(pace)}
                    className={`py-2 rounded-2xl text-xs font-bold capitalize border transition ${
                      travelPace === pace
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {pace}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {formError && (
            <p role="alert" className="text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              {formError}
            </p>
          )}

          {/* Submit Button */}
          <button
            id="btn-generate-itinerary"
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-base shadow-lg shadow-slate-900/10 transition-all hover:scale-[1.005] active:scale-[0.995] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>AI is optimizing your {destination} trip...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-indigo-300" />
                <span>Generate Magic Budget Itinerary</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
