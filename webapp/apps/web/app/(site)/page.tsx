import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { buttonStyles } from '../../components/ui/button-styles';
import { Card } from '../../components/ui/Card';
import { Reveal } from '../../components/ui/Reveal';
import { ProductCard } from '../../components/site/ProductCard';
import { HeroWhatsAppButton } from '../../components/site/HeroWhatsAppButton';
import { HeroVideo } from '../../components/site/HeroVideo';
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
          <div className="h-full w-full bg-gradient-to-br from-surface-1 via-bg to-surface-2" />
          {heroVideo && (
            <div className="absolute inset-0">
              <HeroVideo src={heroVideo} poster={heroPoster ?? undefined} />
            </div>
          )}
          {/* Darken only behind the text column so the video stays bright on the rest of the frame */}
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/50 to-transparent lg:to-bg/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[600px] sm:min-h-[680px] lg:min-h-[760px] max-w-[1200px] flex-col justify-center gap-6 px-4 py-24 sm:px-6">
          <h1 className="animate-item-in max-w-xl font-heading text-4xl font-bold leading-[1.05] tracking-tight text-text sm:text-5xl">
            Seu próximo dispositivo está aqui.
          </h1>
          <p className="animate-item-in max-w-md text-base text-text-muted sm:text-lg" style={{ animationDelay: '90ms' }}>
            Explore celulares, acessórios e tecnologia em um só lugar.
          </p>
          <div className="animate-item-in flex flex-wrap gap-3 mt-2" style={{ animationDelay: '170ms' }}>
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
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
            <Image src={lojaPhoto} alt="Loja Aki Eletrônicos" fill className="object-cover" sizes="(min-width: 768px) 560px, 100vw" />
          </Reveal>
          <Reveal delay={100} className="flex flex-col gap-4">
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
          </Reveal>
        </div>
      </section>

      {/* CATEGORIAS */}
      {categoryList.length > 0 && (
        <section className="border-t border-border bg-surface-1/40">
          <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
            <Reveal>
              <h2 className="font-heading text-2xl font-bold sm:text-3xl mb-8">Explore por categoria</h2>
            </Reveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {categoryList.map((c, i) => (
                <Reveal key={c.id} delay={i * 60}>
                  <Link href={`/categoria/${c.slug}`}>
                    <Card className="flex flex-col items-center gap-3 p-6 text-center transition-all duration-300 hover:border-aki-green-500/60 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(47,211,92,0.1)]">
                      <span className="font-heading text-sm font-semibold text-text">{c.name}</span>
                    </Card>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DESTAQUES */}
      {featured.items.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
          <Reveal className="flex items-end justify-between mb-8">
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">Produtos em destaque</h2>
            <Link href="/produtos" className="text-sm font-medium text-aki-green-400 transition-colors hover:text-aki-green-300">
              Ver todos
            </Link>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.items.map((p, i) => (
              <Reveal key={p.id} delay={Math.min(i, 7) * 60}>
                <ProductCard product={p} whatsappNumber={whatsappNumber} siteUrl={siteUrl} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* PROMOÇÕES */}
      {onSale.items.length > 0 && (
        <section className="border-t border-border bg-surface-1/40">
          <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
            <Reveal>
              <h2 className="font-heading text-2xl font-bold sm:text-3xl mb-8">Ofertas que merecem sua atenção</h2>
            </Reveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {onSale.items.map((p, i) => (
                <Reveal key={p.id} delay={Math.min(i, 7) * 60}>
                  <ProductCard product={p} whatsappNumber={whatsappNumber} siteUrl={siteUrl} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DIFERENCIAIS */}
      <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
        <Reveal>
          <h2 className="font-heading text-2xl font-bold sm:text-3xl mb-8 text-center">
            Uma experiência de compra simples
          </h2>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-3">
          {DIFERENCIAIS.map((d, i) => (
            <Reveal key={d.title} delay={i * 80}>
              <Card className="p-6 transition-all duration-300 hover:border-aki-green-500/40 hover:-translate-y-0.5">
                <h3 className="font-heading text-base font-semibold mb-2">{d.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{d.description}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* DEPOIMENTOS (somente quando houver reais) */}
      {testimonialList.length > 0 && (
        <section className="border-t border-border bg-surface-1/40">
          <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
            <Reveal>
              <h2 className="font-heading text-2xl font-bold sm:text-3xl mb-8">Quem compra, recomenda</h2>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-3">
              {testimonialList.map((t, i) => (
                <Reveal key={t.id} delay={i * 80}>
                  <Card className="p-6 transition-all duration-300 hover:border-aki-green-500/40">
                    <div className="flex gap-0.5 mb-3 text-warning" aria-label={`${t.rating} de 5 estrelas`}>
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} size={14} strokeWidth={1.5} fill={idx < t.rating ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed mb-3">&ldquo;{t.comment}&rdquo;</p>
                    <p className="text-sm font-medium text-text">
                      {t.authorName}
                      {t.context && <span className="text-text-muted font-normal"> — {t.context}</span>}
                    </p>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      <Reveal className="mx-auto max-w-[1200px] px-4 py-20 text-center sm:px-6">
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
      </Reveal>
    </>
  );
}
