import { useState, useCallback, useEffect } from 'react';
import { Message, ChatState } from '@/types/chat';
import { aiService } from '@/service/aiservice';
import { memoryService } from '@/services/memoryService';

const mockAIResponses = [
  "That's an interesting market question! Let me provide some trading insights.",
  "I understand your trading inquiry. Here's my analysis...",
  "Great question about the markets! Based on current trends, I can suggest...",
  "I'd be happy to help with that trading strategy. Here's my response:",
  "That's a thoughtful market inquiry. Let me provide some professional insights.",
  "I can definitely assist with that financial question. Here's what I recommend:",
  "Thanks for asking! Here's my perspective on the market situation:",
  "I'm here to help with your trading needs! Let me give you a comprehensive analysis:",
];

const getRandomResponse = (userMessage: string): string => {
  const randomResponse = mockAIResponses[Math.floor(Math.random() * mockAIResponses.length)];
  
  // Add some context-aware responses based on trading keywords
  const lowerMessage = userMessage.toLowerCase();
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm your Trader Assistant. I can help with market analysis, trading strategies, and financial insights. How can I assist you today?";
  }
  if (lowerMessage.includes('help')) {
    return "I'm here to help with your trading needs! You can ask me about market analysis, trading strategies, financial instruments, or any trading-related questions. What would you like to know?";
  }
  if (lowerMessage.includes('thank')) {
    return "You're very welcome! I'm glad I could help with your trading inquiry. Is there anything else about the markets you'd like to know?";
  }
  if (lowerMessage.includes('price') || lowerMessage.includes('market') || lowerMessage.includes('stock') || lowerMessage.includes('crypto')) {
    return randomResponse + ` Regarding "${userMessage}", I'd be happy to provide more detailed market analysis if you'd like to elaborate on any specific aspect.`;
  }
  
  return randomResponse + ` Regarding "${userMessage}", I'd be happy to provide more detailed trading insights if you'd like to elaborate on any specific aspect.`;
};

export const useChat = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    currentSession: null,
    sessions: [],
  });

  // Load sessions on mount
  useEffect(() => {
    const sessions = memoryService.getSessions();
    const currentSession = memoryService.getCurrentSession();
    
    setState(prev => ({
      ...prev,
      sessions,
      currentSession,
      messages: currentSession?.messages || [],
    }));
  }, []);

  const sendMessage = useCallback(async (content: string, imageUrl?: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
      imageUrl,
    };

    // Create new session if none exists
    let currentSession = state.currentSession;
    if (!currentSession) {
      currentSession = memoryService.createSession();
      memoryService.setCurrentSession(currentSession.id);
    }

    // Add user message to memory
    memoryService.addMessage(currentSession.id, userMessage);

    setState((prev: ChatState) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      // Use real AI service instead of mock responses
      const aiResponse = await aiService.generateResponse({ content, imageUrl });
      
      if (aiResponse.error) {
        throw new Error(aiResponse.error);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.content,
        role: 'assistant',
        timestamp: new Date(),
      };

      // Add assistant message to memory
      memoryService.addMessage(currentSession.id, assistantMessage);

      setState((prev: ChatState) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Chat error:', error);
      
      // Fallback to mock response if AI service fails
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getRandomResponse(content),
        role: 'assistant',
        timestamp: new Date(),
      };

      // Add fallback message to memory
      memoryService.addMessage(currentSession.id, fallbackResponse);

      setState((prev: ChatState) => ({
        ...prev,
        messages: [...prev.messages, fallbackResponse],
        isLoading: false,
        error: 'AI service unavailable, using fallback response.',
      }));
    }
  }, [state.currentSession]);

  const clearMessages = useCallback(() => {
    setState((prev: ChatState) => ({
      ...prev,
      messages: [],
      error: null,
    }));
  }, []);

  // Session management functions
  const createNewSession = useCallback(() => {
    const newSession = memoryService.createSession();
    memoryService.setCurrentSession(newSession.id);
    
    setState(prev => ({
      ...prev,
      currentSession: newSession,
      messages: [],
      sessions: [newSession, ...prev.sessions],
      error: null,
    }));
  }, []);

  const switchToSession = useCallback((sessionId: string) => {
    const session = memoryService.getSession(sessionId);
    if (!session) return;

    memoryService.setCurrentSession(sessionId);
    
    setState(prev => ({
      ...prev,
      currentSession: session,
      messages: session.messages,
      error: null,
    }));
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    const success = memoryService.deleteSession(sessionId);
    if (!success) return;

    const sessions = memoryService.getSessions();
    const currentSession = memoryService.getCurrentSession();
    
    setState(prev => ({
      ...prev,
      sessions,
      currentSession,
      messages: currentSession?.messages || [],
      error: null,
    }));
  }, []);

  const updateSessionTitle = useCallback((sessionId: string, title: string) => {
    const success = memoryService.updateSession(sessionId, { title });
    if (!success) return;

    const sessions = memoryService.getSessions();
    const currentSession = memoryService.getCurrentSession();
    
    setState(prev => ({
      ...prev,
      sessions,
      currentSession,
    }));
  }, []);

  const refreshSessions = useCallback(() => {
    const sessions = memoryService.getSessions();
    const currentSession = memoryService.getCurrentSession();
    
    setState(prev => ({
      ...prev,
      sessions,
      currentSession,
    }));
  }, []);

  return {
    ...state,
    sendMessage,
    clearMessages,
    createNewSession,
    switchToSession,
    deleteSession,
    updateSessionTitle,
    refreshSessions,
  };
};
