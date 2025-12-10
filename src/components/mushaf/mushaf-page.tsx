'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Ayah as AyahType, WordAnalysis } from '@/types'
import { Ayah } from './ayah'
import { PageHeader } from './page-header'
import { VerseNumber } from './verse-number'

interface MushafPageProps {
  pageNumber: number
  ayahs: AyahType[]
  onAyahClick?: (ayah: AyahType) => void
  onWordClick?: (word: WordAnalysis) => void
  showTranslation?: boolean
  showTajweed?: boolean
  className?: string
}

export function MushafPage({ 
  pageNumber, 
  ayahs, 
  onAyahClick, 
  onWordClick,
  showTranslation = false,
  showTajweed = true,
  className = ""
}: MushafPageProps) {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null)
  const [selectedAyah, setSelectedAyah] = useState<string | null>(null)

  // Group ayahs by page side (left/right)
  const leftPageAyahs = ayahs.filter(ayah => ayah.pageNumber === pageNumber && ayah.ayahNumber % 2 === 0)
  const rightPageAyahs = ayahs.filter(ayah => ayah.pageNumber === pageNumber && ayah.ayahNumber % 2 === 1)

  const handleAyahClick = useCallback((ayah: AyahType) => {
    setSelectedAyah(ayah.id)
    onAyahClick?.(ayah)
  }, [onAyahClick])

  const handleWordClick = useCallback((word: WordAnalysis, event: React.MouseEvent) => {
    event.stopPropagation()
    onWordClick?.(word)
  }, [onWordClick])

  const handleWordHover = useCallback((wordId: string | null) => {
    setHoveredWord(wordId)
  }, [])

  return (
    <div className={`mushaf-page max-w-6xl mx-auto ${className}`}>
      {/* Page Header */}
      <PageHeader pageNumber={pageNumber} />
      
      {/* Main Content Area */}
      <div className="relative bg-cream-50 rounded-lg p-8 min-h-[800px] shadow-inner">
        {/* Decorative Border */}
        <div className="absolute inset-4 border-2 border-emerald-300 rounded-lg">
          <div className="absolute inset-2 border border-emerald-200 rounded-lg"></div>
        </div>

        {/* Page Content */}
        <div className="relative z-10 grid grid-cols-2 gap-8 h-full min-h-[750px]">
          {/* Left Page */}
          <div className="flex flex-col">
            <div className="flex-1 space-y-4 arabic-text text-right pr-4">
              {leftPageAyahs.map((ayah, index) => (
                <motion.div
                  key={ayah.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <Ayah
                    ayah={ayah}
                    showTranslation={showTranslation}
                    showTajweed={showTajweed}
                    onWordClick={handleWordClick}
                    onWordHover={handleWordHover}
                    isHovered={hoveredWord !== null}
                    isSelected={selectedAyah === ayah.id}
                    onClick={() => handleAyahClick(ayah)}
                  />
                  
                  {/* Verse Number */}
                  {ayah.ayahNumber % 2 === 0 && (
                    <VerseNumber
                      number={ayah.ayahNumber}
                      position="left"
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12"
                    />
                  )}
                </motion.div>
              ))}
              
              {/* Page number for left page */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <span className="text-ink-600 text-sm font-medium">
                  {pageNumber % 2 === 0 ? pageNumber : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Right Page */}
          <div className="flex flex-col">
            <div className="flex-1 space-y-4 arabic-text text-right pr-4">
              {rightPageAyahs.map((ayah, index) => (
                <motion.div
                  key={ayah.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <Ayah
                    ayah={ayah}
                    showTranslation={showTranslation}
                    showTajweed={showTajweed}
                    onWordClick={handleWordClick}
                    onWordHover={handleWordHover}
                    isHovered={hoveredWord !== null}
                    isSelected={selectedAyah === ayah.id}
                    onClick={() => handleAyahClick(ayah)}
                  />
                  
                  {/* Verse Number */}
                  {ayah.ayahNumber % 2 === 1 && (
                    <VerseNumber
                      number={ayah.ayahNumber}
                      position="right"
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-12"
                    />
                  )}
                </motion.div>
              ))}
              
              {/* Page number for right page */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <span className="text-ink-600 text-sm font-medium">
                  {pageNumber % 2 === 1 ? pageNumber : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stop Signs (Waqf) - These would be positioned based on actual Waqf locations */}
        {ayahs.map(ayah => (
          <div key={`waqf-${ayah.id}`} className="absolute">
            {/* This would need actual Waqf position data */}
          </div>
        ))}

        {/* Decorative Corner Elements */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-emerald-400 opacity-50"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-emerald-400 opacity-50"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-emerald-400 opacity-50"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-emerald-400 opacity-50"></div>
      </div>

      {/* Page Shadow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ink-100 to-transparent opacity-20 rounded-lg pointer-events-none"></div>
    </div>
  )
}