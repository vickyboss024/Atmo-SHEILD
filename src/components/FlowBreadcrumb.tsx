import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FlowBreadcrumbProps {
  activeStep?: string;
  onStepClick?: (stepId: string) => void;
}

const STEPS = [
  { id: 'veterinary', label: 'VET & PET CARE', emoji: '🐾', href: '#veterinary-pets' },
  { id: 'domestic-garden', label: 'GARDEN & FRESH AIR', emoji: '🌿', href: '#domestic-garden' },
  { id: 'doctor-assistant', label: 'HEALTH COMPANION', emoji: '🩺', href: '#doctor-assistant' },
  { id: 'aqi', label: 'LIVE AQI & GAUGE', emoji: '🌫️', href: '#live-aqi' },
  { id: 'location', label: 'LOCATION SEARCH', emoji: '📍', href: '#nearby' },
  { id: 'history', label: 'HISTORY', emoji: '📊', href: '#history' },
];

export const FlowBreadcrumb: React.FC<FlowBreadcrumbProps> = () => {
  return (
    <div className="hidden xl:block w-full bg-white/70 border-b border-slate-200/70 py-2.5 px-4 overflow-x-auto">
      <div className="max-w-7xl mx-auto flex items-center justify-between min-w-max text-xs font-semibold text-slate-500 gap-2 sm:gap-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pl-1">
          Dashboard Flow:
        </span>
        <div className="flex items-center gap-1 sm:gap-2">
          {STEPS.map((step, idx) => (
            <React.Fragment key={step.id}>
              <a
                href={step.href}
                className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-emerald-50 hover:text-emerald-800 transition-colors text-slate-700"
              >
                <span>{step.emoji}</span>
                <span className="font-bold tracking-tight text-[11px]">{step.label}</span>
              </a>
              {idx < STEPS.length - 1 && (
                <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
