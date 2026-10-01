/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AirQualityData,
  HealthAdvisory,
  LocationItem,
  MonthlyHistory,
  SensitivityGroupId,
  UserProfile,
  WeatherData,
  WeeklyHistory,
} from './types/aqi';
import {
  ALPHABETICAL_LOCATIONS,
  calculateDistanceKm,
  classifyAqi,
  fetchLiveAqi,
  fetchLiveWeather,
  generateClientHealthAdvisory,
  generateMonthlyRecap,
  generateWeeklyRecap,
  getNearbyStationsForLocation,
} from './services/apiService';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FlowBreadcrumb } from './components/FlowBreadcrumb';
import { LiveAqiWeatherCard } from './components/LiveAqiWeatherCard';
import { AqiGauge } from './components/AqiGauge';
import { NearbyAqiSection } from './components/NearbyAqiSection';
import { AiHealthAdvisory } from './components/AiHealthAdvisory';
import { HistoryRecap } from './components/HistoryRecap';
import { AlertBanner } from './components/AlertBanner';
import { AuthModal } from './components/AuthModal';
import { VeterinaryDoctorBar } from './components/VeterinaryDoctorBar';
import { PetHealthSection } from './components/PetHealthSection';
import { DomesticGardenSection } from './components/DomesticGardenSection';
import { HumanDoctorAssistantSection } from './components/HumanDoctorAssistantSection';

// Initial default location: Bhubaneswar
const DEFAULT_LOCATION: LocationItem = ALPHABETICAL_LOCATIONS.find(
  (l) => l.name.includes('Bhubaneswar')
) || ALPHABETICAL_LOCATIONS[1];

export default function App() {
  // App state
  const [currentLocation, setCurrentLocation] = useState<LocationItem>(DEFAULT_LOCATION);
  const [sourceType, setSourceType] = useState<'api' | 'sensor'>('api');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [alertDismissed, setAlertDismissed] = useState<boolean>(false);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isSavedNotification, setIsSavedNotification] = useState<boolean>(false);

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('atmo_sheild_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      isGuest: true,
      username: 'Guest User',
      sensitivity_group: 'general',
      alerts_enabled: true,
      saved_location: 'Bhubaneswar',
    };
  });

  // Environmental Telemetry Data
  const [airQuality, setAirQuality] = useState<AirQualityData>(() => ({
    status: 'available',
    source_type: 'api',
    source_label: 'Open-Meteo & Copernicus Atmospheric API',
    updated_at: 'Updated 2 minutes ago',
    aqi: 85,
    aqi_level: 'MEDIUM',
    aqi_color: '#eab308',
    aqi_emoji: '🟡',
    meaning: 'Air quality may affect sensitive people or prolonged outdoor activity.',
    pollutants: {
      pm2_5: 32.4,
      pm10: 68.1,
      co: 0.65,
      no2: 24.2,
      so2: 8.1,
      o3: 38.0,
    },
  }));

  const [weather, setWeather] = useState<WeatherData>(() => ({
    status: 'available',
    temperature: 29.0,
    humidity: 72,
    wind_speed: 12.0,
    weather_condition: 'Partly Cloudy',
    source: 'Open-Meteo Meteorological Feed',
  }));

  // Nearby Stations Telemetry
  const [nearbyStationsWithAqi, setNearbyStationsWithAqi] = useState<
    { station: LocationItem; aqiData: AirQualityData | null }[]
  >([]);

  // Fetch live environmental telemetry for current location
  const loadLocationData = useCallback(
    async (loc: LocationItem, srcType: 'api' | 'sensor' = sourceType) => {
      setIsLoading(true);
      try {
        const [aqiResult, weatherResult] = await Promise.all([
          fetchLiveAqi(loc.latitude, loc.longitude, srcType),
          fetchLiveWeather(loc.latitude, loc.longitude),
        ]);

        setAirQuality(aqiResult);
        setWeather(weatherResult);

        // Fetch nearby stations
        const nearby = getNearbyStationsForLocation(loc, 4);
        const nearbyResults = await Promise.all(
          nearby.map(async (st) => {
            const data = await fetchLiveAqi(st.latitude, st.longitude, 'api');
            return {
              station: st,
              aqiData: data.status === 'available' ? data : null,
            };
          })
        );
        setNearbyStationsWithAqi(nearbyResults);
      } catch (err) {
        console.error('Failed to load air quality:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [sourceType]
  );

  // Initial load and whenever current location changes
  useEffect(() => {
    loadLocationData(currentLocation, sourceType);
  }, [currentLocation, sourceType, loadLocationData]);

  // Persist user profile
  useEffect(() => {
    try {
      localStorage.setItem('atmo_sheild_user', JSON.stringify(userProfile));
    } catch {
      // ignore
    }
  }, [userProfile]);

  // Derived AI Health Advisory
  const advisory: HealthAdvisory = useMemo(() => {
    return generateClientHealthAdvisory(
      airQuality.aqi,
      airQuality.pollutants.pm2_5,
      weather,
      currentLocation.name,
      userProfile.sensitivity_group
    );
  }, [airQuality, weather, currentLocation, userProfile.sensitivity_group]);

  // Derived Weekly & Monthly Recaps
  const weeklyRecap: WeeklyHistory = useMemo(() => {
    return generateWeeklyRecap(airQuality.aqi || 85);
  }, [airQuality.aqi]);

  const monthlyRecap: MonthlyHistory = useMemo(() => {
    return generateMonthlyRecap(airQuality.aqi || 85);
  }, [airQuality.aqi]);

  // High Pollution Alert trigger
  const hasActiveHighAlert =
    airQuality.status === 'available' &&
    airQuality.aqi !== null &&
    airQuality.aqi_level === 'HIGH' &&
    !alertDismissed;

  // Handlers
  const handleScrollToDashboard = () => {
    const el = document.getElementById('live-aqi');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectLocation = (loc: LocationItem) => {
    setCurrentLocation(loc);
    setAlertDismissed(false);
  };

  const handleToggleSourceType = (type: 'api' | 'sensor') => {
    setSourceType(type);
    loadLocationData(currentLocation, type);
  };

  const handleToggleAlerts = () => {
    setUserProfile((prev) => ({
      ...prev,
      alerts_enabled: !prev.alerts_enabled,
    }));
  };

  const handleSaveWebsite = () => {
    try {
      const snapshot = {
        savedAt: new Date().toISOString(),
        currentLocation,
        sourceType,
        userProfile,
        airQuality,
        weather,
      };
      localStorage.setItem('atmo_sheild_saved_snapshot', JSON.stringify(snapshot));
      localStorage.setItem('atmo_sheild_user', JSON.stringify(userProfile));
      setIsSavedNotification(true);
      setTimeout(() => setIsSavedNotification(false), 2500);
    } catch (e) {
      console.error('Failed to save website snapshot:', e);
    }
  };

  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Find closest known station or create user coordinate
        let closest = ALPHABETICAL_LOCATIONS[0];
        let minDist = 999999;
        ALPHABETICAL_LOCATIONS.forEach((loc) => {
          const d = calculateDistanceKm(latitude, longitude, loc.latitude, loc.longitude);
          if (d < minDist) {
            minDist = d;
            closest = loc;
          }
        });

        // If very close to a known station, use that name, else show GPS Point
        if (minDist < 10) {
          setCurrentLocation(closest);
        } else {
          setCurrentLocation({
            name: `My GPS Coordinates`,
            area: `Within ~${Math.round(minDist)} km of ${closest.city}`,
            city: closest.city,
            latitude: Math.round(latitude * 10000) / 10000,
            longitude: Math.round(longitude * 10000) / 10000,
          });
        }
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        // Default to current location
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* High Alert Banner */}
      {hasActiveHighAlert && (
        <AlertBanner
          locationName={currentLocation.name}
          aqi={airQuality.aqi || 120}
          alertsEnabled={userProfile.alerts_enabled}
          onToggleAlerts={handleToggleAlerts}
          onDismiss={() => setAlertDismissed(true)}
        />
      )}

      {/* Top Header */}
      <Header
        userProfile={userProfile}
        onOpenAuth={() => setIsAuthOpen(true)}
        onToggleAlerts={handleToggleAlerts}
        onSaveWebsite={handleSaveWebsite}
        isSavedNotification={isSavedNotification}
        hasActiveHighAlert={hasActiveHighAlert}
      />

      {/* Home Page / Name Page Hero Section (Swapped to Top) */}
      <HeroSection
        onScrollToDashboard={handleScrollToDashboard}
        selectedCity={currentLocation.city}
      />

      {/* Dashboard Flow Breadcrumbs */}
      <FlowBreadcrumb />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 flex-1 w-full">
        {/* Search Bar with Pet Care & Domestic Garden Switch Button */}
        <section id="veterinary-pets" className="scroll-mt-24">
          <VeterinaryDoctorBar
            currentAqi={airQuality.aqi}
            locationName={currentLocation.name}
          />
        </section>

        {/* 1. Pets, Animals, Birds & Reptiles Veterinary Health Hub */}
        <PetHealthSection
          currentAqi={airQuality.aqi}
          locationName={currentLocation.name}
        />

        {/* 2. 20% Focus: Domestic Garden & Home Fresh Breathing Sanctuary */}
        <DomesticGardenSection
          currentAqi={airQuality.aqi}
        />

        {/* 3. Human Disease Precautions & Health Companion */}
        <HumanDoctorAssistantSection
          currentAqi={airQuality.aqi}
          locationName={currentLocation.name}
        />

        {/* 4. 20% Focus: Live Environmental Telemetry & Circular AQI Meter */}
        <div id="live-aqi" className="scroll-mt-24 space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-slate-100 text-slate-700 border border-slate-200">
                🌫️ Environmental Telemetry
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Real-Time Atmospheric Telemetry & Circular Gauge
              </h3>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Station: <strong>{currentLocation.name}</strong>
            </div>
          </div>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 flex flex-col">
              <LiveAqiWeatherCard
                location={currentLocation}
                airQuality={airQuality}
                weather={weather}
                isLoading={isLoading}
                onRefresh={() => loadLocationData(currentLocation, sourceType)}
                onToggleSourceType={handleToggleSourceType}
              />
            </div>

            <div className="lg:col-span-5 flex flex-col">
              <AqiGauge
                aqi={airQuality.aqi}
                level={airQuality.aqi_level}
                meaning={airQuality.meaning}
              />
            </div>
          </section>
        </div>

        {/* 5. Separate Location Search Bar & Nearby Air Quality Section */}
        <NearbyAqiSection
          currentLocation={currentLocation}
          currentAqi={airQuality}
          onSelectLocation={handleSelectLocation}
          onUseGeolocation={handleUseGeolocation}
          isLocating={isLocating}
          nearbyStations={nearbyStationsWithAqi}
        />

        {/* 6. Personalized Physiological AI Advisory */}
        <AiHealthAdvisory
          advisory={advisory}
          selectedGroup={userProfile.sensitivity_group}
          onSelectGroup={(g) =>
            setUserProfile((prev) => ({ ...prev, sensitivity_group: g }))
          }
          locationName={currentLocation.name}
        />

        {/* 7. Weekly / Monthly History Section */}
        <HistoryRecap
          weekly={weeklyRecap}
          monthly={monthlyRecap}
          locationName={currentLocation.name}
        />
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={(prof) => setUserProfile(prof)}
        currentLocationName={currentLocation.name}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌿</span>
            <span className="font-extrabold text-slate-800">Atmo SHEILD</span>
            <span>— AI Air Pollution & Health Advisory</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 font-medium text-slate-400">
            <span>Powered by Open-Meteo & Copernicus Atmospheric Monitoring Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
