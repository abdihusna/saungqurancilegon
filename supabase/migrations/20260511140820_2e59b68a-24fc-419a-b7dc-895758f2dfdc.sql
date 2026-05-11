-- Allow admins to read, update, and delete pendaftaran rows
CREATE POLICY "Admins can read pendaftaran"
ON public.pendaftaran
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update pendaftaran"
ON public.pendaftaran
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::public.app_role)
  AND status = ANY (ARRAY['pending'::text, 'diproses'::text, 'diterima'::text, 'ditolak'::text])
);

CREATE POLICY "Admins can delete pendaftaran"
ON public.pendaftaran
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));