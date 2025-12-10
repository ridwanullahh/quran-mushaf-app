import { Suspense } from 'react'
import { Metadata } from 'next'
import { MushafViewer } from '@/components/mushaf/mushaf-viewer'
import { NavigationPanel } from '@/components/layout/navigation-panel'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorBoundary } from '@/components/ui/error-boundary'

export const metadata: Metadata = {
  title: 'Quran Mushaf - Read the Holy Quran',
  description: 'Read the Holy Quran with authentic Mushaf layout, word-by-word analysis, translations, and tafseers',
  openGraph: {
    title: 'Quran Mushaf - Read the Holy Quran',
    description: 'Read the Holy Quran with authentic Mushaf layout, word-by-word analysis, translations, and tafseers',
  },
}

export default function HomePage() {
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
                <MushafViewer />
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
              <h3 className="font-medium text-ink-800 mb-3">Search</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search in Quran..."
                  className="w-full p-3 pl-10 border border-cream-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
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
    </div>
  )
}