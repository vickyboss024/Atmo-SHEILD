import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  HeartPulse,
  Info,
  Pill,
  Search,
  Shield,
  Sparkles,
  Stethoscope,
  X,
} from 'lucide-react';
import { HUMAN_DISEASE_PROFILES } from '../services/veterinaryData';
import { HumanDiseaseProfile } from '../types/veterinary';

interface HumanDoctorAssistantProps {
  currentAqi: number | null;
  locationName: string;
}

interface DiseaseSearchResult {
  disease: HumanDiseaseProfile;
  score: number;
  matchedReason: string;
}

export const HumanDoctorAssistantSection: React.FC<HumanDoctorAssistantProps> = ({
  currentAqi,
  locationName,
}) => {
  // Standalone Human Health Companion Concern Search Bar state
  const [doctorQuery, setDoctorQuery] = useState('');
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string>('asthma');

  // AI Backend Consultation states
  const [aiConsultation, setAiConsultation] = useState<string | null>(null);
  const [isConsultingAi, setIsConsultingAi] = useState(false);
  const [aiConsultationQuery, setAiConsultationQuery] = useState('');

  // Smart Multi-Token Search Engine for Health Companion
  const searchResults: DiseaseSearchResult[] = useMemo(() => {
    const raw = doctorQuery.trim().toLowerCase();
    const tokens = raw.split(/[\s,+/.-]+/).filter((t) => t.length > 1);

    if (!raw) {
      return HUMAN_DISEASE_PROFILES.map((d) => ({
        disease: d,
        score: 10,
        matchedReason: 'All chronic health conditions',
      }));
    }

    const isAsthmaQuery = tokens.some((t) =>
      ['asthma', 'inhaler', 'albuterol', 'wheezing', 'spacer', 'pef', 'bronchospasm'].includes(t)
    );
    const isCopdQuery = tokens.some((t) =>
      ['copd', 'emphysema', 'bronchitis', 'sputum', 'oxygen', 'spo2', 'concentrator', 'phlegm'].includes(t)
    );
    const isCardioQuery = tokens.some((t) =>
      ['heart', 'cardiovascular', 'hypertension', 'blood pressure', 'bp', 'stroke', 'chest pain', 'angina'].includes(t)
    );
    const isChildQuery = tokens.some((t) =>
      ['child', 'children', 'kid', 'kids', 'baby', 'pediatric', 'school', 'playground'].includes(t)
    );

    const matches: DiseaseSearchResult[] = [];

    HUMAN_DISEASE_PROFILES.forEach((dis) => {
      let score = 0;
      const reasons: string[] = [];

      // Category semantic boosts
      if (isAsthmaQuery && dis.id === 'asthma') {
        score += 80;
        reasons.push('Asthma & Inhaler match');
      }
      if (isCopdQuery && dis.id === 'copd') {
        score += 80;
        reasons.push('COPD & Pulmonary match');
      }
      if (isCardioQuery && dis.id === 'cardiovascular') {
        score += 80;
        reasons.push('Cardiovascular & Blood Pressure match');
      }
      if (isChildQuery && dis.id === 'pediatric') {
        score += 80;
        reasons.push('Pediatric child lung health match');
      }

      // Name match
      const nameLower = dis.diseaseName.toLowerCase();
      if (nameLower.includes(raw)) {
        score += 70;
        reasons.push(`Direct condition name: ${dis.diseaseName}`);
      } else {
        tokens.forEach((t) => {
          if (nameLower.includes(t)) {
            score += 25;
            reasons.push(`Matches keyword "${t}"`);
          }
        });
      }

      // Impact match
      const impactLower = dis.clinicalImpact.toLowerCase();
      tokens.forEach((t) => {
        if (impactLower.includes(t)) {
          score += 15;
          reasons.push(`Clinical impact match: "${t}"`);
        }
      });

      // Precautions match
      dis.doctorAssistantPrecautions.forEach((p) => {
        const pLower = p.toLowerCase();
        if (pLower.includes(raw)) {
          score += 35;
          reasons.push(`Precaution: "${p}"`);
        } else {
          tokens.forEach((t) => {
            if (pLower.includes(t)) {
              score += 12;
            }
          });
        }
      });

      // Medication / inhaler advice
      const medLower = dis.medicationInhalerAdvice.toLowerCase();
      tokens.forEach((t) => {
        if (medLower.includes(t)) {
          score += 20;
          reasons.push('Medication & Inhaler protocol');
        }
      });

      // Emergency symptoms
      dis.emergencySymptoms.forEach((em) => {
        const emLower = em.toLowerCase();
        if (emLower.includes(raw)) {
          score += 30;
          reasons.push(`Emergency red flag: "${em}"`);
        } else {
          tokens.forEach((t) => {
            if (emLower.includes(t)) {
              score += 10;
            }
          });
        }
      });

      if (score > 0) {
        matches.push({
          disease: dis,
          score,
          matchedReason: reasons[0] || 'Matches environmental air health concerns',
        });
      }
    });

    matches.sort((a, b) => b.score - a.score);
    return matches;
  }, [doctorQuery]);

  // Active disease to display in the main dossier
  const activeDisease: HumanDiseaseProfile = useMemo(() => {
    if (doctorQuery.trim() && searchResults.length > 0) {
      return searchResults[0].disease;
    }
    return (
      HUMAN_DISEASE_PROFILES.find((d) => d.id === selectedDiseaseId) ||
      HUMAN_DISEASE_PROFILES[0]
    );
  }, [doctorQuery, searchResults, selectedDiseaseId]);

  const aqiVal = currentAqi || 85;
  const isAqiExceeded = aqiVal >= activeDisease.aqiThresholdWarning;

  const requestHumanAiConsultation = async (customQuery?: string) => {
    const q = (customQuery !== undefined ? customQuery : doctorQuery).trim();
    if (!q) return;

    setIsConsultingAi(true);
    setAiConsultationQuery(q);

    try {
      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          mode: 'human',
          currentAqi,
          locationName,
        }),
      });

      const data = await res.json();
      if (res.ok && data.consultation) {
        setAiConsultation(data.consultation);
      }
    } catch (err: any) {
      console.warn('Human AI consultation API error:', err);
    } finally {
      setIsConsultingAi(false);
    }
  };

  const handleDiseaseSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      setSelectedDiseaseId(searchResults[0].disease.id);
    }
    if (doctorQuery.trim()) {
      requestHumanAiConsultation(doctorQuery);
    }
  };

  return (
    <section id="doctor-assistant" className="scroll-mt-24 space-y-6">
      {/* Header with Health Companion Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide uppercase bg-blue-100 text-blue-800 border border-blue-200">
              🩺 Health Companion
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Human Respiratory & Chronic Disease Triage
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            Human Disease Precautions & Health Companion
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Acting as your personal health companion: Clinical evidence-based precautions for Asthma, COPD, Hypertension, Cardiovascular disease, and pediatric lung development during environmental smog.
          </p>
        </div>

        {/* Clinical Triage Status Indicator */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-xs self-start md:self-auto text-xs font-bold text-slate-800">
          <Stethoscope className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-black">
              Health Companion Mode
            </div>
            <div>Active Clinical Triage & Inhaler Guidance</div>
          </div>
        </div>
      </div>

      {/* SEPARATE DOCTOR CONCERN SEARCH BAR (Upper Part of Health Companion Section) */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-blue-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <Search className="w-4 h-4" />
            <span>Dedicated Health Companion & Symptom Search</span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Location search is kept separate below
          </span>
        </div>

        <form onSubmit={handleDiseaseSearch} className="relative">
          <div className="flex items-center bg-slate-800/90 rounded-xl border border-blue-400/40 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all overflow-hidden">
            <input
              type="text"
              value={doctorQuery}
              onChange={(e) => setDoctorQuery(e.target.value)}
              placeholder="Search condition or symptom: e.g. 'Asthma attack', 'Inhaler', 'COPD oxygen', 'Chest pain', 'Child coughing'..."
              className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none min-w-0"
            />
            {doctorQuery && (
              <button
                type="button"
                onClick={() => setDoctorQuery('')}
                className="p-1 text-slate-400 hover:text-white transition-colors mr-1"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick Chronic Condition Selector Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-medium mr-1">Select Chronic Condition:</span>
          {HUMAN_DISEASE_PROFILES.map((dis) => (
            <button
              key={dis.id}
              onClick={() => {
                setSelectedDiseaseId(dis.id);
                setDoctorQuery('');
              }}
              className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                activeDisease.id === dis.id && !doctorQuery.trim()
                  ? 'bg-blue-600 text-white border-blue-500 shadow-sm font-bold'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white'
              }`}
            >
              {dis.diseaseName.split('&')[0].trim()}
            </button>
          ))}
        </div>

        {/* LIVE SEARCH RESULTS CHIPS */}
        {doctorQuery.trim() && (
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Search Results ({searchResults.length} matching "{doctorQuery}"):
              </span>
              <button
                type="button"
                onClick={() => setDoctorQuery('')}
                className="text-[11px] text-slate-400 hover:text-white underline"
              >
                Reset
              </button>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                {searchResults.map(({ disease, matchedReason }) => {
                  const isSelected = activeDisease.id === disease.id;
                  return (
                    <button
                      key={disease.id}
                      type="button"
                      onClick={() => {
                        setSelectedDiseaseId(disease.id);
                      }}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-blue-900/60 border-blue-400 shadow-md ring-1 ring-blue-400/50'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-500'
                      }`}
                    >
                      <div className="font-extrabold text-xs text-white line-clamp-1">
                        {disease.diseaseName}
                      </div>
                      <div className="text-[11px] text-blue-300 mt-1 line-clamp-1">
                        ✓ {matchedReason}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-800/80 text-center space-y-1">
                <p className="text-xs text-amber-300 font-semibold">
                  No direct condition found matching "{doctorQuery}".
                </p>
                <p className="text-[11px] text-slate-400">
                  Try searching: "Asthma inhaler", "COPD oxygen", "Chest pain", "Child coughing", or "Blood pressure".
                </p>
              </div>
            )}
          </div>
        )}

        {/* LIVE AI GEMINI HEALTH COMPANION CONSULTATION */}
        {isConsultingAi && (
          <div className="p-4 rounded-xl bg-slate-800/90 border border-blue-500/40 flex items-center gap-3 animate-pulse text-xs text-blue-300">
            <Sparkles className="w-5 h-5 text-blue-400 animate-spin shrink-0" />
            <div>
              <div className="font-bold text-white">
                Consulting Gemini AI Pulmonologist...
              </div>
              <div className="text-[11px] text-slate-300">
                Synthesizing evidence-based precautions for &ldquo;{aiConsultationQuery}&rdquo; under local AQI: {currentAqi ?? 'live'}...
              </div>
            </div>
          </div>
        )}

        {aiConsultation && (
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-blue-400/50 shadow-2xl space-y-3 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-500/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-blue-500/20 text-blue-300">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </span>
                <div>
                  <h4 className="font-extrabold text-sm text-blue-200">
                    Clinical AI Consultation: &ldquo;{aiConsultationQuery}&rdquo;
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    WHO Pulmonology Standards • Grounded with Live AQI ({currentAqi ?? 'Live'}) in {locationName}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAiConsultation(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Dismiss AI Consultation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800 font-sans">
              {aiConsultation}
            </div>

            <div className="text-[10px] text-slate-400 italic flex items-center justify-between pt-1">
              <span>Evidence-based atmospheric triage advisory.</span>
              <button
                type="button"
                onClick={() => requestHumanAiConsultation(aiConsultationQuery)}
                className="text-blue-400 hover:text-blue-300 font-bold underline"
              >
                Re-consult AI Pulmonologist ↻
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ACTIVE HEALTH COMPANION DOSSIER */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        {/* Header of Dossier */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Clinical Pathology Profile
              </span>
              <span className="text-xs text-slate-400">
                Category: {activeDisease.category.toUpperCase()}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {activeDisease.diseaseName}
            </h3>
          </div>

          {/* Real-time Vulnerability Alert Status */}
          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wide border ${
              isAqiExceeded
                ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <div>
              <span className="block leading-tight">
                {isAqiExceeded
                  ? `Threshold Exceeded (AQI ${aqiVal} > ${activeDisease.aqiThresholdWarning})`
                  : `Safe Zone (AQI ${aqiVal} ≤ ${activeDisease.aqiThresholdWarning})`}
              </span>
              <span className="text-[10px] font-normal normal-case block text-slate-500">
                Warning triggers above AQI {activeDisease.aqiThresholdWarning}
              </span>
            </div>
          </div>
        </div>

        {/* Pathophysiology Impact Box */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-1.5">
            <Activity className="w-4 h-4 text-blue-600" />
            Pathophysiology Under High Particulate Smog
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {activeDisease.clinicalImpact}
          </p>
        </div>

        {/* Two-Column Clinical Grid: Doctor Precautions vs Medication/Inhaler Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Health Companion Precautions List */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-blue-600" />
              <span>Physician-Directed Daily Precautions</span>
            </h4>
            <div className="space-y-2">
              {activeDisease.doctorAssistantPrecautions.map((precaution, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/40 border border-blue-100 text-xs text-slate-700 leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{precaution}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Medication & Inhaler Technique Advice */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Pill className="w-4 h-4 text-emerald-600" />
              <span>Medication & Device Technique Advice</span>
            </h4>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2 text-xs text-emerald-950">
              <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Health Companion Clinical Directive:</span>
              </div>
              <p className="leading-relaxed font-medium">
                {activeDisease.medicationInhalerAdvice}
              </p>
            </div>

            {/* Home Shield Clean Air Steps */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-slate-500" />
                <span>Home Isolation & Filtration Measures:</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1">
                {activeDisease.homeShieldSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Emergency Red Flags (When to Go to the Emergency Room) */}
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
          <div className="flex items-center gap-2 text-rose-800 font-extrabold text-xs uppercase tracking-wider mb-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Emergency Red Flags (Immediate Hospital / ER Visit Required)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-rose-900 font-medium">
            {activeDisease.emergencySymptoms.map((em, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-white/80 p-2.5 rounded-lg border border-rose-200"
              >
                <span className="text-rose-500 font-bold">⚠️</span>
                <span>{em}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-[11px] text-slate-400 italic border-t border-slate-100 pt-3">
          Disclaimer: This Health Companion module provides atmospheric health precautions based on WHO and pulmonology guidelines. Always follow your licensed personal physician's personalized prescription plan.
        </div>
      </div>
    </section>
  );
};
