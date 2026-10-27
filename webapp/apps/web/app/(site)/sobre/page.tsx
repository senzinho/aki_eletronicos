import type { Metadata } from 'next';
import Image from 'next/image';
import { HeroWhatsAppButton } from '../../../components/site/HeroWhatsAppButton';
import { Card } from '../../../components/ui/Card';
import { brands, settings } from '../../../lib/api';

export const metadata: Metadata = {
  title: 'Sobre a loja',
  description: 'Conheça a Aki Eletrônicos: assistência técnica especializada e venda de smartphones em Colombo/PR.',
};

export default async function SobrePage() {
  const [s, brandList] = await Promise.all([settings.get(), brands.list()]);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
      <div className="grid items-center gap-10 md:grid-cols-2 mb-16">
        <div>
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
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
          <Image src="/images/loja.jpg" alt="Loja Aki Eletrônicos" fill className="object-cover" sizes="(min-width: 768px) 560px, 100vw" />
        </div>
      </div>

      {brandList.length > 0 && (
        <div className="mb-16">
          <h2 className="font-heading text-xl font-semibold mb-5 text-center">Marcas com as quais trabalhamos</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {brandList.map((b) => (
              <span key={b.id} className="rounded-xl border border-border bg-surface-2 px-5 py-3 text-sm font-medium text-text-muted">
                {b.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-3">
        <Card className="p-6">
          <h3 className="font-heading text-base font-semibold mb-2">Endereço</h3>
          <p className="text-sm text-text-muted leading-relaxed">{s.endereco}</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-heading text-base font-semibold mb-2">Horário</h3>
          <p className="text-sm text-text-muted leading-relaxed">{s.horario_atendimento}</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-heading text-base font-semibold mb-2">Contato</h3>
          <p className="text-sm text-text-muted leading-relaxed">{s.telefone}</p>
          <p className="text-sm text-text-muted leading-relaxed">{s.email}</p>
        </Card>
      </div>

      {s.google_maps && (
        <div className="mt-10 overflow-hidden rounded-2xl border border-border">
          <iframe
            src={s.google_maps}
            title="Localização da Aki Eletrônicos"
            className="h-80 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
    </div>
  );
}
