import React, { useState, useEffect } from 'react';
import { Settings } from '../../types';

export const SettingsTab: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    apiKey: '',
    model: 'claude-3-sonnet-20240229',
    provider: 'anthropic'
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(['apiKey', 'model', 'provider'], (data) => {
      setSettings({
        apiKey: data.apiKey || '',
        model: data.model || 'claude-3-sonnet-20240229',
        provider: data.provider || 'anthropic'
      });
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await chrome.storage.sync.set(settings);
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Error saving settings');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h3 className="font-medium mb-4">API Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              AI Provider
            </label>
            <select
              value={settings.provider}
              onChange={(e) => setSettings({
                ...settings,
                provider: e.target.value as 'anthropic' | 'openai',
                model: e.target.value === 'anthropic' ? 'claude-3-sonnet-20240229' : 'gpt-4'
              })}
              className="w-full px-3 py-2 border rounded-md hover:border-blue-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="anthropic">Anthropic (Claude)</option>
              <option value="openai">OpenAI (GPT)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={settings.apiKey}
                onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
                className="w-full px-3 py-2 border rounded-md pr-10"
                placeholder={`Enter your ${settings.provider === 'anthropic' ? 'Anthropic' : 'OpenAI'} API key`}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showApiKey ? '🔒' : '👁️'}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Your API key is stored locally and never shared
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model
            </label>
            <select
              value={settings.model}
              onChange={(e) => setSettings({...settings, model: e.target.value})}
              className="w-full px-3 py-2 border rounded-md hover:border-blue-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {settings.provider === 'anthropic' ? (
                <>
                  <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
                  <option value="claude-3-opus-20240229">Claude 3 Opus</option>
                  <option value="claude-3-haiku-20240229">Claude 3 Haiku</option>
                </>
              ) : (
                <>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </>
              )}
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full ${
              saving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white py-2 rounded-md transition-colors`}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};