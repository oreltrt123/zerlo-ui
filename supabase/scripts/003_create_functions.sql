-- Diagnostic script to check database setup
-- Check if tables exist
SELECT 
  schemaname,
  tablename,
  tableowner,
  hasindexes,
  hasrules,
  hastriggers,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('courses', 'videos');

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('courses', 'videos');

-- Check current user authentication
SELECT 
  auth.uid() as user_id,
  auth.email() as user_email,
  auth.role() as user_role;
