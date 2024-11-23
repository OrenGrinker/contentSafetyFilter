// src/background.ts
import { ClaudeService } from './services/claude';
import { extractPageText } from './utils/dom';
import { ContentAnalysis, TabData } from './types/analysis';
import { CONFIG } from './config';

class BackgroundService {
  private lastAnalysisTime = 0;
  private claudeService: ClaudeService;

  constructor() {
    this.claudeService = ClaudeService.getInstance();
    this.initializeListeners();
    this.requestNotificationPermission();
  }

  private async requestNotificationPermission(): Promise<void> {
    try {
      // Request notification permission when extension loads
      const permission = await chrome.permissions.contains({
        permissions: ['notifications']
      });
      
      if (!permission) {
        console.log('Notifications permission not granted');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  }

  private initializeListeners(): void {
    chrome.tabs.onUpdated.addListener(this.handleTabUpdate.bind(this));
  }

  private async handleTabUpdate(
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
  ): Promise<void> {
    if (!tab.url || 
        tab.url.startsWith('chrome://') || 
        tab.url.startsWith('chrome-extension://') ||
        tab.url.startsWith('chrome-search://') ||
        tab.url.startsWith('chrome-devtools://')) {
      return;
    }

    if (changeInfo.status !== 'complete') return;

    const currentTime = Date.now();
    if (currentTime - this.lastAnalysisTime < CONFIG.MIN_SCANNING_INTERVAL) {
      return;
    }
    this.lastAnalysisTime = currentTime;

    try {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId },
        func: extractPageText
      });

      if (!result?.result) {
        console.log('No text content found');
        return;
      }

      const pageText = result.result;
      const analysis = await this.claudeService.analyzeContent(pageText);

      if (!analysis) {
        console.log('No analysis results');
        return;
      }

      if (analysis.isInappropriate) {
        await this.handleInappropriateContent(tabId, tab.url, analysis);
      }
    } catch (error) {
      console.error('Extension error:', error);
    }
  }

  private async handleInappropriateContent(
    tabId: number,
    url: string,
    analysis: ContentAnalysis
  ): Promise<void> {
    try {
      // Store the analysis results
      const tabData: TabData = {
        url,
        analysis,
        timestamp: Date.now()
      };

      await chrome.storage.local.set({ [`tab${tabId}`]: tabData });

      // Update badge
      await chrome.action.setBadgeText({
        text: '!',
        tabId
      });

      await chrome.action.setBadgeBackgroundColor({
        color: '#FF0000',
        tabId
      });

      // Show notification
      try {
        await chrome.notifications.create({
          type: 'basic',
          iconUrl: chrome.runtime.getURL('assets/icon48.png'),
          title: 'Content Warning',
          message: `Inappropriate content detected: ${analysis.categories.join(', ')}`,
          priority: 2
        });
      } catch (notificationError) {
        console.error('Failed to create notification:', notificationError);
      }
    } catch (error) {
      console.error('Error handling inappropriate content:', error);
    }
  }
}

// Initialize the background service
const backgroundService = new BackgroundService();