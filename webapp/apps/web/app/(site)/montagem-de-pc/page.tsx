import type { Metadata } from 'next';
import { HeroWhatsAppButton } from '../../../components/site/HeroWhatsAppButton';
import { AssemblyHero } from '../../../components/site/hero-3d/AssemblyHero';
import { HeroAccent } from '../../../components/site/hero-3d/HeroAccent';
import { EngineeringTimeline } from '../../../components/site/EngineeringTimeline';
import { PerformanceStats } from '../../../components/site/PerformanceStats';
import { BrandMarquee, PC_BRANDS } from '../../../components/site/BrandMarquee';
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

export default async function MontagemDePcPage() {
  const s = await settings.get().catch(() => ({}) as Record<string, string>);
  const whatsapp = s.whatsapp || '5541998132536';

  return (
    <div>
      <AssemblyHero
        scene="pc"
        ariaLabel="Montagem de PC em 3D"
        whatsappNumber={whatsapp}
        kicker="Aki Eletrônicos · Montagem de PC"
        title={
          <>
            Seu próximo <HeroAccent>nível</HeroAccent> começa aqui.
          </>
        }
        subtitle="Computadores personalizados, projetados peça por peça para entregar máxima performance, estabilidade e uma experiência extraordinária."
        primary={{ label: 'Monte seu PC', message: 'Olá! Vim pelo site da Aki Eletrônicos e quero montar meu PC personalizado.' }}
        secondary={{ label: 'Conheça nossos serviços', href: '#servicos' }}
        marks={['Performance sem limites', 'Componentes selecionados', 'Montagem especializada']}
      />

      <section id="servicos" className="mx-auto max-w-[1200px] scroll-mt-20 px-4 py-16 sm:px-6">
        <Reveal>
          <h2 className="section-title mb-8">Serviços</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {SERVICES.map(([name, desc], i) => (
            <Reveal key={name} delay={Math.min(i, 7) * 50} className="reveal-scale">
              <Card className="flex flex-col gap-2 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-aki-green-500/40 hover:bg-aki-green-500/5">
                <h3 className="font-heading text-sm font-semibold">{name}</h3>
                <p className="text-xs leading-relaxed text-text-muted">{desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="como" className="border-t border-border bg-surface-1/40">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
          <Reveal>
            <h2 className="section-title mb-8">Como funciona?</h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map(([num, title, desc], i) => (
              <Reveal key={num} delay={i * 100} className="reveal-left flex flex-col gap-2">
                <span className="font-heading text-3xl font-bold text-aki-green-400" style={{ textShadow: '0 0 22px rgba(47,211,92,.35)' }}>
                  {num}
                </span>
                <h3 className="font-heading text-sm font-semibold">{title}</h3>
                <p className="text-xs leading-relaxed text-text-muted">{desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Reveal>
            <h2 className="section-title mb-2">Marcas com que trabalhamos</h2>
            <p className="mb-8 max-w-md text-sm text-text-muted">
              Peças originais das fabricantes que são referência em hardware.
            </p>
          </Reveal>
        </div>
        <BrandMarquee brands={PC_BRANDS} />
      </section>

      <EngineeringTimeline />

      <PerformanceStats />

      <section
        id="orcamento"
        aria-label="Solicite seu projeto"
        className="relative overflow-hidden border-t border-white/10 text-white"
        style={{ background: 'radial-gradient(ellipse at 70% 50%, #0d2616 0, #020503 65%)' }}
      >
        <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:py-28">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-aki-green-400">Projeto sob medida</span>
            <h2 className="mb-5 mt-4 max-w-[760px] font-heading text-[clamp(1.9rem,4.6vw,3.9rem)] font-extrabold uppercase leading-[1.05] tracking-tight">
              Sua próxima máquina está a um projeto de distância.
            </h2>
            <p className="max-w-[480px] text-base text-white/75 sm:text-lg">
              Conte o que você precisa. Nós projetamos a máquina ideal para transformar sua ideia em performance.
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <HeroWhatsAppButton
                whatsappNumber={whatsapp}
                variant="primary"
                label="Projetar meu PC"
                message="Olá! Vim pelo site da Aki Eletrônicos e quero projetar meu PC. Pode me passar um orçamento personalizado?"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
