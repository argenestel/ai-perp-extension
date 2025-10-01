import * as React from 'react';
import { useState, useEffect } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ApiKeyConfig } from './ApiKeyConfig';
import { SessionSidebar } from './SessionSidebar';
import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { Trash2, Settings, Scan } from 'lucide-react';

export const ChatInterface: React.FC = () => {
  const { 
    messages, 
    isLoading, 
    error, 
    currentSession,
    sessions,
    sendMessage, 
    clearMessages,
    createNewSession,
    switchToSession,
    deleteSession,
    updateSessionTitle,
  } = useChat();
  const [showConfig, setShowConfig] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if API key is configured
    chrome.storage.local.get(['googleApiKey'], (result) => {
      setHasApiKey(!!result.googleApiKey);
    });
  }, []);

  const handleApiKeySet = (apiKey: string) => {
    setHasApiKey(true);
    setShowConfig(false);
    // Update the global environment variable
    (window as any).GOOGLE_API_KEY = apiKey;
  };

  const handleAnalyzeTrade = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getTradeData" }, (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            return;
          }
          if (response) {
            const tradeDataString = JSON.stringify(response, null, 2);
            const message = `Please analyze the following trade data and provide suggestions in JSON format. The suggestions should be an array of objects, each with 'action' ('long' or 'short'), 'collateral', 'leverage', 'takeProfit', and 'stopLoss'.\n\n\`\`\`json\n${tradeDataString}\n\`\`\``;
            sendMessage(message);
          }
        });
      }
    });
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <SessionSidebar
        sessions={sessions}
        currentSession={currentSession}
        onSessionSelect={switchToSession}
        onSessionDelete={deleteSession}
        onSessionRename={updateSessionTitle}
        onCreateNew={createNewSession}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <ChatHeader />
      
      {showConfig && (
        <ApiKeyConfig onApiKeySet={handleApiKeySet} />
      )}
      
      <div className="flex-1 flex flex-col min-h-0">
        <ChatMessages messages={messages} />
        
        {error && (
          <div className="px-4 py-2 bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}
        
        <div className="flex justify-between items-center px-4 py-2 border-t bg-muted/50">
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              {currentSession ? (
                <>
                  {currentSession.title} • {messages.length} message{messages.length !== 1 ? 's' : ''}
                </>
              ) : (
                `${messages.length} message${messages.length !== 1 ? 's' : ''}`
              )}
            </div>
            {!hasApiKey && (
              <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                Using fallback responses
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAnalyzeTrade}
              className="text-muted-foreground hover:text-foreground"
            >
              <Scan className="w-4 h-4 mr-2" />
              Analyze Trade
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfig(!showConfig)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings className="w-4 h-4 mr-2" />
              {showConfig ? 'Hide Config' : 'Settings'}
            </Button>
            {messages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearMessages}
                className="text-muted-foreground hover:text-foreground"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Chat
              </Button>
            )}
          </div>
        </div>
        
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};
