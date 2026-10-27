# Aki Eletrônicos — Site + Painel Administrativo

Site institucional/e-commerce (venda via WhatsApp) para a Aki Eletrônicos, com painel administrativo completo. Stack: PHP 8+ (PDO), MySQL/MariaDB, HTML5/CSS3/JavaScript puro (sem dependência de Node.js em produção).

## Instalação em hospedagem compartilhada (Apache + PHP + MySQL)

1. Crie um banco de dados MySQL/MariaDB.
2. Importe `database/schema.sql` nesse banco (já inclui dados iniciais: configurações do site, marcas, produtos de demonstração e um usuário administrador).
3. Configure as credenciais do banco via variáveis de ambiente no seu painel de hospedagem (ou edite os valores padrão em `config/config.php`):
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`
   - `APP_URL` (ex: `https://akieletronicos.com.br`) — opcional, usado em SEO/canonical.
4. Faça upload de todos os arquivos para a raiz do domínio.
5. Garanta que as pastas `uploads/products`, `uploads/banners`, `uploads/brands`, `uploads/site` tenham permissão de escrita (755/775).
6. Acesse `/admin` e faça login com o usuário padrão:
   - **Usuário:** `admin`
   - **Senha:** `Admin@12345`
   - **Troque essa senha imediatamente** (crie um novo hash com `password_hash()` e atualize a tabela `admins`, ou implemente uma tela de troca de senha).

## Testando localmente com Docker (opcional)

Se você tiver Docker instalado, é possível subir um ambiente completo (Apache + PHP 8.2 + MySQL 8) sem instalar nada na máquina:

```
docker compose up -d --build
```

O site ficará disponível em `http://localhost:8080` e o MySQL em `localhost:3307` (usuário `aki_user`, senha `aki_pass`, banco `aki_eletronicos`). O schema é importado automaticamente na primeira subida do container do banco.

## Estrutura

```
/index.php            Página inicial
/produto.php           Página de produto (?slug=)
/quem-somos.php        Institucional
/reparos.php           Assistência técnica + formulário de orçamento
/contato.php           Formulário de contato
/admin/                Painel administrativo (login, dashboard, CRUDs)
/api/track.php         Endpoint de analytics (whatsapp_click, banner_click)
/config/               Configuração e conexão PDO
/includes/             Header, footer e funções compartilhadas
/assets/               CSS, JS e imagens
/uploads/               Uploads de produtos, banners, marcas e configurações do site
/database/schema.sql   Schema completo do banco
```

## Segurança implementada

- PDO com prepared statements em todas as consultas.
- Senhas de admin com `password_hash()` / `password_verify()`.
- Tokens CSRF em todos os formulários que alteram dados.
- Sessões com cookies `HttpOnly`, `SameSite=Lax` e `Secure` quando em HTTPS.
- Validação de uploads por MIME real (`finfo`), extensão e tamanho máximo.
- Pasta `/uploads` bloqueada para execução de PHP via `.htaccess`.
- Escapamento de saída (`htmlspecialchars`) em todo o conteúdo dinâmico.
- Headers de segurança (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).

## Observações

- Os 3 produtos de demonstração usam preços de referência coletados do site institucional original — atualize-os pelo painel assim que tiver o catálogo real.
- Não há avaliações (estrelas) fictícias pré-cadastradas: o componente de avaliação só aparece quando um produto tiver `rating_count > 0` no banco.
