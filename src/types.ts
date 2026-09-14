export type InterestCategory =
  | 'Food & Dining'
  | 'Museums & Culture'
  | 'Nature & Outdoors'
  | 'Nightlife & Bars'
  | 'Shopping & Fashion'
  | 'Adventure & Thrills'
  | 'Sports & Activities'
  | 'Family & Kids'
  | 'Relaxation & Wellness'
  | 'History & Heritage'
  | 'Photography & Views';

export type AccommodationType = 'Boutique Hotel' | 'Luxury Resort' | 'Budget Hostel' | 'Charming Apartment';
export type TravelPace = 'relaxed' | 'balanced' | 'packed';

export interface TripFormData {
  destination: string;
  startDate: string;
  endDate?: string;
  duration: number; // in days
  budget: number; // total budget in USD
  travelers: number;
  interests: InterestCategory[];
  accommodationType: AccommodationType;
  travelPace: TravelPace;
}

export interface ActivityItem {
  id: string;
  day: number;
  timeSlot: string; // e.g. "09:00 AM - 11:30 AM"
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  title: string;
  category: InterestCategory;
  cost: number; // cost per person
  totalCost: number; // cost * travelers
  description: string;
  reason: string; // AI personalized explanation for why it matches interest & budget
  location: {
    name: string;
    lat: number;
    lng: number;
    address?: string;
  };
  durationMinutes: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  bookingType: 'Included' | 'Free' | 'Skip-the-line' | 'Reservation' | 'Optional Add-on';
  isSaved?: boolean;
}

export interface AccommodationSuggestion {
  id: string;
  name: string;
  type: AccommodationType;
  costPerNight: number;
  totalCost: number;
  rating: number;
  address: string;
  lat: number;
  lng: number;
  imageUrl: string;
  perks: string[];
  bookingStatus: 'available' | 'reserved' | 'mock-booked';
}

export interface TransportationOption {
  id: string;
  type: 'Flight' | 'High-Speed Train' | 'Airport Express' | 'City Metro Pass' | 'Private Transfer' | 'Rental Car';
  title: string;
  cost: number;
  details: string;
  co2Estimate?: string;
  bookingStatus: 'available' | 'reserved' | 'mock-booked';
}

export interface DayPlan {
  day: number;
  date: string;
  theme: string;
  dailyProjectedCost: number;
  activities: ActivityItem[];
}

export interface TripCostBreakdown {
  accommodation: number;
  activities: number;
  transportation: number;
  foodAndMisc: number;
  taxesAndService: number;
  totalProjected: number;
}

export interface TripPlan {
  id: string;
  title: string;
  destination: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  startDate: string;
  duration: number;
  travelers: number;
  totalBudget: number;
  costs: TripCostBreakdown;
  remainingBudget: number;
  status: 'draft' | 'booked' | 'saved';
  interests: InterestCategory[];
  days: DayPlan[];
  accommodation: AccommodationSuggestion;
  transportation: TransportationOption[];
  aiInsights: {
    vibeSummary: string;
    budgetAdvice: string;
    localHacks: string[];
    packingEssentials: string[];
    savingsEstimated: number;
  };
  createdAt: string;
}

export interface CityTemplate {
  id: string;
  destination: string;
  country: string;
  title: string;
  tagline: string;
  duration: number;
  baseBudget: number;
  travelers: number;
  interests: InterestCategory[];
  coverImage: string;
  coordinates: { lat: number; lng: number };
  highlights: string[];
  badges: string[];
}

export interface BookingRecord {
  id: string;
  tripId: string;
  destination: string;
  tripTitle: string;
  confirmationCode: string;
  bookingDate: string;
  travelDates: string;
  travelers: number;
  duration: number;
  totalPaid: number;
  breakdown: TripCostBreakdown;
  paymentDetails: {
    cardholderName: string;
    cardBrand: string;
    last4: string;
    billingEmail: string;
  };
  status: 'confirmed' | 'completed' | 'cancelled';
  itemsBookedCount: number;
  accommodationName: string;
  activitiesSummary: string[];
  itinerarySnapshot?: TripPlan;
}

export interface SavedPlace {
  id: string;
  title: string;
  category: InterestCategory;
  city: string;
  cost: number;
  rating: number;
  reason: string;
  imageUrl: string;
  lat: number;
  lng: number;
  addedAt: string;
}

export interface DestinationWeather {
  city: string;
  temperature: number;
  temperatureUnit: string;
  weatherCode: number;
  condition: string;
  windSpeed: number;
  humidity?: number;
  forecast: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    condition: string;
  }>;
}

export interface CurrencyRates {
  base: string;
  rates: Record<string, number>;
  lastUpdated: string;
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  billingAddress: string;
  city: string;
  zipCode: string;
  agreeTerms: boolean;
}
