export type PetSpeciesCategory = 'dogs_cats' | 'birds' | 'reptiles' | 'small_mammals';

export interface PetSymptomRecord {
  id: string;
  name: string;
  category: PetSpeciesCategory;
  symptoms: string[];
  pollutionSensitivity: 'EXTREME' | 'HIGH' | 'MODERATE';
  pathology: string;
  veterinaryConcern: string;
  clinicalActions: string[];
  emergencyRedFlags: string[];
}

export interface PhotoSafetyResult {
  isSafe: boolean;
  status: 'safe' | 'rejected' | 'analyzing' | 'idle';
  reason?: string;
  safetyScore?: number;
  detectedFeatures?: string[];
  symptomInsights?: string;
}

export interface GardenPlantItem {
  id: string;
  name: string;
  botanicalName: string;
  petSafe: boolean;
  petToxicityDetails: string;
  airPurificationScore: number; // 1-10
  primaryPollutantsRemoved: string[];
  oxygenOutput: 'HIGH' | 'VERY_HIGH' | 'MODERATE';
  cadrRating: string;
  idealLocation: string;
  careLevel: 'EASY' | 'MODERATE' | 'ATTENTIVE';
  description: string;
  imageEmoji: string;
}

export interface HumanDiseaseProfile {
  id: string;
  diseaseName: string;
  category: 'respiratory' | 'cardiovascular' | 'allergic' | 'vulnerable_groups';
  aqiThresholdWarning: number;
  clinicalImpact: string;
  doctorAssistantPrecautions: string[];
  medicationInhalerAdvice: string;
  emergencySymptoms: string[];
  homeShieldSteps: string[];
}
