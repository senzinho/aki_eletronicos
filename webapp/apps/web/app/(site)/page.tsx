import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { buttonStyles } from '../../components/ui/button-styles';
import { Card } from '../../components/ui/Card';
import { ProductCard } from '../../components/site/ProductCard';
import { HeroWhatsAppButton } from '../../components/site/HeroWhatsAppButton';
import { assetUrl } from '../../lib/asset-url';
import { categories, products, settings, testimonials as testimonialsApi } from '../../lib/api';

export async function generateMetadata(): Promise<Metadata> {
  const s = await settings.get();
  return {
    title: s.seo_title || 'Aki Eletrônicos',
    description: s.seo_description,
    openGraph: {
      title: s.seo_title,
      description: s.seo_description,
      images: s.og_image ? [assetUrl(s.og_image)!] : undefined,
    },
  };
}

const DIFERENCIAIS = [
  {
    title: 'Atendimento direto',
    description: 'Converse com a equipe pelo WhatsApp para esclarecer dúvidas e consultar as condições da compra.',
  },
  {
    title: 'Informações transparentes',
    description: 'Consulte especificações, preços e condições disponíveis antes de entrar em contato.',
  },
  {
    title: 'Compra assistida',
    description: 'Escolha seu produto no site e envie os detalhes do pedido diretamente para a loja.',
  },
];

export default async function HomePage() {
  const [s, categoryList, featured, onSale, testimonialList] = await Promise.all([
    settings.get(),
    categories.list(),
    products.list({ featured: true, pageSize: 8 }),
    products.list({ onSale: true, pageSize: 4 }),
    testimonialsApi.list(),
  ]);

  const siteUrl = s.app_url || 'http://localhost:3002';
  const whatsappNumber = s.whatsapp || '5541998132536';
  const heroVideo = assetUrl(s.hero_video || null);
  const heroPoster = assetUrl(s.hero_video_poster || null);
  // Placeholder provisório (mesmo usado no site PHP) — substituir por foto real da loja.
  const lojaPhoto = '/images/loja.jpg';

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          {heroVideo ? (
            <video
              className="h-full w-full object-cover opacity-40"
              autoPlay
              muted
              loop
              playsInline
              poster={heroPoster ?? undefined}
            >
              <source src={heroVideo} />
            </video>
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-surface-1 via-bg to-surface-2 opacity-80" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[520px] max-w-[1200px] flex-col justify-center gap-6 px-4 py-24 sm:px-6">
          <h1 className="max-w-xl font-heading text-4xl font-bold leading-[1.05] tracking-tight text-text sm:text-5xl">
            Seu próximo dispositivo está aqui.
          </h1>
          <p className="max-w-md text-base text-text-muted sm:text-lg">
            Explore celulares, acessórios e tecnologia em um só lugar.
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <Link href="/produtos" className={buttonStyles('primary', 'lg')}>
              Explorar produtos
            </Link>
            <HeroWhatsAppButton whatsappNumber={whatsappNumber} />
          </div>
        </div>
      </section>

      {/* APRESENTAÇÃO DA LOJA */}
      <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
            <Image src={lojaPhoto} alt="Loja Aki Eletrônicos" fill className="object-cover" sizes="(min-width: 768px) 560px, 100vw" />
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">Conheça a Aki Eletrônicos</h2>
            <p className="text-text-muted leading-relaxed">
              Somos especialistas em assistência técnica de celulares e informática, oferecendo serviços ágeis,
              confiáveis e de alta qualidade. Trabalhamos com diversas marcas, incluindo Xiaomi, iPhone, JBL,
              Samsung e muitas outras.
            </p>
            <p className="text-text-muted leading-relaxed">
              Além disso, prestamos serviços de informática, como formatação, reparo de hardware e otimização de
              sistemas, garantindo soluções eficientes para seus dispositivos.
            </p>
            <Link href="/sobre" className={buttonStyles('secondary', 'md', 'self-start')}>
              Conhecer a loja
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      {categoryList.length > 0 && (
        <section className="border-t border-border bg-surface-1/40">
          <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
            <h2 className="font-heading text-2xl font-bold sm:text-3xl mb-8">Explore por categoria</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {categoryList.map((c) => (
                <Link key={c.id} href={`/categoria/${c.slug}`}>
                  <Card className="flex flex-col items-center gap-3 p-6 text-center hover:border-aki-green-500/60 hover:-translate-y-1">
                    <span className="font-heading text-sm font-semibold text-text">{c.name}</span>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DESTAQUES */}
      {featured.items.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">Produtos em destaque</h2>
            <Link href="/produtos" className="text-sm font-medium text-aki-green-400 hover:text-aki-green-300">
              Ver todos
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.items.map((p) => (
              <ProductCard key={p.id} product={p} whatsappNumber={whatsappNumber} siteUrl={siteUrl} />
            ))}
          </div>
        </section>
      )}

      {/* PROMOÇÕES */}
      {onSale.items.length > 0 && (
        <section className="border-t border-border bg-surface-1/40">
          <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
            <h2 className="font-heading text-2xl font-bold sm:text-3xl mb-8">Ofertas que merecem sua atenção</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {onSale.items.map((p) => (
                <ProductCard key={p.id} product={p} whatsappNumber={whatsappNumber} siteUrl={siteUrl} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DIFERENCIAIS */}
      <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
        <h2 className="font-heading text-2xl font-bold sm:text-3xl mb-8 text-center">
          Uma experiência de compra simples
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {DIFERENCIAIS.map((d) => (
            <Card key={d.title} className="p-6">
              <h3 className="font-heading text-base font-semibold mb-2">{d.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{d.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* DEPOIMENTOS (somente quando houver reais) */}
      {testimonialList.length > 0 && (
        <section className="border-t border-border bg-surface-1/40">
          <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
            <h2 className="font-heading text-2xl font-bold sm:text-3xl mb-8">Quem compra, recomenda</h2>
            <div className="grid gap-5 sm:grid-cols-3">
              {testimonialList.map((t) => (
                <Card key={t.id} className="p-6">
                  <div className="flex gap-0.5 mb-3 text-aki-green-400" aria-label={`${t.rating} de 5 estrelas`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} viewBox="0 0 24 24" width="14" height="14" fill={i < t.rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.6 1.6 6.8L12 17.7 5.8 20.9l1.6-6.8-5.2-4.6 6.9-.7z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-text-muted leading-relaxed mb-3">&ldquo;{t.comment}&rdquo;</p>
                  <p className="text-sm font-medium text-text">
                    {t.authorName}
                    {t.context && <span className="text-text-muted font-normal"> — {t.context}</span>}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      <section className="mx-auto max-w-[1200px] px-4 py-20 text-center sm:px-6">
        <h2 className="font-heading text-2xl font-bold sm:text-3xl mb-3">Encontrou o que procurava?</h2>
        <p className="text-text-muted mb-8 max-w-md mx-auto">
          Escolha seu produto e converse com a Aki Eletrônicos para finalizar sua compra.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/produtos" className={buttonStyles('primary', 'lg')}>
            Encontrar meu próximo dispositivo
          </Link>
          <HeroWhatsAppButton whatsappNumber={whatsappNumber} variant="secondary" />
        </div>
      </section>
    </>
  );
}
