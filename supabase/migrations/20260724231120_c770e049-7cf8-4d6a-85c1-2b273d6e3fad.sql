-- 1. Grant EXECUTE on private.has_role to authenticated so admin policies can evaluate
GRANT EXECUTE ON FUNCTION private.has_role(uuid, app_role) TO authenticated;

-- 2. Restrict admin policies to authenticated only so anon doesn't evaluate has_role
-- news
ALTER POLICY "Admins can read all news" ON public.news TO authenticated;
ALTER POLICY "Admins can insert news" ON public.news TO authenticated;
ALTER POLICY "Admins can update news" ON public.news TO authenticated;
ALTER POLICY "Admins can delete news" ON public.news TO authenticated;

-- announcements
ALTER POLICY "Admins can read all announcements" ON public.announcements TO authenticated;
ALTER POLICY "Admins can insert announcements" ON public.announcements TO authenticated;
ALTER POLICY "Admins can update announcements" ON public.announcements TO authenticated;
ALTER POLICY "Admins can delete announcements" ON public.announcements TO authenticated;

-- pendaftaran
ALTER POLICY "Admins can read pendaftaran" ON public.pendaftaran TO authenticated;
ALTER POLICY "Admins can update pendaftaran" ON public.pendaftaran TO authenticated;
ALTER POLICY "Admins can delete pendaftaran" ON public.pendaftaran TO authenticated;

-- user_roles
ALTER POLICY "Admins can view all roles" ON public.user_roles TO authenticated;
ALTER POLICY "Admins can manage roles" ON public.user_roles TO authenticated;

-- storage.objects news-images
ALTER POLICY "Admins can upload news images" ON storage.objects TO authenticated;
ALTER POLICY "Admins can update news images" ON storage.objects TO authenticated;
ALTER POLICY "Admins can delete news images" ON storage.objects TO authenticated;
