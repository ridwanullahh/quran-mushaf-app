#!/usr/bin/env ts-node

import { DatabaseService } from '../lib/database';
import { Surah, Ayah, QuranWord, Translation, Tafseer, Morphology } from '../types';

interface QuranData {
  surahs: Surah[];
  ayahs: Ayah[];
  words: QuranWord[];
  translations?: Translation[];
  tafseer?: Tafseer[];
  morphology?: Morphology[];
}

interface SeedOptions {
  includeSampleData?: boolean;
  dataSource?: 'quran_api' | 'local_json' | 'sample';
  filePath?: string;
  skipExisting?: boolean;
}

class QuranDataSeeder {
  private db: DatabaseService;

  constructor() {
    this.db = DatabaseService.getInstance();
  }

  async seed(options: SeedOptions = {}) {
    console.log('🌱 Starting Quran data seeding...');
    
    try {
      // Initialize collections
      await this.initializeCollections();
      
      // Seed Surahs
      await this.seedSurahs();
      
      // Seed Ayahs
      await this.seedAyahs();
      
      // Seed Words
      await this.seedWords();
      
      // Seed Quranic Sciences
      if (options.includeSampleData) {
        await this.seedSampleTranslations();
        await this.seedSampleTafseer();
        await this.seedSampleMorphology();
      }
      
      console.log('✅ Quran data seeding completed successfully!');
      
    } catch (error) {
      console.error('❌ Error seeding Quran data:', error);
      throw error;
    }
  }

  private async initializeCollections() {
    console.log('📚 Initializing collections...');
    
    const collections = ['surahs', 'ayahs', 'words', 'translations', 'tafseer', 'morphology', 'users', 'settings'];
    
    for (const collection of collections) {
      try {
        await this.db.createCollection(collection);
        console.log(`✅ Collection '${collection}' ready`);
      } catch (error) {
        // Collection might already exist
        console.log(`ℹ️  Collection '${collection}' already exists`);
      }
    }
  }

  private async seedSurahs() {
    console.log('📖 Seeding Surahs...');
    
    const surahs: Omit<Surah, 'id'>[] = [
      // Al-Fatihah (Makkah)
      { number: 1, name: 'Al-Fatihah', arabic_name: 'الفاتحة', revelation_place: 'Makkah', ayahs_count: 7 },
      // Al-Baqarah (Madinah)
      { number: 2, name: 'Al-Baqarah', arabic_name: 'البقرة', revelation_place: 'Madinah', ayahs_count: 286 },
      // Al-Imran (Madinah)
      { number: 3, name: 'Al-Imran', arabic_name: 'آل عمران', revelation_place: 'Madinah', ayahs_count: 200 },
      // An-Nisa (Madinah)
      { number: 4, name: 'An-Nisa', arabic_name: 'النساء', revelation_place: 'Madinah', ayahs_count: 176 },
      // Al-Ma'idah (Madinah)
      { number: 5, name: 'Al-Ma\'idah', arabic_name: 'المائدة', revelation_place: 'Madinah', ayahs_count: 120 },
      // Al-An'am (Makkah)
      { number: 6, name: 'Al-An\'am', arabic_name: 'الأنعام', revelation_place: 'Makkah', ayahs_count: 165 },
      // Al-A'raf (Makkah)
      { number: 7, name: 'Al-A\'raf', arabic_name: 'الأعراف', revelation_place: 'Makkah', ayahs_count: 206 },
      // Al-Anfal (Madinah)
      { number: 8, name: 'Al-Anfal', arabic_name: 'الأنفال', revelation_place: 'Madinah', ayahs_count: 75 },
      // At-Tawbah (Madinah)
      { number: 9, name: 'At-Tawbah', arabic_name: 'التوبة', revelation_place: 'Madinah', ayahs_count: 129 },
      // Yunus (Makkah)
      { number: 10, name: 'Yunus', arabic_name: 'يونس', revelation_place: 'Makkah', ayahs_count: 109 },
      // Hud (Makkah)
      { number: 11, name: 'Hud', arabic_name: 'هود', revelation_place: 'Makkah', ayahs_count: 123 },
      // Yusuf (Makkah)
      { number: 12, name: 'Yusuf', arabic_name: 'يوسف', revelation_place: 'Makkah', ayahs_count: 111 },
      // Ar-Ra'd (Makkah)
      { number: 13, name: 'Ar-Ra\'d', arabic_name: 'الرعد', revelation_place: 'Madinah', ayahs_count: 43 },
      // Ibrahim (Makkah)
      { number: 14, name: 'Ibrahim', arabic_name: 'إبراهيم', revelation_place: 'Makkah', ayahs_count: 52 },
      // Al-Hijr (Makkah)
      { number: 15, name: 'Al-Hijr', arabic_name: 'الحجر', revelation_place: 'Makkah', ayahs_count: 99 },
    ];

    for (const surah of surahs) {
      const existing = await this.db.findOne('surahs', { number: surah.number });
      if (!existing) {
        await this.db.insertOne('surahs', {
          ...surah,
          id: `surah_${surah.number}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    }
    
    console.log(`✅ Seeded ${surahs.length} Surahs`);
  }

  private async seedAyahs() {
    console.log('📜 Seeding Ayahs...');
    
    // Sample ayahs from key surahs
    const ayahs: Omit<Ayah, 'id'>[] = [
      // Al-Fatihah
      { number: 1, surah_number: 1, text: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', words_count: 4 },
      { number: 2, surah_number: 1, text: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ', words_count: 4 },
      { number: 3, surah_number: 1, text: 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', words_count: 2 },
      { number: 4, surah_number: 1, text: 'مَٰلِكِ يَوْمِ ٱلدِّينِ', words_count: 3 },
      { number: 5, surah_number: 1, text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', words_count: 4 },
      { number: 6, surah_number: 1, text: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ', words_count: 4 },
      { number: 7, surah_number: 1, text: 'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّالِّينَ', words_count: 11 },
      
      // Al-Baqarah - Ayat al-Kursi
      { number: 255, surah_number: 2, text: 'ٱللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ', words_count: 47 },
      
      // Al-Baqarah - First few verses
      { number: 1, surah_number: 2, text: 'الم', words_count: 1 },
      { number: 2, surah_number: 2, text: 'ذَٰلِكَ ٱلْكِتَابُ لَا رَيْبَ ۘ فِيهِ هُدًى لِّلْمُتَّقِينَ', words_count: 5 },
      { number: 3, surah_number: 2, text: 'ٱلَّذِينَ يُؤْمِنُونَ بِٱلْغَيْبِ وَيُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا رَزَقْنَٰهُمْ يُنفِقُونَ', words_count: 6 },
      { number: 4, surah_number: 2, text: 'وَٱلَّذِينَ يُؤْمِنُونَ بِمَآ أُنزِلَ إِلَيْكَ وَمَآ أُنزِلَ مِن قَبْلِكَ وَبِٱلْءَاخِرَةِ هُمْ يُوقِنُونَ', words_count: 8 },
      { number: 5, surah_number: 2, text: 'أُولَٰٓئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰٓئِكَ هُمُ ٱلْمُفْلِحُونَ', words_count: 7 }
    ];

    for (const ayah of ayahs) {
      const existing = await this.db.findOne('ayahs', { 
        number: ayah.number, 
        surah_number: ayah.surah_number 
      });
      
      if (!existing) {
        await this.db.insertOne('ayahs', {
          ...ayah,
          id: `ayah_${ayah.surah_number}_${ayah.number}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    }
    
    console.log(`✅ Seeded ${ayahs.length} Ayahs`);
  }

  private async seedWords() {
    console.log('🔤 Seeding Words...');
    
    // Sample words from key verses
    const words: Omit<QuranWord, 'id'>[] = [
      // From Al-Fatihah 1:1
      { position: 1, surah_number: 1, ayah_number: 1, text: 'بِسْمِ', root: 'س م و', transliteration: 'Bismi', morphology: 'noun:genitive:3rd person', meaning: 'In the name' },
      { position: 2, surah_number: 1, ayah_number: 1, text: 'ٱللَّهِ', root: 'إ ل ه', transliteration: 'Allahi', morphology: 'noun:genitive:3rd person', meaning: 'Allah' },
      { position: 3, surah_number: 1, ayah_number: 1, text: 'ٱلرَّحْمَٰنِ', root: 'ر ح م', transliteration: 'Ar-Rahmani', morphology: 'noun:genitive:3rd person', meaning: 'The Most Gracious' },
      { position: 4, surah_number: 1, ayah_number: 1, text: 'ٱلرَّحِيمِ', root: 'ر ح م', transliteration: 'Ar-Raheemi', morphology: 'noun:genitive:3rd person', meaning: 'The Most Merciful' },
      
      // From Al-Fatihah 1:2
      { position: 1, surah_number: 1, ayah_number: 2, text: 'ٱلْحَمْدُ', root: 'ح م د', transliteration: 'Al-Hamdu', morphology: 'noun:nominative:3rd person', meaning: 'The praise' },
      { position: 2, surah_number: 1, ayah_number: 2, text: 'لِلَّهِ', root: 'إ ل ه', transliteration: 'Lillahi', morphology: 'preposition + noun:genitive', meaning: 'Belongs to Allah' },
      { position: 3, surah_number: 1, ayah_number: 2, text: 'رَبِّ', root: 'ر ب ب', transliteration: 'Rabbi', morphology: 'noun:genitive:1st person', meaning: 'Lord' },
      { position: 4, surah_number: 1, ayah_number: 2, text: 'ٱلْعَٰلَمِينَ', root: 'ع ل م', transliteration: 'Al-AAalamiin', morphology: 'noun:genitive:3rd person', meaning: 'The worlds' },
      
      // From Ayat al-Kursi (2:255)
      { position: 1, surah_number: 2, ayah_number: 255, text: 'ٱللَّهُ', root: 'إ ل ه', transliteration: 'Allahu', morphology: 'noun:nominative:3rd person', meaning: 'Allah' },
      { position: 2, surah_number: 2, ayah_number: 255, text: 'لَا', root: 'ل ا', transliteration: 'Laa', morphology: 'negative particle', meaning: 'No/Not' },
      { position: 3, surah_number: 2, ayah_number: 255, text: 'إِلَٰهَ', root: 'إ ل ه', transliteration: 'Ilaaha', morphology: 'noun:nominative:3rd person', meaning: 'Deity' },
      { position: 4, surah_number: 2, ayah_number: 255, text: 'إِلَّا', root: 'إ ل ا', transliteration: 'Illa', morphology: 'exceptive particle', meaning: 'Except' },
      { position: 5, surah_number: 2, ayah_number: 255, text: 'هُوَ', root: 'ه و', transliteration: 'Huwa', morphology: 'pronoun:nominative:3rd person masculine', meaning: 'He' },
    ];

    for (const word of words) {
      const existing = await this.db.findOne('words', {
        surah_number: word.surah_number,
        ayah_number: word.ayah_number,
        position: word.position
      });
      
      if (!existing) {
        await this.db.insertOne('words', {
          ...word,
          id: `word_${word.surah_number}_${word.ayah_number}_${word.position}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    }
    
    console.log(`✅ Seeded ${words.length} Words`);
  }

  private async seedSampleTranslations() {
    console.log('🌐 Seeding Sample Translations...');
    
    const translations: Omit<Translation, 'id'>[] = [
      {
        surah_number: 1, ayah_number: 1, word_position: 1,
        translation_text: 'In the name of Allah, the Most Gracious, the Most Merciful',
        translator: 'Dr. Muhammad Ali',
        language_code: 'en',
        confidence_score: 0.98,
        notes: 'Standard translation by Dr. Muhammad Ali'
      },
      {
        surah_number: 1, ayah_number: 1, word_position: 2,
        translation_text: 'In the name of Allah, the Most Gracious, the Most Merciful',
        translator: 'Dr. Muhammad Ali',
        language_code: 'en',
        confidence_score: 0.98,
        notes: 'Standard translation by Dr. Muhammad Ali'
      },
      {
        surah_number: 2, ayah_number: 255, word_position: 1,
        translation_text: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence',
        translator: 'Dr. Muhammad Ali',
        language_code: 'en',
        confidence_score: 0.95,
        notes: 'Ayat al-Kursi - key verse'
      },
    ];

    for (const translation of translations) {
      const existing = await this.db.findOne('translations', {
        surah_number: translation.surah_number,
        ayah_number: translation.ayah_number,
        word_position: translation.word_position,
        language_code: translation.language_code
      });
      
      if (!existing) {
        await this.db.insertOne('translations', {
          ...translation,
          id: `translation_${translation.surah_number}_${translation.ayah_number}_${translation.word_position}_${translation.language_code}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    }
    
    console.log(`✅ Seeded ${translations.length} Sample Translations`);
  }

  private async seedSampleTafseer() {
    console.log('📖 Seeding Sample Tafseer...');
    
    const tafseer: Omit<Tafseer, 'id'>[] = [
      {
        surah_number: 1, ayah_number: 1, word_position: 1,
        tafseer_text: 'The verse begins with the declaration of the oneness of Allah, emphasizing that all forms of worship and devotion should be directed solely to Allah. The name "Ar-Rahman" (The Most Gracious) indicates Allah\'s infinite mercy and generosity, while "Ar-Raheem" (The Most Merciful) refers to His specific mercy upon His servants.',
        tafseer_source: 'Tafsir Ibn Kathir',
        scholar: 'Ibn Kathir',
        language_code: 'en',
        tafseer_type: 'exegesis',
        confidence_score: 0.95,
        references: 'Quran 1:1, Hadith Bukhari 1123',
        notes: 'Key verse for understanding Allah\'s attributes'
      },
      {
        surah_number: 2, ayah_number: 255, word_position: 1,
        tafseer_text: 'This is Ayat al-Kursi, the most magnificent verse in the Quran. It establishes the fundamental concept of Allah\'s sovereignty, eternal existence, and absolute authority. The verse declares that Allah is self-subsisting and the source of all existence, emphasizing His independence from any need while all creation depends upon Him.',
        tafseer_source: 'Tafsir al-Jalalayn',
        scholar: 'Jalal ad-Din al-Mahalli',
        language_code: 'en',
        tafseer_type: 'exegesis',
        confidence_score: 0.98,
        references: 'Quran 2:255, Sahih Muslim 908',
        notes: 'Most important verse in Quran'
      },
    ];

    for (const item of tafseer) {
      const existing = await this.db.findOne('tafseer', {
        surah_number: item.surah_number,
        ayah_number: item.ayah_number,
        word_position: item.word_position,
        tafseer_source: item.tafseer_source,
        scholar: item.scholar
      });
      
      if (!existing) {
        await this.db.insertOne('tafseer', {
          ...item,
          id: `tafseer_${item.surah_number}_${item.ayah_number}_${item.word_position}_${item.scholar.replace(/\s+/g, '_')}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    }
    
    console.log(`✅ Seeded ${tafseer.length} Sample Tafseer`);
  }

  private async seedSampleMorphology() {
    console.log('🔤 Seeding Sample Morphology...');
    
    const morphology: Omit<Morphology, 'id'>[] = [
      {
        surah_number: 1, ayah_number: 1, word_position: 1,
        word_text: 'بِسْمِ',
        root: 'س م و',
        transliteration: 'Bismi',
        morphology: 'noun:genitive:3rd person',
        grammar_type: 'noun',
        person: '3rd',
        number: 'singular',
        gender: 'masculine',
        case: 'genitive',
        etymology: 'From س م و (to name)',
        semantic_field: 'names and attributes',
        linguistic_notes: 'Genitive construction indicating ownership or association',
        confidence_score: 0.98,
        language_code: 'ar',
        notes: 'Preposition + noun construct state'
      },
      {
        surah_number: 2, ayah_number: 255, word_position: 1,
        word_text: 'ٱللَّهُ',
        root: 'إ ل ه',
        transliteration: 'Allahu',
        morphology: 'noun:nominative:3rd person',
        grammar_type: 'noun',
        person: '3rd',
        number: 'singular',
        gender: 'masculine',
        case: 'nominative',
        etymology: 'From إ ل ه (to worship, to be worshipped)',
        semantic_field: 'divine names and attributes',
        linguistic_notes: 'Definite noun with emphatic -u ending',
        confidence_score: 0.99,
        language_code: 'ar',
        notes: 'Divine name, most frequently used in Quran'
      },
    ];

    for (const item of morphology) {
      const existing = await this.db.findOne('morphology', {
        surah_number: item.surah_number,
        ayah_number: item.ayah_number,
        word_position: item.word_position,
        language_code: item.language_code
      });
      
      if (!existing) {
        await this.db.insertOne('morphology', {
          ...item,
          id: `morphology_${item.surah_number}_${item.ayah_number}_${item.word_position}_${item.language_code}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    }
    
    console.log(`✅ Seeded ${morphology.length} Sample Morphology`);
  }

  async loadFromJSON(filePath: string) {
    console.log(`📄 Loading Quran data from ${filePath}...`);
    
    try {
      const fs = await import('fs');
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      if (data.surahs) {
        for (const surah of data.surahs) {
          const existing = await this.db.findOne('surahs', { number: surah.number });
          if (!existing) {
            await this.db.insertOne('surahs', {
              ...surah,
              id: `surah_${surah.number}`,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          }
        }
      }
      
      if (data.ayahs) {
        for (const ayah of data.ayahs) {
          const existing = await this.db.findOne('ayahs', {
            number: ayah.number,
            surah_number: ayah.surah_number
          });
          if (!existing) {
            await this.db.insertOne('ayahs', {
              ...ayah,
              id: `ayah_${ayah.surah_number}_${ayah.number}`,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          }
        }
      }
      
      console.log('✅ Quran data loaded successfully from JSON');
      
    } catch (error) {
      console.error('❌ Error loading Quran data from JSON:', error);
      throw error;
    }
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  const options: SeedOptions = {
    includeSampleData: args.includes('--with-samples'),
    dataSource: (args.find(arg => arg.startsWith('--source='))?.split('=')[1] as any) || 'sample',
    filePath: args.find(arg => arg.startsWith('--file='))?.split('=')[1],
    skipExisting: args.includes('--skip-existing')
  };

  const seeder = new QuranDataSeeder();
  
  try {
    await seeder.seed(options);
    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { QuranDataSeeder };