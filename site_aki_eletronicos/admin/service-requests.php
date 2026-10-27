<?php
require_once __DIR__ . '/../config/config.php';
require_login();

$pageTitle = 'Solicitações';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_verify($_POST['csrf_token'] ?? null)) {
        flash_set('error', 'Sessão expirada, tente novamente.');
        redirect(admin_url('service-requests.php'));
    }
    $id = (int)($_POST['id'] ?? 0);
    $status = $_POST['status'] ?? '';
    if ($id && in_array($status, ['novo', 'em_andamento', 'concluido'], true)) {
        try {
            db()->prepare('UPDATE service_requests SET status = ? WHERE id = ?')->execute([$status, $id]);
            flash_set('success', 'Status atualizado.');
        } catch (Throwable $ex) {
            flash_set('error', 'Não foi possível atualizar.');
        }
    }
    redirect(admin_url('service-requests.php'));
}

$requests = [];
try { $requests = db()->query('SELECT * FROM service_requests ORDER BY created_at DESC LIMIT 200')->fetchAll(); } catch (Throwable $ex) {}

require __DIR__ . '/includes/admin-header.php';
?>

<div class="card">
    <div class="card-header"><h2>Solicitações de contato e reparo</h2></div>
    <table>
        <thead><tr><th>Data</th><th>Tipo</th><th>Nome</th><th>Telefone</th><th>Detalhes</th><th>Status</th></tr></thead>
        <tbody>
        <?php if (empty($requests)): ?>
        <tr class="empty-row"><td colspan="6">Nenhuma solicitação recebida ainda.</td></tr>
        <?php else: foreach ($requests as $r): ?>
        <tr>
            <td><?= e(date('d/m/Y H:i', strtotime($r['created_at']))) ?></td>
            <td><?= $r['type'] === 'reparo' ? 'Reparo' : 'Contato' ?></td>
            <td><?= e($r['name']) ?></td>
            <td><?= e($r['phone']) ?></td>
            <td>
                <?php if ($r['type'] === 'reparo'): ?>
                    <?= e($r['device_model'] ?? '') ?> — <?= e($r['problem_type'] ?? '') ?>
                <?php else: ?>
                    <?= e(mb_strimwidth((string)$r['message'], 0, 80, '…')) ?>
                <?php endif; ?>
            </td>
            <td>
                <form method="post" action="/admin/service-requests.php" style="display:flex; gap:6px;">
                    <?= csrf_field() ?>
                    <input type="hidden" name="id" value="<?= (int)$r['id'] ?>">
                    <select name="status" onchange="this.form.submit()">
                        <option value="novo" <?= $r['status'] === 'novo' ? 'selected' : '' ?>>Novo</option>
                        <option value="em_andamento" <?= $r['status'] === 'em_andamento' ? 'selected' : '' ?>>Em andamento</option>
                        <option value="concluido" <?= $r['status'] === 'concluido' ? 'selected' : '' ?>>Concluído</option>
                    </select>
                </form>
            </td>
        </tr>
        <?php endforeach; endif; ?>
        </tbody>
    </table>
</div>

<?php require __DIR__ . '/includes/admin-footer.php'; ?>
