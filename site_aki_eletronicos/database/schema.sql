-- Aki Eletrônicos — Schema MySQL / MariaDB
-- Charset UTF-8MB4, InnoDB, chaves estrangeiras e índices.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------
-- admins
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    username VARCHAR(60) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    last_login_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Usuário padrão: admin / Admin@12345  (TROCAR IMEDIATAMENTE após instalar)
INSERT INTO admins (name, email, username, password_hash) VALUES
('Administrador', 'admin@akieletronicos.com.br', 'admin',
'$2a$10$Lq.HhF2H7fhbAUcGHAmyK.E8ilWSw6vd1s/589qpCBCV/0Hr5GCOa');

-- ---------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    icon VARCHAR(60) NULL,
    ordering INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO categories (name, slug, icon, ordering) VALUES
('Smartphones', 'smartphones', 'smartphone', 1),
('Acessórios', 'acessorios', 'headphones', 2),
('Reparos', 'reparos', 'wrench', 3),
('Ofertas', 'ofertas', 'tag', 4),
('Novidades', 'novidades', 'sparkles', 5);

-- ---------------------------------------------------------------
-- brands
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS brands (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    logo VARCHAR(255) NULL,
    link VARCHAR(255) NULL,
    ordering INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO brands (name, slug, ordering) VALUES
('Apple', 'apple', 1),
('Xiaomi', 'xiaomi', 2),
('Samsung', 'samsung', 3),
('JBL', 'jbl', 4);

-- ---------------------------------------------------------------
-- products
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    subtitle VARCHAR(200) NULL,
    description TEXT NULL,
    brand_id INT UNSIGNED NULL,
    category_id INT UNSIGNED NULL,
    price_from DECIMAL(10,2) NULL,
    price_to DECIMAL(10,2) NOT NULL,
    badge VARCHAR(40) NULL,
    main_image VARCHAR(255) NULL,
    rating_avg DECIMAL(2,1) NULL,
    rating_count INT UNSIGNED NOT NULL DEFAULT 0,
    is_demo TINYINT(1) NOT NULL DEFAULT 0,
    is_featured TINYINT(1) NOT NULL DEFAULT 0,
    status ENUM('draft','published') NOT NULL DEFAULT 'published',
    ordering INT NOT NULL DEFAULT 0,
    seo_title VARCHAR(180) NULL,
    seo_description VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_brand FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_products_status (status),
    INDEX idx_products_featured (is_featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------
-- product_images
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_images (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNSIGNED NOT NULL,
    image VARCHAR(255) NOT NULL,
    ordering INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_images_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dados demonstrativos (claramente identificados como demo, preços de referência coletados do site em 2026)
INSERT INTO products (name, slug, subtitle, description, brand_id, category_id, price_from, price_to, badge, is_demo, is_featured, status, ordering) VALUES
('Xiaomi Redmi Note 15 256GB', 'xiaomi-redmi-note-15-256gb', 'Desempenho e bateria para o seu dia a dia.', 'Smartphone Xiaomi Redmi Note 15 com 256GB de armazenamento. Produto demonstrativo — consulte disponibilidade e condições reais pelo WhatsApp.', 2, 1, NULL, 1599.00, 'Pix', 1, 1, 'published', 1),
('iPhone 15 128GB', 'iphone-15-128gb', 'A experiência Apple, ao seu alcance.', 'iPhone 15 com 128GB de armazenamento. Produto demonstrativo — consulte disponibilidade e condições reais pelo WhatsApp.', 1, 1, NULL, 4299.00, 'Pix', 1, 1, 'published', 2),
('iPhone 17 256GB', 'iphone-17-256gb', 'Potência profissional em suas mãos.', 'iPhone 17 com 256GB de armazenamento. Produto demonstrativo — consulte disponibilidade e condições reais pelo WhatsApp.', 1, 1, NULL, 5699.00, 'Novo', 1, 1, 'published', 3);

-- ---------------------------------------------------------------
-- banners
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS banners (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    internal_name VARCHAR(120) NOT NULL,
    title VARCHAR(160) NULL,
    subtitle VARCHAR(200) NULL,
    image_desktop VARCHAR(255) NULL,
    image_mobile VARCHAR(255) NULL,
    cta_text VARCHAR(80) NULL,
    url VARCHAR(255) NULL,
    ordering INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    start_date DATE NULL,
    end_date DATE NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------
-- promotional_bars
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS promotional_bars (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    text VARCHAR(200) NOT NULL,
    icon VARCHAR(20) NULL,
    ordering INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    start_date DATE NULL,
    end_date DATE NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO promotional_bars (text, icon, ordering) VALUES
('Ofertas especiais em smartphones', '🔥', 1),
('Consulte condições pelo WhatsApp', '⚡', 2),
('Seu próximo celular está aqui', '🚀', 3),
('Assistência especializada', '🔧', 4);

-- ---------------------------------------------------------------
-- social_links
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS social_links (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    platform VARCHAR(40) NOT NULL,
    url VARCHAR(255) NOT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO social_links (platform, url) VALUES
('facebook', 'https://www.facebook.com/akieletronicos'),
('instagram', 'https://www.instagram.com/aki.eletronicos/');

-- ---------------------------------------------------------------
-- site_settings (chave/valor)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
    setting_key VARCHAR(60) PRIMARY KEY,
    setting_value TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO site_settings (setting_key, setting_value) VALUES
('nome_empresa', 'Aki Eletrônicos'),
('logo', ''),
('favicon', ''),
('whatsapp', '5541998132536'),
('telefone', '(41) 9813-2536'),
('email', 'akieletronicos1@gmail.com'),
('endereco', 'Rua XV de Novembro, 261 - Centro (Sobreloja), Colombo, PR'),
('google_maps', 'https://maps.google.com/maps?q=Rua%20XV%20de%20novembro%2C%20261%20-%20Colombo%2FPR%2C%20Brazil&t=m&z=15&output=embed'),
('instagram', 'https://www.instagram.com/aki.eletronicos/'),
('facebook', 'https://www.facebook.com/akieletronicos'),
('tiktok', ''),
('hero_video', ''),
('hero_video_poster', ''),
('horario_atendimento', 'Segunda a Sábado — consulte horários pelo WhatsApp'),
('seo_title', 'Aki Eletrônicos — Smartphones, Acessórios e Assistência Técnica em Colombo/PR'),
('seo_description', 'Especializada em celulares: venda de smartphones Apple, Xiaomi, Samsung, acessórios e assistência técnica especializada em Colombo/PR.'),
('og_image', '');

-- ---------------------------------------------------------------
-- service_requests (formulários de reparo e contato)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS service_requests (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    type ENUM('reparo','contato') NOT NULL DEFAULT 'contato',
    name VARCHAR(120) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(180) NULL,
    device_model VARCHAR(120) NULL,
    problem_type VARCHAR(120) NULL,
    message TEXT NULL,
    status ENUM('novo','em_andamento','concluido') NOT NULL DEFAULT 'novo',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------
-- analytics_events
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics_events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    event_type ENUM('page_view','product_view','whatsapp_click','banner_click') NOT NULL,
    product_id INT UNSIGNED NULL,
    banner_id INT UNSIGNED NULL,
    page VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_events_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    CONSTRAINT fk_events_banner FOREIGN KEY (banner_id) REFERENCES banners(id) ON DELETE SET NULL,
    INDEX idx_events_type_date (event_type, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------
-- testimonials (depoimentos reais de clientes — sem dados fictícios)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS testimonials (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    author_name VARCHAR(120) NOT NULL,
    rating TINYINT UNSIGNED NOT NULL DEFAULT 5,
    comment TEXT NOT NULL,
    context VARCHAR(160) NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    ordering INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
