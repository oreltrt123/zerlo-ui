-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  creator_name TEXT NOT NULL,
  creator_email TEXT NOT NULL,
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')),
  thumbnail_url TEXT,
  total_videos INTEGER DEFAULT 0,
  total_duration TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Create policies for courses
-- Allow everyone to view courses
CREATE POLICY "courses_select_all" ON public.courses
  FOR SELECT USING (true);

-- Only allow specific users to create courses
CREATE POLICY "courses_insert_authorized" ON public.courses
  FOR INSERT WITH CHECK (
    auth.email() = 'orelrevivo4000@gmail.com'
  );

-- Only allow course creators to update their own courses
CREATE POLICY "courses_update_own" ON public.courses
  FOR UPDATE USING (
    auth.email() = creator_email
  );

-- Only allow course creators to delete their own courses
CREATE POLICY "courses_delete_own" ON public.courses
  FOR DELETE USING (
    auth.email() = creator_email
  );
