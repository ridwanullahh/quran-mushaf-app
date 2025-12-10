// Navigation hook for managing Quran reading state
import { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { NavigationState } from '@/types'

const DEFAULT_NAVIGATION: NavigationState = {
  currentSurah: 1,
  currentAyah: 1,
  currentPage: 1,
  currentJuz: 1,
  currentHizb: 1
}

export function useNavigation() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [navigation, setNavigation] = useState<NavigationState>({
    currentSurah: parseInt(searchParams.get('surah') || '1'),
    currentAyah: parseInt(searchParams.get('ayah') || '1'),
    currentPage: parseInt(searchParams.get('page') || '1'),
    currentJuz: parseInt(searchParams.get('juz') || '1'),
    currentHizb: parseInt(searchParams.get('hizb') || '1')
  })

  // Update URL when navigation changes
  const updateURL = useCallback((newNavigation: Partial<NavigationState>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(newNavigation).forEach(([key, value]) => {
      if (value !== undefined) {
        params.set(key, value.toString())
      }
    })

    router.push(`?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  // Set current surah
  const setCurrentSurah = useCallback((surah: number) => {
    const newNavigation = { ...navigation, currentSurah: surah }
    setNavigation(newNavigation)
    updateURL({ currentSurah: surah })
  }, [navigation, updateURL])

  // Set current ayah
  const setCurrentAyah = useCallback((ayah: number) => {
    const newNavigation = { ...navigation, currentAyah: ayah }
    setNavigation(newNavigation)
    updateURL({ currentAyah: ayah })
  }, [navigation, updateURL])

  // Set current page
  const setCurrentPage = useCallback((page: number) => {
    const newNavigation = { ...navigation, currentPage: page }
    setNavigation(newNavigation)
    updateURL({ currentPage: page })
  }, [navigation, updateURL])

  // Set current juz
  const setCurrentJuz = useCallback((juz: number) => {
    const newNavigation = { ...navigation, currentJuz: juz }
    setNavigation(newNavigation)
    updateURL({ currentJuz: juz })
  }, [navigation, updateURL])

  // Set current hizb
  const setCurrentHizb = useCallback((hizb: number) => {
    const newNavigation = { ...navigation, currentHizb: hizb }
    setNavigation(newNavigation)
    updateURL({ currentHizb: hizb })
  }, [navigation, updateURL])

  // Navigate to specific location
  const navigateTo = useCallback((location: Partial<NavigationState>) => {
    const newNavigation = { ...navigation, ...location }
    setNavigation(newNavigation)
    updateURL(location)
  }, [navigation, updateURL])

  // Go to next ayah
  const goToNextAyah = useCallback(() => {
    if (navigation.currentAyah < 7) { // Assuming max 7 ayahs per surah (Fatihah)
      setCurrentAyah(navigation.currentAyah + 1)
    } else if (navigation.currentSurah < 114) {
      setCurrentSurah(navigation.currentSurah + 1)
      setCurrentAyah(1)
    }
  }, [navigation.currentAyah, navigation.currentSurah, setCurrentAyah, setCurrentSurah])

  // Go to previous ayah
  const goToPreviousAyah = useCallback(() => {
    if (navigation.currentAyah > 1) {
      setCurrentAyah(navigation.currentAyah - 1)
    } else if (navigation.currentSurah > 1) {
      setCurrentSurah(navigation.currentSurah - 1)
      // This would need to get the actual number of ayahs in the previous surah
      setCurrentAyah(7) // Placeholder
    }
  }, [navigation.currentAyah, navigation.currentSurah, setCurrentAyah, setCurrentSurah])

  // Go to next page
  const goToNextPage = useCallback(() => {
    if (navigation.currentPage < 604) {
      setCurrentPage(navigation.currentPage + 1)
    }
  }, [navigation.currentPage, setCurrentPage])

  // Go to previous page
  const goToPreviousPage = useCallback(() => {
    if (navigation.currentPage > 1) {
      setCurrentPage(navigation.currentPage - 1)
    }
  }, [navigation.currentPage, setCurrentPage])

  // Go to next juz
  const goToNextJuz = useCallback(() => {
    if (navigation.currentJuz < 30) {
      setCurrentJuz(navigation.currentJuz + 1)
    }
  }, [navigation.currentJuz, setCurrentJuz])

  // Go to previous juz
  const goToPreviousJuz = useCallback(() => {
    if (navigation.currentJuz > 1) {
      setCurrentJuz(navigation.currentJuz - 1)
    }
  }, [navigation.currentJuz, setCurrentJuz])

  // Jump to surah
  const jumpToSurah = useCallback((surahNumber: number) => {
    if (surahNumber >= 1 && surahNumber <= 114) {
      setCurrentSurah(surahNumber)
      setCurrentAyah(1)
    }
  }, [setCurrentSurah, setCurrentAyah])

  // Jump to page
  const jumpToPage = useCallback((pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= 604) {
      setCurrentPage(pageNumber)
    }
  }, [setCurrentPage])

  // Jump to juz
  const jumpToJuz = useCallback((juzNumber: number) => {
    if (juzNumber >= 1 && juzNumber <= 30) {
      setCurrentJuz(juzNumber)
    }
  }, [setCurrentJuz])

  // Search and navigate
  const searchAndNavigate = useCallback((query: string, results: any[]) => {
    if (results.length > 0) {
      const firstResult = results[0]
      if (firstResult.surahId) {
        setCurrentSurah(parseInt(firstResult.surahId))
      }
      if (firstResult.ayahNumber) {
        setCurrentAyah(firstResult.ayahNumber)
      }
    }
  }, [setCurrentSurah, setCurrentAyah])

  // Bookmark current position
  const bookmarkPosition = useCallback(() => {
    const bookmark = {
      ...navigation,
      timestamp: Date.now(),
      label: `Surah ${navigation.currentSurah}, Ayah ${navigation.currentAyah}`
    }
    
    const bookmarks = JSON.parse(localStorage.getItem('quran-bookmarks') || '[]')
    bookmarks.push(bookmark)
    localStorage.setItem('quran-bookmarks', JSON.stringify(bookmarks))
    
    return bookmark
  }, [navigation])

  // Load bookmark
  const loadBookmark = useCallback((index: number) => {
    const bookmarks = JSON.parse(localStorage.getItem('quran-bookmarks') || '[]')
    if (bookmarks[index]) {
      const bookmark = bookmarks[index]
      setNavigation({
        currentSurah: bookmark.currentSurah,
        currentAyah: bookmark.currentAyah,
        currentPage: bookmark.currentPage,
        currentJuz: bookmark.currentJuz,
        currentHizb: bookmark.currentHizb
      })
    }
  }, [setNavigation])

  // Get bookmarks
  const getBookmarks = useCallback(() => {
    return JSON.parse(localStorage.getItem('quran-bookmarks') || '[]')
  }, [])

  // Clear bookmarks
  const clearBookmarks = useCallback(() => {
    localStorage.removeItem('quran-bookmarks')
  }, [])

  // Listen for URL changes
  useEffect(() => {
    const handlePopState = () => {
      setNavigation({
        currentSurah: parseInt(searchParams.get('surah') || '1'),
        currentAyah: parseInt(searchParams.get('ayah') || '1'),
        currentPage: parseInt(searchParams.get('page') || '1'),
        currentJuz: parseInt(searchParams.get('juz') || '1'),
        currentHizb: parseInt(searchParams.get('hizb') || '1')
      })
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [searchParams])

  return {
    // Current state
    currentSurah: navigation.currentSurah,
    currentAyah: navigation.currentAyah,
    currentPage: navigation.currentPage,
    currentJuz: navigation.currentJuz,
    currentHizb: navigation.currentHizb,
    navigation,

    // Navigation methods
    setCurrentSurah,
    setCurrentAyah,
    setCurrentPage,
    setCurrentJuz,
    setCurrentHizb,
    navigateTo,

    // Movement methods
    goToNextAyah,
    goToPreviousAyah,
    goToNextPage,
    goToPreviousPage,
    goToNextJuz,
    goToPreviousJuz,

    // Jump methods
    jumpToSurah,
    jumpToPage,
    jumpToJuz,

    // Search and bookmark
    searchAndNavigate,
    bookmarkPosition,
    loadBookmark,
    getBookmarks,
    clearBookmarks
  }
}