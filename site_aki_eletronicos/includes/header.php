<?php
/**
 * @var string $pageTitle
 * @var string $pageDescription
 */
$pageTitle = $pageTitle ?? get_setting('seo_title', 'Aki Eletrônicos');
$pageDescription = $pageDescription ?? get_setting('seo_description', '');
$companyName = get_setting('nome_empresa', 'Aki Eletrônicos');
$whatsappNumber = get_setting('whatsapp', '5541998132536');
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$currentPath = parse_url($requestUri, PHP_URL_PATH);

track_event('page_view', null, null, $currentPath);
?><!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title><?= e($pageTitle) ?></title>
<meta name="description" content="<?= e($pageDescription) ?>">
<link rel="canonical" href="<?= e(site_url(ltrim($requestUri, '/'))) ?>">

<meta property="og:type" content="website">
<meta property="og:site_name" content="<?= e($companyName) ?>">
<meta property="og:title" content="<?= e($pageTitle) ?>">
<meta property="og:description" content="<?= e($pageDescription) ?>">
<?php $ogImage = get_setting('og_image'); if ($ogImage): ?>
<meta property="og:image" content="<?= e(site_url($ogImage)) ?>">
<?php endif; ?>
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<?= e($pageTitle) ?>">
<meta name="twitter:description" content="<?= e($pageDescription) ?>">

<meta name="theme-color" content="#FFFFFF">
<link rel="icon" href="<?= e(get_setting('favicon') ?: '/assets/images/favicon.png') ?>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/style.css">

<script type="application/ld+json">
<?= json_encode([
    '@context' => 'https://schema.org',
    '@type' => 'LocalBusiness',
    'name' => $companyName,
    'image' => site_url($ogImage ?: '/assets/images/logo.png'),
    'telephone' => get_setting('telefone'),
    'email' => get_setting('email'),
    'address' => [
        '@type' => 'PostalAddress',
        'streetAddress' => get_setting('endereco'),
        'addressRegion' => 'PR',
        'addressCountry' => 'BR',
    ],
    'url' => site_url(''),
    'sameAs' => array_filter([get_setting('facebook'), get_setting('instagram')]),
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?>
</script>
</head>
<body>

<header class="site-header" id="site-header">
    <div class="container header-inner">
        <a href="/" class="logo" aria-label="<?= e($companyName) ?> — página inicial">
            <?php $logo = get_setting('logo'); ?>
            <?php if ($logo): ?>
                <img src="<?= e($logo) ?>" alt="<?= e($companyName) ?>" height="34">
            <?php else: ?>
                <span class="logo-text"><?= e($companyName) ?></span>
            <?php endif; ?>
        </a>

        <nav class="main-nav" id="main-nav" aria-label="Navegação principal">
            <ul>
                <li><a href="/" class="<?= $currentPath === '/' || $currentPath === '/index.php' ? 'active' : '' ?>">Início</a></li>
                <li><a href="/index.php#celulares">Celulares</a></li>
                <li><a href="/reparos.php" class="<?= str_contains((string)$currentPath, 'reparos') ? 'active' : '' ?>">Assistência</a></li>
                <li><a href="/index.php#acessorios">Acessórios</a></li>
                <li><a href="/quem-somos.php" class="<?= str_contains((string)$currentPath, 'quem-somos') ? 'active' : '' ?>">Sobre</a></li>
                <li><a href="/contato.php" class="<?= str_contains((string)$currentPath, 'contato') ? 'active' : '' ?>">Contato</a></li>
            </ul>
        </nav>

        <a class="btn btn-whatsapp header-cta" target="_blank" rel="noopener"
           href="<?= e(whatsapp_link('Olá! Vim pelo site e gostaria de saber mais informações.')) ?>"
           data-track="whatsapp_click">
            <?= whatsapp_icon() ?> Falar no WhatsApp
        </a>

        <button class="hamburger" id="hamburger" aria-label="Abrir menu" aria-expanded="false" aria-controls="mobile-menu">
            <span></span><span></span><span></span>
        </button>
    </div>

    <div class="mobile-menu" id="mobile-menu">
        <ul>
            <li><a href="/">Início</a></li>
            <li><a href="/index.php#celulares">Celulares</a></li>
            <li><a href="/reparos.php">Assistência</a></li>
            <li><a href="/index.php#acessorios">Acessórios</a></li>
            <li><a href="/quem-somos.php">Sobre</a></li>
            <li><a href="/contato.php">Contato</a></li>
        </ul>
        <a class="btn btn-whatsapp btn-block" target="_blank" rel="noopener"
           href="<?= e(whatsapp_link('Olá! Vim pelo site e gostaria de saber mais informações.')) ?>"
           data-track="whatsapp_click"><?= whatsapp_icon() ?> Falar no WhatsApp</a>
    </div>
</header>

<main>
