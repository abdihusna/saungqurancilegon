## Ringkasan

Tiga pekerjaan dalam satu rilis:

1. **Pendaftaran**: tambah RLS admin (UPDATE/DELETE) + panel admin untuk lihat data dan ubah status. Anon tetap hanya bisa INSERT data valid (sudah aman).
2. **Admin CRUD Pengumuman**: tab baru di `/admin` dengan form & daftar `announcements` (sebelumnya hanya `news`).
3. **Skrip uji RLS otomatis**: `scripts/rls-test.ts` (Node/Bun) yang menguji `anon` (& opsional `authenticated`/admin) terhadap `news`, `announcements`, `pendaftaran`, `storage.objects`. Bisa dijalankan lokal atau di CI dan exit non-zero bila ada regresi.

---

## 1. Database (migration)

```sql
-- Admin bisa lihat/ubah/hapus pendaftaran
CREATE POLICY "Admins can read pendaftaran" ON public.pendaftaran
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update pendaftaran" ON public.pendaftaran
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (
    has_role(auth.uid(), 'admin')
    AND status IN ('pending','diproses','diterima','ditolak')
  );

CREATE POLICY "Admins can delete pendaftaran" ON public.pendaftaran
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
```

Anon INSERT policy yang sudah membatasi `status IS NULL OR 'pending'` tetap dipertahankan.

## 2. Frontend — `/admin` direstrukturisasi

`src/pages/Admin.tsx` dibungkus dengan komponen `Tabs`:

```text
[ Berita ]  [ Pengumuman ]  [ Pendaftaran ]
```

- **Berita**: form & list eksisting (tidak diubah, di-extract ke `AdminNewsPanel`).
- **Pengumuman** (`AdminAnnouncementsPanel`): form + list mirip Berita, target tabel `announcements`, bucket storage sama (`news-images`). CRUD memakai `supabase.from("announcements")`.
- **Pendaftaran** (`AdminPendaftaranPanel`): tabel daftar peserta (filter status, search nama), kolom Status pakai `Select` (pending → diproses → diterima → ditolak), tombol Hapus dengan confirm. Update via `supabase.from("pendaftaran").update({ status }).eq("id", id)`.

Auth/role-check tetap di `Admin.tsx` parent. Halaman publik tidak terpengaruh.

## 3. UI Status di sisi pendaftar

Halaman sukses pendaftaran (`/pendaftaran`) ditambahi badge "Status: Menunggu diproses" agar pendaftar paham datanya tersimpan dengan status `pending`. Tidak ada query ke DB (anon tidak boleh SELECT). Cukup pesan statis + nomor WA admin.

## 4. Skrip uji RLS — `scripts/rls-test.ts`

Standalone TypeScript (jalan via `bun scripts/rls-test.ts`). Tidak bergantung Vite.

ENV:
- `SUPABASE_URL`, `SUPABASE_ANON_KEY` (wajib)
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` (opsional — kalau ada, jalankan suite admin juga)

Test cases:

```text
ANON
  ✓ news?published=true  → 200, rows ≥ 0
  ✓ news?published=false → 200, []
  ✓ announcements?published=true  → 200
  ✓ announcements?published=false → []
  ✓ pendaftaran SELECT → []
  ✓ user_roles SELECT → []
  ✓ news INSERT → 401
  ✓ announcements INSERT → 401
  ✓ pendaftaran INSERT (data valid) → 201, lalu cleanup via admin (kalau tersedia)
  ✓ pendaftaran INSERT (program invalid) → 401
  ✓ pendaftaran UPDATE → 0 rows affected
  ✓ pendaftaran DELETE → 0 rows affected
  ✓ storage list news-images → []
  ✓ storage upload news-images → 403

AUTHENTICATED ADMIN (jika kredensial diset)
  ✓ news INSERT/UPDATE/DELETE → sukses
  ✓ announcements INSERT/UPDATE/DELETE → sukses
  ✓ pendaftaran SELECT → rows
  ✓ pendaftaran UPDATE status → sukses
  ✓ storage upload → sukses
```

Output ringkas `✅ PASS` / `❌ FAIL`, exit code 1 bila ada FAIL. Hasil pengujian di-print agar bisa dipakai di GitHub Actions (`.github/workflows/rls-test.yml` — opsional, tidak dibuat agar pengguna bisa pilih CI sendiri).

## 5. File yang berubah

- **DB migration baru**: 3 policy untuk `pendaftaran`.
- **Edited**: `src/pages/Admin.tsx` (tabs + extract panels), `src/pages/Pendaftaran.tsx` (badge status).
- **Created**:
  - `src/components/admin/AdminNewsPanel.tsx`
  - `src/components/admin/AdminAnnouncementsPanel.tsx`
  - `src/components/admin/AdminPendaftaranPanel.tsx`
  - `scripts/rls-test.ts`
  - `scripts/README.md` (cara pakai)

## Catatan teknis

- Shared logic Berita/Pengumuman (upload image, gallery, slugify) di-extract ke `src/components/admin/usePostForm.ts` untuk hindari duplikasi.
- Form Admin News eksisting tetap berfungsi sama persis (regression-safe).
- Skrip uji **tidak** menjalankan migrasi; murni black-box terhadap PostgREST + Storage REST.
- Tidak menyentuh edge functions, Hostinger PHP, atau bucket storage.
