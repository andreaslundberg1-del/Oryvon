# Vercel Deployment Guide

## Prerequisites
- GitHub account with project pushed
- Vercel account
- Supabase project (if using Supabase)

## Step-by-Step Vercel Deployment

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Import Project in Vercel

1. Go to [vercel.com](https://vercel.com) and log in
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Find and select your `cinematic-timeline` repository
5. Click **"Import"**

### 3. Configure Project Settings

#### Framework Preset
- **Framework Preset**: Next.js (should auto-detect)
- **Root Directory**: `./` (leave as is)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

#### Environment Variables
Click **"Environment Variables"** and add:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

**To get Supabase credentials:**
1. Go to [supabase.com](https://supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy Project URL and anon/public key

### 4. Deploy

Click **"Deploy"** button at the bottom.

Vercel will:
- Install dependencies
- Build the project
- Deploy to edge network

### 5. Configure Custom Domain (Optional)

1. After deployment, go to **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `yourdomain.com`)
4. Update DNS records as shown:
   - **A Record**: `76.76.21.21`
   - **CNAME**: `cname.vercel-dns.com`
5. Wait for DNS propagation (5-60 minutes)

### 6. Enable Automatic Deployments

1. Go to **Settings** → **Git**
2. Ensure **"Automatic Deployment** is enabled
3. Choose branch: `main`
4. Now every push to main triggers auto-deploy

### 7. Production Optimizations

The project is already configured with:
- **Image optimization**: AVIF/WebP formats
- **Compression**: Enabled
- **Standalone output**: For Docker/container deployments
- **Security headers**: X-Frame-Options, X-XSS-Protection
- **Cache headers**: For images (1 year)

### 8. Monitor Deployment

1. Go to **Deployments** tab
2. View build logs if errors occur
3. Check **Analytics** for performance metrics

## Troubleshooting

### Build Errors
- Check **Build Logs** in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify environment variables are set

### Environment Variables Not Working
- Variables must start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding variables
- Check variable names match exactly

### Images Not Loading
- Ensure `next.config.ts` has correct image domains
- Check Supabase bucket permissions
- Verify image paths in code

### Supabase Connection Issues
- Verify SUPABASE_URL and ANON_KEY are correct
- Check Supabase project is active
- Ensure RLS policies allow public access where needed

## Post-Deployment Checklist

- [ ] Site loads at Vercel URL
- [ ] All images display correctly
- [ ] Supabase connection works
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Analytics enabled
- [ ] Auto-deploy from Git working

## Vercel CLI Alternative

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```
