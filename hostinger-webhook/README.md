# Webhook Auto-Post — Saung Qur'an Cilegon

Sistem ini memungkinkan Anda menambahkan berita baru ke website **tanpa edit code**, cukup kirim POST request via Postman ke endpoint webhook di Hostinger.

## 📦 File di folder ini

```
hostinger-webhook/
├── webhook.php       → endpoint POST/PUT/DELETE untuk kelola berita
├── posts.php         → endpoint GET untuk baca berita dinamis
├── sitemap.php       → endpoint XML sitemap (statis + slug berita dinamis)
├── data/.htaccess    → blokir akses langsung posts.json
└── README.md         → file ini
```

## 🚀 Setup di Hostinger (1x saja)

### 1. Generate token rahasia
Buka terminal / online generator (`openssl rand -hex 32` atau https://www.random.org/strings/) dan buat token random min 32 karakter. Contoh:
```
a3f7b2e9c4d1f8a6e2b9d5c7f1a4e8b2c5d9f3a7e1b4d8c2f6a9e3b7d1c5f9a4
```

### 2. Edit `webhook.php`
Buka `webhook.php`, cari baris:
```php
$WEBHOOK_SECRET = 'GANTI_DENGAN_TOKEN_RAHASIA_MIN_32_KARAKTER';
```
Ganti dengan token yang baru Anda generate. **Simpan token ini** — Anda butuh untuk Postman.

### 3. Upload ke Hostinger
Login ke **hPanel Hostinger** → **File Manager** → masuk ke `public_html/` → upload:
- `webhook.php`
- `posts.php`
- folder `data/` (yang berisi `.htaccess`)

Pastikan struktur akhirnya:
```
public_html/
├── webhook.php
├── posts.php
├── data/
│   └── .htaccess
└── uploads/news/    ← akan dibuat otomatis saat upload pertama
```

### 4. Set permission folder
Klik kanan folder `data/` dan `uploads/` (kalau sudah ada) → **Permissions** → set ke `755`.

### 5. Test endpoint
Buka di browser: `https://saungqurancilegon.id/posts.php` → harus muncul `{"ok":true,"posts":[]}`

## 📮 Cara post berita via Postman

### Request
- **Method**: `POST`
- **URL**: `https://saungqurancilegon.id/hostinger-webhook/webhook.php`
- **Headers**:
  - `Content-Type`: `application/json`
  - `X-Webhook-Secret`: `<token rahasia Anda>`
- **Body** (raw → JSON):

```json
{
  "title": "Kegiatan Outbond Santri SQC",
  "excerpt": "Para santri mengikuti kegiatan outbond seru di alam terbuka.",
  "content": "🌟 **KEGIATAN OUTBOND** 🌟\n\nAlhamdulillah, hari ini para santri Saung Qur'an Cilegon mengikuti kegiatan outbond di area sekitar saung.\n\nKegiatan ini meliputi:\n- Permainan tim\n- Penjelajahan alam\n- Materi kepemimpinan\n\nSemoga menjadi pengalaman berharga bagi para santri.",
  "category": "Kegiatan",
  "date": "17 April 2026",
  "author": "Admin SQC",
  "tags": ["outbond", "santri", "kegiatan"],
  "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA...",
  "gallery": [
    { "image_base64": "data:image/jpeg;base64,/9j/...", "alt": "Tim outbond" },
    { "image_url": "https://example.com/foto2.jpg", "alt": "Permainan" }
  ]
}
```

### Field yang tersedia
| Field | Wajib | Tipe | Catatan |
|---|---|---|---|
| `title` | ✅ | string | Maks 200 karakter |
| `content` | ✅ | string | Maks 50.000 karakter, support `\n\n` paragraf & `**bold**` |
| `excerpt` | ❌ | string | Auto-generate dari content kalau kosong |
| `category` | ❌ | string | Default: "Berita" |
| `date` | ❌ | string | Default: hari ini (format Indonesia) |
| `slug` | ❌ | string | Auto-generate dari title kalau kosong |
| `author` | ❌ | string | Default: "Admin SQC" |
| `tags` | ❌ | string[] | Array tag, contoh `["tahfidz","santri"]` |
| `image_base64` | ❌ | string | Gambar utama base64 (max 5MB, jpg/png/webp) |
| `image_url` | ❌ | string | URL gambar eksternal (alternatif dari base64) |
| `gallery` | ❌ | object[] | Array `{image_base64\|image_url, alt}` |

### Tips konversi gambar ke base64
- **macOS/Linux**: `base64 -i foto.jpg | pbcopy` lalu prefix dengan `data:image/jpeg;base64,`
- **Online**: https://www.base64-image.de/
- **Postman**: bisa pakai pre-request script untuk auto-convert file → base64

### Response sukses (201)
```json
{
  "ok": true,
  "post": { "id": ..., "slug": "...", "title": "...", ... },
  "url": "https://saungqurancilegon.id/berita/kegiatan-outbond-santri-sqc"
}
```

## 🌐 Bagaimana muncul di website Lovable?

Setelah POST sukses, website otomatis akan menampilkan berita baru di:
- `/event` → muncul di "Berita & Informasi Terbaru" (di atas berita statis)
- `/berita/<slug>` → halaman detail

Website fetch `https://saungqurancilegon.id/posts.php` setiap kali halaman dibuka (cache 1 menit).

## 🔒 Keamanan
- ✅ Webhook diproteksi `X-Webhook-Secret` header
- ✅ File `posts.json` mentah tidak bisa diakses langsung (via .htaccess)
- ✅ Validasi MIME type & ukuran gambar
- ✅ Filename gambar di-randomize (anti-overwrite)
- ⚠️ JANGAN commit token ke Git public

## 🐛 Troubleshooting
| Masalah | Solusi |
|---|---|
| `401 Unauthorized` | Token di header `X-Webhook-Secret` tidak match |
| `400 Invalid JSON body` | Body bukan JSON valid, cek di Postman pilih raw → JSON |
| `500 Gagal buat folder` | Permission Hostinger salah, set folder `public_html` ke 755 |
| Gambar gagal upload | Cek size ≤5MB & format jpeg/png/webp |
| Berita tidak muncul di web | Cek `https://saungqurancilegon.id/hostinger-webhook/posts.php` di browser dulu |
| Sitemap kosong / 404 | Cek `https://saungqurancilegon.id/hostinger-webhook/sitemap.php` langsung. Jika OK, masalah di rewrite `.htaccess` |
