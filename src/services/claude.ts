import { CONFIG } from '../config';
import { ContentAnalysis } from '../types/analysis';
import Anthropic from '@anthropic-ai/sdk';

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
        model: CONFIG.ANTHROPIC_MODEL,
        max_tokens: 1024,
        system: `You are a strict content safety analyzer focused on protecting users under 18.
                You must be very sensitive to any gambling-related content, including:
                - Casino references
                - Betting terms
                - Poker or card games
                - Sports betting
                - Slot machines
                - Any gambling-related advertisements
                Even a single mention of gambling content should trigger an alert.`,
        messages: [{
          role: 'user',
          content: this.buildPrompt(text)
        }]
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

      console.log('AI Response:', responseText); // Debug log

      try {
        const parsedContent = JSON.parse(responseText) as ContentAnalysis;
        return parsedContent;
      } catch (parseError) {
        console.error('Failed to parse API response:', parseError);
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

  private buildPrompt(text: string): string {
    return `Analyze this text for age-inappropriate content, with special attention to gambling content.

REQUIREMENTS:
1. Even a single mention of gambling should be flagged as inappropriate
2. Consider these categories carefully:
   - Gambling (casinos, betting, poker, slots, etc.)
   - Violence
   - Sexual content
   - Hate speech
   - Drugs
   - Explicit material

3. Analyze this text: "${text.substring(0, CONFIG.MAX_CHUNK_SIZE)}"

YOU MUST RESPOND WITH ONLY A VALID JSON OBJECT IN THIS EXACT FORMAT:
{
  "isInappropriate": boolean,
  "categories": string[],
  "explanation": string,
  "confidence": number
}

For gambling content:
- Set isInappropriate to true if ANY gambling reference is found
- Add "gambling" to categories
- Set confidence to 1.0 for clear gambling references
- Provide specific explanation about the gambling content found`;
  }
}