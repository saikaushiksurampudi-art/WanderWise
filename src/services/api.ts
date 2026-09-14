import { BookingRecord, CityTemplate, CheckoutFormData, DestinationWeather, CurrencyRates, SavedPlace, TripFormData, TripPlan } from '../types';

function toErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, options);
  } catch (error) {
    throw new Error(toErrorMessage(error, 'Unable to reach WanderWise. Confirm the development server is running.'));
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    throw new Error('The server returned an unexpected response. Please try again.');
  }

  if (!res.ok || data?.success === false) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }

  return data as T;
}

const jsonHeaders = { 'Content-Type': 'application/json' };

export const api = {
  async getHealth() {
    return apiFetch('/api/health');
  },

  async getTemplates(): Promise<CityTemplate[]> {
    const data = await apiFetch<{ data: CityTemplate[] }>('/api/templates');
    return data.data || [];
  },

  async getWeather(lat: number, lng: number, city: string): Promise<DestinationWeather> {
    const data = await apiFetch<{ data: DestinationWeather }>(
      `/api/weather?lat=${lat}&lng=${lng}&city=${encodeURIComponent(city)}`
    );
    if (!data.data) throw new Error('Weather data is unavailable right now.');
    return data.data;
  },

  async getCurrencyRates(): Promise<CurrencyRates> {
    const data = await apiFetch<{ data: CurrencyRates }>('/api/currency/rates');
    if (!data.data) throw new Error('Currency rates are unavailable right now.');
    return data.data;
  },

  async generateTrip(formData: TripFormData): Promise<TripPlan> {
    const data = await apiFetch<{ data: TripPlan }>('/api/trips/generate', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(formData)
    });
    if (!data.data) throw new Error('Failed to generate itinerary');
    return data.data;
  },

  async replaceActivity(trip: TripPlan, activityId: string, preferredCategory?: string): Promise<TripPlan> {
    const data = await apiFetch<{ data: TripPlan }>('/api/trips/replace-activity', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ trip, activityId, preferredCategory })
    });
    if (!data.data) throw new Error('Failed to replace activity');
    return data.data;
  },

  async getBookings(): Promise<BookingRecord[]> {
    const data = await apiFetch<{ data: BookingRecord[] }>('/api/bookings');
    return data.data || [];
  },

  async processCheckout(trip: TripPlan, checkoutData: CheckoutFormData): Promise<{ booking: BookingRecord; emailSentTo: string; message: string }> {
    const data = await apiFetch<{ data: { booking: BookingRecord; emailSentTo: string; message: string } }>(
      '/api/bookings/checkout',
      {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({ trip, checkoutData })
      }
    );
    if (!data.data) throw new Error('Payment failed');
    return data.data;
  },

  async getSavedPlaces(): Promise<SavedPlace[]> {
    const data = await apiFetch<{ data: SavedPlace[] }>('/api/saved-places');
    return data.data || [];
  },

  async toggleSavedPlace(place: SavedPlace): Promise<{ isSaved: boolean; data: SavedPlace[] }> {
    const data = await apiFetch<{ isSaved: boolean; data: SavedPlace[] }>('/api/saved-places', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(place)
    });
    return { isSaved: Boolean(data.isSaved), data: data.data || [] };
  },

  async askAIConcierge(query: string, trip?: TripPlan): Promise<string> {
    const data = await apiFetch<{ answer: string }>('/api/ai/ask-assistant', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ query, trip })
    });
    if (!data.answer) throw new Error('The concierge could not answer right now.');
    return data.answer;
  }
};
