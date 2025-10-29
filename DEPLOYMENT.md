# Deployment Guide

## Deploy to Vercel

### 1. Initial Setup

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Deploy from the project directory
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (select your account)
- Link to existing project? **No**
- Project name: **friendsgiving** (or your preference)
- Directory: **./**
- Override settings? **No**

### 2. Set Up Vercel KV (Redis Database)

1. Go to your project dashboard on [vercel.com](https://vercel.com)
2. Click on the **Storage** tab
3. Click **Create Database** → **KV**
4. Name it `friendsgiving-kv` (or your preference)
5. Click **Create**
6. The environment variables will be automatically added to your project

### 3. Set Up Vercel Blob (Image Storage)

1. In your project dashboard, go to **Storage** tab
2. Click **Create Database** → **Blob**
3. Name it `friendsgiving-blob`
4. Click **Create**
5. The environment variables will be automatically added to your project

### 4. Add Google Gemini API Key

1. In your project dashboard, go to **Settings** → **Environment Variables**
2. Add a new variable:
   - **Name**: `GOOGLE_AI_API_KEY`
   - **Value**: `AIzaSyDEGJZYuzn4tv9WTUkHDIWYW-_Uyq3yrlU`
   - **Environment**: Production, Preview, Development (select all)
3. Click **Save**

### 5. Deploy Production

```bash
vercel --prod
```

Your app will be live at `https://your-project.vercel.app`!

## Resetting the Database

### Option 1: Using Vercel Dashboard (Easiest)

1. Go to your project on [vercel.com](https://vercel.com)
2. Click **Storage** tab
3. Click on your KV database
4. Click **Data** tab
5. You can delete individual keys or use the **Flush Database** button to delete everything

### Option 2: Using Vercel CLI

```bash
# List all keys
vercel env pull .env.production
npx @vercel/kv-cli --url $KV_REST_API_URL scan 0

# Delete all data (use with caution!)
npx @vercel/kv-cli --url $KV_REST_API_URL flushdb
```

### Option 3: Create a Fresh Database

1. Go to **Storage** tab in Vercel dashboard
2. Delete the old KV database
3. Create a new one
4. Redeploy your app

**Note:** Resetting is instant and completely safe. All dishes, claims, and photos will be cleared. The Blob storage (images) can be managed separately from the Blob dashboard if needed.

## For Next Year

When you want to reset for FriendsGiving 2026:
1. Simply flush the KV database (Option 1 above)
2. Optionally delete old images from Blob storage to save space
3. That's it! The app is ready for the new year.

The `year` field is already built into the data models if you want to filter by year in the future.
