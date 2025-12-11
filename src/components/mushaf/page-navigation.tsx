import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageNavigationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function PageNavigation({ currentPage, totalPages, onPageChange, className }: PageNavigationProps) {
  return (
    <div className={`flex items-center justify-between p-4 bg-white border-t border-gray-200 ${className}`}>
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center space-x-2"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Previous Page</span>
      </Button>
      
      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
      
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex items-center space-x-2"
      >
        <span>Next Page</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}