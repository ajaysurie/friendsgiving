# Deployment Guide

## Deploy to Vercel

### 1. Initial Setup

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Deploy from the project directory
vercel --prod --yes
```

Your app will be deployed to Vercel!

### 2. Set Up Supabase Database

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or select an existing one
3. Go to **SQL Editor** in the left sidebar
4. Copy the contents of `supabase-schema.sql` from this repo
5. Paste and run the SQL to create the tables
6. Go to **Project Settings** → **API**
7. Copy the following values:
   - **Project URL** (e.g., https://xxxxx.supabase.co)
   - **anon public** key

### 3. Set Up Environment Variables in Vercel

1. Go to your project dashboard on [vercel.com](https://vercel.com)
2. Click **Settings** → **Environment Variables**
3. Add the following variables:

   **NEXT_PUBLIC_SUPABASE_URL**
   - Value: Your Supabase Project URL
   - Environment: Production, Preview, Development (select all)

   **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Value: Your Supabase anon public key
   - Environment: Production, Preview, Development (select all)

   **GOOGLE_AI_API_KEY**
   - Value: `AIzaSyDEGJZYuzn4tv9WTUkHDIWYW-_Uyq3yrlU`
   - Environment: Production, Preview, Development (select all)

4. Click **Save** for each

### 4. Set Up Vercel Blob (Image Storage)

1. In your Vercel project dashboard, go to **Storage** tab
2. Click **Create Database** → **Blob**
3. Name it `friendsgiving-blob`
4. Click **Create**
5. The BLOB_READ_WRITE_TOKEN environment variable will be automatically added

### 5. Redeploy

```bash
vercel --prod --yes
```

Your app will be live at `https://your-project.vercel.app`!

## Local Development

1. Copy `.env.example` to `.env.local`
2. Add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GOOGLE_AI_API_KEY=your_google_ai_key
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Resetting the Database

### Option 1: Using Supabase Dashboard (Easiest)

1. Go to your Supabase project
2. Click **SQL Editor**
3. Run these commands:
   ```sql
   DELETE FROM gallery_photos;
   DELETE FROM dishes;
   ```

### Option 2: Drop and Recreate Tables

1. Go to **SQL Editor** in Supabase
2. Run:
   ```sql
   DROP TABLE IF EXISTS gallery_photos;
   DROP TABLE IF EXISTS dishes;
   ```
3. Then re-run the `supabase-schema.sql` script

### Option 3: Filter by Year

If you want to keep old data and just start fresh for a new year:
```sql
DELETE FROM dishes WHERE year = 2025;
DELETE FROM gallery_photos WHERE year = 2025;
```

**Note:** Resetting is instant. To also delete images from Vercel Blob, go to the Blob dashboard in Vercel.

## For Next Year

When you want to reset for FriendsGiving 2026:
1. Simply delete data from the current year (see Option 3 above)
2. Optionally delete old images from Blob storage to save space
3. That's it! The app is ready for the new year.

The `year` field is already built into the data models for future multi-year support.
