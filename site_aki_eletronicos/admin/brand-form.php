<?php
require_once __DIR__ . '/../config/config.php';
require_login();

$id = isset($_GET['id']) ? (int)$_GET['id'] : (isset($_POST['id']) ? (int)$_POST['id'] : 0);
$brand = ['id' => 0, 'name' => '', 'slug' => '', 'logo' => '', 'link' => '', 'ordering' => 0, 'is_active' => 1];
$errors = [];

if ($id) {
    $stmt = db()->prepare('SELECT * FROM brands WHERE id = ?');
    $stmt->execute([$id]);
    $found = $stmt->fetch();
    if ($found) $brand = $found;
}

$pageTitle = $id ? 'Editar marca' : 'Nova marca';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_verify($_POST['csrf_token'] ?? null)) {
        $errors[] = 'Sessão expirada, tente novamente.';
    } else {
        $brand = array_merge($brand, [
            'name' => trim((string)($_POST['name'] ?? '')),
            'link' => trim((string)($_POST['link'] ?? '')),
            'ordering' => (int)($_POST['ordering'] ?? 0),
            'is_active' => isset($_POST['is_active']) ? 1 : 0,
        ]);
        if ($brand['name'] === '') $errors[] = 'Informe o nome da marca.';

        if (!empty($_FILES['logo']['name'])) {
            $uploaded = save_upload($_FILES['logo'], 'brands');
            if ($uploaded === null) { $errors[] = 'Logo inválido (JPG, PNG ou WebP, até 5MB).'; }
            else { $brand['logo'] = $uploaded; }
        }

        if (empty($errors)) {
            $slugBase = slugify($brand['name']);
            $slug = $slugBase;
            $suffix = 1;
            while (true) {
                $check = db()->prepare('SELECT id FROM brands WHERE slug = ? AND id != ?');
                $check->execute([$slug, $id]);
                if (!$check->fetch()) break;
                $suffix++;
                $slug = $slugBase . '-' . $suffix;
            }
            $brand['slug'] = $slug;

            try {
                if ($id) {
                    $stmt = db()->prepare('UPDATE brands SET name=?, slug=?, logo=?, link=?, ordering=?, is_active=? WHERE id=?');
                    $stmt->execute([$brand['name'], $brand['slug'], $brand['logo'], $brand['link'], $brand['ordering'], $brand['is_active'], $id]);
                    flash_set('success', 'Marca atualizada.');
                } else {
                    $stmt = db()->prepare('INSERT INTO brands (name, slug, logo, link, ordering, is_active) VALUES (?,?,?,?,?,?)');
                    $stmt->execute([$brand['name'], $brand['slug'], $brand['logo'], $brand['link'], $brand['ordering'], $brand['is_active']]);
                    flash_set('success', 'Marca criada.');
                }
                redirect(admin_url('brands.php'));
            } catch (Throwable $ex) {
                $errors[] = 'Não foi possível salvar a marca.';
            }
        }
    }
}

require __DIR__ . '/includes/admin-header.php';
?>

<?php if (!empty($errors)): ?>
<div class="alert alert-error"><ul><?php foreach ($errors as $err): ?><li><?= e($err) ?></li><?php endforeach; ?></ul></div>
<?php endif; ?>

<form class="card" method="post" action="/admin/brand-form.php<?= $id ? '?id=' . $id : '' ?>" enctype="multipart/form-data">
    <?= csrf_field() ?>
    <input type="hidden" name="id" value="<?= (int)$brand['id'] ?>">
    <div class="form-grid">
        <div class="form-group full">
            <label for="name">Nome</label>
            <input type="text" id="name" name="name" required value="<?= e($brand['name']) ?>">
        </div>
        <div class="form-group">
            <label for="link">Link (opcional)</label>
            <input type="text" id="link" name="link" value="<?= e($brand['link'] ?? '') ?>">
        </div>
        <div class="form-group">
            <label for="ordering">Ordem</label>
            <input type="number" id="ordering" name="ordering" value="<?= (int)$brand['ordering'] ?>">
        </div>
        <div class="form-group full">
            <label for="logo">Logo</label>
            <?php if (!empty($brand['logo'])): ?><img class="current-image" src="<?= e($brand['logo']) ?>" alt=""><?php endif; ?>
            <input type="file" id="logo" name="logo" accept="image/jpeg,image/png,image/webp">
        </div>
        <div class="form-group checkbox">
            <input type="checkbox" id="is_active" name="is_active" <?= $brand['is_active'] ? 'checked' : '' ?>>
            <label for="is_active" style="margin:0">Ativa</label>
        </div>
        <div class="form-actions">
            <button type="submit" class="btn btn-primary">Salvar marca</button>
            <a href="/admin/brands.php" class="btn btn-ghost">Cancelar</a>
        </div>
    </div>
</form>

<?php require __DIR__ . '/includes/admin-footer.php'; ?>
