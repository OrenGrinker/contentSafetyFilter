export interface Analysis {
  isInappropriate: boolean;
  categories: string[];
  explanation: string;
  confidence: number;
  timestamp?: number;
  url?: string;
}

export interface Settings {
  apiKey: string;
  model: string;
  provider: 'anthropic' | 'openai';
}

export interface TabData {
  analysis: Analysis;
  url: string;
  timestamp: number;
}