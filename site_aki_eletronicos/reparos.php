<?php
require_once __DIR__ . '/config/config.php';

$pageTitle = 'Assistência Técnica — ' . get_setting('nome_empresa', 'Aki Eletrônicos');
$pageDescription = 'Assistência técnica especializada: troca de tela, bateria, conector de carga, câmera, diagnóstico e reparos de smartphones em Colombo/PR.';

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_verify($_POST['csrf_token'] ?? null)) {
        $errors[] = 'Sessão expirada, por favor tente novamente.';
    } else {
        $name = trim((string)($_POST['name'] ?? ''));
        $deviceModel = trim((string)($_POST['device_model'] ?? ''));
        $problemType = trim((string)($_POST['problem_type'] ?? ''));
        $phone = trim((string)($_POST['phone'] ?? ''));

        if ($name === '') $errors[] = 'Informe seu nome.';
        if ($deviceModel === '') $errors[] = 'Informe o modelo do aparelho.';
        if ($problemType === '') $errors[] = 'Informe o tipo de problema.';
        if ($phone === '') $errors[] = 'Informe um telefone para contato.';

        if (empty($errors)) {
            try {
                $stmt = db()->prepare("INSERT INTO service_requests (type, name, phone, device_model, problem_type) VALUES ('reparo', ?, ?, ?, ?)");
                $stmt->execute([$name, $phone, $deviceModel, $problemType]);
            } catch (Throwable $ex) {
                // Mesmo se o registro falhar, seguimos o fluxo de contato via WhatsApp.
            }

            $msg = "Olá! Gostaria de solicitar um orçamento para reparo do meu celular.\n"
                . "Nome: {$name}\nModelo: {$deviceModel}\nProblema: {$problemType}\nTelefone: {$phone}";
            redirect(whatsapp_link($msg));
        }
    }
}

$services = [
    ['screen', 'Troca de tela', 'Peças de qualidade e instalação precisa.'],
    ['battery', 'Troca de bateria', 'Recupere a autonomia do seu aparelho.'],
    ['charger', 'Conector de carga', 'Diagnóstico e reparo de carregamento.'],
    ['camera', 'Câmera', 'Reparo de módulos de câmera frontal e traseira.'],
    ['speaker', 'Alto-falante', 'Áudio e viva-voz funcionando como novo.'],
    ['mic', 'Microfone', 'Correção de falhas de captação de áudio.'],
    ['software', 'Software', 'Ajustes e otimização do sistema.'],
    ['reset', 'Formatação', 'Formatação segura com backup dos seus dados.'],
    ['diagnostic', 'Diagnóstico', 'Identificação precisa da causa do problema.'],
    ['wrench', 'Outros reparos', 'Consulte-nos sobre qualquer outro problema.'],
];

$processSteps = [
    ['01', 'Você chama', 'Fale com a gente pelo WhatsApp e descreva o problema.'],
    ['02', 'Diagnosticamos', 'Avaliamos seu aparelho com precisão técnica.'],
    ['03', 'Você aprova', 'Apresentamos o orçamento antes de qualquer reparo.'],
    ['04', 'Nós reparamos', 'Executamos o serviço com peças de qualidade.'],
];

$differentials = [
    ['support', 'Técnicos especializados', 'Equipe treinada para cada tipo de reparo.'],
    ['diagnostic', 'Diagnóstico profissional', 'Identificamos a causa real antes de agir.'],
    ['shield', 'Peças de qualidade', 'Componentes selecionados para durabilidade.'],
    ['check', 'Garantia no serviço', 'Reparo com garantia e transparência total.'],
    ['lock', 'Transparência', 'Você aprova o orçamento antes de começarmos.'],
    ['headset', 'Atendimento rápido', 'Resposta ágil pelo WhatsApp.'],
];

require_once __DIR__ . '/includes/header.php';
?>

<section class="section section-dark" style="padding-bottom:64px;">
    <div class="container">
        <span class="section-eyebrow" style="color:var(--color-green-light)">Assistência técnica</span>
        <h1 class="section-title reveal" style="font-size:clamp(2rem,4vw,3rem); max-width:680px;">Seu celular parou. A gente resolve.</h1>
        <p class="section-description reveal" style="max-width:560px;">Diagnóstico preciso, reparos especializados e cuidado em cada detalhe.</p>
        <a href="#orcamento" class="btn btn-primary btn-lg reveal">Solicitar orçamento <?= btn_arrow() ?></a>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="section-header reveal">
            <h2 class="section-title">Serviços</h2>
        </div>
        <div class="service-grid">
            <?php foreach ($services as [$iconKey, $name, $desc]): ?>
            <div class="service-card reveal">
                <span class="service-icon"><?= icon($iconKey) ?></span>
                <h3><?= e($name) ?></h3>
                <p><?= e($desc) ?></p>
                <a href="#orcamento" class="btn">Solicitar orçamento <?= btn_arrow() ?></a>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<section class="section section-soft">
    <div class="container">
        <div class="section-header reveal">
            <h2 class="section-title">Como funciona?</h2>
        </div>
        <div class="process-steps">
            <?php foreach ($processSteps as [$num, $title, $desc]): ?>
            <div class="process-step reveal">
                <span class="process-number"><?= e($num) ?></span>
                <h3><?= e($title) ?></h3>
                <p><?= e($desc) ?></p>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="section-header reveal">
            <h2 class="section-title">Por que confiar seu celular à nossa assistência?</h2>
        </div>
        <div class="differentials-grid">
            <?php foreach ($differentials as [$iconKey, $title, $desc]): ?>
            <div class="differential-card reveal">
                <?= icon($iconKey) ?>
                <div>
                    <h3><?= e($title) ?></h3>
                    <p><?= e($desc) ?></p>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<section class="section section-soft" id="orcamento">
    <div class="container repairs-page-grid">
        <div class="reveal">
            <h2 class="section-title" style="font-size:1.6rem;">Prefere falar direto?</h2>
            <p class="section-description">Descreva o problema pelo WhatsApp e receba um retorno rápido da nossa equipe.</p>
            <a class="btn btn-whatsapp" target="_blank" rel="noopener" data-track="whatsapp_click"
               href="<?= e(whatsapp_link('Olá! Gostaria de solicitar um orçamento para reparo do meu celular.')) ?>">
                <?= whatsapp_icon() ?> Falar direto no WhatsApp
            </a>
        </div>

        <div class="form-card reveal">
            <h2 style="font-size:1.3rem;">Solicitar orçamento</h2>
            <?php if (!empty($errors)): ?>
            <div class="alert alert-error">
                <ul><?php foreach ($errors as $err): ?><li><?= e($err) ?></li><?php endforeach; ?></ul>
            </div>
            <?php endif; ?>
            <form method="post" action="/reparos.php#orcamento" novalidate>
                <?= csrf_field() ?>
                <label for="name">Nome</label>
                <input type="text" id="name" name="name" required value="<?= e($_POST['name'] ?? '') ?>">

                <label for="device_model">Modelo do aparelho</label>
                <input type="text" id="device_model" name="device_model" required placeholder="Ex: iPhone 13, Redmi Note 12..." value="<?= e($_POST['device_model'] ?? '') ?>">

                <label for="problem_type">Tipo de problema</label>
                <input type="text" id="problem_type" name="problem_type" required placeholder="Ex: Tela quebrada, bateria viciada..." value="<?= e($_POST['problem_type'] ?? '') ?>">

                <label for="phone">Telefone</label>
                <input type="tel" id="phone" name="phone" required placeholder="(41) 90000-0000" value="<?= e($_POST['phone'] ?? '') ?>">

                <button type="submit" class="btn btn-primary btn-block">Solicitar orçamento <?= btn_arrow() ?></button>
            </form>
        </div>
    </div>
</section>

<?php require __DIR__ . '/includes/footer.php'; ?>
