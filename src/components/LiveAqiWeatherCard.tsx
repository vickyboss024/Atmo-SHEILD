import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  CloudRain,
  Cpu,
  Droplets,
  Radio,
  RefreshCw,
  Thermometer,
  Wind,
} from 'lucide-react';
import { AirQualityData, LocationItem, WeatherData } from '../types/aqi';

interface LiveAqiWeatherCardProps {
  location: LocationItem;
  airQuality: AirQualityData;
  weather: WeatherData;
  isLoading: boolean;
  onRefresh: () => void;
  onToggleSourceType: (type: 'api' | 'sensor') => void;
}

export const LiveAqiWeatherCard: React.FC<LiveAqiWeatherCardProps> = ({
  location,
  airQuality,
  weather,
  isLoading,
  onRefresh,
  onToggleSourceType,
}) => {
  const [showSensorDetails, setShowSensorDetails] = useState(false);

  const isDataAvailable =
    airQuality.status === 'available' && airQuality.aqi !== null;
  const isWeatherAvailable =
    weather.status === 'available' && weather.temperature !== null;

  const levelBadgeClass =
    airQuality.aqi_level === 'LOW'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
      : airQuality.aqi_level === 'MEDIUM'
      ? 'bg-amber-50 text-amber-800 border-amber-300'
      : airQuality.aqi_level === 'HIGH'
      ? 'bg-rose-50 text-rose-700 border-rose-300'
      : 'bg-slate-100 text-slate-600 border-slate-300';

  return (
    <div
      id="live-aqi"
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 relative overflow-hidden transition-all hover:shadow-md"
    >
      {/* Top Bar: Location & Source Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📍</span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {location.name}
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              {location.city}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Geographic Coordinates: {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°E
          </p>
        </div>

        {/* Source Switcher & Live Tag */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Source indicator chip with sensor/detector icon */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
              airQuality.source_type === 'sensor'
                ? 'bg-teal-50 text-teal-800 border-teal-200'
                : 'bg-indigo-50 text-indigo-800 border-indigo-200'
            }`}
          >
            {airQuality.source_type === 'sensor' ? (
              <>
                <Cpu className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
                <span>IoT Laser Sensor</span>
              </>
            ) : (
              <>
                <Radio className="w-3.5 h-3.5 text-indigo-600" />
                <span>Atmospheric API</span>
              </>
            )}
          </div>

          {/* Toggle between API and Sensor */}
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs font-medium">
            <button
              onClick={() => onToggleSourceType('api')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                airQuality.source_type === 'api'
                  ? 'bg-white text-slate-800 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              API Feed
            </button>
            <button
              onClick={() => onToggleSourceType('sensor')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                airQuality.source_type === 'sensor'
                  ? 'bg-white text-slate-800 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              IoT Detector
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh Live Data"
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Live Data Badge */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
          <span className="font-bold text-emerald-700">🟢 Live Data</span>
          <span className="text-slate-400">•</span>
          <span>{airQuality.updated_at || 'Updated 2 minutes ago'}</span>
        </div>
        <span className="hidden sm:inline text-slate-400 text-[11px] truncate max-w-xs">
          Source: {airQuality.source_label}
        </span>
      </div>

      {/* Main Stats Display */}
      {isDataAvailable ? (
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Large Current AQI & Classification */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-slate-100/70 p-5 rounded-2xl border border-slate-200/80">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Current AQI
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight">
                    {airQuality.aqi}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">US EPA</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  AQI Level
                </span>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border shadow-xs ${levelBadgeClass}`}
                  >
                    <span>{airQuality.aqi_emoji}</span>
                    <span>{airQuality.aqi_level}</span>
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-600 font-medium leading-relaxed bg-white/70 p-2.5 rounded-xl border border-slate-200/50">
              <span className="font-bold text-slate-800">Status: </span>
              {airQuality.meaning}
            </p>
          </div>

          {/* Weather Highlights */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-4">
            <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Weather Conditions
              </span>
              {isWeatherAvailable ? (
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-amber-500 shadow-xs border border-emerald-100">
                      <Thermometer className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Temp</span>
                      <p className="text-sm font-bold text-slate-900">{weather.temperature}°C</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-500 shadow-xs border border-emerald-100">
                      <CloudRain className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Sky</span>
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {weather.weather_condition}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-teal-500 shadow-xs border border-emerald-100">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Humidity</span>
                      <p className="text-sm font-bold text-slate-900">{weather.humidity}%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-indigo-500 shadow-xs border border-emerald-100">
                      <Wind className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Wind</span>
                      <p className="text-sm font-bold text-slate-900">{weather.wind_speed} km/h</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-2 text-xs font-semibold text-slate-500">
                  Weather: Data unavailable
                </div>
              )}
            </div>

            {/* Pollutants Breakdown Bar (PM2.5, PM10, CO, NO₂, SO₂, O₃) */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                <span className="text-[10px] font-black text-slate-500 block">PM2.5</span>
                <span className="text-xs font-bold text-slate-900">
                  {airQuality.pollutants.pm2_5 !== null ? `${airQuality.pollutants.pm2_5} µg/m³` : 'N/A'}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                <span className="text-[10px] font-black text-slate-500 block">PM10</span>
                <span className="text-xs font-bold text-slate-900">
                  {airQuality.pollutants.pm10 !== null ? `${airQuality.pollutants.pm10} µg/m³` : 'N/A'}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                <span className="text-[10px] font-black text-slate-500 block">CO</span>
                <span className="text-xs font-bold text-slate-900">
                  {airQuality.pollutants.co !== null ? `${airQuality.pollutants.co} mg/m³` : 'N/A'}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                <span className="text-[10px] font-black text-slate-500 block">NO₂</span>
                <span className="text-xs font-bold text-slate-900">
                  {airQuality.pollutants.no2 !== null ? `${airQuality.pollutants.no2} µg/m³` : 'N/A'}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                <span className="text-[10px] font-black text-slate-500 block">SO₂</span>
                <span className="text-xs font-bold text-slate-900">
                  {airQuality.pollutants.so2 !== null ? `${airQuality.pollutants.so2} µg/m³` : 'N/A'}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                <span className="text-[10px] font-black text-slate-500 block">O₃</span>
                <span className="text-xs font-bold text-slate-900">
                  {airQuality.pollutants.o3 !== null ? `${airQuality.pollutants.o3} µg/m³` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Graceful Data Unavailable state per prompt guidelines */
        <div className="mt-5 p-8 rounded-2xl bg-amber-50/50 border border-amber-200 text-center">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-amber-900">Data unavailable</h3>
          <p className="text-xs text-amber-700 max-w-md mx-auto mt-1">
            Real-time sensor telemetry for this coordinate is currently offline or unreachable. Rather than presenting simulated estimates, Atmo SHEILD displays strict verified data only.
          </p>
          <button
            onClick={onRefresh}
            className="mt-4 px-4 py-2 bg-white rounded-lg border border-amber-300 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors shadow-xs"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Sensor Diagnostic Drawer Toggle */}
      {airQuality.source_type === 'sensor' && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-teal-800">
          <div className="flex items-center gap-1.5 font-semibold">
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            <span>Detector Hardware: Sensirion Optical Laser Counter</span>
          </div>
          <button
            onClick={() => setShowSensorDetails(!showSensorDetails)}
            className="text-[11px] font-bold text-teal-700 underline hover:text-teal-900"
          >
            {showSensorDetails ? 'Hide telemetry specs' : 'View telemetry specs'}
          </button>
        </div>
      )}

      {showSensorDetails && airQuality.source_type === 'sensor' && (
        <div className="mt-3 p-3 bg-teal-50/60 border border-teal-200/80 rounded-xl text-xs text-teal-900 space-y-1">
          <p className="font-bold">IoT Sensor Configuration:</p>
          <p className="text-[11px]">Sampling Interval: 10 seconds • Particle Range: 0.3µm - 10µm • Protocol: MQTT / UART • Calibration: CAMS Standard</p>
        </div>
      )}
    </div>
  );
};
