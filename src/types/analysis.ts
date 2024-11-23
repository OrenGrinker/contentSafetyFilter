// src/types/analysis.ts
export interface Message {
  content: Array<{
    type: string;
    text?: string;
  }>;
}

export interface ContentAnalysis {
  isInappropriate: boolean;
  categories: string[];
  explanation: string;
  confidence: number;
}

export interface TabData {
  url: string;
  analysis: ContentAnalysis;
  timestamp: number;
}

export interface ClaudeResponse {
    content: Array<{
      text: string;
    }>;
}