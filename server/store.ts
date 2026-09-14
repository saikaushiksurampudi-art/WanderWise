import type { BookingRecord, SavedPlace } from '../src/types';
import { INITIAL_BOOKINGS } from './seedData.js';

export const bookingsStore: BookingRecord[] = [...INITIAL_BOOKINGS];

export const savedPlacesStore: SavedPlace[] = [
  {
    id: 'par-1',
    title: 'Louvre Masterpieces & Mona Lisa Tour',
    category: 'Museums & Culture',
    city: 'Paris',
    cost: 32,
    rating: 4.9,
    reason: 'World’s greatest art collection, iconic Mona Lisa, and glass pyramid.',
    imageUrl: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=800&q=80',
    lat: 48.8606,
    lng: 2.3376,
    addedAt: '2026-08-29T10:00:00.000Z'
  },
  {
    id: 'tok-2',
    title: 'teamLab Borderless Digital Art Museum',
    category: 'Museums & Culture',
    city: 'Tokyo',
    cost: 36,
    rating: 4.9,
    reason: 'Breathtaking 3D digital art and interactive light crystal rooms.',
    imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
    lat: 35.6586,
    lng: 139.7454,
    addedAt: '2026-08-29T11:30:00.000Z'
  }
];
