import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TranslationTooltipProps {
  translation: string;
  isVisible: boolean;
  position: { x: number; y: number };
}

export function TranslationTooltip({ translation, isVisible, position }: TranslationTooltipProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2 }}
          className="fixed z-50 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm shadow-lg max-w-xs"
          style={{
            left: position.x,
            top: position.y - 10,
          }}
        >
          {translation}
          <div 
            className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}