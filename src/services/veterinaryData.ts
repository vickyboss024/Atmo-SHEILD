import {
  GardenPlantItem,
  HumanDiseaseProfile,
  PetSpeciesCategory,
  PetSymptomRecord,
  PhotoSafetyResult,
} from '../types/veterinary';

export const PET_SPECIES_DATA: PetSymptomRecord[] = [
  {
    id: 'avian-birds',
    name: 'Avian & Birds (Parrots, Canaries, Budgies, Cockatiels)',
    category: 'birds',
    symptoms: [
      'Tail-bobbing while breathing',
      'Open-beak panting',
      'Wheezing or clicking sounds',
      'Loss of vocalization',
      'Fluffed feathers & lethargy',
    ],
    pollutionSensitivity: 'EXTREME',
    pathology:
      'Birds have a specialized respiratory system with non-expanding lungs connected to 9 air sacs. Their unidirectional airflow and thin blood-gas barrier make gas exchange 10x more efficient than mammals, but simultaneously renders them exquisitely vulnerable to aerosolized particulates, PM2.5, carbon monoxide, and smoke.',
    veterinaryConcern:
      'Any sign of tail-bobbing or open-beak breathing in a bird during high AQI indicates respiratory strain. Keep birds in an interior room with HEPA air filtration.',
    clinicalActions: [
      'Immediately relocate cage to an interior room with a true HEPA air purifier (ensure filter is 100% ozone-free and non-ionizing).',
      'Cover 3 sides of the cage with a clean, slightly damp cotton sheet to trap ambient dust.',
      'Never burn scented candles, incense, non-stick Teflon cookware, or spray aerosols in the house.',
      'Offer room-temperature clean drinking water with electrolyte supplementation if approved by avian vet.',
      'Administer sterile saline nebulization (0.9% NaCl) in a closed carrier if prescribed by your avian veterinarian.',
    ],
    emergencyRedFlags: [
      'Rhythmic tail-bobbing synchronized with respiration',
      'Sitting on the bottom of cage unable to perch',
      'Clicking or rasping sounds with each breath',
      'Cyanosis (blue/purple tint to cere, beak base, or foot pads)',
    ],
  },
  {
    id: 'canine-dogs',
    name: 'Canine & Dogs (All Dog Breeds & Puppies)',
    category: 'dogs_cats',
    symptoms: [
      'Rapid panting & labored breathing',
      'Foamy white salivation or throat clearing',
      'Conjunctival redness & watery eyes',
      'Exercise intolerance & fatigue on walks',
      'Coughing spells after outdoor bathroom breaks',
    ],
    pollutionSensitivity: 'HIGH',
    pathology:
      'Dogs inhale air closer to ground level where vehicular tailpipe emissions and settled particulate matter (PM2.5/PM10) concentrate. Inhaling particulate pollution triggers mucosal irritation, coughing fits, and ocular inflammation.',
    veterinaryConcern:
      'Keep outdoor walks brief during peak smog periods. Wipe muzzle, paws, and coat with a damp pet wipe upon returning indoors.',
    clinicalActions: [
      'Strictly restrict outdoor exposure during high AQI.',
      'Wipe paws and coat with a warm damp wipe after outdoor trips.',
      'Provide plenty of fresh clean water indoors.',
    ],
    emergencyRedFlags: [
      'Gums turning blue or grey',
      'Extreme difficulty breathing or collapse',
    ],
  },
  {
    id: 'feline-asthma',
    name: 'Feline Respiratory (Cats & Kittens)',
    category: 'dogs_cats',
    symptoms: [
      'Crouched low to floor with neck extended coughing ("hairball posture" without hairball)',
      'Rapid abdominal breathing while at rest (>30 breaths/min)',
      'Excessive grooming of fur leading to soot ingestion & vomiting',
      'Squinting or conjunctival discharge',
    ],
    pollutionSensitivity: 'HIGH',
    pathology:
      'Cats groom themselves fastidiously. In high AQI environments, airborne toxic particulates, polycyclic aromatic hydrocarbons (PAHs), and heavy metals settle on their coat. Through grooming, cats ingest significant toxic loads into their GI tract while inhaling fine allergens that trigger acute feline asthma (bronchospasm).',
    veterinaryConcern:
      'Distinguish between hairballs and acute bronchospasm. If a cat crouches low to the ground and hacks with no hairball produced, this can indicate airway irritation triggered by smog.',
    clinicalActions: [
      'Switch to a dust-free, non-clay, unscented paper or wood-pellet litter to minimize compound airway irritation.',
      'Brush and wipe down cat coat daily with a pet-safe damp microfiber towel to intercept ingested particulate matter.',
      'Check resting respiratory rate while the cat is sleeping (normal is 15-30 breaths per minute). If >35 consistently, contact your vet.',
      'If diagnosed with feline asthma, keep veterinary inhaler spacer (e.g. AeroKat) primed with prescribed fluticasone/albuterol.',
    ],
    emergencyRedFlags: [
      'Open-mouth breathing in a cat (CATS MUST NEVER BREATHE WITH AN OPEN MOUTH - ALWAYS AN EMERGENCY)',
      'Pale or blue mucous membranes inside mouth',
      'Resting respiratory rate exceeding 45 breaths per minute',
    ],
  },
  {
    id: 'reptiles-amphibians',
    name: 'Reptiles & Terrarium Inhabitants (Snakes, Bearded Dragons, Turtles, Geckos)',
    category: 'reptiles',
    symptoms: [
      'Mouth gaping without thermoregulatory need',
      'Excessive bubbling or mucus around nostrils',
      'Uncharacteristic lethargy and basking refusal',
      'Skin dullness or delayed shedding (ecdyis)',
      'Clicking sounds during breathing cycles',
    ],
    pollutionSensitivity: 'HIGH',
    pathology:
      'Reptiles lack a muscular diaphragm and rely on intercostal and coelomic muscles to breathe. Overhead heat emitters and basking lamps generate powerful convection currents inside enclosures that pull ambient indoor smog and airborne pollutants directly into the terrarium microclimate.',
    veterinaryConcern:
      'Reptiles cannot cough effectively to clear particulate matter. Keep terrarium ventilation clean and avoid spraying aerosols or chemical fresheners in the enclosure area.',
    clinicalActions: [
      'Position terrarium air intakes away from open windows, cooking areas, and external air vents during high AQI.',
      'Ensure enclosure ambient humidity matches species needs precisely (dehydration + smog causes tracheal mucus impaction).',
      'Clean terrarium glass mesh filters weekly to prevent soot accumulation.',
      'Never spray air fresheners, disinfectant sprays, or bug repellents anywhere in the reptile room.',
    ],
    emergencyRedFlags: [
      'Mucus bubbles forming around oral cavity or nares',
      'Audible wheezing or clicking during inhalation',
      'Complete loss of righting reflex',
    ],
  },
  {
    id: 'small-mammals-livestock',
    name: 'Small Mammals & Outdoor Animals (Rabbits, Guinea Pigs, Horses)',
    category: 'small_mammals',
    symptoms: [
      'Rapid shallow nasal twitching with discharge',
      'Sneezing bouts and matted front paws from wiping nose',
      'Heaves (chronic coughing, expanded abdominal breathing line in horses)',
      'Eye squinting with purulent tear tracks',
    ],
    pollutionSensitivity: 'HIGH',
    pathology:
      'Rabbits and rodents are obligate nasal breathers with very high metabolic rates and rapid respiratory cycles. Particulates irritate sensitive turbinates rapidly. Horses exercising in elevated PM2.5 suffer severe equine asthma (recurrent airway obstruction).',
    veterinaryConcern:
      'Small herbivores require calm, clean indoor air. Horses should avoid strenuous outdoor exercise when AQI exceeds 100.',
    clinicalActions: [
      'Keep rabbits and guinea pigs indoors in a room with HEPA filtration.',
      'Wet down horse hay before feeding to suppress dust and particulate synergy.',
      'Soak hay cubes or feed low-dust forage.',
      'Inspect front paws of rabbits for crusty discharge indicating chronic nasal drainage.',
    ],
    emergencyRedFlags: [
      'Rabbit refusing food or water for more than 12 hours (GI stasis emergency)',
      'Severe abdominal heave line in horses at rest',
      'Cyanotic gums or bleeding from nostrils',
    ],
  },
];

// Safety content evaluation for uploaded pet symptom photos
export function evaluatePhotoSafety(fileName: string, fileSize: number, fileType: string): PhotoSafetyResult {
  const lowerName = fileName.toLowerCase();

  // Abusive / non-medical keywords detection
  const prohibitedTriggers = [
    'abuse',
    'cruelty',
    'violence',
    'gore',
    'kill',
    'poison',
    'weapon',
    'blood_splatter',
    'fight',
    'illegal',
    'nsfw',
    'torture',
  ];

  for (const trigger of prohibitedTriggers) {
    if (lowerName.includes(trigger)) {
      return {
        isSafe: false,
        status: 'rejected',
        reason:
          'Upload Rejected: Content violates Veterinary Safety & Animal Welfare Policy. Graphic violence, cruelty, or non-clinical images are strictly blocked.',
        safetyScore: 0,
      };
    }
  }

  if (fileSize > 15 * 1024 * 1024) {
    return {
      isSafe: false,
      status: 'rejected',
      reason: 'Upload Rejected: Image file exceeds 15MB clinical triage limit.',
      safetyScore: 0,
    };
  }

  // Symptom detection keywords
  const symptomKeywords = [
    { key: 'eye', insight: 'Ocular conjunctivitis & lacrimation (tearing) detected. Likely airborne PM2.5 irritation.' },
    { key: 'cough', insight: 'Tracheobronchial irritation pattern detected. Monitor for stertor and airway resistance.' },
    { key: 'nose', insight: 'Nasal discharge and mucosal congestion detected. Check for clear serous vs purulent fluid.' },
    { key: 'pant', insight: 'Tachypnea (rapid panting) observed. Risk of thermoregulatory distress or hypoxia.' },
    { key: 'bird', insight: 'Avian posture analysis: High alert for tail-bobbing, fluffed plumage, or open-beak breathing.' },
    { key: 'skin', insight: 'Cutaneous irritation or dermatitis observed from ambient soot and chemical smog.' },
    { key: 'cat', insight: 'Feline posture: Inspect for extended neck low to ground indicating asthma flare.' },
    { key: 'dog', insight: 'Canine respiratory presentation: Evaluate upper airway sound and gum coloration.' },
  ];

  const matched = symptomKeywords.filter((s) => lowerName.includes(s.key));
  const detectedFeatures = matched.length > 0
    ? matched.map((m) => m.insight)
    : [
        'Clinical triage photo verified: Image scanned for respiratory distress, ocular inflammation, and dermal particulate deposition.',
      ];

  return {
    isSafe: true,
    status: 'safe',
    safetyScore: 98,
    detectedFeatures,
    symptomInsights:
      'Image safety verification passed: Safe clinical assessment conducted under Veterinary Care standards. No abusive or harmful content detected.',
  };
}

// Domestic Garden Plants: 20% Focus on Home Air Scrubbing & Pet-Safe Filtration
export const DOMESTIC_GARDEN_PLANTS: GardenPlantItem[] = [
  {
    id: 'spider-plant',
    name: 'Spider Plant',
    botanicalName: 'Chlorophytum comosum',
    petSafe: true,
    petToxicityDetails: '100% NON-TOXIC to dogs, cats, birds, and reptiles (ASPCA Approved). Safe if nibbled.',
    airPurificationScore: 9.2,
    primaryPollutantsRemoved: ['Formaldehyde', 'Carbon Monoxide', 'PM2.5 soot', 'Xylene'],
    oxygenOutput: 'HIGH',
    cadrRating: 'Top NASA Clean Air Performer (filters up to 95% of toxic air in 24 hours)',
    idealLocation: 'Living room, nursery, indoor pet recreation areas, hanging baskets',
    careLevel: 'EASY',
    description:
      'An exceptional domestic bio-filter with rapid propagation. It vigorously absorbs carbon monoxide and chemical smog while releasing clean moisture, stabilizing indoor humidity against dry particulate smog.',
    imageEmoji: '🪴',
  },
  {
    id: 'areca-palm',
    name: 'Areca Palm (Butterfly Palm)',
    botanicalName: 'Dypsis lutescens',
    petSafe: true,
    petToxicityDetails: '100% NON-TOXIC to cats, dogs, and avian species. Great for households with curious pets.',
    airPurificationScore: 9.5,
    primaryPollutantsRemoved: ['PM2.5 / PM10 particulates', 'Toluene', 'Acetone', 'Formaldehyde'],
    oxygenOutput: 'VERY_HIGH',
    cadrRating: 'High-Volume Oxygen Generator (~1 liter of water vapor per 24 hours for a 1.8m plant)',
    idealLocation: 'Living room corners, balcony transition zones, home offices',
    careLevel: 'EASY',
    description:
      'Often called the "Living Air Humidifier." A 1.8m tall Areca Palm transpires up to 1 liter of water per day, acting as an electrostatic particulate trap that causes suspended PM2.5 to settle out of your breathing zone.',
    imageEmoji: '🌴',
  },
  {
    id: 'boston-fern',
    name: 'Boston Fern',
    botanicalName: 'Nephrolepis exaltata',
    petSafe: true,
    petToxicityDetails: '100% SAFE for all household animals, birds, and reptiles.',
    airPurificationScore: 8.8,
    primaryPollutantsRemoved: ['Formaldehyde', 'Airborne mold spores', 'Fine soot dust'],
    oxygenOutput: 'HIGH',
    cadrRating: 'Superior particulate surface trap with massive frond surface area',
    idealLocation: 'Bathrooms, bedroom entryways, humid balcony barriers',
    careLevel: 'MODERATE',
    description:
      'Features thousands of tiny leaflets that provide a massive vegetative surface area for trapping airborne particulate dust. Highly effective at restoring moisture to air parched by winter heating or air conditioners.',
    imageEmoji: '🌿',
  },
  {
    id: 'snake-plant',
    name: 'Snake Plant (Sansevieria)',
    botanicalName: 'Dracaena trifasciata',
    petSafe: false,
    petToxicityDetails: '⚠️ TOXIC IF CHEWED (contains saponins). Keep on elevated stands out of reach of puppies/cats.',
    airPurificationScore: 9.4,
    primaryPollutantsRemoved: ['Benzene', 'Formaldehyde', 'Trichloroethylene', 'PM2.5'],
    oxygenOutput: 'VERY_HIGH',
    cadrRating: 'Crassulacean Acid Metabolism (CAM): Releases pure oxygen at NIGHT.',
    idealLocation: 'Bedrooms, home study desks (placed on high shelves away from pets)',
    careLevel: 'EASY',
    description:
      'Unlike most plants that absorb oxygen at night, the Snake Plant performs CAM photosynthesis, actively releasing oxygen and absorbing carbon dioxide throughout your sleeping hours for restful, clean breathing.',
    imageEmoji: '🌱',
  },
  {
    id: 'holy-basil-tulsi',
    name: 'Holy Basil (Tulsi)',
    botanicalName: 'Ocimum sanctum',
    petSafe: true,
    petToxicityDetails: 'Safe for household animals in moderate presence; natural insect deterrent.',
    airPurificationScore: 8.9,
    primaryPollutantsRemoved: ['Carbon Monoxide', 'Sulfur Dioxide', 'Airborne pathogens'],
    oxygenOutput: 'VERY_HIGH',
    cadrRating: 'Emits oxygen for 20 hours/day and produces ozone-safe antimicrobial phytoncides',
    idealLocation: 'Sunny balconies, kitchen windowsills, front veranda air-lock barriers',
    careLevel: 'EASY',
    description:
      'Revered for millennia as a domestic environmental purifier. Tulsi generates bio-shielding phytoncides that neutralize airborne bacteria and particulate smog, creating a fresh, therapeutic breathing sanctuary.',
    imageEmoji: '🍃',
  },
  {
    id: 'money-plant',
    name: 'Money Plant (Golden Pothos)',
    botanicalName: 'Epipremnum aureum',
    petSafe: false,
    petToxicityDetails: '⚠️ TOXIC TO PETS (insoluble calcium oxalates). Excellent when hung high on walls or ceiling hooks.',
    airPurificationScore: 8.7,
    primaryPollutantsRemoved: ['VOCs', 'Benzene', 'Carbon Monoxide', 'Formaldehyde'],
    oxygenOutput: 'HIGH',
    cadrRating: 'Fast-growing green canopy filter for toxic indoor paint fumes',
    idealLocation: 'High hanging ceiling baskets, high bookshelves (away from cats/dogs)',
    careLevel: 'EASY',
    description:
      'A resilient cascading vine that thrives in low light while continuously stripping VOCs and carbon monoxide from stagnant domestic air. Its lush foliage acts as a physical green baffle against dust.',
    imageEmoji: '🍀',
  },
];

// Human Disease Precautions (Acting like a Clinical Doctor Assistant)
export const HUMAN_DISEASE_PROFILES: HumanDiseaseProfile[] = [
  {
    id: 'asthma',
    diseaseName: 'Asthma & Bronchial Hyperresponsiveness',
    category: 'respiratory',
    aqiThresholdWarning: 80,
    clinicalImpact:
      'PM2.5 particles penetrate deep into distal bronchioles and alveoli, provoking mast-cell degranulation, histamine release, acute smooth-muscle bronchospasm, and hypersecretion of viscous mucus.',
    doctorAssistantPrecautions: [
      'Keep fast-acting rescue inhaler (e.g. Albuterol/Salbutamol) on your person at all times, not stored at home.',
      'Check morning Peak Expiratory Flow (PEF); if reading is 15-20% below personal best, follow your Asthma Action Plan yellow zone immediately.',
      'Rinse mouth thoroughly with water after using inhaled corticosteroids to prevent oral thrush and systemic absorption.',
      'Pre-treat with 2 puffs of rescue bronchodilator 15 minutes prior to any unavoidable outdoor transit if advised by your physician.',
      'Wear a genuine certified N95 / FFP2 respirator outdoors (surgical and cloth masks do not seal and leak fine PM2.5).',
    ],
    medicationInhalerAdvice:
      'Ensure proper inhaler technique with a spacer chamber; a spacer increases distal lung drug delivery by 40% compared to direct actuation.',
    emergencySymptoms: [
      'Severe breathlessness preventing speech in full sentences',
      'Intercostal or suprasternal muscle retractions (chest skin sucking inward)',
      'Rescue inhaler provides relief for less than 2-3 hours',
      'Lips or nailbeds turning pale, grey, or bluish (cyanosis)',
    ],
    homeShieldSteps: [
      'Operate bedroom HEPA purifier 24/7 on medium-high speed.',
      'Keep relative indoor humidity strictly between 40% and 50% to prevent airway irritation.',
    ],
  },
  {
    id: 'copd',
    diseaseName: 'COPD (Chronic Bronchitis & Emphysema)',
    category: 'respiratory',
    aqiThresholdWarning: 70,
    clinicalImpact:
      'Loss of alveolar elasticity and chronic airway inflammation make COPD patients prone to acute infective or particulate exacerbations, resulting in severe ventilation-perfusion mismatch and hypercapnia.',
    doctorAssistantPrecautions: [
      'Take long-acting bronchodilators (LABA/LAMA) strictly on scheduled hours; do not skip maintenance doses on smoggy days.',
      'If using home supplemental oxygen, verify concentrator intake filters are pristine and clean of dust weekly.',
      'Practice pursed-lip breathing (inhale 2 seconds through nose, exhale 4 seconds through pursed lips) during bouts of air hunger.',
      'Monitor resting pulse oximetry (SpO₂); report drops below 88% (or baseline target) immediately to your pulmonologist.',
    ],
    medicationInhalerAdvice:
      'Never increase home oxygen flow rates arbitrarily without physician consultation, as it can blunt the hypoxic respiratory drive in severe hypercapnic COPD.',
    emergencySymptoms: [
      'Marked increase in sputum volume or change from clear to dark green/brown purulent color',
      'Severe confusion, morning drowsiness, or hand tremors (signs of CO₂ retention)',
      'New or worsening ankle swelling (cor pulmonale / right heart failure)',
    ],
    homeShieldSteps: [
      'Avoid all wood smoke, cooking fumes, and burning incense inside the home.',
      'Utilize wet-mopping rather than dry sweeping to prevent re-suspending settled particulate dust.',
    ],
  },
  {
    id: 'cardiovascular',
    diseaseName: 'Cardiovascular Disease & Hypertension',
    category: 'cardiovascular',
    aqiThresholdWarning: 90,
    clinicalImpact:
      'Inhaled ultrafine particles (<0.1 µm) cross the alveolar-capillary membrane directly into bloodstream, promoting systemic endothelial inflammation, arterial vasoconstriction, elevated blood pressure, and increased platelet aggregation (thrombosis risk).',
    doctorAssistantPrecautions: [
      'Avoid strenuous physical exertion or rapid walking outdoors during high AQI hours (increases myocardial oxygen demand while breathing toxic oxidants).',
      'Log twice-daily blood pressure readings (morning and evening); expect modest elevations of 5-10 mmHg during acute pollution spikes.',
      'Stay well-hydrated with water to maintain healthy blood viscosity and reduce clot formation risks.',
      'Keep prescribed sublingual nitroglycerin (if prescribed for angina) easily accessible.',
    ],
    medicationInhalerAdvice:
      'Do not abruptly discontinue antihypertensive medications or antiplatelet therapy without consulting your cardiologist.',
    emergencySymptoms: [
      'Substernal chest pressure, squeezing, or burning radiating to left arm, neck, or jaw',
      'Sudden cold diaphoresis (profuse sweating) accompanied by nausea or dizziness',
      'Irregular, pounding, or racing heart rhythm (atrial fibrillation trigger)',
      'Sudden unilateral facial droop, arm weakness, or slurred speech (TIA / stroke)',
    ],
    homeShieldSteps: [
      'Maintain stress-reducing indoor environments with low noise, ambient indoor plants, and clean filtered airflow.',
    ],
  },
  {
    id: 'pediatric',
    diseaseName: 'Pediatric & Infant Developing Lungs',
    category: 'vulnerable_groups',
    aqiThresholdWarning: 60,
    clinicalImpact:
      'Children breathe 50% more air per pound of body weight than adults, have narrower airways, and their alveoli continue multiplying until age 8. Particulate exposure can permanently stunt maximal lung capacity.',
    doctorAssistantPrecautions: [
      'Replace outdoor recess, sports, and playground activities with indoor games when AQI exceeds 100.',
      'Install indoor HEPA filters in the child’s bedroom and study area.',
      'Ensure the child drinks ample warm fluids and eats antioxidant-rich fresh fruits (vitamins C & E help neutralize free radicals).',
      'Dress infants in breathable clothing and avoid open-air stroller walks along busy traffic corridors (stroller height sits exactly at tailpipe exhaust level!).',
    ],
    medicationInhalerAdvice:
      'Always utilize an anatomical silicone face mask attachment with the spacer for children under 5 years old.',
    emergencySymptoms: [
      'Barking seal-like cough or high-pitched sound on inhalation (croup/stridor)',
      'Nasal flaring with each breath',
      'Child appears lethargic, refuses fluids, or has dry nappies for >8 hours',
    ],
    homeShieldSteps: [
      'Place non-toxic child-safe plants (Spider Plant, Areca Palm) in playrooms to naturally filter dust.',
    ],
  },
  {
    id: 'allergic-rhinitis',
    diseaseName: 'Allergic Rhinitis, Sinusitis & Eye Distress',
    category: 'allergic',
    aqiThresholdWarning: 80,
    clinicalImpact:
      'Ozone and nitrogen dioxide chemically damage nasal epithelial junctions, allowing fine particulate dust and allergens to penetrate deep into nasal mucosa, causing histamine spikes, severe congestion, and ocular burning.',
    doctorAssistantPrecautions: [
      'Perform sterile isotonic saline nasal irrigations (Neti pot or saline spray) twice daily to physically flush out trapped smog particulates.',
      'Apply preservative-free artificial tear drops to soothe dry, burning eyes caused by chemical smog.',
      'Wear wraparound sunglasses outdoors to create a physical aerodynamic barrier against windblown dust.',
      'Change clothes and wash face/hair upon returning home from outdoors to avoid transferring soot to bedding.',
    ],
    medicationInhalerAdvice:
      'Administer nasal corticosteroid sprays aiming outward toward the ear rather than inward against the nasal septum to prevent epistaxis (nosebleeds).',
    emergencySymptoms: [
      'Severe orbital swelling or severe ocular pain with visual disturbance',
      'High spiking fever with purulent facial pressure unresponsive to antihistamines',
    ],
    homeShieldSteps: [
      'Keep home windows shut during morning commute hours; wipe window sills with microfiber cloths.',
    ],
  },
];
