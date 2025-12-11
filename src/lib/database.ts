// GitHub Database Integration
import EnhancedUniversalSDK, { UniversalSDKConfig } from '../../enhanced-githubdb-sdk';
import { 
  Surah, 
  Ayah, 
  WordAnalysis, 
  Translation, 
  TafseerEntry,
  User,
  AdminSettings,
  ContentVersion
} from '../types';

class QuranDatabase {
  private sdk: EnhancedUniversalSDK;
  private initialized = false;

  constructor(config: UniversalSDKConfig) {
    this.sdk = new EnhancedUniversalSDK(config);
  }

  async init(): Promise<void> {
    if (this.initialized) return;
    
    try {
      await this.sdk.init();
      this.initialized = true;
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  // Quran Core Data Methods
  async getSurahs(): Promise<Surah[]> {
    await this.init();
    return this.sdk.get<Surah>('surahs') || [];
  }

  async getSurah(id: string): Promise<Surah | null> {
    await this.init();
    return this.sdk.getItem<Surah>('surahs', id) || null;
  }

  async getAyahsBySurah(surahId: string): Promise<Ayah[]> {
    await this.init();
    return this.sdk.queryBuilder<Ayah>('ayahs')
      .where(ayah => ayah.surahId === surahId)
      .sort('ayahNumber')
      .exec();
  }

  async getAyah(id: string): Promise<Ayah | null> {
    await this.init();
    return this.sdk.getItem<Ayah>('ayahs', id) || null;
  }

  async getAyahsByPage(pageNumber: number): Promise<Ayah[]> {
    await this.init();
    return this.sdk.queryBuilder<Ayah>('ayahs')
      .where(ayah => ayah.pageNumber === pageNumber)
      .sort('surahId')
      .sort('ayahNumber')
      .exec();
  }

  async getAyahsByJuz(juzNumber: number): Promise<Ayah[]> {
    await this.init();
    return this.sdk.queryBuilder<Ayah>('ayahs')
      .where(ayah => ayah.juzNumber === juzNumber)
      .sort('pageNumber')
      .sort('ayahNumber')
      .exec();
  }

  // Word Analysis Methods
  async getWordAnalysisByAyah(ayahId: string): Promise<WordAnalysis[]> {
    await this.init();
    return this.sdk.queryBuilder<WordAnalysis>('wordAnalysis')
      .where(word => word.ayahId === ayahId)
      .sort('wordIndex')
      .exec();
  }

  async getWordAnalysis(wordId: string): Promise<WordAnalysis | null> {
    await this.init();
    return this.sdk.getItem<WordAnalysis>('wordAnalysis', wordId) || null;
  }

  async searchWords(query: string, language?: string): Promise<WordAnalysis[]> {
    await this.init();
    const allWords = await this.sdk.get<WordAnalysis>('wordAnalysis') || [];
    
    return allWords.filter(word => {
      const arabicMatch = word.arabicWord.includes(query);
      const transliterationMatch = word.transliteration.toLowerCase().includes(query.toLowerCase());
      const meaningMatch = language ? 
        (word.meaning[language]?.toLowerCase().includes(query.toLowerCase()) || false) : false;
      
      return arabicMatch || transliterationMatch || meaningMatch;
    });
  }

  // Translation Methods
  async getTranslationsByAyah(ayahId: string, language?: string): Promise<Translation[]> {
    await this.init();
    let translations = await this.sdk.queryBuilder<Translation>('translations')
      .where(translation => translation.ayahId === ayahId)
      .sort('priority')
      .exec();

    if (language) {
      translations = translations.filter(t => t.language === language);
    }

    return translations;
  }

  async addTranslation(translation: Omit<Translation, 'id'>): Promise<Translation> {
    await this.init();
    return this.sdk.create<Translation>('translations', translation);
  }

  async updateTranslation(id: string, updates: Partial<Translation>): Promise<Translation> {
    await this.init();
    return this.sdk.update<Translation>('translations', id, updates);
  }

  async deleteTranslation(id: string): Promise<void> {
    await this.init();
    return this.sdk.delete('translations', id);
  }

  // Tafseer Methods
  async getTafseerByAyah(ayahId: string, language?: string): Promise<TafseerEntry[]> {
    await this.init();
    let tafseerEntries = await this.sdk.queryBuilder<TafseerEntry>('tafseer')
      .where(entry => entry.ayahId === ayahId)
      .sort('priority')
      .exec();

    if (language) {
      tafseerEntries = tafseerEntries.filter(t => t.language === language);
    }

    return tafseerEntries;
  }

  async addTafseer(tafseer: Omit<TafseerEntry, 'id'>): Promise<TafseerEntry> {
    await this.init();
    return this.sdk.create<TafseerEntry>('tafseer', tafseer);
  }

  async updateTafseer(id: string, updates: Partial<TafseerEntry>): Promise<TafseerEntry> {
    await this.init();
    return this.sdk.update<TafseerEntry>('tafseer', id, updates);
  }

  async deleteTafseer(id: string): Promise<void> {
    await this.init();
    return this.sdk.delete('tafseer', id);
  }

  // Search Methods
  async searchAyahs(query: string, options?: { 
    translationLanguage?: string;
    tafseerLanguage?: string;
    surahId?: string;
  }): Promise<Ayah[]> {
    await this.init();
    
    let ayahs = await this.sdk.get<Ayah>('ayahs') || [];
    
    // Basic text search
    ayahs = ayahs.filter(ayah => 
      ayah.arabicText.includes(query) || 
      ayah.textWithTajweed.includes(query)
    );

    // Filter by surah if specified
    if (options?.surahId) {
      ayahs = ayahs.filter(ayah => ayah.surahId === options.surahId);
    }

    return ayahs.sort((a, b) => {
      // Sort by surah first, then ayah number
      if (a.surahId !== b.surahId) {
        return parseInt(a.surahId) - parseInt(b.surahId);
      }
      return a.ayahNumber - b.ayahNumber;
    });
  }

  // Admin Methods
  async bulkInsertSurahs(surahs: Omit<Surah, 'id'>[]): Promise<Surah[]> {
    await this.init();
    return this.sdk.bulkCreate<Surah>('surahs', surahs);
  }

  async bulkInsertAyahs(ayahs: Omit<Ayah, 'id'>[]): Promise<Ayah[]> {
    await this.init();
    return this.sdk.bulkCreate<Ayah>('ayahs', ayahs);
  }

  // User Management
  async register(email: string, password: string, userData?: any): Promise<User> {
    await this.init();
    return this.sdk.register(email, password, userData);
  }

  async login(email: string, password: string): Promise<any> {
    await this.init();
    return this.sdk.login(email, password);
  }

  async getUser(id: string): Promise<User | null> {
    await this.init();
    return this.sdk.getItem<User>('users', id);
  }

  // Admin Operations
  async getAdminSettings(): Promise<AdminSettings> {
    await this.init();
    const settings = await this.sdk.getItem<AdminSettings>('adminSettings', 'default');
    return settings || {
      id: 'default',
      version: '1.0.0',
      lastUpdate: new Date().toISOString(),
      theme: 'auto',
      languages: ['en', 'ar', 'ur', 'id', 'tr', 'fr', 'es'],
      defaultTranslation: 'en',
      features: {
        tajweed: true,
        audio: true,
        tafseer: true,
        morphology: true,
        search: true,
        export: true
      },
      maintenance: {
        enabled: false,
        message: ''
      }
    };
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    try {
      await this.init();
      await this.sdk.get('surahs'); // Test basic operation
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };
    }
  }

  // Export Methods
  async exportCollection(collection: string, options?: { format?: string }): Promise<string> {
    await this.init();
    const data = await this.sdk.get(collection) || [];
    
    if (options?.format === 'csv') {
      // Simple CSV conversion
      if (data.length === 0) return '';
      
      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(','))
      ];
      
      return csvRows.join('\n');
    }
    
    return JSON.stringify(data, null, 2);
  }
}

// Export DatabaseService as an alias for compatibility
export const DatabaseService = QuranDatabase;

export default QuranDatabase;