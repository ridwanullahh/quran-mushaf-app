import React from 'react';
import { motion } from 'framer-motion';
import { Book, Hash } from 'lucide-react';

interface PageHeaderProps {
  pageNumber: number;
  surahName: string;
  className?: string;
}

export function PageHeader({ pageNumber, surahName, className }: PageHeaderProps) {
  return (
    <motion.div 
      className={`bg-white border-b border-gray-200 p-4 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <Book className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{surahName}</h2>
            <p className="text-sm text-gray-600">Page {pageNumber}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Hash className="h-4 w-4" />
          <span>{pageNumber}</span>
        </div>
      </div>
    </motion.div>
  );
}