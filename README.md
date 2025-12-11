# Quran Mushaf - Feature-Rich Digital Quran Application 🚀

<div align="center">

![Quran Mushaf](https://img.shields.io/badge/Quran-Mushaf-green?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)
![GitHub](https://img.shields.io/badge/GitHub-Database-181717?style=for-the-badge&logo=github)

**A comprehensive, production-ready Quran application with authentic Mushaf layout and advanced Quranic sciences features.**

[Features](#features) • [Installation](#installation) • [Configuration](#configuration) • [Usage](#usage) • [API](#api) • [Contributing](#contributing) • [License](#license)

</div>

## 🌟 Features

### 📖 Authentic Mushaf Experience
- **Physical Mushaf Layout**: Exact 15-line page structure with King Fahd Complex styling
- **Ornate Borders**: Traditional Islamic geometric patterns and decorative elements
- **Page-turning Effects**: Smooth animations that mimic real book pages
- **Dual View Modes**: Switch between Mushaf layout and modern list view
- **Tajweed Color Coding**: Interactive color-coded pronunciation rules

### 🔍 Word-by-Word Analysis
- **Morphological Analysis**: Root words, patterns, and grammatical breakdown
- **Multiple Translations**: Support for various translation languages and scholars
- **Interactive Words**: Click any word for detailed analysis
- **Tafseer Integration**: Scholarly commentary and explanations
- **Audio Recitation**: Multiple reciter options with high-quality audio

### 🌐 Multi-Language Support
- **7 Languages**: English, Arabic, Urdu, Indonesian, Turkish, French, Spanish
- **RTL Support**: Proper right-to-left text handling for Arabic
- **Dynamic Translation**: Real-time language switching
- **Localized Content**: All UI elements and content in multiple languages

### 👨‍💼 Admin Management System
- **Content Management**: Full CRUD operations for all Quranic data
- **Version Control**: Content versioning and rollback capabilities
- **Bulk Import/Export**: JSON and CSV export formats
- **User Management**: Role-based access control
- **Analytics Dashboard**: Usage statistics and insights

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode**: Automatic theme detection with manual toggle
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation
- **Progressive Web App**: Installable with offline capabilities
- **Touch Gestures**: Swipe navigation for mobile devices

### 💾 GitHub Database Integration
- **Enhanced GitHub SDK**: Custom-built SDK with schema evolution
- **Real-time Sync**: Automatic data synchronization across clients
- **Conflict Resolution**: Smart handling of concurrent edits
- **Email Integration**: Gmail-powered email service with OTP verification
- **Offline Support**: Local caching with background sync

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- GitHub account with Personal Access Token
- Gmail account for email services (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quran-mushaf-app.git
   cd quran-mushaf-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Initialize the database**
   ```bash
   npm run db:init
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## ⚙️ Configuration

### GitHub Database Setup

1. **Create a new GitHub repository** for your Quran database
2. **Generate a Personal Access Token** with repo permissions
3. **Configure the repository structure**:
   ```
   db/
   ├── surahs.json
   ├── ayahs.json
   ├── wordAnalysis.json
   ├── translations.json
   ├── tafseers.json
   └── users.json
   ```

### Gmail Email Service

1. **Create a Google Cloud Project**
2. **Enable the Gmail API**
3. **Create OAuth2 credentials**
4. **Generate refresh token**

### Environment Variables

See `.env.example` for all available configuration options.

## 📱 Usage

### For Readers
- **Navigate**: Use arrow keys or on-screen controls
- **Search**: Use the search bar for Arabic text or translations
- **Bookmark**: Save your current position
- **Customize**: Adjust font size, themes, and display options

### For Administrators
- **Content Management**: Add/edit translations, tafseers, and word analysis
- **User Management**: Manage user accounts and permissions
- **Analytics**: View usage statistics and user engagement
- **Export**: Download data in various formats

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom Mushaf themes
- **Database**: GitHub repository with enhanced SDK
- **Authentication**: Custom auth system with email verification
- **State Management**: React Query for server state
- **Animations**: Framer Motion for smooth transitions
- **Internationalization**: Custom i18n solution

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── mushaf/            # Mushaf-specific components
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Layout components
│   └── providers/         # Context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── database.ts        # GitHub SDK integration
│   └── config.ts          # App configuration
├── types/                 # TypeScript type definitions
└── styles/                # Global styles and themes
```

## 🔌 API

### Database Operations
```typescript
// Get all surahs
const surahs = await db.getSurahs()

// Get ayahs by surah
const ayahs = await db.getAyahsBySurah('1')

// Search in Quran
const results = await db.searchAyahs('بسم الله')

// Add translation
await db.addTranslation({
  ayahId: 'ayah-1',
  language: 'en',
  translation: 'In the name of Allah',
  translator: 'Sahih International'
})
```

### Authentication
```typescript
// Register user
await db.register(email, password, profile)

// Login user
const token = await db.login(email, password)

// Verify OTP
const sessionToken = await db.verifyLoginOTP(email, otp)
```

## 🎨 Customization

### Adding New Languages
1. Add language code to `supportedLanguages` in config
2. Add translations to the i18n provider
3. Configure RTL support if needed

### Adding New Translations
1. Create translation records in the database
2. Update the translations configuration
3. Add UI language selector

### Custom Tajweed Rules
1. Define new rules in `tajweedRules` config
2. Add corresponding colors to Tailwind config
3. Implement rule detection logic

## 📊 Performance

- **Optimized Loading**: Code splitting and lazy loading
- **Caching Strategy**: React Query with smart cache invalidation
- **Image Optimization**: Next.js Image component with WebP support
- **Bundle Size**: Tree-shaking and minimal dependencies
- **Lighthouse Score**: 95+ across all metrics

## 🔒 Security

- **Input Validation**: Server-side validation for all inputs
- **XSS Protection**: Sanitized HTML output
- **CSRF Protection**: Built-in Next.js protection
- **Rate Limiting**: API rate limiting for abuse prevention
- **Secure Headers**: Security headers for XSS and clickjacking protection

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run end-to-end tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

## 📦 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker
```bash
# Build image
docker build -t quran-mushaf .

# Run container
docker run -p 3000:3000 quran-mushaf
```

### Manual Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation for new features
- Follow the existing code style

### Getting Help
- 📧 Email: support@quran
- 💬mushaf.com Discord: [Join our community](https://discord.gg/quranmushaf)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/quran-mushaf-app/issues)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **King Fahd Complex** for the beautiful Mushaf layout
- **Quran.com API** for additional data sources
- **Uthman Taha** for the masterful calligraphy
- **Open Source Community** for the amazing tools and libraries

## 📈 Roadmap

- [ ] Mobile app (React Native)
- [ ] Audio synchronization with text
- [ ] AI-powered verse recommendations
- [ ] Collaborative tafseer editing
- [ ] Advanced search with semantic analysis
- [ ] Offline download support
- [ ] Integration with Quran memorization apps

---

<div align="center">

**Made with ❤️ for the Muslim Ummah**

[Website](https://quranmushaf.com) • [Documentation](https://docs.quranmushaf.com) • [Support](mailto:support@quranmushaf.com)

</div>