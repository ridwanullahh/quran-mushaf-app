/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    
    // Add path alias resolution for @ imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').join(__dirname, 'src'),
      '@/components': require('path').join(__dirname, 'src', 'components'),
      '@/hooks': require('path').join(__dirname, 'src', 'hooks'),
      '@/lib': require('path').join(__dirname, 'src', 'lib'),
      '@/types': require('path').join(__dirname, 'src', 'types'),
      '@/styles': require('path').join(__dirname, 'src', 'styles'),
    };
    
    return config;
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },
  images: {
    domains: ['res.cloudinary.com', 'github.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/github/:path*',
        destination: '/api/github/:path*',
      },
    ];
  },
  // Environment variables validation
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Quran Mushaf',
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    NEXT_PUBLIC_DEFAULT_LANGUAGE: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
    NEXT_PUBLIC_SUPPORTED_LANGUAGES: process.env.NEXT_PUBLIC_SUPPORTED_LANGUAGES || 'en,ar,ur,id,tr,fr,es',
    NEXT_PUBLIC_GITHUB_OWNER: process.env.GITHUB_OWNER,
    NEXT_PUBLIC_GITHUB_REPO: process.env.GITHUB_REPO,
    NEXT_PUBLIC_GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    NEXT_PUBLIC_GITHUB_BRANCH: process.env.GITHUB_BRANCH || 'main',
    GMAIL_CLIENT_ID: process.env.GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET: process.env.GMAIL_CLIENT_SECRET,
    GMAIL_REFRESH_TOKEN: process.env.GMAIL_REFRESH_TOKEN,
    GMAIL_USER: process.env.GMAIL_USER,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
};

module.exports = nextConfig;