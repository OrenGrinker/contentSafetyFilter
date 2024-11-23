# Content Safety Filter Chrome Extension 🛡️

A Chrome extension that uses Claude AI to protect users under 18 from inappropriate content by analyzing webpage content in real-time.

![Extension Alert Example](https://raw.githubusercontent.com/OrenGrinker/contentSafetyFilter/main/docs/images/alert-example.png)
*Extension showing an AI-powered content warning for gambling-related content*

## 🌟 Features

- **Real-time Analysis**: Instantly analyzes webpage content as you browse
- **AI-Powered**: Uses Claude Anhtropic AI for accurate content detection
- **Multiple Categories**: Detects various types of inappropriate content:
  - Sexual content
  - Violence
  - Gambling
  - Hate speech
  - Drugs
  - Explicit material
- **Visual Alerts**: Badge notifications and popup warnings
- **Privacy-Focused**: No data storage, all analysis happens through secure API
- **Customizable**: Configure sensitivity levels and categories

## 🚀 Quick Start

### Installation

1. Clone the repository:
```bash
git clone https://github.com/OrenGrinker/contentSafetyFilter.git
cd contentSafetyFilter
```

2. Install dependencies:
```bash
npm install
```

3. Set up your configuration:
Copy `src/config/index.example.ts` to `src/config/index.ts` and add your Anthropic API key:
```typescript
export const CONFIG = {
  ANTHROPIC_API_KEY: 'your-api-key-here', // Get from anthropic.com
  MAX_CHUNK_SIZE: 100000,
  MIN_SCANNING_INTERVAL: 5000,
  MODEL: 'claude-3-sonnet-20240229'
};
```

4. Build the extension:
```bash
npm run build
```

5. Load in Chrome:
- Open Chrome and go to `chrome://extensions/`
- Enable "Developer mode"
- Click "Load unpacked"
- Select the `dist` directory

## 🛠️ Development

### Prerequisites

- Node.js >= 18
- npm >= 8
- Chrome browser
- Anthropic API key ([Get one here](https://www.anthropic.com))

### Available Commands

```bash
# Install dependencies
npm install

# Build once
npm run build

# Build and watch for changes
npm run watch

# Check types
npm run type-check

# Lint code
npm run lint
```

### Project Structure

```
contentSafetyFilter/
├── src/
│   ├── assets/           # Icons and images
│   ├── config/          # Configuration files
│   ├── services/        # Core services
│   │   ├── claude.ts   # Claude AI service
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── background.ts   # Extension background script
│   └── popup.ts        # Extension popup script
├── dist/               # Built extension
└── package.json
```

## 💡 Usage

1. After installation, the extension will automatically start analyzing web pages
2. Look for the extension icon in your Chrome toolbar:
   - 🟢 Green: Page is safe
   - 🔴 Red: Inappropriate content detected
3. Click the icon to see detailed analysis
4. Notifications will appear when inappropriate content is detected

## ⚙️ Configuration

Customize the extension behavior in `src/config/index.ts`:

```typescript
export const CONFIG = {
  MAX_CHUNK_SIZE: 100000,        // Maximum text length to analyze
  MIN_SCANNING_INTERVAL: 5000,   // Minimum time between scans (ms)
  DEBUG: false                   // Enable debug logging
};
```

## 🔒 Privacy & Security

- No user data is stored locally or remotely
- All content analysis happens through secure API calls
- No tracking or analytics
- Open source for transparency

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch:
```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes:
```bash
git commit -m 'Add amazing feature'
```

4. Push to the branch:
```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This extension is meant as a helpful tool but should not be the only measure for content filtering. Parents and guardians should maintain appropriate oversight of internet usage.

## 🙏 Acknowledgments

- [Anthropic](https://www.anthropic.com/) for the Claude AI API
- [Chrome Extensions](https://developer.chrome.com/docs/extensions/) documentation