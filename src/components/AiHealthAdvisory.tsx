import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  HeartPulse,
  Info,
  ShieldCheck,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { HealthAdvisory, SensitivityGroupId } from '../types/aqi';
import { SENSITIVITY_OPTIONS } from '../services/apiService';

interface AiHealthAdvisoryProps {
  advisory: HealthAdvisory;
  selectedGroup: SensitivityGroupId;
  onSelectGroup: (group: SensitivityGroupId) => void;
  locationName: string;
}

export const AiHealthAdvisory: React.FC<AiHealthAdvisoryProps> = ({
  advisory,
  selectedGroup,
  onSelectGroup,
  locationName,
}) => {
  return (
    <section id="advisory" className="scroll-mt-20">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🫁</span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                AI Health Advisory System
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                Contextual AI
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Personalized precautions automatically evaluated from live AQI, PM2.5, weather, and your physiology group.
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-400">
            Current Target: <span className="text-slate-800 font-bold">{locationName}</span>
          </div>
        </div>

        {/* Sensitivity Group Selector: "Who are you?" */}
        <div className="mt-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Who are you? (Select your profile group)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {SENSITIVITY_OPTIONS.map((opt) => {
              const isSelected = selectedGroup === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onSelectGroup(opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-600/30'
                      : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xl">{opt.emoji}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />}
                  </div>
                  <div className="mt-2">
                    <span className="block text-xs font-bold leading-tight">{opt.name}</span>
                    <span
                      className={`block text-[10px] mt-0.5 line-clamp-2 ${
                        isSelected ? 'text-emerald-100' : 'text-slate-400'
                      }`}
                    >
                      {opt.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Generated Advisory Main Card */}
        <div className="mt-6 p-5 sm:p-6 rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50/90 to-white shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 text-xl font-bold">
              {advisory.aqi_emoji}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  AI Environmental Health Recommendation
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                    advisory.aqi_level === 'LOW'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : advisory.aqi_level === 'MEDIUM'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {advisory.aqi_level} AQI
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                {advisory.headline}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {advisory.summary}
              </p>
            </div>
          </div>
        </div>

        {/* 💡 WHAT TO DO and 🚫 WHAT NOT TO DO Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 💡 WHAT TO DO */}
          <div className="bg-emerald-50/50 border border-emerald-200/70 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-emerald-200/50 pb-3">
              <span className="text-xl">💡</span>
              <div>
                <h4 className="text-sm font-black text-emerald-950 uppercase tracking-wide">
                  WHAT TO DO
                </h4>
                <p className="text-[11px] text-emerald-700">Recommended protective measures</p>
              </div>
            </div>

            <ul className="mt-4 space-y-3">
              {advisory.what_to_do.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-2.5 rounded-xl bg-white/80 border border-emerald-100 shadow-2xs"
                >
                  <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-slate-600 leading-normal block mt-0.5">
                      {item.desc}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 🚫 WHAT NOT TO DO */}
          <div className="bg-rose-50/40 border border-rose-200/70 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-rose-200/50 pb-3">
              <span className="text-xl">🚫</span>
              <div>
                <h4 className="text-sm font-black text-rose-950 uppercase tracking-wide">
                  WHAT NOT TO DO
                </h4>
                <p className="text-[11px] text-rose-700">Activities to minimize or avoid</p>
              </div>
            </div>

            <ul className="mt-4 space-y-3">
              {advisory.what_not_to_do.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-2.5 rounded-xl bg-white/80 border border-rose-100 shadow-2xs"
                >
                  <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-slate-600 leading-normal block mt-0.5">
                      {item.desc}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Medical Disclaimer Banner */}
        <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px] flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            <strong>Disclaimer:</strong> {advisory.disclaimer}
          </span>
        </div>
      </div>
    </section>
  );
};
