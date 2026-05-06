<?php
/**
 * announcement-webhook.php - CRUD pengumuman (mirip webhook.php tapi simpan ke announcements.json)
 * UPLOAD KE: public_html/hostinger-webhook/announcement-webhook.php
 */

$WEBHOOK_SECRET = 'saungquran_2026_super_secret_token_123456';

$DATA_DIR     = __DIR__ . '/data';
$POSTS_FILE   = $DATA_DIR . '/announcements.json';
$UPLOADS_DIR  = __DIR__ . '/uploads/announcements';
$PUBLIC_BASE  = 'https://saungqurancilegon.id/hostinger-webhook';

$MAX_IMAGE_BYTES = 5 * 1024 * 1024;
$ALLOWED_MIMES   = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];

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

if (!hash_equals($WEBHOOK_SECRET, $_SERVER['HTTP_X_WEBHOOK_SECRET'] ?? '')) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'Unauthorized']);
    exit;
}

function jsonError(int $code, string $msg): void {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg]);
    exit;
}

function makeSlug(string $title): string {
    $s = strtolower(trim($title));
    $s = preg_replace('/[^a-z0-9]+/', '-', $s);
    return trim($s, '-') ?: 'pengumuman-' . date('YmdHis');
}

function loadPosts(string $f): array {
    if (!file_exists($f)) return [];
    $c = file_get_contents($f);
    $p = $c ? json_decode($c, true) : [];
    return is_array($p) ? $p : [];
}

function savePosts(string $f, array $p): bool {
    return file_put_contents($f, json_encode($p, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), LOCK_EX) !== false;
}

function buildPost(array $payload, ?array $existing = null): array {
    $imageUrl = $payload['image_url'] ?? ($existing['image'] ?? null);
    $gallery = [];
    if (isset($payload['gallery']) && is_array($payload['gallery'])) {
        foreach ($payload['gallery'] as $g) {
            if (!empty($g['image_url'])) {
                $gallery[] = ['src' => $g['image_url'], 'alt' => $g['alt'] ?? ''];
            }
        }
    } elseif ($existing) {
        $gallery = $existing['gallery'] ?? [];
    }

    return [
        'id'       => $existing['id'] ?? (int)(microtime(true) * 1000),
        'slug'     => $existing['slug'] ?? makeSlug((string)($payload['slug'] ?? $payload['title'])),
        'title'    => trim((string)($payload['title'] ?? $existing['title'] ?? '')),
        'excerpt'  => trim((string)($payload['excerpt'] ?? $existing['excerpt'] ?? '')),
        'content'  => trim((string)($payload['content'] ?? $existing['content'] ?? '')),
        'category' => trim((string)($payload['category'] ?? $existing['category'] ?? 'Pengumuman')),
        'date'     => trim((string)($payload['date'] ?? $existing['date'] ?? date('j F Y'))),
        'author'   => trim((string)($payload['author'] ?? $existing['author'] ?? 'Admin SQC')),
        'tags'     => isset($payload['tags']) && is_array($payload['tags']) ? array_values(array_map('strval', $payload['tags'])) : ($existing['tags'] ?? []),
        'image'    => $imageUrl,
        'gallery'  => $gallery,
        'created_at' => $existing['created_at'] ?? date('c'),
        'updated_at' => $existing ? date('c') : null,
    ];
}

if (!is_dir($DATA_DIR)) mkdir($DATA_DIR, 0755, true);
if (!is_dir($UPLOADS_DIR)) mkdir($UPLOADS_DIR, 0755, true);

$payload = [];
if (in_array($method, ['POST', 'PUT'], true)) {
    $raw = file_get_contents('php://input');
    $payload = json_decode($raw, true);
    if (!is_array($payload)) jsonError(400, 'Invalid JSON');
}

if ($method === 'POST') {
    if (empty($payload['title'])) jsonError(400, 'title wajib');
    if (empty($payload['content'])) jsonError(400, 'content wajib');

    $post = buildPost($payload);
    $posts = loadPosts($POSTS_FILE);
    $slugs = array_column($posts, 'slug');
    if (in_array($post['slug'], $slugs, true)) $post['slug'] .= '-' . date('YmdHis');
    array_unshift($posts, $post);
    if (!savePosts($POSTS_FILE, $posts)) jsonError(500, 'Save failed');
    http_response_code(201);
    echo json_encode(['ok' => true, 'post' => $post]);
    exit;
}

if ($method === 'PUT') {
    $slug = $_GET['slug'] ?? null;
    if (!$slug) jsonError(400, '?slug= wajib');
    $posts = loadPosts($POSTS_FILE);
    $idx = null;
    foreach ($posts as $i => $p) if (($p['slug'] ?? null) === $slug) { $idx = $i; break; }
    if ($idx === null) jsonError(404, 'Not found');
    $posts[$idx] = buildPost($payload, $posts[$idx]);
    if (!savePosts($POSTS_FILE, $posts)) jsonError(500, 'Save failed');
    echo json_encode(['ok' => true, 'post' => $posts[$idx]]);
    exit;
}

if ($method === 'DELETE') {
    $slug = $_GET['slug'] ?? null;
    if (!$slug) jsonError(400, '?slug= wajib');
    $posts = loadPosts($POSTS_FILE);
    $new = []; $del = null;
    foreach ($posts as $p) {
        if (($p['slug'] ?? null) === $slug) { $del = $p; continue; }
        $new[] = $p;
    }
    if (!$del) jsonError(404, 'Not found');
    if (!savePosts($POSTS_FILE, $new)) jsonError(500, 'Save failed');
    echo json_encode(['ok' => true, 'deleted' => $del['slug']]);
    exit;
}
