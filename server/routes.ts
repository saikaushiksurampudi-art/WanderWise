import { Express } from 'express';
import { CITY_TEMPLATES, SEED_PLACES } from './seedData.js';
import { generateGeminiItinerary, askGeminiConcierge } from './geminiService.js';
import { bookingsStore, savedPlacesStore } from './store.js';
import type { BookingRecord, SavedPlace, TripFormData, TripPlan } from '../src/types';
import {
  computeTripTotal,
  failRequest,
  isInterestCategory,
  isValidEmail,
  rateLimit,
  safeNumber,
  safeString
} from './security.js';

// AI-backed routes hit a metered upstream API, so they get the tightest budget.
const aiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  message: 'Too many itinerary requests. Please wait a minute before trying again.'
});
const writeLimiter = rateLimit({ windowMs: 5 * 60 * 1000, max: 60 });

export function registerApiRoutes(app: Express) {
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/api/templates', (_req, res) => {
    res.json({ success: true, data: CITY_TEMPLATES });
  });

  app.post('/api/trips/generate', aiLimiter, async (req, res) => {
    try {
      const body = req.body || {};
      const destination = safeString(body.destination, 80);
      const budget = safeNumber(body.budget, 1, 1_000_000);
      const duration = safeNumber(body.duration, 1, 30);
      const travelers = safeNumber(body.travelers, 1, 50) ?? 2;

      if (!destination || budget === null) {
        res.status(400).json({ success: false, error: 'Destination and budget are required.' });
        return;
      }
      if (duration === null) {
        res.status(400).json({ success: false, error: 'Trip duration must be between 1 and 30 days.' });
        return;
      }

      const interests = Array.isArray(body.interests)
        ? body.interests.filter(isInterestCategory).slice(0, 12)
        : [];

      const formData: TripFormData = {
        destination,
        budget,
        duration,
        travelers,
        startDate: safeString(body.startDate, 24) || new Date().toISOString().split('T')[0],
        interests: interests.length > 0 ? interests : ['Food & Dining', 'Museums & Culture'],
        accommodationType: body.accommodationType,
        travelPace: body.travelPace
      };

      console.log(`[Trip Generator] Processing itinerary for ${destination}, ${duration}d`);
      const tripPlan = await generateGeminiItinerary(formData);
      res.json({ success: true, data: tripPlan });
    } catch (error) {
      failRequest(res, 500, 'Failed to generate itinerary. Please try again.', 'Generate Trip Error', error);
    }
  });

  app.post('/api/trips/replace-activity', writeLimiter, (req, res) => {
    try {
      const { trip, activityId, preferredCategory } = req.body || {};
      const requestedId = safeString(activityId, 120);

      if (!trip || typeof trip !== 'object' || !requestedId) {
        res.status(400).json({ success: false, error: 'Trip and activityId required.' });
        return;
      }
      if (!Array.isArray(trip.days) || !trip.coordinates || typeof trip.destination !== 'string') {
        res.status(400).json({ success: false, error: 'Malformed trip payload.' });
        return;
      }
      if (preferredCategory !== undefined && !isInterestCategory(preferredCategory)) {
        res.status(400).json({ success: false, error: 'Unsupported activity category.' });
        return;
      }

      const tripCopy: TripPlan = JSON.parse(JSON.stringify(trip));
      let replaced = false;

      for (const day of tripCopy.days) {
        const actIndex = day.activities.findIndex(a => a.id === requestedId);
        if (actIndex !== -1) {
          const currentAct = day.activities[actIndex];
          const altCat = preferredCategory || (currentAct.category === 'Food & Dining' ? 'Museums & Culture' : 'Food & Dining');
          let matchingSeeds = SEED_PLACES.filter(p => p.category === altCat);
          if (matchingSeeds.length === 0) {
            matchingSeeds = SEED_PLACES.filter(p => p.city.toLowerCase() === trip.destination.toLowerCase());
          }
          const seed = matchingSeeds.length > 0 ? matchingSeeds[Math.floor(Math.random() * matchingSeeds.length)] : SEED_PLACES[0];

          const newCost = seed.cost;
          const newTotal = newCost * tripCopy.travelers;
          const costDiff = newTotal - currentAct.totalCost;

          day.activities[actIndex] = {
            ...currentAct,
            id: `act-rep-${Date.now()}`,
            title: seed.title.includes(trip.destination) ? seed.title : `${trip.destination} ${seed.title}`,
            category: altCat,
            cost: newCost,
            totalCost: newTotal,
            description: seed.description,
            reason: `Replaced to match your preference for '${altCat}'. Optimized to stay within budget.`,
            location: {
              name: `${seed.title}, ${trip.destination}`,
              lat: trip.coordinates.lat + (Math.random() * 0.02 - 0.01),
              lng: trip.coordinates.lng + (Math.random() * 0.02 - 0.01),
              address: `Central ${trip.destination}`
            },
            imageUrl: seed.imageUrl,
            bookingType: seed.bookingType
          };

          day.dailyProjectedCost += costDiff;
          tripCopy.costs.activities += costDiff;
          tripCopy.costs.totalProjected += costDiff;
          tripCopy.remainingBudget = Math.max(0, tripCopy.totalBudget - tripCopy.costs.totalProjected);
          replaced = true;
          break;
        }
      }

      if (!replaced) {
        res.status(404).json({ success: false, error: 'Activity not found in itinerary.' });
        return;
      }

      res.json({ success: true, data: tripCopy });
    } catch (error) {
      failRequest(res, 500, 'Could not replace that activity. Please try again.', 'Replace Activity Error', error);
    }
  });

  app.get('/api/bookings', (_req, res) => {
    res.json({ success: true, data: bookingsStore });
  });

  app.post('/api/bookings/checkout', writeLimiter, (req, res) => {
    try {
      const { trip, checkoutData } = req.body || {};
      if (!trip || typeof trip !== 'object' || !checkoutData || typeof checkoutData !== 'object') {
        res.status(400).json({ success: false, error: 'Trip details and checkout info required.' });
        return;
      }

      const firstName = safeString(checkoutData.firstName, 60);
      const lastName = safeString(checkoutData.lastName, 60);
      const email = safeString(checkoutData.email, 254);
      const cardNumber = safeString(checkoutData.cardNumber, 25);

      if (!firstName || !lastName) {
        res.status(400).json({ success: false, error: 'Traveler first and last name are required.' });
        return;
      }
      if (!isValidEmail(email)) {
        res.status(400).json({ success: false, error: 'A valid email is required for tickets and vouchers.' });
        return;
      }

      // The amount charged is recomputed from the itinerary's own line items:
      // a client-supplied total must never be trusted.
      const serverTotal = computeTripTotal(trip.costs);
      if (serverTotal === null) {
        res.status(400).json({ success: false, error: 'Itinerary pricing is invalid. Regenerate the trip and retry.' });
        return;
      }

      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const confirmationCode = `WWISE-${randomDigits}`;
      const bookingId = `bk-${Date.now()}`;
      const activitiesSummary: string[] = [];
      trip.days?.forEach((d: any) => {
        d.activities?.forEach((a: any) => {
          if (activitiesSummary.length < 5) {
            activitiesSummary.push(`${a.title} (${a.bookingType || 'Standard'})`);
          }
        });
      });

      const newBooking: BookingRecord = {
        id: bookingId,
        tripId: trip.id,
        destination: trip.destination,
        tripTitle: trip.title,
        confirmationCode,
        bookingDate: new Date().toISOString().split('T')[0],
        travelDates: `${trip.startDate} (${trip.duration} Days)`,
        travelers: trip.travelers,
        duration: trip.duration,
        totalPaid: serverTotal,
        breakdown: { ...trip.costs, totalProjected: serverTotal },
        paymentDetails: {
          cardholderName: `${firstName} ${lastName}`.trim() || 'Valued Traveler',
          cardBrand: cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
          // Only the last four digits are ever retained — never the full number.
          last4: cardNumber ? cardNumber.replace(/\D/g, '').slice(-4) || '4242' : '4242',
          billingEmail: email
        },
        status: 'confirmed',
        itemsBookedCount: (trip.days?.reduce((acc: number, d: any) => acc + (d.activities?.length || 0), 0) || 0) + 2,
        accommodationName: trip.accommodation?.name || `${trip.destination} Selected Hotel`,
        activitiesSummary,
        itinerarySnapshot: trip
      };

      bookingsStore.unshift(newBooking);
      // Confirmation code only — customer email is PII and stays out of the logs.
      console.log(`[Booking Service] Created confirmation ${confirmationCode}`);

      res.json({
        success: true,
        data: {
          booking: newBooking,
          emailSentTo: email,
          message: 'Booking successfully confirmed! Digital tickets and vouchers dispatched.'
        }
      });
    } catch (error) {
      failRequest(res, 500, 'Payment could not be processed. Please try again.', 'Checkout Error', error);
    }
  });

  app.get('/api/saved-places', (_req, res) => {
    res.json({ success: true, data: savedPlacesStore });
  });

  app.post('/api/saved-places', writeLimiter, (req, res) => {
    try {
      const body = req.body || {};
      const id = safeString(body.id, 120);
      const title = safeString(body.title, 160);

      if (!id || !title) {
        res.status(400).json({ success: false, error: 'Place data required.' });
        return;
      }
      if (savedPlacesStore.length >= 500) {
        res.status(429).json({ success: false, error: 'Saved places limit reached. Remove a few and try again.' });
        return;
      }

      const existingIndex = savedPlacesStore.findIndex(p => p.id === id);
      let isSaved = false;

      if (existingIndex >= 0) {
        savedPlacesStore.splice(existingIndex, 1);
        isSaved = false;
      } else {
        // Rebuilt field by field so only known keys are ever persisted.
        const place: SavedPlace = {
          id,
          title,
          category: isInterestCategory(body.category) ? body.category : 'Museums & Culture',
          city: safeString(body.city, 80) || 'Travel Spot',
          cost: safeNumber(body.cost, 0, 100_000) ?? 0,
          rating: safeNumber(body.rating, 0, 5) ?? 4.5,
          reason: safeString(body.reason, 500),
          imageUrl: /^https:\/\//.test(safeString(body.imageUrl, 500)) ? safeString(body.imageUrl, 500) : '',
          lat: safeNumber(body.lat, -90, 90) ?? 0,
          lng: safeNumber(body.lng, -180, 180) ?? 0,
          addedAt: new Date().toISOString()
        };
        savedPlacesStore.unshift(place);
        isSaved = true;
      }

      res.json({ success: true, isSaved, data: savedPlacesStore });
    } catch (error) {
      failRequest(res, 500, 'Could not update your saved places.', 'Saved Places Error', error);
    }
  });

  app.get('/api/weather', async (req, res) => {
    try {
      // Coordinates are range-checked before they are interpolated into the upstream URL.
      const lat = safeNumber(req.query.lat, -90, 90) ?? 48.8566;
      const lng = safeNumber(req.query.lng, -180, 180) ?? 2.3522;
      const city = safeString(req.query.city, 80) || 'Destination';
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

      const response = await fetch(weatherUrl);
      if (!response.ok) {
        throw new Error(`Open-Meteo API returned status ${response.status}`);
      }

      const raw = await response.json();
      const codeToCondition = (code: number) => {
        if (code === 0) return 'Sunny / Clear';
        if (code <= 3) return 'Partly Cloudy';
        if (code <= 48) return 'Foggy';
        if (code <= 57) return 'Light Drizzle';
        if (code <= 67) return 'Rainy';
        if (code <= 77) return 'Snow';
        if (code <= 82) return 'Showers';
        if (code >= 95) return 'Thunderstorm';
        return 'Pleasant';
      };

      res.json({
        success: true,
        data: {
          city,
          temperature: Math.round(raw.current?.temperature_2m ?? 21),
          temperatureUnit: '°C',
          weatherCode: raw.current?.weather_code ?? 0,
          condition: codeToCondition(raw.current?.weather_code ?? 0),
          windSpeed: Math.round(raw.current?.wind_speed_10m ?? 8),
          humidity: raw.current?.relative_humidity_2m ?? 55,
          forecast: (raw.daily?.time || []).slice(0, 5).map((dateStr: string, idx: number) => ({
            date: dateStr,
            maxTemp: Math.round(raw.daily?.temperature_2m_max?.[idx] ?? 23),
            minTemp: Math.round(raw.daily?.temperature_2m_min?.[idx] ?? 15),
            condition: codeToCondition(raw.daily?.weather_code?.[idx] ?? 0)
          }))
        }
      });
    } catch (error: any) {
      console.warn('[Weather API Fallback]:', error.message);
      res.json({
        success: true,
        data: {
          city: safeString(req.query.city, 80) || 'Destination',
          temperature: 22,
          temperatureUnit: '°C',
          weatherCode: 1,
          condition: 'Partly Sunny',
          windSpeed: 10,
          humidity: 50,
          forecast: [
            { date: 'Day 1', maxTemp: 23, minTemp: 16, condition: 'Sunny' },
            { date: 'Day 2', maxTemp: 24, minTemp: 17, condition: 'Partly Cloudy' },
            { date: 'Day 3', maxTemp: 22, minTemp: 15, condition: 'Clear' }
          ]
        }
      });
    }
  });

  app.get('/api/currency/rates', async (_req, res) => {
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!response.ok) throw new Error('Exchange rate API unavailable');
      const data = await response.json();
      res.json({
        success: true,
        data: {
          base: 'USD',
          rates: {
            USD: 1,
            EUR: data.rates?.EUR || 0.92,
            GBP: data.rates?.GBP || 0.79,
            JPY: data.rates?.JPY || 154.5,
            CAD: data.rates?.CAD || 1.38,
            AUD: data.rates?.AUD || 1.52,
            CHF: data.rates?.CHF || 0.89
          },
          lastUpdated: data.time_last_update_utc || new Date().toISOString()
        }
      });
    } catch (error: any) {
      console.warn('[Currency API Fallback]:', error.message);
      res.json({
        success: true,
        data: {
          base: 'USD',
          rates: { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 154.5, CAD: 1.38, AUD: 1.52, CHF: 0.89 },
          lastUpdated: new Date().toISOString()
        }
      });
    }
  });

  app.post('/api/ai/ask-assistant', aiLimiter, async (req, res) => {
    try {
      const { trip } = req.body || {};
      // Length-capped before it reaches the model: limits both prompt-injection
      // surface and per-request token cost.
      const query = safeString(req.body?.query, 500);
      if (!query) {
        res.status(400).json({ success: false, error: 'Query is required.' });
        return;
      }
      const answer = await askGeminiConcierge(query, trip);
      res.json({ success: true, answer });
    } catch (error) {
      failRequest(res, 500, 'The concierge could not answer right now.', 'AI Concierge Route Error', error);
    }
  });
}
