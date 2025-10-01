import * as React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BarChart3 } from 'lucide-react';

export const ChatHeader: React.FC = () => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 bg-primary flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary-foreground" />
          </div>
          <span>Trader Assistant</span>
          <BarChart3 className="w-4 h-4 text-primary" />
        </CardTitle>
      </CardHeader>
    </Card>
  );
};
