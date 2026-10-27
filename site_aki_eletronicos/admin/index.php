<?php
require_once __DIR__ . '/../config/config.php';
require_login();

$pageTitle = 'Dashboard';

$periods = ['hoje' => 'Hoje', '7_dias' => '7 dias', '30_dias' => '30 dias', '90_dias' => '90 dias'];
$period = $_GET['period'] ?? '7_dias';
if (!isset($periods[$period])) $period = '7_dias';

$daysMap = ['hoje' => 1, '7_dias' => 7, '30_dias' => 30, '90_dias' => 90];
$days = $daysMap[$period];

function count_events(string $type, int $days): int
{
    $stmt = db()->prepare("SELECT COUNT(*) c FROM analytics_events WHERE event_type = ? AND created_at >= (NOW() - INTERVAL ? DAY)");
    $stmt->execute([$type, $days]);
    return (int)$stmt->fetch()['c'];
}

$pageViews = 0; $whatsappClicks = 0; $bannerClicks = 0; $totalProducts = 0; $activeBanners = 0;
$topProducts = []; $topInterest = []; $dailySeries = [];

try {
    $pageViews = count_events('page_view', $days);
    $whatsappClicks = count_events('whatsapp_click', $days);
    $bannerClicks = count_events('banner_click', $days);
    $totalProducts = (int)db()->query("SELECT COUNT(*) c FROM products")->fetch()['c'];
    $activeBanners = (int)db()->query("SELECT COUNT(*) c FROM banners WHERE is_active = 1")->fetch()['c'];

    $stmt = db()->prepare("SELECT p.name, COUNT(*) total FROM analytics_events e JOIN products p ON p.id = e.product_id
        WHERE e.event_type = 'product_view' AND e.created_at >= (NOW() - INTERVAL ? DAY)
        GROUP BY p.id ORDER BY total DESC LIMIT 5");
    $stmt->execute([$days]);
    $topProducts = $stmt->fetchAll();

    $stmt = db()->prepare("SELECT p.name, COUNT(*) total FROM analytics_events e JOIN products p ON p.id = e.product_id
        WHERE e.event_type = 'whatsapp_click' AND e.created_at >= (NOW() - INTERVAL ? DAY)
        GROUP BY p.id ORDER BY total DESC LIMIT 5");
    $stmt->execute([$days]);
    $topInterest = $stmt->fetchAll();

    $stmt = db()->prepare("SELECT DATE(created_at) d, COUNT(*) total FROM analytics_events
        WHERE event_type = 'page_view' AND created_at >= (NOW() - INTERVAL ? DAY)
        GROUP BY DATE(created_at) ORDER BY d ASC");
    $stmt->execute([$days]);
    $dailySeries = $stmt->fetchAll();
} catch (Throwable $ex) {
    // Sem dados ainda / banco não configurado — segue com valores zerados.
}

require __DIR__ . '/includes/admin-header.php';
?>

<div class="period-tabs">
    <?php foreach ($periods as $key => $label): ?>
    <a href="/admin/index.php?period=<?= e($key) ?>" class="<?= $key === $period ? 'active' : '' ?>"><?= e($label) ?></a>
    <?php endforeach; ?>
</div>

<div class="metrics-grid">
    <div class="metric-card"><div class="value"><?= number_format($pageViews, 0, ',', '.') ?></div><div class="label">Visualizações</div></div>
    <div class="metric-card"><div class="value"><?= number_format($totalProducts, 0, ',', '.') ?></div><div class="label">Produtos cadastrados</div></div>
    <div class="metric-card"><div class="value"><?= number_format($whatsappClicks, 0, ',', '.') ?></div><div class="label">Cliques no WhatsApp</div></div>
    <div class="metric-card"><div class="value"><?= number_format($activeBanners, 0, ',', '.') ?></div><div class="label">Banners ativos</div></div>
</div>

<div class="card">
    <div class="card-header"><h2>Visualizações por dia</h2></div>
    <canvas id="chart-views" height="90"></canvas>
</div>

<div class="form-grid">
    <div class="card">
        <div class="card-header"><h2>Produtos mais acessados</h2></div>
        <table>
            <tbody>
            <?php if (empty($topProducts)): ?>
                <tr class="empty-row"><td>Sem dados no período.</td></tr>
            <?php else: foreach ($topProducts as $tp): ?>
                <tr><td><?= e($tp['name']) ?></td><td><?= (int)$tp['total'] ?> visualizações</td></tr>
            <?php endforeach; endif; ?>
            </tbody>
        </table>
    </div>
    <div class="card">
        <div class="card-header"><h2>Produtos com maior interesse (WhatsApp)</h2></div>
        <table>
            <tbody>
            <?php if (empty($topInterest)): ?>
                <tr class="empty-row"><td>Sem dados no período.</td></tr>
            <?php else: foreach ($topInterest as $ti): ?>
                <tr><td><?= e($ti['name']) ?></td><td><?= (int)$ti['total'] ?> cliques</td></tr>
            <?php endforeach; endif; ?>
            </tbody>
        </table>
    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.5.0/chart.umd.min.js"></script>
<script>
if (typeof Chart === 'undefined') {
    var chartCanvas = document.getElementById('chart-views');
    if (chartCanvas) {
        chartCanvas.outerHTML = '<p style="color:var(--color-muted)">Não foi possível carregar o gráfico (verifique a conexão com a internet do navegador).</p>';
    }
} else {
new Chart(document.getElementById('chart-views'), {
    type: 'line',
    data: {
        labels: <?= json_encode(array_column($dailySeries, 'd')) ?>,
        datasets: [{
            label: 'Visualizações',
            data: <?= json_encode(array_map('intval', array_column($dailySeries, 'total'))) ?>,
            borderColor: '#00e676',
            backgroundColor: 'rgba(0,230,118,0.15)',
            tension: 0.35,
            fill: true,
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            x: { ticks: { color: '#98a198' }, grid: { color: '#232823' } },
            y: { ticks: { color: '#98a198' }, grid: { color: '#232823' }, beginAtZero: true }
        }
    }
});
}
</script>

<?php require __DIR__ . '/includes/admin-footer.php'; ?>
