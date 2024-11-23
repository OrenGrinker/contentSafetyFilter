// src/types/index.ts
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
  