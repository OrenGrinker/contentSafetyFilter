import { ClaudeService } from './services/claude';
import { ContentAnalysis } from './types/analysis';
import { CONFIG } from './config';

class BackgroundService {
  private lastAnalysisTime = 0;
  private claudeService: ClaudeService;

  constructor() {
    this.claudeService = ClaudeService.getInstance();
    this.initializeListeners();
    console.log('BackgroundService initialized');
  }

  private initializeListeners(): void {
    chrome.tabs.onUpdated.addListener(this.handleTabUpdate.bind(this));
    console.log('Listeners initialized');
  }

  // Add public method for test analysis
  public async testAnalysis(text: string): Promise<ContentAnalysis | null> {
    return await this.claudeService.analyzeContent(text);
  }

  private async handleTabUpdate(
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
  ): Promise<void> {
    if (!tab.url || 
        tab.url.startsWith('chrome://') || 
        tab.url.startsWith('chrome-extension://')) {
      return;
    }

    if (changeInfo.status !== 'complete') {
      return;
    }

    const currentTime = Date.now();
    if (currentTime - this.lastAnalysisTime < CONFIG.MIN_SCANNING_INTERVAL) {
      return;
    }
    this.lastAnalysisTime = currentTime;

    try {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          return Array.from(document.querySelectorAll('body, body *'))
            .filter(element => {
              const style = window.getComputedStyle(element);
              return style.display !== 'none' && 
                     style.visibility !== 'hidden' && 
                     style.opacity !== '0';
            })
            .map(element => element.textContent)
            .join(' ');
        }
      });

      if (!result?.result) {
        return;
      }

      const pageText = result.result;
      const analysis = await this.claudeService.analyzeContent(pageText);

      // Store the analysis result
      const tabData = {
        url: tab.url,
        analysis,
        timestamp: Date.now()
      };

      await chrome.storage.local.set({ [`tab${tabId}`]: tabData });

      if (analysis?.isInappropriate) {
        await chrome.action.setBadgeText({
          text: '!',
          tabId
        });

        await chrome.action.setBadgeBackgroundColor({
          color: '#FF0000',
          tabId
        });

        await chrome.notifications.create({
          type: 'basic',
          iconUrl: '/assets/icon48.png',
          title: 'Content Warning',
          message: `Inappropriate content detected: ${analysis.categories.join(', ')}`,
          priority: 2
        });
      } else {
        await chrome.action.setBadgeText({
          text: '',
          tabId
        });
      }
    } catch (error) {
      console.error('Extension error:', error);
    }
  }
}

// Initialize service worker
const service = new BackgroundService();

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TEST_ANALYSIS') {
    service.testAnalysis(message.text)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ error: error.message }));
    return true; // Will respond asynchronously
  }
});