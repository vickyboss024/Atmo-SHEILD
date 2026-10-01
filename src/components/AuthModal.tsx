import React, { useState } from 'react';
import { Check, LogIn, Sparkles, User, UserCheck, X } from 'lucide-react';
import { SensitivityGroupId, UserProfile } from '../types/aqi';
import { SENSITIVITY_OPTIONS } from '../services/apiService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  currentLocationName: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  currentLocationName,
}) => {
  const [username, setUsername] = useState(userProfile.username);
  const [email, setEmail] = useState(userProfile.email || '');
  const [group, setGroup] = useState<SensitivityGroupId>(userProfile.sensitivity_group);
  const [alerts, setAlerts] = useState(userProfile.alerts_enabled);
  const [mode, setMode] = useState<'signin' | 'guest'>(
    userProfile.isGuest ? 'guest' : 'signin'
  );

  if (!isOpen) return null;

  const handleSaveSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      isGuest: false,
      username: username.trim() || 'Active Citizen',
      email: email.trim(),
      sensitivity_group: group,
      alerts_enabled: alerts,
      saved_location: currentLocationName,
    });
    onClose();
  };

  const handleContinueAsGuest = () => {
    onUpdateProfile({
      isGuest: true,
      username: 'Guest User',
      sensitivity_group: group,
      alerts_enabled: alerts,
      saved_location: currentLocationName,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              👤
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">User Authentication</h3>
              <p className="text-xs text-slate-500">Sign in or continue as a guest user</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1 m-4 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            onClick={() => setMode('signin')}
            className={`py-2 rounded-lg transition-all ${
              mode === 'signin'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In / Profile
          </button>
          <button
            onClick={() => setMode('guest')}
            className={`py-2 rounded-lg transition-all ${
              mode === 'guest'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Guest User Mode
          </button>
        </div>

        {/* Form Body */}
        {mode === 'signin' ? (
          <form onSubmit={handleSaveSignIn} className="p-5 pt-0 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Environmental Health User"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Email (for daily advisory alerts)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Your Sensitivity Group
              </label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value as SensitivityGroupId)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
              >
                {SENSITIVITY_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.emoji} {opt.name} — {opt.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  High Pollution Warnings
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Trigger banners when AQI &gt; 100
                </span>
              </div>
              <input
                type="checkbox"
                checked={alerts}
                onChange={(e) => setAlerts(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all"
            >
              Save Profile & Sign In
            </button>
          </form>
        ) : (
          <div className="p-5 pt-0 space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/70 text-center">
              <span className="text-3xl block mb-2">👤</span>
              <h4 className="text-sm font-bold text-emerald-950">Guest Browsing Active</h4>
              <p className="text-xs text-emerald-800 mt-1">
                You can monitor all stations, test the IoT detector, receive AI advisories, and explore weekly history without registering.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Quick Sensitivity Filter
              </label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value as SensitivityGroupId)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
              >
                {SENSITIVITY_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.emoji} {opt.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleContinueAsGuest}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              Continue as Guest User
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
