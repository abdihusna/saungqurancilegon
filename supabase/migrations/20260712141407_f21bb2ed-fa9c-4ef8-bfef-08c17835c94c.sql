
-- 1. Move has_role() out of the API-exposed public schema so signed-in users
--    cannot invoke it directly via PostgREST/RPC. RLS policies continue to
--    reference it via the new private schema.
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Recreate all policies to reference private.has_role
-- user_roles
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- news
DROP POLICY IF EXISTS "Admins can read all news" ON public.news;
DROP POLICY IF EXISTS "Admins can insert news" ON public.news;
DROP POLICY IF EXISTS "Admins can update news" ON public.news;
DROP POLICY IF EXISTS "Admins can delete news" ON public.news;
CREATE POLICY "Admins can read all news" ON public.news FOR SELECT USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert news" ON public.news FOR INSERT WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update news" ON public.news FOR UPDATE USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete news" ON public.news FOR DELETE USING (private.has_role(auth.uid(), 'admin'));

-- announcements
DROP POLICY IF EXISTS "Admins can read all announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins can insert announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins can update announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins can delete announcements" ON public.announcements;
CREATE POLICY "Admins can read all announcements" ON public.announcements FOR SELECT USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert announcements" ON public.announcements FOR INSERT WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update announcements" ON public.announcements FOR UPDATE USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete announcements" ON public.announcements FOR DELETE USING (private.has_role(auth.uid(), 'admin'));

-- pendaftaran
DROP POLICY IF EXISTS "Admins can read pendaftaran" ON public.pendaftaran;
DROP POLICY IF EXISTS "Admins can update pendaftaran" ON public.pendaftaran;
DROP POLICY IF EXISTS "Admins can delete pendaftaran" ON public.pendaftaran;
CREATE POLICY "Admins can read pendaftaran" ON public.pendaftaran FOR SELECT USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update pendaftaran" ON public.pendaftaran FOR UPDATE USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin') AND (status = ANY (ARRAY['pending','diproses','diterima','ditolak'])));
CREATE POLICY "Admins can delete pendaftaran" ON public.pendaftaran FOR DELETE USING (private.has_role(auth.uid(), 'admin'));

-- storage.objects
DROP POLICY IF EXISTS "Admins can upload news images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update news images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete news images" ON storage.objects;
CREATE POLICY "Admins can upload news images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'news-images' AND private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update news images" ON storage.objects FOR UPDATE USING (bucket_id = 'news-images' AND private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete news images" ON storage.objects FOR DELETE USING (bucket_id = 'news-images' AND private.has_role(auth.uid(), 'admin'));

-- Drop the old public function now that no policy depends on it
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

-- 2. Restrict Realtime channel subscriptions.
--    The app only uses postgres_changes on public.news (gated by table RLS).
--    Deny arbitrary Broadcast/Presence topic subscriptions by enabling RLS
--    on realtime.messages with no permissive policies.
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;
