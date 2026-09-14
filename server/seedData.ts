import type { CityTemplate, InterestCategory, BookingRecord } from '../src/types';

export interface PlaceSeed {
  id: string;
  city: string;
  country: string;
  title: string;
  category: InterestCategory;
  cost: number; // in USD per person
  description: string;
  durationMinutes: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  lat: number;
  lng: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  bookingType: 'Included' | 'Free' | 'Skip-the-line' | 'Reservation' | 'Optional Add-on';
  reasonTemplates: string[];
}

export const SEED_PLACES: PlaceSeed[] = [
  // PARIS
  {
    id: 'par-1',
    city: 'Paris',
    country: 'France',
    title: 'Louvre Masterpieces & Mona Lisa Tour',
    category: 'Museums & Culture',
    cost: 32,
    description: 'Explore the world’s largest art museum, home to the Mona Lisa, Venus de Milo, and Winged Victory.',
    durationMinutes: 180,
    timeOfDay: 'morning',
    lat: 48.8606,
    lng: 2.3376,
    rating: 4.9,
    reviewsCount: 14200,
    imageUrl: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=800&q=80',
    bookingType: 'Skip-the-line',
    reasonTemplates: [
      'Prioritized for your love of world-class art and museums without breaking your daily cultural allowance.',
      'A must-see Parisian highlight that matches your museum interest while maximizing early access hours.'
    ]
  },
  {
    id: 'par-2',
    city: 'Paris',
    country: 'France',
    title: 'Artisan Bistro Lunch in Le Marais',
    category: 'Food & Dining',
    cost: 38,
    description: 'Savor traditional French coq au vin, freshly baked baguette, and duck confit at a historic Marais bistro.',
    durationMinutes: 90,
    timeOfDay: 'afternoon',
    lat: 48.8575,
    lng: 2.3622,
    rating: 4.8,
    reviewsCount: 3100,
    imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
    bookingType: 'Reservation',
    reasonTemplates: [
      'Tailored to your food & dining passion, featuring authentic gourmet Parisian cuisine at great value.',
      'Curated to give you an authentic culinary immersion in the historic Marais quarter.'
    ]
  },
  {
    id: 'par-3',
    city: 'Paris',
    country: 'France',
    title: 'Montmartre Secret Alleyways & Sacré-Cœur Sunset',
    category: 'Photography & Views',
    cost: 0,
    description: 'Wander through cobblestone streets, vineyard slopes, street artist squares, and witness panoramic sunset views over Paris.',
    durationMinutes: 120,
    timeOfDay: 'evening',
    lat: 48.8867,
    lng: 2.3431,
    rating: 4.9,
    reviewsCount: 9800,
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    bookingType: 'Free',
    reasonTemplates: [
      'A 100% budget-friendly scenic experience delivering the most iconic golden hour skyline over Paris.',
      'Perfect match for your visual appreciation and photography passion with zero ticket expenditure.'
    ]
  },
  {
    id: 'par-4',
    city: 'Paris',
    country: 'France',
    title: 'Seine River Sunset Illuminations Cruise',
    category: 'Relaxation & Wellness',
    cost: 24,
    description: 'Glide past the Eiffel Tower, Notre-Dame, and illuminated bridges with glass-canopy comfort.',
    durationMinutes: 75,
    timeOfDay: 'night',
    lat: 48.8584,
    lng: 2.2945,
    rating: 4.7,
    reviewsCount: 8200,
    imageUrl: 'https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=800&q=80',
    bookingType: 'Included',
    reasonTemplates: [
      'Provides a relaxing, low-energy evening wind-down taking in Paris architectural monuments by night.',
      'Selected to balance your busy sightseeing day with a tranquil, panoramic river journey.'
    ]
  },
  {
    id: 'par-5',
    city: 'Paris',
    country: 'France',
    title: 'Latin Quarter Vintage Boutiques & Books',
    category: 'Shopping & Fashion',
    cost: 20,
    description: 'Browse legendary Shakespeare and Company, rare bookshops, perfume ateliers, and stylish boutiques.',
    durationMinutes: 120,
    timeOfDay: 'afternoon',
    lat: 48.8529,
    lng: 2.3470,
    rating: 4.8,
    reviewsCount: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
    bookingType: 'Free',
    reasonTemplates: [
      'Fulfills your shopping curiosity through quirky independent Parisian boutiques with flexible budget control.',
      'Recommended for unique vintage fashion finds and memorable Parisian literary culture.'
    ]
  },
  {
    id: 'par-6',
    city: 'Paris',
    country: 'France',
    title: 'Speakeasy Jazz Cellar in Saint-Germain',
    category: 'Nightlife & Bars',
    cost: 35,
    description: 'Listen to live bebop and French jazz inside a candlelit 16th-century stone cellar with signature craft cocktails.',
    durationMinutes: 150,
    timeOfDay: 'night',
    lat: 48.8530,
    lng: 2.3330,
    rating: 4.8,
    reviewsCount: 2200,
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    bookingType: 'Reservation',
    reasonTemplates: [
      'Recommended for your nightlife preferences, delivering classy Parisian ambiance without VIP club fees.',
      'An intimate musical night out that maximizes your entertainment budget in Saint-Germain.'
    ]
  },

  // TOKYO
  {
    id: 'tok-1',
    city: 'Tokyo',
    country: 'Japan',
    title: 'Senso-ji Temple & Asakusa Street Food Walk',
    category: 'History & Heritage',
    cost: 18,
    description: 'Tokyo’s oldest Buddhist temple, surrounded by bustling Nakamise street food stalls serving matcha melon pan and dango.',
    durationMinutes: 120,
    timeOfDay: 'morning',
    lat: 35.7148,
    lng: 139.7967,
    rating: 4.9,
    reviewsCount: 16500,
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    bookingType: 'Free',
    reasonTemplates: [
      'Combines rich Edo history with affordable authentic street food snacking in Tokyo’s most iconic shrine district.',
      'An essential heritage landmark that matches your cultural curiosity at minimal expense.'
    ]
  },
  {
    id: 'tok-2',
    city: 'Tokyo',
    country: 'Japan',
    title: 'teamLab Borderless Digital Art Museum',
    category: 'Museums & Culture',
    cost: 36,
    description: 'Immerse your senses in breathtaking interactive projection art, light crystal forests, and futuristic installations in Azabudai Hills.',
    durationMinutes: 150,
    timeOfDay: 'afternoon',
    lat: 35.6586,
    lng: 139.7454,
    rating: 4.9,
    reviewsCount: 11200,
    imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
    bookingType: 'Skip-the-line',
    reasonTemplates: [
      'Selected for top-tier digital art innovation, offering surreal visual interactions perfectly suited for photography.',
      'A modern cultural centerpiece in Tokyo with verified ticket allotment inside your daily entertainment budget.'
    ]
  },
  {
    id: 'tok-3',
    city: 'Tokyo',
    country: 'Japan',
    title: 'Shibuya Crossing & Omoide Yokocho Izakaya Dinner',
    category: 'Food & Dining',
    cost: 32,
    description: 'Cross the world’s busiest intersection and dive into nostalgic Memory Lane for sizzling yakitori and cold draft beer.',
    durationMinutes: 120,
    timeOfDay: 'evening',
    lat: 35.6595,
    lng: 139.7004,
    rating: 4.8,
    reviewsCount: 7900,
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
    bookingType: 'Included',
    reasonTemplates: [
      'A thrilling pairing of Tokyo’s neon epicenter with authentic, affordable culinary traditions.',
      'Satisfies your food craving in an electric, local atmosphere with great price-to-flavor ratio.'
    ]
  },
  {
    id: 'tok-4',
    city: 'Tokyo',
    country: 'Japan',
    title: 'Akihabara Tech & Vintage Anime Arcades',
    category: 'Adventure & Thrills',
    cost: 25,
    description: 'Explore retro gaming emporiums, multi-floor gachapon halls, collectibles, and cutting-edge VR arcades.',
    durationMinutes: 120,
    timeOfDay: 'afternoon',
    lat: 35.6983,
    lng: 139.7731,
    rating: 4.7,
    reviewsCount: 6400,
    imageUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80',
    bookingType: 'Free',
    reasonTemplates: [
      'A high-energy immersion into Japan’s modern pop and gaming subculture with customizable spending.',
      'Chosen for playful tech adventures aligned directly with your excitement preferences.'
    ]
  },
  {
    id: 'tok-5',
    city: 'Tokyo',
    country: 'Japan',
    title: 'Shinjuku Gyoen National Garden Walking Tour',
    category: 'Nature & Outdoors',
    cost: 5,
    description: 'Tranquil Japanese landscape gardens, historic tea houses, and sprawling lush lawns right in central Tokyo.',
    durationMinutes: 90,
    timeOfDay: 'morning',
    lat: 35.6852,
    lng: 139.7101,
    rating: 4.8,
    reviewsCount: 9100,
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    bookingType: 'Included',
    reasonTemplates: [
      'An ultra high-value peaceful escape into traditional Japanese landscape design.',
      'Gives you fresh outdoor greenery and serene morning meditation at just $5 entry.'
    ]
  },
  {
    id: 'tok-6',
    city: 'Tokyo',
    country: 'Japan',
    title: 'Roppongi High-Sky Observatory Night Deck',
    category: 'Nightlife & Bars',
    cost: 22,
    description: 'Marvel at Tokyo Tower glowing in neon beneath Tokyo City View 52nd floor glass observatory.',
    durationMinutes: 90,
    timeOfDay: 'night',
    lat: 35.6605,
    lng: 139.7292,
    rating: 4.8,
    reviewsCount: 5200,
    imageUrl: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80',
    bookingType: 'Reservation',
    reasonTemplates: [
      'Gives you panoramic night cityscape memories without expensive nightclub covers.',
      'Captures the luminous beauty of Tokyo by night within strict budget bounds.'
    ]
  },

  // ROME
  {
    id: 'rom-1',
    city: 'Rome',
    country: 'Italy',
    title: 'Colosseum & Roman Forum Gladiator Arena',
    category: 'History & Heritage',
    cost: 29,
    description: 'Walk in the footsteps of ancient gladiators and Roman emperors through the iconic Colosseum and Roman Forum.',
    durationMinutes: 180,
    timeOfDay: 'morning',
    lat: 41.8902,
    lng: 12.4922,
    rating: 4.9,
    reviewsCount: 22000,
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    bookingType: 'Skip-the-line',
    reasonTemplates: [
      'Essential historic bucket-list site selected with skip-the-line access to save precious daylight hours.',
      'A cornerstone antiquity tour matching your interest in rich European heritage.'
    ]
  },
  {
    id: 'rom-2',
    city: 'Rome',
    country: 'Italy',
    title: 'Handmade Carbonara & Cacio e Pepe in Trastevere',
    category: 'Food & Dining',
    cost: 28,
    description: 'Feast on freshly rolled pasta, Roman artichokes, and tiramisu in a family-run trattoria under ivy-covered pergolas.',
    durationMinutes: 90,
    timeOfDay: 'afternoon',
    lat: 41.8885,
    lng: 12.4690,
    rating: 4.9,
    reviewsCount: 6300,
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    bookingType: 'Reservation',
    reasonTemplates: [
      'Trastevere is Rome’s food soul; this handpicked spot offers authentic cuisine without tourist markups.',
      'Delivers an unmissable culinary highlight that stays comfortable within your daily food allocation.'
    ]
  },
  {
    id: 'rom-3',
    city: 'Rome',
    country: 'Italy',
    title: 'Pantheon & Piazza Navona Gelato Walk',
    category: 'Photography & Views',
    cost: 6,
    description: 'Gaze at the Pantheon’s ancient architectural dome and stroll past Bernini’s Four Rivers fountain with artisanal pistachio gelato.',
    durationMinutes: 90,
    timeOfDay: 'evening',
    lat: 41.8986,
    lng: 12.4769,
    rating: 4.9,
    reviewsCount: 15400,
    imageUrl: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=800&q=80',
    bookingType: 'Free',
    reasonTemplates: [
      'High-impact sightseeing with minimal spending, showcasing Rome’s most magnificent public architecture.',
      'Ideal evening stroll allowing relaxed social exploration and photography.'
    ]
  },
  {
    id: 'rom-4',
    city: 'Rome',
    country: 'Italy',
    title: 'Vatican Museums & Sistine Chapel Tour',
    category: 'Museums & Culture',
    cost: 38,
    description: 'Marvel at Michelangelo’s Sistine Chapel ceiling, Raphael’s Rooms, and centuries of papal art treasures.',
    durationMinutes: 180,
    timeOfDay: 'morning',
    lat: 41.9067,
    lng: 12.4547,
    rating: 4.9,
    reviewsCount: 18900,
    imageUrl: 'https://images.unsplash.com/photo-1548625361-195fe5787130?auto=format&fit=crop&w=800&q=80',
    bookingType: 'Skip-the-line',
    reasonTemplates: [
      'Unrivaled masterworks in art history that completely fulfill your museum and culture desires.',
      'Secured with early ticket tier to optimize crowd avoidance and itinerary pace.'
    ]
  },

  // NEW YORK CITY
  {
    id: 'nyc-1',
    city: 'New York City',
    country: 'USA',
    title: 'Central Park Bike & Bethesda Terrace Walk',
    category: 'Nature & Outdoors',
    cost: 22,
    description: 'Pedal around Bow Bridge, Strawberry Fields, and rowboat lake before lounging on the Great Lawn.',
    durationMinutes: 120,
    timeOfDay: 'morning',
    lat: 40.7829,
    lng: -73.9654,
    rating: 4.8,
    reviewsCount: 12000,
    imageUrl: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=800&q=80',
    bookingType: 'Included',
    reasonTemplates: [
      'A refreshing outdoor morning active ride in NYC’s grandest green oasis.',
      'Fits seamlessly into your budget while letting you soak in natural beauty in the heart of Manhattan.'
    ]
  },
  {
    id: 'nyc-2',
    city: 'New York City',
    country: 'USA',
    title: 'Metropolitan Museum of Art (The Met)',
    category: 'Museums & Culture',
    cost: 30,
    description: 'Spanning 5,000 years of global art, from Temple of Dendur to Impressionist galleries and rooftop sculpture.',
    durationMinutes: 180,
    timeOfDay: 'afternoon',
    lat: 40.7794,
    lng: -73.9632,
    rating: 4.9,
    reviewsCount: 21000,
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    bookingType: 'Skip-the-line',
    reasonTemplates: [
      'Ranked among the premier art institutions on Earth, ideal for deep artistic exploration.',
      'High-yield cultural experience that stays very cost-effective per hour of wonder.'
    ]
  },
  {
    id: 'nyc-3',
    city: 'New York City',
    country: 'USA',
    title: 'Brooklyn Bridge Walk & DUMBO Pizza Feast',
    category: 'Food & Dining',
    cost: 26,
    description: 'Walk across the historic suspension bridge, catch skyline views at Jane’s Carousel, and eat iconic coal-fired thin crust pizza.',
    durationMinutes: 120,
    timeOfDay: 'evening',
    lat: 40.7061,
    lng: -73.9969,
    rating: 4.9,
    reviewsCount: 16000,
    imageUrl: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=800&q=80',
    bookingType: 'Free',
    reasonTemplates: [
      'Iconic NYC cinematic vistas combined with world-famous affordable gourmet pizza slices.',
      'Matches your culinary and scenic interests at an unbeatable budget efficiency.'
    ]
  },
  {
    id: 'nyc-4',
    city: 'New York City',
    country: 'USA',
    title: 'Summit One Vanderbilt Skyline Observatory',
    category: 'Photography & Views',
    cost: 44,
    description: 'Mind-bending mirror rooms, Levitation glass skyboxes, and multi-sensory art overlooking the Empire State and Chrysler towers.',
    durationMinutes: 90,
    timeOfDay: 'night',
    lat: 40.7527,
    lng: -73.9772,
    rating: 4.8,
    reviewsCount: 8800,
    imageUrl: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=800&q=80',
    bookingType: 'Skip-the-line',
    reasonTemplates: [
      'Next-generation viewpoint offering unmatched photo angles and immersive modern thrill.',
      'Allocated in your trip budget for a singular unforgettable skyline finale.'
    ]
  },

  // BARCELONA
  {
    id: 'bcn-1',
    city: 'Barcelona',
    country: 'Spain',
    title: 'Sagrada Família Basilique & Tower Access',
    category: 'History & Heritage',
    cost: 36,
    description: 'Antoni Gaudí’s awe-inspiring architectural masterpiece with rainbow stained glass sunlight and forest stone pillars.',
    durationMinutes: 120,
    timeOfDay: 'morning',
    lat: 41.4036,
    lng: 2.1744,
    rating: 4.9,
    reviewsCount: 28000,
    imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
    bookingType: 'Skip-the-line',
    reasonTemplates: [
      'Catalonia’s crown architectural achievement, delivering staggering visual beauty.',
      'Essential itinerary centerpiece with reserved fast-track entry.'
    ]
  },
  {
    id: 'bcn-2',
    city: 'Barcelona',
    country: 'Spain',
    title: 'Mercat de la Boqueria Tapas & Sangria Crawl',
    category: 'Food & Dining',
    cost: 30,
    description: 'Taste Iberian jamón, sizzling garlic prawns, patatas bravas, and fresh squeezed fruit juices in lively stalls.',
    durationMinutes: 90,
    timeOfDay: 'afternoon',
    lat: 41.3817,
    lng: 2.1715,
    rating: 4.8,
    reviewsCount: 14000,
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    bookingType: 'Included',
    reasonTemplates: [
      'The ultimate Mediterranean gastronomic sensory experience with flexible budget grazing.',
      'Directly answers your food interest with the freshest authentic market flavors.'
    ]
  },
  {
    id: 'bcn-3',
    city: 'Barcelona',
    country: 'Spain',
    title: 'Park Güell Gaudí Mosaics & Sea Vistas',
    category: 'Photography & Views',
    cost: 15,
    description: 'Fanciful gingerbread gatehouses, serpentine mosaic benches, and panoramic Mediterranean vistas.',
    durationMinutes: 100,
    timeOfDay: 'evening',
    lat: 41.4145,
    lng: 2.1527,
    rating: 4.8,
    reviewsCount: 19000,
    imageUrl: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?auto=format&fit=crop&w=800&q=80',
    bookingType: 'Skip-the-line',
    reasonTemplates: [
      'Unites whimsical outdoor art with vibrant sunset colors over the Mediterranean sea.',
      'Incredible value per ticket to photograph Barcelona’s signature ceramic artwork.'
    ]
  },
  {
    id: 'bcn-4',
    city: 'Barcelona',
    country: 'Spain',
    title: 'Gothic Quarter Night Flamenco & El Born Bars',
    category: 'Nightlife & Bars',
    cost: 35,
    description: 'Passionate acoustic guitar and raw flamenco dancing in a 14th-century palace, followed by El Born vermouth bars.',
    durationMinutes: 120,
    timeOfDay: 'night',
    lat: 41.3833,
    lng: 2.1783,
    rating: 4.8,
    reviewsCount: 4800,
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    bookingType: 'Reservation',
    reasonTemplates: [
      'Authentic Spanish musical tradition in historic ambient surroundings.',
      'Chosen to spice up your evening with energetic Spanish culture.'
    ]
  },

  // BALI
  {
    id: 'bli-1',
    city: 'Bali',
    country: 'Indonesia',
    title: 'Tegalalang Rice Terraces & Jungle Swing',
    category: 'Nature & Outdoors',
    cost: 25,
    description: 'Trek emerald tiered rice paddies, cross bamboo bridges, and soar over tropical palm valleys on a giant jungle swing.',
    durationMinutes: 150,
    timeOfDay: 'morning',
    lat: -8.4319,
    lng: 115.2785,
    rating: 4.8,
    reviewsCount: 11500,
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    bookingType: 'Included',
    reasonTemplates: [
      'Signature lush Indonesian tropical landscape fulfilling your thirst for nature and adventure.',
      'High-octane photography and serene green hikes at very affordable Southeast Asian rates.'
    ]
  },
  {
    id: 'bli-2',
    city: 'Bali',
    country: 'Indonesia',
    title: 'Ubud Traditional Herbal Spa & Flower Bath',
    category: 'Relaxation & Wellness',
    cost: 35,
    description: 'Balinese deep tissue massage with warm frangipani oil, herbal body scrub, and petal-strewn relaxing bath overlooking the river.',
    durationMinutes: 120,
    timeOfDay: 'afternoon',
    lat: -8.5069,
    lng: 115.2625,
    rating: 4.9,
    reviewsCount: 5600,
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    bookingType: 'Reservation',
    reasonTemplates: [
      'True luxury relaxation at a fraction of Western resort prices.',
      'Custom-picked to rejuvenate your body and restore wellness in serene Ubud.'
    ]
  },
  {
    id: 'bli-3',
    city: 'Bali',
    country: 'Indonesia',
    title: 'Uluwatu Cliff Temple & Sunset Kecak Fire Dance',
    category: 'History & Heritage',
    cost: 20,
    description: 'Perched 70 meters above roaring Indian Ocean waves, watch hypnotic choir chanting and mythical fire performers at sunset.',
    durationMinutes: 120,
    timeOfDay: 'evening',
    lat: -8.8291,
    lng: 115.0849,
    rating: 4.9,
    reviewsCount: 13000,
    imageUrl: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
    bookingType: 'Included',
    reasonTemplates: [
      'Dramatic ocean cliff spectacle combined with ancient Balinese folklore.',
      'A top-rated evening spiritual and cultural performance.'
    ]
  }
];

export const CITY_TEMPLATES: CityTemplate[] = [
  {
    id: 'tmpl-tokyo',
    destination: 'Tokyo',
    country: 'Japan',
    title: 'Cyberpunk & Ancient Traditions',
    tagline: 'Neon arcades, tranquil gardens, ramen alleys, and digital art wonders.',
    duration: 5,
    baseBudget: 1650,
    travelers: 2,
    interests: ['Food & Dining', 'Museums & Culture', 'Adventure & Thrills', 'Shopping & Fashion'],
    coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=900&q=80',
    coordinates: { lat: 35.6762, lng: 139.6503 },
    highlights: ['teamLab Borderless Tickets', 'Asakusa Street Food', 'Shibuya Skyline', 'Shinjuku Gyoen Garden'],
    badges: ['Most Popular', 'Foodie Paradise']
  },
  {
    id: 'tmpl-paris',
    destination: 'Paris',
    country: 'France',
    title: 'Romantic Heritage & Culinary Haute',
    tagline: 'The Louvre, vintage Marais bistros, Seine golden cruises, and bohemian Montmartre.',
    duration: 4,
    baseBudget: 1450,
    travelers: 2,
    interests: ['Museums & Culture', 'Food & Dining', 'History & Heritage', 'Photography & Views'],
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80',
    coordinates: { lat: 48.8566, lng: 2.3522 },
    highlights: ['Mona Lisa VIP Entry', 'Seine River Cruise', 'Montmartre Secret Alleys', 'Jazz Speakeasy'],
    badges: ['Classic Wonder', 'Art & Romance']
  },
  {
    id: 'tmpl-rome',
    destination: 'Rome',
    country: 'Italy',
    title: 'Gladiators, Pasta & Eternal Grandeur',
    tagline: 'Ancient Colosseum arenas, Trastevere wine cellars, and Vatican frescoes.',
    duration: 4,
    baseBudget: 1300,
    travelers: 2,
    interests: ['History & Heritage', 'Food & Dining', 'Museums & Culture', 'Photography & Views'],
    coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80',
    coordinates: { lat: 41.9028, lng: 12.4964 },
    highlights: ['Colosseum Arena Floor', 'Handmade Carbonara', 'Pantheon Sunset', 'Vatican Sistine Chapel'],
    badges: ['Historic Bucketlist', 'Italian Feast']
  },
  {
    id: 'tmpl-barcelona',
    destination: 'Barcelona',
    country: 'Spain',
    title: 'Gaudí Dreams & Mediterranean Tapas',
    tagline: 'Sagrada Família spires, beachside paella, Boqueria market, and flamenco rhythms.',
    duration: 4,
    baseBudget: 1250,
    travelers: 2,
    interests: ['Food & Dining', 'History & Heritage', 'Nightlife & Bars', 'Photography & Views'],
    coverImage: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=900&q=80',
    coordinates: { lat: 41.3879, lng: 2.1699 },
    highlights: ['Sagrada Família', 'Boqueria Tapas Tasting', 'Park Güell Terraces', 'Gothic Quarter Night'],
    badges: ['Sunny Coastal', 'Great Nightlife']
  },
  {
    id: 'tmpl-nyc',
    destination: 'New York City',
    country: 'USA',
    title: 'Manhattan Skyline & Cultural Energy',
    tagline: 'Central Park bikes, Broadway magic, Brooklyn Bridge strolls, and world-class Met art.',
    duration: 4,
    baseBudget: 1800,
    travelers: 2,
    interests: ['Museums & Culture', 'Food & Dining', 'Shopping & Fashion', 'Photography & Views'],
    coverImage: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=900&q=80',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    highlights: ['The Met Galleries', 'Summit One Glass Box', 'DUMBO Skyline Pizza', 'Central Park Rowboats'],
    badges: ['Vibrant Metropolis', 'Broadway & Art']
  },
  {
    id: 'tmpl-bali',
    destination: 'Bali',
    country: 'Indonesia',
    title: 'Tropical Sanctuary & Emerald Terraces',
    tagline: 'Jungle valley swings, spiritual cliff temples, flower petal spas, and ocean sunsets.',
    duration: 5,
    baseBudget: 980,
    travelers: 2,
    interests: ['Nature & Outdoors', 'Relaxation & Wellness', 'Adventure & Thrills', 'History & Heritage'],
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80',
    coordinates: { lat: -8.4095, lng: 115.1889 },
    highlights: ['Ubud Rice Swing', 'Uluwatu Fire Dance', 'Herbal Flower Bath', 'Volcano Sunrise'],
    badges: ['Wellness Haven', 'High Value']
  }
];

export const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: 'bk-9481',
    tripId: 'trip-paris-exp',
    destination: 'Paris',
    tripTitle: 'Parisian Autumn Cultural Escape',
    confirmationCode: 'WWISE-7842',
    bookingDate: '2026-08-28',
    travelDates: 'Oct 14 - Oct 18, 2026',
    travelers: 2,
    duration: 4,
    totalPaid: 1545.50,
    breakdown: {
      accommodation: 720,
      activities: 380,
      transportation: 190,
      foodAndMisc: 160,
      taxesAndService: 95.50,
      totalProjected: 1545.50
    },
    paymentDetails: {
      cardholderName: 'Kaushik Surampudi',
      cardBrand: 'Visa',
      last4: '4242',
      billingEmail: 'saikaushiksurampudi@gmail.com'
    },
    status: 'confirmed',
    itemsBookedCount: 8,
    accommodationName: 'Le Grand Marais Boutique Hotel (4★ Deluxe)',
    activitiesSummary: [
      'Louvre Masterpieces & Mona Lisa Tour (Skip-the-line)',
      'Seine River Sunset Illuminations Cruise',
      'Artisan Bistro Gastronomic Dinner',
      'Montmartre Secret Alleys Tour'
    ]
  }
];
