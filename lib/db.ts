import { Dish, GalleryPhoto } from "@/types";
import { supabase } from "./supabase";

// Dish operations
export async function getAllDishes(): Promise<Dish[]> {
  const { data, error } = await supabase
    .from('dishes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching dishes:', error);
    return [];
  }

  // Convert snake_case to camelCase
  return (data || []).map(row => ({
    id: row.id,
    dishName: row.dish_name,
    dietaryTags: row.dietary_tags || [],
    generatedImageUrl: row.generated_image_url,
    claimedBy: row.claimed_by,
    reactions: row.reactions || {},
    createdAt: row.created_at,
    year: row.year,
  }));
}

export async function getDish(id: string): Promise<Dish | null> {
  const { data, error } = await supabase
    .from('dishes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    dishName: data.dish_name,
    dietaryTags: data.dietary_tags || [],
    generatedImageUrl: data.generated_image_url,
    claimedBy: data.claimed_by,
    reactions: data.reactions || {},
    createdAt: data.created_at,
    year: data.year,
  };
}

export async function createDish(dish: Dish): Promise<void> {
  const { error } = await supabase
    .from('dishes')
    .insert({
      id: dish.id,
      dish_name: dish.dishName,
      dietary_tags: dish.dietaryTags,
      generated_image_url: dish.generatedImageUrl,
      claimed_by: dish.claimedBy,
      reactions: dish.reactions,
      created_at: dish.createdAt,
      year: dish.year,
    });

  if (error) {
    console.error('Error creating dish:', error);
    throw new Error('Failed to create dish');
  }
}

export async function updateDish(id: string, updates: Partial<Dish>): Promise<void> {
  const dbUpdates: any = {};

  if (updates.dishName !== undefined) dbUpdates.dish_name = updates.dishName;
  if (updates.dietaryTags !== undefined) dbUpdates.dietary_tags = updates.dietaryTags;
  if (updates.generatedImageUrl !== undefined) dbUpdates.generated_image_url = updates.generatedImageUrl;
  if (updates.claimedBy !== undefined) dbUpdates.claimed_by = updates.claimedBy;
  if (updates.reactions !== undefined) dbUpdates.reactions = updates.reactions;
  if (updates.createdAt !== undefined) dbUpdates.created_at = updates.createdAt;
  if (updates.year !== undefined) dbUpdates.year = updates.year;

  const { error } = await supabase
    .from('dishes')
    .update(dbUpdates)
    .eq('id', id);

  if (error) {
    console.error('Error updating dish:', error);
    throw new Error('Failed to update dish');
  }
}

export async function deleteDish(id: string): Promise<void> {
  const { error } = await supabase
    .from('dishes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting dish:', error);
    throw new Error('Failed to delete dish');
  }
}

// Gallery operations
export async function getAllGalleryPhotos(): Promise<GalleryPhoto[]> {
  const { data, error } = await supabase
    .from('gallery_photos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching gallery photos:', error);
    return [];
  }

  return (data || []).map(row => ({
    id: row.id,
    personName: row.person_name,
    originalPhotoUrl: row.original_photo_url,
    thanksgivingPhotoUrl: row.thanksgiving_photo_url,
    createdAt: row.created_at,
    year: row.year,
  }));
}

export async function getGalleryPhoto(id: string): Promise<GalleryPhoto | null> {
  const { data, error } = await supabase
    .from('gallery_photos')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    personName: data.person_name,
    originalPhotoUrl: data.original_photo_url,
    thanksgivingPhotoUrl: data.thanksgiving_photo_url,
    createdAt: data.created_at,
    year: data.year,
  };
}

export async function createGalleryPhoto(photo: GalleryPhoto): Promise<void> {
  const { error } = await supabase
    .from('gallery_photos')
    .insert({
      id: photo.id,
      person_name: photo.personName,
      original_photo_url: photo.originalPhotoUrl,
      thanksgiving_photo_url: photo.thanksgivingPhotoUrl,
      created_at: photo.createdAt,
      year: photo.year,
    });

  if (error) {
    console.error('Error creating gallery photo:', error);
    throw new Error('Failed to create gallery photo');
  }
}

export async function updateGalleryPhoto(id: string, updates: Partial<GalleryPhoto>): Promise<void> {
  const dbUpdates: any = {};

  if (updates.personName !== undefined) dbUpdates.person_name = updates.personName;
  if (updates.originalPhotoUrl !== undefined) dbUpdates.original_photo_url = updates.originalPhotoUrl;
  if (updates.thanksgivingPhotoUrl !== undefined) dbUpdates.thanksgiving_photo_url = updates.thanksgivingPhotoUrl;
  if (updates.createdAt !== undefined) dbUpdates.created_at = updates.createdAt;
  if (updates.year !== undefined) dbUpdates.year = updates.year;

  const { error } = await supabase
    .from('gallery_photos')
    .update(dbUpdates)
    .eq('id', id);

  if (error) {
    console.error('Error updating gallery photo:', error);
    throw new Error('Failed to update gallery photo');
  }
}

export async function deleteGalleryPhoto(id: string): Promise<void> {
  const { error } = await supabase
    .from('gallery_photos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting gallery photo:', error);
    throw new Error('Failed to delete gallery photo');
  }
}
