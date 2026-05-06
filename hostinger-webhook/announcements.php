<?php
/**
 * announcements.php - Endpoint baca daftar/detail pengumuman
 * UPLOAD KE: public_html/hostinger-webhook/announcements.php
 *
 * GET .../announcements.php           -> semua pengumuman
 * GET .../announcements.php?slug=xxx  -> 1 pengumuman by slug
 *
 * NOTE: NO cache headers — perubahan langsung terbaca.
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$FILE = __DIR__ . '/data/announcements.json';

if (!file_exists($FILE)) {
    echo json_encode(['ok' => true, 'posts' => []]);
    exit;
}

$contents = file_get_contents($FILE);
$posts = $contents ? json_decode($contents, true) : [];
if (!is_array($posts)) $posts = [];

$slug = $_GET['slug'] ?? null;
if ($slug) {
    foreach ($posts as $p) {
        if (isset($p['slug']) && $p['slug'] === $slug) {
            echo json_encode(['ok' => true, 'post' => $p], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            exit;
        }
    }
    http_response_code(404);
    echo json_encode(['ok' => false, 'error' => 'Not found']);
    exit;
}

echo json_encode(['ok' => true, 'posts' => $posts], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
