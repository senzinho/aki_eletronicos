import type { Metadata } from 'next';
import { HeroWhatsAppButton } from '../../../components/site/HeroWhatsAppButton';
import { ContactForm } from '../../../components/site/ContactForm';
import { Card } from '../../../components/ui/Card';
import { Reveal } from '../../../components/ui/Reveal';
import { settings } from '../../../lib/api';

const MONTAGEM_DESCRIPTION =
  'Montagem de computadores sob medida: PCs gamer, workstations e upgrades com peças Gigabyte, Asus, MSI, ASRock, Intel, AMD, Corsair, HyperX e Aigo em Colombo/PR.';

export const metadata: Metadata = {
  title: 'Montagem de Computadores',
  description: MONTAGEM_DESCRIPTION,
  alternates: { canonical: '/montagem-de-pc' },
  openGraph: {
    title: 'Montagem de Computadores',
    description: MONTAGEM_DESCRIPTION,
  },
};

const SERVICES = [
  ['Montagem personalizada', 'PC sob medida para seu orçamento e necessidade.'],
  ['Upgrade de hardware', 'Troca de processador, placa de vídeo, memória e armazenamento.'],
  ['Refrigeração', 'Instalação de water cooler e air cooler para máxima performance.'],
  ['Overclock', 'Extraia o máximo de performance com segurança.'],
  ['Instalação de sistema', 'Windows, Linux e drivers configurados do zero.'],
  ['Compatibilidade', 'Verificação técnica das peças antes da compra.'],
  ['Cable management', 'Organização interna para melhor fluxo de ar.'],
  ['Upgrade de notebook', 'Expansão de memória RAM e troca de SSD/HD.'],
  ['Manutenção preventiva', 'Limpeza interna e troca de pasta térmica.'],
  ['Suporte pós-montagem', 'Acompanhamento após a entrega do seu PC.'],
] as const;

const PROCESS_STEPS = [
  ['01', 'Você escolhe o uso', 'Jogos, trabalho, edição ou streaming: conte pra gente o que precisa.'],
  ['02', 'Montamos a configuração', 'Selecionamos as melhores peças dentro do seu orçamento.'],
  ['03', 'Você aprova o orçamento', 'Apresentamos a lista de peças e valores antes de comprar.'],
  ['04', 'Nós montamos e testamos', 'Montagem, testes de estresse e entrega funcionando 100%.'],
] as const;

const DIFFERENTIALS = [
  ['Técnicos especializados', 'Equipe experiente em hardware, overclock e refrigeração.'],
  ['Compatibilidade garantida', 'Checagem técnica de todas as peças antes da montagem.'],
  ['Peças de qualidade', 'Componentes selecionados das melhores marcas do mercado.'],
  ['Garantia no serviço', 'Montagem com garantia e suporte pós-venda.'],
  ['Transparência', 'Orçamento detalhado, sem surpresas.'],
  ['Atendimento rápido', 'Resposta ágil pelo WhatsApp.'],
] as const;

const BRANDS = ['Gigabyte', 'Asus', 'MSI', 'ASRock', 'Intel', 'AMD', 'Corsair', 'HyperX', 'Aigo'] as const;

export default async function MontagemDePcPage() {
  const s = await settings.get();

  return (
    <div>
      <section className="border-b border-border bg-surface-1/60">
        <Reveal className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
          <span className="text-sm font-semibold uppercase tracking-wide text-aki-green-400">Montagem de computadores</span>
          <h1 className="mt-3 max-w-xl font-heading text-3xl font-bold leading-tight sm:text-4xl">
            Seu PC ideal, montado por especialistas.
          </h1>
          <p className="mt-3 max-w-md text-text-muted">
            Montagem personalizada, upgrades e peças das melhores marcas para jogos, trabalho ou criação de conteúdo.
          </p>
          <div className="mt-6 inline-flex">
            <HeroWhatsAppButton whatsappNumber={s.whatsapp || '5541998132536'} label="Solicitar orçamento" variant="primary" />
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <Reveal>
          <h2 className="font-heading text-2xl font-bold mb-8">Serviços</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {SERVICES.map(([name, desc], i) => (
            <Reveal key={name} delay={Math.min(i, 7) * 50} className="reveal-scale">
              <Card className="flex flex-col gap-2 p-5 transition-all duration-300 hover:border-aki-green-500/40 hover:-translate-y-0.5">
                <h3 className="font-heading text-sm font-semibold">{name}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface-1/40">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
          <Reveal>
            <h2 className="font-heading text-2xl font-bold mb-8">Como funciona?</h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-4">
            {PROCESS_STEPS.map(([num, title, desc], i) => (
              <Reveal key={num} delay={i * 100} className="reveal-left flex flex-col gap-2">
                <span className="font-heading text-2xl font-bold text-aki-green-400">{num}</span>
                <h3 className="font-heading text-sm font-semibold">{title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <Reveal>
          <h2 className="font-heading text-2xl font-bold mb-8">Marcas com que trabalhamos</h2>
        </Reveal>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
          {BRANDS.map((brand, i) => (
            <Reveal key={brand} delay={Math.min(i, 7) * 50} className="reveal-scale">
              <Card className="flex items-center justify-center p-5 text-center transition-all duration-300 hover:border-aki-green-500/40 hover:-translate-y-0.5">
                <span className="font-heading text-sm font-semibold">{brand}</span>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface-1/40">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
          <Reveal>
            <h2 className="font-heading text-2xl font-bold mb-8">Por que montar seu PC com a gente?</h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {DIFFERENTIALS.map(([title, desc], i) => (
              <Reveal key={title} delay={i * 70} className="reveal-scale">
                <Card className="p-5 transition-all duration-300 hover:border-aki-green-500/40 hover:-translate-y-0.5">
                  <h3 className="font-heading text-sm font-semibold mb-1.5">{title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="orcamento" className="border-t border-border">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <Reveal className="reveal-left flex flex-col justify-center gap-4">
            <h2 className="font-heading text-2xl font-bold">Prefere falar direto?</h2>
            <p className="text-text-muted">Conte pra gente o uso e o orçamento pelo WhatsApp e receba um retorno rápido da nossa equipe.</p>
            <HeroWhatsAppButton
              whatsappNumber={s.whatsapp || '5541998132536'}
              label="Falar direto no WhatsApp"
            />
          </Reveal>
          <Reveal delay={100} className="reveal-right">
            <Card className="p-6 sm:p-8">
              <h2 className="font-heading text-lg font-semibold mb-5">Solicitar orçamento</h2>
              <ContactForm type="contato" extraFields="montagem" />
            </Card>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
