import { ContentAnalysis } from '../types/analysis';
import { CONFIG } from '../config';

export class OpenAIService {
  private static instance: OpenAIService;
  private apiKey: string;

  private constructor() {
    this.apiKey = CONFIG.OPENAI_API_KEY;
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  public async analyzeContent(text: string): Promise<ContentAnalysis | null> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: CONFIG.OPENAI_MODEL,
          messages: [
            {
              role: 'system',
              content: `You are a content safety analyzer focused on protecting users under 18.
                       Analyze content for inappropriate material including gambling, violence,
                       sexual content, hate speech, drugs, and explicit material.
                       Respond only with a valid JSON object.`
            },
            {
              role: 'user',
              content: `Analyze this text: "${text.substring(0, CONFIG.MAX_CHUNK_SIZE)}"`
            }
          ],
          max_tokens: 1000,
          temperature: 0
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.choices[0].message.content;

      return JSON.parse(responseText) as ContentAnalysis;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return null;
    }
  }
}