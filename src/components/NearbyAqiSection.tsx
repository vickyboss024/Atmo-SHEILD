import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  Compass,
  Crosshair,
  ExternalLink,
  Loader2,
  MapPin,
  Navigation,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import L from 'leaflet';
import { AirQualityData, LocationItem } from '../types/aqi';
import {
  ALPHABETICAL_LOCATIONS,
  calculateDistanceKm,
  searchLocationsOnline,
} from '../services/apiService';

interface NearbyAqiSectionProps {
  currentLocation: LocationItem;
  currentAqi: AirQualityData;
  onSelectLocation: (location: LocationItem) => void;
  onUseGeolocation: () => void;
  isLocating: boolean;
  nearbyStations: {
    station: LocationItem;
    aqiData: AirQualityData | null;
  }[];
}

export const NearbyAqiSection: React.FC<NearbyAqiSectionProps> = ({
  currentLocation,
  currentAqi,
  onSelectLocation,
  onUseGeolocation,
  isLocating,
  nearbyStations,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Alphabetically sorted locations for the dropdown
  const sortedLocations = [...ALPHABETICAL_LOCATIONS].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Debounced search effect
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchResults([]);
      setIsDropdownOpen(false);
      return;
    }

    setIsSearching(true);
    setIsDropdownOpen(true);

    const timer = setTimeout(async () => {
      try {
        const results = await searchLocationsOnline(trimmed);
        setSearchResults(results);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSearchResult = (loc: LocationItem) => {
    onSelectLocation(loc);
    setSearchQuery(loc.name);
    setIsDropdownOpen(false);
  };

  const handleManualSearch = () => {
    if (searchResults.length > 0) {
      handleSelectSearchResult(searchResults[0]);
    } else if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match = ALPHABETICAL_LOCATIONS.find(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.area.toLowerCase().includes(q)
      );
      if (match) {
        handleSelectSearchResult(match);
      } else {
        setIsDropdownOpen(true);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleManualSearch();
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  // Initialize or update Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentLocation.latitude, currentLocation.longitude],
        zoom: 12,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView(
        [currentLocation.latitude, currentLocation.longitude],
        12,
        { animate: true }
      );
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Current location marker (pulsing emerald)
    const currentIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div style="background-color: ${currentAqi.aqi_color || '#10b981'}; color: white; padding: 4px 8px; border-radius: 9999px; font-weight: 800; font-size: 11px; display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2); border: 2px solid white;">
          <span>📍</span>
          <span>${currentAqi.aqi !== null ? currentAqi.aqi : '--'}</span>
        </div>
      `,
      iconSize: [60, 28],
      iconAnchor: [30, 28],
    });

    const currentMarker = L.marker([currentLocation.latitude, currentLocation.longitude], {
      icon: currentIcon,
    })
      .addTo(map)
      .bindPopup(`<b>${currentLocation.name}</b><br/>AQI: ${currentAqi.aqi} (${currentAqi.aqi_level})`);

    markersRef.current.push(currentMarker);

    // Nearby station markers
    nearbyStations.forEach(({ station, aqiData }) => {
      const aqiVal = aqiData?.aqi;
      const color = aqiData?.aqi_color || '#94a3b8';

      const icon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="background-color: ${color}; color: white; padding: 3px 6px; border-radius: 9999px; font-weight: 700; font-size: 10px; display: flex; align-items: center; gap: 2px; box-shadow: 0 2px 4px rgba(0,0,0,0.15); border: 1.5px solid white; cursor: pointer;">
            <span>${aqiVal !== null && aqiVal !== undefined ? aqiVal : '?'}</span>
          </div>
        `,
        iconSize: [45, 24],
        iconAnchor: [22, 24],
      });

      const marker = L.marker([station.latitude, station.longitude], { icon })
        .addTo(map)
        .bindPopup(
          `<b>${station.name}</b><br/>AQI: ${aqiVal !== null && aqiVal !== undefined ? aqiVal : 'Unavailable'}`
        );

      marker.on('click', () => {
        onSelectLocation(station);
      });

      markersRef.current.push(marker);
    });
  }, [currentLocation, currentAqi, nearbyStations, onSelectLocation]);

  return (
    <section id="nearby" className="scroll-mt-20">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📍</span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Nearby Air Quality & Station Discovery
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Search any station or city worldwide, filter in alphabetical order, or use GPS proximity.
            </p>
          </div>

          {/* GPS Location Button */}
          <button
            onClick={onUseGeolocation}
            disabled={isLocating}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100/70 transition-all shadow-xs disabled:opacity-50"
          >
            <Crosshair className={`w-4 h-4 text-emerald-600 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Use My GPS Location'}</span>
          </button>
        </div>

        {/* Search & Alphabetical Dropdown Bar */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-3 relative">
          {/* Enhanced Live Search Input with Autocomplete Dropdown */}
          <div ref={searchContainerRef} className="md:col-span-7 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
            <input
              type="text"
              placeholder="Search station or city (e.g. Master Canteen, Janpath, Paris, Tokyo)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim()) setIsDropdownOpen(true);
              }}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/50 shadow-inner"
            />
            {/* Clear / Loading / Find Button */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {isSearching && <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />}
              {searchQuery && !isSearching && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setIsDropdownOpen(false);
                  }}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={handleManualSearch}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
              >
                Find
              </button>
            </div>

            {/* Live Autocomplete Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-72 overflow-y-auto divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
                {searchResults.length > 0 ? (
                  searchResults.map((loc, idx) => {
                    const dist = calculateDistanceKm(
                      currentLocation.latitude,
                      currentLocation.longitude,
                      loc.latitude,
                      loc.longitude
                    );
                    const isCurrent =
                      loc.name.toLowerCase() === currentLocation.name.toLowerCase();

                    return (
                      <div
                        key={`${loc.name}-${idx}`}
                        onClick={() => handleSelectSearchResult(loc)}
                        className={`p-3 hover:bg-emerald-50/80 cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                          isCurrent ? 'bg-emerald-50/50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-xs font-bold">
                            <MapPin className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs sm:text-sm font-bold text-slate-900">
                                {loc.name}
                              </span>
                              {isCurrent && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                  Current
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 block">
                              {loc.area ? `${loc.area} • ` : ''}
                              {loc.city}
                              {loc.country ? `, ${loc.country}` : ''}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          {dist > 0 && (
                            <span className="text-[10px] font-semibold text-slate-400 block">
                              ~{dist} km away
                            </span>
                          )}
                          <span className="text-[10px] font-bold text-emerald-600 block">
                            Select Station &rarr;
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500">
                    {isSearching ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                        <span>Searching global stations...</span>
                      </span>
                    ) : (
                      <span>No stations found matching &ldquo;{searchQuery}&rdquo;. Try another city name.</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Alphabetical Order Dropdown */}
          <div className="md:col-span-5">
            <select
              value={currentLocation.name}
              onChange={(e) => {
                const found = ALPHABETICAL_LOCATIONS.find((l) => l.name === e.target.value);
                if (found) {
                  onSelectLocation(found);
                  setSearchQuery(found.name);
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-inner"
            >
              <option disabled value="">
                -- Select Location (Alphabetical Order A-Z) --
              </option>
              {sortedLocations.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name} ({loc.city}, {loc.country})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick One-Click Station Shortcuts */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium mr-1 text-[11px]">Popular Stations:</span>
          {[
            'Delhi - Anand Vihar',
            'Bhubaneswar (City Center)',
            'Mumbai - Bandra Kurla',
            'Bengaluru - Whitefield',
            'London - Westminster',
            'New York - Central Park',
            'Tokyo - Shinjuku',
            'Paris - Île-de-France',
          ].map((cityName) => {
            const matchLoc = ALPHABETICAL_LOCATIONS.find((l) => l.name === cityName);
            if (!matchLoc) return null;
            const isSelected = currentLocation.name === matchLoc.name;
            return (
              <button
                key={cityName}
                type="button"
                onClick={() => {
                  onSelectLocation(matchLoc);
                  setSearchQuery(matchLoc.name);
                }}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                {matchLoc.city}
              </button>
            );
          })}
        </div>

        {/* Active Selection Hero Banner (as requested in prompt) */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border border-emerald-200/70 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs">
              📍
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Your Selected Location
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {currentLocation.name}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">
              AQI {currentAqi.aqi !== null ? currentAqi.aqi : '--'}
            </span>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-black border ${
                currentAqi.aqi_level === 'LOW'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : currentAqi.aqi_level === 'MEDIUM'
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : currentAqi.aqi_level === 'HIGH'
                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                  : 'bg-slate-100 text-slate-600 border-slate-300'
              }`}
            >
              {currentAqi.aqi_level} {currentAqi.aqi_emoji}
            </span>
          </div>
        </div>

        {/* Main Grid: Interactive Map & Nearby Stations Cards */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Interactive Leaflet Map */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                <span>Interactive Monitoring Map (Click pin to switch station)</span>
              </span>
              <span className="text-[10px] text-slate-400">OpenStreetMap Telemetry</span>
            </div>
            <div
              ref={mapContainerRef}
              className="w-full h-72 sm:h-80 rounded-xl border border-slate-200 overflow-hidden shadow-inner z-0"
              style={{ minHeight: '300px' }}
            />
          </div>

          {/* Clean Nearby Location Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">
                  Nearby Stations & Monitoring Points
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {nearbyStations.length} nearby
                </span>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {nearbyStations.map(({ station, aqiData }) => {
                  const dist =
                    station.distance_km ??
                    calculateDistanceKm(
                      currentLocation.latitude,
                      currentLocation.longitude,
                      station.latitude,
                      station.longitude
                    );

                  const aqiVal = aqiData?.aqi;
                  const lvl = aqiData?.aqi_level || 'UNKNOWN';

                  const badgeClass =
                    lvl === 'LOW'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : lvl === 'MEDIUM'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : lvl === 'HIGH'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-slate-100 text-slate-500 border-slate-200';

                  const isSelected = station.name === currentLocation.name;

                  return (
                    <div
                      key={station.name}
                      onClick={() => onSelectLocation(station)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'bg-slate-50/50 hover:bg-slate-100/70 border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs sm:text-sm text-slate-900">
                            {station.name}
                          </span>
                          {dist > 0 && (
                            <span className="text-[10px] text-slate-500 font-medium bg-white px-1.5 py-0.5 rounded border border-slate-200/70">
                              {dist} km
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {station.area} • {station.city}
                        </p>
                      </div>

                      <div className="text-right">
                        {aqiVal !== null && aqiVal !== undefined ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-sm font-bold text-slate-800">
                              AQI {aqiVal}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass}`}
                            >
                              {lvl === 'LOW' ? '🟢' : lvl === 'MEDIUM' ? '🟡' : '🔴'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium italic">
                            Data unavailable
                          </span>
                        )}
                        <span className="text-[9px] text-slate-400 block mt-0.5">
                          {aqiData?.source_type === 'sensor' ? 'Sensor' : 'Atmospheric API'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Data source transparency: strict empirical feeds only.</span>
              <span className="text-emerald-700 font-bold">No fake readings</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
