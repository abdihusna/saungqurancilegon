<?php
/**
 * sitemap.php — Sitemap XML dinamis untuk Saung Qur'an Cilegon
 *
 * UPLOAD KE: public_html/hostinger-webhook/sitemap.php
 *
 * Akses langsung:  https://saungqurancilegon.id/hostinger-webhook/sitemap.php
 * Atau (recommended) buat rewrite agar /sitemap.xml → /hostinger-webhook/sitemap.php
 * (lihat README.md bagian SITEMAP).
 *
 * Endpoint ini menggabungkan:
 *  - Halaman statis utama React (hardcode)
 *  - Slug berita dinamis dari data/posts.json
 *  - Slug berita statis dari src/data/newsData.ts (hardcode mirror — update manual saat ada perubahan besar)
 */

header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: public, max-age=1800'); // 30 menit

$SITE_BASE  = 'https://saungqurancilegon.id';
$POSTS_FILE = __DIR__ . '/data/posts.json';

// ============ HALAMAN STATIS (sinkron dengan src/App.tsx) ============
$staticPages = [
    ['loc' => '/',                    'priority' => '1.0', 'changefreq' => 'weekly'],
    ['loc' => '/profil',              'priority' => '0.9', 'changefreq' => 'monthly'],
    ['loc' => '/program-pendidikan',  'priority' => '0.9', 'changefreq' => 'monthly'],
    ['loc' => '/ekstrakurikuler',     'priority' => '0.8', 'changefreq' => 'monthly'],
    ['loc' => '/event',               'priority' => '0.9', 'changefreq' => 'weekly'],
    ['loc' => '/pendaftaran',         'priority' => '0.9', 'changefreq' => 'monthly'],
    ['loc' => '/hubungi-kami',        'priority' => '0.7', 'changefreq' => 'monthly'],
    ['loc' => '/faq',                 'priority' => '0.6', 'changefreq' => 'monthly'],
];

// ============ BERITA DINAMIS dari posts.json ============
$dynamicNews = [];
if (file_exists($POSTS_FILE)) {
    $raw = file_get_contents($POSTS_FILE);
    $posts = $raw ? json_decode($raw, true) : [];
    if (is_array($posts)) {
        foreach ($posts as $p) {
            if (empty($p['slug'])) continue;
            $dynamicNews[] = [
                'loc'     => '/berita/' . $p['slug'],
                'lastmod' => $p['updated_at'] ?? ($p['created_at'] ?? null),
            ];
        }
    }
}

// ============ BUILD XML ============
$today = date('Y-m-d');
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

foreach ($staticPages as $page) {
    echo "  <url>\n";
    echo "    <loc>" . htmlspecialchars($SITE_BASE . $page['loc'], ENT_XML1) . "</loc>\n";
    echo "    <lastmod>{$today}</lastmod>\n";
    echo "    <changefreq>{$page['changefreq']}</changefreq>\n";
    echo "    <priority>{$page['priority']}</priority>\n";
    echo "  </url>\n";
}

foreach ($dynamicNews as $news) {
    $lastmod = $news['lastmod'] ? date('Y-m-d', strtotime($news['lastmod'])) : $today;
    echo "  <url>\n";
    echo "    <loc>" . htmlspecialchars($SITE_BASE . $news['loc'], ENT_XML1) . "</loc>\n";
    echo "    <lastmod>{$lastmod}</lastmod>\n";
    echo "    <changefreq>monthly</changefreq>\n";
    echo "    <priority>0.7</priority>\n";
    echo "  </url>\n";
}

echo '</urlset>' . "\n";
