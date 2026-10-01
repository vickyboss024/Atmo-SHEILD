import React from 'react';
import { HelpCircle, Info } from 'lucide-react';
import { AqiLevel } from '../types/aqi';

interface AqiGaugeProps {
  aqi: number | null;
  level: AqiLevel;
  meaning: string;
}

export const AqiGauge: React.FC<AqiGaugeProps> = ({ aqi, level, meaning }) => {
  // Gauge geometry: Semi-circular arc from 180° to 360° (or 240° arc)
  // Arc radius = 80, center = (100, 100)
  // Max AQI on scale = 200
  const normalizedAqi = aqi === null || isNaN(aqi) ? 0 : Math.min(200, Math.max(0, aqi));
  const percentage = normalizedAqi / 200; // 0 to 1

  // SVG arc calculation (from -120deg to +120deg for 240deg sweep)
  const radius = 84;
  const strokeWidth = 14;
  const totalAngle = 240;
  const startAngle = 150; // in degrees
  const circumference = 2 * Math.PI * radius;
  const arcLength = (totalAngle / 360) * circumference;
  const strokeDashoffset = arcLength - percentage * arcLength;

  const getLevelDetails = () => {
    switch (level) {
      case 'LOW':
        return {
          title: 'LOW',
          emoji: '🟢',
          colorClass: 'text-emerald-600',
          bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          gradientStart: '#10b981',
          gradientEnd: '#34d399',
          advice: 'Air quality is relatively good. Perfect for children, seniors, and outdoor sports.',
        };
      case 'MEDIUM':
        return {
          title: 'MEDIUM',
          emoji: '🟡',
          colorClass: 'text-amber-500',
          bgClass: 'bg-amber-50 text-amber-800 border-amber-200',
          gradientStart: '#eab308',
          gradientEnd: '#facc15',
          advice: 'Air quality may affect sensitive people or prolonged outdoor activity.',
        };
      case 'HIGH':
        return {
          title: 'HIGH',
          emoji: '🔴',
          colorClass: 'text-rose-600',
          bgClass: 'bg-rose-50 text-rose-700 border-rose-200',
          gradientStart: '#ef4444',
          gradientEnd: '#f87171',
          advice: 'Pollution is elevated and outdoor exposure should be reduced.',
        };
      default:
        return {
          title: 'UNAVAILABLE',
          emoji: '⚪',
          colorClass: 'text-slate-400',
          bgClass: 'bg-slate-100 text-slate-600 border-slate-200',
          gradientStart: '#94a3b8',
          gradientEnd: '#cbd5e1',
          advice: 'Air quality measurements currently unavailable for this station.',
        };
    }
  };

  const details = getLevelDetails();

  return (
    <div
      id="gauge"
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🟢🟡🔴</span>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              AQI Circular Gauge
            </h2>
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            3-Tier Scale
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Instant visual classification of ambient air purity.
        </p>
      </div>

      {/* Circular Gauge Graphic */}
      <div className="relative my-4 flex flex-col items-center justify-center">
        <svg
          viewBox="0 0 220 180"
          className="w-56 h-48 sm:w-64 sm:h-52 overflow-visible"
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="45%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.1" />
            </filter>
          </defs>

          {/* Background Track (240 deg arc) */}
          <path
            d="M 37.1 142 A 84 84 0 1 1 182.9 142"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Colored Active Arc */}
          <path
            d="M 37.1 142 A 84 84 0 1 1 182.9 142"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />

          {/* Scale Labels */}
          <text x="32" y="165" fill="#10b981" fontSize="10" fontWeight="bold" textAnchor="middle">
            0 LOW
          </text>
          <text x="110" y="24" fill="#eab308" fontSize="10" fontWeight="bold" textAnchor="middle">
            50-100 MED
          </text>
          <text x="188" y="165" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle">
            100+ HIGH
          </text>

          {/* Center AQI Value & Level Badge */}
          <text
            x="110"
            y="95"
            textAnchor="middle"
            className="font-mono text-4xl sm:text-5xl font-black fill-slate-900 tracking-tight"
          >
            {aqi !== null ? aqi : '--'}
          </text>
          <text
            x="110"
            y="114"
            textAnchor="middle"
            fontSize="10"
            fontWeight="bold"
            letterSpacing="2"
            fill="#94a3b8"
          >
            AQI INDEX
          </text>

          <line
            x1="70"
            y1="125"
            x2="150"
            y2="125"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
        </svg>

        {/* Level badge directly beneath the meter */}
        <div className="-mt-3">
          <span
            className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-black border shadow-xs ${details.bgClass}`}
          >
            <span>{details.emoji}</span>
            <span>{details.title}</span>
          </span>
        </div>
      </div>

      {/* "What does this mean?" Section */}
      <div className="mt-2 bg-slate-50 border border-slate-200/80 rounded-xl p-4">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
          <Info className="w-3.5 h-3.5 text-emerald-600" />
          <span>What does this mean?</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          {meaning || details.advice}
        </p>
      </div>

      {/* 3 Simple Level Reference Keys */}
      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
        <div className="p-1.5 rounded-lg bg-emerald-50/50 border border-emerald-100">
          <span className="text-[11px] font-bold text-emerald-700 block">🟢 LOW</span>
          <span className="text-[10px] text-slate-500 font-medium">0 - 50 AQI</span>
        </div>
        <div className="p-1.5 rounded-lg bg-amber-50/50 border border-amber-100">
          <span className="text-[11px] font-bold text-amber-700 block">🟡 MEDIUM</span>
          <span className="text-[10px] text-slate-500 font-medium">51 - 100 AQI</span>
        </div>
        <div className="p-1.5 rounded-lg bg-rose-50/50 border border-rose-100">
          <span className="text-[11px] font-bold text-rose-700 block">🔴 HIGH</span>
          <span className="text-[10px] text-slate-500 font-medium">&gt; 100 AQI</span>
        </div>
      </div>
    </div>
  );
};
