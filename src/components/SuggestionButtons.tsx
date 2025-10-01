import * as React from 'react';
import { Button } from '@/components/ui/button';

interface Suggestion {
  action: 'long' | 'short';
  collateral?: number;
  leverage?: number;
  takeProfit?: number;
  stopLoss?: number;
}

interface SuggestionButtonsProps {
  content: string;
}

const parseJson = (content: string): any | null => {
    const jsonRegex = /```json\n(.*)\n```/s;
    const match = content.match(jsonRegex);
    if (!match || !match[1]) return null;
    try {
        return JSON.parse(match[1]);
    } catch {
        return null;
    }
}

const getSuggestions = (data: any): Suggestion[] | null => {
    if (!data) return null;

    // Case 1: Array of suggestions from 'Analyze Trade'
    if (Array.isArray(data)) {
        return data.filter(item => item.action === 'long' || item.action === 'short');
    }

    // Case 2: Single recommendation object from a direct question
    if (data.recommendation) {
        const action = data.recommendation.toLowerCase();
        if (action === 'long' || action === 'short') {
            return [{
                action: action,
                collateral: data.collateral,
                leverage: data.leverage,
                takeProfit: data.takeProfit,
                stopLoss: data.stopLoss,
            }];
        }
    }

    return null;
}

const handleApplySuggestion = (suggestion: Suggestion) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "fillTradeForm", data: suggestion });
    }
  });
};

export const SuggestionButtons: React.FC<SuggestionButtonsProps> = ({ content }) => {
  const jsonData = parseJson(content);
  const suggestions = getSuggestions(jsonData);

  if (!suggestions) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => handleApplySuggestion(suggestion)}
        >
          Apply {suggestion.action.charAt(0).toUpperCase() + suggestion.action.slice(1)} Suggestion
        </Button>
      ))}
    </div>
  );
};
