<?php
require_once __DIR__ . '/../config/config.php';
require_login();

$pageTitle = 'Configurações do site';

$fields = [
    'nome_empresa' => 'Nome da empresa',
    'whatsapp' => 'WhatsApp (somente números, com DDI e DDD)',
    'telefone' => 'Telefone para exibição',
    'email' => 'E-mail',
    'endereco' => 'Endereço',
    'horario_atendimento' => 'Horário de atendimento',
    'google_maps' => 'URL de incorporação do Google Maps',
    'instagram' => 'Instagram (URL)',
    'facebook' => 'Facebook (URL)',
    'tiktok' => 'TikTok (URL)',
    'seo_title' => 'SEO — Título padrão',
    'seo_description' => 'SEO — Descrição padrão',
];

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_verify($_POST['csrf_token'] ?? null)) {
        $errors[] = 'Sessão expirada, tente novamente.';
    } else {
        try {
            $stmt = db()->prepare('INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)');
            foreach (array_keys($fields) as $key) {
                $stmt->execute([$key, trim((string)($_POST[$key] ?? ''))]);
            }

            foreach (['logo' => 'site', 'favicon' => 'site', 'hero_video_poster' => 'site', 'og_image' => 'site'] as $fileField => $subdir) {
                if (!empty($_FILES[$fileField]['name'])) {
                    $uploaded = save_upload($_FILES[$fileField], $subdir);
                    if ($uploaded !== null) {
                        $stmt->execute([$fileField, $uploaded]);
                    }
                }
            }
            if (!empty($_FILES['hero_video']['name'])) {
                $allowedVideo = ['video/mp4', 'video/webm'];
                $filename = validate_upload($_FILES['hero_video'], $allowedVideo, 40 * 1024 * 1024);
                if ($filename !== null) {
                    $destDir = UPLOADS_PATH . '/site';
                    if (!is_dir($destDir)) mkdir($destDir, 0755, true);
                    if (move_uploaded_file($_FILES['hero_video']['tmp_name'], $destDir . '/' . $filename)) {
                        $stmt->execute(['hero_video', UPLOADS_URL . '/site/' . $filename]);
                    }
                }
            }

            flash_set('success', 'Configurações salvas com sucesso.');
            redirect(admin_url('settings.php'));
        } catch (Throwable $ex) {
            $errors[] = 'Não foi possível salvar as configurações.';
        }
    }
}

$current = [];
try {
    foreach (db()->query('SELECT setting_key, setting_value FROM site_settings')->fetchAll() as $row) {
        $current[$row['setting_key']] = $row['setting_value'];
    }
} catch (Throwable $ex) {}

require __DIR__ . '/includes/admin-header.php';
?>

<?php if (!empty($errors)): ?>
<div class="alert alert-error"><ul><?php foreach ($errors as $err): ?><li><?= e($err) ?></li><?php endforeach; ?></ul></div>
<?php endif; ?>

<form class="card" method="post" action="/admin/settings.php" enctype="multipart/form-data">
    <?= csrf_field() ?>
    <div class="form-grid">
        <?php foreach ($fields as $key => $label):
            $isTextarea = in_array($key, ['seo_description', 'endereco'], true);
        ?>
        <div class="form-group <?= $isTextarea ? 'full' : '' ?>">
            <label for="<?= e($key) ?>"><?= e($label) ?></label>
            <?php if ($isTextarea): ?>
            <textarea id="<?= e($key) ?>" name="<?= e($key) ?>" rows="2"><?= e($current[$key] ?? '') ?></textarea>
            <?php else: ?>
            <input type="text" id="<?= e($key) ?>" name="<?= e($key) ?>" value="<?= e($current[$key] ?? '') ?>">
            <?php endif; ?>
        </div>
        <?php endforeach; ?>

        <div class="form-group">
            <label for="logo">Logo</label>
            <?php if (!empty($current['logo'])): ?><img class="current-image" src="<?= e($current['logo']) ?>" alt=""><?php endif; ?>
            <input type="file" id="logo" name="logo" accept="image/jpeg,image/png,image/webp">
        </div>
        <div class="form-group">
            <label for="favicon">Favicon</label>
            <?php if (!empty($current['favicon'])): ?><img class="current-image" src="<?= e($current['favicon']) ?>" alt=""><?php endif; ?>
            <input type="file" id="favicon" name="favicon" accept="image/jpeg,image/png,image/webp">
        </div>
        <div class="form-group">
            <label for="og_image">Imagem OpenGraph (compartilhamento)</label>
            <?php if (!empty($current['og_image'])): ?><img class="current-image" src="<?= e($current['og_image']) ?>" alt=""><?php endif; ?>
            <input type="file" id="og_image" name="og_image" accept="image/jpeg,image/png,image/webp">
        </div>
        <div class="form-group">
            <label for="hero_video">Vídeo do Hero (MP4/WebM)</label>
            <?php if (!empty($current['hero_video'])): ?><p style="color:var(--color-muted); font-size:0.85rem;">Atual: <?= e($current['hero_video']) ?></p><?php endif; ?>
            <input type="file" id="hero_video" name="hero_video" accept="video/mp4,video/webm">
        </div>
        <div class="form-group">
            <label for="hero_video_poster">Imagem de fallback do Hero</label>
            <?php if (!empty($current['hero_video_poster'])): ?><img class="current-image" src="<?= e($current['hero_video_poster']) ?>" alt=""><?php endif; ?>
            <input type="file" id="hero_video_poster" name="hero_video_poster" accept="image/jpeg,image/png,image/webp">
        </div>

        <div class="form-actions">
            <button type="submit" class="btn btn-primary">Salvar configurações</button>
        </div>
    </div>
</form>

<?php require __DIR__ . '/includes/admin-footer.php'; ?>
