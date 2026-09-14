import React from 'react';
import { motion } from 'motion/react';
import { SavedPlace } from '../types';
import { Heart, MapPin, Trash2, Star, Plus } from 'lucide-react';

interface SavedPlacesViewProps {
  savedPlaces: SavedPlace[];
  onRemovePlace: (place: SavedPlace) => void;
  onPlanTripToCity: (city: string) => void;
}

export const SavedPlacesView: React.FC<SavedPlacesViewProps> = ({
  savedPlaces,
  onRemovePlace,
  onPlanTripToCity
}) => {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-100 text-xs font-bold mb-2">
          <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" /> Wishlist & Bookmarks
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          Saved Places & Attractions ({savedPlaces.length})
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Places you've bookmarked while exploring. One-click plan a trip around your saved favorites!
        </p>
      </div>

      {savedPlaces.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-12 text-center shadow-sm space-y-4">
          <Heart className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Saved Places Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the heart icon on any itinerary activity to save it to your wishlist for future trips.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedPlaces.map((place, idx) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(idx * 0.06, 0.3) }}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md flex flex-col justify-between transition group"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={place.imageUrl}
                    alt={place.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-slate-900/80 backdrop-blur-md text-white border border-white/20">
                    {place.category}
                  </span>

                  <motion.button
                    onClick={() => onRemovePlace(place)}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 backdrop-blur-md text-slate-400 hover:text-pink-600 shadow-sm transition"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-slate-700 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-pink-500" />
                      {place.city}
                    </span>
                    <span className="text-amber-500 font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" /> {place.rating}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                    {place.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {place.reason}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => onPlanTripToCity(place.city)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Plan Trip in {place.city}</span>
                </button>
              </div>

            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
};
