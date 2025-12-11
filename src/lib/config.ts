// App Configuration
import { AppConfig } from '@/types'

export const appConfig: AppConfig = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Quran Mushaf',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    description: 'Feature-rich digital Quran application with authentic Mushaf layout'
  },
  
  github: {
    owner: process.env.GITHUB_OWNER || '',
    repo: process.env.GITHUB_REPO || '',
    branch: process.env.GITHUB_BRANCH || 'main'
  },
  
  i18n: {
    defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
    supportedLanguages: (process.env.NEXT_PUBLIC_SUPPORTED_LANGUAGES || 'en,ar,ur,id,tr,fr,es').split(',')
  },
  
  features: {
    audioEnabled: true,
    tajweedEnabled: true,
    tafseerEnabled: true,
    adminEnabled: true
  }
}

// GitHub Database Configuration
export const githubConfig = {
  owner: process.env.GITHUB_OWNER!,
  repo: process.env.GITHUB_REPO!,
  token: process.env.GITHUB_TOKEN!,
  branch: process.env.GITHUB_BRANCH || 'main',
  basePath: 'db',
  mediaPath: 'media'
}

// Gmail Configuration for Email Service
export const gmailConfig = {
  clientId: process.env.GMAIL_CLIENT_ID!,
  clientSecret: process.env.GMAIL_CLIENT_SECRET!,
  refreshToken: process.env.GMAIL_REFRESH_TOKEN!,
  user: process.env.GMAIL_USER!
}

// Default Surah Names (English)
export const surahNames = [
  'Al-Fatihah', 'Al-Baqarah', 'Al-Imran', 'An-Nisa', 'Al-Ma\'idah', 'Al-An\'am', 'Al-A\'raf', 'Al-Anfal', 'At-Tawbah',
  'Yunus', 'Hud', 'Yusuf', 'Ar-Ra\'d', 'Ibrahim', 'Al-Hijr', 'An-Nahl', 'Al-Isra', 'Al-Kahf', 'Maryam',
  'Taha', 'Al-Anbiya', 'Al-Hajj', 'Al-Mu\'minun', 'An-Nur', 'Al-Furqan', 'Ash-Shu\'ara', 'An-Naml', 'Al-Qasas', 'Al-\'Ankabut',
  'Ar-Rum', 'Luqman', 'As-Sajdah', 'Al-Ahzab', 'Saba', 'Fatir', 'Ya-Sin', 'As-Saffat', 'Sad', 'Az-Zumar',
  'Ghafir', 'Fussilat', 'Ash-Shura', 'Az-Zukhruf', 'Ad-Dukhan', 'Al-Jathiyah', 'Al-Ahqaf', 'Muhammad', 'Al-Fath', 'Al-Hujurat',
  'Qaf', 'Adh-Dhariyat', 'At-Tur', 'An-Najm', 'Al-Qamar', 'Ar-Rahman', 'An-Nazi\'at', 'Abasa', 'At-Takwir', 'Al-Infitar',
  'Al-Mutaffifin', 'Al-Inshiqaq', 'Al-Buruj', 'At-Tariq', 'Al-A\'la', 'Al-Ghashiyah', 'Al-Fajr', 'Al-Balad', 'Ash-Shams', 'Al-Layl',
  'Ad-Duha', 'Al-Inshirah', 'At-Tin', 'Al-Alaq', 'Al-Qadr', 'Al-Bayyinah', 'Az-Zalzalah', 'Al-Adiyat', 'Al-Qari\'ah', 'At-Takathur',
  'Al-Asr', 'Al-Humazah', 'Al-Fil', 'Quraysh', 'Al-Ma\'un', 'Al-Kawthar', 'Al-Kafirun', 'An-Nasr', 'Al-Masad', 'Al-Ikhlas',
  'Al-Falaq', 'An-Nas'
]

// Default Reciters
export const reciters = [
  { id: 'shatri', name: 'Abdul Basit Abdul Samad', description: 'Classic Egyptian style' },
  { id: 'sudais', name: 'Abdul Rahman Al-Sudais', description: 'Clear and melodious' },
  { id: 'minshawi', name: 'Mohamed Siddiq El-Minshawi', description: 'Beautiful tajweed' },
  { id: 'husary', name: 'Mahmoud Khalil Al-Husary', description: 'Spiritual and moving' },
  { id: 'ghamdi', name: 'Saad Al-Ghamdi', description: 'Modern style' },
  { id: 'shuraim', name: 'Saud Al-Shuraim', description: 'Perfect tajweed' }
]

// Default Translations
export const translations = [
  { id: 'en-sahih', name: 'Sahih International', language: 'en', author: 'Sahih International' },
  { id: 'en-pickthall', name: 'Pickthall', language: 'en', author: 'Marmaduke Pickthall' },
  { id: 'en-yusufali', name: 'Yusuf Ali', language: 'en', author: 'Abdullah Yusuf Ali' },
  { id: 'ur-jalandhry', name: 'Jalandhry', language: 'ur', author: 'Allama Mashriq al-Din bin Ghulam Rasool Jalandhry' },
  { id: 'id-basmeih', name: 'Basmeih', language: 'id', author: 'Team Pustaka Islam' }
]

// Tajweed Rules
export const tajweedRules = {
  normal: { name: 'Normal', color: '#000000', description: 'Regular recitation' },
  ikhfah: { name: 'Ikhfa', color: '#0066cc', description: 'Concealment of noon and tanween' },
  idgham: { name: 'Idgham', color: '#cc6600', description: 'Merging of noon and tanween' },
  iqlab: { name: 'Iqlab', color: '#6600cc', description: 'Conversion of noon and tanween to meem' },
  ghunna: { name: 'Ghunna', color: '#cc0066', description: 'Nasal sound of noon and tanween' },
  madd: { name: 'Madd', color: '#00cc66', description: 'Lengthening of vowels' },
  qalqalah: { name: 'Qalqalah', color: '#cc0000', description: 'Bouncing sound of certain letters' },
  tanween: { name: 'Tanween', color: '#666666', description: 'Double vowel endings' },
  sakin: { name: 'Sakin', color: '#999999', description: 'Letters with sukun' },
  shadda: { name: 'Shadda', color: '#333333', description: 'Doubling of letters' },
  waqf: { name: 'Waqf', color: '#cc9900', description: 'Stopping places' }
}

// Page Navigation Constants
export const TOTAL_PAGES = 604
export const TOTAL_SURAHS = 114
export const AYAH_PER_PAGE_AVERAGE = 10

// Font Sizes
export const fontSizes = {
  small: 'text-arabic text-base',
  medium: 'text-arabic text-lg',
  large: 'text-arabic text-xl',
  'extra-large': 'text-arabic text-2xl'
}

// Theme Colors
export const themeColors = {
  light: {
    background: 'bg-cream-50',
    surface: 'bg-white',
    text: 'text-ink-800',
    textSecondary: 'text-ink-600',
    border: 'border-cream-200',
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600'
  },
  dark: {
    background: 'bg-ink-900',
    surface: 'bg-ink-800',
    text: 'text-cream-100',
    textSecondary: 'text-cream-300',
    border: 'border-ink-700',
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500'
  }
}