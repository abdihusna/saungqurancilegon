# RLS Test Suite

Skrip pengujian otomatis kebijakan RLS Lovable Cloud (Supabase) untuk SQC.

## Cara pakai (lokal)

```bash
export SUPABASE_URL="https://xkppbrevqrdrgykjlfrw.supabase.co"
export SUPABASE_ANON_KEY="<anon key publik dari .env>"

# Opsional: jalankan juga suite admin (lebih lengkap + auto-cleanup)
export ADMIN_EMAIL="admin@saungqurancilegon.id"
export ADMIN_PASSWORD="••••••••"

bun scripts/rls-test.ts
```

Exit code `0` = semua lulus, `1` = ada FAIL (cocok untuk CI).

## Apa yang diuji

### Anon (tanpa login)
- ✅ SELECT `news` / `announcements` published-only
- ✅ Draft (`published=false`) tidak terlihat
- ✅ `pendaftaran` & `user_roles` tidak bisa dibaca
- ✅ INSERT `news` / `announcements` ditolak (401/403)
- ✅ INSERT `pendaftaran` data valid → 201
- ✅ INSERT `pendaftaran` dengan `program` invalid ditolak
- ✅ INSERT `pendaftaran` mencoba set `status='diterima'` ditolak
- ✅ UPDATE / DELETE `pendaftaran` tidak mengubah data (0 rows)
- ✅ LIST objek `news-images` kosong (no public listing)
- ✅ UPLOAD ke `news-images` ditolak (401/403)

### Admin (jika kredensial diset)
- ✅ Sign-in password sukses
- ✅ INSERT/UPDATE/DELETE `news` (CRUD)
- ✅ SELECT `pendaftaran`
- ✅ UPDATE status `pendaftaran` ke nilai valid
- ✅ UPDATE status invalid ditolak (CHECK constraint)
- ✅ Cleanup row pendaftaran test

## Contoh GitHub Actions

```yaml
name: RLS Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun scripts/rls-test.ts
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          ADMIN_EMAIL: ${{ secrets.ADMIN_EMAIL }}
          ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
```
