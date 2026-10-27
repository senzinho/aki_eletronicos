<?php
require_once __DIR__ . '/../config/config.php';
require_login();

$id = isset($_GET['id']) ? (int)$_GET['id'] : (isset($_POST['id']) ? (int)$_POST['id'] : 0);
$product = [
    'id' => 0, 'name' => '', 'slug' => '', 'subtitle' => '', 'description' => '',
    'brand_id' => '', 'category_id' => '', 'price_from' => '', 'price_to' => '',
    'badge' => '', 'main_image' => '', 'is_featured' => 0, 'status' => 'published',
    'ordering' => 0, 'seo_title' => '', 'seo_description' => '',
];
$errors = [];

$brands = []; $categories = [];
try {
    $brands = db()->query('SELECT * FROM brands ORDER BY name ASC')->fetchAll();
    $categories = db()->query('SELECT * FROM categories ORDER BY name ASC')->fetchAll();
} catch (Throwable $ex) {}

if ($id) {
    $stmt = db()->prepare('SELECT * FROM products WHERE id = ?');
    $stmt->execute([$id]);
    $found = $stmt->fetch();
    if ($found) $product = $found;
}

$pageTitle = $id ? 'Editar produto' : 'Novo produto';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_verify($_POST['csrf_token'] ?? null)) {
        $errors[] = 'Sessão expirada, tente novamente.';
    } else {
        $product = array_merge($product, [
            'name' => trim((string)($_POST['name'] ?? '')),
            'subtitle' => trim((string)($_POST['subtitle'] ?? '')),
            'description' => trim((string)($_POST['description'] ?? '')),
            'brand_id' => ($_POST['brand_id'] ?? '') !== '' ? (int)$_POST['brand_id'] : null,
            'category_id' => ($_POST['category_id'] ?? '') !== '' ? (int)$_POST['category_id'] : null,
            'price_from' => ($_POST['price_from'] ?? '') !== '' ? (float)str_replace(',', '.', $_POST['price_from']) : null,
            'price_to' => (float)str_replace(',', '.', $_POST['price_to'] ?? '0'),
            'badge' => trim((string)($_POST['badge'] ?? '')),
            'is_featured' => isset($_POST['is_featured']) ? 1 : 0,
            'status' => in_array($_POST['status'] ?? '', ['draft', 'published'], true) ? $_POST['status'] : 'published',
            'ordering' => (int)($_POST['ordering'] ?? 0),
            'seo_title' => trim((string)($_POST['seo_title'] ?? '')),
            'seo_description' => trim((string)($_POST['seo_description'] ?? '')),
        ]);

        if ($product['name'] === '') $errors[] = 'Informe o nome do produto.';
        if (empty($product['price_to']) || $product['price_to'] <= 0) $errors[] = 'Informe um preço válido.';

        if (empty($_FILES['main_image']['name']) && empty($product['main_image']) && !$id) {
            // imagem opcional na criação, pode ser adicionada depois
        }

        if (!empty($_FILES['main_image']['name'])) {
            $uploaded = save_upload($_FILES['main_image'], 'products');
            if ($uploaded === null) {
                $errors[] = 'Imagem inválida. Envie um arquivo JPG, PNG ou WebP de até 5MB.';
            } else {
                $product['main_image'] = $uploaded;
            }
        }

        if (empty($errors)) {
            $slugBase = slugify($product['name']);
            $slug = $slugBase;
            $suffix = 1;
            while (true) {
                $check = db()->prepare('SELECT id FROM products WHERE slug = ? AND id != ?');
                $check->execute([$slug, $id]);
                if (!$check->fetch()) break;
                $suffix++;
                $slug = $slugBase . '-' . $suffix;
            }
            $product['slug'] = $slug;

            try {
                if ($id) {
                    $stmt = db()->prepare("UPDATE products SET name=?, slug=?, subtitle=?, description=?, brand_id=?, category_id=?, price_from=?, price_to=?, badge=?, main_image=?, is_featured=?, status=?, ordering=?, seo_title=?, seo_description=? WHERE id=?");
                    $stmt->execute([$product['name'], $product['slug'], $product['subtitle'], $product['description'], $product['brand_id'], $product['category_id'], $product['price_from'], $product['price_to'], $product['badge'], $product['main_image'], $product['is_featured'], $product['status'], $product['ordering'], $product['seo_title'], $product['seo_description'], $id]);
                    flash_set('success', 'Produto atualizado com sucesso.');
                } else {
                    $stmt = db()->prepare("INSERT INTO products (name, slug, subtitle, description, brand_id, category_id, price_from, price_to, badge, main_image, is_featured, status, ordering, seo_title, seo_description) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
                    $stmt->execute([$product['name'], $product['slug'], $product['subtitle'], $product['description'], $product['brand_id'], $product['category_id'], $product['price_from'], $product['price_to'], $product['badge'], $product['main_image'], $product['is_featured'], $product['status'], $product['ordering'], $product['seo_title'], $product['seo_description']]);
                    flash_set('success', 'Produto criado com sucesso.');
                }
                redirect(admin_url('products.php'));
            } catch (Throwable $ex) {
                $errors[] = 'Não foi possível salvar o produto.';
            }
        }
    }
}

require __DIR__ . '/includes/admin-header.php';
?>

<?php if (!empty($errors)): ?>
<div class="alert alert-error"><ul><?php foreach ($errors as $err): ?><li><?= e($err) ?></li><?php endforeach; ?></ul></div>
<?php endif; ?>

<form class="card" method="post" action="/admin/product-form.php<?= $id ? '?id=' . $id : '' ?>" enctype="multipart/form-data">
    <?= csrf_field() ?>
    <input type="hidden" name="id" value="<?= (int)$product['id'] ?>">
    <div class="form-grid">
        <div class="form-group full">
            <label for="name">Nome</label>
            <input type="text" id="name" name="name" required value="<?= e($product['name']) ?>">
        </div>
        <div class="form-group full">
            <label for="subtitle">Subtítulo</label>
            <input type="text" id="subtitle" name="subtitle" value="<?= e($product['subtitle']) ?>">
        </div>
        <div class="form-group full">
            <label for="description">Descrição</label>
            <textarea id="description" name="description" rows="4"><?= e($product['description']) ?></textarea>
        </div>
        <div class="form-group">
            <label for="brand_id">Marca</label>
            <select id="brand_id" name="brand_id">
                <option value="">—</option>
                <?php foreach ($brands as $b): ?>
                <option value="<?= (int)$b['id'] ?>" <?= (int)$product['brand_id'] === (int)$b['id'] ? 'selected' : '' ?>><?= e($b['name']) ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="form-group">
            <label for="category_id">Categoria</label>
            <select id="category_id" name="category_id">
                <option value="">—</option>
                <?php foreach ($categories as $c): ?>
                <option value="<?= (int)$c['id'] ?>" <?= (int)$product['category_id'] === (int)$c['id'] ? 'selected' : '' ?>><?= e($c['name']) ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="form-group">
            <label for="price_from">Preço De (opcional)</label>
            <input type="text" id="price_from" name="price_from" value="<?= e((string)($product['price_from'] ?? '')) ?>" placeholder="0,00">
        </div>
        <div class="form-group">
            <label for="price_to">Preço Por</label>
            <input type="text" id="price_to" name="price_to" required value="<?= e((string)$product['price_to']) ?>" placeholder="0,00">
        </div>
        <div class="form-group">
            <label for="badge">Badge</label>
            <input type="text" id="badge" name="badge" value="<?= e($product['badge']) ?>" placeholder="Ex: Novo, Pix, Oferta">
        </div>
        <div class="form-group">
            <label for="ordering">Ordem</label>
            <input type="number" id="ordering" name="ordering" value="<?= (int)$product['ordering'] ?>">
        </div>
        <div class="form-group">
            <label for="status">Status</label>
            <select id="status" name="status">
                <option value="published" <?= $product['status'] === 'published' ? 'selected' : '' ?>>Publicado</option>
                <option value="draft" <?= $product['status'] === 'draft' ? 'selected' : '' ?>>Rascunho</option>
            </select>
        </div>
        <div class="form-group checkbox">
            <input type="checkbox" id="is_featured" name="is_featured" <?= $product['is_featured'] ? 'checked' : '' ?>>
            <label for="is_featured" style="margin:0">Produto em destaque</label>
        </div>
        <div class="form-group full">
            <label for="main_image">Imagem principal</label>
            <?php if (!empty($product['main_image'])): ?><img class="current-image" src="<?= e($product['main_image']) ?>" alt=""><?php endif; ?>
            <input type="file" id="main_image" name="main_image" accept="image/jpeg,image/png,image/webp">
        </div>
        <div class="form-group">
            <label for="seo_title">SEO — Título</label>
            <input type="text" id="seo_title" name="seo_title" value="<?= e($product['seo_title']) ?>">
        </div>
        <div class="form-group">
            <label for="seo_description">SEO — Descrição</label>
            <input type="text" id="seo_description" name="seo_description" value="<?= e($product['seo_description']) ?>">
        </div>

        <div class="form-actions">
            <button type="submit" class="btn btn-primary">Salvar produto</button>
            <a href="/admin/products.php" class="btn btn-ghost">Cancelar</a>
        </div>
    </div>
</form>

<?php require __DIR__ . '/includes/admin-footer.php'; ?>
