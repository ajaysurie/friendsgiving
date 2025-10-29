export interface Dish {
  id: string;
  dishName: string;
  dietaryTags: string[];
  generatedImageUrl: string;
  claimedBy: string | null;
  reactions: { [emoji: string]: number };
  createdAt: number;
  year?: number; // Optional for now, will be used in future years
}

export interface GalleryPhoto {
  id: string;
  personName: string;
  originalPhotoUrl: string;
  thanksgivingPhotoUrl: string | null;
  createdAt: number;
  year?: number; // Optional for now, will be used in future years
}

export const DIETARY_TAGS = [
  "vegetarian",
  "vegan",
  "gluten-free",
  "dairy-free",
  "nut-free",
] as const;

export type DietaryTag = typeof DIETARY_TAGS[number];
