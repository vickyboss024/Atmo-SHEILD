export type AqiLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';

export type SensitivityGroupId =
  | 'general'
  | 'children'
  | 'elderly'
  | 'respiratory'
  | 'outdoor_sports'
  | 'outdoor_worker'
  | 'farming_pets';

export interface LocationItem {
  name: string;
  area: string;
  city: string;
  state?: string;
  country?: string;
  latitude: number;
  longitude: number;
  distance_km?: number;
}

export interface Pollutants {
  pm2_5: number | null;
  pm10: number | null;
  co: number | null;
  no2: number | null;
  so2: number | null;
  o3: number | null;
}

export interface AirQualityData {
  status: 'available' | 'unavailable';
  source_type: 'api' | 'sensor';
  source_label: string;
  updated_at: string;
  aqi: number | null;
  aqi_level: AqiLevel;
  aqi_color: string;
  aqi_emoji: string;
  meaning: string;
  pollutants: Pollutants;
  message?: string;
}

export interface WeatherData {
  status: 'available' | 'unavailable';
  temperature: number | null;
  humidity: number | null;
  wind_speed: number | null;
  weather_condition: string;
  source?: string;
  message?: string;
}

export interface ActionItem {
  icon: string;
  title: string;
  desc: string;
}

export interface HealthAdvisory {
  aqi_level: AqiLevel;
  aqi_color: string;
  aqi_emoji: string;
  headline: string;
  summary: string;
  what_to_do: ActionItem[];
  what_not_to_do: ActionItem[];
  disclaimer: string;
}

export interface WeeklyHistory {
  status: 'available' | 'unavailable';
  timeframe: string;
  average_aqi: number;
  lowest_aqi: number;
  highest_aqi: number;
  average_pm2_5: number;
  low_days: number;
  medium_days: number;
  high_days: number;
  chart_data: {
    day: string;
    date: string;
    aqi: number;
    level: AqiLevel;
    pm2_5: number;
  }[];
}

export interface MonthlyHistory {
  status: 'available' | 'unavailable';
  month_label: string;
  average_aqi: number;
  highest_pollution_day: {
    date: string;
    aqi: number;
  };
  lowest_pollution_day: {
    date: string;
    aqi: number;
  };
  high_aqi_days: number;
  trend_statement: string;
  trend_type: 'improved' | 'worsened' | 'stable' | 'neutral';
  chart_data: {
    date: string;
    aqi: number;
    pm2_5: number;
    level: AqiLevel;
  }[];
}

export interface UserProfile {
  isGuest: boolean;
  username: string;
  email?: string;
  sensitivity_group: SensitivityGroupId;
  alerts_enabled: boolean;
  saved_location: string;
}
