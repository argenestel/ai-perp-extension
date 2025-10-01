import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, X } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string, imageUrl?: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
            const file = item.getAsFile();
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setImageUrl(event.target?.result as string);
                };
                reader.readAsDataURL(file);
            }
            e.preventDefault();
            return;
        }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || imageUrl) && !isLoading) {
      onSendMessage(message.trim(), imageUrl);
      setMessage('');
      setImageUrl(undefined);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
      <div className="relative">
        {imageUrl && (
          <div className="p-2">
            <div className="relative inline-block">
              <img src={imageUrl} alt="Pasted content" className="max-h-24 rounded-md" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setImageUrl(undefined)}
                className="absolute top-0 right-0 h-6 w-6 bg-gray-900/50 text-white rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="Ask about markets, trading, or financial analysis... (Paste an image or press Enter to send)"
            className="min-h-[60px] max-h-[120px] resize-none"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={(!message.trim() && !imageUrl) || isLoading}
            className="self-end"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};
