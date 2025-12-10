'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Surah, Ayah, WordAnalysis } from '@/types'
import { toast } from 'react-hot-toast'

interface QuranDataContextType {
  // State
  isInitialized: boolean
  isLoading: boolean
  error: string | null
  surahs: Surah[]
  currentPageAyahs: Ayah[]
  
  // Data methods
  getSurahs: () => Promise<Surah[]>
  getAyahsByPage: (pageNumber: number) => Promise<Ayah[]>
  getAyahsBySurah: (surahId: string) => Promise<Ayah[]>
  getWordById: (wordId: string) => Promise<WordAnalysis | null>
  
  // Fallback methods
  hasSampleData: boolean
  initializeWithSampleData: () => void
}

const QuranDataContext = createContext<QuranDataContextType | undefined>(undefined)

// Sample fallback data
const SAMPLE_SURAHS: Surah[] = [
  {
    id: '1',
    name: 'Al-Fatihah',
    arabicName: 'الفاتحة',
    revelationType: 'meccan',
    numberOfAyahs: 7,
    juz: 1,
    hizb: 1,
    order: 1,
    surahNumber: 1,
    pageNumber: 1,
    rukuNumber: 1,
    sajdaNumber: 0,
    bismillahPre: false,
    bismillahPost: false
  },
  {
    id: '2',
    name: 'Al-Baqarah',
    arabicName: 'البقرة',
    revelationType: 'medinan',
    numberOfAyahs: 286,
    juz: 1,
    hizb: 1,
    order: 2,
    surahNumber: 2,
    pageNumber: 2,
    rukuNumber: 40,
    sajdaNumber: 0,
    bismillahPre: true,
    bismillahPost: false
  }
]

const SAMPLE_AYAHS: Ayah[] = [
  {
    id: '1-1',
    surahId: '1',
    ayahNumber: 1,
    pageNumber: 1,
    juzNumber: 1,
    hizbNumber: 1,
    rukuNumber: 1,
    arabicText: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    textWithTajweed: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    isSajda: false,
    isSajdaRecommended: false,
    words: [
      {
        id: '1-1-1',
        surahId: '1',
        ayahNumber: 1,
        wordNumber: 1,
        arabicWord: 'بِسْمِ',
        transliteration: 'Bismi',
        tajweedClass: 'normal',
        morphology: {
          root: 'س م و',
          lemma: 'اسم',
          partOfSpeech: 'noun',
          tense: '',
          gender: 'masculine',
          number: 'singular',
          person: '',
          confidence: 0.9
        },
        meaning: {
          en: 'In the name',
          ar: 'بِسْمِ',
          ur: 'نام میں',
          id: 'Dengan nama',
          tr: 'İsim',
          fr: 'Au nom',
          es: 'En el nombre'
        },
        tafseerNotes: {},
        relatedWords: [],
        position: { x: 0, y: 0 },
        audioUrl: ''
      },
      {
        id: '1-1-2',
        surahId: '1',
        ayahNumber: 1,
        wordNumber: 2,
        arabicWord: 'ٱللَّهِ',
        transliteration: 'Allahi',
        tajweedClass: 'normal',
        morphology: {
          root: 'ل ه و',
          lemma: 'الله',
          partOfSpeech: 'noun',
          tense: '',
          gender: 'masculine',
          number: 'singular',
          person: '',
          confidence: 1.0
        },
        meaning: {
          en: 'of Allah',
          ar: 'اللَّهِ',
          ur: 'اللہ کے',
          id: 'Allah',
          tr: "Allah'ın",
          fr: "d'Allah",
          es: 'de Allah'
        },
        tafseerNotes: {},
        relatedWords: [],
        position: { x: 0, y: 0 },
        audioUrl: ''
      },
      {
        id: '1-1-3',
        surahId: '1',
        ayahNumber: 1,
        wordNumber: 3,
        arabicWord: 'ٱلرَّحْمَٰنِ',
        transliteration: 'Ar-Rahmani',
        tajweedClass: 'normal',
        morphology: {
          root: 'ر ح م',
          lemma: 'رحمن',
          partOfSpeech: 'adjective',
          tense: '',
          gender: 'masculine',
          number: 'singular',
          person: '',
          confidence: 0.95
        },
        meaning: {
          en: 'the Most Gracious',
          ar: 'الرَّحْمَٰنِ',
          ur: 'بڑا مہربان',
          id: 'Yang Maha Pengasih',
          tr: 'Rahman olan',
          fr: 'le Très Miséricordieux',
          es: 'el Más Compasivo'
        },
        tafseerNotes: {},
        relatedWords: [],
        position: { x: 0, y: 0 },
        audioUrl: ''
      },
      {
        id: '1-1-4',
        surahId: '1',
        ayahNumber: 1,
        wordNumber: 4,
        arabicWord: 'ٱلرَّحِيمِ',
        transliteration: 'Ar-Raheemi',
        tajweedClass: 'normal',
        morphology: {
          root: 'ر ح م',
          lemma: 'رحيم',
          partOfSpeech: 'adjective',
          tense: '',
          gender: 'masculine',
          number: 'singular',
          person: '',
          confidence: 0.95
        },
        meaning: {
          en: 'the Most Merciful',
          ar: 'الرَّحِيمِ',
          ur: 'بڑا رحم کرنے والا',
          id: 'Yang Maha Penyayang',
          tr: 'Rehim olan',
          fr: 'le Très Compatissant',
          es: 'el Más Misericordioso'
        },
        tafseerNotes: {},
        relatedWords: [],
        position: { x: 0, y: 0 },
        audioUrl: ''
      }
    ],
    tafseer: {
      en: 'This verse serves as the foundation of the Quran, seeking Allah\'s protection and blessings.',
      ar: 'هذه الآية أساس القرآن، تطلب حماية الله وبركاته.',
      ur: 'یہ آیت قرآن کی بنیاد ہے، اللہ کی حفاظت اور برکات کی درخواست کرتی ہے۔',
      id: 'Ayat ini adalah fondasi Al-Quran, memohon perlindungan dan keberkahan Allah.'
    }
  },
  {
    id: '1-2',
    surahId: '1',
    ayahNumber: 2,
    pageNumber: 1,
    juzNumber: 1,
    hizbNumber: 1,
    rukuNumber: 1,
    arabicText: 'ٱلْحَمْدُ لِلهِ رَبِّ ٱلْعَٰلَمِينَ',
    textWithTajweed: 'ٱلْحَمْدُ لِلهِ رَبِّ ٱلْعَٰلَمِينَ',
    isSajda: false,
    isSajdaRecommended: false,
    words: [
      {
        id: '1-2-1',
        surahId: '1',
        ayahNumber: 2,
        wordNumber: 1,
        arabicWord: 'ٱلْحَمْدُ',
        transliteration: 'Alhamdu',
        tajweedClass: 'normal',
        morphology: {
          root: 'ح م د',
          lemma: 'حمد',
          partOfSpeech: 'noun',
          tense: '',
          gender: 'masculine',
          number: 'singular',
          person: '',
          confidence: 1.0
        },
        meaning: {
          en: 'All praise',
          ar: 'الْحَمْدُ',
          ur: 'تمام تعریف',
          id: 'Segala puji',
          tr: 'Tüm övgü',
          fr: 'Toute louange',
          es: 'Toda alabanza'
        },
        tafseerNotes: {},
        relatedWords: [],
        position: { x: 0, y: 0 },
        audioUrl: ''
      },
      {
        id: '1-2-2',
        surahId: '1',
        ayahNumber: 2,
        wordNumber: 2,
        arabicWord: 'لِلهِ',
        transliteration: 'lillahi',
        tajweedClass: 'normal',
        morphology: {
          root: 'ل ه و',
          lemma: 'الله',
          partOfSpeech: 'preposition',
          tense: '',
          gender: 'masculine',
          number: 'singular',
          person: '',
          confidence: 1.0
        },
        meaning: {
          en: 'belongs to Allah',
          ar: 'لِلهِ',
          ur: 'اللہ کے لیے',
          id: 'bagi Allah',
          tr: "Allah'ın",
          fr: 'à Allah',
          es: 'a Allah'
        },
        tafseerNotes: {},
        relatedWords: [],
        position: { x: 0, y: 0 },
        audioUrl: ''
      },
      {
        id: '1-2-3',
        surahId: '1',
        ayahNumber: 2,
        wordNumber: 3,
        arabicWord: 'رَبِّ',
        transliteration: 'Rabb',
        tajweedClass: 'normal',
        morphology: {
          root: 'ر ب ب',
          lemma: 'رب',
          partOfSpeech: 'noun',
          tense: '',
          gender: 'masculine',
          number: 'singular',
          person: '',
          confidence: 1.0
        },
        meaning: {
          en: 'Lord of',
          ar: 'رَبِّ',
          ur: 'رب (پالنے والا) کا',
          id: 'Tuhan',
          tr: 'Rabb olanın',
          fr: 'Seigneur de',
          es: 'Señor de'
        },
        tafseerNotes: {},
        relatedWords: [],
        position: { x: 0, y: 0 },
        audioUrl: ''
      },
      {
        id: '1-2-4',
        surahId: '1',
        ayahNumber: 2,
        wordNumber: 4,
        arabicWord: 'ٱلْعَٰلَمِينَ',
        transliteration: 'al-alameen',
        tajweedClass: 'normal',
        morphology: {
          root: 'ع ل م',
          lemma: 'عالمين',
          partOfSpeech: 'noun',
          tense: '',
          gender: 'masculine',
          number: 'plural',
          person: '',
          confidence: 1.0
        },
        meaning: {
          en: 'all the worlds',
          ar: 'ٱلْعَٰلَمِينَ',
          ur: 'تمام جہانوں (تمام مخلوقات) کا',
          id: 'semesta alam',
          tr: 'âlemlerin',
          fr: 'de tous les mondes',
          es: 'de todos los mundos'
        },
        tafseerNotes: {},
        relatedWords: [],
        position: { x: 0, y: 0 },
        audioUrl: ''
      }
    ],
    tafseer: {
      en: 'This verse establishes that all praise and gratitude belongs solely to Allah, the Creator and Sustainer of all existence.',
      ar: 'هذه الآية تؤكد أن كل الحمد والثناء ينتمي لله وحده، خالق ومُعطي كل الوجود.',
      ur: 'یہ آیت ثابت کرتی ہے کہ تمام تعریف اور شکریہ صرف اللہ کے لیے ہے، تمام مخلوقات کا پالنے والا۔',
      id: 'Ayat ini menetapkan bahwa segala puji dan syukur hanya milik Allah, Pencipta dan Pemberi rezeki segala alam.'
    }
  }
]

interface QuranDataProviderProps {
  children: ReactNode
}

export function QuranDataProvider({ children }: QuranDataProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [currentPageAyahs, setCurrentPageAyahs] = useState<Ayah[]>([])
  const [hasSampleData, setHasSampleData] = useState(false)

  // Initialize with sample data as fallback
  const initializeWithSampleData = () => {
    console.log('🔄 Initializing with sample data...')
    setSurahs(SAMPLE_SURAHS)
    setCurrentPageAyahs(SAMPLE_AYAHS)
    setHasSampleData(true)
    setIsInitialized(true)
    setIsLoading(false)
    setError(null)
    
    toast.success('Initialized with sample data - Database not available', {
      duration: 4000,
      icon: '📖'
    })
  }

  // Try to initialize real database
  const initializeDatabase = async () => {
    try {
      console.log('🚀 Attempting database initialization...')
      
      // Import database dynamically to avoid build errors if missing
      const { default: QuranDatabase } = await import('@/lib/database')
      
      // Try to create database instance (this might fail)
      const dbConfig = {
        owner: process.env.NEXT_PUBLIC_GITHUB_OWNER || 'demo-owner',
        repo: process.env.NEXT_PUBLIC_GITHUB_REPO || 'demo-repo',
        token: process.env.NEXT_PUBLIC_GITHUB_TOKEN || 'demo-token',
        branch: process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main'
      }
      
      const db = new QuranDatabase(dbConfig)
      
      // Try to initialize
      await db.init()
      
      // Try to get data
      const fetchedSurahs = await db.getSurahs()
      if (fetchedSurahs && fetchedSurahs.length > 0) {
        console.log('✅ Database initialized successfully')
        setSurahs(fetchedSurahs)
        setIsInitialized(true)
        setIsLoading(false)
        setError(null)
        setHasSampleData(false)
        return
      }
      
      throw new Error('Database returned empty data')
      
    } catch (err) {
      console.warn('⚠️ Database initialization failed:', err)
      setError(err instanceof Error ? err.message : 'Database connection failed')
      
      // Fall back to sample data
      initializeWithSampleData()
    }
  }

  useEffect(() => {
    initializeDatabase()
  }, [])

  // Data methods
  const getSurahs = async (): Promise<Surah[]> => {
    return surahs
  }

  const getAyahsByPage = async (pageNumber: number): Promise<Ayah[]> => {
    if (hasSampleData) {
      // For sample data, just return the sample ayahs for page 1
      return pageNumber === 1 ? SAMPLE_AYAHS : []
    }
    
    try {
      const { default: QuranDatabase } = await import('@/lib/database')
      const db = new QuranDatabase({
        owner: process.env.NEXT_PUBLIC_GITHUB_OWNER || 'demo-owner',
        repo: process.env.NEXT_PUBLIC_GITHUB_REPO || 'demo-repo',
        token: process.env.NEXT_PUBLIC_GITHUB_TOKEN || 'demo-token',
        branch: process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main'
      })
      
      return await db.getAyahsByPage(pageNumber)
    } catch (err) {
      console.warn('Failed to fetch ayahs by page:', err)
      return []
    }
  }

  const getAyahsBySurah = async (surahId: string): Promise<Ayah[]> => {
    if (hasSampleData) {
      return SAMPLE_AYAHS.filter(ayah => ayah.surahId === surahId)
    }
    
    try {
      const { default: QuranDatabase } = await import('@/lib/database')
      const db = new QuranDatabase({
        owner: process.env.NEXT_PUBLIC_GITHUB_OWNER || 'demo-owner',
        repo: process.env.NEXT_PUBLIC_GITHUB_REPO || 'demo-repo',
        token: process.env.NEXT_PUBLIC_GITHUB_TOKEN || 'demo-token',
        branch: process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main'
      })
      
      return await db.getAyahsBySurah(surahId)
    } catch (err) {
      console.warn('Failed to fetch ayahs by surah:', err)
      return []
    }
  }

  const getWordById = async (wordId: string): Promise<WordAnalysis | null> => {
    if (hasSampleData) {
      const allWords = SAMPLE_AYAHS.flatMap(ayah => ayah.words)
      return allWords.find(word => word.id === wordId) || null
    }
    
    try {
      const { default: QuranDatabase } = await import('@/lib/database')
      const db = new QuranDatabase({
        owner: process.env.NEXT_PUBLIC_GITHUB_OWNER || 'demo-owner',
        repo: process.env.NEXT_PUBLIC_GITHUB_REPO || 'demo-repo',
        token: process.env.NEXT_PUBLIC_GITHUB_TOKEN || 'demo-token',
        branch: process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main'
      })
      
      return await db.getWordAnalysis(wordId)
    } catch (err) {
      console.warn('Failed to fetch word by ID:', err)
      return null
    }
  }

  const value: QuranDataContextType = {
    isInitialized,
    isLoading,
    error,
    surahs,
    currentPageAyahs,
    getSurahs,
    getAyahsByPage,
    getAyahsBySurah,
    getWordById,
    hasSampleData,
    initializeWithSampleData
  }

  return (
    <QuranDataContext.Provider value={value}>
      {children}
    </QuranDataContext.Provider>
  )
}

export function useQuranDataContext() {
  const context = useContext(QuranDataContext)
  if (context === undefined) {
    throw new Error('useQuranDataContext must be used within a QuranDataProvider')
  }
  return context
}