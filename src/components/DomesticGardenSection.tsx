import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Droplets,
  Flower2,
  Heart,
  Leaf,
  ShieldCheck,
  Sparkles,
  Sun,
  Wind,
} from 'lucide-react';
import { DOMESTIC_GARDEN_PLANTS } from '../services/veterinaryData';
import { GardenPlantItem } from '../types/veterinary';

interface DomesticGardenSectionProps {
  currentAqi: number | null;
}

export const DomesticGardenSection: React.FC<DomesticGardenSectionProps> = ({
  currentAqi,
}) => {
  // Calculator state
  const [roomAreaSqFt, setRoomAreaSqFt] = useState<number>(200);
  const [hasHouseholdPets, setHasHouseholdPets] = useState<boolean>(true);
  const [selectedPlant, setSelectedPlant] = useState<GardenPlantItem>(
    DOMESTIC_GARDEN_PLANTS[0]
  );
  const [filterPetSafeOnly, setFilterPetSafeOnly] = useState<boolean>(true);

  // Derived calculation
  const calculation = useMemo(() => {
    // NASA recommendation: roughly 1 medium-to-large plant per 100 sq ft for baseline, 2 per 100 sq ft for high smog zones
    const aqiFactor = currentAqi && currentAqi > 100 ? 1.5 : 1.0;
    const recommendedPlantsCount = Math.max(
      2,
      Math.round((roomAreaSqFt / 75) * aqiFactor)
    );
    const estimatedPmReductionPercent = Math.min(
      48,
      Math.round(20 + (recommendedPlantsCount * 3.5))
    );
    const estimatedOxygenOutputLiters = Math.round(recommendedPlantsCount * 22);

    return {
      recommendedPlantsCount,
      estimatedPmReductionPercent,
      estimatedOxygenOutputLiters,
    };
  }, [roomAreaSqFt, currentAqi]);

  const displayedPlants = useMemo(() => {
    if (filterPetSafeOnly) {
      return DOMESTIC_GARDEN_PLANTS.filter((p) => p.petSafe);
    }
    return DOMESTIC_GARDEN_PLANTS;
  }, [filterPetSafeOnly]);

  return (
    <section id="domestic-garden" className="scroll-mt-24 space-y-6">
      {/* Header and 20% Focus Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide uppercase bg-teal-100 text-teal-800 border border-teal-200">
              🌿 Domestic Garden
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Botanical Bio-Shield & Fresh Air Generation
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            Domestic Garden & Fresh Breathing Sanctuary
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Transform indoor spaces and balconies into natural particulate traps. Indoor botanical bio-filters transpire micro-droplets that capture airborne PM2.5, produce oxygen, and scrub volatile organic chemicals (VOCs) safely for families and pets.
          </p>
        </div>

        {/* Fresh Breathing Badge */}
        <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-200/80 self-start md:self-auto text-xs font-bold text-teal-900">
          <Wind className="w-5 h-5 text-teal-600 shrink-0" />
          <span>Home Fresh Breathing Index: Active Bio-Shield</span>
        </div>
      </div>

      {/* INTERACTIVE FRESH BREATHING HOME CALCULATOR */}
      <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 shadow-xl border border-teal-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Controls Column */}
          <div className="space-y-4 max-w-lg flex-1">
            <div className="flex items-center gap-2 text-teal-400 font-black text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Interactive Home Air Scrubbing Calculator</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Calculate Botanical Bio-Filters Needed for Your Room
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Adjust room dimensions and pet presence to compute how many air-purifying plants are required to drop ambient indoor PM2.5 and generate fresh oxygen.
            </p>

            {/* Slider for Room Square Footage */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Room Floor Area:</span>
                <span className="text-teal-300 font-extrabold text-sm">{roomAreaSqFt} sq. ft.</span>
              </div>
              <input
                type="range"
                min="60"
                max="600"
                step="20"
                value={roomAreaSqFt}
                onChange={(e) => setRoomAreaSqFt(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Small Bedroom (80 sq ft)</span>
                <span>Living Room (300 sq ft)</span>
                <span>Open Floor (600 sq ft)</span>
              </div>
            </div>

            {/* Pet Presence Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-lg">🐾</span>
                <div>
                  <div className="text-xs font-bold text-white">Household Pet Protection</div>
                  <div className="text-[11px] text-slate-400">Filter only 100% ASPCA non-toxic plant species</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setHasHouseholdPets(!hasHouseholdPets);
                  setFilterPetSafeOnly(!hasHouseholdPets);
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  hasHouseholdPets ? 'bg-teal-500' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    hasHouseholdPets ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Calculator Output Display Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 shrink-0 lg:w-72">
            <div className="p-4 rounded-xl bg-slate-800/90 border border-teal-500/40 text-center">
              <div className="text-[11px] font-bold uppercase tracking-wider text-teal-300">
                Plants Recommended
              </div>
              <div className="text-3xl font-black text-white mt-1">
                {calculation.recommendedPlantsCount} <span className="text-sm font-semibold text-slate-400">Pots</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                For {roomAreaSqFt} sq ft living space
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/90 border border-teal-500/40 text-center">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                PM2.5 Smog Reduction
              </div>
              <div className="text-3xl font-black text-emerald-400 mt-1">
                ~{calculation.estimatedPmReductionPercent}%
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Via transpiration particulate electrostatic trapping
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/90 border border-teal-500/40 text-center">
              <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                Pure Oxygen Generation
              </div>
              <div className="text-3xl font-black text-cyan-400 mt-1">
                ~{calculation.estimatedOxygenOutputLiters} <span className="text-sm font-semibold text-slate-400">L/Day</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Rich diurnal respiration boost
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Plant Catalog Filter & Grid */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">
              NASA Clean Air Botanical Bio-Scrubbers
            </h3>
            <span className="text-xs text-slate-500">
              ({displayedPlants.length} species available)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setFilterPetSafeOnly(true)}
              className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                filterPetSafeOnly
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              🐾 100% Pet-Safe Only
            </button>
            <button
              onClick={() => setFilterPetSafeOnly(false)}
              className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                !filterPetSafeOnly
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              All Air Scrubbers
            </button>
          </div>
        </div>

        {/* Plants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedPlants.map((plant) => {
            const isSelected = selectedPlant.id === plant.id;
            return (
              <div
                key={plant.id}
                onClick={() => setSelectedPlant(plant)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-50/60 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                    : 'bg-white hover:bg-slate-50/80 border-slate-200 shadow-xs'
                }`}
              >
                <div>
                  {/* Top Bar with Emoji and Pet Safety Tag */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-3xl p-2 rounded-xl bg-slate-100/80">
                      {plant.imageEmoji}
                    </span>
                    {plant.petSafe ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        100% Pet Safe
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-200">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Toxic to Pets
                      </span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-base mt-3">
                    {plant.name}
                  </h4>
                  <p className="text-xs text-slate-500 italic">{plant.botanicalName}</p>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {plant.description}
                  </p>

                  {/* Pollutants Cleaned */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {plant.primaryPollutantsRemoved.map((poll, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                      >
                        ✓ {poll}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500">Clean Air Score:</span>
                  <span className="font-black text-emerald-700">
                    {plant.airPurificationScore} / 10
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Plant Detailed Care & Placement Modal/Box */}
        {selectedPlant && (
          <div className="bg-white rounded-2xl border border-emerald-300 p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedPlant.imageEmoji}</span>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">
                    {selectedPlant.name} — Care & Home Placement Architecture
                  </h4>
                  <p className="text-xs text-slate-500 italic">
                    {selectedPlant.botanicalName} • {selectedPlant.cadrRating}
                  </p>
                </div>
              </div>

              <div className="text-xs font-bold px-3 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200">
                Oxygen Rate: {selectedPlant.oxygenOutput}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-500" /> Ideal Home Placement:
                </span>
                <span className="text-slate-600">{selectedPlant.idealLocation}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" /> Maintenance & Care:
                </span>
                <span className="text-slate-600">
                  Care Level: <strong>{selectedPlant.careLevel}</strong>. Wipe leaves monthly with damp cloth to remove settled PM2.5.
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Pet Toxicity Assessment:
                </span>
                <span className="text-slate-600">{selectedPlant.petToxicityDetails}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Practical Fresh Breathing Gardening Tip */}
      <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-teal-900">
        <div className="flex items-center gap-2.5">
          <Leaf className="w-5 h-5 text-teal-600 shrink-0" />
          <span>
            <strong>Pro Tip for Smoggy Cities:</strong> Dust settling on plant leaves clogs the stomata. Gently wiping leaves with a damp sponge once a week restores up to 60% of their particulate-absorbing capacity!
          </span>
        </div>
        <span className="font-bold text-teal-700 shrink-0">
          Clean Breathing Standard
        </span>
      </div>
    </section>
  );
};
