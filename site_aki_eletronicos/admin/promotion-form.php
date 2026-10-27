<?php
require_once __DIR__ . '/../config/config.php';
require_login();

$id = isset($_GET['id']) ? (int)$_GET['id'] : (isset($_POST['id']) ? (int)$_POST['id'] : 0);
$item = ['id' => 0, 'text' => '', 'icon' => '', 'ordering' => 0, 'is_active' => 1, 'start_date' => '', 'end_date' => ''];
$errors = [];

if ($id) {
    $stmt = db()->prepare('SELECT * FROM promotional_bars WHERE id = ?');
    $stmt->execute([$id]);
    $found = $stmt->fetch();
    if ($found) $item = $found;
}

$pageTitle = $id ? 'Editar item' : 'Novo item da faixa';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_verify($_POST['csrf_token'] ?? null)) {
        $errors[] = 'Sessão expirada, tente novamente.';
    } else {
        $item = array_merge($item, [
            'text' => trim((string)($_POST['text'] ?? '')),
            'icon' => trim((string)($_POST['icon'] ?? '')),
            'ordering' => (int)($_POST['ordering'] ?? 0),
            'is_active' => isset($_POST['is_active']) ? 1 : 0,
            'start_date' => ($_POST['start_date'] ?? '') !== '' ? $_POST['start_date'] : null,
            'end_date' => ($_POST['end_date'] ?? '') !== '' ? $_POST['end_date'] : null,
        ]);
        if ($item['text'] === '') $errors[] = 'Informe o texto do item.';

        if (empty($errors)) {
            try {
                if ($id) {
                    $stmt = db()->prepare('UPDATE promotional_bars SET text=?, icon=?, ordering=?, is_active=?, start_date=?, end_date=? WHERE id=?');
                    $stmt->execute([$item['text'], $item['icon'], $item['ordering'], $item['is_active'], $item['start_date'], $item['end_date'], $id]);
                    flash_set('success', 'Item atualizado.');
                } else {
                    $stmt = db()->prepare('INSERT INTO promotional_bars (text, icon, ordering, is_active, start_date, end_date) VALUES (?,?,?,?,?,?)');
                    $stmt->execute([$item['text'], $item['icon'], $item['ordering'], $item['is_active'], $item['start_date'], $item['end_date']]);
                    flash_set('success', 'Item criado.');
                }
                redirect(admin_url('promotions.php'));
            } catch (Throwable $ex) {
                $errors[] = 'Não foi possível salvar o item.';
            }
        }
    }
}

require __DIR__ . '/includes/admin-header.php';
?>

<?php if (!empty($errors)): ?>
<div class="alert alert-error"><ul><?php foreach ($errors as $err): ?><li><?= e($err) ?></li><?php endforeach; ?></ul></div>
<?php endif; ?>

<form class="card" method="post" action="/admin/promotion-form.php<?= $id ? '?id=' . $id : '' ?>">
    <?= csrf_field() ?>
    <input type="hidden" name="id" value="<?= (int)$item['id'] ?>">
    <div class="form-grid">
        <div class="form-group full">
            <label for="text">Texto</label>
            <input type="text" id="text" name="text" required value="<?= e($item['text']) ?>" placeholder="Ex: Ofertas especiais em smartphones">
        </div>
        <div class="form-group">
            <label for="icon">Ícone (emoji)</label>
            <input type="text" id="icon" name="icon" value="<?= e($item['icon'] ?? '') ?>" placeholder="🔥">
        </div>
        <div class="form-group">
            <label for="ordering">Ordem</label>
            <input type="number" id="ordering" name="ordering" value="<?= (int)$item['ordering'] ?>">
        </div>
        <div class="form-group">
            <label for="start_date">Data inicial</label>
            <input type="date" id="start_date" name="start_date" value="<?= e((string)($item['start_date'] ?? '')) ?>">
        </div>
        <div class="form-group">
            <label for="end_date">Data final</label>
            <input type="date" id="end_date" name="end_date" value="<?= e((string)($item['end_date'] ?? '')) ?>">
        </div>
        <div class="form-group checkbox">
            <input type="checkbox" id="is_active" name="is_active" <?= $item['is_active'] ? 'checked' : '' ?>>
            <label for="is_active" style="margin:0">Ativo</label>
        </div>
        <div class="form-actions">
            <button type="submit" class="btn btn-primary">Salvar</button>
            <a href="/admin/promotions.php" class="btn btn-ghost">Cancelar</a>
        </div>
    </div>
</form>

<?php require __DIR__ . '/includes/admin-footer.php'; ?>
