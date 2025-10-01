import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Key, Check, AlertCircle } from 'lucide-react';

interface ApiKeyConfigProps {
  onApiKeySet: (apiKey: string) => void;
}

export const ApiKeyConfig: React.FC<ApiKeyConfigProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    // Load saved API key from chrome storage
    chrome.storage.local.get(['googleApiKey'], (result) => {
      if (result.googleApiKey) {
        setApiKey(result.googleApiKey);
        setIsValid(true);
      }
    });
  }, []);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) return;

    setIsValidating(true);
    
    try {
      // Save to chrome storage
      await chrome.storage.local.set({ googleApiKey: apiKey.trim() });
      
      // Update environment variable for the AI service
      (window as any).GOOGLE_API_KEY = apiKey.trim();
      
      setIsValid(true);
      onApiKeySet(apiKey.trim());
    } catch (error) {
      console.error('Failed to save API key:', error);
      setIsValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleClearApiKey = async () => {
    try {
      await chrome.storage.local.remove(['googleApiKey']);
      setApiKey('');
      setIsValid(null);
      (window as any).GOOGLE_API_KEY = undefined;
    } catch (error) {
      console.error('Failed to clear API key:', error);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="w-5 h-5" />
          API Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Key className="w-4 h-4" />
            Google AI API Key
          </label>
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Enter your Google AI API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleSaveApiKey}
              disabled={!apiKey.trim() || isValidating}
              size="sm"
            >
              {isValidating ? (
                <AlertCircle className="w-4 h-4 animate-spin" />
              ) : isValid ? (
                <Check className="w-4 h-4" />
              ) : (
                'Save'
              )}
            </Button>
          </div>
          {isValid && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Check className="w-4 h-4" />
              API key configured successfully
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearApiKey}
                className="ml-auto"
              >
                Clear
              </Button>
            </div>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          <p>
            Get your API key from{' '}
            <a
              href="https://makersuite.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google AI Studio
            </a>
          </p>
          <p className="mt-1">
            Your API key is stored locally in your browser and never shared.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
