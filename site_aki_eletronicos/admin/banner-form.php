<?php
require_once __DIR__ . '/../config/config.php';
require_login();

$id = isset($_GET['id']) ? (int)$_GET['id'] : (isset($_POST['id']) ? (int)$_POST['id'] : 0);
$banner = [
    'id' => 0, 'internal_name' => '', 'title' => '', 'subtitle' => '',
    'image_desktop' => '', 'image_mobile' => '', 'cta_text' => '', 'url' => '',
    'ordering' => 0, 'is_active' => 1, 'start_date' => '', 'end_date' => '',
];
$errors = [];

if ($id) {
    $stmt = db()->prepare('SELECT * FROM banners WHERE id = ?');
    $stmt->execute([$id]);
    $found = $stmt->fetch();
    if ($found) $banner = $found;
}

$pageTitle = $id ? 'Editar banner' : 'Novo banner';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_verify($_POST['csrf_token'] ?? null)) {
        $errors[] = 'Sessão expirada, tente novamente.';
    } else {
        $banner = array_merge($banner, [
            'internal_name' => trim((string)($_POST['internal_name'] ?? '')),
            'title' => trim((string)($_POST['title'] ?? '')),
            'subtitle' => trim((string)($_POST['subtitle'] ?? '')),
            'cta_text' => trim((string)($_POST['cta_text'] ?? '')),
            'url' => trim((string)($_POST['url'] ?? '')),
            'ordering' => (int)($_POST['ordering'] ?? 0),
            'is_active' => isset($_POST['is_active']) ? 1 : 0,
            'start_date' => ($_POST['start_date'] ?? '') !== '' ? $_POST['start_date'] : null,
            'end_date' => ($_POST['end_date'] ?? '') !== '' ? $_POST['end_date'] : null,
        ]);

        if ($banner['internal_name'] === '') $errors[] = 'Informe o nome interno do banner.';

        if (!empty($_FILES['image_desktop']['name'])) {
            $uploaded = save_upload($_FILES['image_desktop'], 'banners');
            if ($uploaded === null) { $errors[] = 'Imagem desktop inválida (JPG, PNG ou WebP, até 5MB).'; }
            else { $banner['image_desktop'] = $uploaded; }
        }
        if (!empty($_FILES['image_mobile']['name'])) {
            $uploaded = save_upload($_FILES['image_mobile'], 'banners');
            if ($uploaded === null) { $errors[] = 'Imagem mobile inválida (JPG, PNG ou WebP, até 5MB).'; }
            else { $banner['image_mobile'] = $uploaded; }
        }

        if (empty($errors)) {
            try {
                if ($id) {
                    $stmt = db()->prepare("UPDATE banners SET internal_name=?, title=?, subtitle=?, image_desktop=?, image_mobile=?, cta_text=?, url=?, ordering=?, is_active=?, start_date=?, end_date=? WHERE id=?");
                    $stmt->execute([$banner['internal_name'], $banner['title'], $banner['subtitle'], $banner['image_desktop'], $banner['image_mobile'], $banner['cta_text'], $banner['url'], $banner['ordering'], $banner['is_active'], $banner['start_date'], $banner['end_date'], $id]);
                    flash_set('success', 'Banner atualizado.');
                } else {
                    $stmt = db()->prepare("INSERT INTO banners (internal_name, title, subtitle, image_desktop, image_mobile, cta_text, url, ordering, is_active, start_date, end_date) VALUES (?,?,?,?,?,?,?,?,?,?,?)");
                    $stmt->execute([$banner['internal_name'], $banner['title'], $banner['subtitle'], $banner['image_desktop'], $banner['image_mobile'], $banner['cta_text'], $banner['url'], $banner['ordering'], $banner['is_active'], $banner['start_date'], $banner['end_date']]);
                    flash_set('success', 'Banner criado.');
                }
                redirect(admin_url('banners.php'));
            } catch (Throwable $ex) {
                $errors[] = 'Não foi possível salvar o banner.';
            }
        }
    }
}

require __DIR__ . '/includes/admin-header.php';
?>

<?php if (!empty($errors)): ?>
<div class="alert alert-error"><ul><?php foreach ($errors as $err): ?><li><?= e($err) ?></li><?php endforeach; ?></ul></div>
<?php endif; ?>

<form class="card" method="post" action="/admin/banner-form.php<?= $id ? '?id=' . $id : '' ?>" enctype="multipart/form-data">
    <?= csrf_field() ?>
    <input type="hidden" name="id" value="<?= (int)$banner['id'] ?>">
    <div class="form-grid">
        <div class="form-group full">
            <label for="internal_name">Nome interno</label>
            <input type="text" id="internal_name" name="internal_name" required value="<?= e($banner['internal_name']) ?>">
        </div>
        <div class="form-group">
            <label for="title">Título</label>
            <input type="text" id="title" name="title" value="<?= e($banner['title']) ?>">
        </div>
        <div class="form-group">
            <label for="subtitle">Subtítulo</label>
            <input type="text" id="subtitle" name="subtitle" value="<?= e($banner['subtitle']) ?>">
        </div>
        <div class="form-group">
            <label for="cta_text">Texto do CTA</label>
            <input type="text" id="cta_text" name="cta_text" value="<?= e($banner['cta_text']) ?>">
        </div>
        <div class="form-group">
            <label for="url">Link de destino</label>
            <input type="text" id="url" name="url" value="<?= e($banner['url']) ?>" placeholder="/index.php#ofertas">
        </div>
        <div class="form-group">
            <label for="image_desktop">Imagem desktop (1920x700)</label>
            <?php if (!empty($banner['image_desktop'])): ?><img class="current-image" src="<?= e($banner['image_desktop']) ?>" alt=""><?php endif; ?>
            <input type="file" id="image_desktop" name="image_desktop" accept="image/jpeg,image/png,image/webp">
        </div>
        <div class="form-group">
            <label for="image_mobile">Imagem mobile (1080x1350)</label>
            <?php if (!empty($banner['image_mobile'])): ?><img class="current-image" src="<?= e($banner['image_mobile']) ?>" alt=""><?php endif; ?>
            <input type="file" id="image_mobile" name="image_mobile" accept="image/jpeg,image/png,image/webp">
        </div>
        <div class="form-group">
            <label for="start_date">Data inicial</label>
            <input type="date" id="start_date" name="start_date" value="<?= e((string)($banner['start_date'] ?? '')) ?>">
        </div>
        <div class="form-group">
            <label for="end_date">Data final</label>
            <input type="date" id="end_date" name="end_date" value="<?= e((string)($banner['end_date'] ?? '')) ?>">
        </div>
        <div class="form-group">
            <label for="ordering">Ordem</label>
            <input type="number" id="ordering" name="ordering" value="<?= (int)$banner['ordering'] ?>">
        </div>
        <div class="form-group checkbox">
            <input type="checkbox" id="is_active" name="is_active" <?= $banner['is_active'] ? 'checked' : '' ?>>
            <label for="is_active" style="margin:0">Ativo</label>
        </div>
        <div class="form-actions">
            <button type="submit" class="btn btn-primary">Salvar banner</button>
            <a href="/admin/banners.php" class="btn btn-ghost">Cancelar</a>
        </div>
    </div>
</form>

<?php require __DIR__ . '/includes/admin-footer.php'; ?>
