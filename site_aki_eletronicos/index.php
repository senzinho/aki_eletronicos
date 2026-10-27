<?php
require_once __DIR__ . '/config/config.php';

$pageTitle = get_setting('seo_title', 'Aki Eletrônicos — Smartphones e Assistência Técnica');
$pageDescription = get_setting('seo_description');

$categories = [];
$brands = [];
$products = [];
$mainBanners = [];
$offers = [];
$testimonials = [];
try {
    $categories = db()->query("SELECT * FROM categories WHERE is_active = 1 ORDER BY ordering ASC")->fetchAll();
    $brands = db()->query("SELECT * FROM brands WHERE is_active = 1 ORDER BY ordering ASC")->fetchAll();
    $products = db()->query("SELECT p.*, b.name AS brand_name, b.slug AS brand_slug FROM products p LEFT JOIN brands b ON b.id = p.brand_id WHERE p.status = 'published' ORDER BY p.is_featured DESC, p.ordering ASC LIMIT 8")->fetchAll();
    $mainBanners = db()->query("SELECT * FROM banners WHERE is_active = 1 AND (start_date IS NULL OR start_date <= CURDATE()) AND (end_date IS NULL OR end_date >= CURDATE()) ORDER BY ordering ASC")->fetchAll();
    $offers = db()->query("SELECT p.*, b.name AS brand_name FROM products p LEFT JOIN brands b ON b.id = p.brand_id WHERE p.status = 'published' AND p.price_from IS NOT NULL AND p.price_from > p.price_to ORDER BY ((p.price_from - p.price_to) / p.price_from) DESC LIMIT 3")->fetchAll();
    $testimonials = db()->query("SELECT * FROM testimonials WHERE is_active = 1 ORDER BY ordering ASC, id DESC LIMIT 6")->fetchAll();
} catch (Throwable $ex) {
    // Banco ainda não configurado/importado — a página segue renderizando com listas vazias.
}

$filterBrands = [];
foreach ($products as $p) {
    if (!empty($p['brand_slug']) && !isset($filterBrands[$p['brand_slug']])) {
        $filterBrands[$p['brand_slug']] = $p['brand_slug'] === 'apple' ? 'iPhone' : $p['brand_name'];
    }
}

require_once __DIR__ . '/includes/header.php';
?>

<section class="hero" id="hero">
    <div class="container hero-grid">
        <div class="hero-content reveal">
            <h1 class="hero-headline">Seu próximo celular <em>começa aqui.</em></h1>
            <p class="hero-subheadline">Tecnologia, qualidade e assistência especializada em um só lugar.</p>
            <div class="hero-cta">
                <a href="#celulares" class="btn btn-primary btn-lg">Ver celulares <?= btn_arrow() ?></a>
                <a href="/reparos.php" class="btn btn-ghost btn-lg">Preciso de um reparo</a>
            </div>
            <ul class="hero-trust">
                <li><?= icon('check') ?> Produtos selecionados</li>
                <li><?= icon('check') ?> Assistência especializada</li>
                <li><?= icon('check') ?> Garantia nos serviços</li>
            </ul>
        </div>

        <div class="hero-media reveal" style="--delay:1">
            <?php $heroVideo = get_setting('hero_video'); $heroPoster = get_setting('hero_video_poster'); ?>
            <?php if ($heroVideo): ?>
            <video autoplay muted loop playsinline poster="<?= e($heroPoster) ?>">
                <source src="<?= e($heroVideo) ?>" type="video/mp4">
            </video>
            <?php else: ?>
            <div class="hero-fallback" style="<?= $heroPoster ? "background-image:url('" . e($heroPoster) . "')" : '' ?>"></div>
            <?php endif; ?>
            <span class="hero-media-badge">📱 Smartphones selecionados</span>
        </div>
    </div>
</section>

<div class="trust-bar">
    <div class="container trust-bar-inner">
        <span class="trust-item"><?= icon('headset') ?> Atendimento especializado</span>
        <span class="trust-item"><?= icon('shield') ?> Produtos selecionados</span>
        <span class="trust-item"><?= icon('check') ?> Garantia</span>
        <span class="trust-item"><?= icon('lock') ?> Compra segura</span>
        <span class="trust-item"><?= icon('support') ?> Suporte pós-venda</span>
    </div>
</div>

<?php require __DIR__ . '/includes/promo-bar.php'; ?>

<?php if (!empty($mainBanners)): ?>
<section class="banner-carousel" id="banner-carousel">
    <div class="banner-track">
        <?php foreach ($mainBanners as $i => $banner): ?>
        <a class="banner-slide <?= $i === 0 ? 'active' : '' ?>" href="<?= e($banner['url'] ?: '#') ?>" data-track="banner_click" data-banner-id="<?= (int)$banner['id'] ?>">
            <picture>
                <?php if (!empty($banner['image_mobile'])): ?><source media="(max-width: 768px)" srcset="<?= e($banner['image_mobile']) ?>"><?php endif; ?>
                <img src="<?= e($banner['image_desktop'] ?: '/assets/images/banner-placeholder.jpg') ?>" alt="<?= e($banner['title'] ?? '') ?>" loading="lazy">
            </picture>
            <?php if (!empty($banner['title'])): ?>
            <div class="banner-caption">
                <h3><?= e($banner['title']) ?></h3>
                <?php if (!empty($banner['subtitle'])): ?><p><?= e($banner['subtitle']) ?></p><?php endif; ?>
                <?php if (!empty($banner['cta_text'])): ?><span class="btn btn-primary"><?= e($banner['cta_text']) ?></span><?php endif; ?>
            </div>
            <?php endif; ?>
        </a>
        <?php endforeach; ?>
    </div>
    <?php if (count($mainBanners) > 1): ?>
    <div class="banner-dots">
        <?php foreach ($mainBanners as $i => $banner): ?>
        <button class="banner-dot <?= $i === 0 ? 'active' : '' ?>" data-index="<?= $i ?>" aria-label="Slide <?= $i + 1 ?>"></button>
        <?php endforeach; ?>
    </div>
    <?php endif; ?>
</section>
<?php endif; ?>

<section class="section" id="categorias">
    <div class="container">
        <div class="section-header reveal">
            <h2 class="section-title">Tudo para deixar sua tecnologia completa.</h2>
        </div>
        <div class="categories-grid">
            <?php foreach ($categories as $cat): ?>
            <a href="/index.php#celulares" class="category-card reveal">
                <span class="category-icon"><?= category_icon($cat['icon'] ?? '') ?></span>
                <span class="category-card-footer">
                    <span class="category-name"><?= e($cat['name']) ?></span>
                    <svg class="category-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>
                </span>
            </a>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<section class="section section-soft" id="celulares">
    <div class="container">
        <div class="section-header reveal">
            <span class="section-eyebrow">Catálogo</span>
            <h2 class="section-title">Encontre seu próximo celular.</h2>
            <p class="section-description">Os principais modelos para acompanhar sua rotina.</p>
        </div>

        <?php if (empty($products)): ?>
        <p class="empty-state">Novidades chegando em breve. Fale com a gente pelo WhatsApp para saber os produtos disponíveis agora.</p>
        <?php else: ?>
        <?php if (!empty($filterBrands)): ?>
        <div class="filter-pills" id="product-filters" role="group" aria-label="Filtrar por marca">
            <button type="button" class="filter-pill active" data-filter="all">Todos</button>
            <?php foreach ($filterBrands as $slug => $label): ?>
            <button type="button" class="filter-pill" data-filter="<?= e($slug) ?>"><?= e($label) ?></button>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>

        <div class="products-grid" id="product-grid">
            <?php foreach ($products as $product):
                $discount = null;
                if (!empty($product['price_from']) && $product['price_from'] > $product['price_to']) {
                    $discount = round((1 - ($product['price_to'] / $product['price_from'])) * 100);
                }
            ?>
            <article class="product-card reveal" data-brand="<?= e($product['brand_slug'] ?? '') ?>">
                <a href="/produto.php?slug=<?= urlencode($product['slug']) ?>" class="product-link">
                    <div class="product-image">
                        <img src="<?= e($product['main_image'] ?: '/assets/images/product-placeholder.jpg') ?>" alt="<?= e($product['name']) ?>" loading="lazy">
                        <?php if (!empty($product['badge'])): ?><span class="badge"><?= e($product['badge']) ?></span><?php endif; ?>
                        <?php if ($discount): ?><span class="badge badge-discount">-<?= (int)$discount ?>%</span><?php endif; ?>
                    </div>
                    <div class="product-body">
                        <?php if (!empty($product['brand_name'])): ?><span class="product-brand"><?= e($product['brand_name']) ?></span><?php endif; ?>
                        <h3 class="product-name"><?= e($product['name']) ?></h3>
                        <?php if (!empty($product['subtitle'])): ?><p class="product-subtitle"><?= e($product['subtitle']) ?></p><?php endif; ?>
                        <div class="product-price">
                            <?php if (!empty($product['price_from'])): ?><span class="price-from"><?= format_price((float)$product['price_from']) ?></span><?php endif; ?>
                            <span class="price-to"><?= format_price((float)$product['price_to']) ?></span>
                        </div>
                    </div>
                </a>
                <div class="product-card-actions">
                    <a class="btn btn-ghost btn-sm" href="/produto.php?slug=<?= urlencode($product['slug']) ?>">Ver detalhes</a>
                    <a class="btn btn-primary btn-sm" target="_blank" rel="noopener" data-track="whatsapp_click" data-product-id="<?= (int)$product['id'] ?>"
                       href="<?= e(whatsapp_link('Olá! Tenho interesse no produto ' . $product['name'] . '. Gostaria de saber mais informações.')) ?>">
                        Comprar
                    </a>
                </div>
            </article>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
    </div>
</section>

<section class="section" style="padding-top:0; padding-bottom:56px;">
    <div class="container">
        <div class="brands-track">
            <?php $brandLoop = array_merge($brands, $brands); foreach ($brandLoop as $brand): ?>
            <span class="brand-item"><?= e($brand['name']) ?></span>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<section class="section section-soft" id="acessorios">
    <div class="container">
        <div class="section-header reveal">
            <span class="section-eyebrow">Acessórios</span>
            <h2 class="section-title">Complete a experiência do seu celular.</h2>
        </div>
        <div class="accessories-scroll reveal">
            <?php
            $accessories = [
                ['case', 'Capinhas'], ['film', 'Películas'], ['cable', 'Cabos'],
                ['charger', 'Carregadores'], ['headset', 'Fones'], ['stand', 'Suportes'], ['powerbank', 'Power banks'],
            ];
            foreach ($accessories as [$iconKey, $label]):
            ?>
            <a class="accessory-card" target="_blank" rel="noopener" data-track="whatsapp_click"
               href="<?= e(whatsapp_link('Olá! Tenho interesse em ' . $label . '. Quais opções vocês têm disponíveis?')) ?>">
                <span class="accessory-icon"><?= icon($iconKey) ?></span>
                <h3><?= e($label) ?></h3>
            </a>
            <?php endforeach; ?>
        </div>
        <div style="text-align:center; margin-top:32px;">
            <a class="btn btn-ghost" target="_blank" rel="noopener" data-track="whatsapp_click"
               href="<?= e(whatsapp_link('Olá! Gostaria de ver as opções de acessórios disponíveis.')) ?>">Ver acessórios <?= btn_arrow() ?></a>
        </div>
    </div>
</section>

<?php if (!empty($offers)): ?>
<section class="section offers-section">
    <div class="container">
        <div class="section-header reveal">
            <span class="section-eyebrow" style="color:var(--color-red-dark)">Ofertas</span>
            <h2 class="section-title">Condições especiais por tempo limitado.</h2>
        </div>
        <div class="offers-grid">
            <?php foreach ($offers as $offer):
                $off = round((1 - ($offer['price_to'] / $offer['price_from'])) * 100);
            ?>
            <article class="product-card reveal">
                <a href="/produto.php?slug=<?= urlencode($offer['slug']) ?>" class="product-link">
                    <div class="product-image">
                        <img src="<?= e($offer['main_image'] ?: '/assets/images/product-placeholder.jpg') ?>" alt="<?= e($offer['name']) ?>" loading="lazy">
                        <span class="badge" style="background:var(--color-red)">OFERTA</span>
                        <span class="badge badge-discount">-<?= (int)$off ?>%</span>
                    </div>
                    <div class="product-body">
                        <?php if (!empty($offer['brand_name'])): ?><span class="product-brand"><?= e($offer['brand_name']) ?></span><?php endif; ?>
                        <h3 class="product-name"><?= e($offer['name']) ?></h3>
                        <div class="product-price">
                            <span class="price-from"><?= format_price((float)$offer['price_from']) ?></span>
                            <span class="price-to"><?= format_price((float)$offer['price_to']) ?></span>
                        </div>
                    </div>
                </a>
                <div class="product-card-actions">
                    <a class="btn btn-primary btn-block btn-sm" target="_blank" rel="noopener" data-track="whatsapp_click" data-product-id="<?= (int)$offer['id'] ?>"
                       href="<?= e(whatsapp_link('Olá! Tenho interesse na oferta do produto ' . $offer['name'] . '.')) ?>">Aproveitar oferta</a>
                </div>
            </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<?php endif; ?>

<section class="section repairs-teaser">
    <div class="container repairs-teaser-inner reveal">
        <div>
            <span class="section-eyebrow">Assistência técnica</span>
            <h2 class="section-title">Seu celular parou. A gente resolve.</h2>
            <p class="section-description" style="margin-bottom:24px;">Diagnóstico preciso, reparos especializados e cuidado em cada detalhe.</p>
            <ul class="repairs-list">
                <li>Troca de tela</li>
                <li>Troca de bateria</li>
                <li>Conector de carga</li>
                <li>Diagnóstico completo</li>
                <li>Formatação e software</li>
                <li>Outros reparos</li>
            </ul>
            <a href="/reparos.php" class="btn btn-primary">Solicitar orçamento <?= btn_arrow() ?></a>
        </div>
    </div>
</section>

<section class="section" id="quem-somos">
    <div class="container about-teaser-inner">
        <div class="about-teaser-image reveal">
            <img src="/assets/images/loja.jpg" alt="Loja Aki Eletrônicos" loading="lazy">
        </div>
        <div class="reveal">
            <span class="section-eyebrow">Sobre nós</span>
            <h2 class="section-title">Quem somos</h2>
            <p>Somos especialistas em assistência técnica de celulares e informática, oferecendo serviços ágeis, confiáveis e de alta qualidade. Trabalhamos com diversas marcas, incluindo Xiaomi, iPhone, JBL, Samsung e muitas outras.</p>
            <a href="/quem-somos.php" class="btn btn-ghost">Conhecer a Aki Eletrônicos <?= btn_arrow() ?></a>
        </div>
    </div>
</section>

<?php if (!empty($testimonials)): ?>
<section class="section section-soft">
    <div class="container">
        <div class="section-header reveal">
            <span class="section-eyebrow">Depoimentos</span>
            <h2 class="section-title">Quem compra, recomenda.</h2>
        </div>
        <div class="testimonials-grid">
            <?php foreach ($testimonials as $t): ?>
            <div class="testimonial-card reveal">
                <div class="testimonial-stars">
                    <?php for ($i = 0; $i < (int)$t['rating']; $i++): ?><?= icon('star') ?><?php endfor; ?>
                </div>
                <p>&ldquo;<?= e($t['comment']) ?>&rdquo;</p>
                <div class="testimonial-author">
                    <span class="testimonial-avatar"><?= e(mb_strtoupper(mb_substr($t['author_name'], 0, 1))) ?></span>
                    <div>
                        <div class="testimonial-name"><?= e($t['author_name']) ?></div>
                        <?php if ($t['context']): ?><div class="testimonial-context"><?= e($t['context']) ?></div><?php endif; ?>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<?php endif; ?>

<section class="section" style="text-align:center;">
    <div class="container reveal">
        <span class="section-eyebrow">Instagram</span>
        <h2 class="section-title">Acompanhe de perto.</h2>
        <p class="section-description" style="margin-left:auto; margin-right:auto;">Bastidores, produtos e reparos no nosso Instagram.</p>
        <div class="instagram-grid">
            <?php $igImages = ['/assets/images/loja.jpg', '/assets/images/product-placeholder.jpg', '/assets/images/banner-placeholder.jpg']; foreach ($igImages as $img): ?>
            <a class="instagram-tile" href="<?= e(get_setting('instagram')) ?>" target="_blank" rel="noopener">
                <img src="<?= e($img) ?>" alt="Aki Eletrônicos no Instagram" loading="lazy">
                <span class="instagram-tile-overlay"><?= icon('instagram') ?></span>
            </a>
            <?php endforeach; ?>
        </div>
        <div style="margin-top:32px;">
            <a class="btn btn-dark" href="<?= e(get_setting('instagram')) ?>" target="_blank" rel="noopener">Ver no Instagram <?= btn_arrow() ?></a>
        </div>
    </div>
</section>

<section class="section section-dark" id="localizacao">
    <div class="container location-inner">
        <div class="reveal">
            <span class="section-eyebrow" style="color:var(--color-green-light)">Localização</span>
            <h2 class="section-title">Venha nos visitar.</h2>
            <ul class="location-details">
                <li><strong>Endereço:</strong> <?= e(get_setting('endereco')) ?></li>
                <li><strong>Telefone/WhatsApp:</strong> <?= e(get_setting('telefone')) ?></li>
                <li><strong>E-mail:</strong> <?= e(get_setting('email')) ?></li>
                <li><strong>Horário:</strong> <?= e(get_setting('horario_atendimento')) ?></li>
            </ul>
            <a href="<?= e(get_setting('google_maps')) ?>" target="_blank" rel="noopener" class="btn btn-primary">Como chegar <?= btn_arrow() ?></a>
        </div>
        <div class="location-map reveal">
            <iframe src="<?= e(get_setting('google_maps')) ?>" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Mapa - <?= e(get_setting('nome_empresa')) ?>"></iframe>
        </div>
    </div>
</section>

<?php require __DIR__ . '/includes/footer.php'; ?>
