<?php
require_once __DIR__ . '/../config/config.php';
require_login();

$pageTitle = 'Depoimentos';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_verify($_POST['csrf_token'] ?? null)) {
        flash_set('error', 'Sessão expirada, tente novamente.');
        redirect(admin_url('testimonials.php'));
    }
    $action = $_POST['action'] ?? '';
    $id = (int)($_POST['id'] ?? 0);
    try {
        if ($action === 'delete' && $id) {
            db()->prepare('DELETE FROM testimonials WHERE id = ?')->execute([$id]);
            flash_set('success', 'Depoimento excluído.');
        } elseif ($action === 'toggle_active' && $id) {
            db()->prepare('UPDATE testimonials SET is_active = 1 - is_active WHERE id = ?')->execute([$id]);
            flash_set('success', 'Status atualizado.');
        }
    } catch (Throwable $ex) {
        flash_set('error', 'Não foi possível concluir a ação.');
    }
    redirect(admin_url('testimonials.php'));
}

$items = [];
try { $items = db()->query('SELECT * FROM testimonials ORDER BY ordering ASC, id DESC')->fetchAll(); } catch (Throwable $ex) {}

require __DIR__ . '/includes/admin-header.php';
?>

<div class="card">
    <div class="card-header">
        <h2>Depoimentos de clientes</h2>
        <a href="/admin/testimonial-form.php" class="btn btn-primary btn-sm">+ Novo depoimento</a>
    </div>
    <p style="color:var(--color-muted); font-size:0.85rem; margin-top:-8px;">Cadastre apenas depoimentos reais de clientes. Enquanto não houver nenhum ativo, a seção não aparece no site.</p>
    <table>
        <thead><tr><th>Cliente</th><th>Nota</th><th>Comentário</th><th>Ativo</th><th>Ações</th></tr></thead>
        <tbody>
        <?php if (empty($items)): ?>
        <tr class="empty-row"><td colspan="5">Nenhum depoimento cadastrado ainda.</td></tr>
        <?php else: foreach ($items as $it): ?>
        <tr>
            <td><?= e($it['author_name']) ?><?php if ($it['context']): ?><br><small style="color:var(--color-muted)"><?= e($it['context']) ?></small><?php endif; ?></td>
            <td><?= str_repeat('★', (int)$it['rating']) ?></td>
            <td><?= e(mb_strimwidth($it['comment'], 0, 70, '…')) ?></td>
            <td><span class="status-pill <?= $it['is_active'] ? 'active-yes' : 'active-no' ?>"><?= $it['is_active'] ? 'Ativo' : 'Inativo' ?></span></td>
            <td class="actions-cell">
                <a class="btn btn-ghost btn-sm" href="/admin/testimonial-form.php?id=<?= (int)$it['id'] ?>">Editar</a>
                <form method="post" action="/admin/testimonials.php" style="display:inline">
                    <?= csrf_field() ?><input type="hidden" name="id" value="<?= (int)$it['id'] ?>"><input type="hidden" name="action" value="toggle_active">
                    <button type="submit" class="btn btn-ghost btn-sm"><?= $it['is_active'] ? 'Desativar' : 'Ativar' ?></button>
                </form>
                <form method="post" action="/admin/testimonials.php" style="display:inline">
                    <?= csrf_field() ?><input type="hidden" name="id" value="<?= (int)$it['id'] ?>"><input type="hidden" name="action" value="delete">
                    <button type="submit" class="btn btn-danger btn-sm" data-confirm="Excluir este depoimento?">Excluir</button>
                </form>
            </td>
        </tr>
        <?php endforeach; endif; ?>
        </tbody>
    </table>
</div>

<?php require __DIR__ . '/includes/admin-footer.php'; ?>
