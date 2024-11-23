// src/services/claude.ts
import Anthropic from '@anthropic-ai/sdk';
import { CONFIG } from '../config';
import { ContentAnalysis } from '../types/analysis';

export class ClaudeService {
  private static instance: ClaudeService;
  private client: Anthropic;

  private constructor() {
    this.client = new Anthropic({
      apiKey: CONFIG.ANTHROPIC_API_KEY,
      dangerouslyAllowBrowser: true,
      defaultHeaders: {
        'anthropic-dangerous-direct-browser-access': 'true'
      }
    });
  }

  public static getInstance(): ClaudeService {
    if (!ClaudeService.instance) {
      ClaudeService.instance = new ClaudeService();
    }
    return ClaudeService.instance;
  }

  public async analyzeContent(text: string): Promise<ContentAnalysis | null> {
    try {
      const message = await this.client.messages.create({
        model: CONFIG.MODEL,
        max_tokens: 1024,
        system: "You are a content analysis assistant. Always respond with a valid JSON object and nothing else. No natural language responses.",
        messages: [{
          role: 'user',
          content: this.buildPrompt(text)
        }],
      });

      // Get the text content from the response
      const responseText = message.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('');

      if (!responseText) {
        console.error('No text content in response');
        return null;
      }

      // Clean the response text to ensure it's valid JSON
      const cleanedResponse = this.cleanJsonResponse(responseText);

      try {
        return JSON.parse(cleanedResponse) as ContentAnalysis;
      } catch (parseError) {
        console.error('Failed to parse API response:', {
          error: parseError,
          responseText: responseText,
          cleanedResponse: cleanedResponse
        });
        return null;
      }
    } catch (error) {
      if (error instanceof Anthropic.APIError) {
        console.error('Anthropic API Error:', {
          status: error.status,
          name: error.name,
          message: error.message
        });
      } else {
        console.error('Unexpected error:', error);
      }
      return null;
    }
  }

  private cleanJsonResponse(text: string): string {
    // Try to extract JSON from the response if it's wrapped in other text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return jsonMatch[0];
    }
    return text;
  }

  private buildPrompt(text: string): string {
    return `Analyze the following text for age-inappropriate content for users under 18.

IMPORTANT: You must respond with ONLY a valid JSON object matching this EXACT structure, with NO additional text before or after:
{
  "isInappropriate": boolean,
  "categories": string[],
  "explanation": string,
  "confidence": number
}

Consider these categories:
- Sexual content
- Violence
- Gambling
- Hate speech
- Drugs
- Explicit material

For "isInappropriate", return true if ANY inappropriate content is found.
For "categories", include ALL categories that apply.
For "confidence", use a number between 0 and 1.
For "explanation", provide a brief explanation of why the content is or isn't appropriate.

Text to analyze: "${text.substring(0, CONFIG.MAX_CHUNK_SIZE)}"`;
  }
}
