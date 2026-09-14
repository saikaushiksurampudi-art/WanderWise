import { GoogleGenAI } from '@google/genai';
import type { TripFormData, TripPlan, DayPlan, ActivityItem, AccommodationSuggestion, TransportationOption, InterestCategory } from '../src/types';
import { SEED_PLACES } from './seedData.js';

let geminiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return geminiClient;
}

/**
 * Execute Gemini model generation with retry and multi-model fallback
 * to handle temporary 503 high-demand spikes gracefully.
 */
async function generateWithModelFallback(
  ai: GoogleGenAI,
  prompt: string,
  responseSchemaJson: boolean = false
): Promise<string> {
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-flash-lite'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: responseSchemaJson
          ? { responseMimeType: 'application/json' }
          : undefined
      });

      if (response.text && response.text.trim().length > 0) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      const isHighDemand = err?.status === 503 || String(err?.message || '').includes('503') || String(err?.message || '').includes('high demand');
      if (isHighDemand) {
        // Fast-fail to next model immediately without blocking delay
        continue;
      }
      // For other transient errors, wait briefly before next attempt
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  throw lastError || new Error('Unable to retrieve response from Gemini models.');
}

// Fallback generator when Gemini API is offline or not configured
export function generateSmartRuleBasedItinerary(formData: TripFormData): TripPlan {
  const tripId = `trip-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const {
    destination,
    budget,
    duration = 3,
    travelers = 2,
    interests = ['Food & Dining', 'Museums & Culture'],
    accommodationType = 'Boutique Hotel',
    startDate = new Date().toISOString().split('T')[0]
  } = formData;

  // 1. Budget Allocation Strategy
  // Budget Breakdown: Accommodation ~40%, Activities ~30%, Transportation ~15%, Dining & Misc ~15%
  const targetAccTotal = Math.round(budget * 0.40);
  const targetActTotal = Math.round(budget * 0.30);
  const targetTransTotal = Math.round(budget * 0.15);
  const targetFoodAndMisc = Math.round(budget * 0.15);

  const costPerNight = Math.max(45, Math.round(targetAccTotal / duration));
  const actualAccTotal = costPerNight * duration;

  // City matching or generic fallback coordinates
  const cityMatch = SEED_PLACES.filter(p => p.city.toLowerCase() === destination.toLowerCase() || destination.toLowerCase().includes(p.city.toLowerCase()));
  
  let centerLat = 48.8566;
  let centerLng = 2.3522;
  let countryName = 'Global';

  if (cityMatch.length > 0) {
    centerLat = cityMatch[0].lat;
    centerLng = cityMatch[0].lng;
    countryName = cityMatch[0].country;
  } else if (destination.toLowerCase().includes('tokyo') || destination.toLowerCase().includes('japan')) {
    centerLat = 35.6762; centerLng = 139.6503; countryName = 'Japan';
  } else if (destination.toLowerCase().includes('rome') || destination.toLowerCase().includes('italy')) {
    centerLat = 41.9028; centerLng = 12.4964; countryName = 'Italy';
  } else if (destination.toLowerCase().includes('new york') || destination.toLowerCase().includes('nyc')) {
    centerLat = 40.7128; centerLng = -74.0060; countryName = 'USA';
  } else if (destination.toLowerCase().includes('barcelona') || destination.toLowerCase().includes('spain')) {
    centerLat = 41.3879; centerLng = 2.1699; countryName = 'Spain';
  } else if (destination.toLowerCase().includes('bali') || destination.toLowerCase().includes('indonesia')) {
    centerLat = -8.4095; centerLng = 115.1889; countryName = 'Indonesia';
  } else if (destination.toLowerCase().includes('london') || destination.toLowerCase().includes('uk')) {
    centerLat = 51.5074; centerLng = -0.1278; countryName = 'United Kingdom';
  }

  // Activity Candidates pool
  const candidatePool = cityMatch.length >= 4 
    ? cityMatch 
    : SEED_PLACES; // pool fallback with dynamic titling

  const days: DayPlan[] = [];
  let totalActivitiesCost = 0;
  let activityIdCounter = 1;

  const timeslots = [
    { slot: '09:30 AM - 12:30 PM', tod: 'morning' as const },
    { slot: '01:00 PM - 03:00 PM', tod: 'afternoon' as const },
    { slot: '03:30 PM - 05:30 PM', tod: 'afternoon' as const },
    { slot: '07:30 PM - 10:00 PM', tod: 'night' as const }
  ];

  const interestPicks = interests.length > 0 ? interests : ['Food & Dining', 'Museums & Culture', 'Photography & Views'] as InterestCategory[];

  for (let d = 1; d <= duration; d++) {
    const dayDate = new Date(new Date(startDate).getTime() + (d - 1) * 86400000).toISOString().split('T')[0];
    const dayThemeInterest = interestPicks[(d - 1) % interestPicks.length];
    const dayActivities: ActivityItem[] = [];
    let dayCost = 0;

    // Pick 2-3 activities per day
    const actsPerDay = formData.travelPace === 'packed' ? 4 : formData.travelPace === 'relaxed' ? 2 : 3;

    for (let a = 0; a < actsPerDay; a++) {
      const timeInfo = timeslots[a % timeslots.length];
      const targetCategory = a === 1 ? 'Food & Dining' : interestPicks[(d + a) % interestPicks.length];

      // Find best match in candidate pool
      const matchingPlace = candidatePool.find(p => p.category === targetCategory) || candidatePool[(d * 2 + a) % candidatePool.length];

      const basePerPerson = matchingPlace ? matchingPlace.cost : Math.round(15 + Math.random() * 25);
      const totalCostGroup = basePerPerson * travelers;

      // Adjust coordinates slightly per activity around center
      const latOffset = (Math.sin(d + a * 1.5) * 0.025);
      const lngOffset = (Math.cos(d + a * 1.5) * 0.035);

      const title = cityMatch.length >= 4 
        ? matchingPlace.title 
        : `${destination} ${matchingPlace ? matchingPlace.title.split(' in ')[0] : targetCategory} Experience`;

      const reason = `Handpicked for your '${targetCategory}' passion. Stays within your ~$${Math.round(budget / duration)} daily target for ${travelers} traveler(s).`;

      const actItem: ActivityItem = {
        id: `${tripId}-act-${d}-${activityIdCounter++}`,
        day: d,
        timeSlot: timeInfo.slot,
        timeOfDay: timeInfo.tod,
        title,
        category: targetCategory,
        cost: basePerPerson,
        totalCost: totalCostGroup,
        description: matchingPlace ? matchingPlace.description : `Discover authentic ${targetCategory.toLowerCase()} traditions, local favorites, and top-rated spots in ${destination}.`,
        reason,
        location: {
          name: `${title}, ${destination}`,
          lat: (matchingPlace ? matchingPlace.lat : centerLat) + latOffset,
          lng: (matchingPlace ? matchingPlace.lng : centerLng) + lngOffset,
          address: `Central District, ${destination}`
        },
        durationMinutes: matchingPlace ? matchingPlace.durationMinutes : 120,
        rating: matchingPlace ? matchingPlace.rating : 4.8,
        reviewsCount: matchingPlace ? matchingPlace.reviewsCount : 1240,
        imageUrl: matchingPlace ? matchingPlace.imageUrl : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
        bookingType: matchingPlace ? matchingPlace.bookingType : (basePerPerson === 0 ? 'Free' : 'Skip-the-line')
      };

      dayActivities.push(actItem);
      dayCost += totalCostGroup;
      totalActivitiesCost += totalCostGroup;
    }

    days.push({
      day: d,
      date: dayDate,
      theme: `Day ${d}: ${dayThemeInterest} & Local Exploration`,
      dailyProjectedCost: dayCost,
      activities: dayActivities
    });
  }

  // Accommodation
  const accommodation: AccommodationSuggestion = {
    id: `acc-${Date.now()}`,
    name: `${destination} Grand ${accommodationType}`,
    type: accommodationType,
    costPerNight,
    totalCost: actualAccTotal,
    rating: 4.85,
    address: `Historic Central Avenue, ${destination}`,
    lat: centerLat + 0.005,
    lng: centerLng + 0.005,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    perks: ['High-speed Wi-Fi', 'Breakfast Buffet Included', 'Central Metro Access', 'Free Cancellation up to 48h'],
    bookingStatus: 'available'
  };

  // Transportation
  const transportation: TransportationOption[] = [
    {
      id: `trans-1`,
      type: 'City Metro Pass',
      title: `${duration}-Day Unlimited City Transit Pass`,
      cost: Math.min(60 * travelers, Math.round(targetTransTotal * 0.4)),
      details: `Unlimited rides across all subways, trams, and central buses in ${destination} for ${travelers} traveler(s).`,
      co2Estimate: '85% lower carbon footprint than private taxis',
      bookingStatus: 'available'
    },
    {
      id: `trans-2`,
      type: 'Airport Express',
      title: 'Direct Airport High-Speed Rail & Hotel Transfer',
      cost: Math.min(50 * travelers, Math.round(targetTransTotal * 0.6)),
      details: `Door-to-door express connection from international terminal to ${destination} city center.`,
      bookingStatus: 'available'
    }
  ];

  const totalTransCost = transportation.reduce((acc, t) => acc + t.cost, 0);
  const totalFoodMisc = Math.round(targetFoodAndMisc);
  const totalProjected = actualAccTotal + totalActivitiesCost + totalTransCost + totalFoodMisc;
  const remainingBudget = Math.max(0, budget - totalProjected);

  return {
    id: tripId,
    title: `${duration}-Day ${destination} Discovery`,
    destination,
    country: countryName,
    coordinates: { lat: centerLat, lng: centerLng },
    startDate,
    duration,
    travelers,
    totalBudget: budget,
    costs: {
      accommodation: actualAccTotal,
      activities: totalActivitiesCost,
      transportation: totalTransCost,
      foodAndMisc: totalFoodMisc,
      taxesAndService: Math.round(totalProjected * 0.06),
      totalProjected: Math.round(totalProjected * 1.06)
    },
    remainingBudget: Math.max(0, budget - Math.round(totalProjected * 1.06)),
    status: 'draft',
    interests,
    days,
    accommodation,
    transportation,
    aiInsights: {
      vibeSummary: `An unforgettable ${duration}-day journey in ${destination} blending ${interests.slice(0, 3).join(', ')} with optimal budget balance.`,
      budgetAdvice: `We preserved $${remainingBudget} as a comfort buffer. Booking tickets in advance locks in discounted group rates!`,
      localHacks: [
        `Use the ${destination} contactless transit card during non-peak hours to save up to 25%.`,
        `Book museum time-slots in the early morning (before 10:30 AM) to skip the long queues.`,
        `Ask for the 'Dish of the Day' (Plat du Jour / Menú del Día) for premium dining quality at 40% off standard dinner menus.`
      ],
      packingEssentials: [
        'Universal power adapter with surge protection',
        'Comfortable walking shoes (averaging 12,000+ daily steps)',
        'Compact weather-resistant daypack and reusable water bottle'
      ],
      savingsEstimated: Math.round(budget * 0.18)
    },
    createdAt: new Date().toISOString()
  };
}

// AI Gemini Generator with Structured JSON
export async function generateGeminiItinerary(formData: TripFormData): Promise<TripPlan> {
  const ai = getGeminiClient();
  if (!ai) {
    console.log('[Gemini API] GEMINI_API_KEY is not configured. Using deterministic high-fidelity optimization solver.');
    return generateSmartRuleBasedItinerary(formData);
  }

  const prompt = `You are WanderWise AI, an expert budget-optimizing travel architect.
Create a comprehensive, realistic, and personalized travel itinerary for:
- Destination: ${formData.destination}
- Duration: ${formData.duration} days
- Total Budget: $${formData.budget} USD (Hard constraint: Total Projected Trip Cost MUST stay <= $${formData.budget})
- Number of Travelers: ${formData.travelers}
- Start Date: ${formData.startDate}
- Interests: ${formData.interests.join(', ')}
- Accommodation Type: ${formData.accommodationType}
- Travel Pace: ${formData.travelPace}

Return ONLY valid JSON adhering strictly to this schema:
{
  "title": "string",
  "country": "string",
  "coordinates": { "lat": number, "lng": number },
  "vibeSummary": "string (engaging 2-3 sentence overview)",
  "budgetAdvice": "string",
  "localHacks": ["string", "string", "string"],
  "packingEssentials": ["string", "string", "string"],
  "accommodation": {
    "name": "string",
    "costPerNight": number,
    "rating": number,
    "address": "string",
    "perks": ["string", "string", "string"]
  },
  "transportation": [
    {
      "type": "Flight" | "High-Speed Train" | "City Metro Pass" | "Airport Express" | "Private Transfer",
      "title": "string",
      "cost": number,
      "details": "string"
    }
  ],
  "days": [
    {
      "day": number,
      "theme": "string",
      "activities": [
        {
          "timeSlot": "09:00 AM - 11:30 AM" | "01:00 PM - 03:30 PM" | "07:00 PM - 09:30 PM",
          "timeOfDay": "morning" | "afternoon" | "evening" | "night",
          "title": "string",
          "category": "string (one of: ${formData.interests.join(', ')})",
          "costPerPerson": number,
          "description": "string",
          "reason": "string (Why WanderWise picked this for the user's specific interest & budget)",
          "locationName": "string",
          "latOffset": number (between -0.05 and 0.05),
          "lngOffset": number (between -0.05 and 0.05),
          "durationMinutes": number,
          "rating": number,
          "bookingType": "Skip-the-line" | "Free" | "Included" | "Reservation"
        }
      ]
    }
  ]
}`;

  try {
    const text = await generateWithModelFallback(ai, prompt, true);

    const parsed = JSON.parse(text);
    const tripId = `trip-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const duration = formData.duration;
    const travelers = formData.travelers;
    const baseLat = parsed.coordinates?.lat || 48.8566;
    const baseLng = parsed.coordinates?.lng || 2.3522;

    let totalActivitiesCost = 0;
    let actCounter = 1;

    const days: DayPlan[] = (parsed.days || []).map((d: any, idx: number) => {
      const dayNum = idx + 1;
      const dayDate = new Date(new Date(formData.startDate).getTime() + idx * 86400000).toISOString().split('T')[0];
      let dayCost = 0;

      const activities: ActivityItem[] = (d.activities || []).map((act: any) => {
        const costPerPerson = Number(act.costPerPerson) || 0;
        const totalActCost = costPerPerson * travelers;
        dayCost += totalActCost;
        totalActivitiesCost += totalActCost;

        return {
          id: `${tripId}-act-${dayNum}-${actCounter++}`,
          day: dayNum,
          timeSlot: act.timeSlot || '10:00 AM - 12:00 PM',
          timeOfDay: act.timeOfDay || 'morning',
          title: act.title || 'Sightseeing Tour',
          category: (act.category as InterestCategory) || 'Museums & Culture',
          cost: costPerPerson,
          totalCost: totalActCost,
          description: act.description || 'Iconic travel experience.',
          reason: act.reason || `Chosen specifically for your interest in ${act.category || 'culture'}.`,
          location: {
            name: act.locationName || `${act.title}, ${formData.destination}`,
            lat: baseLat + (Number(act.latOffset) || 0),
            lng: baseLng + (Number(act.lngOffset) || 0),
            address: `${formData.destination} Central Area`
          },
          durationMinutes: Number(act.durationMinutes) || 120,
          rating: Number(act.rating) || 4.8,
          reviewsCount: Math.round(800 + Math.random() * 5000),
          imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
          bookingType: act.bookingType || (costPerPerson === 0 ? 'Free' : 'Skip-the-line')
        };
      });

      return {
        day: dayNum,
        date: dayDate,
        theme: d.theme || `Day ${dayNum} Exploration`,
        dailyProjectedCost: dayCost,
        activities
      };
    });

    const accCostPerNight = Number(parsed.accommodation?.costPerNight) || Math.round((formData.budget * 0.35) / duration);
    const accTotal = accCostPerNight * duration;

    const accommodation: AccommodationSuggestion = {
      id: `acc-${Date.now()}`,
      name: parsed.accommodation?.name || `${formData.destination} Boutique Suites`,
      type: formData.accommodationType,
      costPerNight: accCostPerNight,
      totalCost: accTotal,
      rating: Number(parsed.accommodation?.rating) || 4.85,
      address: parsed.accommodation?.address || `Central District, ${formData.destination}`,
      lat: baseLat + 0.004,
      lng: baseLng + 0.004,
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      perks: parsed.accommodation?.perks || ['Free Breakfast', 'Metro Access', 'Free Cancellation'],
      bookingStatus: 'available'
    };

    const transportation: TransportationOption[] = (parsed.transportation || []).map((t: any, i: number) => ({
      id: `trans-${i + 1}`,
      type: t.type || 'City Metro Pass',
      title: t.title || `${formData.destination} Transit Pass`,
      cost: Number(t.cost) || Math.round(30 * travelers),
      details: t.details || 'All-access public transit.',
      bookingStatus: 'available'
    }));

    const totalTransCost = transportation.reduce((sum, t) => sum + t.cost, 0);
    const totalFoodMisc = Math.round(formData.budget * 0.15);
    const subtotal = accTotal + totalActivitiesCost + totalTransCost + totalFoodMisc;
    const taxes = Math.round(subtotal * 0.06);
    const totalProjected = subtotal + taxes;
    const remainingBudget = Math.max(0, formData.budget - totalProjected);

    return {
      id: tripId,
      title: parsed.title || `${duration}-Day ${formData.destination} Experience`,
      destination: formData.destination,
      country: parsed.country || 'Global',
      coordinates: { lat: baseLat, lng: baseLng },
      startDate: formData.startDate,
      duration,
      travelers,
      totalBudget: formData.budget,
      costs: {
        accommodation: accTotal,
        activities: totalActivitiesCost,
        transportation: totalTransCost,
        foodAndMisc: totalFoodMisc,
        taxesAndService: taxes,
        totalProjected
      },
      remainingBudget,
      status: 'draft',
      interests: formData.interests,
      days,
      accommodation,
      transportation,
      aiInsights: {
        vibeSummary: parsed.vibeSummary || `A bespoke ${duration}-day journey tailored to your interests.`,
        budgetAdvice: parsed.budgetAdvice || `Your itinerary leaves $${remainingBudget} in reserve.`,
        localHacks: parsed.localHacks || ['Book slots early morning to skip lines.', 'Use local transit pass.'],
        packingEssentials: parsed.packingEssentials || ['Comfortable walking shoes', 'Universal adapter'],
        savingsEstimated: Math.round(formData.budget * 0.15)
      },
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('[Gemini API Fallback] Operating with deterministic optimization solver:', error);
    return generateSmartRuleBasedItinerary(formData);
  }
}

/**
 * AI Concierge responder with multi-model fallback and high-quality local travel tips
 */
export async function askGeminiConcierge(query: string, trip?: any): Promise<string> {
  const destination = trip?.destination || 'your destination';
  const budget = trip?.totalBudget || 1500;
  const travelers = trip?.travelers || 2;

  const defaultAdvice = `Here are expert travel tips for your trip to **${destination}**:

• **Best Timing & Crowds**: Visit major museums and landmark viewpoints early in the morning (around 9:00 AM) or late afternoon during golden hour for minimum queues and stunning lighting.
• **Local Dining Hack**: Look for local neighborhood bistros with daily chalkboard specials (*Plat du jour* / *Menú del día*) to enjoy chef-crafted dining at 30-40% lower cost than tourist menus.
• **Transit Savings**: Pick up a multi-day rechargeable city transit pass to travel across subway and bus lines smoothly within your ~$${budget} budget.`;

  const ai = getGeminiClient();
  if (!ai) {
    return defaultAdvice;
  }

  const prompt = `You are the WanderWise AI Concierge.
The traveler is planning a trip to ${destination} with a total budget of $${budget} for ${travelers} travelers.
User question: "${query}"
Provide a helpful, friendly, budget-savvy response in 2-3 concise paragraphs with bullet points if recommending spots or hacks. Keep it realistic, inspiring, and actionable.`;

  try {
    const responseText = await generateWithModelFallback(ai, prompt, false);
    return responseText;
  } catch (err) {
    console.warn('[Gemini Concierge API Fallback]:', err);
    return defaultAdvice;
  }
}
