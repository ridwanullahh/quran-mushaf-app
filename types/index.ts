// Core Types for Quran App
// Based on Enhanced GitHub SDK

export interface Surah {
  id: string;
  name: string;
  arabicName: string;
  revelationType: 'meccan' | 'medinan';
  numberOfAyahs: number;
  juz: number;
  hizb: number;
  order: number;
  tafseer?: {
    [key: string]: string; // Multiple languages
  };
}

export interface Ayah {
  id: string;
  surahId: string;
  ayahNumber: number;
  pageNumber: number;
  juzNumber: number;
  hizbNumber: number;
  rukuNumber: number;
  arabicText: string;
  tafseer?: {
    [key: string]: string; // Multiple languages
  };
  audioUrl?: string;
  words?: WordAnalysis[];
  translations?: Translation[];
  tafseerContent?: TafseerEntry[];
  tajweedClasses?: TajweedClass[];
}

export interface WordAnalysis {
  id: string;
  ayahId: string;
  wordIndex: number;
  arabicWord: string;
  transliteration: string;
  morphology: {
    root?: string;
    pattern?: string;
    partOfSpeech?: string;
    tense?: string;
    gender?: string;
    number?: string;
    case?: string;
  };
  meaning: {
    [language: string]: string; // Multiple language meanings
  };
  tafseerNotes: {
    [language: string]: string; // Multiple language notes
  };
  tajweedClass: TajweedType;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface Translation {
  id: string;
  ayahId: string;
  language: string;
  translator: string;
  translation: string;
  notes?: string;
  published: boolean;
}

export interface TafseerEntry {
  id: string;
  ayahId: string;
  scholar: string;
  explanation: {
    [language: string]: string; // Multiple languages
  };
  source: string;
  language: string;
  published: boolean;
}

export interface Recitation {
  id: string;
  ayahId: string;
  reciter: string;
  audioUrl: string;
  duration: number;
  quality: 'low' | 'medium' | 'high';
  published: boolean;
}

export interface TajweedClass {
  wordIndex: number;
  class: TajweedType;
  description: {
    [language: string]: string;
  };
  color: string;
}

export type TajweedType = 
  | 'normal'
  | 'ikhfa'
  | 'idgham'
  | 'iqlab'
  | 'ghunna'
  | 'madd'
  | 'qalqalah'
  | 'tanween'
  | 'sakin'
  | 'shadda'
  | 'waqf';

// User and Admin Types
export interface User {
  id: string;
  uid: string;
  email: string;
  verified: boolean;
  roles: string[];
  permissions: string[];
  profile: {
    name?: string;
    avatar?: string;
    language: string;
    preferences: UserPreferences;
  };
  createdAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  tajweedEnabled: boolean;
  translationLanguage: string;
  audioEnabled: boolean;
  autoPlay: boolean;
  pageLayout: 'mushaf' | 'list';
  readingMode: 'scroll' | 'page';
}

// Admin Types
export interface AdminSettings {
  id: string;
  key: string;
  value: any;
  description: string;
  lastModified: string;
}

export interface ContentVersion {
  id: string;
  contentType: 'surah' | 'ayah' | 'word' | 'translation' | 'tafseer';
  contentId: string;
  version: string;
  data: any;
  author: string;
  createdAt: string;
  published: boolean;
  notes?: string;
}

// Layout and UI Types
export interface MushafPage {
  pageNumber: number;
  leftPage?: {
    surahId: string;
    startAyah: number;
    endAyah: number;
  };
  rightPage?: {
    surahId: string;
    startAyah: number;
    endAyah: number;
  };
  layout: 'mushaf' | 'list';
  backgroundImage?: string;
}

export interface NavigationState {
  currentSurah: number;
  currentAyah: number;
  currentPage: number;
  currentJuz: number;
  currentHizb: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Export Types
export interface ExportOptions {
  format: 'json' | 'csv' | 'xml';
  collections: string[];
  includeMetadata: boolean;
  language?: string;
  version?: string;
}

// Search Types
export interface SearchQuery {
  query: string;
  type: 'arabic' | 'translation' | 'tafseer' | 'word';
  language?: string;
  surah?: number;
  ayah?: number;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  type: 'ayah' | 'word' | 'translation' | 'tafseer';
  id: string;
  content: string;
  surahName: string;
  ayahNumber: number;
  relevance: number;
  highlights: string[];
}

// Audio Types
export interface AudioState {
  isPlaying: boolean;
  currentAyah: string;
  currentReciter: string;
  volume: number;
  position: number;
  duration: number;
}

// Theme and Styling
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  tajweed: {
    [key in TajweedType]: string;
  };
}

// Component Props Types
export interface AyahProps {
  ayah: Ayah;
  showTranslation?: boolean;
  showTafseer?: boolean;
  showTajweed?: boolean;
  interactive?: boolean;
  onWordClick?: (word: WordAnalysis) => void;
  onAyahClick?: (ayah: Ayah) => void;
}

export interface WordProps {
  word: WordAnalysis;
  isHighlighted?: boolean;
  onClick?: (word: WordAnalysis) => void;
  tajweedColors?: boolean;
}

// Navigation and Router Types
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
  permission?: string;
}

export interface RouteParams {
  surah?: string;
  ayah?: string;
  page?: string;
  juz?: string;
  search?: string;
}

// Configuration Types
export interface AppConfig {
  app: {
    name: string;
    version: string;
    description: string;
  };
  github: {
    owner: string;
    repo: string;
    branch: string;
  };
  i18n: {
    defaultLanguage: string;
    supportedLanguages: string[];
  };
  features: {
    audioEnabled: boolean;
    tajweedEnabled: boolean;
    tafseerEnabled: boolean;
    adminEnabled: boolean;
  };
}