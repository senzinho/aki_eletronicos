import type { Metadata } from 'next';
import Image from 'next/image';
import { HeroVideo } from '../../../components/site/HeroVideo';
import { HeroWhatsAppButton } from '../../../components/site/HeroWhatsAppButton';
import { Card } from '../../../components/ui/Card';
import { Reveal } from '../../../components/ui/Reveal';
import { assetUrl } from '../../../lib/asset-url';
import { brands, settings } from '../../../lib/api';

export const metadata: Metadata = {
  title: 'Sobre a loja',
  description: 'Conheça a Aki Eletrônicos: assistência técnica especializada e venda de smartphones em Colombo/PR.',
  alternates: { canonical: '/sobre' },
  openGraph: {
    title: 'Sobre a loja',
    description: 'Conheça a Aki Eletrônicos: assistência técnica especializada e venda de smartphones em Colombo/PR.',
  },
};

export default async function SobrePage() {
  const [s, brandList] = await Promise.all([settings.get(), brands.list()]);
  const aboutVideo = assetUrl(s.about_video || null);
  const aboutPoster = assetUrl(s.about_video_poster || null);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
      <div className="grid items-center gap-10 md:grid-cols-2 mb-16">
        <Reveal className="reveal-left">
          <h1 className="font-heading text-3xl font-bold mb-5 sm:text-4xl">Conheça a Aki Eletrônicos</h1>
          <p className="text-text-muted leading-relaxed mb-4">
            Somos especialistas em assistência técnica de celulares e informática, oferecendo serviços ágeis,
            confiáveis e de alta qualidade. Trabalhamos com diversas marcas, incluindo Xiaomi, iPhone, JBL,
            Samsung e muitas outras.
          </p>
          <p className="text-text-muted leading-relaxed mb-4">
            Além disso, prestamos serviços de informática, como formatação, reparo de hardware e otimização de
            sistemas, garantindo soluções eficientes para seus dispositivos.
          </p>
          <p className="text-text-muted leading-relaxed mb-6">
            Conte com nossa experiência e compromisso para manter seus equipamentos sempre em perfeito
            funcionamento.
          </p>
          <HeroWhatsAppButton whatsappNumber={s.whatsapp || '5541998132536'} label="Falar com a equipe" />
        </Reveal>
        <Reveal delay={100} className="reveal-right relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
          {aboutVideo ? (
            <HeroVideo src={aboutVideo} poster={aboutPoster ?? undefined} lazy />
          ) : (
            <Image src="/images/loja.jpg" alt="Loja Aki Eletrônicos" fill className="object-cover" sizes="(min-width: 768px) 560px, 100vw" />
          )}
        </Reveal>
      </div>

      {brandList.length > 0 && (
        <Reveal className="mb-16">
          <h2 className="font-heading text-xl font-semibold mb-5 text-center">Marcas com as quais trabalhamos</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {brandList.map((b, i) => (
              <Reveal key={b.id} delay={i * 40} className="reveal-scale">
                <span className="inline-block rounded-xl border border-border bg-surface-2 px-5 py-3 text-sm font-medium text-text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-aki-green-500/40 hover:text-text">
                  {b.name}
                </span>
              </Reveal>
            ))}
          </div>
        </Reveal>
      )}

      <div className="grid gap-5 sm:grid-cols-3">
        <Reveal delay={0} className="reveal-scale">
          <Card className="p-6 transition-all duration-300 hover:border-aki-green-500/40 hover:-translate-y-0.5">
            <h3 className="font-heading text-base font-semibold mb-2">Endereço</h3>
            <p className="text-sm text-text-muted leading-relaxed">{s.endereco}</p>
          </Card>
        </Reveal>
        <Reveal delay={80} className="reveal-scale">
          <Card className="p-6 transition-all duration-300 hover:border-aki-green-500/40 hover:-translate-y-0.5">
            <h3 className="font-heading text-base font-semibold mb-2">Horário</h3>
            <p className="text-sm text-text-muted leading-relaxed">{s.horario_atendimento}</p>
          </Card>
        </Reveal>
        <Reveal delay={160} className="reveal-scale">
          <Card className="p-6 transition-all duration-300 hover:border-aki-green-500/40 hover:-translate-y-0.5">
            <h3 className="font-heading text-base font-semibold mb-2">Contato</h3>
            <p className="text-sm text-text-muted leading-relaxed">{s.telefone}</p>
            <p className="text-sm text-text-muted leading-relaxed">{s.email}</p>
          </Card>
        </Reveal>
      </div>

      {s.google_maps && (
        <Reveal className="mt-10 overflow-hidden rounded-2xl border border-border">
          <iframe
            src={s.google_maps}
            title="Localização da Aki Eletrônicos"
            className="h-80 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      )}
    </div>
  );
}
