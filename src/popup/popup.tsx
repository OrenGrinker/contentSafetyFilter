import React, { useState, useEffect } from 'react';
import { Analysis } from '../types';
import { AnalysisTab } from '../components/tabs/AnalysisTab';
import { HistoryTab } from '../components/tabs/HistoryTab';
import { SettingsTab } from '../components/tabs/SettingsTab';

const PopupContent: React.FC = () => {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analysis');
  const [currentUrl, setCurrentUrl] = useState<string>('');

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.id && tab.url !== currentUrl) {
        setCurrentUrl(tab.url || '');
        const data = await chrome.storage.local.get(`tab${tab.id}`);
        setAnalysis(data[`tab${tab.id}`]?.analysis || null);
      }
    } catch (error) {
      console.error('Error fetching analysis:', error);
      setAnalysis(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    chrome.tabs.onActivated.addListener(fetchAnalysis);
    chrome.tabs.onUpdated.addListener(fetchAnalysis);
    fetchAnalysis();

    return () => {
      chrome.tabs.onActivated.removeListener(fetchAnalysis);
      chrome.tabs.onUpdated.removeListener(fetchAnalysis);
    };
  }, []);

  return (
    <div className="w-[400px]">
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4">
        <h1 className="text-xl font-bold">contentSafetyFilter</h1>
        <p className="text-sm text-blue-100">AI-powered content safety analysis</p>
      </div>
      
      <div className="border-b">
        <div className="flex">
          {['analysis', 'history', 'settings'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 capitalize ${
                activeTab === tab 
                  ? 'border-b-2 border-blue-500 text-blue-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'analysis' && <AnalysisTab analysis={analysis} loading={loading} />}
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
};

export default PopupContent;