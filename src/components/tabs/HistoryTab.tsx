import React, { useState, useEffect } from 'react';
import { TabData } from '../../types';

export const HistoryTab: React.FC = () => {
  const [history, setHistory] = useState<TabData[]>([]);

  useEffect(() => {
    chrome.storage.local.get(null, (data) => {
      const analysisHistory = Object.entries(data)
        .filter(([key, value]: [string, any]) => key.startsWith('tab') && value.analysis)
        .map(([_, value]) => value as TabData)
        .sort((a, b) => b.timestamp - a.timestamp);
      setHistory(analysisHistory);
    });
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Recent Analyses</h3>
      {history.map((item, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">
            {new Date(item.timestamp).toLocaleString()}
          </div>
          <div className="text-sm font-medium truncate">
            {item.url}
          </div>
          <div className={`text-sm mt-2 ${item.analysis.isInappropriate ? 'text-red-600' : 'text-green-600'}`}>
            {item.analysis.isInappropriate ? 'Inappropriate Content' : 'Safe Content'}
          </div>
        </div>
      ))}
      {history.length === 0 && (
        <div className="text-gray-500 text-center py-4">
          No history available
        </div>
      )}
    </div>
  );
};