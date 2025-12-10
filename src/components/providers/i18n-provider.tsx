'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { appConfig } from '@/lib/config'

type Language = 'en' | 'ar' | 'ur' | 'id' | 'tr' | 'fr' | 'es'

interface I18nContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
  isRTL: boolean
  formatNumber: (num: number) => string
  formatDate: (date: Date) => string
  isSupportedLanguage: (lang: string) => boolean
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

// Simple translation dictionary - in a real app, this would be loaded from files
const translations: Record<Language, Record<string, string>> = {
  en: {
    'app.name': 'Quran Mushaf',
    'app.description': 'Digital Quran with Physical Book Feel',
    'nav.home': 'Home',
    'nav.surahs': 'Surahs',
    'nav.search': 'Search',
    'nav.bookmarks': 'Bookmarks',
    'nav.settings': 'Settings',
    'nav.admin': 'Admin',
    'reading.mushaf': 'Mushaf',
    'reading.list': 'List',
    'reading.translation': 'Translation',
    'reading.tajweed': 'Tajweed',
    'reading.audio': 'Audio',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.retry': 'Retry',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.search': 'Search',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.page': 'Page',
    'common.surah': 'Surah',
    'common.ayah': 'Ayah',
    'common.juz': 'Juz',
    'surah.al_fatihah': 'The Opening',
    'surah.al_baqarah': 'The Cow',
    'surah.al_imran': 'The Family of Imran',
    'word.analysis': 'Word Analysis',
    'word.morphology': 'Morphology',
    'word.meaning': 'Meaning',
    'word.tafseer': 'Tafseer'
  },
  ar: {
    'app.name': 'مصحف القرآن',
    'app.description': 'القرآن الرقمي بشعور الكتاب المادي',
    'nav.home': 'الرئيسية',
    'nav.surahs': 'السور',
    'nav.search': 'البحث',
    'nav.bookmarks': 'المفضلة',
    'nav.settings': 'الإعدادات',
    'nav.admin': 'الإدارة',
    'reading.mushaf': 'المصحف',
    'reading.list': 'القائمة',
    'reading.translation': 'الترجمة',
    'reading.tajweed': 'التجويد',
    'reading.audio': 'الصوت',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.retry': 'إعادة المحاولة',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.search': 'بحث',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.page': 'صفحة',
    'common.surah': 'سورة',
    'common.ayah': 'آية',
    'common.juz': 'جزء',
    'surah.al_fatihah': 'الفاتحة',
    'surah.al_baqadah': 'البقرة',
    'surah.al_imran': 'آل عمران',
    'word.analysis': 'تحليل الكلمة',
    'word.morphology': 'الصرف',
    'word.meaning': 'المعنى',
    'word.tafseer': 'التفسير'
  },
  ur: {
    'app.name': 'قرآن مجید',
    'app.description': 'مادی کتاب کے احساس کے ساتھ ڈیجیٹل قرآن',
    'nav.home': 'ہوم',
    'nav.surahs': 'سور',
    'nav.search': 'تلاش',
    'nav.bookmarks': 'بک مارکس',
    'nav.settings': 'سیٹنگز',
    'nav.admin': 'ایڈمن',
    'reading.mushaf': 'مصحف',
    'reading.list': 'فہرست',
    'reading.translation': 'ترجمہ',
    'reading.tajweed': 'تجوید',
    'reading.audio': 'آڈیو',
    'common.loading': 'لوڈ ہو رہا ہے...',
    'common.error': 'خرابی',
    'common.retry': 'دوبارہ کوشش',
    'common.cancel': 'منسوخ',
    'common.save': 'محفوظ کریں',
    'common.edit': 'ترمیم',
    'common.delete': 'حذف',
    'common.search': 'تلاش',
    'common.next': 'اگلا',
    'common.previous': 'پچھلا',
    'common.page': 'صفحہ',
    'common.surah': 'سورہ',
    'common.ayah': 'آیت',
    'common.juz': 'جزو',
    'surah.al_fatihah': 'الفاتحہ',
    'surah.al_baqadah': 'بقرہ',
    'surah.al_imran': 'آل عمران',
    'word.analysis': 'لفظ کا تجزیہ',
    'word.morphology': 'صرف',
    'word.meaning': 'معنی',
    'word.tafseer': 'تفسیر'
  },
  id: {
    'app.name': 'Al-Qur\'an Mushaf',
    'app.description': 'Al-Qur\'an Digital dengan Rasa Buku Fisik',
    'nav.home': 'Beranda',
    'nav.surahs': 'Surah',
    'nav.search': 'Cari',
    'nav.bookmarks': 'Markah',
    'nav.settings': 'Pengaturan',
    'nav.admin': 'Admin',
    'reading.mushaf': 'Mushaf',
    'reading.list': 'Daftar',
    'reading.translation': 'Terjemahan',
    'reading.tajweed': 'Tajwid',
    'reading.audio': 'Audio',
    'common.loading': 'Memuat...',
    'common.error': 'Error',
    'common.retry': 'Coba Lagi',
    'common.cancel': 'Batal',
    'common.save': 'Simpan',
    'common.edit': 'Edit',
    'common.delete': 'Hapus',
    'common.search': 'Cari',
    'common.next': 'Berikut',
    'common.previous': 'Sebelumnya',
    'common.page': 'Halaman',
    'common.surah': 'Surah',
    'common.ayah': 'Ayat',
    'common.juz': 'Juz',
    'surah.al_fatihah': 'Al-Fatihah',
    'surah.al_baqadah': 'Al-Baqarah',
    'surah.al_imran': 'Al-Imran',
    'word.analysis': 'Analisis Kata',
    'word.morphology': 'Morfologi',
    'word.meaning': 'Makna',
    'word.tafseer': 'Tafsir'
  },
  tr: {
    'app.name': 'Kuran Mushaf',
    'app.description': 'Fiziksel Kitap Hissiyatı ile Dijital Kuran',
    'nav.home': 'Ana Sayfa',
    'nav.surahs': 'Sureler',
    'nav.search': 'Ara',
    'nav.bookmarks': 'Yer İmleri',
    'nav.settings': 'Ayarlar',
    'nav.admin': 'Yönetici',
    'reading.mushaf': 'Mushaf',
    'reading.list': 'Liste',
    'reading.translation': 'Çeviri',
    'reading.tajweed': 'Tecvid',
    'reading.audio': 'Ses',
    'common.loading': 'Yükleniyor...',
    'common.error': 'Hata',
    'common.retry': 'Tekrar Dene',
    'common.cancel': 'İptal',
    'common.save': 'Kaydet',
    'common.edit': 'Düzenle',
    'common.delete': 'Sil',
    'common.search': 'Ara',
    'common.next': 'Sonraki',
    'common.previous': 'Önceki',
    'common.page': 'Sayfa',
    'common.surah': 'Sure',
    'common.ayah': 'Ayet',
    'common.juz': 'Cüz',
    'surah.al_fatihah': 'Fatiha',
    'surah.al_baqadah': 'Bakara',
    'surah.al_imran': 'İmran',
    'word.analysis': 'Kelime Analizi',
    'word.morphology': 'Morfoloji',
    'word.meaning': 'Anlam',
    'word.tafseer': 'Tefsir'
  },
  fr: {
    'app.name': 'Coran Mushaf',
    'app.description': 'Coran Numérique avec la Sensation du Livre Physique',
    'nav.home': 'Accueil',
    'nav.surahs': 'Sourates',
    'nav.search': 'Rechercher',
    'nav.bookmarks': 'Signets',
    'nav.settings': 'Paramètres',
    'nav.admin': 'Admin',
    'reading.mushaf': 'Mushaf',
    'reading.list': 'Liste',
    'reading.translation': 'Traduction',
    'reading.tajweed': 'Tajwid',
    'reading.audio': 'Audio',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.retry': 'Réessayer',
    'common.cancel': 'Annuler',
    'common.save': 'Sauvegarder',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.search': 'Rechercher',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.page': 'Page',
    'common.surah': 'Sourate',
    'common.ayah': 'Verset',
    'common.juz': 'Juz',
    'surah.al_fatihah': 'Al-Fatiha',
    'surah.al_baqadah': 'Al-Baqarah',
    'surah.al_imran': 'Al-Imran',
    'word.analysis': 'Analyse des Mots',
    'word.morphology': 'Morphologie',
    'word.meaning': 'Sens',
    'word.tafseer': 'Exégèse'
  },
  es: {
    'app.name': 'Corán Mushaf',
    'app.description': 'Corán Digital con la Sensación del Libro Físico',
    'nav.home': 'Inicio',
    'nav.surahs': 'Surahs',
    'nav.search': 'Buscar',
    'nav.bookmarks': 'Marcadores',
    'nav.settings': 'Configuración',
    'nav.admin': 'Admin',
    'reading.mushaf': 'Mushaf',
    'reading.list': 'Lista',
    'reading.translation': 'Traducción',
    'reading.tajweed': 'Tajwíd',
    'reading.audio': 'Audio',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.retry': 'Reintentar',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.search': 'Buscar',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.page': 'Página',
    'common.surah': 'Surah',
    'common.ayah': 'Verso',
    'common.juz': 'Yuz',
    'surah.al_fatihah': 'Al-Fatiha',
    'surah.al_baqadah': 'Al-Baqarah',
    'surah.al_imran': 'Al-Imran',
    'word.analysis': 'Análisis de Palabras',
    'word.morphology': 'Morfología',
    'word.meaning': 'Significado',
    'word.tafseer': 'Exégesis'
  }
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Get language from localStorage or default
    const savedLanguage = localStorage.getItem('quran-language') as Language
    return savedLanguage || (appConfig.i18n.defaultLanguage as Language)
  })

  const isRTL = language === 'ar'

  // Update document language and direction
  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    localStorage.setItem('quran-language', language)
  }, [language, isRTL])

  // Listen for language changes in other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'quran-language' && e.newValue) {
        setLanguage(e.newValue as Language)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = translations[language][key] || translations.en[key] || key
    
    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{{${param}}}`, value.toString())
      })
    }
    
    return translation
  }

  const formatNumber = (num: number): string => {
    if (language === 'ar') {
      // Convert to Arabic numerals
      const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
      return num.toString().split('').map(digit => arabicNumerals[parseInt(digit)]).join('')
    }
    return num.toLocaleString(language)
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString(language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isSupportedLanguage = (lang: string): boolean => {
    return appConfig.i18n.supportedLanguages.includes(lang)
  }

  const value: I18nContextType = {
    language,
    setLanguage,
    t,
    isRTL,
    formatNumber,
    formatDate,
    isSupportedLanguage
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}