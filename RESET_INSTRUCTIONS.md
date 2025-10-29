# Resetting for Next Year

When you want to reset the app for the next year's FriendsGiving, follow these steps:

## Option 1: Via Vercel Dashboard (Easiest)

1. Go to your Vercel project dashboard
2. Navigate to **Storage** tab
3. Click on your **KV Database**
4. Click **Data** tab
5. Delete the following keys:
   - `dishes`
   - `gallery`

## Option 2: Via Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Link to your project
vercel link

# Open KV shell
vercel kv

# In the KV shell, run:
DEL dishes
DEL gallery
```

## Option 3: Add Year Filtering (Future Enhancement)

The app already stores a `year` field in each dish and photo. To filter by year:

1. Update `lib/kv.ts` functions to filter by current year:
```typescript
export async function getAllDishes(): Promise<Dish[]> {
  const dishes = await kv.hgetall<Record<string, Dish>>("dishes");
  if (!dishes) return [];
  const currentYear = new Date().getFullYear();
  return Object.values(dishes)
    .filter(dish => dish.year === currentYear)
    .sort((a, b) => b.createdAt - a.createdAt);
}
```

2. Do the same for `getAllGalleryPhotos()`

This way, you don't need to delete data - it will automatically show only the current year's content!

## Quick Start for New Year

1. Simply start using the app - new dishes/photos will automatically have the current year
2. Old data stays in the database for historical purposes
3. If you want a clean slate, use Option 1 or 2 above

That's it! 🎃🦃
