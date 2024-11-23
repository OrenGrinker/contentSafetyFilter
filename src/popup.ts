// src/popup.ts
import { TabData, ContentAnalysis } from './types/analysis';

class PopupUI {
  private resultsDiv: HTMLElement;

  constructor() {
    this.resultsDiv = document.getElementById('results') as HTMLElement;
    this.initialize();
  }

  private async initialize(): Promise<void> {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.id) return;

    const data = await chrome.storage.local.get(`tab${tab.id}`);
    const results = data[`tab${tab.id}`] as TabData | undefined;

    this.updateUI(results);
  }

  private updateUI(results: TabData | undefined): void {
    if (!results?.analysis) {
      this.resultsDiv.innerHTML = '<p>No inappropriate content detected by AI.</p>';
      return;
    }

    const { analysis } = results;
    let html = '';

    if (analysis.isInappropriate) {
      html = this.buildWarningHTML(analysis);
    } else {
      html = '<p>AI analysis complete: No inappropriate content detected.</p>';
    }

    this.resultsDiv.innerHTML = html;
  }

  private buildWarningHTML(analysis: ContentAnalysis): string {
    let html = '<h3 class="warning">⚠️ AI Warning: Inappropriate Content Detected</h3>';

    if (analysis.categories.length > 0) {
      html += '<p>Categories detected:</p>';
      analysis.categories.forEach(category => {
        html += `<div class="category">
          <strong>${category}</strong>
        </div>`;
      });
    }

    html += `<div class="explanation">
      <strong>AI Analysis:</strong><br>
      ${analysis.explanation}
    </div>`;

    html += `<div class="confidence">
      Confidence: ${Math.round(analysis.confidence * 100)}%
    </div>`;

    return html;
  }
}

new PopupUI();