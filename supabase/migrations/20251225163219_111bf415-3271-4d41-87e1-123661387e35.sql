-- Add stats fields to about_content table
ALTER TABLE public.about_content 
ADD COLUMN IF NOT EXISTS years_experience integer DEFAULT 5,
ADD COLUMN IF NOT EXISTS technologies_count integer DEFAULT 20,
ADD COLUMN IF NOT EXISTS happy_clients integer DEFAULT 15;