<?php
require_once __DIR__ . '/../../config/config.php';
require_login();

$currentScript = basename($_SERVER['SCRIPT_NAME']);
$adminName = $_SESSION['admin_name'] ?? 'Administrador';

function nav_active(string $file, string $current): string
{
    return $file === $current ? 'active' : '';
}
?><!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= e($pageTitle ?? 'Painel Administrativo') ?> — Aki Eletrônicos</title>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Sora:wght@700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/admin/assets/admin.css">
</head>
<body class="admin-body">
<div class="admin-shell">
    <aside class="admin-sidebar">
        <div class="admin-logo">Aki<span>Admin</span></div>
        <nav class="admin-nav">
            <a href="/admin/index.php" class="<?= nav_active('index.php', $currentScript) ?>">Dashboard</a>
            <a href="/admin/products.php" class="<?= nav_active('products.php', $currentScript) ?> <?= nav_active('product-form.php', $currentScript) ?>">Produtos</a>
            <a href="/admin/banners.php" class="<?= nav_active('banners.php', $currentScript) ?> <?= nav_active('banner-form.php', $currentScript) ?>">Banners</a>
            <a href="/admin/promotions.php" class="<?= nav_active('promotions.php', $currentScript) ?> <?= nav_active('promotion-form.php', $currentScript) ?>">Faixa Promocional</a>
            <a href="/admin/brands.php" class="<?= nav_active('brands.php', $currentScript) ?> <?= nav_active('brand-form.php', $currentScript) ?>">Marcas</a>
            <a href="/admin/testimonials.php" class="<?= nav_active('testimonials.php', $currentScript) ?> <?= nav_active('testimonial-form.php', $currentScript) ?>">Depoimentos</a>
            <a href="/admin/service-requests.php" class="<?= nav_active('service-requests.php', $currentScript) ?>">Solicitações</a>
            <a href="/admin/settings.php" class="<?= nav_active('settings.php', $currentScript) ?>">Configurações</a>
        </nav>
        <a href="/admin/logout.php" class="admin-logout">Sair</a>
    </aside>

    <div class="admin-main">
        <header class="admin-topbar">
            <button class="admin-hamburger" id="admin-hamburger" aria-label="Abrir menu">☰</button>
            <h1><?= e($pageTitle ?? 'Painel Administrativo') ?></h1>
            <span class="admin-user">Olá, <?= e($adminName) ?></span>
        </header>
        <div class="admin-content">
            <?php if ($flash = flash_get('success')): ?><div class="alert alert-success"><?= e($flash) ?></div><?php endif; ?>
            <?php if ($flash = flash_get('error')): ?><div class="alert alert-error"><?= e($flash) ?></div><?php endif; ?>
