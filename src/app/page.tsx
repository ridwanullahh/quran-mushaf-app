'use client'

import { Suspense, useState, useCallback } from 'react'
import { MushafViewer } from '@/components/mushaf/mushaf-viewer'
import { NavigationPanel } from '@/components/layout/navigation-panel'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import WordAnalysisPanel from '@/components/mushaf/word-analysis-panel'
import SearchInterface from '@/components/search/search-interface'
import { Button } from '@/components/ui/button'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence } from 'framer-motion'
import { WordAnalysis } from '@/types'
import { useQuranData } from '@/hooks/use-quran-data'

export default function HomePage() {
  const [showSearch, setShowSearch] = useState(false)
  const [selectedWord, setSelectedWord] = useState<WordAnalysis | null>(null)
  const [showWordAnalysis, setShowWordAnalysis] = useState(false)
  
  const { getWordById } = useQuranData()

  const handleWordClick = useCallback(async (wordData: WordAnalysis) => {
    setSelectedWord(wordData)
    setShowWordAnalysis(true)
  }, [])

  const handleCloseWordAnalysis = useCallback(() => {
    setShowWordAnalysis(false)
    setSelectedWord(null)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-cream-100 to-cream-200">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:block w-80 bg-white shadow-lg border-r border-cream-200">
          <div className="sticky top-0 h-screen overflow-y-auto custom-scrollbar">
            <NavigationPanel />
          </div>
        </aside>

        {/* Main Mushaf Viewer */}
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-4 py-6">
            <ErrorBoundary>
              <Suspense fallback={
                <div className="flex items-center justify-center h-96">
                  <LoadingSpinner size="lg" />
                </div>
              }>
                <MushafViewer 
                  onWordClick={handleWordClick}
                  onSearchToggle={() => setShowSearch(!showSearch)}
                  showSearch={showSearch}
                />
              </Suspense>
            </ErrorBoundary>
          </div>
        </main>

        {/* Right Panel - Tools and Settings */}
        <aside className="hidden xl:block w-80 bg-white shadow-lg border-l border-cream-200">
          <div className="sticky top-0 h-screen overflow-y-auto custom-scrollbar p-4">
            <h2 className="text-lg font-semibold text-ink-800 mb-4">Quran Tools</h2>
            
            {/* Translation Settings */}
            <div className="mb-6 p-4 bg-cream-50 rounded-lg border border-cream-200">
              <h3 className="font-medium text-ink-800 mb-3">Translation</h3>
              <select className="w-full p-2 border border-cream-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="en-sahih">English - Sahih International</option>
                <option value="en-pickthall">English - Pickthall</option>
                <option value="en-yusufali">English - Yusuf Ali</option>
                <option value="ar">Arabic Only</option>
                <option value="ur">Urdu</option>
                <option value="id">Indonesian</option>
              </select>
            </div>

            {/* Tajweed Settings */}
            <div className="mb-6 p-4 bg-cream-50 rounded-lg border border-cream-200">
              <h3 className="font-medium text-ink-800 mb-3">Tajweed</h3>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 rounded" defaultChecked />
                <span className="text-sm">Enable Tajweed colors</span>
              </label>
            </div>

            {/* Audio Settings */}
            <div className="mb-6 p-4 bg-cream-50 rounded-lg border border-cream-200">
              <h3 className="font-medium text-ink-800 mb-3">Audio</h3>
              <select className="w-full p-2 border border-cream-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-3">
                <option value="shatri">Abdul Basit Abdul Samad</option>
                <option value="sudais">Abdul Rahman Al-Sudais</option>
                <option value="minshawi">Mohamed Siddiq El-Minshawi</option>
                <option value="husary">Mahmoud Khalil Al-Husary</option>
              </select>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 rounded" />
                <span className="text-sm">Auto-play next ayah</span>
              </label>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-ink-800">Search</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSearch(!showSearch)}
                  className="flex items-center space-x-1"
                >
                  <MagnifyingGlassIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {showSearch ? 'Hide' : 'Show'}
                  </span>
                </Button>
              </div>
              
              <AnimatePresence>
                {showSearch && (
                  <div className="mb-4">
                    <SearchInterface 
                      onSearchResults={(results) => {
                        console.log('Search results:', results)
                        // Handle search results - could navigate to results or update state
                      }}
                      onClose={() => setShowSearch(false)}
                    />
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Bookmarks */}
            <div className="mb-6">
              <h3 className="font-medium text-ink-800 mb-3">Bookmarks</h3>
              <div className="space-y-2">
                <div className="p-2 text-sm text-ink-600 hover:bg-cream-50 rounded cursor-pointer">
                  Al-Fatihah 1-7
                </div>
                <div className="p-2 text-sm text-ink-600 hover:bg-cream-50 rounded cursor-pointer">
                  Al-Baqarah 255
                </div>
                <div className="p-2 text-sm text-ink-600 hover:bg-cream-50 rounded cursor-pointer">
                  Al-Ikhlas 1-4
                </div>
              </div>
            </div>

            {/* Reading Progress */}
            <div className="mb-6">
              <h3 className="font-medium text-ink-800 mb-3">Progress</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm text-ink-600 mb-1">
                    <span>Overall Progress</span>
                    <span>23%</span>
                  </div>
                  <div className="w-full bg-cream-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-ink-600 mb-1">
                    <span>This Month</span>
                    <span>156 ayahs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <Footer />
      
      {/* Word Analysis Panel */}
      <AnimatePresence>
        {showWordAnalysis && selectedWord && (
          <WordAnalysisPanel
            word={selectedWord}
            onClose={handleCloseWordAnalysis}
          />
        )}
      </AnimatePresence>
    </div>
  )
}