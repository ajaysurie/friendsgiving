import { Dish, GalleryPhoto } from "@/types";

// Use local mock KV if Vercel KV is not configured
let kv: any;
if (process.env.KV_REST_API_URL) {
  kv = require("@vercel/kv").kv;
} else {
  console.log("Using local in-memory KV (no persistence)");
  kv = require("./kv-local").localKV;
}

// Dish operations
export async function getAllDishes(): Promise<Dish[]> {
  const dishes = await kv.hgetall<Record<string, Dish>>("dishes");
  if (!dishes) return [];
  return Object.values(dishes).sort((a, b) => b.createdAt - a.createdAt);
}

export async function getDish(id: string): Promise<Dish | null> {
  return await kv.hget<Dish>("dishes", id);
}

export async function createDish(dish: Dish): Promise<void> {
  await kv.hset("dishes", { [dish.id]: dish });
}

export async function updateDish(id: string, updates: Partial<Dish>): Promise<void> {
  const dish = await getDish(id);
  if (!dish) throw new Error("Dish not found");
  await kv.hset("dishes", { [id]: { ...dish, ...updates } });
}

export async function deleteDish(id: string): Promise<void> {
  await kv.hdel("dishes", id);
}

// Gallery operations
export async function getAllGalleryPhotos(): Promise<GalleryPhoto[]> {
  const photos = await kv.hgetall<Record<string, GalleryPhoto>>("gallery");
  if (!photos) return [];
  return Object.values(photos).sort((a, b) => b.createdAt - a.createdAt);
}

export async function getGalleryPhoto(id: string): Promise<GalleryPhoto | null> {
  return await kv.hget<GalleryPhoto>("gallery", id);
}

export async function createGalleryPhoto(photo: GalleryPhoto): Promise<void> {
  await kv.hset("gallery", { [photo.id]: photo });
}

export async function updateGalleryPhoto(id: string, updates: Partial<GalleryPhoto>): Promise<void> {
  const photo = await getGalleryPhoto(id);
  if (!photo) throw new Error("Gallery photo not found");
  await kv.hset("gallery", { [id]: { ...photo, ...updates } });
}
