<?php
require_once __DIR__ . '/../config/config.php';
require_login();

$pageTitle = 'Faixa Promocional';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_verify($_POST['csrf_token'] ?? null)) {
        flash_set('error', 'Sessão expirada, tente novamente.');
        redirect(admin_url('promotions.php'));
    }
    $action = $_POST['action'] ?? '';
    $id = (int)($_POST['id'] ?? 0);
    try {
        if ($action === 'delete' && $id) {
            db()->prepare('DELETE FROM promotional_bars WHERE id = ?')->execute([$id]);
            flash_set('success', 'Item removido.');
        } elseif ($action === 'toggle_active' && $id) {
            db()->prepare('UPDATE promotional_bars SET is_active = 1 - is_active WHERE id = ?')->execute([$id]);
            flash_set('success', 'Status atualizado.');
        }
    } catch (Throwable $ex) {
        flash_set('error', 'Não foi possível concluir a ação.');
    }
    redirect(admin_url('promotions.php'));
}

$items = [];
try { $items = db()->query('SELECT * FROM promotional_bars ORDER BY ordering ASC, id DESC')->fetchAll(); } catch (Throwable $ex) {}

require __DIR__ . '/includes/admin-header.php';
?>

<div class="card">
    <div class="card-header">
        <h2>Itens da faixa promocional</h2>
        <a href="/admin/promotion-form.php" class="btn btn-primary btn-sm">+ Novo item</a>
    </div>
    <table>
        <thead><tr><th>Ícone</th><th>Texto</th><th>Ordem</th><th>Ativo</th><th>Período</th><th>Ações</th></tr></thead>
        <tbody>
        <?php if (empty($items)): ?>
        <tr class="empty-row"><td colspan="6">Nenhum item cadastrado ainda.</td></tr>
        <?php else: foreach ($items as $it): ?>
        <tr>
            <td><?= e($it['icon'] ?? '') ?></td>
            <td><?= e($it['text']) ?></td>
            <td><?= (int)$it['ordering'] ?></td>
            <td><span class="status-pill <?= $it['is_active'] ? 'active-yes' : 'active-no' ?>"><?= $it['is_active'] ? 'Ativo' : 'Inativo' ?></span></td>
            <td><?= e($it['start_date'] ?? '—') ?> — <?= e($it['end_date'] ?? '—') ?></td>
            <td class="actions-cell">
                <a class="btn btn-ghost btn-sm" href="/admin/promotion-form.php?id=<?= (int)$it['id'] ?>">Editar</a>
                <form method="post" action="/admin/promotions.php" style="display:inline">
                    <?= csrf_field() ?><input type="hidden" name="id" value="<?= (int)$it['id'] ?>"><input type="hidden" name="action" value="toggle_active">
                    <button type="submit" class="btn btn-ghost btn-sm"><?= $it['is_active'] ? 'Desativar' : 'Ativar' ?></button>
                </form>
                <form method="post" action="/admin/promotions.php" style="display:inline">
                    <?= csrf_field() ?><input type="hidden" name="id" value="<?= (int)$it['id'] ?>"><input type="hidden" name="action" value="delete">
                    <button type="submit" class="btn btn-danger btn-sm" data-confirm="Remover este item?">Excluir</button>
                </form>
            </td>
        </tr>
        <?php endforeach; endif; ?>
        </tbody>
    </table>
</div>

<?php require __DIR__ . '/includes/admin-footer.php'; ?>
