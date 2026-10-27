</main>

<footer class="site-footer">
    <div class="container footer-grid">
        <div class="footer-brand">
            <span class="logo-text"><?= e(get_setting('nome_empresa', 'Aki Eletrônicos')) ?></span>
            <p>Especializada em celulares, acessórios e assistência técnica.</p>
            <div class="social-icons">
                <?php if ($fb = get_setting('facebook')): ?>
                    <a href="<?= e($fb) ?>" target="_blank" rel="noopener" aria-label="Facebook"><?= icon('facebook') ?></a>
                <?php endif; ?>
                <?php if ($ig = get_setting('instagram')): ?>
                    <a href="<?= e($ig) ?>" target="_blank" rel="noopener" aria-label="Instagram"><?= icon('instagram') ?></a>
                <?php endif; ?>
            </div>
        </div>

        <div class="footer-col">
            <h4>Empresa</h4>
            <ul>
                <li><a href="/quem-somos.php">Sobre</a></li>
                <li><a href="/index.php#celulares">Celulares</a></li>
                <li><a href="/reparos.php">Assistência</a></li>
                <li><a href="/index.php#acessorios">Acessórios</a></li>
                <li><a href="/contato.php">Contato</a></li>
            </ul>
        </div>

        <div class="footer-col">
            <h4>Atendimento</h4>
            <ul>
                <li><a href="<?= e(whatsapp_link('Olá! Vim pelo site e gostaria de saber mais informações.')) ?>" target="_blank" rel="noopener" data-track="whatsapp_click">WhatsApp</a></li>
                <li><a href="tel:+<?= e(preg_replace('/\D/', '', get_setting('whatsapp'))) ?>"><?= e(get_setting('telefone')) ?></a></li>
                <li><a href="mailto:<?= e(get_setting('email')) ?>"><?= e(get_setting('email')) ?></a></li>
            </ul>
        </div>

        <div class="footer-col">
            <h4>Endereço &amp; horário</h4>
            <ul>
                <li><?= e(get_setting('endereco')) ?></li>
                <li><?= e(get_setting('horario_atendimento')) ?></li>
            </ul>
        </div>
    </div>

    <div class="container footer-bottom">
        <p>&copy; <?= date('Y') ?> <?= e(get_setting('nome_empresa', 'Aki Eletrônicos')) ?> — Todos os direitos reservados.</p>
    </div>
</footer>

<a class="whatsapp-float" target="_blank" rel="noopener" aria-label="Falar no WhatsApp"
   href="<?= e(whatsapp_link('Olá! Gostaria de falar com a equipe.')) ?>"
   data-track="whatsapp_click">
    <?= whatsapp_icon() ?>
</a>

<script src="/assets/js/main.js" defer></script>
</body>
</html>
