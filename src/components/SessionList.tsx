import React, { useState } from 'react';
import { ConversationSession } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SessionListProps {
  sessions: ConversationSession[];
  currentSession: ConversationSession | null;
  onSessionSelect: (sessionId: string) => void;
  onSessionDelete: (sessionId: string) => void;
  onSessionRename: (sessionId: string, newTitle: string) => void;
  onCreateNew: () => void;
}

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  currentSession,
  onSessionSelect,
  onSessionDelete,
  onSessionRename,
  onCreateNew,
}) => {
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleRenameStart = (session: ConversationSession) => {
    setEditingSession(session.id);
    setEditTitle(session.title);
  };

  const handleRenameSave = () => {
    if (editingSession && editTitle.trim()) {
      onSessionRename(editingSession, editTitle.trim());
    }
    setEditingSession(null);
    setEditTitle('');
  };

  const handleRenameCancel = () => {
    setEditingSession(null);
    setEditTitle('');
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Button 
          onClick={onCreateNew}
          className="w-full"
          variant="outline"
        >
          + New Chat
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {sessions.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No conversations yet</p>
              <p className="text-sm">Start a new chat to begin</p>
            </div>
          ) : (
            sessions.map((session) => (
              <Card
                key={session.id}
                className={`p-3 cursor-pointer transition-colors ${
                  currentSession?.id === session.id
                    ? 'bg-primary/10 border-primary'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => onSessionSelect(session.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {editingSession === session.id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={handleRenameSave}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRenameSave();
                          if (e.key === 'Escape') handleRenameCancel();
                        }}
                        className="w-full bg-transparent border-none outline-none text-sm font-medium"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div>
                        <h3 className="text-sm font-medium truncate">
                          {session.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(session.updatedAt)} • {session.messages.length} messages
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {editingSession !== session.id && (
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRenameStart(session);
                        }}
                      >
                        ✏️
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSessionDelete(session.id);
                        }}
                      >
                        🗑️
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
