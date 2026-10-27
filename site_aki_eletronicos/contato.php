<?php
require_once __DIR__ . '/config/config.php';

$pageTitle = 'Contato — ' . get_setting('nome_empresa', 'Aki Eletrônicos');
$pageDescription = 'Fale com a Aki Eletrônicos pelo WhatsApp, telefone, e-mail ou venha nos visitar em Colombo/PR.';

$errors = [];
$success = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_verify($_POST['csrf_token'] ?? null)) {
        $errors[] = 'Sessão expirada, por favor tente novamente.';
    } else {
        $name = trim((string)($_POST['name'] ?? ''));
        $phone = trim((string)($_POST['phone'] ?? ''));
        $email = trim((string)($_POST['email'] ?? ''));
        $message = trim((string)($_POST['message'] ?? ''));

        if ($name === '') $errors[] = 'Informe seu nome.';
        if ($phone === '') $errors[] = 'Informe um telefone para contato.';
        if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Informe um e-mail válido.';
        if ($message === '') $errors[] = 'Escreva sua mensagem.';

        if (empty($errors)) {
            try {
                $stmt = db()->prepare("INSERT INTO service_requests (type, name, phone, email, message) VALUES ('contato', ?, ?, ?, ?)");
                $stmt->execute([$name, $phone, $email ?: null, $message]);
                $success = true;
            } catch (Throwable $ex) {
                $errors[] = 'Não foi possível enviar sua mensagem agora. Tente novamente ou fale pelo WhatsApp.';
            }
        }
    }
}

require_once __DIR__ . '/includes/header.php';
?>

<section class="section page-hero">
    <div class="container">
        <h1 class="section-title reveal">Entre em contato</h1>
        <p class="section-description reveal">Para maiores informações sobre nossos serviços e produtos, preencha nosso formulário ou fale diretamente conosco.</p>
    </div>
</section>

<section class="section contact-page">
    <div class="container contact-page-grid">
        <div class="form-card reveal">
            <?php if ($success): ?>
            <div class="alert alert-success">
                Mensagem enviada com sucesso! Em breve entraremos em contato.
            </div>
            <?php endif; ?>
            <?php if (!empty($errors)): ?>
            <div class="alert alert-error">
                <ul><?php foreach ($errors as $err): ?><li><?= e($err) ?></li><?php endforeach; ?></ul>
            </div>
            <?php endif; ?>
            <form method="post" action="/contato.php" novalidate>
                <?= csrf_field() ?>
                <label for="name">Nome</label>
                <input type="text" id="name" name="name" required value="<?= e($_POST['name'] ?? '') ?>">

                <label for="email">E-mail</label>
                <input type="email" id="email" name="email" value="<?= e($_POST['email'] ?? '') ?>">

                <label for="phone">Telefone</label>
                <input type="tel" id="phone" name="phone" required placeholder="(41) 90000-0000" value="<?= e($_POST['phone'] ?? '') ?>">

                <label for="message">Mensagem</label>
                <textarea id="message" name="message" rows="5" required><?= e($_POST['message'] ?? '') ?></textarea>

                <button type="submit" class="btn btn-primary btn-block">Enviar mensagem <?= btn_arrow() ?></button>
            </form>
        </div>

        <div class="reveal">
            <div class="location-map">
                <iframe src="<?= e(get_setting('google_maps')) ?>" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Mapa - <?= e(get_setting('nome_empresa')) ?>"></iframe>
            </div>
            <ul class="location-details">
                <li><strong><?= e(get_setting('nome_empresa')) ?></strong></li>
                <li><?= e(get_setting('endereco')) ?></li>
                <li>Tel: <?= e(get_setting('telefone')) ?></li>
                <li>E-mail: <?= e(get_setting('email')) ?></li>
            </ul>
            <div class="social-icons">
                <?php if ($fb = get_setting('facebook')): ?><a href="<?= e($fb) ?>" target="_blank" rel="noopener" aria-label="Facebook">Facebook</a><?php endif; ?>
                <?php if ($ig = get_setting('instagram')): ?><a href="<?= e($ig) ?>" target="_blank" rel="noopener" aria-label="Instagram">Instagram</a><?php endif; ?>
            </div>
        </div>
    </div>
</section>

<?php require __DIR__ . '/includes/footer.php'; ?>
