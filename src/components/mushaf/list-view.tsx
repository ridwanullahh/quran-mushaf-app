'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Ayah as AyahType, WordAnalysis } from '@/types'
import { Ayah } from './ayah'
import { SurahHeader } from './surah-header'
import { ListPagination } from './list-pagination'
import { SearchAndFilter } from './search-and-filter'

interface ListViewProps {
  surahId?: string
  ayahs: AyahType[]
  onAyahClick?: (ayah: AyahType) => void
  onWordClick?: (word: WordAnalysis) => void
  showTranslation?: boolean
  showTajweed?: boolean
  className?: string
}

export function ListView({
  surahId,
  ayahs,
  onAyahClick,
  onWordClick,
  showTranslation = true,
  showTajweed = true,
  className = ""
}: ListViewProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [sortBy, setSortBy] = useState<'number' | 'page'>('number')
  const [filterText, setFilterText] = useState('')
  const [selectedAyah, setSelectedAyah] = useState<string | null>(null)

  // Filter ayahs based on search text
  const filteredAyahs = ayahs.filter(ayah => {
    if (!filterText) return true
    
    const searchLower = filterText.toLowerCase()
    const arabicMatch = ayah.arabicText.includes(filterText)
    const translationMatch = ayah.translations?.some(t => 
      t.translation.toLowerCase().includes(searchLower)
    ) || false
    const tafseerMatch = Object.values(ayah.tafseer || {}).some(tafseer => 
      tafseer.toLowerCase().includes(searchLower)
    )
    
    return arabicMatch || translationMatch || tafseerMatch
  })

  // Sort ayahs
  const sortedAyahs = [...filteredAyahs].sort((a, b) => {
    if (sortBy === 'page') {
      return a.pageNumber - b.pageNumber || a.ayahNumber - b.ayahNumber
    }
    return a.ayahNumber - b.ayahNumber
  })

  // Pagination
  const totalPages = Math.ceil(sortedAyahs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAyahs = sortedAyahs.slice(startIndex, startIndex + itemsPerPage)

  const handleAyahClick = useCallback((ayah: AyahType) => {
    setSelectedAyah(ayah.id)
    onAyahClick?.(ayah)
  }, [onAyahClick])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    // Scroll to top of list
    document.getElementById('list-view-container')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    })
  }, [])

  const handleSearch = useCallback((query: string) => {
    setFilterText(query)
    setCurrentPage(1) // Reset to first page when searching
  }, [])

  const handleSortChange = useCallback((newSortBy: 'number' | 'page') => {
    setSortBy(newSortBy)
    setCurrentPage(1) // Reset to first page when sorting
  }, [])

  return (
    <div id="list-view-container" className={`max-w-4xl mx-auto ${className}`}>
      {/* Surah Header */}
      {surahId && (
        <SurahHeader surahId={surahId} className="mb-6" />
      )}

      {/* Search and Filter Controls */}
      <div className="mb-6">
        <SearchAndFilter
          onSearch={handleSearch}
          onSortChange={handleSortChange}
          currentSort={sortBy}
          totalResults={sortedAyahs.length}
          placeholder="Search in Arabic, translations, or tafseer..."
        />
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-ink-600">
        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedAyahs.length)} of {sortedAyahs.length} verses
        {filterText && ` matching "${filterText}"`}
      </div>

      {/* Ayah List */}
      <div className="space-y-6">
        {paginatedAyahs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-ink-400 text-lg mb-2">No verses found</div>
            <div className="text-ink-500 text-sm">
              {filterText ? 'Try adjusting your search terms' : 'No verses available for this surah'}
            </div>
          </motion.div>
        ) : (
          paginatedAyahs.map((ayah, index) => (
            <motion.div
              key={ayah.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                bg-white rounded-lg shadow-sm border border-cream-200 p-6
                ${selectedAyah === ayah.id ? 'ring-2 ring-primary-500 border-primary-300' : ''}
                hover:shadow-md transition-shadow duration-200
              `}
            >
              {/* Verse Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-sm text-ink-600">
                    <span>Verse {ayah.ayahNumber}</span>
                    <span>•</span>
                    <span>Page {ayah.pageNumber}</span>
                    {ayah.juzNumber && (
                      <>
                        <span>•</span>
                        <span>Juz {ayah.juzNumber}</span>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAyahClick(ayah)}
                    className="text-xs text-primary-600 hover:text-primary-700 px-2 py-1 rounded hover:bg-primary-50 transition-colors"
                  >
                    Select
                  </button>
                  
                  {ayah.audioUrl && (
                    <button
                      className="text-xs text-emerald-600 hover:text-emerald-700 px-2 py-1 rounded hover:bg-emerald-50 transition-colors"
                      title="Play audio"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                  
                  <button
                    className="text-xs text-ink-500 hover:text-ink-700 px-2 py-1 rounded hover:bg-cream-100 transition-colors"
                    title="Copy verse"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Arabic Text */}
              <div className="mb-4">
                <Ayah
                  ayah={ayah}
                  showTranslation={showTranslation}
                  showTajweed={showTajweed}
                  onWordClick={onWordClick}
                  onClick={() => handleAyahClick(ayah)}
                  isSelected={selectedAyah === ayah.id}
                />
              </div>

              {/* Additional Information */}
              {(ayah.tafseer || ayah.translations?.length) && (
                <div className="mt-4 pt-4 border-t border-cream-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-ink-500">
                      {ayah.translations && ayah.translations.length > 0 && (
                        <span>{ayah.translations.length} translation{ayah.translations.length !== 1 ? 's' : ''}</span>
                      )}
                      {Object.keys(ayah.tafseer || {}).length > 0 && (
                        <span>{Object.keys(ayah.tafseer!).length} tafseer{Object.keys(ayah.tafseer!).length !== 1 ? 's' : ''}</span>
                      )}
                      {ayah.words && (
                        <span>{ayah.words.length} words</span>
                      )}
                    </div>
                    
                    <button className="text-xs text-primary-600 hover:text-primary-700">
                      View details →
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <ListPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            showPageNumbers={true}
            maxPageNumbers={7}
          />
        </div>
      )}

      {/* Load More (if needed for infinite scroll) */}
      {totalPages > 10 && (
        <div className="text-center mt-8">
          <button className="px-6 py-2 bg-cream-200 hover:bg-cream-300 text-ink-700 rounded-lg transition-colors">
            Load More Verses
          </button>
        </div>
      )}
    </div>
  )
}