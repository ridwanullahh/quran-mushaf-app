'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Ayah as AyahType, WordAnalysis } from '@/types'
import { Word } from './word'
import { TranslationTooltip } from './translation-tooltip'
import { AudioPlayer } from './audio-player'

interface AyahProps {
  ayah: AyahType
  showTranslation?: boolean
  showTajweed?: boolean
  onWordClick?: (word: WordAnalysis, event: React.MouseEvent) => void
  onWordHover?: (wordId: string | null) => void
  onClick?: () => void
  isHovered?: boolean
  isSelected?: boolean
  className?: string
}

export function Ayah({ 
  ayah, 
  showTranslation = false,
  showTajweed = true,
  onWordClick,
  onWordHover,
  onClick,
  isHovered = false,
  isSelected = false,
  className = ""
}: AyahProps) {
  const [hoveredWordId, setHoveredWordId] = useState<string | null>(null)
  const [showAudio, setShowAudio] = useState(false)

  const handleWordClick = useCallback((word: WordAnalysis, event: React.MouseEvent) => {
    setHoveredWordId(word.id)
    onWordClick?.(word, event)
  }, [onWordClick])

  const handleWordHover = useCallback((word: WordAnalysis | null) => {
    const wordId = word?.id || null
    setHoveredWordId(wordId)
    onWordHover?.(wordId)
  }, [onWordHover])

  const handleAudioToggle = useCallback((event: React.MouseEvent) => {
    event.stopPropagation()
    setShowAudio(prev => !prev)
  }, [])

  const getTajweedClass = (wordIndex: number): string => {
    if (!showTajweed || !ayah.tajweedClasses) return 'tajweed-normal'
    
    const tajweedClass = ayah.tajweedClasses.find(tc => tc.wordIndex === wordIndex)
    return tajweedClass ? `tajweed-${tajweedClass.class}` : 'tajweed-normal'
  }

  return (
    <motion.div
      className={`
        relative group cursor-pointer transition-all duration-200
        ${isSelected ? 'bg-yellow-100 bg-opacity-50 rounded-lg p-2 -m-2' : ''}
        ${isHovered ? 'bg-cream-100 bg-opacity-50 rounded p-1 -m-1' : ''}
        ${className}
      `}
      onClick={onClick}
      whileHover={{ scale: 1.002 }}
      whileTap={{ scale: 0.998 }}
    >
      {/* Main Arabic Text */}
      <div className="flex items-start justify-end leading-relaxed">
        <div className="arabic-text text-ink-900">
          {ayah.words ? (
            // Word-by-word rendering
            ayah.words.map((word, index) => (
              <Word
                key={word.id}
                word={word}
                tajweedClass={getTajweedClass(index)}
                isHovered={hoveredWordId === word.id}
                onClick={(event) => handleWordClick(word, event)}
                onHover={(word) => handleWordHover(word)}
                className="interactive-word"
              />
            ))
          ) : (
            // Fallback to plain Arabic text
            <span className={`${getTajweedClass(0)}`}>
              {ayah.arabicText}
            </span>
          )}
        </div>

        {/* Audio Button */}
        {ayah.audioUrl && (
          <button
            onClick={handleAudioToggle}
            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-primary-100 rounded"
            title="Play audio"
          >
            <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Audio Player */}
      {showAudio && ayah.audioUrl && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 mt-2 z-20"
        >
          <AudioPlayer
            audioUrl={ayah.audioUrl}
            ayahId={ayah.id}
            onClose={() => setShowAudio(false)}
          />
        </motion.div>
      )}

      {/* Translation */}
      {showTranslation && ayah.translations && ayah.translations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-2 pt-2 border-t border-cream-200"
        >
          <div className="text-sm text-ink-600 leading-relaxed">
            {ayah.translations.map((translation, index) => (
              <div key={translation.id} className="mb-1 last:mb-0">
                <span className="font-medium text-primary-700 mr-2">
                  {translation.translator}:
                </span>
                <span>{translation.translation}</span>
                {translation.notes && (
                  <div className="text-xs text-ink-500 mt-1 italic">
                    {translation.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tafseer Preview */}
      {ayah.tafseerContent && ayah.tafseerContent.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-2 pt-2 border-t border-cream-200"
        >
          <div className="text-xs text-ink-500 leading-relaxed">
            {ayah.tafseerContent.slice(0, 2).map((tafseer, index) => (
              <div key={tafseer.id} className="mb-1 last:mb-0">
                <span className="font-medium text-emerald-700 mr-2">
                  {tafseer.scholar}:
                </span>
                <span>{Object.values(tafseer.explanation)[0]?.slice(0, 100)}...</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Hover Tooltip for Word Analysis */}
      {hoveredWordId && ayah.words && (
        <TranslationTooltip
          word={ayah.words.find(w => w.id === hoveredWordId)}
          position="top"
          onClose={() => setHoveredWordId(null)}
        />
      )}

      {/* Background decoration for selected state */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 to-yellow-200 opacity-30 rounded-lg -z-10"></div>
      )}

      {/* Stop sign indicators (Waqf) - would need actual waqf data */}
      {ayah.words && ayah.words.some(w => w.arabicWord.match(/[قلىجلا]$/)) && (
        <div className="absolute top-0 right-0 text-xs text-ink-500 mt-1">
          {/* This would show waqf signs like قلى or ج or لا */}
        </div>
      )}
    </motion.div>
  )
}