<?php
/**
 * posts.php - Endpoint baca daftar/detail postingan
 *
 * UPLOAD KE: public_html/posts.php di Hostinger (saungqurancilegon.id)
 *
 * GET https://saungqurancilegon.id/posts.php           -> semua post
 * GET https://saungqurancilegon.id/posts.php?slug=xxx  -> 1 post by slug
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=60'); // cache 1 menit

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$POSTS_FILE = __DIR__ . '/data/posts.json';

if (!file_exists($POSTS_FILE)) {
    echo json_encode(['ok' => true, 'posts' => []]);
    exit;
}

$contents = file_get_contents($POSTS_FILE);
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
    echo json_encode(['ok' => false, 'error' => 'Post not found']);
    exit;
}

echo json_encode(['ok' => true, 'posts' => $posts], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
