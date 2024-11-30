import { ClaudeService } from './claude';
import { OpenAIService } from './openai';
import { ContentAnalysis } from '../types/analysis';
import { CONFIG } from '../config';

export class ContentAnalyzer {
  private static instance: ContentAnalyzer;
  private claudeService: ClaudeService;
  private openaiService: OpenAIService;

  private constructor() {
    this.claudeService = ClaudeService.getInstance();
    this.openaiService = OpenAIService.getInstance();
  }

  public static getInstance(): ContentAnalyzer {
    if (!ContentAnalyzer.instance) {
      ContentAnalyzer.instance = new ContentAnalyzer();
    }
    return ContentAnalyzer.instance;
  }

  public async analyzeContent(text: string): Promise<ContentAnalysis | null> {
    // Get current provider from storage
    const { provider } = await chrome.storage.sync.get(['provider']);
    const currentProvider = provider || CONFIG.PROVIDER;

    if (currentProvider === 'anthropic') {
      return this.claudeService.analyzeContent(text);
    } else {
      return this.openaiService.analyzeContent(text);
    }
  }
}