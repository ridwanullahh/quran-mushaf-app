'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useTheme } from '@/hooks/use-theme'

interface ThemeContextType {
  theme: 'light' | 'dark' | 'auto'
  resolvedTheme: 'light' | 'dark'
  isDark: boolean
  setTheme: (theme: 'light' | 'dark' | 'auto') => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({
  children,
  attribute = 'class',
  defaultTheme = 'auto',
  enableSystem = true,
  disableTransitionOnChange = false,
}: {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}) {
  const [mounted, setMounted] = useState(false)
  const themeHook = useTheme()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    const resolvedTheme = themeHook.resolvedTheme

    root.classList.remove('light', 'dark')
    root.classList.add(resolvedTheme)

    if (disableTransitionOnChange) {
      const css = document.createElement('style')
      css.innerHTML = `* { transition: none !important; }`
      document.head.appendChild(css)
      
      setTimeout(() => {
        document.head.removeChild(css)
      }, 1)
    }
  }, [mounted, themeHook.resolvedTheme, disableTransitionOnChange])

  if (!mounted) {
    return <>{children}</>
  }

  const value: ThemeContextType = {
    theme: themeHook.theme,
    resolvedTheme: themeHook.resolvedTheme,
    isDark: themeHook.isDark,
    setTheme: themeHook.setTheme,
    toggleTheme: themeHook.toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeContext() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return context
}