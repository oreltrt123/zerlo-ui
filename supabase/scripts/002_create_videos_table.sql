-- Create videos table
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  duration TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS videos_course_id_idx ON public.videos(course_id);
CREATE INDEX IF NOT EXISTS videos_order_idx ON public.videos(course_id, order_index);

-- Enable RLS
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Create policies for videos
-- Allow everyone to view videos
CREATE POLICY "videos_select_all" ON public.videos
  FOR SELECT USING (true);

-- Only allow course creators to manage videos for their courses
CREATE POLICY "videos_insert_course_creator" ON public.videos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE courses.id = videos.course_id 
      AND courses.creator_email = auth.email()
    )
  );

CREATE POLICY "videos_update_course_creator" ON public.videos
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE courses.id = videos.course_id 
      AND courses.creator_email = auth.email()
    )
  );

CREATE POLICY "videos_delete_course_creator" ON public.videos
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE courses.id = videos.course_id 
      AND courses.creator_email = auth.email()
    )
  );
