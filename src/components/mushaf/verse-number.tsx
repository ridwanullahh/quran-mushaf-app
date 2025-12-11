import React from 'react';
import { motion } from 'framer-motion';

interface VerseNumberProps {
  number: number;
  className?: string;
}

export function VerseNumber({ number, className }: VerseNumberProps) {
  return (
    <motion.span
      className={`inline-flex items-center justify-center w-8 h-8 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-full ${className}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 500,
        damping: 30,
        delay: 0.1 
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {number}
    </motion.span>
  );
}