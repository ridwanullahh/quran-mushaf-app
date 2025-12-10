'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { User } from '@/types'
import { useQuranData } from '@/hooks/use-quran-data'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, profile?: any) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User['profile']>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { getCurrentUser } = useQuranData()

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = localStorage.getItem('auth-token')
        if (token) {
          const currentUser = await getCurrentUser(token)
          if (currentUser) {
            setUser(currentUser)
          } else {
            localStorage.removeItem('auth-token')
          }
        }
      } catch (error) {
        console.error('Failed to check session:', error)
        localStorage.removeItem('auth-token')
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [getCurrentUser])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // This would be implemented with the actual database login
      // const result = await db.login(email, password)
      // For now, simulate login
      console.log('Login attempt:', email)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        uid: 'user-1',
        email,
        verified: true,
        roles: ['user'],
        permissions: ['read'],
        profile: {
          language: 'en',
          preferences: {
            theme: 'auto',
            fontSize: 'medium',
            tajweedEnabled: true,
            translationLanguage: 'en',
            audioEnabled: true,
            autoPlay: false,
            pageLayout: 'mushaf',
            readingMode: 'page'
          }
        },
        createdAt: new Date().toISOString()
      }

      setUser(mockUser)
      localStorage.setItem('auth-token', 'mock-token')
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, profile?: any) => {
    setIsLoading(true)
    try {
      // This would be implemented with the actual database register
      console.log('Registration attempt:', email, profile)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data
      const mockUser: User = {
        id: '2',
        uid: 'user-2',
        email,
        verified: false,
        roles: ['user'],
        permissions: ['read'],
        profile: {
          language: 'en',
          preferences: {
            theme: 'auto',
            fontSize: 'medium',
            tajweedEnabled: true,
            translationLanguage: 'en',
            audioEnabled: true,
            autoPlay: false,
            pageLayout: 'mushaf',
            readingMode: 'page'
          },
          ...profile
        },
        createdAt: new Date().toISOString()
      }

      setUser(mockUser)
      localStorage.setItem('auth-token', 'mock-token')
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth-token')
  }

  const updateProfile = async (updates: Partial<User['profile']>) => {
    if (!user) return

    const updatedUser = {
      ...user,
      profile: {
        ...user.profile,
        ...updates
      }
    }

    setUser(updatedUser)
    
    // This would update the user in the database
    console.log('Profile update:', updates)
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}