<?php
require_once __DIR__ . '/config/config.php';

$slug = isset($_GET['slug']) ? trim((string)$_GET['slug']) : '';
$product = null;
$gallery = [];
$related = [];

if ($slug !== '') {
    try {
        $stmt = db()->prepare("SELECT p.*, b.name AS brand_name, c.name AS category_name FROM products p
            LEFT JOIN brands b ON b.id = p.brand_id
            LEFT JOIN categories c ON c.id = p.category_id
            WHERE p.slug = ? AND p.status = 'published' LIMIT 1");
        $stmt->execute([$slug]);
        $product = $stmt->fetch() ?: null;

        if ($product) {
            $imgStmt = db()->prepare("SELECT image FROM product_images WHERE product_id = ? ORDER BY ordering ASC");
            $imgStmt->execute([$product['id']]);
            $gallery = array_column($imgStmt->fetchAll(), 'image');
            if (empty($gallery) && !empty($product['main_image'])) {
                $gallery[] = $product['main_image'];
            }

            $relStmt = db()->prepare("SELECT * FROM products WHERE status = 'published' AND id != ? AND (brand_id = ? OR category_id = ?) ORDER BY RAND() LIMIT 4");
            $relStmt->execute([$product['id'], $product['brand_id'], $product['category_id']]);
            $related = $relStmt->fetchAll();

            track_event('product_view', (int)$product['id'], null, '/produto.php?slug=' . $slug);
        }
    } catch (Throwable $ex) {
        $product = null;
    }
}

if (!$product) {
    http_response_code(404);
}

$pageTitle = $product ? ($product['seo_title'] ?: $product['name'] . ' — ' . get_setting('nome_empresa')) : 'Produto não encontrado';
$pageDescription = $product ? ($product['seo_description'] ?: $product['subtitle'] ?? '') : 'O produto solicitado não foi encontrado.';

require_once __DIR__ . '/includes/header.php';
?>

<?php if (!$product): ?>
<section class="section not-found">
    <div class="container">
        <h1 class="section-title">Produto não encontrado</h1>
        <p>O produto que você procura não está mais disponível.</p>
        <a href="/index.php#celulares" class="btn btn-primary">Ver outros celulares</a>
    </div>
</section>
<?php else:
    $discount = null;
    if (!empty($product['price_from']) && $product['price_from'] > $product['price_to']) {
        $discount = round((1 - ($product['price_to'] / $product['price_from'])) * 100);
    }
    $whatsappMsg = 'Olá! Tenho interesse no produto ' . $product['name'] . '. Gostaria de saber mais informações.';
?>
<section class="section product-page">
    <div class="container product-page-grid">
        <div class="product-gallery reveal">
            <div class="product-gallery-main">
                <img id="gallery-main-image" src="<?= e($gallery[0] ?? '/assets/images/product-placeholder.jpg') ?>" alt="<?= e($product['name']) ?>">
                <?php if (!empty($product['badge'])): ?><span class="badge"><?= e($product['badge']) ?></span><?php endif; ?>
                <?php if ($discount): ?><span class="badge badge-discount">-<?= (int)$discount ?>%</span><?php endif; ?>
            </div>
            <?php if (count($gallery) > 1): ?>
            <div class="product-gallery-thumbs">
                <?php foreach ($gallery as $img): ?>
                <button class="thumb" data-src="<?= e($img) ?>"><img src="<?= e($img) ?>" alt=""></button>
                <?php endforeach; ?>
            </div>
            <?php endif; ?>
        </div>

        <div class="product-info reveal">
            <?php if (!empty($product['brand_name'])): ?><span class="product-brand"><?= e($product['brand_name']) ?></span><?php endif; ?>
            <h1><?= e($product['name']) ?></h1>
            <?php if (!empty($product['subtitle'])): ?><p class="product-subtitle"><?= e($product['subtitle']) ?></p><?php endif; ?>

            <?php if ($product['rating_count'] > 0): ?>
            <div class="rating" aria-label="Avaliação <?= e((string)$product['rating_avg']) ?> de 5">
                <?php for ($i = 1; $i <= 5; $i++): ?>
                    <span class="star <?= $i <= round((float)$product['rating_avg']) ? 'filled' : '' ?>">★</span>
                <?php endfor; ?>
                <span class="rating-count">(<?= (int)$product['rating_count'] ?> avaliações)</span>
            </div>
            <?php endif; ?>

            <div class="product-price product-price-lg">
                <?php if (!empty($product['price_from'])): ?><span class="price-from"><?= format_price((float)$product['price_from']) ?></span><?php endif; ?>
                <span class="price-to"><?= format_price((float)$product['price_to']) ?></span>
            </div>

            <span class="availability">✔ Disponível — consulte condições</span>

            <a class="btn btn-whatsapp btn-lg btn-block" target="_blank" rel="noopener" data-track="whatsapp_click" data-product-id="<?= (int)$product['id'] ?>"
               href="<?= e(whatsapp_link($whatsappMsg)) ?>">
                <?= whatsapp_icon() ?> Comprar pelo WhatsApp
            </a>

            <?php if (!empty($product['description'])): ?>
            <div class="product-description">
                <h2>Descrição</h2>
                <p><?= nl2br(e($product['description'])) ?></p>
            </div>
            <?php endif; ?>

            <ul class="product-extra-info">
                <?php if (!empty($product['category_name'])): ?><li><strong>Categoria:</strong> <?= e($product['category_name']) ?></li><?php endif; ?>
                <li><strong>Garantia e trocas:</strong> consulte condições pelo WhatsApp</li>
            </ul>
        </div>
    </div>

    <?php if (!empty($related)): ?>
    <div class="container">
        <h2 class="section-title reveal">Produtos relacionados</h2>
        <div class="products-grid">
            <?php foreach ($related as $rp): ?>
            <article class="product-card reveal">
                <a href="/produto.php?slug=<?= urlencode($rp['slug']) ?>" class="product-link">
                    <div class="product-image">
                        <img src="<?= e($rp['main_image'] ?: '/assets/images/product-placeholder.jpg') ?>" alt="<?= e($rp['name']) ?>" loading="lazy">
                    </div>
                    <div class="product-body">
                        <h3 class="product-name"><?= e($rp['name']) ?></h3>
                        <div class="product-price"><span class="price-to"><?= format_price((float)$rp['price_to']) ?></span></div>
                    </div>
                </a>
            </article>
            <?php endforeach; ?>
        </div>
    </div>
    <?php endif; ?>
</section>
<?php endif; ?>

<?php require __DIR__ . '/includes/footer.php'; ?>
