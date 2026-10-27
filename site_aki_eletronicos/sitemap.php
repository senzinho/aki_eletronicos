<?php
require_once __DIR__ . '/config/config.php';

header('Content-Type: application/xml; charset=UTF-8');

$staticPages = ['/', '/quem-somos.php', '/reparos.php', '/contato.php'];

$products = [];
try {
    $products = db()->query("SELECT slug, updated_at FROM products WHERE status = 'published'")->fetchAll();
} catch (Throwable $ex) {
    $products = [];
}

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<?php foreach ($staticPages as $path): ?>
    <url><loc><?= e(site_url(ltrim($path, '/'))) ?></loc></url>
<?php endforeach; ?>
<?php foreach ($products as $p): ?>
    <url>
        <loc><?= e(site_url('produto.php?slug=' . urlencode($p['slug']))) ?></loc>
        <lastmod><?= e(date('Y-m-d', strtotime($p['updated_at']))) ?></lastmod>
    </url>
<?php endforeach; ?>
</urlset>
