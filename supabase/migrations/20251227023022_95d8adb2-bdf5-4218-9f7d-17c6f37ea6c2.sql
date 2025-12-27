-- Create table for student registrations (pendaftaran)
CREATE TABLE public.pendaftaran (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_lengkap TEXT NOT NULL,
  tempat_lahir TEXT NOT NULL,
  tanggal_lahir DATE NOT NULL,
  jenis_kelamin TEXT NOT NULL,
  alamat TEXT NOT NULL,
  nama_ayah TEXT NOT NULL,
  nama_ibu TEXT NOT NULL,
  no_telepon TEXT NOT NULL,
  email TEXT,
  program TEXT NOT NULL,
  asal_sekolah TEXT,
  catatan TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pendaftaran ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for registration form)
CREATE POLICY "Anyone can submit registration"
ON public.pendaftaran
FOR INSERT
WITH CHECK (true);

-- Create policy to prevent public reads (admin only via service role)
CREATE POLICY "No public reads"
ON public.pendaftaran
FOR SELECT
USING (false);