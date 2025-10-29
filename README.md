# 🦃 Friendsgiving Dish Tracker

A delightful web app for coordinating your Friendsgiving celebration! Admins can pre-populate dishes with AI-generated images, guests can claim dishes, and everyone can upload and "Thanksgiving-ify" family photos.

## Features

- **Dish Management**: Admin interface to add dishes with AI-generated images
- **Dish Claiming**: Guests can claim dishes by entering their name
- **Emoji Reactions**: React to dishes with fun emojis
- **Photo Gallery**: Upload family photos and transform them with AI to add Thanksgiving vibes
- **Beautiful UI**: Warm, inviting Thanksgiving color palette with smooth animations

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Vercel KV (Redis)
- **Storage**: Vercel Blob (for gallery photos)
- **AI**: Google Gemini API with Imagen model (nanobanana)
- **Deployment**: Vercel

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- A Vercel account
- Google AI API key (for Gemini)

### Local Development

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd friendsgiving
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your environment variables:
   ```env
   GOOGLE_AI_API_KEY=your_google_ai_api_key_here

   # For local development with Vercel KV, you'll need to set up a Vercel project
   # and link it locally, or use mock data for testing
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Deployment to Vercel

1. Push your code to GitHub

2. Import the project in Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. Configure environment variables in Vercel:
   - Add `GOOGLE_AI_API_KEY` in the Environment Variables section

4. Add Vercel KV storage:
   - Go to your project's "Storage" tab
   - Click "Create Database" → "KV"
   - This will automatically provision and configure Vercel KV

5. Add Vercel Blob storage:
   - Go to your project's "Storage" tab
   - Click "Create Database" → "Blob"
   - This will automatically provision and configure Vercel Blob

6. Deploy!
   - Vercel will automatically deploy on every push to your main branch

## Project Structure

```
friendsgiving/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── admin/        # Admin endpoints (add/edit/delete dishes)
│   │   ├── dishes/       # Dish endpoints (get all, claim, react)
│   │   └── gallery/      # Gallery endpoints (upload, thanksgiving-ify)
│   ├── admin/            # Admin page
│   ├── gallery/          # Gallery page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page (dish claiming)
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── DishCard.tsx      # Dish display card
│   ├── ClaimDishModal.tsx # Modal for claiming dishes
│   ├── GalleryUpload.tsx # Photo upload component
│   ├── GalleryPhotoCard.tsx # Gallery photo display
│   └── LoadingSpinner.tsx # Loading animation
├── lib/                   # Utility functions
│   ├── kv.ts             # Vercel KV database helpers
│   └── gemini.ts         # Google Gemini AI helpers
├── types/                 # TypeScript types
│   └── index.ts          # Shared types (Dish, GalleryPhoto)
└── package.json
```

## Usage

### For Admins

1. Go to `/admin`
2. Enter a dish name (e.g., "Roasted Turkey", "Pumpkin Pie")
3. Select dietary tags if applicable
4. Click "Add Dish" - an AI image will be generated automatically
5. The dish appears on the main page for guests to claim

### For Guests

1. Visit the home page to see all available dishes
2. Click on an unclaimed dish to claim it
3. Enter your name and confirm
4. Add emoji reactions to dishes
5. Go to `/gallery` to upload family photos and "Thanksgiving-ify" them

## Environment Variables

- `GOOGLE_AI_API_KEY`: Your Google AI API key for Gemini image generation
- `KV_*`: Vercel KV variables (auto-provisioned by Vercel)
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob token (auto-provisioned by Vercel)

## API Endpoints

### Admin
- `POST /api/admin/dishes` - Create a new dish with AI-generated image
- `PUT /api/admin/dishes/[id]` - Update a dish
- `DELETE /api/admin/dishes/[id]` - Delete a dish

### Dishes
- `GET /api/dishes` - Get all dishes
- `POST /api/dishes/[id]/claim` - Claim a dish
- `POST /api/dishes/[id]/react` - Add an emoji reaction

### Gallery
- `POST /api/gallery/upload` - Upload a family photo
- `POST /api/gallery/[id]/thanksgiving-ify` - Generate Thanksgiving version
- `GET /api/gallery` - Get all gallery photos

## Contributing

Feel free to open issues or submit pull requests!

## License

MIT
