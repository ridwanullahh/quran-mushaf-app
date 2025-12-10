'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MushafPage } from './mushaf-page'
import { ListView } from './list-view'
import { PageNavigation } from './page-navigation'
import { useQuranData } from '@/hooks/use-quran-data'
import { useNavigation } from '@/hooks/use-navigation'
import { useTheme } from '@/hooks/use-theme'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorMessage } from '@/components/ui/error-message'
import { Button } from '@/components/ui/button'
import { 
  BookOpenIcon, 
  ListBulletIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'

export function MushafViewer() {
  const [viewMode, setViewMode] = useState<'mushaf' | 'list'>('mushaf')
  const [currentPage, setCurrentPage] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  
  const { 
    currentSurah, 
    currentAyah, 
    setCurrentSurah, 
    setCurrentAyah 
  } = useNavigation()
  
  const { theme } = useTheme()
  const { 
    surahs, 
    ayahs, 
    loading, 
    error, 
    getAyahsByPage,
    getAyahsBySurah 
  } = useQuranData()

  // Get current page data
  const { data: pageAyahs, isLoading: pageLoading } = useQuranData({
    type: 'page',
    pageNumber: currentPage,
    enabled: !!currentPage
  })

  // Get current surah data
  const { data: surahAyahs, isLoading: surahLoading } = useQuranData({
    type: 'surah',
    surahId: currentSurah?.toString(),
    enabled: !!currentSurah && viewMode === 'list'
  })

  // Navigation handlers
  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }, [currentPage])

  const goToNextPage = useCallback(() => {
    if (currentPage < 604) { // Total pages in Mushaf
      setCurrentPage(prev => prev + 1)
    }
  }, [currentPage])

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= 604) {
      setCurrentPage(page)
    }
  }, [])

  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === 'mushaf' ? 'list' : 'mushaf')
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
        case 'h':
          event.preventDefault()
          goToPreviousPage()
          break
        case 'ArrowRight':
        case 'l':
          event.preventDefault()
          goToNextPage()
          break
        case 'v':
          event.preventDefault()
          toggleViewMode()
          break
        case 's':
          event.preventDefault()
          setShowSettings(prev => !prev)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [goToPreviousPage, goToNextPage, toggleViewMode])

  // Loading state
  if (loading || pageLoading || surahLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-ink-600">Loading Quran...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <ErrorMessage 
          message="Failed to load Quran data. Please try again." 
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-ink-800">
            {currentSurah ? 
              `Surah ${surahs?.find(s => s.id === currentSurah.toString())?.name || 'Loading...'}` :
              'Quran Mushaf'
            }
          </h1>
          
          {currentSurah && (
            <span className="text-sm text-ink-600">
              Ayah {currentAyah || 1}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <Button
            variant={viewMode === 'mushaf' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('mushaf')}
            className="flex items-center space-x-2"
          >
            <BookOpenIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Mushaf</span>
          </Button>
          
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="flex items-center space-x-2"
          >
            <ListBulletIcon className="w-4 h-4" />
            <span className="hidden sm:inline">List</span>
          </Button>

          {/* Settings Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center space-x-2"
          >
            <AdjustmentsHorizontalIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {viewMode === 'mushaf' ? (
            <motion.div
              key={`mushaf-${currentPage}`}
              initial={{ opacity: 0, rotateY: -15 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 15 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="page-container"
            >
              <MushafPage
                pageNumber={currentPage}
                ayahs={pageAyahs || []}
                onAyahClick={(ayah) => {
                  setCurrentSurah(ayah.surahId)
                  setCurrentAyah(ayah.ayahNumber)
                }}
                onWordClick={(word) => {
                  // Handle word click for analysis
                  console.log('Word clicked:', word)
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key={`list-${currentSurah}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ListView
                surahId={currentSurah?.toString()}
                ayahs={surahAyahs || []}
                onAyahClick={(ayah) => {
                  setCurrentAyah(ayah.ayahNumber)
                }}
                onWordClick={(word) => {
                  console.log('Word clicked:', word)
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center mt-8 space-x-4">
          <Button
            variant="outline"
            size="lg"
            onClick={goToPreviousPage}
            disabled={currentPage <= 1}
            className="flex items-center space-x-2"
          >
            <ChevronLeftIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <PageNavigation
            currentPage={currentPage}
            totalPages={604}
            onPageSelect={goToPage}
          />

          <Button
            variant="outline"
            size="lg"
            onClick={goToNextPage}
            disabled={currentPage >= 604}
            className="flex items-center space-x-2"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRightIcon className="w-5 h-5" />
          </Button>
        </div>

        {/* Page Info */}
        <div className="text-center mt-4 text-sm text-ink-600">
          Page {currentPage} of 604 • 
          {currentSurah && (
            <span className="ml-2">
              Surah {surahs?.find(s => s.id === currentSurah.toString())?.name}
            </span>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed right-4 top-20 w-80 bg-white rounded-lg shadow-xl border border-cream-200 p-6 z-50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-ink-800">Reading Settings</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(false)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">
                  Font Size
                </label>
                <select className="w-full p-2 border border-cream-300 rounded-md focus:ring-2 focus:ring-primary-500">
                  <option value="small">Small</option>
                  <option value="medium" selected>Medium</option>
                  <option value="large">Large</option>
                  <option value="extra-large">Extra Large</option>
                </select>
              </div>

              {/* Tajweed Colors */}
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 rounded" defaultChecked />
                  <span className="text-sm">Enable Tajweed colors</span>
                </label>
              </div>

              {/* Translation */}
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">
                  Translation Language
                </label>
                <select className="w-full p-2 border border-cream-300 rounded-md focus:ring-2 focus:ring-primary-500">
                  <option value="">No Translation</option>
                  <option value="en" selected>English</option>
                  <option value="ur">Urdu</option>
                  <option value="id">Indonesian</option>
                  <option value="tr">Turkish</option>
                </select>
              </div>

              {/* Audio Settings */}
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">
                  Reciter
                </label>
                <select className="w-full p-2 border border-cream-300 rounded-md focus:ring-2 focus:ring-primary-500">
                  <option value="shatri">Abdul Basit</option>
                  <option value="sudais">Al-Sudais</option>
                  <option value="minshawi">El-Minshawi</option>
                  <option value="husary">Al-Husary</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Help */}
      <div className="hidden lg:block fixed bottom-4 left-4 bg-ink-800 text-white p-3 rounded-lg text-xs opacity-75 hover:opacity-100 transition-opacity">
        <div>← → or H/L: Navigate pages</div>
        <div>V: Toggle view mode</div>
        <div>S: Settings</div>
      </div>
    </div>
  )
}