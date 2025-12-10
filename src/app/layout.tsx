import './globals.css'
import type { Metadata } from 'next'
import { Inter, Amiri } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { I18nProvider } from '@/components/providers/i18n-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import { QuranDataProvider } from '@/contexts/quran-data-context'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const amiri = Amiri({ 
  weight: ['400', '700'],
  subsets: ['arabic'],
  variable: '--font-amiri',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Quran Mushaf - Digital Quran with Physical Book Feel',
  description: 'Feature-rich digital Quran application with word-by-word analysis, multiple translations, tafseers, and authentic Mushaf layout',
  keywords: 'Quran, Mushaf, Arabic, Islamic, Tafseer, Translation, Tajweed',
  authors: [{ name: 'MiniMax Agent' }],
  creator: 'MiniMax Agent',
  publisher: 'MiniMax Agent',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'ar': '/ar',
      'ur': '/ur',
      'id': '/id',
      'tr': '/tr',
      'fr': '/fr',
      'es': '/es',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Quran Mushaf - Digital Quran with Physical Book Feel',
    description: 'Feature-rich digital Quran application with word-by-word analysis, multiple translations, tafseers, and authentic Mushaf layout',
    siteName: 'Quran Mushaf',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Quran Mushaf - Digital Quran Application',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quran Mushaf - Digital Quran with Physical Book Feel',
    description: 'Feature-rich digital Quran application with word-by-word analysis, multiple translations, tafseers, and authentic Mushaf layout',
    images: ['/og-image.jpg'],
    creator: '@quranmushaf',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={`${inter.variable} ${amiri.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#059669" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Quran Mushaf" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Quran Mushaf" />
        <meta name="msapplication-TileColor" content="#059669" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className="min-h-screen bg-cream-50 font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="auto"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <I18nProvider>
              <AuthProvider>
                <QuranDataProvider>
                  <div className="relative flex min-h-screen flex-col">
                  <div id="skip-to-content" className="sr-only">
                    <a
                      href="#main-content"
                      className="focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      Skip to main content
                    </a>
                  </div>
                  
                  <main id="main-content" className="flex-1">
                    {children}
                  </main>

                  <div id="portal-root" />
                  </div>
                </QuranDataProvider>
                
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    className: 'bg-white border border-cream-200 text-ink-800 shadow-lg',
                    success: {
                      iconTheme: {
                        primary: '#10b981',
                        secondary: '#ffffff',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#ffffff',
                      },
                    },
                  }}
                />
              </AuthProvider>
            </I18nProvider>
          </QueryProvider>
        </ThemeProvider>

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('SW registered: ', registration);
                  }).catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}