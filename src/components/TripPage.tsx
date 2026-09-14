import { useState } from 'react';
import { ActivityItem, TripPlan } from '../types';
import { InteractiveMap } from './InteractiveMap';
import { useLiveTripData } from '../hooks/useLiveTripData';
import { formatConvertedPrice } from '../utils/currency';
import { TripHero } from './itinerary/TripHero';
import { BudgetAndWeather } from './itinerary/BudgetAndWeather';
import { DayViewControls, DayFilter, ViewMode } from './itinerary/DayViewControls';
import { DayTimeline } from './itinerary/DayTimeline';
import { LocalSecretsCard } from './itinerary/LocalSecretsCard';
import { CheckoutBar } from './itinerary/CheckoutBar';

interface TripPageProps {
  trip: TripPlan;
  onBack: () => void;
  onBookNow: () => void;
  onDownloadPDF: () => void;
  onOpenAIConcierge: () => void;
  onRequestReplaceActivity: (activity: ActivityItem) => void;
  onToggleSavePlace: (activity: ActivityItem) => void;
  savedPlaceIds: string[];
}

export function TripPage({
  trip,
  onBack,
  onBookNow,
  onDownloadPDF,
  onOpenAIConcierge,
  onRequestReplaceActivity,
  onToggleSavePlace,
  savedPlaceIds
}: TripPageProps) {
  const [activeDay, setActiveDay] = useState<DayFilter>(1);
  const [viewMode, setViewMode] = useState<ViewMode>('both');
  const { weather, loadingWeather, weatherError, currencyRates, selectedCurrency, setSelectedCurrency } = useLiveTripData(trip);

  const convertPrice = (usdAmount: number) =>
    formatConvertedPrice(usdAmount, selectedCurrency, currencyRates);

  const visibleDays = trip.days.filter(d => activeDay === 'all' || activeDay === d.day);

  return (
    <div className="space-y-8">
      <TripHero
        trip={trip}
        onBack={onBack}
        onOpenAIConcierge={onOpenAIConcierge}
        onDownloadPDF={onDownloadPDF}
        onBookNow={onBookNow}
      />

      <BudgetAndWeather
        trip={trip}
        weather={weather}
        loadingWeather={loadingWeather}
        weatherError={weatherError}
        currencyRates={currencyRates}
        selectedCurrency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
        convertPrice={convertPrice}
      />

      <DayViewControls
        trip={trip}
        activeDay={activeDay}
        viewMode={viewMode}
        onDayChange={setActiveDay}
        onViewModeChange={setViewMode}
        convertPrice={convertPrice}
      />

      <div className={`grid gap-8 ${viewMode === 'both' ? 'grid-cols-1 xl:grid-cols-12' : 'grid-cols-1'}`}>
        {(viewMode === 'timeline' || viewMode === 'both') && (
          <div className={viewMode === 'both' ? 'xl:col-span-7' : ''}>
            <DayTimeline
              trip={trip}
              days={visibleDays}
              savedPlaceIds={savedPlaceIds}
              convertPrice={convertPrice}
              onToggleSavePlace={onToggleSavePlace}
              onRequestReplaceActivity={onRequestReplaceActivity}
            />
          </div>
        )}

        {(viewMode === 'map' || viewMode === 'both') && (
          <div className={viewMode === 'both' ? 'xl:col-span-5 space-y-6' : 'space-y-6'}>
            <div className="sticky top-24 space-y-6">
              <InteractiveMap trip={trip} activeDay={activeDay} />
              <LocalSecretsCard trip={trip} />
            </div>
          </div>
        )}
      </div>

      <CheckoutBar trip={trip} onDownloadPDF={onDownloadPDF} onBookNow={onBookNow} />
    </div>
  );
}
