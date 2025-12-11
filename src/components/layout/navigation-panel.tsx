import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Home, Search, BookOpen, Settings } from 'lucide-react';

interface NavigationPanelProps {
  className?: string;
}

export function NavigationPanel({ className }: NavigationPanelProps) {
  return (
    <nav className={`bg-white border-r border-gray-200 ${className}`}>
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-6">
          <BookOpen className="h-6 w-6 text-green-600" />
          <span className="font-bold text-lg">Quran Mushaf</span>
        </div>
        
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <BookOpen className="h-4 w-4 mr-2" />
            Mushaf
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </nav>
  );
}