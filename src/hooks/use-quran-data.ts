// Custom hook for Quran data fetching
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useState, useEffect } from 'react'
import { useQuranDataContext } from '@/contexts/quran-data-context'
import { Ayah, Surah, WordAnalysis } from '@/types'
import { toast } from 'react-hot-toast'

interface UseQuranDataOptions {
  type: 'surah' | 'page' | 'search' | 'word'
  surahId?: string
  pageNumber?: number
  query?: string
  language?: string
  enabled?: boolean
}

export function useQuranData(options?: UseQuranDataOptions) {
  const {
    getSurahs,
    getAyahsByPage,
    getAyahsBySurah,
    getWordById,
    isInitialized,
    isLoading,
    error,
    hasSampleData
  } = useQuranDataContext()

  const queryClient = useQueryClient()

  // Surahs query
  const surahsQuery = useQuery(
    'surahs',
    getSurahs,
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
    }
  )

  // Specific queries based on type
  const ayahsBySurahQuery = useQuery(
    ['ayahs', 'surah', options?.surahId],
    () => getAyahsBySurah(options!.surahId!),
    {
      enabled: options?.type === 'surah' && !!options.surahId,
      staleTime: 1000 * 60 * 5,
    }
  )

  const ayahsByPageQuery = useQuery(
    ['ayahs', 'page', options?.pageNumber],
    () => getAyahsByPage(options!.pageNumber!),
    {
      enabled: options?.type === 'page' && !!options.pageNumber,
      staleTime: 1000 * 60 * 2, // 2 minutes for page data
    }
  )

  const searchQuery = useQuery(
    ['search', options?.query, options?.language],
    () => {
      // For now, implement basic search through available data
      return [] // TODO: Implement search functionality
    },
    {
      enabled: options?.type === 'search' && !!options.query && options.query.length >= 2,
      staleTime: 1000 * 60 * 1, // 1 minute
    }
  )

  const wordAnalysisQuery = useQuery(
    ['wordAnalysis', options?.surahId],
    () => {
      // For now, return empty array
      return [] // TODO: Implement word analysis query
    },
    {
      enabled: options?.type === 'word' && !!options.surahId,
      staleTime: 1000 * 60 * 10, // 10 minutes
    }
  )



  return {
    // Queries
    data: surahsQuery.data,
    surahs: surahsQuery.data,
    surahsLoading: surahsQuery.isLoading,
    surahsError: surahsQuery.error,

    ayahs: options?.type === 'surah' ? ayahsBySurahQuery.data : 
           options?.type === 'page' ? ayahsByPageQuery.data :
           options?.type === 'search' ? searchQuery.data : undefined,
    
    loading: options?.type === 'surah' ? ayahsBySurahQuery.isLoading :
             options?.type === 'page' ? ayahsByPageQuery.isLoading :
             options?.type === 'search' ? searchQuery.isLoading :
             surahsQuery.isLoading,
    
    error: options?.type === 'surah' ? ayahsBySurahQuery.error :
           options?.type === 'page' ? ayahsByPageQuery.error :
           options?.type === 'search' ? searchQuery.error :
           surahsQuery.error,

    // Context state
    isInitialized,
    isLoading,
    error,
    hasSampleData,

    // Utility functions from context
    getAyahsByPage,
    getAyahsBySurah,
    getWordById,

    // Query invalidation
    refetch: queryClient.invalidateQueries,
    refetchAll: () => queryClient.invalidateQueries()
  }
}