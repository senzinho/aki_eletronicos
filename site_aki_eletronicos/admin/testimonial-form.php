<?php
require_once __DIR__ . '/../config/config.php';
require_login();

$id = isset($_GET['id']) ? (int)$_GET['id'] : (isset($_POST['id']) ? (int)$_POST['id'] : 0);
$item = ['id' => 0, 'author_name' => '', 'rating' => 5, 'comment' => '', 'context' => '', 'is_active' => 1, 'ordering' => 0];
$errors = [];

if ($id) {
    $stmt = db()->prepare('SELECT * FROM testimonials WHERE id = ?');
    $stmt->execute([$id]);
    $found = $stmt->fetch();
    if ($found) $item = $found;
}

$pageTitle = $id ? 'Editar depoimento' : 'Novo depoimento';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_verify($_POST['csrf_token'] ?? null)) {
        $errors[] = 'Sessão expirada, tente novamente.';
    } else {
        $item = array_merge($item, [
            'author_name' => trim((string)($_POST['author_name'] ?? '')),
            'rating' => max(1, min(5, (int)($_POST['rating'] ?? 5))),
            'comment' => trim((string)($_POST['comment'] ?? '')),
            'context' => trim((string)($_POST['context'] ?? '')),
            'ordering' => (int)($_POST['ordering'] ?? 0),
            'is_active' => isset($_POST['is_active']) ? 1 : 0,
        ]);
        if ($item['author_name'] === '') $errors[] = 'Informe o nome do cliente.';
        if ($item['comment'] === '') $errors[] = 'Informe o comentário.';

        if (empty($errors)) {
            try {
                if ($id) {
                    $stmt = db()->prepare('UPDATE testimonials SET author_name=?, rating=?, comment=?, context=?, ordering=?, is_active=? WHERE id=?');
                    $stmt->execute([$item['author_name'], $item['rating'], $item['comment'], $item['context'], $item['ordering'], $item['is_active'], $id]);
                    flash_set('success', 'Depoimento atualizado.');
                } else {
                    $stmt = db()->prepare('INSERT INTO testimonials (author_name, rating, comment, context, ordering, is_active) VALUES (?,?,?,?,?,?)');
                    $stmt->execute([$item['author_name'], $item['rating'], $item['comment'], $item['context'], $item['ordering'], $item['is_active']]);
                    flash_set('success', 'Depoimento criado.');
                }
                redirect(admin_url('testimonials.php'));
            } catch (Throwable $ex) {
                $errors[] = 'Não foi possível salvar o depoimento.';
            }
        }
    }
}

require __DIR__ . '/includes/admin-header.php';
?>

<?php if (!empty($errors)): ?>
<div class="alert alert-error"><ul><?php foreach ($errors as $err): ?><li><?= e($err) ?></li><?php endforeach; ?></ul></div>
<?php endif; ?>

<form class="card" method="post" action="/admin/testimonial-form.php<?= $id ? '?id=' . $id : '' ?>">
    <?= csrf_field() ?>
    <input type="hidden" name="id" value="<?= (int)$item['id'] ?>">
    <div class="form-grid">
        <div class="form-group">
            <label for="author_name">Nome do cliente</label>
            <input type="text" id="author_name" name="author_name" required value="<?= e($item['author_name']) ?>">
        </div>
        <div class="form-group">
            <label for="context">Produto/serviço (opcional)</label>
            <input type="text" id="context" name="context" value="<?= e($item['context'] ?? '') ?>" placeholder="Ex: Troca de tela — iPhone 13">
        </div>
        <div class="form-group full">
            <label for="comment">Comentário</label>
            <textarea id="comment" name="comment" rows="3" required><?= e($item['comment']) ?></textarea>
        </div>
        <div class="form-group">
            <label for="rating">Nota (1 a 5)</label>
            <select id="rating" name="rating">
                <?php for ($r = 5; $r >= 1; $r--): ?>
                <option value="<?= $r ?>" <?= (int)$item['rating'] === $r ? 'selected' : '' ?>><?= str_repeat('★', $r) ?></option>
                <?php endfor; ?>
            </select>
        </div>
        <div class="form-group">
            <label for="ordering">Ordem</label>
            <input type="number" id="ordering" name="ordering" value="<?= (int)$item['ordering'] ?>">
        </div>
        <div class="form-group checkbox">
            <input type="checkbox" id="is_active" name="is_active" <?= $item['is_active'] ? 'checked' : '' ?>>
            <label for="is_active" style="margin:0">Ativo</label>
        </div>
        <div class="form-actions">
            <button type="submit" class="btn btn-primary">Salvar</button>
            <a href="/admin/testimonials.php" class="btn btn-ghost">Cancelar</a>
        </div>
    </div>
</form>

<?php require __DIR__ . '/includes/admin-footer.php'; ?>
