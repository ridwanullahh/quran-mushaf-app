// Database initialization script
import { surahNames } from '../src/lib/config'
import QuranDatabase from '../src/lib/database'

async function initializeDatabase() {
  console.log('🚀 Initializing Quran Database...')

  const db = new QuranDatabase({
    owner: process.env.GITHUB_OWNER!,
    repo: process.env.GITHUB_REPO!,
    token: process.env.GITHUB_TOKEN!,
    branch: process.env.GITHUB_BRANCH || 'main'
  })

  try {
    // Initialize the database connection
    await db.init()
    console.log('✅ Database connection established')

    // Check if surahs already exist
    const existingSurahs = await db.getSurahs()
    if (existingSurahs.length > 0) {
      console.log(`📚 Found ${existingSurahs.length} existing surahs`)
      return
    }

    // Create sample surah data
    console.log('📖 Creating surah data...')
    const surahs = []
    
    for (let i = 0; i < surahNames.length; i++) {
      const surahNumber = i + 1
      const surahData = {
        name: surahNames[i],
        arabicName: getArabicSurahName(surahNumber),
        revelationType: surahNumber <= 9 ? 'meccan' as const : 'medinan' as const,
        numberOfAyahs: getAyahCount(surahNumber),
        juz: Math.ceil(surahNumber / 4), // Approximate juz calculation
        hizb: Math.ceil(surahNumber / 2), // Approximate hizb calculation
        order: surahNumber
      }
      surahs.push(surahData)
    }

    // Insert surahs
    await db.bulkInsertSurahs(surahs)
    console.log(`✅ Created ${surahs.length} surahs`)

    // Create sample ayah data for the first few surahs
    console.log('📜 Creating sample ayah data...')
    const sampleAyahs = [
      {
        surahId: '1',
        ayahNumber: 1,
        pageNumber: 1,
        juzNumber: 1,
        hizbNumber: 1,
        rukuNumber: 1,
        arabicText: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
        tafseer: {
          en: 'In the name of Allah, the Most Gracious, the Most Merciful'
        }
      },
      {
        surahId: '1',
        ayahNumber: 2,
        pageNumber: 1,
        juzNumber: 1,
        hizbNumber: 1,
        rukuNumber: 1,
        arabicText: 'ٱلْحَمْدُ لِلهِ رَبِّ ٱلْعَٰلَمِينَ',
        tafseer: {
          en: 'All praise belongs to Allah, Lord of all the worlds'
        }
      }
    ]

    await db.bulkInsertAyahs(sampleAyahs)
    console.log(`✅ Created ${sampleAyahs.length} sample ayahs`)

    // Create admin user
    console.log('👤 Creating admin user...')
    const adminUser = await db.register(
      'admin@quranmushaf.com',
      'admin123',
      {
        name: 'Admin User',
        roles: ['admin', 'user'],
        permissions: ['read', 'write', 'admin'],
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
        }
      }
    )
    console.log(`✅ Created admin user: ${adminUser.email}`)

    // Create admin settings
    console.log('⚙️ Creating admin settings...')
    await db.updateAdminSetting('app_version', '1.0.0', 'Application version')
    await db.updateAdminSetting('maintenance_mode', false, 'Maintenance mode status')
    await db.updateAdminSetting('registration_enabled', true, 'User registration status')
    
    console.log('🎉 Database initialization completed successfully!')
    console.log('\n📝 Next steps:')
    console.log('1. Configure your environment variables')
    console.log('2. Import your actual Quran data')
    console.log('3. Set up email configuration for user verification')
    console.log('4. Customize the application settings')

  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    process.exit(1)
  }
}

function getArabicSurahName(surahNumber: number): string {
  const arabicNames = [
    'الفاتحة', 'البقرة', 'آل عمران', 'النساء', 'المائدة', 'الأنعام', 'الأعراف', 'الأنفال', 'التوبة',
    'يونس', 'هود', 'يوسف', 'الرعد', 'إبراهيم', 'الحجر', 'النحل', 'الإسراء', 'الكهف', 'مريم', 'طه',
    'الأنبياء', 'الحج', 'المؤمنون', 'النور', 'الفرقان', 'الشعراء', 'النمل', 'القصص', 'العنكبوت', 'الروم',
    'لقمان', 'السجدة', 'الأحزاب', 'سبأ', 'فاطر', 'يس', 'الصافات', 'ص', 'الزمر', 'غافر',
    'فصلت', 'الشورى', 'الزخرف', 'الدخان', 'الجاثية', 'الأحقاف', 'محمد', 'الفتح', 'الحجرات', 'ق',
    'الذاريات', 'الطور', 'النجم', 'القمر', 'الرحمن', 'الواقعة', 'الحديد', 'المجادلة', 'الحشر', 'الممتحنة',
    'الصف', 'الجمعة', 'المنافقون', 'التغابن', 'الطلاق', 'التحريم', 'الملك', 'القلم', 'الحاقة', 'المعارج',
    'نوح', 'الجن', 'المزمل', 'المدثر', 'القيامة', 'الإنسان', 'المرسلات', 'النبأ', 'النازعات', 'عبس',
    'التكوير', 'الانفطار', 'المطففين', 'الانشقاق', 'البروج', 'الطارق', 'الأعلى', 'الغاشية', 'الفجر', 'البلد',
    'الشمس', 'الليل', 'الضحى', 'الشرح', 'التين', 'العلق', 'القدر', 'البينة', 'الزلزلة', 'العاديات',
    'القارعة', 'التكاثر', 'العصر', 'الهمزة', 'الفيل', 'قريش', 'الماعون', 'الكوثر', 'الكافرون', 'النصر',
    'المسد', 'الإخلاص', 'الفلق', 'الناس'
  ]
  return arabicNames[surahNumber - 1] || `سورة ${surahNumber}`
}

function getAyahCount(surahNumber: number): number {
  // Approximate ayah counts for major surahs
  const counts: Record<number, number> = {
    1: 7, 2: 286, 3: 200, 4: 176, 5: 120, 6: 165, 7: 206, 8: 75, 9: 129, 10: 109,
    11: 123, 12: 111, 13: 43, 14: 52, 15: 99, 16: 128, 17: 111, 18: 110, 19: 98, 20: 135,
    21: 112, 22: 78, 23: 118, 24: 64, 25: 77, 26: 227, 27: 93, 28: 88, 29: 69, 30: 60,
    31: 34, 32: 30, 33: 73, 34: 54, 35: 45, 36: 83, 37: 182, 38: 88, 39: 75, 40: 85,
    41: 54, 42: 53, 43: 89, 44: 59, 45: 37, 46: 35, 47: 38, 48: 29, 49: 18, 50: 45,
    51: 60, 52: 49, 53: 62, 54: 55, 55: 78, 56: 96, 57: 29, 58: 22, 59: 24, 60: 13,
    61: 14, 62: 11, 63: 11, 64: 18, 65: 12, 66: 12, 67: 30, 68: 52, 69: 52, 70: 44,
    71: 28, 71: 28, 72: 28, 73: 20, 74: 56, 75: 40, 76: 31, 77: 50, 78: 40, 79: 46,
    80: 42, 81: 29, 82: 19, 83: 36, 84: 25, 85: 22, 86: 17, 87: 19, 88: 26, 89: 30,
    91: 15, 92: 21, 93: 11, 94: 8, 95: 8, 96: 19, 97: 5, 98: 8, 99: 8, 100: 11,
    101: 11, 102: 8, 103: 3, 104: 9, 105: 5, 106: 4, 107: 7, 108: 3, 109: 6, 110: 3,
    111: 5, 112: 4, 113: 5, 114: 6
  }
  return counts[surahNumber] || 10 // Default fallback
}

// Run the initialization
initializeDatabase().catch(console.error)