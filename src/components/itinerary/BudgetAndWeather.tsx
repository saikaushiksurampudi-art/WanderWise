import { CloudSun, Coins, DollarSign, Droplets, Wind } from 'lucide-react';
import { CurrencyRates, DestinationWeather, TripPlan } from '../../types';
import { SUPPORTED_CURRENCIES } from '../../constants/tripDefaults';

interface BudgetAndWeatherProps {
  trip: TripPlan;
  weather: DestinationWeather | null;
  loadingWeather: boolean;
  weatherError?: string | null;
  currencyRates: CurrencyRates | null;
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  convertPrice: (amount: number) => string;
}

export function BudgetAndWeather({
  trip,
  weather,
  loadingWeather,
  weatherError,
  currencyRates,
  selectedCurrency,
  onCurrencyChange,
  convertPrice
}: BudgetAndWeatherProps) {
  const isUnderBudget = trip.costs.totalProjected <= trip.totalBudget;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Trip Budget Optimization Tracker
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-full px-2 py-1 gap-1 text-xs">
                <Coins className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-[10px] uppercase font-bold text-slate-400">Currency:</span>
                <select
                  value={selectedCurrency}
                  onChange={e => onCurrencyChange(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  {SUPPORTED_CURRENCIES.map(code => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                isUnderBudget
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {isUnderBudget ? `Under Budget by ${convertPrice(trip.remainingBudget)}` : 'Over Budget'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
            <div className="p-2.5 sm:p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Target</p>
              <p className="text-sm sm:text-xl font-bold font-mono text-slate-900 mt-0.5 truncate">
                {convertPrice(trip.totalBudget)}
              </p>
            </div>
            <div className="p-2.5 sm:p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-wider">Projected Cost</p>
              <p className="text-sm sm:text-xl font-bold font-mono text-indigo-600 mt-0.5 truncate">
                {convertPrice(trip.costs.totalProjected)}
              </p>
            </div>
            <div className="p-2.5 sm:p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-wider">Remaining</p>
              <p className="text-sm sm:text-xl font-bold font-mono text-emerald-600 mt-0.5 truncate">
                {convertPrice(trip.remainingBudget)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex p-0.5 border border-slate-200">
              <div
                style={{ width: `${(trip.costs.accommodation / trip.totalBudget) * 100}%` }}
                className="bg-indigo-500 h-full rounded-l-full"
              />
              <div
                style={{ width: `${(trip.costs.activities / trip.totalBudget) * 100}%` }}
                className="bg-sky-400 h-full"
              />
              <div
                style={{ width: `${(trip.costs.transportation / trip.totalBudget) * 100}%` }}
                className="bg-amber-400 h-full"
              />
              <div
                style={{ width: `${(trip.costs.foodAndMisc / trip.totalBudget) * 100}%` }}
                className="bg-emerald-400 h-full rounded-r-full"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-1 gap-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                Hotel: {convertPrice(trip.costs.accommodation)}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                Activities: {convertPrice(trip.costs.activities)}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                Transport: {convertPrice(trip.costs.transportation)}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                Dining/Misc: {convertPrice(trip.costs.foodAndMisc)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Rates: Live Global FX API via Server Proxy</span>
          <span>1 USD = {currencyRates?.rates[selectedCurrency] || 1} {selectedCurrency}</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-sky-500" />
              <h3 className="text-base font-bold text-slate-900">Live Destination Climate</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-100">
              Live Open-Meteo API
            </span>
          </div>

          {loadingWeather ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs">Fetching live destination climate...</p>
            </div>
          ) : weather ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                    {weather.temperature}{weather.temperatureUnit}
                  </span>
                  <p className="text-xs font-bold text-sky-700 mt-0.5">{weather.condition}</p>
                  <p className="text-[10px] text-slate-400">{weather.city}</p>
                </div>
                <div className="space-y-1 text-right text-[11px] text-slate-600">
                  <div className="flex items-center justify-end gap-1">
                    <Wind className="w-3.5 h-3.5 text-slate-400" />
                    <span>{weather.windSpeed} km/h wind</span>
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <Droplets className="w-3.5 h-3.5 text-slate-400" />
                    <span>{weather.humidity}% humidity</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                  5-Day Travel Window Forecast
                </p>
                <div className="grid grid-cols-5 gap-1 sm:gap-1.5 text-center">
                  {weather.forecast.map((fc, i) => (
                    <div key={i} className="p-1.5 sm:p-2 rounded-xl bg-slate-50 border border-slate-200 text-[9px] sm:text-[10px]">
                      <p className="font-bold text-slate-500">D{i + 1}</p>
                      <p className="font-extrabold text-slate-900 my-0.5">{fc.maxTemp}°</p>
                      <p className="text-slate-400 text-[8px] sm:text-[9px] truncate hidden sm:block">{fc.condition}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : weatherError ? (
            <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
              Live climate is unavailable right now. Your itinerary is still ready to book.
            </p>
          ) : null}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Trip Vibe Summary:</span>
          <span className="text-indigo-600 font-bold truncate max-w-[160px]">
            {trip.aiInsights.vibeSummary.slice(0, 30)}...
          </span>
        </div>
      </div>
    </div>
  );
}
