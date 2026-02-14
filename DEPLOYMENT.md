# Mavuno Deployment Guide

Complete step-by-step guide to deploy Mavuno to production.

## Pre-Deployment Checklist

- [ ] Node.js 18+ installed
- [ ] Firebase project created
- [ ] Environment variables configured
- [ ] All features tested locally
- [ ] Build process successful (`npm run build`)

## Option 1: Vercel (Recommended for Next.js)

### Why Vercel?
- Built by Next.js creators
- Zero-config deployment
- Automatic HTTPS
- Global CDN
- Generous free tier

### Steps

1. **Create Vercel Account**
   - Visit [vercel.com](https://vercel.com)
   - Sign up with GitHub/GitLab/Bitbucket

2. **Install Vercel CLI** (Optional)
   ```bash
   npm i -g vercel
   ```

3. **Deploy via CLI**
   ```bash
   cd mavuno-app
   vercel
   ```
   Follow the prompts:
   - Link to existing project? No
   - Project name: mavuno-app
   - Directory: ./
   - Build settings: Default (auto-detected)

4. **Add Environment Variables**
   - Go to Vercel Dashboard → Your Project
   - Settings → Environment Variables
   - Add all variables from `.env.local`:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
     NEXT_PUBLIC_FIREBASE_PROJECT_ID
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
     NEXT_PUBLIC_FIREBASE_APP_ID
     NEXT_PUBLIC_OPENWEATHER_API_KEY
     ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

6. **Custom Domain** (Optional)
   - Vercel Dashboard → Domains
   - Add your domain (e.g., mavuno.co.ke)
   - Update DNS records as instructed

### Vercel via GitHub

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/mavuno-app.git
   git push -u origin main
   ```

2. **Import in Vercel**
   - Vercel Dashboard → Add New Project
   - Import from GitHub
   - Select mavuno-app repository
   - Configure environment variables
   - Deploy

3. **Automatic Deployments**
   - Every push to main = production deployment
   - Pull requests = preview deployments

## Option 2: Netlify

### Why Netlify?
- Easy deployment
- Continuous deployment from Git
- Form handling
- Serverless functions

### Steps

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

3. **Initialize Netlify**
   ```bash
   netlify init
   ```

4. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

5. **Add Environment Variables**
   ```bash
   netlify env:set NEXT_PUBLIC_FIREBASE_API_KEY "your_value"
   # Repeat for all env variables
   ```

6. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Option 3: Firebase Hosting

### Why Firebase Hosting?
- Free tier available
- Integrated with Firebase services
- Global CDN
- Automatic SSL

### Steps

1. **Install Firebase CLI**
   ```bash
   npm i -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase**
   ```bash
   firebase init hosting
   ```
   Configuration:
   - Use existing project: Select your Firebase project
   - Public directory: `out`
   - Single-page app: Yes
   - Automatic builds: No

4. **Update next.config.js**
   Add export configuration:
   ```javascript
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
     // ... rest of config
   }
   ```

5. **Build Static Export**
   ```bash
   npm run build
   ```

6. **Deploy**
   ```bash
   firebase deploy --only hosting
   ```

## Option 4: Railway

### Why Railway?
- Simple deployment
- Automatic SSL
- Environment variable management
- Database hosting available

### Steps

1. **Create Railway Account**
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Dashboard → New Project
   - Deploy from GitHub repo

3. **Configure**
   - Framework: Next.js (auto-detected)
   - Add environment variables
   - Deploy

## Option 5: DigitalOcean App Platform

### Why DigitalOcean?
- Full control
- Scalable
- Database options
- Professional hosting

### Steps

1. **Create Account**
   - Visit [digitalocean.com](https://www.digitalocean.com)
   - Sign up and verify

2. **Create App**
   - Apps → Create App
   - Connect GitHub repository
   - Select mavuno-app

3. **Configure**
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - HTTP Port: 3000

4. **Environment Variables**
   - Add all Firebase and API keys

5. **Deploy**
   - Review and deploy

## Post-Deployment Steps

### 1. Update Firebase Configuration

Add your production domain to Firebase:
- Firebase Console → Authentication → Settings
- Authorized domains → Add domain

### 2. Test the Application

- [ ] Homepage loads
- [ ] Authentication works
- [ ] All tabs functional
- [ ] Dark/light mode works
- [ ] Mobile responsive
- [ ] WhatsApp links work
- [ ] Charts render correctly

### 3. Set Up Monitoring

**Google Analytics**
1. Create GA4 property
2. Add tracking ID to environment variables
3. Update layout.tsx with GA script

**Sentry** (Error Tracking)
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 4. Performance Optimization

Run Lighthouse audit:
- Chrome DevTools → Lighthouse
- Target: 90+ on all metrics

Optimize if needed:
- Compress images
- Enable caching
- Minimize JavaScript
- Use CDN for assets

### 5. SEO Configuration

Update `app/layout.tsx` metadata:
```typescript
export const metadata: Metadata = {
  title: 'Mavuno - Agricultural Intelligence',
  description: 'Real-time market prices and farming insights',
  keywords: ['Kenya agriculture', 'farm prices', 'weather'],
  // Add more SEO metadata
}
```

Create `robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
```

### 6. SSL Certificate

Most platforms provide automatic HTTPS. If not:
- Use Let's Encrypt
- Configure SSL in hosting settings

### 7. CDN Configuration

Enable CDN for static assets:
- Images
- CSS/JS bundles
- Fonts

### 8. Backup Strategy

- Daily Firestore backups
- Code repository backups
- Environment variable documentation

## Troubleshooting

### Build Fails

**Error**: Module not found
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error**: Environment variables missing
- Double-check all variables are set
- Restart build after adding variables

### Authentication Issues

- Verify Firebase domain whitelist
- Check API keys are correct
- Ensure Firebase rules allow access

### Performance Issues

- Enable Next.js image optimization
- Use lazy loading
- Implement caching headers
- Optimize Firestore queries

## Cost Estimates

### Free Tier Deployment (Hobby Projects)

| Platform | Free Tier |
|----------|-----------|
| Vercel | 100GB bandwidth/month |
| Netlify | 100GB bandwidth/month |
| Firebase Hosting | 10GB storage, 360MB/day downloads |
| Railway | $5 credit/month |

### Production (High Traffic)

Estimated for 10,000 daily users:
- Hosting: $20-50/month
- Firebase: $25-100/month
- Total: ~$50-150/month

## Scaling Considerations

### When to Scale

- Response time > 3 seconds
- Error rate > 1%
- 10,000+ daily active users

### Scaling Strategies

1. **Horizontal Scaling**
   - Multiple server instances
   - Load balancing

2. **Database Optimization**
   - Firestore indexes
   - Query optimization
   - Caching layer (Redis)

3. **CDN Enhancement**
   - Cloudflare
   - AWS CloudFront

4. **Code Optimization**
   - Server-side rendering
   - Static generation
   - API route optimization

## Support

For deployment issues:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Netlify: [netlify.com/support](https://netlify.com/support)
- Firebase: [firebase.google.com/support](https://firebase.google.com/support)

## Final Checklist

- [ ] Application deployed
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Environment variables set
- [ ] Firebase security rules updated
- [ ] Monitoring configured
- [ ] Performance optimized
- [ ] SEO configured
- [ ] Backup strategy in place
- [ ] Documentation updated

---

Happy Deploying! 🚀
