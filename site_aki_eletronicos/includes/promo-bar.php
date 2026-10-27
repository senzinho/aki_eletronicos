<?php
$promos = [];
try {
    $promos = db()->query("SELECT text, icon FROM promotional_bars WHERE is_active = 1 AND (start_date IS NULL OR start_date <= CURDATE()) AND (end_date IS NULL OR end_date >= CURDATE()) ORDER BY ordering ASC")->fetchAll();
} catch (Throwable $ex) {
    $promos = [];
}
if (empty($promos)) {
    return;
}
$promoItems = array_merge($promos, $promos);
?>
<div class="promo-bar" aria-label="Novidades e ofertas">
    <div class="promo-track">
        <?php foreach ($promoItems as $p): ?>
        <span class="promo-item"><?= e($p['icon'] ?? '') ?> <?= e($p['text']) ?></span>
        <?php endforeach; ?>
    </div>
</div>
