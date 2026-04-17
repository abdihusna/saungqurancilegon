<?php
/**
 * webhook.php - Endpoint penerima postingan baru untuk Saung Qur'an Cilegon
 *
 * UPLOAD KE: public_html/webhook.php di Hostinger (domain saungqurancilegon.id)
 *
 * Cara pakai (Postman):
 *   POST https://saungqurancilegon.id/webhook.php
 *   Headers:
 *     Content-Type: application/json
 *     X-Webhook-Secret: <token rahasia Anda>
 *   Body (raw JSON):
 *     {
 *       "title": "Judul berita",
 *       "excerpt": "Ringkasan singkat 1-2 kalimat",
 *       "content": "Isi lengkap berita (boleh pakai \\n\\n untuk paragraf, **bold**, dll)",
 *       "category": "Berita",
 *       "date": "17 April 2026",
 *       "slug": "judul-berita-opsional",
 *       "author": "Admin SQC",
 *       "tags": ["tahfidz", "santri"],
 *       "image_base64": "data:image/jpeg;base64,/9j/4AAQ...",  // opsional
 *       "image_url": "https://...",                              // opsional jika sudah di-host
 *       "gallery": [
 *         { "image_base64": "data:image/jpeg;base64,...", "alt": "Caption" },
 *         { "image_url": "https://...", "alt": "Caption" }
 *       ]
 *     }
 */

// ============ KONFIGURASI ============
// !!! GANTI dengan token random kuat (min 32 karakter) sebelum upload !!!
// Generate token: https://www.random.org/strings/ atau `openssl rand -hex 32`
$WEBHOOK_SECRET = 'GANTI_DENGAN_TOKEN_RAHASIA_MIN_32_KARAKTER';

$DATA_DIR     = __DIR__ . '/data';
$POSTS_FILE   = $DATA_DIR . '/posts.json';
$UPLOADS_DIR  = __DIR__ . '/uploads/news';
$PUBLIC_BASE  = 'https://saungqurancilegon.id'; // base URL untuk gambar yang di-upload

$MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB per gambar
$ALLOWED_MIMES   = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];

// ============ CORS (untuk dibaca dari Lovable preview & domain produksi) ============
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Webhook-Secret');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// ============ AUTH ============
$providedSecret = $_SERVER['HTTP_X_WEBHOOK_SECRET'] ?? '';
if (!hash_equals($WEBHOOK_SECRET, $providedSecret)) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'Unauthorized']);
    exit;
}

// ============ PARSE BODY ============
$raw = file_get_contents('php://input');
$payload = json_decode($raw, true);
if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON body']);
    exit;
}

// ============ VALIDASI ============
$required = ['title', 'content'];
foreach ($required as $f) {
    if (empty($payload[$f]) || !is_string($payload[$f])) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => "Field '$f' wajib diisi (string)"]);
        exit;
    }
}

if (mb_strlen($payload['title']) > 200) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Title maks 200 karakter']);
    exit;
}
if (mb_strlen($payload['content']) > 50000) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Content maks 50.000 karakter']);
    exit;
}

// ============ SETUP DIRECTORIES ============
foreach ([$DATA_DIR, $UPLOADS_DIR] as $dir) {
    if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => "Gagal buat folder: $dir"]);
        exit;
    }
}

// ============ HELPER: simpan gambar base64 ============
function saveBase64Image(string $b64, string $uploadsDir, string $publicBase, int $maxBytes, array $allowedMimes): ?string {
    // Format: "data:image/jpeg;base64,/9j/4AAQ..."
    if (!preg_match('#^data:(image/[a-zA-Z+]+);base64,(.+)$#', $b64, $m)) {
        // Coba treat sebagai raw base64 tanpa prefix (assume jpeg)
        $mime = 'image/jpeg';
        $data = base64_decode($b64, true);
    } else {
        $mime = strtolower($m[1]);
        $data = base64_decode($m[2], true);
    }

    if ($data === false) return null;
    if (!isset($allowedMimes[$mime])) return null;
    if (strlen($data) > $maxBytes) return null;

    $ext = $allowedMimes[$mime];
    $filename = date('Ymd-His') . '-' . bin2hex(random_bytes(4)) . '.' . $ext;
    $fullPath = $uploadsDir . '/' . $filename;
    if (file_put_contents($fullPath, $data) === false) return null;

    return $publicBase . '/uploads/news/' . $filename;
}

// ============ HELPER: slug generator ============
function makeSlug(string $title): string {
    $slug = strtolower(trim($title));
    $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
    $slug = trim($slug, '-');
    return $slug ?: 'post-' . date('YmdHis');
}

// ============ PROSES GAMBAR UTAMA ============
$imageUrl = null;
if (!empty($payload['image_base64'])) {
    $imageUrl = saveBase64Image($payload['image_base64'], $UPLOADS_DIR, $PUBLIC_BASE, $MAX_IMAGE_BYTES, $ALLOWED_MIMES);
    if (!$imageUrl) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Gagal simpan image_base64 (cek format & ukuran ≤5MB, mime jpeg/png/webp)']);
        exit;
    }
} elseif (!empty($payload['image_url']) && filter_var($payload['image_url'], FILTER_VALIDATE_URL)) {
    $imageUrl = $payload['image_url'];
}

// ============ PROSES GALLERY ============
$gallery = [];
if (!empty($payload['gallery']) && is_array($payload['gallery'])) {
    foreach ($payload['gallery'] as $g) {
        if (!is_array($g)) continue;
        $gUrl = null;
        if (!empty($g['image_base64'])) {
            $gUrl = saveBase64Image($g['image_base64'], $UPLOADS_DIR, $PUBLIC_BASE, $MAX_IMAGE_BYTES, $ALLOWED_MIMES);
        } elseif (!empty($g['image_url']) && filter_var($g['image_url'], FILTER_VALIDATE_URL)) {
            $gUrl = $g['image_url'];
        }
        if ($gUrl) {
            $gallery[] = ['src' => $gUrl, 'alt' => isset($g['alt']) ? (string)$g['alt'] : ''];
        }
    }
}

// ============ BANGUN POST OBJECT ============
$slug = !empty($payload['slug']) ? makeSlug((string)$payload['slug']) : makeSlug((string)$payload['title']);

$post = [
    'id'         => (int)(microtime(true) * 1000),
    'slug'       => $slug,
    'title'      => trim((string)$payload['title']),
    'excerpt'    => isset($payload['excerpt']) ? trim((string)$payload['excerpt']) : mb_substr(strip_tags((string)$payload['content']), 0, 200) . '...',
    'content'    => trim((string)$payload['content']),
    'category'   => isset($payload['category']) ? trim((string)$payload['category']) : 'Berita',
    'date'       => isset($payload['date']) ? trim((string)$payload['date']) : date('j F Y'),
    'author'     => isset($payload['author']) ? trim((string)$payload['author']) : 'Admin SQC',
    'tags'       => (isset($payload['tags']) && is_array($payload['tags'])) ? array_values(array_map('strval', $payload['tags'])) : [],
    'image'      => $imageUrl,
    'gallery'    => $gallery,
    'created_at' => date('c'),
];

// ============ SIMPAN ============
$fp = fopen($POSTS_FILE, 'c+');
if (!$fp) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Gagal buka posts.json']);
    exit;
}
flock($fp, LOCK_EX);
$contents = stream_get_contents($fp);
$posts = $contents ? json_decode($contents, true) : [];
if (!is_array($posts)) $posts = [];

// Cek slug unik — kalau duplikat, append timestamp
$existingSlugs = array_column($posts, 'slug');
if (in_array($post['slug'], $existingSlugs, true)) {
    $post['slug'] .= '-' . date('YmdHis');
}

array_unshift($posts, $post); // post terbaru di depan

ftruncate($fp, 0);
rewind($fp);
fwrite($fp, json_encode($posts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
flock($fp, LOCK_UN);
fclose($fp);

// ============ RESPONSE ============
http_response_code(201);
echo json_encode([
    'ok'   => true,
    'post' => $post,
    'url'  => $PUBLIC_BASE . '/berita/' . $post['slug'],
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
