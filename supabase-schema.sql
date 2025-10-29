-- FriendsGiving Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Dishes table
CREATE TABLE IF NOT EXISTS dishes (
  id TEXT PRIMARY KEY,
  dish_name TEXT NOT NULL,
  dietary_tags TEXT[] DEFAULT '{}',
  generated_image_url TEXT NOT NULL,
  claimed_by TEXT,
  reactions JSONB DEFAULT '{}',
  created_at BIGINT NOT NULL,
  year INTEGER
);

-- Gallery photos table
CREATE TABLE IF NOT EXISTS gallery_photos (
  id TEXT PRIMARY KEY,
  original_url TEXT NOT NULL,
  thanksgiving_url TEXT,
  uploaded_by TEXT NOT NULL,
  created_at BIGINT NOT NULL,
  year INTEGER
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_dishes_created_at ON dishes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dishes_year ON dishes(year);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_created_at ON gallery_photos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_year ON gallery_photos(year);

-- Enable Row Level Security (RLS)
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since we don't have auth)
CREATE POLICY "Enable read access for all users" ON dishes FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON dishes FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON dishes FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON dishes FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON gallery_photos FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON gallery_photos FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON gallery_photos FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON gallery_photos FOR DELETE USING (true);
