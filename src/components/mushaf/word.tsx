'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { WordAnalysis } from '@/types'

interface WordProps {
  word: WordAnalysis
  tajweedClass?: string
  isHovered?: boolean
  isSelected?: boolean
  onClick?: (event: React.MouseEvent, word: WordAnalysis) => void
  onHover?: (word: WordAnalysis | null) => void
  className?: string
}

export function Word({ 
  word, 
  tajweedClass = 'tajweed-normal',
  isHovered = false,
  isSelected = false,
  onClick,
  onHover,
  className = ""
}: WordProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  const handleMouseEnter = useCallback((event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top
    })
    setShowTooltip(true)
    onHover?.(word)
  }, [word, onHover])

  const handleMouseLeave = useCallback(() => {
    setShowTooltip(false)
    onHover?.(null)
  }, [onHover])

  const handleClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    // Create word data for analysis
    const wordData: WordAnalysis = {
      id: word.id || `${word.surahId}-${word.ayahNumber}-${word.wordNumber}`,
      surahId: word.surahId,
      ayahNumber: word.ayahNumber,
      wordNumber: word.wordNumber,
      arabicWord: word.arabicWord,
      transliteration: word.transliteration,
      tajweedClass: word.tajweedClass || 'normal',
      morphology: word.morphology || {
        root: '',
        lemma: '',
        partOfSpeech: '',
        tense: '',
        gender: '',
        number: '',
        person: '',
        confidence: 0
      },
      meaning: word.meaning || {},
      tafseerNotes: word.tafseerNotes || {},
      relatedWords: word.relatedWords || [],
      position: word.position || { x: 0, y: 0 },
      audioUrl: word.audioUrl || ''
    }
    
    onClick?.(event, wordData)
  }, [word, onClick])

  return (
    <motion.span
      className={`
        relative inline-block cursor-pointer transition-all duration-200
        ${tajweedClass}
        ${isHovered ? 'scale-105 shadow-sm' : ''}
        ${isSelected ? 'bg-yellow-200 bg-opacity-50 rounded px-1' : ''}
        ${className}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Main Arabic Word */}
      <span className="relative z-10">
        {word.arabicWord}
        {word.arabicWord.includes('ّ') && (
          <span className="absolute -top-1 -right-1 text-xs">
            ّ {/* Shadda marker */}
          </span>
        )}
        {word.arabicWord.includes('ً') && (
          <span className="absolute -top-2 -right-1 text-xs">
            ً {/* Tanween Fathah */}
          </span>
        )}
        {word.arabicWord.includes('ٍ') && (
          <span className="absolute -top-2 -right-1 text-xs">
            ٍ {/* Tanween Kasra */}
          </span>
        )}
        {word.arabicWord.includes('ٌ') && (
          <span className="absolute -top-2 -right-1 text-xs">
            ٌ {/* Tanween Dammah */}
          </span>
        )}
      </span>

      {/* Hover/Click Indicator */}
      {(isHovered || isSelected) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full"
        />
      )}

      {/* Morphology Indicators */}
      {word.morphology.partOfSpeech && (
        <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-ink-500 opacity-0 group-hover:opacity-100 transition-opacity">
          {word.morphology.partOfSpeech}
        </span>
      )}

      {/* Tajweed Rule Indicator */}
      {word.tajweedClass !== 'normal' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          className="absolute -top-2 -left-1 text-xs"
          title={`Tajweed rule: ${word.tajweedClass}`}
        >
          <div className={`w-1 h-1 rounded-full ${
            word.tajweedClass === 'ikhfah' ? 'bg-blue-500' :
            word.tajweedClass === 'idgham' ? 'bg-orange-500' :
            word.tajweedClass === 'iqlab' ? 'bg-purple-500' :
            word.tajweedClass === 'ghunna' ? 'bg-pink-500' :
            word.tajweedClass === 'madd' ? 'bg-green-500' :
            word.tajweedClass === 'qalqalah' ? 'bg-red-500' :
            'bg-gray-500'
          }`} />
        </motion.div>
      )}

      {/* Detailed Tooltip */}
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          className="fixed z-50 bg-white border border-cream-200 rounded-lg shadow-xl p-4 max-w-sm pointer-events-none"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y - 10,
            transform: 'translateX(-50%) translateY(-100%)'
          }}
        >
          {/* Arabic Word */}
          <div className="text-xl arabic-text text-ink-900 mb-2 text-right">
            {word.arabicWord}
          </div>

          {/* Transliteration */}
          <div className="text-sm text-ink-600 mb-2">
            <span className="font-medium">Transliteration:</span> {word.transliteration}
          </div>

          {/* Morphology */}
          <div className="text-xs text-ink-500 mb-2 space-y-1">
            {word.morphology.root && (
              <div><span className="font-medium">Root:</span> {word.morphology.root}</div>
            )}
            {word.morphology.partOfSpeech && (
              <div><span className="font-medium">Part of Speech:</span> {word.morphology.partOfSpeech}</div>
            )}
            {word.morphology.tense && (
              <div><span className="font-medium">Tense:</span> {word.morphology.tense}</div>
            )}
            {word.morphology.gender && (
              <div><span className="font-medium">Gender:</span> {word.morphology.gender}</div>
            )}
            {word.morphology.number && (
              <div><span className="font-medium">Number:</span> {word.morphology.number}</div>
            )}
          </div>

          {/* Meanings */}
          <div className="text-xs text-ink-600 mb-2">
            <div className="font-medium mb-1">Meanings:</div>
            {Object.entries(word.meaning).map(([lang, meaning]) => (
              <div key={lang} className="mb-1">
                <span className="uppercase text-xs text-ink-400">{lang}:</span> {meaning}
              </div>
            ))}
          </div>

          {/* Tafseer Notes */}
          {Object.keys(word.tafseerNotes).length > 0 && (
            <div className="text-xs text-ink-600">
              <div className="font-medium mb-1">Tafseer Notes:</div>
              {Object.entries(word.tafseerNotes).map(([lang, note]) => (
                <div key={lang} className="mb-1">
                  <span className="uppercase text-xs text-ink-400">{lang}:</span> {note.slice(0, 100)}...
                </div>
              ))}
            </div>
          )}

          {/* Tajweed Info */}
          {word.tajweedClass !== 'normal' && (
            <div className="text-xs text-ink-500 mt-2 pt-2 border-t border-cream-200">
              <div className="font-medium">Tajweed Rule:</div>
              <div className={`capitalize ${
                word.tajweedClass === 'ikhfah' ? 'text-blue-600' :
                word.tajweedClass === 'idgham' ? 'text-orange-600' :
                word.tajweedClass === 'iqlab' ? 'text-purple-600' :
                word.tajweedClass === 'ghunna' ? 'text-pink-600' :
                word.tajweedClass === 'madd' ? 'text-green-600' :
                word.tajweedClass === 'qalqalah' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {word.tajweedClass}
              </div>
            </div>
          )}

          {/* Tooltip Arrow */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
          </div>
        </motion.div>
      )}
    </motion.span>
  )
}