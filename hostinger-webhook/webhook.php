<?php
/**
 * webhook.php - Endpoint CRUD postingan untuk Saung Qur'an Cilegon
 *
 * UPLOAD KE: public_html/webhook.php di Hostinger (saungqurancilegon.id)
 *
 * Method yang didukung:
 *   POST   /webhook.php              -> tambah berita baru
 *   PUT    /webhook.php?slug=xxx     -> edit berita berdasarkan slug
 *   DELETE /webhook.php?slug=xxx     -> hapus berita berdasarkan slug
 *
 * Semua method butuh header:
 *   X-Webhook-Secret: <token rahasia>
 *
 * Contoh body POST/PUT (raw JSON):
 *   {
 *     "title":"...", "excerpt":"...", "content":"...", "category":"Berita",
 *     "date":"17 April 2026", "slug":"opsional", "author":"Admin SQC",
 *     "tags":["tag1"],
 *     "image_base64":"data:image/jpeg;base64,...",  // ATAU image_url
 *     "image_url":"https://...",
 *     "gallery":[ { "image_base64":"...", "alt":"..." } ]
 *   }
 */

// ============ KONFIGURASI ============
// !!! GANTI dengan token random kuat (min 32 karakter) sebelum upload !!!
$WEBHOOK_SECRET = 'saungquran_2026_super_secret_token_123456';

$DATA_DIR     = __DIR__ . '/data';
$POSTS_FILE   = $DATA_DIR . '/posts.json';
$UPLOADS_DIR  = __DIR__ . '/uploads/news';
$PUBLIC_BASE  = 'https://saungqurancilegon.id/hostinger-webhook';

$MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
$ALLOWED_MIMES   = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];

// ============ CORS ============
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Webhook-Secret');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$method = $_SERVER['REQUEST_METHOD'];
if (!in_array($method, ['POST', 'PUT', 'DELETE'], true)) {
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

// ============ HELPERS ============
function jsonError(int $code, string $msg): void {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg]);
    exit;
}

function makeSlug(string $title): string {
    $slug = strtolower(trim($title));
    $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
    $slug = trim($slug, '-');
    return $slug ?: 'post-' . date('YmdHis');
}

function saveBase64Image(string $b64, string $uploadsDir, string $publicBase, int $maxBytes, array $allowedMimes): ?string {
    if (preg_match('#^data:(image/[a-zA-Z+]+);base64,(.+)$#', $b64, $m)) {
        $mime = strtolower($m[1]);
        $data = base64_decode($m[2], true);
    } else {
        $mime = 'image/jpeg';
        $data = base64_decode($b64, true);
    }
    if ($data === false || !isset($allowedMimes[$mime]) || strlen($data) > $maxBytes) return null;

    $ext = $allowedMimes[$mime];
    $filename = date('Ymd-His') . '-' . bin2hex(random_bytes(4)) . '.' . $ext;
    $fullPath = $uploadsDir . '/' . $filename;
    if (file_put_contents($fullPath, $data) === false) return null;

    return $publicBase . '/uploads/news/' . $filename;
}

function loadPosts(string $file): array {
    if (!file_exists($file)) return [];
    $contents = file_get_contents($file);
    $posts = $contents ? json_decode($contents, true) : [];
    return is_array($posts) ? $posts : [];
}

function savePosts(string $file, array $posts): bool {
    return file_put_contents(
        $file,
        json_encode($posts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        LOCK_EX
    ) !== false;
}

function deleteUploadIfLocal(?string $url, string $publicBase): void {
    if (!$url || strpos($url, $publicBase . '/uploads/news/') !== 0) return;
    // Hapus prefix path dari publicBase agar tidak duplikat saat di-concat dengan __DIR__
    $basePath  = parse_url($publicBase, PHP_URL_PATH) ?: '';
    $urlPath   = parse_url($url, PHP_URL_PATH) ?: '';
    $relPath   = $basePath && strpos($urlPath, $basePath) === 0
        ? substr($urlPath, strlen($basePath))
        : $urlPath;
    $localPath = __DIR__ . $relPath;
    if (file_exists($localPath)) @unlink($localPath);
}

function buildPostFromPayload(array $payload, string $uploadsDir, string $publicBase, int $maxBytes, array $allowedMimes, ?array $existing = null): array {
    // Image utama
    $imageUrl = $existing['image'] ?? null;
    if (!empty($payload['image_base64'])) {
        $newUrl = saveBase64Image($payload['image_base64'], $uploadsDir, $publicBase, $maxBytes, $allowedMimes);
        if (!$newUrl) jsonError(400, 'Gagal simpan image_base64 (cek format & ukuran ≤5MB)');
        // hapus gambar lama jika ada
        if ($existing) deleteUploadIfLocal($existing['image'] ?? null, $publicBase);
        $imageUrl = $newUrl;
    } elseif (!empty($payload['image_url']) && filter_var($payload['image_url'], FILTER_VALIDATE_URL)) {
        if ($existing) deleteUploadIfLocal($existing['image'] ?? null, $publicBase);
        $imageUrl = $payload['image_url'];
    } elseif (array_key_exists('image_url', $payload) && $payload['image_url'] === null) {
        // explicit null = remove image
        if ($existing) deleteUploadIfLocal($existing['image'] ?? null, $publicBase);
        $imageUrl = null;
    }

    // Gallery
    $gallery = $existing['gallery'] ?? [];
    if (array_key_exists('gallery', $payload)) {
        // hapus gallery lama yang lokal
        if ($existing && !empty($existing['gallery'])) {
            foreach ($existing['gallery'] as $g) deleteUploadIfLocal($g['src'] ?? null, $publicBase);
        }
        $gallery = [];
        if (is_array($payload['gallery'])) {
            foreach ($payload['gallery'] as $g) {
                if (!is_array($g)) continue;
                $gUrl = null;
                if (!empty($g['image_base64'])) {
                    $gUrl = saveBase64Image($g['image_base64'], $uploadsDir, $publicBase, $maxBytes, $allowedMimes);
                } elseif (!empty($g['image_url']) && filter_var($g['image_url'], FILTER_VALIDATE_URL)) {
                    $gUrl = $g['image_url'];
                }
                if ($gUrl) $gallery[] = ['src' => $gUrl, 'alt' => isset($g['alt']) ? (string)$g['alt'] : ''];
            }
        }
    }

    return [
        'id'         => $existing['id'] ?? (int)(microtime(true) * 1000),
        'slug'       => $existing['slug'] ?? makeSlug((string)($payload['slug'] ?? $payload['title'])),
        'title'      => isset($payload['title']) ? trim((string)$payload['title']) : ($existing['title'] ?? ''),
        'excerpt'    => isset($payload['excerpt']) ? trim((string)$payload['excerpt']) : ($existing['excerpt'] ?? mb_substr(strip_tags((string)($payload['content'] ?? '')), 0, 200) . '...'),
        'content'    => isset($payload['content']) ? trim((string)$payload['content']) : ($existing['content'] ?? ''),
        'category'   => isset($payload['category']) ? trim((string)$payload['category']) : ($existing['category'] ?? 'Berita'),
        'date'       => isset($payload['date']) ? trim((string)$payload['date']) : ($existing['date'] ?? date('j F Y')),
        'author'     => isset($payload['author']) ? trim((string)$payload['author']) : ($existing['author'] ?? 'Admin SQC'),
        'tags'       => (isset($payload['tags']) && is_array($payload['tags'])) ? array_values(array_map('strval', $payload['tags'])) : ($existing['tags'] ?? []),
        'image'      => $imageUrl,
        'gallery'    => $gallery,
        'created_at' => $existing['created_at'] ?? date('c'),
        'updated_at' => $existing ? date('c') : null,
    ];
}

// ============ SETUP ============
foreach ([$DATA_DIR, $UPLOADS_DIR] as $dir) {
    if (!is_dir($dir) && !mkdir($dir, 0755, true)) jsonError(500, "Gagal buat folder: $dir");
}

$payload = [];
if (in_array($method, ['POST', 'PUT'], true)) {
    $raw = file_get_contents('php://input');
    $payload = json_decode($raw, true);
    if (!is_array($payload)) jsonError(400, 'Invalid JSON body');
}

// ============ ROUTING ============
if ($method === 'POST') {
    // CREATE
    if (empty($payload['title']) || !is_string($payload['title'])) jsonError(400, "Field 'title' wajib");
    if (empty($payload['content']) || !is_string($payload['content'])) jsonError(400, "Field 'content' wajib");
    if (mb_strlen($payload['title']) > 200) jsonError(400, 'Title maks 200 karakter');
    if (mb_strlen($payload['content']) > 50000) jsonError(400, 'Content maks 50.000 karakter');

    $post = buildPostFromPayload($payload, $UPLOADS_DIR, $PUBLIC_BASE, $MAX_IMAGE_BYTES, $ALLOWED_MIMES, null);
    $posts = loadPosts($POSTS_FILE);

    // slug unik
    $existingSlugs = array_column($posts, 'slug');
    if (in_array($post['slug'], $existingSlugs, true)) {
        $post['slug'] .= '-' . date('YmdHis');
    }

    array_unshift($posts, $post);
    if (!savePosts($POSTS_FILE, $posts)) jsonError(500, 'Gagal simpan posts.json');

    http_response_code(201);
    echo json_encode([
        'ok' => true,
        'post' => $post,
        'url' => $PUBLIC_BASE . '/berita/' . $post['slug'],
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if ($method === 'PUT') {
    // UPDATE
    $slug = $_GET['slug'] ?? null;
    if (!$slug) jsonError(400, 'Query ?slug=xxx wajib untuk PUT');

    $posts = loadPosts($POSTS_FILE);
    $idx = null;
    foreach ($posts as $i => $p) {
        if (($p['slug'] ?? null) === $slug) { $idx = $i; break; }
    }
    if ($idx === null) jsonError(404, "Post dengan slug '$slug' tidak ditemukan");

    $updated = buildPostFromPayload($payload, $UPLOADS_DIR, $PUBLIC_BASE, $MAX_IMAGE_BYTES, $ALLOWED_MIMES, $posts[$idx]);
    $posts[$idx] = $updated;

    if (!savePosts($POSTS_FILE, $posts)) jsonError(500, 'Gagal simpan posts.json');

    echo json_encode([
        'ok' => true,
        'post' => $updated,
        'url' => $PUBLIC_BASE . '/berita/' . $updated['slug'],
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if ($method === 'DELETE') {
    $slug = $_GET['slug'] ?? null;
    if (!$slug) jsonError(400, 'Query ?slug=xxx wajib untuk DELETE');

    $posts = loadPosts($POSTS_FILE);
    $newPosts = [];
    $deleted = null;
    foreach ($posts as $p) {
        if (($p['slug'] ?? null) === $slug) { $deleted = $p; continue; }
        $newPosts[] = $p;
    }
    if (!$deleted) jsonError(404, "Post dengan slug '$slug' tidak ditemukan");

    // hapus gambar terkait
    deleteUploadIfLocal($deleted['image'] ?? null, $PUBLIC_BASE);
    if (!empty($deleted['gallery'])) {
        foreach ($deleted['gallery'] as $g) deleteUploadIfLocal($g['src'] ?? null, $PUBLIC_BASE);
    }

    if (!savePosts($POSTS_FILE, $newPosts)) jsonError(500, 'Gagal simpan posts.json');

    echo json_encode(['ok' => true, 'deleted' => $deleted['slug']]);
    exit;
}
