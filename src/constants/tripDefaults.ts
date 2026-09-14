import { TripFormData } from '../types';

export const DEFAULT_PREVIEW_TRIP: TripFormData = {
  destination: 'Paris',
  startDate: '2026-10-15',
  duration: 4,
  budget: 1800,
  travelers: 2,
  interests: ['Food & Dining', 'Museums & Culture', 'Photography & Views'],
  accommodationType: 'Boutique Hotel',
  travelPace: 'balanced'
};

export const CITY_TRIP_DEFAULTS: Omit<TripFormData, 'destination'> = {
  startDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
  duration: 4,
  budget: 1600,
  travelers: 2,
  interests: ['Food & Dining', 'Museums & Culture'],
  accommodationType: 'Boutique Hotel',
  travelPace: 'balanced'
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'CA$',
  AUD: 'AU$'
};

export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'] as const;
