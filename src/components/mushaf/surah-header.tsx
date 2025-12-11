import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { Surah } from '@/types';

interface SurahHeaderProps {
  surah: Surah;
  className?: string;
}

export function SurahHeader({ surah, className }: SurahHeaderProps) {
  return (
    <motion.div 
      className={`bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-6 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-4">
        <div className="bg-green-100 p-3 rounded-full">
          <BookOpen className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{surah.name}</h1>
          <p className="text-sm text-gray-600">
            {surah.englishName} • {surah.ayahs.length} verses
          </p>
        </div>
      </div>
    </motion.div>
  );
}