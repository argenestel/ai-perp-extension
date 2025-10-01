import React from 'react';
import { ConversationSession } from '@/types/chat';
import { SessionList } from './SessionList';
import { Button } from '@/components/ui/button';

interface SessionSidebarProps {
  sessions: ConversationSession[];
  currentSession: ConversationSession | null;
  onSessionSelect: (sessionId: string) => void;
  onSessionDelete: (sessionId: string) => void;
  onSessionRename: (sessionId: string, newTitle: string) => void;
  onCreateNew: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const SessionSidebar: React.FC<SessionSidebarProps> = ({
  sessions,
  currentSession,
  onSessionSelect,
  onSessionDelete,
  onSessionRename,
  onCreateNew,
  isOpen,
  onToggle,
}) => {
  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className="fixed top-4 left-4 z-50"
      >
        {isOpen ? '←' : '☰'}
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-background border-r z-40 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Chat History</h2>
            <p className="text-sm text-muted-foreground">
              {sessions.length} conversation{sessions.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <SessionList
            sessions={sessions}
            currentSession={currentSession}
            onSessionSelect={onSessionSelect}
            onSessionDelete={onSessionDelete}
            onSessionRename={onSessionRename}
            onCreateNew={onCreateNew}
          />
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
};
