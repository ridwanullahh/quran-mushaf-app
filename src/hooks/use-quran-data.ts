// Custom hook for Quran data fetching
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useState, useEffect } from 'react'
import QuranDatabase from '@/lib/database'
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
  const [db] = useState(() => new QuranDatabase({
    owner: process.env.NEXT_PUBLIC_GITHUB_OWNER!,
    repo: process.env.NEXT_PUBLIC_GITHUB_REPO!,
    token: process.env.NEXT_PUBLIC_GITHUB_TOKEN!,
    branch: process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main'
  }))

  const queryClient = useQueryClient()

  // Initialize database
  useEffect(() => {
    db.init().catch(error => {
      console.error('Failed to initialize database:', error)
      toast.error('Failed to connect to database')
    })
  }, [db])

  // Surahs query
  const surahsQuery = useQuery(
    'surahs',
    () => db.getSurahs(),
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
    }
  )

  // Specific queries based on type
  const ayahsBySurahQuery = useQuery(
    ['ayahs', 'surah', options?.surahId],
    () => db.getAyahsBySurah(options!.surahId!),
    {
      enabled: options?.type === 'surah' && !!options.surahId,
      staleTime: 1000 * 60 * 5,
    }
  )

  const ayahsByPageQuery = useQuery(
    ['ayahs', 'page', options?.pageNumber],
    () => db.getAyahsByPage(options!.pageNumber!),
    {
      enabled: options?.type === 'page' && !!options.pageNumber,
      staleTime: 1000 * 60 * 2, // 2 minutes for page data
    }
  )

  const searchQuery = useQuery(
    ['search', options?.query, options?.language],
    () => db.searchAyahs(options!.query!, { 
      translationLanguage: options?.language 
    }),
    {
      enabled: options?.type === 'search' && !!options.query && options.query.length >= 2,
      staleTime: 1000 * 60 * 1, // 1 minute
    }
  )

  const wordAnalysisQuery = useQuery(
    ['wordAnalysis', options?.surahId],
    () => db.getWordAnalysisByAyah(options!.surahId!),
    {
      enabled: options?.type === 'word' && !!options.surahId,
      staleTime: 1000 * 60 * 10, // 10 minutes
    }
  )

  // Mutations for data manipulation
  const addTranslationMutation = useMutation(
    (translation: Parameters<typeof db.addTranslation>[0]) => db.addTranslation(translation),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ayahs'])
        toast.success('Translation added successfully')
      },
      onError: (error: any) => {
        toast.error(`Failed to add translation: ${error.message}`)
      }
    }
  )

  const updateTranslationMutation = useMutation(
    ({ id, updates }: { id: string; updates: any }) => db.updateTranslation(id, updates),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ayahs'])
        toast.success('Translation updated successfully')
      },
      onError: (error: any) => {
        toast.error(`Failed to update translation: ${error.message}`)
      }
    }
  )

  const addTafseerMutation = useMutation(
    (tafseer: Parameters<typeof db.addTafseer>[0]) => db.addTafseer(tafseer),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ayahs'])
        toast.success('Tafseer added successfully')
      },
      onError: (error: any) => {
        toast.error(`Failed to add tafseer: ${error.message}`)
      }
    }
  )

  const updateTafseerMutation = useMutation(
    ({ id, updates }: { id: string; updates: any }) => db.updateTafseer(id, updates),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ayahs'])
        toast.success('Tafseer updated successfully')
      },
      onError: (error: any) => {
        toast.error(`Failed to update tafseer: ${error.message}`)
      }
    }
  )

  // Export functionality
  const exportCollectionMutation = useMutation(
    ({ collection, format }: { collection: string; format?: string }) => 
      db.exportCollection(collection, { format }),
    {
      onSuccess: (data, variables) => {
        // Create and download file
        const blob = new Blob([data], { 
          type: variables.format === 'csv' ? 'text/csv' : 'application/json' 
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${variables.collection}_export.${variables.format || 'json'}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success('Export completed successfully')
      },
      onError: (error: any) => {
        toast.error(`Export failed: ${error.message}`)
      }
    }
  )

  // Health check
  const healthCheckQuery = useQuery(
    'healthCheck',
    () => db.healthCheck(),
    {
      refetchInterval: 30000, // 30 seconds
      onError: (error) => {
        console.error('Database health check failed:', error)
      }
    }
  )

  return {
    // Queries
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

    // Mutations
    addTranslation: addTranslationMutation.mutate,
    updateTranslation: updateTranslationMutation.mutate,
    addTafseer: addTafseerMutation.mutate,
    updateTafseer: updateTafseerMutation.mutate,
    exportCollection: exportCollectionMutation.mutate,

    // Utility functions
    getAyahsBySurah: db.getAyahsBySurah.bind(db),
    getAyahsByPage: db.getAyahsByPage.bind(db),
    getAyahsByJuz: db.getAyahsByJuz.bind(db),
    getWordAnalysisByAyah: db.getWordAnalysisByAyah.bind(db),
    getTranslationsByAyah: db.getTranslationsByAyah.bind(db),
    getTafseerByAyah: db.getTafseerByAyah.bind(db),
    searchAyahs: db.searchAyahs.bind(db),

    // Health status
    health: healthCheckQuery.data,
    healthLoading: healthCheckQuery.isLoading,

    // Query invalidation
    refetch: queryClient.invalidateQueries,
    refetchAll: () => queryClient.invalidateQueries()
  }
}