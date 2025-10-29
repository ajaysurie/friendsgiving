# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Friendsgiving Dish Tracker - A delightful web app for coordinating Friendsgiving celebrations with AI-powered image generation. Features include:
- Admin dashboard for pre-populating dishes with AI-generated images
- Guest dish claiming system with emoji reactions
- Photo gallery with AI-powered "Thanksgiving-ification" of family photos

## Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Thanksgiving color palette
- **Database**: Vercel KV (Redis) for dish and gallery data
- **Storage**: Vercel Blob for uploaded gallery photos
- **AI**: Google Gemini API (Imagen model) for image generation
- **Deployment**: Vercel

### Directory Structure
```
app/
├── api/               # API routes
│   ├── admin/        # Admin endpoints (add/edit/delete dishes)
│   ├── dishes/       # Dish endpoints (get all, claim, react)
│   └── gallery/      # Gallery endpoints (upload, thanksgiving-ify)
├── admin/            # Admin page
├── gallery/          # Gallery page
├── page.tsx          # Home page (dish claiming)
├── layout.tsx        # Root layout
└── globals.css       # Global styles with animations

components/           # React components
├── DishCard.tsx
├── ClaimDishModal.tsx
├── GalleryUpload.tsx
├── GalleryPhotoCard.tsx
└── LoadingSpinner.tsx

lib/
├── kv.ts            # Vercel KV database helpers
└── gemini.ts        # Google Gemini AI helpers

types/
└── index.ts         # TypeScript interfaces (Dish, GalleryPhoto)
```

### Data Models
- **Dish**: id, dishName, dietaryTags, generatedImageUrl, claimedBy, reactions, createdAt
- **GalleryPhoto**: id, personName, originalPhotoUrl, thanksgivingPhotoUrl, createdAt

## Development Commands

```bash
npm run dev      # Start development server on localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Environment Variables

Required for local development and production:
```
GOOGLE_AI_API_KEY=<your-google-ai-api-key>

# Vercel KV (auto-provisioned in production)
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=

# Vercel Blob (auto-provisioned in production)
BLOB_READ_WRITE_TOKEN=
```

## Key Features

1. **Admin Interface** (/admin)
   - Add dishes with automatic AI image generation
   - Manage existing dishes (edit/delete)
   - View claim status

2. **Dish Claiming** (/)
   - Browse dishes with AI-generated images
   - Claim dishes by entering name
   - Add emoji reactions

3. **Photo Gallery** (/gallery)
   - Upload family photos
   - "Thanksgiving-ify" photos with AI
   - View before/after comparisons

## Design System

Warm Thanksgiving color palette:
- Primary: Burnt orange (#E87722), Pumpkin (#FF7518)
- Secondary: Deep red (#C1440E), Cranberry (#9D2235)
- Accents: Golden yellow (#F4AB4A), Warm cream (#FFF8E7)
- Backgrounds: Soft beige (#FAF7F0), Light peach (#FFE5CC)
