
ALTER TABLE public.pendaftaran
  ADD CONSTRAINT pendaftaran_nama_lengkap_length CHECK (char_length(nama_lengkap) BETWEEN 2 AND 100),
  ADD CONSTRAINT pendaftaran_tempat_lahir_length CHECK (char_length(tempat_lahir) BETWEEN 2 AND 100),
  ADD CONSTRAINT pendaftaran_alamat_length CHECK (char_length(alamat) BETWEEN 5 AND 500),
  ADD CONSTRAINT pendaftaran_nama_ayah_length CHECK (char_length(nama_ayah) BETWEEN 2 AND 100),
  ADD CONSTRAINT pendaftaran_nama_ibu_length CHECK (char_length(nama_ibu) BETWEEN 2 AND 100),
  ADD CONSTRAINT pendaftaran_asal_sekolah_length CHECK (asal_sekolah IS NULL OR char_length(asal_sekolah) <= 200),
  ADD CONSTRAINT pendaftaran_catatan_length CHECK (catatan IS NULL OR char_length(catatan) <= 1000),
  ADD CONSTRAINT pendaftaran_email_length CHECK (email IS NULL OR char_length(email) <= 255),
  ADD CONSTRAINT pendaftaran_no_telepon_length CHECK (char_length(no_telepon) BETWEEN 8 AND 20),
  ADD CONSTRAINT pendaftaran_jenis_kelamin_enum CHECK (jenis_kelamin IN ('Laki-laki','Perempuan')),
  ADD CONSTRAINT pendaftaran_program_enum CHECK (program IN ('Thufulah','Tamyiz','Murohaqoh','TALQIN')),
  ADD CONSTRAINT pendaftaran_no_telepon_format CHECK (no_telepon ~ '^[0-9+\-\s()]+$'),
  ADD CONSTRAINT pendaftaran_email_format CHECK (email IS NULL OR email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  ADD CONSTRAINT pendaftaran_status_enum CHECK (status IS NULL OR status IN ('pending','diproses','diterima','ditolak'));
