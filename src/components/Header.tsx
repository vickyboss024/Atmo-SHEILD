import React, { useState } from 'react';
import {
  ArrowRight,
  Bell,
  BellOff,
  Bookmark,
  Check,
  ChevronDown,
  Compass,
  Menu,
  Sparkles,
  User,
  UserCheck,
  X,
} from 'lucide-react';
import { UserProfile } from '../types/aqi';

interface HeaderProps {
  userProfile: UserProfile;
  onOpenAuth: () => void;
  onToggleAlerts: () => void;
  onSaveWebsite: () => void;
  isSavedNotification: boolean;
  hasActiveHighAlert: boolean;
}

const DASHBOARD_FLOW_STEPS = [
  { id: 'veterinary-pets', label: 'VET & PET CARE', emoji: '🐾', href: '#veterinary-pets', desc: 'Pet symptoms & domestic garden bio-filter' },
  { id: 'domestic-garden', label: 'GARDEN & FRESH AIR', emoji: '🌿', href: '#domestic-garden', desc: 'Room oxygen calculator & plant guide' },
  { id: 'doctor-assistant', label: 'HEALTH COMPANION', emoji: '🩺', href: '#doctor-assistant', desc: 'Human respiratory & chronic disease triage' },
  { id: 'live-aqi', label: 'LIVE AQI & GAUGE', emoji: '🌫️', href: '#live-aqi', desc: 'Real-time circular telemetry & pollutants' },
  { id: 'nearby', label: 'LOCATION SEARCH', emoji: '📍', href: '#nearby', desc: 'Nearby stations & alphabetical cities' },
  { id: 'history', label: 'HISTORY & ANALYTICS', emoji: '📊', href: '#history', desc: 'Hourly trend & 24h peak pollution data' },
];

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  onOpenAuth,
  onToggleAlerts,
  onSaveWebsite,
  isSavedNotification,
  hasActiveHighAlert,
}) => {
  // Mobile & Tablet Dashboard Flow toggle menu state
  const [isFlowMenuOpen, setIsFlowMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left Top Corner: Dashboard Flow Toggle Menu (Mobile/Tablet) + Logo and Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile & Tablet Dashboard Flow Toggle Menu Button */}
          <div className="xl:hidden">
            <button
              type="button"
              onClick={() => setIsFlowMenuOpen((prev) => !prev)}
              aria-expanded={isFlowMenuOpen}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/90 transition-all text-xs font-black shadow-xs active:scale-95"
              title="Toggle Dashboard Flow Navigation"
              aria-label="Toggle Dashboard Flow Menu"
            >
              <Menu className="w-4 h-4 text-emerald-700" />
              <span className="font-extrabold text-[11px] text-emerald-950 uppercase tracking-tight">Flow</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-emerald-600 transition-transform duration-200 ${
                  isFlowMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          {/* Logo Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20 shrink-0">
            <span className="text-xl">🌿</span>
          </div>

          {/* Brand Name */}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900">
                Atmo <span className="text-emerald-600 font-black">SHEILD</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase tracking-wider">
                <Sparkles className="w-2.5 h-2.5 text-emerald-500" /> AI Advisory
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-500 font-medium">
              Real-time Air Pollution & Health Advisory
            </p>
          </div>
        </div>

        {/* Quick Nav Anchors (Desktop) */}
        <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold text-slate-600">
          <a
            href="#veterinary-pets"
            className="px-2.5 py-1.5 rounded-lg hover:text-emerald-700 hover:bg-emerald-50/70 transition-colors font-bold text-emerald-800"
          >
            🐾 Vet & Pets
          </a>
          <a
            href="#domestic-garden"
            className="px-2.5 py-1.5 rounded-lg hover:text-teal-700 hover:bg-teal-50/70 transition-colors font-bold text-teal-800"
          >
            🌿 Domestic Garden
          </a>
          <a
            href="#doctor-assistant"
            className="px-2.5 py-1.5 rounded-lg hover:text-blue-700 hover:bg-blue-50/70 transition-colors font-bold text-blue-800"
          >
            🩺 Health Companion
          </a>
          <a
            href="#live-aqi"
            className="px-2.5 py-1.5 rounded-lg hover:text-emerald-700 hover:bg-emerald-50/70 transition-colors"
          >
            🌫️ Live AQI
          </a>
          <a
            href="#nearby"
            className="px-2.5 py-1.5 rounded-lg hover:text-emerald-700 hover:bg-emerald-50/70 transition-colors"
          >
            📍 Location
          </a>
          <a
            href="#history"
            className="px-2.5 py-1.5 rounded-lg hover:text-emerald-700 hover:bg-emerald-50/70 transition-colors"
          >
            📊 History
          </a>
        </nav>

        {/* Right Action Items */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Save Website / Snapshot Button */}
          <button
            onClick={onSaveWebsite}
            title="Save current website state and bookmarks"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isSavedNotification
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            {isSavedNotification ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-800 font-bold">Saved!</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden md:inline">Save Site</span>
              </>
            )}
          </button>

          {/* Pollution Alert Bell */}
          <button
            onClick={onToggleAlerts}
            title={userProfile.alerts_enabled ? 'Pollution Alerts: ON' : 'Pollution Alerts: OFF'}
            className={`relative p-2 rounded-lg border transition-all ${
              userProfile.alerts_enabled
                ? hasActiveHighAlert
                  ? 'bg-rose-50 text-rose-600 border-rose-300 animate-pulse'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70'
                : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600'
            }`}
          >
            {userProfile.alerts_enabled ? (
              <Bell className="w-4 h-4" />
            ) : (
              <BellOff className="w-4 h-4" />
            )}
            {hasActiveHighAlert && userProfile.alerts_enabled && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white" />
            )}
          </button>

          {/* Sign In / Log In and Guest User on Top Right */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 pl-2.5 pr-3 py-1.5 rounded-full border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50 shadow-sm transition-all"
          >
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              {userProfile.isGuest ? (
                <User className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              )}
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold text-slate-800 leading-tight">
                {userProfile.isGuest ? 'Guest User' : userProfile.username}
              </span>
              <span className="block text-[9px] font-medium text-emerald-600 uppercase tracking-wider">
                {userProfile.isGuest ? 'Sign in / Log in' : 'Profile'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* MOBILE & TABLET DASHBOARD FLOW TOGGLE MENU DRAWER */}
      {isFlowMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 xl:hidden animate-fade-in"
            onClick={() => setIsFlowMenuOpen(false)}
          />

          {/* Drawer Panel pinned to the Left Top Corner */}
          <div className="fixed top-3 left-3 right-3 sm:right-auto sm:w-88 max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-emerald-200/90 z-50 overflow-hidden flex flex-col xl:hidden">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-100" />
                <span className="font-extrabold text-sm tracking-tight">Dashboard Flow</span>
              </div>
              <button
                onClick={() => setIsFlowMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors"
                aria-label="Close flow menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-banner */}
            <div className="px-4 py-2 bg-emerald-50/80 border-b border-emerald-100 text-[11px] text-emerald-900 font-semibold flex items-center justify-between">
              <span>Tap any step to jump directly</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200/80 font-black text-emerald-900">
                6 Steps
              </span>
            </div>

            {/* Step Links */}
            <div className="p-2.5 space-y-1.5 overflow-y-auto max-h-[calc(85vh-95px)]">
              {DASHBOARD_FLOW_STEPS.map((step, idx) => (
                <a
                  key={step.id}
                  href={step.href}
                  onClick={() => setIsFlowMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 active:bg-emerald-100 text-slate-800 hover:text-emerald-950 transition-all border border-slate-100 hover:border-emerald-200 group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-xs font-black text-emerald-800 transition-colors shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xl shrink-0">{step.emoji}</span>
                    <div className="text-left">
                      <div className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-900">
                        {step.label}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium line-clamp-1">
                        {step.desc}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </header>
  );
};
