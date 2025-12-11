import React from 'react';
import { BookOpen } from 'lucide-react';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={`bg-gray-50 border-t border-gray-200 px-4 py-6 ${className}`}>
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
        <BookOpen className="h-4 w-4" />
        <span>© 2024 Quran Mushaf App. Made with ❤️ for the Ummah.</span>
      </div>
    </footer>
  );
}