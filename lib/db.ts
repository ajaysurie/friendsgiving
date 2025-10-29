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
    originalUrl: row.original_url,
    thanksgivingUrl: row.thanksgiving_url,
    uploadedBy: row.uploaded_by,
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
    originalUrl: data.original_url,
    thanksgivingUrl: data.thanksgiving_url,
    uploadedBy: data.uploaded_by,
    createdAt: data.created_at,
    year: data.year,
  };
}

export async function createGalleryPhoto(photo: GalleryPhoto): Promise<void> {
  const { error } = await supabase
    .from('gallery_photos')
    .insert({
      id: photo.id,
      original_url: photo.originalUrl,
      thanksgiving_url: photo.thanksgivingUrl,
      uploaded_by: photo.uploadedBy,
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

  if (updates.originalUrl !== undefined) dbUpdates.original_url = updates.originalUrl;
  if (updates.thanksgivingUrl !== undefined) dbUpdates.thanksgiving_url = updates.thanksgivingUrl;
  if (updates.uploadedBy !== undefined) dbUpdates.uploaded_by = updates.uploadedBy;
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
