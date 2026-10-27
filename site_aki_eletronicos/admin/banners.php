<?php
require_once __DIR__ . '/../config/config.php';
require_login();

$pageTitle = 'Banners';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_verify($_POST['csrf_token'] ?? null)) {
        flash_set('error', 'Sessão expirada, tente novamente.');
        redirect(admin_url('banners.php'));
    }
    $action = $_POST['action'] ?? '';
    $id = (int)($_POST['id'] ?? 0);
    try {
        if ($action === 'delete' && $id) {
            db()->prepare('DELETE FROM banners WHERE id = ?')->execute([$id]);
            flash_set('success', 'Banner excluído.');
        } elseif ($action === 'toggle_active' && $id) {
            db()->prepare('UPDATE banners SET is_active = 1 - is_active WHERE id = ?')->execute([$id]);
            flash_set('success', 'Status atualizado.');
        }
    } catch (Throwable $ex) {
        flash_set('error', 'Não foi possível concluir a ação.');
    }
    redirect(admin_url('banners.php'));
}

$banners = [];
try {
    $banners = db()->query('SELECT * FROM banners ORDER BY ordering ASC, id DESC')->fetchAll();
} catch (Throwable $ex) {}

require __DIR__ . '/includes/admin-header.php';
?>

<div class="card">
    <div class="card-header">
        <h2>Banners principais</h2>
        <a href="/admin/banner-form.php" class="btn btn-primary btn-sm">+ Novo banner</a>
    </div>
    <table>
        <thead><tr><th>Imagem</th><th>Nome interno</th><th>Título</th><th>Ativo</th><th>Período</th><th>Ações</th></tr></thead>
        <tbody>
        <?php if (empty($banners)): ?>
        <tr class="empty-row"><td colspan="6">Nenhum banner cadastrado ainda.</td></tr>
        <?php else: foreach ($banners as $b): ?>
        <tr>
            <td><img class="table-thumb" src="<?= e($b['image_desktop'] ?: '/assets/images/banner-placeholder.jpg') ?>" alt=""></td>
            <td><?= e($b['internal_name']) ?></td>
            <td><?= e($b['title'] ?? '—') ?></td>
            <td><span class="status-pill <?= $b['is_active'] ? 'active-yes' : 'active-no' ?>"><?= $b['is_active'] ? 'Ativo' : 'Inativo' ?></span></td>
            <td><?= e($b['start_date'] ?? '—') ?> — <?= e($b['end_date'] ?? '—') ?></td>
            <td class="actions-cell">
                <a class="btn btn-ghost btn-sm" href="/admin/banner-form.php?id=<?= (int)$b['id'] ?>">Editar</a>
                <form method="post" action="/admin/banners.php" style="display:inline">
                    <?= csrf_field() ?><input type="hidden" name="id" value="<?= (int)$b['id'] ?>"><input type="hidden" name="action" value="toggle_active">
                    <button type="submit" class="btn btn-ghost btn-sm"><?= $b['is_active'] ? 'Desativar' : 'Ativar' ?></button>
                </form>
                <form method="post" action="/admin/banners.php" style="display:inline">
                    <?= csrf_field() ?><input type="hidden" name="id" value="<?= (int)$b['id'] ?>"><input type="hidden" name="action" value="delete">
                    <button type="submit" class="btn btn-danger btn-sm" data-confirm="Excluir este banner?">Excluir</button>
                </form>
            </td>
        </tr>
        <?php endforeach; endif; ?>
        </tbody>
    </table>
</div>

<?php require __DIR__ . '/includes/admin-footer.php'; ?>
