# Cinematic Timeline

An interactive portal through time, civilizations, and the evolution of worlds. Built with Next.js, React, Three.js, and Supabase.

## Features

- **Cinematic Timeline**: Interactive timeline through different universes and eras
- **3D Visualizations**: Powered by React Three Fiber and Three.js
- **Smooth Animations**: GSAP and Framer Motion for fluid transitions
- **Supabase Integration**: Backend for data management
- **Responsive Design**: Optimized for all screen sizes
- **Custom Cursor**: Interactive cursor with multiple themes

## Tech Stack

- **Framework**: Next.js 16.2.6
- **UI**: React 19.2.4, Tailwind CSS 4
- **3D**: Three.js, React Three Fiber, React Three Drei
- **Animations**: GSAP, Framer Motion
- **Backend**: Supabase
- **Language**: TypeScript

## Prerequisites

- Node.js 18+ installed
- Git installed
- Supabase account (for backend features)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Building for Production

```bash
npm run build
npm start
```

## Git Setup

### Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit"
```

### Connect to GitHub

1. Create a new repository on [GitHub](https://github.com/new)
2. Copy the repository URL
3. Add remote and push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/cinematic-timeline.git
git branch -M main
git push -u origin main
```

## Vercel Deployment

### Step 1: Push to GitHub

Ensure your code is pushed to GitHub (see Git Setup above).

### Step 2: Import in Vercel

1. Go to [vercel.com](https://vercel.com) and log in
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Find and select your `cinematic-timeline` repository
5. Click **"Import"**

### Step 3: Configure Project

**Framework Preset** (auto-detected):
- Framework: Next.js
- Root Directory: `./`
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**Environment Variables**:
Click **"Environment Variables"** and add:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

### Step 4: Deploy

Click **"Deploy"** button at the bottom.

Vercel will:
- Install dependencies
- Build the project
- Deploy to edge network
- Provide a production URL

### Step 5: Custom Domain (Optional)

1. After deployment, go to **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `yourdomain.com`)
4. Update DNS records:
   - **A Record**: `76.76.21.21`
   - **CNAME**: `cname.vercel-dns.com`
5. Wait for DNS propagation (5-60 minutes)

### Step 6: Enable Automatic Deployments

1. Go to **Settings** → **Git**
2. Ensure **"Automatic Deployment"** is enabled
3. Choose branch: `main`
4. Now every push to main triggers auto-deploy

## Project Structure

```
cinematic-timeline/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── contexts/         # React contexts
│   ├── data/            # Static data
│   ├── i18n/            # Internationalization
│   ├── lib/             # Utility functions
│   └── styles/          # Global styles
├── public/              # Static assets
├── .env.example         # Environment variables template
├── next.config.ts       # Next.js configuration
├── vercel.json         # Vercel configuration
└── package.json        # Dependencies
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `NEXT_PUBLIC_SITE_URL` | Your production site URL | Yes |

## Troubleshooting

### Build Errors in Vercel
- Check **Build Logs** in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify environment variables are set correctly

### Images Not Loading
- Ensure `next.config.ts` has correct image domains
- Check Supabase bucket permissions
- Verify image paths in code

### Supabase Connection Issues
- Verify SUPABASE_URL and ANON_KEY are correct
- Check Supabase project is active
- Ensure RLS policies allow public access where needed

## License

Private project.

## Support

For issues and questions, please contact the development team.
