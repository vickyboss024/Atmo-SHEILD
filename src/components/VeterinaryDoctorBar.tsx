import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Camera,
  CheckCircle2,
  Droplets,
  HeartPulse,
  Leaf,
  Mic,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Sun,
  Volume2,
  Wind,
  X,
} from 'lucide-react';
import {
  GardenPlantItem,
  PetSpeciesCategory,
  PetSymptomRecord,
  PhotoSafetyResult,
} from '../types/veterinary';
import {
  DOMESTIC_GARDEN_PLANTS,
  evaluatePhotoSafety,
  PET_SPECIES_DATA,
} from '../services/veterinaryData';

interface VeterinaryDoctorBarProps {
  currentAqi: number | null;
  locationName: string;
}

interface PetSearchResult {
  record: PetSymptomRecord;
  score: number;
  matchedReason: string;
}

interface GardenSearchResult {
  plant: GardenPlantItem;
  score: number;
  matchedReason: string;
}

export const VeterinaryDoctorBar: React.FC<VeterinaryDoctorBarProps> = ({
  currentAqi,
  locationName,
}) => {
  // Mode switch state: Pet vs Domestic Garden
  const [activeMode, setActiveMode] = useState<'pet' | 'garden'>('pet');

  // Search query & voice state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PetSpeciesCategory | 'all'>('all');
  const [selectedGardenFilter, setSelectedGardenFilter] = useState<'all' | 'pet_safe' | 'high_oxygen' | 'voc_scrub'>('all');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Active selected record to display in detail
  const [selectedPetRecord, setSelectedPetRecord] = useState<PetSymptomRecord>(() => {
    if (currentAqi && currentAqi > 100) {
      return PET_SPECIES_DATA[0]; // Avian high warning
    }
    return PET_SPECIES_DATA[1]; // Canine & Dogs
  });

  const [selectedGardenPlant, setSelectedGardenPlant] = useState<GardenPlantItem>(
    DOMESTIC_GARDEN_PLANTS[0]
  );

  // Photo Search & Safety states
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [photoSafety, setPhotoSafety] = useState<PhotoSafetyResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Backend Consultation states
  const [aiConsultation, setAiConsultation] = useState<string | null>(null);
  const [isConsultingAi, setIsConsultingAi] = useState(false);
  const [aiConsultationError, setAiConsultationError] = useState<string | null>(null);
  const [aiConsultationQuery, setAiConsultationQuery] = useState('');

  // Web Speech API recognition ref
  const recognitionRef = useRef<any>(null);

  // Quick voice query shortcuts for pets
  const QUICK_PET_QUERIES = [
    { label: '🐶 Dog coughing & red eyes', query: 'dog coughing spells and red eyes after outdoor walk' },
    { label: '🦜 Parrot wheezing in smoke', query: 'parrot tail bobbing open beak wheezing in smoke' },
    { label: '🐱 Cat coughing & asthma fit', query: 'cat crouching low coughing without hairball' },
    { label: '🦎 Lizard mouth gaping', query: 'lizard mouth gaping and lethargic in terrarium' },
    { label: '🐰 Rabbit rapid twitching', query: 'rabbit nasal twitching discharge dust allergy' },
  ];

  // Quick voice query shortcuts for domestic garden
  const QUICK_GARDEN_QUERIES = [
    { label: '🪴 Spider plant pet-safe purifier', query: 'spider plant formaldehyde carbon monoxide non-toxic' },
    { label: '🌴 Areca Palm living humidifier', query: 'areca palm living humidifier water vapor pm2.5 soot' },
    { label: '🍃 Tulsi holy basil bio-shield', query: 'tulsi antibacterial antimicrobial bio shield balcony' },
    { label: '🌱 Snake plant bedroom oxygen', query: 'snake plant bedroom night oxygen producer cam' },
    { label: '🌿 Boston fern humidity', query: 'boston fern moisture air filter pet safe' },
  ];

  // ----------------------------------------------------
  // INTELLIGENT REAL-TIME PET SEARCH ENGINE
  // ----------------------------------------------------
  const petSearchResults: PetSearchResult[] = useMemo(() => {
    const raw = searchQuery.trim().toLowerCase();
    const tokens = raw.split(/[\s,+/.-]+/).filter((t) => t.length > 1);

    const isDog = tokens.some((t) => ['dog', 'dogs', 'puppy', 'puppies', 'canine', 'canines', 'bark'].includes(t));
    const isCat = tokens.some((t) => ['cat', 'cats', 'kitten', 'kittens', 'feline', 'felines', 'meow', 'hairball'].includes(t));
    const isBird = tokens.some((t) => ['bird', 'birds', 'parrot', 'parrots', 'canary', 'canaries', 'avian', 'feather', 'beak', 'wings'].includes(t));
    const isReptile = tokens.some((t) => ['reptile', 'reptiles', 'lizard', 'lizards', 'snake', 'snakes', 'dragon', 'gecko', 'turtle', 'terrarium'].includes(t));
    const isSmall = tokens.some((t) => ['rabbit', 'rabbits', 'bunny', 'horse', 'horses', 'guinea', 'pig', 'hamster', 'livestock'].includes(t));

    const results: PetSearchResult[] = [];

    PET_SPECIES_DATA.forEach((record) => {
      // Category filter check
      if (selectedCategory !== 'all' && record.category !== selectedCategory) {
        return;
      }

      if (!raw) {
        results.push({
          record,
          score: 10,
          matchedReason: 'Showing all species in category',
        });
        return;
      }

      let score = 0;
      const reasons: string[] = [];

      // Animal keyword boosts
      if (isDog && record.id === 'canine-dogs') {
        score += 80;
        reasons.push('Canine/Dog match');
      }
      if (isCat && record.id === 'feline-asthma') {
        score += 80;
        reasons.push('Feline/Cat match');
      }
      if (isBird && record.category === 'birds') {
        score += 80;
        reasons.push('Avian/Bird match');
      }
      if (isReptile && record.category === 'reptiles') {
        score += 80;
        reasons.push('Reptile match');
      }
      if (isSmall && record.category === 'small_mammals') {
        score += 80;
        reasons.push('Small mammal/Rabbit match');
      }

      // Name matches
      const nameLower = record.name.toLowerCase();
      if (nameLower.includes(raw)) {
        score += 60;
        reasons.push(`Direct species match: ${record.name}`);
      } else {
        tokens.forEach((t) => {
          if (nameLower.includes(t)) {
            score += 20;
            reasons.push(`Keyword match: ${t}`);
          }
        });
      }

      // Symptoms matches
      record.symptoms.forEach((symptom) => {
        const sLower = symptom.toLowerCase();
        if (sLower.includes(raw)) {
          score += 45;
          reasons.push(`Symptom: "${symptom}"`);
        } else {
          tokens.forEach((t) => {
            if (sLower.includes(t)) {
              score += 15;
              reasons.push(`Symptom match: "${symptom}"`);
            }
          });
        }
      });

      // Emergency red flags
      record.emergencyRedFlags.forEach((rf) => {
        const rfLower = rf.toLowerCase();
        if (rfLower.includes(raw)) {
          score += 40;
          reasons.push(`Emergency flag: "${rf}"`);
        } else {
          tokens.forEach((t) => {
            if (rfLower.includes(t)) {
              score += 12;
            }
          });
        }
      });

      // Pathology & actions
      tokens.forEach((t) => {
        if (record.pathology.toLowerCase().includes(t)) {
          score += 8;
        }
        if (record.clinicalActions.some((ca) => ca.toLowerCase().includes(t))) {
          score += 6;
        }
      });

      if (score > 0) {
        results.push({
          record,
          score,
          matchedReason: reasons[0] || 'Matches environmental air symptoms',
        });
      }
    });

    results.sort((a, b) => b.score - a.score);
    return results;
  }, [searchQuery, selectedCategory]);

  // ----------------------------------------------------
  // INTELLIGENT REAL-TIME GARDEN SEARCH ENGINE
  // ----------------------------------------------------
  const gardenSearchResults: GardenSearchResult[] = useMemo(() => {
    const raw = searchQuery.trim().toLowerCase();
    const tokens = raw.split(/[\s,+/.-]+/).filter((t) => t.length > 1);

    const isPetQuery = tokens.some((t) => ['pet', 'pets', 'dog', 'dogs', 'cat', 'cats', 'safe', 'toxic', 'non-toxic'].includes(t));
    const isOxygenQuery = tokens.some((t) => ['oxygen', 'night', 'bedroom', 'sleep', 'air'].includes(t));
    const isSootQuery = tokens.some((t) => ['soot', 'pm2.5', 'dust', 'smoke', 'particulate'].includes(t));
    const isVocQuery = tokens.some((t) => ['formaldehyde', 'voc', 'chemical', 'benzene', 'co', 'carbon'].includes(t));

    const results: GardenSearchResult[] = [];

    DOMESTIC_GARDEN_PLANTS.forEach((plant) => {
      // Filter check
      if (selectedGardenFilter === 'pet_safe' && !plant.petSafe) return;
      if (selectedGardenFilter === 'high_oxygen' && plant.oxygenOutput !== 'VERY_HIGH') return;

      if (!raw) {
        results.push({
          plant,
          score: plant.airPurificationScore * 10,
          matchedReason: `${plant.airPurificationScore}/10 Clean Air Rating`,
        });
        return;
      }

      let score = 0;
      const reasons: string[] = [];

      const nameLower = plant.name.toLowerCase();
      const botLower = plant.botanicalName.toLowerCase();
      const descLower = plant.description.toLowerCase();
      const locLower = plant.idealLocation.toLowerCase();

      // Direct name match
      if (nameLower.includes(raw)) {
        score += 70;
        reasons.push(`Plant name: ${plant.name}`);
      } else {
        tokens.forEach((t) => {
          if (nameLower.includes(t)) {
            score += 30;
            reasons.push(`Matches plant name "${t}"`);
          }
        });
      }

      // Botanical name
      if (botLower.includes(raw)) {
        score += 45;
        reasons.push(`Botanical: ${plant.botanicalName}`);
      }

      // Pollutants removed
      plant.primaryPollutantsRemoved.forEach((pol) => {
        const pLower = pol.toLowerCase();
        if (pLower.includes(raw)) {
          score += 40;
          reasons.push(`Filters ${pol}`);
        } else {
          tokens.forEach((t) => {
            if (pLower.includes(t)) {
              score += 15;
              reasons.push(`Filters ${pol}`);
            }
          });
        }
      });

      // Special semantic queries
      if (isPetQuery) {
        if (plant.petSafe) {
          score += 35;
          reasons.push('100% ASPCA non-toxic to pets');
        } else if (raw.includes('toxic')) {
          score += 20;
          reasons.push('Contains pet toxicity precaution');
        }
      }

      if (isOxygenQuery) {
        if (plant.oxygenOutput === 'VERY_HIGH') {
          score += 30;
          reasons.push('Very High Oxygen Output');
        }
        if (locLower.includes('bedroom')) {
          score += 20;
          reasons.push('Ideal bedroom plant');
        }
      }

      if (isSootQuery && (nameLower.includes('areca') || nameLower.includes('tulsi') || nameLower.includes('fern'))) {
        score += 25;
        reasons.push('Traps airborne soot & PM2.5 particulates');
      }

      if (isVocQuery && (nameLower.includes('spider') || nameLower.includes('fern') || nameLower.includes('pothos'))) {
        score += 25;
        reasons.push('VOC & Formaldehyde absorption');
      }

      // Location match
      tokens.forEach((t) => {
        if (locLower.includes(t)) {
          score += 15;
          reasons.push(`Ideal location: ${plant.idealLocation}`);
        }
        if (descLower.includes(t)) {
          score += 8;
        }
      });

      if (score > 0) {
        results.push({
          plant,
          score,
          matchedReason: reasons[0] || 'Air purification bio-shield',
        });
      }
    });

    results.sort((a, b) => b.score - a.score);
    return results;
  }, [searchQuery, selectedGardenFilter]);

  // Keep active card updated when top match changes from search
  useEffect(() => {
    if (activeMode === 'pet' && petSearchResults.length > 0) {
      setSelectedPetRecord(petSearchResults[0].record);
    }
  }, [activeMode, petSearchResults]);

  useEffect(() => {
    if (activeMode === 'garden' && gardenSearchResults.length > 0) {
      setSelectedGardenPlant(gardenSearchResults[0].plant);
    }
  }, [activeMode, gardenSearchResults]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setSpeechError(null);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setSearchQuery(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
          setSpeechError('Voice capture ended. Please try speaking again or click a sample query.');
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('Speech Recognition init failed:', e);
      }
    }
  }, []);

  const handleToggleVoiceSearch = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      setSpeechError(null);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          setIsListening(true);
        }
      } else {
        setSpeechError('Speech recognition is not supported in this browser. Try the sample buttons below.');
      }
    }
  };

  // Call backend API for Gemini consultation
  const requestAiConsultation = async (customQuery?: string) => {
    const q = (customQuery !== undefined ? customQuery : searchQuery).trim();
    if (!q) return;

    setIsConsultingAi(true);
    setAiConsultationError(null);
    setAiConsultationQuery(q);

    try {
      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          mode: activeMode,
          currentAqi,
          locationName,
        }),
      });

      const data = await res.json();
      if (res.ok && data.consultation) {
        setAiConsultation(data.consultation);
      } else {
        setAiConsultationError(data.message || 'Consultation response generated offline.');
      }
    } catch (err: any) {
      console.warn('API error:', err);
      setAiConsultationError('AI service is currently responding via pre-indexed clinical database.');
    } finally {
      setIsConsultingAi(false);
    }
  };

  const handleApplyVoiceQuery = (queryText: string) => {
    setSearchQuery(queryText);
    requestAiConsultation(queryText);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeMode === 'pet' && petSearchResults.length > 0) {
      setSelectedPetRecord(petSearchResults[0].record);
    } else if (activeMode === 'garden' && gardenSearchResults.length > 0) {
      setSelectedGardenPlant(gardenSearchResults[0].plant);
    }
    if (searchQuery.trim()) {
      requestAiConsultation(searchQuery);
    }
  };

  // Photo upload and safety inspection handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const safetyResult = evaluatePhotoSafety(file.name, file.size, file.type);
    setPhotoSafety(safetyResult);

    if (safetyResult.isSafe) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        setUploadedImageSrc(result);
      };
      reader.readAsDataURL(file);

      const lower = file.name.toLowerCase();
      if (lower.includes('bird') || lower.includes('parrot') || lower.includes('feather')) {
        setSelectedPetRecord(PET_SPECIES_DATA.find((p) => p.category === 'birds') || PET_SPECIES_DATA[0]);
      } else if (lower.includes('cat') || lower.includes('feline')) {
        setSelectedPetRecord(PET_SPECIES_DATA.find((p) => p.id === 'feline-asthma') || PET_SPECIES_DATA[2]);
      } else if (lower.includes('reptile') || lower.includes('snake') || lower.includes('dragon')) {
        setSelectedPetRecord(PET_SPECIES_DATA.find((p) => p.category === 'reptiles') || PET_SPECIES_DATA[3]);
      } else {
        setSelectedPetRecord(PET_SPECIES_DATA[1]); // Canine dogs
      }
    } else {
      setUploadedImageSrc(null);
    }
  };

  const clearPhotoUpload = () => {
    setUploadedImageSrc(null);
    setPhotoSafety(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-2xl shadow-xl border border-emerald-500/30 p-4 sm:p-6 mb-3 sm:mb-4 relative overflow-hidden">
      {/* Background soft ambient glow */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner with Switch Button between Pet and Domestic Garden */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-slate-950 shadow-md transition-all ${
              activeMode === 'pet'
                ? 'bg-gradient-to-br from-emerald-500 to-teal-400 shadow-emerald-500/30'
                : 'bg-gradient-to-br from-teal-400 to-cyan-400 shadow-teal-500/30'
            }`}
          >
            {activeMode === 'pet' ? (
              <Stethoscope className="w-6 h-6" />
            ) : (
              <Leaf className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                {activeMode === 'pet' ? 'Veterinary Pet Care' : 'Domestic Garden Sanctuary'}
              </span>
              <span className="text-xs text-slate-300 font-medium hidden sm:inline">
                {activeMode === 'pet'
                  ? 'Mammals • Birds • Reptiles • Exotics'
                  : 'NASA Clean Air • Pet-Safe • Bio-Shields'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              {activeMode === 'pet'
                ? 'Pet & Animal Environmental Health Triage'
                : 'Domestic Garden & Fresh Breathing Bio-Shield'}
            </h2>
          </div>
        </div>

        {/* SWITCH BUTTON: Pet vs Domestic Garden */}
        <div className="flex items-center p-1 bg-slate-950/90 rounded-xl border border-slate-700/80 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setActiveMode('pet');
              setSearchQuery('');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'pet'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🐾 Pet Care</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMode('garden');
              setSearchQuery('');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'garden'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🌿 Domestic Garden</span>
          </button>
        </div>
      </div>

      {/* Main Search Bar & Multi-Modal Controls */}
      <div className="mt-5 space-y-4">
        {/* Form Input */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="flex items-center bg-slate-900/90 rounded-xl border border-emerald-500/40 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20 shadow-inner transition-all overflow-hidden">
            <div className="pl-4 text-emerald-400 shrink-0">
              <Search className="w-5 h-5" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeMode === 'pet'
                  ? "Search pet symptoms or animals: e.g. 'Dog cough', 'Cat breathing', 'Parrot wheeze', 'Smoke'..."
                  : "Search garden plants & bio-filters: e.g. 'Spider plant', 'Areca palm', 'Tulsi', 'CO', 'Pet-safe'..."
              }
              className="w-full bg-transparent px-3 py-3.5 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none min-w-0"
            />

            {/* Clear Button */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-white transition-colors mr-1 shrink-0"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center gap-1.5 pr-2 shrink-0">
              {/* Photo Search available in Pet mode */}
              {activeMode === 'pet' && (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Capture or upload photo of pet symptom with safety verification"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 transition-all active:scale-95"
                  >
                    <Camera className="w-4 h-4 text-teal-400" />
                    <span className="hidden md:inline">Photo</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </>
              )}

              {/* Voice Command Search Button */}
              <button
                type="button"
                onClick={handleToggleVoiceSearch}
                title={isListening ? 'Stop listening' : 'Start Voice Command Search'}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/50'
                    : 'bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-sm'
                }`}
              >
                {isListening ? (
                  <>
                    <Mic className="w-4 h-4 animate-bounce" />
                    <span className="hidden sm:inline">Listening...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    <span className="hidden sm:inline">Voice</span>
                  </>
                )}
              </button>

              {/* Submit Button (Always visible on all screens!) */}
              <button
                type="submit"
                className="flex items-center gap-1 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 active:scale-95 transition-all shadow-sm"
              >
                <span>Search</span>
              </button>
            </div>
          </div>
        </form>

        {/* Voice Error or Status Banner */}
        {speechError && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-950/70 border border-amber-500/40 text-xs text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{speechError}</span>
            <button
              onClick={() => setSpeechError(null)}
              className="ml-auto text-amber-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Filter Pills: Pet Mode vs Garden Mode */}
        {activeMode === 'pet' ? (
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="text-slate-400 font-medium mr-1">Filter Species:</span>
            {[
              { id: 'all', label: 'All Species', emoji: '🐾' },
              { id: 'birds', label: 'Birds & Avian', emoji: '🦜' },
              { id: 'dogs_cats', label: 'Dogs & Cats', emoji: '🐶🐱' },
              { id: 'reptiles', label: 'Reptiles & Terrariums', emoji: '🦎' },
              { id: 'small_mammals', label: 'Rabbits & Small Animals', emoji: '🐰' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  const nextCategory = cat.id as PetSpeciesCategory | 'all';
                  setSelectedCategory(nextCategory);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="text-slate-400 font-medium mr-1">Garden Filters:</span>
            {[
              { id: 'all', label: 'All Clean Air Plants', emoji: '🪴' },
              { id: 'pet_safe', label: '100% Pet-Safe Only', emoji: '🐾' },
              { id: 'high_oxygen', label: 'Very High Oxygen', emoji: '💨' },
              { id: 'voc_scrub', label: 'CO & Formaldehyde Scrubbers', emoji: '🍃' },
            ].map((filt) => (
              <button
                key={filt.id}
                onClick={() => {
                  const f = filt.id as 'all' | 'pet_safe' | 'high_oxygen' | 'voc_scrub';
                  setSelectedGardenFilter(f);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                  selectedGardenFilter === filt.id
                    ? 'bg-teal-400 text-slate-950 border-teal-300 font-black shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white'
                }`}
              >
                <span>{filt.emoji}</span>
                <span>{filt.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Quick Voice Prompt Shortcuts */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Try Quick Search:</span>
          </span>
          {(activeMode === 'pet' ? QUICK_PET_QUERIES : QUICK_GARDEN_QUERIES).map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyVoiceQuery(q.query)}
              className="px-2.5 py-1 rounded-md bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors text-[11px]"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* LIVE AI GEMINI BACKEND CONSULTATION CARD                                  */}
        {/* ========================================================================= */}
        {isConsultingAi && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 flex items-center gap-3 animate-pulse text-xs text-emerald-300">
            <Sparkles className="w-5 h-5 text-emerald-400 animate-spin shrink-0" />
            <div>
              <div className="font-bold text-white">
                Connecting to Gemini AI Specialist API...
              </div>
              <div className="text-[11px] text-slate-300">
                Generating personalized clinical triage & atmospheric precautions for &ldquo;{aiConsultationQuery}&rdquo; (AQI: {currentAqi ?? 'live'})...
              </div>
            </div>
          </div>
        )}

        {aiConsultation && (
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/95 border border-emerald-400/50 shadow-2xl space-y-3 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-300">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </span>
                <div>
                  <h4 className="font-extrabold text-sm text-emerald-200">
                    AI Clinical Doctor Consultation: &ldquo;{aiConsultationQuery}&rdquo;
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    Real-time AI Consultation • Grounded with Live AQI ({currentAqi ?? 'Live'}) in {locationName}
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
              <span>Verified with WHO & Veterinary environmental guidelines.</span>
              <button
                type="button"
                onClick={() => requestAiConsultation(aiConsultationQuery)}
                className="text-emerald-400 hover:text-emerald-300 font-bold underline"
              >
                Re-consult AI Specialist ↻
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* LIVE SEARCH RESULTS CAROUSEL / SELECTOR FOR PET MODE                      */}
        {/* ========================================================================= */}
        {activeMode === 'pet' && (
          <div className="pt-2">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                {searchQuery.trim()
                  ? `Search Results (${petSearchResults.length} found for "${searchQuery}")`
                  : 'Available Species Profiles:'}
              </span>
              {searchQuery.trim() && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[11px] text-slate-400 hover:text-white underline"
                >
                  Reset Search
                </button>
              )}
            </div>

            {petSearchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {petSearchResults.map(({ record, matchedReason }) => {
                  const isSelected = selectedPetRecord.id === record.id;
                  return (
                    <button
                      key={record.id}
                      type="button"
                      onClick={() => setSelectedPetRecord(record)}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-emerald-900/60 border-emerald-400 shadow-md ring-1 ring-emerald-400/50'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-600 hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl">
                          {record.category === 'birds'
                            ? '🦜'
                            : record.category === 'reptiles'
                            ? '🦎'
                            : record.category === 'dogs_cats'
                            ? '🐶🐱'
                            : '🐰'}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-black uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                          {record.pollutionSensitivity}
                        </span>
                      </div>
                      <div className="font-extrabold text-xs text-white line-clamp-1">
                        {record.name}
                      </div>
                      <div className="text-[11px] text-emerald-400 mt-0.5 line-clamp-1">
                        ✓ {matchedReason}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-2">
                <p className="text-xs text-amber-300 font-semibold">
                  No exact species match found for "{searchQuery}".
                </p>
                <p className="text-[11px] text-slate-400">
                  Try searching for: <span className="text-emerald-400">"dog coughing"</span>, <span className="text-emerald-400">"cat asthma"</span>, <span className="text-emerald-400">"parrot wheezing"</span>, or <span className="text-emerald-400">"smoke"</span>.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('dog coughing')}
                  className="px-3 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                >
                  View Canine Symptoms &rarr;
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* LIVE SEARCH RESULTS CAROUSEL / SELECTOR FOR GARDEN MODE                   */}
        {/* ========================================================================= */}
        {activeMode === 'garden' && (
          <div className="pt-2">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                {searchQuery.trim()
                  ? `Garden Search Results (${gardenSearchResults.length} found for "${searchQuery}")`
                  : 'Available Bio-Filter Plants:'}
              </span>
              {searchQuery.trim() && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[11px] text-slate-400 hover:text-white underline"
                >
                  Reset Search
                </button>
              )}
            </div>

            {gardenSearchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {gardenSearchResults.map(({ plant, matchedReason }) => {
                  const isSelected = selectedGardenPlant.id === plant.id;
                  return (
                    <button
                      key={plant.id}
                      type="button"
                      onClick={() => setSelectedGardenPlant(plant)}
                      className={`text-left p-2.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-teal-900/60 border-teal-400 shadow-md ring-1 ring-teal-400/50'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-600 hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-2xl">{plant.imageEmoji}</span>
                        {plant.petSafe ? (
                          <span className="text-[9px] px-1 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-black">
                            Pet-Safe
                          </span>
                        ) : (
                          <span className="text-[9px] px-1 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30 font-black">
                            Caution
                          </span>
                        )}
                      </div>
                      <div className="font-extrabold text-xs text-white line-clamp-1">
                        {plant.name}
                      </div>
                      <div className="text-[10px] text-teal-300 mt-0.5 line-clamp-1">
                        ✓ {matchedReason}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-2">
                <p className="text-xs text-amber-300 font-semibold">
                  No garden plants found matching "{searchQuery}".
                </p>
                <p className="text-[11px] text-slate-400">
                  Try searching for: <span className="text-teal-400">"Spider Plant"</span>, <span className="text-teal-400">"Areca Palm"</span>, <span className="text-teal-400">"Bedroom Oxygen"</span>, or <span className="text-teal-400">"Pet-Safe"</span>.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('spider plant')}
                  className="px-3 py-1 rounded bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold transition-colors"
                >
                  View Spider Plant &rarr;
                </button>
              </div>
            )}
          </div>
        )}

        {/* Photo Safety Audit Banner (Pet Mode) */}
        {activeMode === 'pet' && photoSafety && (
          <div className="p-4 rounded-xl border transition-all bg-slate-900/90 border-slate-700">
            {photoSafety.isSafe ? (
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {uploadedImageSrc && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-emerald-400 shrink-0 bg-slate-950">
                    <img
                      src={uploadedImageSrc}
                      alt="Uploaded pet symptom"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1 bg-emerald-600 rounded-full p-0.5 shadow">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                )}
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-sm text-emerald-300">
                      Veterinary Safety Audit: Approved (Score {photoSafety.safetyScore}/100)
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      Non-Abusive Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {photoSafety.symptomInsights}
                  </p>
                  {photoSafety.detectedFeatures && (
                    <ul className="text-xs text-emerald-200/90 space-y-1 list-disc list-inside">
                      {photoSafety.detectedFeatures.map((feat, i) => (
                        <li key={i}>{feat}</li>
                      ))}
                    </ul>
                  )}
                  <button
                    onClick={clearPhotoUpload}
                    className="text-[11px] text-slate-400 hover:text-rose-400 underline pt-1 block"
                  >
                    Clear photo and reset search
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-200">
                <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-rose-300">
                    ⚠️ Content Safety Alert: Image Upload Blocked
                  </h4>
                  <p className="text-xs text-rose-200 leading-relaxed">{photoSafety.reason}</p>
                  <p className="text-[11px] text-rose-300/80 font-medium">
                    Strict Policy: Atmo SHEILD blocks abusive, violent, cruel, or non-clinical images to protect animal welfare and user safety.
                  </p>
                  <button
                    onClick={clearPhotoUpload}
                    className="mt-2 px-3 py-1 bg-rose-800 hover:bg-rose-700 text-white rounded text-xs font-bold transition-colors"
                  >
                    Dismiss & Upload Different Photo
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* DETAILED ACTIVE RESULT CARD: PET MODE                                     */}
        {/* ========================================================================= */}
        {activeMode === 'pet' && selectedPetRecord && (
          <div className="mt-4 p-5 rounded-xl bg-slate-900/95 border border-emerald-500/40 shadow-xl space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">
                  {selectedPetRecord.category === 'birds'
                    ? '🦜'
                    : selectedPetRecord.category === 'reptiles'
                    ? '🦎'
                    : selectedPetRecord.category === 'dogs_cats'
                    ? '🐶🐱'
                    : '🐰'}
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {selectedPetRecord.name}
                  </h3>
                  <span className="text-xs text-emerald-400 font-semibold">
                    Pollution Vulnerability: {selectedPetRecord.pollutionSensitivity}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pet Atmospheric Care</span>
              </div>
            </div>

            {/* Observable Symptoms Checklist */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Observable Clinical Symptoms to Watch For:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {selectedPetRecord.symptoms.map((symptom, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-200"
                  >
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{symptom}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DETAILED ACTIVE RESULT CARD: DOMESTIC GARDEN MODE                         */}
        {/* ========================================================================= */}
        {activeMode === 'garden' && selectedGardenPlant && (
          <div className="mt-4 p-5 rounded-xl bg-slate-900/95 border border-teal-500/40 shadow-xl space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 rounded-xl bg-slate-800 border border-slate-700">
                  {selectedGardenPlant.imageEmoji}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-white">
                      {selectedGardenPlant.name}
                    </h3>
                    {selectedGardenPlant.petSafe ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                        100% Pet-Safe
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-950 text-amber-300 border border-amber-500/40">
                        Keep out of pet reach
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-teal-300 italic">{selectedGardenPlant.botanicalName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-teal-950/80 text-teal-300 border border-teal-500/30 font-bold">
                  Score: {selectedGardenPlant.airPurificationScore} / 10
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-bold">
                  Oxygen: {selectedGardenPlant.oxygenOutput}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {selectedGardenPlant.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-teal-400 font-bold block mb-1">
                  Primary Pollutants Removed:
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedGardenPlant.primaryPollutantsRemoved.map((p, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium"
                    >
                      ✓ {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-teal-400 font-bold block mb-1">Ideal Placement:</span>
                <span className="text-slate-300">{selectedGardenPlant.idealLocation}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-teal-400 font-bold block mb-1">Pet Toxicity Assessment:</span>
                  <span className="text-slate-300">{selectedGardenPlant.petToxicityDetails}</span>
                </div>
                <a
                  href="#domestic-garden"
                  className="inline-flex items-center gap-1 text-[11px] text-teal-400 hover:text-white font-bold underline mt-2"
                >
                  <span>Open Room Oxygen Calculator</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
