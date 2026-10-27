<?php
require_once __DIR__ . '/config/config.php';

$pageTitle = 'Sobre — ' . get_setting('nome_empresa', 'Aki Eletrônicos');
$pageDescription = 'Conheça a Aki Eletrônicos: especialistas em smartphones, acessórios e assistência técnica em Colombo/PR.';

require_once __DIR__ . '/includes/header.php';
?>

<section class="section" style="padding-bottom:0;">
    <div class="container">
        <span class="section-eyebrow reveal">Sobre nós</span>
        <h1 class="section-title reveal">Uma empresa moderna, confiável e especializada em tecnologia.</h1>
    </div>
</section>

<section class="section about-page">
    <div class="container about-teaser-inner">
        <div class="about-teaser-image reveal">
            <img src="/assets/images/loja.jpg" alt="Fachada e interior da loja Aki Eletrônicos" loading="lazy">
        </div>
        <div class="reveal">
            <p>Somos especialistas em assistência técnica de celulares e informática, oferecendo serviços ágeis, confiáveis e de alta qualidade. Trabalhamos com diversas marcas, incluindo Xiaomi, iPhone, JBL, Samsung e muitas outras.</p>
            <p>Além disso, prestamos serviços de informática, como formatação, reparo de hardware e otimização de sistemas, garantindo soluções eficientes para seus dispositivos.</p>
            <p>Conte com nossa experiência e compromisso para manter seus equipamentos sempre em perfeito funcionamento!</p>
        </div>
    </div>
</section>

<section class="section section-soft">
    <div class="container">
        <div class="why-grid">
            <div class="why-card reveal">
                <span class="why-icon"><?= icon('diagnostic') ?></span>
                <h3>Missão</h3>
                <p>Oferecer smartphones, acessórios e serviços de assistência técnica com agilidade, confiança e preços justos para todos os nossos clientes.</p>
            </div>
            <div class="why-card reveal">
                <span class="why-icon"><?= icon('shield') ?></span>
                <h3>Valores</h3>
                <p>Transparência, qualidade no atendimento e compromisso real com a satisfação de quem confia seu aparelho a nós.</p>
            </div>
            <div class="why-card reveal">
                <span class="why-icon"><?= icon('star') ?></span>
                <h3>Diferenciais</h3>
                <p>Trabalhamos com as principais marcas do mercado e prestamos serviços completos de informática, tudo em um só lugar.</p>
            </div>
            <div class="why-card reveal">
                <span class="why-icon"><?= icon('headset') ?></span>
                <h3>Atendimento</h3>
                <p>Suporte próximo e humano, do primeiro contato ao pós-venda, sempre pelo WhatsApp ou presencialmente na loja.</p>
            </div>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="section-header reveal">
            <h2 class="section-title">Marcas com as quais trabalhamos</h2>
        </div>
        <?php
        $brands = [];
        try { $brands = db()->query("SELECT * FROM brands WHERE is_active = 1 ORDER BY ordering ASC")->fetchAll(); } catch (Throwable $ex) {}
        ?>
    </div>
    <div class="brands-track">
        <?php $brandLoop = array_merge($brands, $brands); foreach ($brandLoop as $brand): ?>
        <span class="brand-item"><?= e($brand['name']) ?></span>
        <?php endforeach; ?>
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
            <a href="<?= e(whatsapp_link('Olá! Vim pelo site e gostaria de saber mais informações.')) ?>" target="_blank" rel="noopener" class="btn btn-whatsapp" data-track="whatsapp_click"><?= whatsapp_icon() ?> Falar no WhatsApp</a>
        </div>
        <div class="location-map reveal">
            <iframe src="<?= e(get_setting('google_maps')) ?>" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Mapa - <?= e(get_setting('nome_empresa')) ?>"></iframe>
        </div>
    </div>
</section>

<?php require __DIR__ . '/includes/footer.php'; ?>
