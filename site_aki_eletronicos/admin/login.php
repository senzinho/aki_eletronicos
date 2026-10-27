<?php
require_once __DIR__ . '/../config/config.php';

if (is_logged_in()) {
    redirect(admin_url('index.php'));
}

$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_verify($_POST['csrf_token'] ?? null)) {
        $error = 'Sessão expirada, tente novamente.';
    } else {
        $username = trim((string)($_POST['username'] ?? ''));
        $password = (string)($_POST['password'] ?? '');

        $stmt = db()->prepare('SELECT * FROM admins WHERE username = ? AND is_active = 1 LIMIT 1');
        $stmt->execute([$username]);
        $admin = $stmt->fetch();

        if ($admin && password_verify($password, $admin['password_hash'])) {
            session_regenerate_id(true);
            $_SESSION['admin_id'] = (int)$admin['id'];
            $_SESSION['admin_name'] = $admin['name'];

            $upd = db()->prepare('UPDATE admins SET last_login_at = NOW() WHERE id = ?');
            $upd->execute([$admin['id']]);

            redirect(admin_url('index.php'));
        }
        $error = 'Usuário ou senha inválidos.';
    }
}
?><!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Login — Painel Administrativo</title>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&family=Sora:wght@700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/admin/assets/admin.css">
</head>
<body class="login-body">
    <form class="login-card" method="post" action="/admin/login.php" novalidate>
        <h1>Aki Eletrônicos</h1>
        <p class="login-subtitle">Painel Administrativo</p>
        <?php if ($error): ?><div class="alert alert-error"><?= e($error) ?></div><?php endif; ?>
        <?= csrf_field() ?>
        <label for="username">Usuário</label>
        <input type="text" id="username" name="username" required autofocus>
        <label for="password">Senha</label>
        <input type="password" id="password" name="password" required>
        <button type="submit" class="btn btn-primary btn-block">Entrar</button>
    </form>
</body>
</html>
