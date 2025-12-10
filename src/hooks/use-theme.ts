// Theme hook for managing light/dark mode
import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark' | 'auto'

interface ThemeState {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  isDark: boolean
}

export function useTheme() {
  const [themeState, setThemeState] = useState<ThemeState>({
    theme: 'auto',
    resolvedTheme: 'light',
    isDark: false
  })

  // Get initial theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('quran-theme') as Theme | null
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    
    const initialTheme: Theme = savedTheme || 'auto'
    const resolvedTheme = initialTheme === 'auto' ? systemTheme : initialTheme
    
    setThemeState({
      theme: initialTheme,
      resolvedTheme,
      isDark: resolvedTheme === 'dark'
    })

    // Apply theme to document
    applyTheme(resolvedTheme)
  }, [])

  // Listen for system theme changes
  useEffect(() => {
    if (themeState.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      
      const handleChange = (e: MediaQueryListEvent) => {
        const newResolvedTheme = e.matches ? 'dark' : 'light'
        setThemeState(prev => ({
          ...prev,
          resolvedTheme: newResolvedTheme,
          isDark: newResolvedTheme === 'dark'
        }))
        applyTheme(newResolvedTheme)
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [themeState.theme])

  const applyTheme = (resolvedTheme: 'light' | 'dark') => {
    const root = document.documentElement
    
    if (resolvedTheme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.remove('dark')
      root.classList.add('light')
    }
  }

  const setTheme = (newTheme: Theme) => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const resolvedTheme = newTheme === 'auto' ? systemTheme : newTheme
    
    setThemeState({
      theme: newTheme,
      resolvedTheme,
      isDark: resolvedTheme === 'dark'
    })

    localStorage.setItem('quran-theme', newTheme)
    applyTheme(resolvedTheme)
  }

  const toggleTheme = () => {
    const newTheme = themeState.isDark ? 'light' : 'dark'
    setTheme(newTheme)
  }

  const getTheme = () => themeState.theme
  const isDark = () => themeState.isDark

  // Listen for manual theme changes in other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'quran-theme' && e.newValue) {
        const newTheme = e.newValue as Theme
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        const resolvedTheme = newTheme === 'auto' ? systemTheme : newTheme
        
        setThemeState({
          theme: newTheme,
          resolvedTheme,
          isDark: resolvedTheme === 'dark'
        })
        applyTheme(resolvedTheme)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return {
    theme: themeState.theme,
    resolvedTheme: themeState.resolvedTheme,
    isDark: themeState.isDark,
    setTheme,
    toggleTheme,
    getTheme,
    isDarkMode: isDark
  }
}