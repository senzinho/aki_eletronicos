<?php
require_once __DIR__ . '/../config/config.php';
require_login();

$pageTitle = 'Marcas';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_verify($_POST['csrf_token'] ?? null)) {
        flash_set('error', 'Sessão expirada, tente novamente.');
        redirect(admin_url('brands.php'));
    }
    $action = $_POST['action'] ?? '';
    $id = (int)($_POST['id'] ?? 0);
    try {
        if ($action === 'delete' && $id) {
            db()->prepare('DELETE FROM brands WHERE id = ?')->execute([$id]);
            flash_set('success', 'Marca excluída.');
        } elseif ($action === 'toggle_active' && $id) {
            db()->prepare('UPDATE brands SET is_active = 1 - is_active WHERE id = ?')->execute([$id]);
            flash_set('success', 'Status atualizado.');
        }
    } catch (Throwable $ex) {
        flash_set('error', 'Não foi possível concluir a ação.');
    }
    redirect(admin_url('brands.php'));
}

$brands = [];
try { $brands = db()->query('SELECT * FROM brands ORDER BY ordering ASC, id DESC')->fetchAll(); } catch (Throwable $ex) {}

require __DIR__ . '/includes/admin-header.php';
?>

<div class="card">
    <div class="card-header">
        <h2>Marcas</h2>
        <a href="/admin/brand-form.php" class="btn btn-primary btn-sm">+ Nova marca</a>
    </div>
    <table>
        <thead><tr><th>Logo</th><th>Nome</th><th>Ordem</th><th>Ativa</th><th>Ações</th></tr></thead>
        <tbody>
        <?php if (empty($brands)): ?>
        <tr class="empty-row"><td colspan="5">Nenhuma marca cadastrada ainda.</td></tr>
        <?php else: foreach ($brands as $b): ?>
        <tr>
            <td><?php if ($b['logo']): ?><img class="table-thumb" src="<?= e($b['logo']) ?>" alt=""><?php else: ?>—<?php endif; ?></td>
            <td><?= e($b['name']) ?></td>
            <td><?= (int)$b['ordering'] ?></td>
            <td><span class="status-pill <?= $b['is_active'] ? 'active-yes' : 'active-no' ?>"><?= $b['is_active'] ? 'Ativa' : 'Inativa' ?></span></td>
            <td class="actions-cell">
                <a class="btn btn-ghost btn-sm" href="/admin/brand-form.php?id=<?= (int)$b['id'] ?>">Editar</a>
                <form method="post" action="/admin/brands.php" style="display:inline">
                    <?= csrf_field() ?><input type="hidden" name="id" value="<?= (int)$b['id'] ?>"><input type="hidden" name="action" value="toggle_active">
                    <button type="submit" class="btn btn-ghost btn-sm"><?= $b['is_active'] ? 'Desativar' : 'Ativar' ?></button>
                </form>
                <form method="post" action="/admin/brands.php" style="display:inline">
                    <?= csrf_field() ?><input type="hidden" name="id" value="<?= (int)$b['id'] ?>"><input type="hidden" name="action" value="delete">
                    <button type="submit" class="btn btn-danger btn-sm" data-confirm="Excluir esta marca?">Excluir</button>
                </form>
            </td>
        </tr>
        <?php endforeach; endif; ?>
        </tbody>
    </table>
</div>

<?php require __DIR__ . '/includes/admin-footer.php'; ?>
