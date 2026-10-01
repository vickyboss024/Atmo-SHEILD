import React from 'react';
import { AlertTriangle, Bell, BellOff, X } from 'lucide-react';

interface AlertBannerProps {
  locationName: string;
  aqi: number;
  alertsEnabled: boolean;
  onToggleAlerts: () => void;
  onDismiss: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  locationName,
  aqi,
  alertsEnabled,
  onToggleAlerts,
  onDismiss,
}) => {
  if (!alertsEnabled) return null;

  return (
    <div className="bg-rose-500 text-white px-4 py-3 shadow-md border-b border-rose-600 transition-all animate-in slide-in-from-top duration-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center shrink-0 shadow-xs animate-bounce">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xs uppercase tracking-wider text-rose-100 bg-rose-700/60 px-2 py-0.5 rounded">
                ⚠️ AIR QUALITY ALERT
              </span>
              <span className="text-xs font-bold bg-white text-rose-700 px-2 py-0.5 rounded-full">
                AQI {aqi} • HIGH 🔴
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold mt-0.5 text-white/95">
              Air pollution is currently high in <span className="underline font-bold">{locationName}</span>. Consider reducing prolonged outdoor exposure.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleAlerts}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors flex items-center gap-1.5"
          >
            <BellOff className="w-3.5 h-3.5" />
            <span>Mute Alerts</span>
          </button>
          <button
            onClick={onDismiss}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
