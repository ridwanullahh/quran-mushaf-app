# 🚀 Quran Mushaf App - Deployment Guide

## Bismillah Ar-Rahman Ar-Roheem

This guide will help you deploy the Quran Mushaf application to production.

## 📋 Prerequisites

Before deploying, ensure you have:

1. **GitHub Repository** for database storage
2. **GitHub Personal Access Token** with repo permissions
3. **Domain Name** (optional but recommended)
4. **Vercel Account** (for easy deployment)

## 🔧 Environment Configuration

### 1. GitHub Database Setup

Create a GitHub repository to serve as your database:

```bash
# Create repository on GitHub
# Repository name: quran-database-repo
# Make it private for security
```

### 2. Environment Variables

Create `.env.local` file in your project root:

```env
# Database Configuration
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_REPO_OWNER=your-github-username
GITHUB_REPO_NAME=quran-database-repo
GITHUB_DB_REPO=quran-database-repo
NEXT_PUBLIC_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_GITHUB_OWNER=your-github-username
NEXT_PUBLIC_GITHUB_REPO=quran-database-repo
NEXT_PUBLIC_GITHUB_BRANCH=main

# Email Configuration (optional)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
JWT_SECRET=your-super-secret-jwt-key-here
```

### 3. Generate GitHub Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Select scopes:
   - `repo` (Full control of private repositories)
   - `user` (Update ALL user data)
4. Copy the generated token

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel

# Follow the prompts
# - Link to existing project? No
# - Project name: quran-mushaf
# - Directory: ./
# - Override settings? No
```

### Option 2: Netlify

```bash
# Build the project
npm run build

# Deploy to Netlify
# Upload the .next folder to Netlify
```

### Option 3: Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Database Initialization

After deployment, initialize the database:

```bash
# Run database initialization
npm run db:init

# Seed with sample data
npm run db:seed
```

## 🔒 Security Considerations

### 1. Environment Variables
- Never commit `.env.local` to git
- Use Vercel's environment variables for production
- Rotate tokens regularly

### 2. Database Security
- Use private GitHub repositories
- Limit token permissions to required scopes
- Enable GitHub's security features

### 3. Application Security
- Enable HTTPS only
- Set up proper CORS headers
- Implement rate limiting

## 📱 Progressive Web App (PWA)

The app is configured as a PWA. To enable:

1. **Service Worker**: Already configured in `layout.tsx`
2. **Manifest**: Ensure `public/manifest.json` exists
3. **Icons**: Add icons to `public/` directory

```json
{
  "name": "Quran Mushaf",
  "short_name": "Quran Mushaf",
  "description": "Digital Quran with word-by-word analysis",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#059669",
  "background_color": "#fef7ed",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🚀 Performance Optimization

### 1. Build Optimization
```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
  },
  compress: true,
  poweredByHeader: false,
}
```

### 2. Image Optimization
- Use Next.js Image component for all images
- Implement proper image formats (WebP, AVIF)
- Use responsive images

### 3. Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer
```

## 📈 Monitoring & Analytics

### 1. Error Tracking
```bash
# Install Sentry
npm install @sentry/nextjs
```

### 2. Analytics
```javascript
// Add to layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'
```

## 🌍 Custom Domain Setup

### 1. DNS Configuration
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.61
```

### 2. SSL Certificate
- Vercel provides automatic SSL
- Custom domains supported
- HTTP to HTTPS redirect

## 🔄 Continuous Deployment

### 1. GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🛠 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check GitHub token validity
   - Verify repository permissions
   - Ensure repository exists

2. **Build Failures**
   - Check TypeScript errors: `npm run type-check`
   - Verify all dependencies installed
   - Clear `.next` folder and rebuild

3. **Performance Issues**
   - Enable static generation where possible
   - Implement proper caching
   - Optimize images and assets

## 📞 Support

### Getting Help
- Check the [Implementation Progress](./IMPLEMENTATION_PROGRESS.md) document
- Review component documentation
- Check browser console for errors

### Feature Requests
- Word analysis improvements
- Additional languages
- Audio recitation integration
- Mobile app versions

## ✅ Deployment Checklist

- [ ] Environment variables configured
- [ ] GitHub repository created and configured
- [ ] Database initialized with sample data
- [ ] PWA manifest and icons configured
- [ ] Custom domain set up (optional)
- [ ] SSL certificate enabled
- [ ] Error monitoring configured
- [ ] Performance monitoring enabled
- [ ] Backup strategy implemented
- [ ] Security headers configured

## 🎯 Success Metrics

Monitor these key metrics:

1. **Performance**
   - Page Load Time: < 3 seconds
   - First Contentful Paint: < 1.5 seconds
   - Time to Interactive: < 4 seconds

2. **User Experience**
   - Bounce Rate: < 40%
   - Session Duration: > 2 minutes
   - Page Views per Session: > 3

3. **Technical**
   - Error Rate: < 1%
   - Database Response Time: < 500ms
   - Uptime: > 99.9%

## 🤲 Bismillah

Your Quran Mushaf application is now ready for deployment! May Allah accept this work and make it beneficial for all Muslims worldwide.

### Quick Deploy Command
```bash
# One-line deployment
vercel --prod --token=$VERCEL_TOKEN
```

**May Allah bless this endeavor and make it a source of guidance and knowledge for His servants.**
