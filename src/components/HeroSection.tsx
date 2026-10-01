import React from 'react';
import { ArrowDown, BellRing, Compass, HeartPulse, LineChart, Wind } from 'lucide-react';

interface HeroSectionProps {
  onScrollToDashboard: () => void;
  selectedCity: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToDashboard,
  selectedCity,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-14 bg-gradient-to-b from-emerald-50/70 via-slate-50/50 to-slate-50 border-b border-slate-200/60">
      {/* Subtle Atmospheric Cloud / Wind SVGs */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg
          className="absolute -top-12 -left-20 w-96 h-96 text-emerald-300 animate-float-subtle"
          fill="currentColor"
          viewBox="0 0 200 200"
        >
          <path
            d="M45.7,-59.8C59.9,-51.2,72.4,-38.5,77.7,-23.1C83,-7.7,81.1,10.4,73.5,25.8C65.9,41.2,52.6,53.9,37.3,62.1C22,70.3,4.7,74,-12.3,72.3C-29.3,70.6,-46,63.5,-58.5,51.4C-71,39.3,-79.3,22.2,-80.6,4.6C-81.9,-13,-76.2,-31.1,-64.5,-44.6C-52.8,-58.1,-35.1,-67,-18.2,-68.5C-1.3,-70,15.7,-64.1,45.7,-59.8Z"
            transform="translate(100 100)"
          />
        </svg>
        <svg
          className="absolute top-20 right-0 w-[420px] h-[420px] text-teal-200 animate-float-subtle"
          style={{ animationDelay: '2s' }}
          fill="currentColor"
          viewBox="0 0 200 200"
        >
          <path
            d="M42.8,-57.4C56.2,-48.9,68.4,-37.2,74.5,-22.6C80.6,-8,80.6,9.5,74.7,24.8C68.8,40.1,57,53.2,42.5,61.9C28,70.6,10.7,74.9,-6.2,74.2C-23.1,73.5,-39.6,67.8,-52.8,57.1C-66,46.4,-75.9,30.7,-78.9,13.6C-81.9,-3.5,-78.1,-22,-68.4,-36.8C-58.7,-51.6,-43.1,-62.7,-27.6,-69.8C-12.1,-76.9,3.3,-80,18.8,-75.9C34.3,-71.8,49.9,-60.5,42.8,-57.4Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle Wind Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-emerald-200/80 shadow-xs text-xs font-semibold text-emerald-800 mb-4 backdrop-blur-sm">
          <Wind className="w-3.5 h-3.5 text-emerald-600 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Intelligent Environmental Health Defense</span>
        </div>

        {/* Hero Title & Subtitle */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          🌿 Atmo <span className="text-emerald-600">SHEILD</span>
        </h1>
        <p className="mt-3 sm:mt-4 text-xl sm:text-2xl font-bold text-slate-700 max-w-2xl mx-auto">
          Breathe smarter. Understand your air.
        </p>
        <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-xl mx-auto font-medium">
          Accurate real-time air pollution classification, neighborhood sensor monitoring, and automated AI health precautions tailored to your physiology.
        </p>

        {/* Primary Action Button */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onScrollToDashboard}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-md shadow-emerald-600/25 hover:shadow-lg hover:shadow-emerald-600/30 transition-all hover:-translate-y-0.5"
          >
            <span>Live Air Dashboard</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </button>
          <a
            href="#veterinary-pets"
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold text-sm border border-emerald-500/30 shadow-sm transition-all"
          >
            <span>🐾 Vet Doctor & Pet Triage</span>
          </a>
          <a
            href="#domestic-garden"
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-sm shadow-sm transition-all"
          >
            <span>🌿 Domestic Garden Bio-Shield</span>
          </a>
          <div className="text-xs text-slate-500 font-semibold px-3 py-2 bg-white/70 border border-slate-200/80 rounded-xl">
            Currently monitoring: <span className="text-emerald-700 font-bold">{selectedCity}</span>
          </div>
        </div>

        {/* Integrated Core Health & Defense Pillars */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto text-left">
          <a
            href="#veterinary-pets"
            className="p-3.5 bg-white/90 rounded-xl border border-emerald-200/80 shadow-xs hover:border-emerald-400 transition-all group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5 text-emerald-800 font-black">
                <span className="text-lg">🐾</span> Vet & Pet Health
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                Doctor Mode
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2">
              Avian air-sac danger, dogs & cats respiratory care, and voice/photo symptom triage.
            </p>
          </a>

          <a
            href="#domestic-garden"
            className="p-3.5 bg-white/90 rounded-xl border border-teal-200/80 shadow-xs hover:border-teal-400 transition-all group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5 text-teal-800 font-black">
                <span className="text-lg">🌿</span> Domestic Garden
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 font-bold">
                Fresh Breathing
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2">
              Botanical home bio-scrubbers, NASA clean air plants & interactive room O₂ calculator.
            </p>
          </a>

          <a
            href="#doctor-assistant"
            className="p-3.5 bg-white/90 rounded-xl border border-blue-200/80 shadow-xs hover:border-blue-400 transition-all group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5 text-blue-800 font-black">
                <span className="text-lg">🩺</span> Health Companion
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                Human Disease
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2">
              Asthma inhaler protocol, COPD, hypertension, and personalized health companion guidance.
            </p>
          </a>

          <a
            href="#live-aqi"
            className="p-3.5 bg-white/90 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-400 transition-all group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5 text-slate-800 font-black">
                <span className="text-lg">🌫️</span> Live Telemetry
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                Real-Time
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2">
              Circular AQI gauge, nearby stations, weather parameters & weekly/monthly historical logs.
            </p>
          </a>
        </div>
      </div>
    </section>
  );
};
