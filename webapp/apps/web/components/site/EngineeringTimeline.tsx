'use client';

import { useEffect, useRef } from 'react';
import { Reveal } from '../ui/Reveal';

const ENG_STEPS = [
  {
    title: 'Entendimento da necessidade',
    text: 'Conversamos sobre o que você roda, o que precisa render mais rápido e quanto quer investir. O uso define o projeto.',
    tags: ['Briefing', 'Orçamento'],
  },
  {
    title: 'Seleção estratégica',
    text: 'Escolhemos processador, placa de vídeo, memória e armazenamento pelo equilíbrio do conjunto, não pelo número isolado de cada peça.',
    tags: ['CPU', 'GPU', 'RAM', 'SSD'],
  },
  {
    title: 'Análise de compatibilidade',
    text: 'Socket, formato da placa, comprimento da placa de vídeo, suporte de radiador e consumo da fonte são conferidos antes de comprar.',
    tags: ['Socket', 'Fonte', 'Gabinete'],
  },
  {
    title: 'Montagem profissional',
    text: 'Encaixe das peças, pasta térmica, organização de cabos e fluxo de ar planejado. Cada parafuso no torque certo.',
    tags: ['Cable management', 'Fluxo de ar'],
  },
  {
    title: 'Testes de estabilidade e temperatura',
    text: 'A máquina roda sob carga real para validar o desempenho, as temperaturas e a estabilidade antes de chegar até você.',
    tags: ['Estresse', 'Térmica', 'Memória'],
  },
  {
    title: 'Entrega pronta para uso',
    text: 'Sistema instalado, drivers atualizados e tudo configurado. Você liga e começa a usar.',
    tags: ['Sistema', 'Drivers', 'Suporte'],
  },
] as const;

export function EngineeringTimeline() {
  const tlRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = tlRef.current;
    const fill = fillRef.current;
    if (!tl || !fill) return;
    const steps = Array.from(tl.querySelectorAll<HTMLElement>('[data-step]'));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      steps.forEach((s) => s.classList.add('is-on'));
      fill.style.transform = 'scaleY(1)';
      return;
    }

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.to(fill, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: tl, start: 'top 65%', end: 'bottom 70%', scrub: 0.4 },
        });
        steps.forEach((s) => {
          ScrollTrigger.create({
            trigger: s,
            start: 'top 68%',
            onEnter: () => s.classList.add('is-on'),
            onLeaveBack: () => s.classList.remove('is-on'),
          });
        });
      }, tl);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section id="engenharia" className="border-y border-border bg-surface-1/50">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:py-24">
        <Reveal className="self-start lg:sticky lg:top-28">
          <span className="text-sm font-semibold uppercase tracking-wide text-aki-green-400">Nosso processo</span>
          <h2 className="section-title section-title--xl mt-3 mb-5">Do briefing à bancada, sem improviso.</h2>
          <p className="max-w-md text-text-muted">
            Cada máquina passa por seis etapas. Nada é montado antes de ser analisado, e nada sai antes de ser testado.
          </p>
        </Reveal>

        <div ref={tlRef} className="relative pl-14">
          <div aria-hidden="true" className="absolute bottom-1.5 left-[15px] top-1.5 w-px bg-border" />
          <div
            ref={fillRef}
            aria-hidden="true"
            className="absolute bottom-1.5 left-[15px] top-1.5 w-px origin-top bg-aki-green-400"
            style={{ transform: 'scaleY(0)', boxShadow: '0 0 12px var(--aki-green-400)' }}
          />
          {ENG_STEPS.map((s, i) => (
            <article key={s.title} data-step className="eng-step relative pb-16 last:pb-0">
              <i className="eng-pt absolute -left-[49px] top-0.5 h-[15px] w-[15px] rounded-full border-[1.5px] border-text-muted/50 bg-bg transition-all duration-500" />
              <Reveal>
                <small className="text-[11px] font-semibold tracking-[0.2em] text-aki-green-400">ETAPA {String(i + 1).padStart(2, '0')}</small>
                <h3 className="mb-2.5 mt-2.5 font-heading text-[clamp(1.15rem,2.2vw,1.6rem)] font-bold leading-tight">{s.title}</h3>
                <p className="max-w-[520px] text-text-muted">{s.text}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <span key={t} className="rounded-md border border-border px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
                      {t}
                    </span>
                  ))}
                </div>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
