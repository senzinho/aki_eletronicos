<?xml version="1.0" encoding="UTF-8"?>

<project>

```
<role>
    Você é um desenvolvedor Full Stack sênior, especialista em:
    UX/UI,
    CRO,
    e-commerce,
    copywriting,
    desenvolvimento PHP,
    MySQL,
    HTML5,
    CSS3,
    JavaScript,
    SEO,
    performance,
    segurança,
    animações modernas
    e arquitetura de sistemas administrativos.
</role>

<objective>
    Criar um site completo, ultramoderno, tecnológico e premium
    para uma empresa especializada em venda de celulares,
    smartphones, acessórios e assistência técnica/reparos.

    O projeto deve ser funcional e pronto para hospedagem,
    não apenas um protótipo visual.
</objective>


<!-- ===================================================== -->
<!-- STACK -->
<!-- ===================================================== -->

<technology>

    <frontend>
        <language>HTML5</language>
        <language>CSS3</language>
        <language>JavaScript ES6+</language>

        <requirements>
            Responsive Design,
            Mobile First,
            Lazy Loading,
            SEO,
            Open Graph,
            Schema.org,
            CSS Animations,
            JavaScript Animations
        </requirements>

        <framework_instruction>
            Evite frameworks desnecessários.
            Priorize HTML, CSS e JavaScript puro quando isso
            resultar em melhor performance e menor complexidade.
        </framework_instruction>
    </frontend>

    <backend>
        <language>PHP 8+</language>
        <database>MySQL / MariaDB</database>
        <database_access>PDO</database_access>
        <architecture>REST API quando necessário</architecture>

        <requirements>
            CRUD completo,
            autenticação administrativa,
            sessões seguras,
            upload de arquivos,
            validação,
            sanitização,
            CSRF,
            XSS Protection,
            SQL Injection Protection,
            controle de acesso
        </requirements>
    </backend>

    <hosting>
        O projeto deve funcionar em hospedagens compartilhadas
        tradicionais com Apache, PHP e MySQL.

        Não criar dependência obrigatória de Node.js para produção.
    </hosting>

</technology>


<!-- ===================================================== -->
<!-- IDENTIDADE VISUAL -->
<!-- ===================================================== -->

<visual_identity>

    <style>
        ultramoderno,
        tecnológico,
        premium,
        minimalista,
        sofisticado,
        alto contraste,
        futurista
    </style>

    <colors>

        <primary>
            <name>Black</name>
            <hex>#050505</hex>
        </primary>

        <secondary>
            <name>Technology Green</name>
            <hex>#00E676</hex>
        </secondary>

        <text>
            <name>White</name>
            <hex>#FFFFFF</hex>
        </text>

        <contrast>
            <name>Red</name>
            <hex>#FF3B30</hex>
        </contrast>

    </colors>

    <color_usage>
        Preto deve dominar os backgrounds.

        Verde deve representar tecnologia,
        ações principais, detalhes e elementos de destaque.

        Branco deve ser utilizado para textos e contraste.

        Vermelho deve ser utilizado estrategicamente
        para descontos, promoções, badges e elementos de urgência.

        Não exagerar no vermelho.
    </color_usage>

    <typography>
        Utilizar preferencialmente:
        Inter,
        Manrope
        ou
        Sora.

        Criar excelente hierarquia visual.
    </typography>

</visual_identity>


<!-- ===================================================== -->
<!-- HERO / PRIMEIRA DOBRA -->
<!-- ===================================================== -->

<hero>

    <objective>
        Criar uma primeira dobra extremamente impactante,
        premium e orientada à conversão.
    </objective>

    <background_video>

        <description>
            Utilizar um vídeo de alta qualidade mostrando
            um smartphone/celular moderno.

            NÃO criar o vídeo.

            Criar somente toda a estrutura necessária
            para receber o vídeo posteriormente.
        </description>

        <backend_field>
            hero_video
        </backend_field>

        <supported_formats>
            MP4,
            WebM
        </supported_formats>

        <behavior>
            autoplay,
            muted,
            loop,
            playsinline
        </behavior>

        <fallback>
            Criar imagem de fallback/poster caso o vídeo
            não carregue.
        </fallback>

    </background_video>


    <copywriting>

        <instruction>
            Criar a copy utilizando técnicas de copywriting
            sênior e CRO.

            Não utilizar simplesmente:
            "Seu celular novo é aqui".

            Criar uma headline muito mais forte,
            moderna e comercial.
        </instruction>

        <headline_direction>
            "Seu próximo celular começa aqui."
        </headline_direction>

        <headline>
            Criar a versão final mais persuasiva.
        </headline>

        <subheadline>
            Smartphones, tecnologia e assistência especializada
            para você escolher, comprar e sair conectado.
        </subheadline>

        <primary_cta>
            Ver celulares
        </primary_cta>

        <secondary_cta>
            Falar no WhatsApp
        </secondary_cta>

        <trust_microcopy>
            Atendimento especializado • Produtos selecionados • Compra rápida
        </trust_microcopy>

    </copywriting>


    <animations>
        fade_in,
        parallax,
        glow,
        blur,
        glassmorphism,
        smooth_transitions,
        subtle_particles,
        scroll_reveal
    </animations>

</hero>


<!-- ===================================================== -->
<!-- PROMOTIONAL BAR -->
<!-- ===================================================== -->

<promotional_bar>

    <description>
        Criar uma faixa horizontal rotativa abaixo do hero.
    </description>

    <examples>
        <item>🔥 Ofertas especiais em smartphones</item>
        <item>⚡ Consulte condições pelo WhatsApp</item>
        <item>🚀 Seu próximo celular está aqui</item>
        <item>🔧 Assistência especializada</item>
    </examples>

    <behavior>
        autoplay,
        infinite_loop,
        pause_on_hover,
        mobile_responsive
    </behavior>

    <admin_crud>
        <fields>
            texto,
            icone,
            ordem,
            ativo,
            data_inicial,
            data_final
        </fields>
    </admin_crud>

</promotional_bar>


<!-- ===================================================== -->
<!-- HEADER -->
<!-- ===================================================== -->

<header>

    <desktop>

        <logo />

        <menu>
            <item>Início</item>
            <item>Celulares</item>
            <item>Ofertas</item>
            <item>Reparos</item>
            <item>Quem somos</item>
            <item>Contato</item>
        </menu>

        <cta>WhatsApp</cta>

    </desktop>

    <behavior>
        Inicialmente transparente sobre o hero.

        Ao realizar scroll:
        background preto,
        blur,
        sticky header.
    </behavior>

    <mobile>
        Criar menu hamburger
        e experiência específica para dispositivos móveis.
    </mobile>

</header>


<!-- ===================================================== -->
<!-- CATEGORIES -->
<!-- ===================================================== -->

<categories>

    <title>
        Tudo para deixar sua tecnologia completa.
    </title>

    <category>Smartphones</category>
    <category>Acessórios</category>
    <category>Reparos</category>
    <category>Ofertas</category>
    <category>Novidades</category>

    <style>
        Criar cards modernos,
        hover effects,
        ícones,
        imagens,
        glow verde
        e microinterações.
    </style>

</categories>


<!-- ===================================================== -->
<!-- PRODUCTS -->
<!-- ===================================================== -->

<products>

    <section_title>
        Encontre o celular ideal para você.
    </section_title>

    <section_description>
        Tecnologia, desempenho e os melhores aparelhos
        para acompanhar o seu ritmo.
    </section_description>

    <product_card>

        <fields>
            imagem_principal,
            nome,
            subtitulo,
            descricao,
            marca,
            preco_de,
            preco_por,
            desconto,
            badge
        </fields>

        <cta>
            Tenho interesse
        </cta>

    </product_card>

    <product_example>

        <name>iPhone 15 Pro</name>

        <subtitle>
            Potência profissional em suas mãos.
        </subtitle>

        <price_from>
            R$ 7.999
        </price_from>

        <price_to>
            R$ 6.999
        </price_to>

        <discount>
            -18%
        </discount>

    </product_example>

</products>


<!-- ===================================================== -->
<!-- PRODUCT PAGE -->
<!-- ===================================================== -->

<product_page>

    <url_structure>
        /produto/{slug}
    </url_structure>

    <elements>
        galeria_de_imagens,
        nome,
        marca,
        subtitulo,
        descricao,
        preco_anterior,
        preco_atual,
        desconto,
        disponibilidade,
        CTA_WhatsApp,
        informacoes_adicionais,
        produtos_relacionados
    </elements>

</product_page>


<!-- ===================================================== -->
<!-- WHATSAPP -->
<!-- ===================================================== -->

<whatsapp>

    <global_number>
        O número deve ser configurável pelo administrador.
    </global_number>

    <product_message>
        Olá! Tenho interesse no produto {NOME_DO_PRODUTO}.
        Gostaria de saber mais informações.
    </product_message>

    <repair_message>
        Olá! Gostaria de solicitar um orçamento
        para reparo do meu celular.
    </repair_message>

    <floating_button>
        Criar botão flutuante de WhatsApp
        com animação pulse suave.
    </floating_button>

    <analytics>
        Registrar cada clique no WhatsApp.
    </analytics>

</whatsapp>


<!-- ===================================================== -->
<!-- CRO -->
<!-- ===================================================== -->

<cro>

    <objective>
        Maximizar conversão de visitantes em contatos
        e oportunidades de venda.
    </objective>

    <strategy>

        <item>
            Benefícios claros.
        </item>

        <item>
            CTAs visíveis.
        </item>

        <item>
            Social proof.
        </item>

        <item>
            Destaques de produtos.
        </item>

        <item>
            Ofertas configuráveis.
        </item>

        <item>
            Urgência somente quando verdadeira.
        </item>

        <item>
            Microcopy de confiança.
        </item>

    </strategy>

    <ratings>
        Criar componente visual de estrelas.

        As estrelas devem ser utilizadas somente como
        dados reais ou conteúdo explicitamente demonstrativo.

        Não apresentar avaliações fictícias como avaliações reais.
    </ratings>

</cro>


<!-- ===================================================== -->
<!-- BANNERS -->
<!-- ===================================================== -->

<banners>

    <main_banner>

        <desktop_size>
            1920x700
        </desktop_size>

        <mobile_size>
            1080x1350
        </mobile_size>

        <fields>
            nome_interno,
            titulo,
            subtitulo,
            imagem_desktop,
            imagem_mobile,
            texto_cta,
            url,
            ordem,
            ativo,
            data_inicial,
            data_final
        </fields>

        <features>
            autoplay,
            infinite_loop,
            navigation,
            dots,
            swipe_mobile
        </features>

    </main_banner>


    <secondary_banners>

        <purpose>
            Criar banners promocionais secundários.
        </purpose>

        <examples>
            Oferta iPhone,
            Semana Xiaomi,
            Acessórios,
            Assistência técnica
        </examples>

        <fields>
            imagem,
            titulo,
            descricao,
            CTA,
            link,
            ordem,
            ativo
        </fields>

    </secondary_banners>

</banners>


<!-- ===================================================== -->
<!-- BRANDS -->
<!-- ===================================================== -->

<brands>

    <title>
        As melhores marcas, em um só lugar.
    </title>

    <carousel>
        <brand>DJI</brand>
        <brand>Xiaomi</brand>
        <brand>Apple</brand>
        <brand>JBL</brand>
        <brand>Samsung</brand>
        <brand>Hollyland</brand>
    </carousel>

    <behavior>
        infinite,
        autoplay,
        smooth,
        responsive
    </behavior>

    <style>
        Logos preferencialmente monocromáticos/brancos.

        Hover:
        verde tecnológico,
        glow,
        scale.
    </style>

</brands>


<!-- ===================================================== -->
<!-- REPAIRS -->
<!-- ===================================================== -->

<repairs>

    <title>
        Seu celular merece cuidado especializado.
    </title>

    <services>

        <service>Troca de tela</service>
        <service>Troca de bateria</service>
        <service>Conector de carga</service>
        <service>Problemas de carregamento</service>
        <service>Diagnóstico</service>
        <service>Manutenção</service>
        <service>Reparos</service>

    </services>

    <cta>
        Solicitar orçamento
    </cta>

    <form>

        <field>Nome</field>
        <field>Modelo do aparelho</field>
        <field>Tipo de problema</field>
        <field>Telefone</field>

    </form>

</repairs>


<!-- ===================================================== -->
<!-- WHY US -->
<!-- ===================================================== -->

<why_choose_us>

    <title>
        Tecnologia com confiança.
    </title>

    <card>
        <title>Atendimento especializado</title>
    </card>

    <card>
        <title>Produtos selecionados</title>
    </card>

    <card>
        <title>Compra segura</title>
    </card>

    <card>
        <title>Assistência técnica</title>
    </card>

    <card>
        <title>Suporte pós-venda</title>
    </card>

</why_choose_us>


<!-- ===================================================== -->
<!-- ABOUT -->
<!-- ===================================================== -->

<about>

    <title>
        Quem somos
    </title>

    <sections>

        <history>
            Apresentar a história da empresa.
        </history>

        <mission>
            Apresentar a missão.
        </mission>

        <values>
            Apresentar os valores.
        </values>

        <differentials>
            Apresentar os diferenciais.
        </differentials>

        <service>
            Apresentar o compromisso com atendimento.
        </service>

    </sections>

    <layout>
        Criar composição premium de imagem + texto.
    </layout>

</about>


<!-- ===================================================== -->
<!-- LOCATION -->
<!-- ===================================================== -->

<location>

    <title>
        Venha nos visitar.
    </title>

    <fields>
        endereco,
        telefone,
        whatsapp,
        email,
        horario_de_atendimento
    </fields>

    <cta>
        Como chegar
    </cta>

    <map>
        Utilizar Google Maps através de link configurável.
    </map>

</location>


<!-- ===================================================== -->
<!-- FOOTER -->
<!-- ===================================================== -->

<footer>

    <column title="Empresa">
        <item>Quem somos</item>
        <item>Contato</item>
        <item>Assistência</item>
    </column>

    <column title="Produtos">
        <item>Smartphones</item>
        <item>Acessórios</item>
        <item>Ofertas</item>
    </column>

    <column title="Atendimento">
        <item>WhatsApp</item>
        <item>Telefone</item>
        <item>Endereço</item>
    </column>

    <column title="Redes sociais">
        <item>Instagram</item>
        <item>Facebook</item>
        <item>TikTok</item>
    </column>

    <copyright>
        © 2026 — Todos os direitos reservados.
    </copyright>

</footer>


<!-- ===================================================== -->
<!-- ADMIN -->
<!-- ===================================================== -->

<admin>

    <url>
        /admin
    </url>

    <authentication>
        login,
        logout,
        password_hash,
        password_verify,
        session_security
    </authentication>


    <dashboard>

        <metrics>

            <metric>
                Visualizações
            </metric>

            <metric>
                Produtos cadastrados
            </metric>

            <metric>
                Cliques no WhatsApp
            </metric>

            <metric>
                Produtos mais acessados
            </metric>

            <metric>
                Produtos com maior interesse
            </metric>

            <metric>
                Banners ativos
            </metric>

            <metric>
                Cliques nos banners
            </metric>

        </metrics>

        <periods>
            hoje,
            7_dias,
            30_dias,
            90_dias
        </periods>

        <charts>
            Criar gráficos modernos e responsivos.
        </charts>

    </dashboard>


    <!-- PRODUCT CRUD -->

    <products_crud>

        <list>

            <columns>
                foto,
                nome,
                marca,
                preco,
                status,
                destaque,
                acoes
            </columns>

        </list>

        <actions>
            editar,
            excluir,
            duplicar,
            ativar,
            desativar
        </actions>

        <form>

            <field>Nome</field>
            <field>Slug</field>
            <field>Subtítulo</field>
            <field>Descrição</field>
            <field>Marca</field>
            <field>Categoria</field>
            <field>Preço De</field>
            <field>Preço Por</field>
            <field>Imagem principal</field>
            <field>Galeria de imagens</field>
            <field>Destaque</field>
            <field>Badge</field>
            <field>Status</field>
            <field>Ordem</field>

        </form>

    </products_crud>


    <!-- BANNER CRUD -->

    <banners_crud>

        <fields>
            nome_interno,
            titulo,
            subtitulo,
            imagem_desktop,
            imagem_mobile,
            CTA,
            URL,
            ordem,
            ativo,
            data_inicial,
            data_final
        </fields>

        <preview>
            Mostrar preview desktop e mobile
            antes de salvar.
        </preview>

    </banners_crud>


    <!-- PROMOTIONAL BAR CRUD -->

    <promotions_crud>

        <fields>
            texto,
            icone,
            ordem,
            ativo,
            data_inicial,
            data_final
        </fields>

    </promotions_crud>


    <!-- BRANDS CRUD -->

    <brands_crud>

        <fields>
            nome,
            logo,
            link,
            ordem,
            ativo
        </fields>

    </brands_crud>


    <!-- SITE SETTINGS -->

    <settings>

        <fields>

            nome_empresa

            logo

            favicon

            whatsapp

            telefone

            email

            endereco

            google_maps

            instagram

            facebook

            tiktok

            hero_video

            hero_video_poster

            seo_title

            seo_description

            og_image

        </fields>

    </settings>


    <!-- HERO VIDEO -->

    <hero_video_admin>

        <fields>

            video_url

            video_upload

            poster

            ativo

            overlay

        </fields>

        <description>
            O administrador deve conseguir trocar
            o vídeo principal sem alterar o código.
        </description>

    </hero_video_admin>

</admin>


<!-- ===================================================== -->
<!-- IMAGE SYSTEM -->
<!-- ===================================================== -->

<images>

    <product>
        <recommended_size>
            800x1000
        </recommended_size>

        <formats>
            WebP,
            JPG,
            PNG
        </formats>

        <preferred>
            WebP
        </preferred>
    </product>


    <desktop_banner>
        <recommended_size>
            1920x700
        </recommended_size>
    </desktop_banner>


    <mobile_banner>
        <recommended_size>
            1080x1350
        </recommended_size>
    </mobile_banner>


    <logo>
        <recommended_size>
            500x200
        </recommended_size>
    </logo>

</images>


<!-- ===================================================== -->
<!-- ANALYTICS -->
<!-- ===================================================== -->

<analytics>

    <events>

        <event>page_view</event>

        <event>product_view</event>

        <event>whatsapp_click</event>

        <event>banner_click</event>

    </events>

    <database_table>
        analytics_events
    </database_table>

    <fields>
        id,
        event_type,
        product_id,
        banner_id,
        page,
        created_at
    </fields>

</analytics>


<!-- ===================================================== -->
<!-- DATABASE -->
<!-- ===================================================== -->

<database>

    <tables>

        <table>admins</table>

        <table>products</table>

        <table>product_images</table>

        <table>categories</table>

        <table>brands</table>

        <table>banners</table>

        <table>promotional_bars</table>

        <table>site_settings</table>

        <table>analytics_events</table>

        <table>service_requests</table>

        <table>social_links</table>

    </tables>

    <requirement>
        Criar relacionamentos, índices,
        chaves estrangeiras e estrutura SQL organizada.
    </requirement>

</database>


<!-- ===================================================== -->
<!-- SECURITY -->
<!-- ===================================================== -->

<security>

    <requirement>
        Implementar segurança real em todas as áreas.
    </requirement>

    <protections>

        <item>PDO Prepared Statements</item>

        <item>password_hash()</item>

        <item>password_verify()</item>

        <item>CSRF Tokens</item>

        <item>Session Security</item>

        <item>Upload Validation</item>

        <item>MIME Validation</item>

        <item>File Size Validation</item>

        <item>Extension Validation</item>

        <item>HTML Escaping</item>

        <item>XSS Protection</item>

        <item>SQL Injection Protection</item>

        <item>Authorization</item>

    </protections>

</security>


<!-- ===================================================== -->
<!-- UPLOADS -->
<!-- ===================================================== -->

<uploads>

    <directories>

        <directory>
            /uploads/products/
        </directory>

        <directory>
            /uploads/banners/
        </directory>

        <directory>
            /uploads/brands/
        </directory>

        <directory>
            /uploads/site/
        </directory>

    </directories>

    <requirements>
        gerar nomes únicos,
        validar MIME,
        validar extensão,
        validar tamanho,
        impedir arquivos perigosos
    </requirements>

</uploads>


<!-- ===================================================== -->
<!-- SEO -->
<!-- ===================================================== -->

<seo>

    <requirements>

        title

        meta_description

        canonical

        OpenGraph

        TwitterCards

        sitemap.xml

        robots.txt

        friendly_urls

        Schema_Product

        Schema_LocalBusiness

    </requirements>

    <products>
        Cada produto deve possuir
        SEO próprio.
    </products>

</seo>


<!-- ===================================================== -->
<!-- PERFORMANCE -->
<!-- ===================================================== -->

<performance>

    <requirements>

        lazy_loading

        webp

        responsive_images

        preload_hero

        optimized_css

        deferred_javascript

        caching

        minimal_dependencies

    </requirements>

    <video>
        O vídeo do hero não deve prejudicar
        significativamente o carregamento inicial.
    </video>

</performance>


<!-- ===================================================== -->
<!-- ANIMATIONS -->
<!-- ===================================================== -->

<animations>

    <effects>

        reveal_on_scroll

        fade

        slide

        scale

        hover_cards

        glow

        parallax

        marquee

        infinite_carousel

        micro_interactions

    </effects>

    <accessibility>
        Respeitar prefers-reduced-motion.
    </accessibility>

</animations>


<!-- ===================================================== -->
<!-- MOBILE -->
<!-- ===================================================== -->

<mobile>

    <approach>
        Mobile First
    </approach>

    <breakpoints>

        <desktop>
            1920px
        </desktop>

        <desktop_medium>
            1440px
        </desktop_medium>

        <tablet>
            1024px
        </tablet>

        <tablet_small>
            768px
        </tablet_small>

        <mobile_large>
            430px
        </mobile_large>

        <mobile>
            390px
        </mobile>

        <mobile_small>
            375px
        </mobile_small>

        <mobile_extra_small>
            320px
        </mobile_extra_small>

    </breakpoints>

    <requirements>

        Não permitir overflow horizontal.

        Criar menu mobile.

        Criar hero específico para mobile.

        Utilizar banner mobile.

        Ajustar cards.

        Ajustar tipografia.

        Ajustar botões.

        Ajustar carrosséis.

        Manter excelente experiência de toque.

        Não deformar imagens.

    </requirements>

</mobile>


<!-- ===================================================== -->
<!-- PROJECT STRUCTURE -->
<!-- ===================================================== -->

<project_structure>

    <directory>/index.php</directory>

    <directory>/produto.php</directory>

    <directory>/contato.php</directory>

    <directory>/quem-somos.php</directory>

    <directory>/reparos.php</directory>

    <directory>/admin/</directory>

    <directory>/api/</directory>

    <directory>/config/</directory>

    <directory>/includes/</directory>

    <directory>/assets/css/</directory>

    <directory>/assets/js/</directory>

    <directory>/assets/images/</directory>

    <directory>/assets/videos/</directory>

    <directory>/uploads/products/</directory>

    <directory>/uploads/banners/</directory>

    <directory>/uploads/brands/</directory>

    <directory>/uploads/site/</directory>

    <file>/database/schema.sql</file>

</project_structure>


<!-- ===================================================== -->
<!-- DEMO DATA -->
<!-- ===================================================== -->

<demo_data>

    <instruction>
        Criar produtos demonstrativos para permitir
        visualizar o sistema funcionando.
    </instruction>

    <brands>
        Apple,
        Samsung,
        Xiaomi,
        DJI,
        JBL,
        Hollyland
    </brands>

    <important>
        Não apresentar avaliações fictícias como reais.
        Utilizar dados demonstrativos claramente identificáveis.
    </important>

</demo_data>


<!-- ===================================================== -->
<!-- CONVERSION FUNNEL -->
<!-- ===================================================== -->

<conversion_strategy>

    <primary_funnel>
        VISITANTE
        →
        PRODUTO
        →
        INTERESSE
        →
        WHATSAPP
        →
        VENDA
    </primary_funnel>

    <priority>
        descoberta,
        desejo,
        confiança,
        produto,
        CTA,
        WhatsApp
    </priority>

    <instruction>
        Não criar checkout complexo se o modelo de negócio
        utilizar WhatsApp como principal canal de venda.
    </instruction>

</conversion_strategy>


<!-- ===================================================== -->
<!-- FINAL DESIGN DIRECTION -->
<!-- ===================================================== -->

<final_visual_direction>

    <must_feel_like>
        Uma empresa de tecnologia premium
        especializada em smartphones.
    </must_feel_like>

    <avoid>
        template genérico,
        loja barata,
        site antigo,
        aparência WordPress padrão,
        landing page simples,
        excesso de elementos,
        excesso de cores
    </avoid>

    <use>
        black backgrounds,
        technology green,
        white typography,
        strategic red,
        glassmorphism,
        premium cards,
        subtle neon glow,
        large smartphone imagery,
        strong typography,
        negative space,
        smooth animations
    </use>

</final_visual_direction>


<!-- ===================================================== -->
<!-- HERO LOAD SEQUENCE -->
<!-- ===================================================== -->

<initial_experience>

    <step>Header aparece suavemente.</step>

    <step>
        Vídeo do smartphone começa.
    </step>

    <step>
        Overlay escuro cria contraste.
    </step>

    <step>
        Headline aparece.
    </step>

    <step>
        Subheadline aparece.
    </step>

    <step>
        CTA aparece.
    </step>

    <step>
        Elementos de confiança aparecem.
    </step>

    <step>
        Usuário consegue acessar imediatamente
        os celulares ou WhatsApp.
    </step>

</initial_experience>


<!-- ===================================================== -->
<!-- DELIVERY -->
<!-- ===================================================== -->

<delivery>

    <requirement>
        Entregar o projeto completo e funcional.
    </requirement>

    <items>

        <item>Frontend completo</item>

        <item>Backend PHP</item>

        <item>Banco MySQL</item>

        <item>Painel administrativo</item>

        <item>CRUD de produtos</item>

        <item>CRUD de banners</item>

        <item>CRUD de promoções</item>

        <item>CRUD de marcas</item>

        <item>Configurações do site</item>

        <item>Upload de imagens</item>

        <item>Upload/configuração do vídeo</item>

        <item>WhatsApp dinâmico</item>

        <item>Analytics</item>

        <item>Dashboard</item>

        <item>SEO</item>

        <item>Responsividade</item>

        <item>Segurança</item>

        <item>Animações</item>

        <item>Página individual de produto</item>

        <item>Quem Somos</item>

        <item>Reparos</item>

        <item>Contato</item>

        <item>Footer</item>

        <item>Menu Mobile</item>

    </items>

    <installation>

        <step>
            Criar banco MySQL.
        </step>

        <step>
            Importar database/schema.sql.
        </step>

        <step>
            Configurar credenciais do banco.
        </step>

        <step>
            Fazer upload dos arquivos.
        </step>

        <step>
            Configurar permissões das pastas de upload.
        </step>

        <step>
            Acessar /admin.
        </step>

    </installation>

</delivery>


<!-- ===================================================== -->
<!-- FINAL INSTRUCTION -->
<!-- ===================================================== -->

<final_instruction>

    Antes de escrever o código, pense simultaneamente como:

    um Designer UX/UI sênior,

    um especialista em CRO,

    um Copywriter sênior,

    um desenvolvedor Full Stack,

    um especialista em e-commerce,

    um especialista em performance,

    e um especialista em segurança.

    A prioridade absoluta deve ser:

    CONVERSÃO
    +
    VELOCIDADE
    +
    TECNOLOGIA
    +
    CONFIANÇA
    +
    EXPERIÊNCIA PREMIUM.

    Não simplifique os requisitos.

    Não entregue somente HTML visual.

    Criar uma solução Full Stack realmente funcional,
    modular, segura, responsiva, escalável
    e pronta para hospedagem PHP/MySQL.

</final_instruction>
```

</project>
