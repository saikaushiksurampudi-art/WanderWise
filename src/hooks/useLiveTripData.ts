import { useEffect, useState } from 'react';
import { CurrencyRates, DestinationWeather, TripPlan } from '../types';
import { api } from '../services/api';

export function useLiveTripData(trip: TripPlan) {
  const [weather, setWeather] = useState<DestinationWeather | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [currencyRates, setCurrencyRates] = useState<CurrencyRates | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  useEffect(() => {
    let isMounted = true;

    const fetchLiveData = async () => {
      setLoadingWeather(true);
      setWeatherError(null);
      try {
        const [weatherData, ratesData] = await Promise.all([
          api.getWeather(trip.coordinates?.lat || 48.8566, trip.coordinates?.lng || 2.3522, trip.destination),
          api.getCurrencyRates()
        ]);
        if (isMounted) {
          setWeather(weatherData);
          setCurrencyRates(ratesData);
        }
      } catch (err) {
        if (isMounted) {
          setWeatherError(err instanceof Error ? err.message : 'Live weather and currency data are unavailable.');
        }
      } finally {
        if (isMounted) setLoadingWeather(false);
      }
    };

    fetchLiveData();
    return () => {
      isMounted = false;
    };
  }, [trip.destination, trip.coordinates?.lat, trip.coordinates?.lng]);

  return {
    weather,
    loadingWeather,
    weatherError,
    currencyRates,
    selectedCurrency,
    setSelectedCurrency
  };
}
