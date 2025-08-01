export type TLocation = {
  lat: number;
  lon: number;
};

export type TLanguage = "en" | "xh" | "zu" | "af" | "st";

export interface Current {
  cloudcover: number;
  feelslike: number;
  observation_time: string;
  pressure: number;
  temperature: number;
  visibility: number;
  weather_descriptions: string[];
  weather_icons: string[];
  wind_dir: string;
  wind_speed: number;
}

export interface Location {
  country: string;
  name: string;
  region: string;
  timezone_id: string;
}

export interface Weather {
  current: Current;
  location: Location;
}

export interface Weather {
  error?: any;
  success: boolean;
  weather: Weather;
}

export interface TWeatherData {
  weather: Weather;
}

export interface Prediction {
  crop: string;
  label: number;
  probability: number;
}

export interface Top {
  crop: string;
  label: number;
  probability: number;
}

export interface Prediction {
  predictions: Prediction[];
  top: Top;
}

export interface RecommendCrop {
  error?: any;
  predictions: Prediction;
  success: boolean;
}

export interface TRecommendation {
  recommendCrop: RecommendCrop;
}

export type TFeatures = {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
};

export type THistory = {
  id: string;
  predictions: Prediction;
  date: Date;
  segment: string;
  theme: string;
  segmentDescription: string;
  features: TFeatures;
};

export type TForm = {
  theme: string;
  segment: string;
  segmentDescription: string;
  K: string;
  N: string;
  P: string;
  temperature: string;
  humidity: string;
  ph: string;
  rainfall: string;
  limit: number;
};
