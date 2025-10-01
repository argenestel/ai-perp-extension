import { Message, ConversationSession } from '@/types/chat';

class MemoryService {
  private storageKey = 'avano-chat-sessions';
  private currentSessionId: string | null = null;

  // Get all conversation sessions
  getSessions(): ConversationSession[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading sessions:', error);
      return [];
    }
  }

  // Get a specific session by ID
  getSession(sessionId: string): ConversationSession | null {
    const sessions = this.getSessions();
    return sessions.find(session => session.id === sessionId) || null;
  }

  // Create a new session
  createSession(title?: string): ConversationSession {
    const session: ConversationSession = {
      id: this.generateSessionId(),
      title: title || this.generateDefaultTitle(),
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const sessions = this.getSessions();
    sessions.unshift(session); // Add to beginning
    this.saveSessions(sessions);
    
    this.currentSessionId = session.id;
    return session;
  }

  // Update an existing session
  updateSession(sessionId: string, updates: Partial<ConversationSession>): boolean {
    const sessions = this.getSessions();
    const sessionIndex = sessions.findIndex(session => session.id === sessionId);
    
    if (sessionIndex === -1) return false;

    sessions[sessionIndex] = {
      ...sessions[sessionIndex],
      ...updates,
      updatedAt: new Date(),
    };

    this.saveSessions(sessions);
    return true;
  }

  // Add a message to a session
  addMessage(sessionId: string, message: Message): boolean {
    const sessions = this.getSessions();
    const sessionIndex = sessions.findIndex(session => session.id === sessionId);
    
    if (sessionIndex === -1) return false;

    sessions[sessionIndex].messages.push(message);
    sessions[sessionIndex].updatedAt = new Date();

    // Auto-generate title from first user message if not set
    if (!sessions[sessionIndex].title && message.role === 'user') {
      sessions[sessionIndex].title = this.generateTitleFromMessage(message.content);
    }

    this.saveSessions(sessions);
    return true;
  }

  // Delete a session
  deleteSession(sessionId: string): boolean {
    const sessions = this.getSessions();
    const filteredSessions = sessions.filter(session => session.id !== sessionId);
    
    if (filteredSessions.length === sessions.length) return false;

    this.saveSessions(filteredSessions);
    
    // Clear current session if it was deleted
    if (this.currentSessionId === sessionId) {
      this.currentSessionId = null;
    }
    
    return true;
  }

  // Set the current active session
  setCurrentSession(sessionId: string | null): void {
    this.currentSessionId = sessionId;
  }

  // Get the current active session
  getCurrentSession(): ConversationSession | null {
    if (!this.currentSessionId) return null;
    return this.getSession(this.currentSessionId);
  }

  // Clear all sessions
  clearAllSessions(): void {
    localStorage.removeItem(this.storageKey);
    this.currentSessionId = null;
  }

  // Get recent sessions (last 10)
  getRecentSessions(limit: number = 10): ConversationSession[] {
    const sessions = this.getSessions();
    return sessions.slice(0, limit);
  }

  // Search sessions by title or message content
  searchSessions(query: string): ConversationSession[] {
    const sessions = this.getSessions();
    const lowerQuery = query.toLowerCase();
    
    return sessions.filter(session => 
      session.title.toLowerCase().includes(lowerQuery) ||
      session.messages.some(message => 
        message.content.toLowerCase().includes(lowerQuery)
      )
    );
  }

  // Private helper methods
  private saveSessions(sessions: ConversationSession[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateDefaultTitle(): string {
    const now = new Date();
    return `Chat ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  }

  private generateTitleFromMessage(content: string): string {
    // Extract first few words as title, max 50 characters
    const words = content.trim().split(/\s+/);
    const title = words.slice(0, 8).join(' ');
    return title.length > 50 ? title.substring(0, 47) + '...' : title;
  }
}

// Export singleton instance
export const memoryService = new MemoryService();
