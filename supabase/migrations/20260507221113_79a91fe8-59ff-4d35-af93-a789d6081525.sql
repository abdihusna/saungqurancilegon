
-- 1. Move pg_net out of public schema (drop + recreate, since pg_net lacks SET SCHEMA)
CREATE SCHEMA IF NOT EXISTS extensions;
DROP EXTENSION IF EXISTS pg_net;
CREATE EXTENSION pg_net WITH SCHEMA extensions;

-- Ensure trigger functions can find net.* via search_path (already set on functions).

-- 2. Tighten pendaftaran INSERT policy
DROP POLICY IF EXISTS "Anyone can submit registration" ON public.pendaftaran;
CREATE POLICY "Anyone can submit registration"
  ON public.pendaftaran
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    (status IS NULL OR status = 'pending')
    AND program IN ('Thufulah','Tamyiz','Murohaqoh','TALQIN')
    AND jenis_kelamin IN ('Laki-laki','Perempuan')
    AND char_length(nama_lengkap) BETWEEN 2 AND 100
  );

-- 3. Storage: prevent anon listing of news-images
DROP POLICY IF EXISTS "Public can view news images" ON storage.objects;
CREATE POLICY "Authenticated can view news images"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'news-images');

-- 4. Revoke EXECUTE on SECURITY DEFINER helpers
REVOKE EXECUTE ON FUNCTION public.notify_hostinger_news_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_hostinger_announcement_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.auto_publish_scheduled_news() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
