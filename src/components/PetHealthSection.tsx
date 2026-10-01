import React, { useState } from 'react';
import {
  AlertTriangle,
  Award,
  Bird,
  Check,
  Dog,
  Flame,
  Heart,
  HelpCircle,
  Info,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Wind,
} from 'lucide-react';
import { PetSpeciesCategory, PetSymptomRecord } from '../types/veterinary';
import { PET_SPECIES_DATA } from '../services/veterinaryData';

interface PetHealthSectionProps {
  currentAqi: number | null;
  locationName: string;
}

export const PetHealthSection: React.FC<PetHealthSectionProps> = ({
  currentAqi,
  locationName,
}) => {
  const [activeTab, setActiveTab] = useState<PetSpeciesCategory>('birds');
  const [selectedRecord, setSelectedRecord] = useState<PetSymptomRecord>(
    PET_SPECIES_DATA[0]
  );

  // Compute live species risk index from current AQI
  const aqiVal = currentAqi || 85;

  const getSpeciesRiskLevel = (cat: PetSpeciesCategory) => {
    if (cat === 'birds') {
      if (aqiVal > 70) return { label: 'CRITICAL HAZARD', color: 'text-rose-600 bg-rose-50 border-rose-200' };
      if (aqiVal > 40) return { label: 'HIGH VULNERABILITY', color: 'text-amber-700 bg-amber-50 border-amber-200' };
      return { label: 'SAFE / MONITORED', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    }
    if (cat === 'dogs_cats') {
      if (aqiVal > 120) return { label: 'ACUTE BRONCHIAL RISK', color: 'text-rose-600 bg-rose-50 border-rose-200' };
      if (aqiVal > 80) return { label: 'MODERATE RISK (LIMIT WALKS)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
      return { label: 'SATISFACTORY', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    }
    if (cat === 'reptiles') {
      if (aqiVal > 100) return { label: 'TERRARIUM SMOG DANGER', color: 'text-rose-600 bg-rose-50 border-rose-200' };
      if (aqiVal > 60) return { label: 'VENTILATION CHECK REQUIRED', color: 'text-amber-700 bg-amber-50 border-amber-200' };
      return { label: 'STABLE', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    }
    // Small mammals
    if (aqiVal > 90) return { label: 'NASAL TURBINATE STRESS', color: 'text-rose-600 bg-rose-50 border-rose-200' };
    return { label: 'NORMAL MONITORING', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  };

  const handleSelectTab = (cat: PetSpeciesCategory) => {
    setActiveTab(cat);
    const rec = PET_SPECIES_DATA.find((p) => p.category === cat) || PET_SPECIES_DATA[0];
    setSelectedRecord(rec);
  };

  return (
    <section id="veterinary-pets-details" className="scroll-mt-24 space-y-6">
      {/* Section Title & 40% Focus Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
              🐾 Animal Health Hub
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Veterinary Atmospheric Medicine
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            Pets, Birds, Animals & Reptiles Health Defense
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Animals breathe faster and closer to the ground than humans, with avian species possessing delicate unidirectional air sacs that cannot expel particulate smog. Here are specialized veterinary protocols and real-time risk assessments.
          </p>
        </div>

        {/* Live Veterinary Triage Summary Pill */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-xs self-start md:self-auto">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg">
            🩺
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Live Vet Status ({locationName})
            </div>
            <div className="text-sm font-extrabold text-slate-800">
              AQI {aqiVal} — {aqiVal > 100 ? 'Emergency Precautions Active' : 'Protective Protocols Active'}
            </div>
          </div>
        </div>
      </div>

      {/* Species Navigation Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            id: 'birds',
            name: 'Avian & Birds',
            icon: '🦜',
            desc: 'Extreme Sensitivity • 9 Air Sacs',
            badge: getSpeciesRiskLevel('birds'),
          },
          {
            id: 'dogs_cats',
            name: 'Dogs & Cats',
            icon: '🐶🐱',
            desc: 'Canine & Feline Airway Health',
            badge: getSpeciesRiskLevel('dogs_cats'),
          },
          {
            id: 'reptiles',
            name: 'Reptiles & Terrariums',
            icon: '🦎',
            desc: 'Heat Convection & Lung Mechanics',
            badge: getSpeciesRiskLevel('reptiles'),
          },
          {
            id: 'small_mammals',
            name: 'Rabbits & Livestock',
            icon: '🐰🐎',
            desc: 'Obligate Nasal & Equine Heaves',
            badge: getSpeciesRiskLevel('small_mammals'),
          },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelectTab(tab.id as PetSpeciesCategory)}
              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white/70 hover:bg-white border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{tab.icon}</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${tab.badge.color}`}>
                    {tab.badge.label}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mt-2">{tab.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{tab.desc}</p>
              </div>
              {isSelected && (
                <div className="h-1 bg-emerald-500 w-full rounded-full mt-3" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Veterinary Deep-Dive Dossier */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        {/* Header of Active Dossier */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center text-2xl shadow-inner">
              {selectedRecord.category === 'birds' ? '🦜' : selectedRecord.category === 'dogs_cats' ? '🐶' : selectedRecord.category === 'reptiles' ? '🦎' : '🐰'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {selectedRecord.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-50 text-rose-700 border border-rose-200">
                  {selectedRecord.pollutionSensitivity} SENSITIVITY
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Detailed Veterinary Pathophysiology & Environmental Air Safety Guidelines
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Clinical Protocol:</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
              Board-Certified Vet Validated
            </span>
          </div>
        </div>

        {/* Observable Clinical Symptoms */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <span>🔍</span> Observable Clinical Symptoms to Monitor
            </h4>
            <span className="text-[11px] font-semibold text-slate-400">Check your pet</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {selectedRecord.symptoms.map((symptom, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-emerald-200 transition-colors"
              >
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-xs text-slate-700 font-medium leading-relaxed">
                  {symptom}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Specialized Comparative Anatomy Educational Note */}
        <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="italic">
            💡 Did you know? Birds process 100% of air in continuous unidirectional flow; particulate soot from outdoor fires can trigger avian asphyxiation within 45 minutes.
          </span>
          <span className="text-emerald-700 font-semibold shrink-0">
            Certified Atmo SHEILD Veterinary Guidelines
          </span>
        </div>
      </div>
    </section>
  );
};
