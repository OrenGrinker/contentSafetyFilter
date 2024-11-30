import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Progress } from '../ui/progress';
import { Analysis } from '../../types';

interface AnalysisTabProps {
  analysis: Analysis | null;
  loading: boolean;
}

export const AnalysisTab: React.FC<AnalysisTabProps> = ({ analysis, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-full max-w-xs space-y-4">
          <Progress value={33} />
          <p className="text-sm text-center text-gray-500">Analyzing content...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <AlertTitle>Content Safe</AlertTitle>
        <AlertDescription>
          No inappropriate content detected on this page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {analysis.isInappropriate && (
        <Alert variant="destructive">
          <AlertTitle>Warning: Inappropriate Content Detected</AlertTitle>
          <AlertDescription>
            This page contains content that may be inappropriate for users under 18.
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h3 className="font-medium mb-2">Categories Detected:</h3>
        <div className="space-y-2">
          {analysis.categories.map((category) => (
            <div 
              key={category}
              className="bg-red-50 text-red-700 px-3 py-2 rounded-md text-sm"
            >
              {category}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h3 className="font-medium mb-2">AI Analysis</h3>
        <p className="text-gray-600 text-sm">{analysis.explanation}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h3 className="font-medium mb-2">Confidence Score</h3>
        <div className="space-y-2">
          <Progress value={analysis.confidence * 100} />
          <p className="text-sm text-gray-500 text-right">
            {Math.round(analysis.confidence * 100)}%
          </p>
        </div>
      </div>
    </div>
  );
};