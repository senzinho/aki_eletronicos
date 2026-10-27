<?php
require_once __DIR__ . '/../config/config.php';
require_login();

$pageTitle = 'Produtos';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_verify($_POST['csrf_token'] ?? null)) {
        flash_set('error', 'Sessão expirada, tente novamente.');
        redirect(admin_url('products.php'));
    }
    $action = $_POST['action'] ?? '';
    $id = (int)($_POST['id'] ?? 0);

    try {
        if ($action === 'delete' && $id) {
            db()->prepare('DELETE FROM products WHERE id = ?')->execute([$id]);
            flash_set('success', 'Produto excluído.');
        } elseif ($action === 'toggle_status' && $id) {
            db()->prepare("UPDATE products SET status = IF(status='published','draft','published') WHERE id = ?")->execute([$id]);
            flash_set('success', 'Status atualizado.');
        } elseif ($action === 'duplicate' && $id) {
            $stmt = db()->prepare('SELECT * FROM products WHERE id = ?');
            $stmt->execute([$id]);
            $p = $stmt->fetch();
            if ($p) {
                $newSlug = $p['slug'] . '-copia-' . substr(bin2hex(random_bytes(3)), 0, 5);
                $ins = db()->prepare("INSERT INTO products (name, slug, subtitle, description, brand_id, category_id, price_from, price_to, badge, main_image, is_demo, is_featured, status, ordering, seo_title, seo_description)
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,'draft',?,?,?)");
                $ins->execute([$p['name'] . ' (cópia)', $newSlug, $p['subtitle'], $p['description'], $p['brand_id'], $p['category_id'], $p['price_from'], $p['price_to'], $p['badge'], $p['main_image'], $p['is_demo'], 0, $p['ordering'], $p['seo_title'], $p['seo_description']]);
                flash_set('success', 'Produto duplicado.');
            }
        }
    } catch (Throwable $ex) {
        flash_set('error', 'Não foi possível concluir a ação.');
    }
    redirect(admin_url('products.php'));
}

$products = [];
try {
    $products = db()->query("SELECT p.*, b.name AS brand_name FROM products p LEFT JOIN brands b ON b.id = p.brand_id ORDER BY p.ordering ASC, p.id DESC")->fetchAll();
} catch (Throwable $ex) {}

require __DIR__ . '/includes/admin-header.php';
?>

<div class="card">
    <div class="card-header">
        <h2>Produtos</h2>
        <a href="/admin/product-form.php" class="btn btn-primary btn-sm">+ Novo produto</a>
    </div>
    <table>
        <thead>
        <tr><th>Foto</th><th>Nome</th><th>Marca</th><th>Preço</th><th>Status</th><th>Destaque</th><th>Ações</th></tr>
        </thead>
        <tbody>
        <?php if (empty($products)): ?>
        <tr class="empty-row"><td colspan="7">Nenhum produto cadastrado ainda.</td></tr>
        <?php else: foreach ($products as $p): ?>
        <tr>
            <td><img class="table-thumb" src="<?= e($p['main_image'] ?: '/assets/images/product-placeholder.jpg') ?>" alt=""></td>
            <td><?= e($p['name']) ?></td>
            <td><?= e($p['brand_name'] ?? '—') ?></td>
            <td><?= format_price((float)$p['price_to']) ?></td>
            <td><span class="status-pill <?= e($p['status']) ?>"><?= $p['status'] === 'published' ? 'Publicado' : 'Rascunho' ?></span></td>
            <td><?= $p['is_featured'] ? '⭐' : '—' ?></td>
            <td class="actions-cell">
                <a class="btn btn-ghost btn-sm" href="/admin/product-form.php?id=<?= (int)$p['id'] ?>">Editar</a>
                <form method="post" action="/admin/products.php" style="display:inline">
                    <?= csrf_field() ?>
                    <input type="hidden" name="id" value="<?= (int)$p['id'] ?>">
                    <input type="hidden" name="action" value="toggle_status">
                    <button type="submit" class="btn btn-ghost btn-sm"><?= $p['status'] === 'published' ? 'Desativar' : 'Ativar' ?></button>
                </form>
                <form method="post" action="/admin/products.php" style="display:inline">
                    <?= csrf_field() ?>
                    <input type="hidden" name="id" value="<?= (int)$p['id'] ?>">
                    <input type="hidden" name="action" value="duplicate">
                    <button type="submit" class="btn btn-ghost btn-sm">Duplicar</button>
                </form>
                <form method="post" action="/admin/products.php" style="display:inline">
                    <?= csrf_field() ?>
                    <input type="hidden" name="id" value="<?= (int)$p['id'] ?>">
                    <input type="hidden" name="action" value="delete">
                    <button type="submit" class="btn btn-danger btn-sm" data-confirm="Excluir este produto?">Excluir</button>
                </form>
            </td>
        </tr>
        <?php endforeach; endif; ?>
        </tbody>
    </table>
</div>

<?php require __DIR__ . '/includes/admin-footer.php'; ?>
