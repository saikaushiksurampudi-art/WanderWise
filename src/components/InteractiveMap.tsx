import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L, { LatLngBoundsExpression, LatLngTuple } from 'leaflet';
import { ActivityItem, AccommodationSuggestion, InterestCategory, TripPlan } from '../types';
import { Navigation, Map as MapIcon, ZoomIn, ZoomOut, Satellite } from 'lucide-react';

interface InteractiveMapProps {
  trip: TripPlan;
  activeDay: number | 'all';
  onSelectActivity?: (activity: ActivityItem) => void;
}

const getCategoryColor = (cat: InterestCategory) => {
  switch (cat) {
    case 'Food & Dining':
      return '#f97316';
    case 'Museums & Culture':
    case 'History & Heritage':
      return '#6366f1';
    case 'Nature & Outdoors':
      return '#10b981';
    case 'Nightlife & Bars':
      return '#ec4899';
    case 'Shopping & Fashion':
      return '#8b5cf6';
    case 'Adventure & Thrills':
    case 'Sports & Activities':
      return '#ef4444';
    case 'Photography & Views':
      return '#06b6d4';
    default:
      return '#3b82f6';
  }
};

const DAY_ROUTE_COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

/** Leaflet's divIcon takes a raw HTML string, so anything interpolated in is escaped first. */
function escapeHtml(value: string | number) {
  return String(value).replace(/[&<>"']/g, ch => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch] as string
  ));
}

function pinIcon(rawColor: string, rawLabel: string | number, size = 32) {
  const color = escapeHtml(rawColor);
  const label = escapeHtml(rawLabel);
  const h = Math.round(size * 1.28);
  return L.divIcon({
    className: '',
    html: `
      <div style="width:${size}px;height:${h}px;filter:drop-shadow(0 3px 4px rgba(0,0,0,0.45))">
        <svg width="${size}" height="${h}" viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 1.5C7.5 1.5 2 7.3 2 14.5C2 24 15 36.5 15 36.5S28 24 28 14.5C28 7.3 22.5 1.5 15 1.5Z" fill="${color}" stroke="#ffffff" stroke-width="1.8"/>
          <circle cx="15" cy="14.5" r="9.5" fill="rgba(255,255,255,0.16)"/>
          <text x="15" y="18.5" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700" font-family="system-ui,sans-serif">${label}</text>
        </svg>
      </div>`,
    iconSize: [size, h],
    iconAnchor: [size / 2, h],
    popupAnchor: [0, -h]
  });
}

const hotelIcon = pinIcon('#4f46e5', '🏨', 34);

function FitBounds({ bounds }: { bounds: LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    if (Array.isArray(bounds) && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 15 });
    }
  }, [bounds, map]);
  return null;
}

function MapControls({
  mapTheme,
  setMapTheme
}: {
  mapTheme: 'streets' | 'satellite';
  setMapTheme: (t: 'streets' | 'satellite') => void;
}) {
  const map = useMap();
  return (
    <div className="absolute top-3.5 right-3.5 z-[1000] flex items-center gap-1.5">
      <div className="flex bg-slate-950/85 backdrop-blur-md p-1 rounded-2xl border border-white/10">
        <button
          type="button"
          onClick={() => setMapTheme('streets')}
          className={`p-1.5 rounded-xl text-xs transition-colors ${mapTheme === 'streets' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          title="Street map"
        >
          <MapIcon className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setMapTheme('satellite')}
          className={`p-1.5 rounded-xl text-xs transition-colors ${mapTheme === 'satellite' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          title="Satellite imagery"
        >
          <Satellite className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex bg-slate-950/85 backdrop-blur-md p-1 rounded-2xl border border-white/10">
        <button
          type="button"
          onClick={() => map.zoomIn()}
          className="p-1.5 text-slate-300 hover:text-white rounded-xl hover:bg-white/10"
          title="Zoom in"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => map.zoomOut()}
          className="p-1.5 text-slate-300 hover:text-white rounded-xl hover:bg-white/10"
          title="Zoom out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  trip,
  activeDay,
  onSelectActivity
}) => {
  const [selectedPin, setSelectedPin] = useState<ActivityItem | AccommodationSuggestion | null>(null);
  const [mapTheme, setMapTheme] = useState<'streets' | 'satellite'>('streets');

  const points = useMemo(() => {
    const list: Array<{ item: ActivityItem; day: number; index: number }> = [];
    trip.days.forEach(d => {
      if (activeDay === 'all' || activeDay === d.day) {
        d.activities.forEach((act, idx) => {
          list.push({ item: act, day: d.day, index: idx + 1 });
        });
      }
    });
    return list;
  }, [trip, activeDay]);

  const bounds = useMemo<LatLngBoundsExpression>(() => {
    const coords: LatLngTuple[] = points.map(p => [p.item.location.lat, p.item.location.lng] as LatLngTuple);
    coords.push([trip.accommodation.lat, trip.accommodation.lng]);
    coords.push([trip.coordinates.lat, trip.coordinates.lng]);
    return coords;
  }, [points, trip]);

  const routePaths = useMemo(() => {
    const daysToDraw = activeDay === 'all' ? Array.from(new Set(points.map(p => p.day))) : [activeDay];
    return daysToDraw
      .map(dayNum => {
        const dayPoints = points.filter(p => p.day === dayNum);
        if (dayPoints.length < 2) return null;
        return {
          day: dayNum,
          positions: dayPoints.map(p => [p.item.location.lat, p.item.location.lng] as LatLngTuple),
          color: DAY_ROUTE_COLORS[(dayNum - 1) % DAY_ROUTE_COLORS.length]
        };
      })
      .filter((r): r is { day: number; positions: LatLngTuple[]; color: string } => r !== null);
  }, [points, activeDay]);

  const tileUrl =
    mapTheme === 'streets'
      ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

  const tileAttribution =
    mapTheme === 'streets'
      ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      : 'Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics';

  return (
    <div id="interactive-map-container" className="relative w-full rounded-[2rem] overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
      {/* Info bar */}
      <div className="absolute top-3.5 left-3.5 z-[1000] pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/10 shadow-md pointer-events-auto">
          <Navigation className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-white tracking-wide">
            {trip.destination} Route Map
          </span>
          <span className="text-[11px] text-slate-400 border-l border-white/10 pl-2">
            {activeDay === 'all' ? 'All Days' : `Day ${activeDay}`} • {points.length} Pins
          </span>
        </div>
      </div>

      <div className="w-full h-[360px] md:h-[430px] relative [&_.leaflet-container]:bg-slate-100 [&_.leaflet-control-attribution]:bg-slate-950/70 [&_.leaflet-control-attribution]:text-slate-400 [&_.leaflet-control-attribution]:text-[9px] [&_.leaflet-control-attribution_a]:text-slate-300">
        <MapContainer
          center={[trip.coordinates.lat, trip.coordinates.lng]}
          zoom={13}
          zoomControl={false}
          scrollWheelZoom
          className="w-full h-full"
        >
          <TileLayer
            key={mapTheme}
            url={tileUrl}
            attribution={tileAttribution}
            subdomains="abc"
          />
          <FitBounds bounds={bounds} />
          <MapControls mapTheme={mapTheme} setMapTheme={setMapTheme} />

          <Marker
            position={[trip.accommodation.lat, trip.accommodation.lng]}
            icon={hotelIcon}
            eventHandlers={{ click: () => setSelectedPin(trip.accommodation) }}
          />

          {routePaths.map(rp => (
            <Polyline
              key={rp.day}
              positions={rp.positions}
              pathOptions={{ color: rp.color, weight: 4, opacity: 0.8, dashArray: '6 6' }}
            />
          ))}

          {points.map(p => (
            <Marker
              key={p.item.id}
              position={[p.item.location.lat, p.item.location.lng]}
              icon={pinIcon(getCategoryColor(p.item.category), p.index)}
              eventHandlers={{
                click: () => {
                  setSelectedPin(p.item);
                  onSelectActivity?.(p.item);
                }
              }}
            />
          ))}
        </MapContainer>
      </div>

      {/* Selected Marker Detail Card Popup */}
      {selectedPin && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-sm z-[1000] bg-slate-900/95 backdrop-blur-md p-3.5 rounded-xl border border-indigo-500/40 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-3">
              {'imageUrl' in selectedPin && (
                <img
                  src={selectedPin.imageUrl}
                  alt={'title' in selectedPin ? selectedPin.title : selectedPin.name}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-slate-700"
                />
              )}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  {'category' in selectedPin ? (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      {selectedPin.category}
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      Accommodation
                    </span>
                  )}
                  <span className="text-xs font-semibold text-amber-400">★ {selectedPin.rating}</span>
                </div>
                <h4 className="text-sm font-bold text-white line-clamp-1">
                  {'title' in selectedPin ? selectedPin.title : selectedPin.name}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                  {'timeSlot' in selectedPin ? `${selectedPin.timeSlot} • $${selectedPin.totalCost}` : `$${selectedPin.costPerNight}/night`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedPin(null)}
              className="text-slate-400 hover:text-white text-sm p-1"
            >
              ✕
            </button>
          </div>

          {'reason' in selectedPin && (
            <p className="mt-2 text-[11px] text-slate-300 italic bg-slate-800/80 p-2 rounded-lg border border-slate-700/60 line-clamp-2">
              "{selectedPin.reason}"
            </p>
          )}
        </div>
      )}

      {/* Map Legend */}
      <div className="bg-slate-900/90 border-t border-white/10 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> Culture & Art
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" /> Dining
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Outdoors
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> Views & Sights
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block" /> Nightlife
          </span>
        </div>
        <span className="text-[10px] text-slate-500 italic">Drag to pan • Scroll to zoom • Click pins for details</span>
      </div>
    </div>
  );
};
