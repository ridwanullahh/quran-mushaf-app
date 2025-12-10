/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Quran App Color Scheme
        cream: {
          50: '#fefdfb',
          100: '#fefcf7',
          200: '#fdf8ed',
          300: '#faf3e0',
          400: '#f5ebd1',
          500: '#ede0bd',
          600: '#e3d1a5',
          700: '#d4be8c',
          800: '#c1a373',
          900: '#a88a5a',
        },
        ink: {
          50: '#f8f9fa',
          100: '#f1f3f4',
          200: '#e8eaed',
          300: '#dadce0',
          400: '#bdc1c6',
          500: '#9aa0a6',
          600: '#80868b',
          700: '#5f6368',
          800: '#3c4043',
          900: '#202124',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Tajweed Color Coding
        tajweed: {
          normal: '#000000',
          ikhfah: '#0066cc',
          idgham: '#cc6600',
          iqlab: '#6600cc',
          ghunna: '#cc0066',
          madd: '#00cc66',
          qalqalah: '#cc0000',
          tanween: '#666666',
          sakin: '#999999',
          shadda: '#333333',
          waqf: '#cc9900',
        },
        // UI Colors
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
      },
      fontFamily: {
        'arabic': ['Amiri', 'Scheherazade New', 'Times New Roman', 'serif'],
        'arabic-bold': ['Amiri', 'bold', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'page-turn': 'pageTurn 0.6s ease-in-out',
        'word-highlight': 'wordHighlight 2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pageTurn: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(-90deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
        wordHighlight: {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: '#fef3c7' },
        },
      },
      boxShadow: {
        'mushaf': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'mushaf-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'mushaf-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'inner-mushaf': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      backdropBlur: {
        xs: '2px',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      aspectRatio: {
        'mushaf': '3/4', // Standard Mushaf page ratio
        'mushaf-wide': '4/3',
      },
      backgroundImage: {
        'mushaf-texture': "url('/textures/paper-texture.png')",
        'mushaf-border': "url('/patterns/border-pattern.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    // Custom plugin for Tajweed colors
    function({ addUtilities }) {
      const newUtilities = {
        '.tajweed-normal': { color: '#000000' },
        '.tajweed-ikhfah': { color: '#0066cc' },
        '.tajweed-idgham': { color: '#cc6600' },
        '.tajweed-iqlab': { color: '#6600cc' },
        '.tajweed-ghunna': { color: '#cc0066' },
        '.tajweed-madd': { color: '#00cc66' },
        '.tajweed-qalqalah': { color: '#cc0000' },
        '.tajweed-tanween': { color: '#666666' },
        '.tajweed-sakin': { color: '#999999' },
        '.tajweed-shadda': { color: '#333333' },
        '.tajweed-waqf': { color: '#cc9900' },
        '.text-arabic': {
          fontFamily: 'Amiri, Scheherazade New, Times New Roman, serif',
          direction: 'rtl',
          textAlign: 'right',
        },
        '.arabic-numerals': {
          fontFeatureSettings: '"lnum" 1',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}