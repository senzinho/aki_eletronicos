'use client';

import { useEffect, useRef } from 'react';
import { Reveal } from '../ui/Reveal';

/** value = number counted up in the ring, fill = share of the ring painted (0..1) */
const STATS = [
  { title: 'Processamento', value: 32, fill: 0.92, head: '16 núcleos', text: '32 threads para renderização, compilação e multitarefa pesada.' },
  { title: 'Desempenho gráfico', value: 16, fill: 0.85, head: '16 GB de VRAM', text: 'Ray tracing e DLSS para jogos em alta taxa de quadros e 4K.' },
  { title: 'Refrigeração', value: 360, fill: 0.78, head: 'Radiador de 360 mm', text: 'Líquida com fluxo de ar dimensionado para carga contínua.' },
  { title: 'Armazenamento', value: 7400, fill: 0.88, head: '7.400 MB/s', text: 'Leitura sequencial de um SSD NVMe PCIe 4.0 de alta gama.', small: true },
  { title: 'Eficiência energética', value: 90, fill: 0.9, head: '80 PLUS Gold ou superior', text: 'Fonte certificada, menos calor e consumo estável.', unit: '%' },
] as const;

const RING = 339.3; // 2πr for r = 54

function Ring({ value, fill, small, unit }: { value: number; fill: number; small?: boolean; unit?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const fgRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const set = (k: number) => {
      if (numRef.current) numRef.current.textContent = Math.round(value * k).toLocaleString('pt-BR');
      if (fgRef.current) fgRef.current.style.strokeDashoffset = String(RING * (1 - fill * k));
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      set(1);
      return;
    }
    set(0);
    let raf = 0;
    const io = new IntersectionObserver(
      (es) => {
        if (!es[0].isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const D = 1800;
        const tick = (n: number) => {
          const p = Math.min(1, (n - t0) / D);
          set(1 - Math.pow(1 - p, 3)); // easeOutCubic
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, fill]);

  return (
    <div ref={rootRef} className="relative mb-5 h-[118px] w-[118px]">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r="54" fill="none" strokeWidth="5" stroke="var(--border)" />
        <circle
          ref={fgRef}
          cx="60"
          cy="60"
          r="54"
          fill="none"
          strokeWidth="5"
          stroke="var(--aki-green-400)"
          strokeDasharray={RING}
          strokeDashoffset={RING}
          style={{ filter: 'drop-shadow(0 0 6px rgba(47,211,92,.6))' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center font-heading font-bold tabular-nums">
        <span className="flex items-baseline gap-0.5">
          <span ref={numRef} className={small ? 'text-lg' : 'text-[22px]'}>
            0
          </span>
          {unit && <small className="text-xs">{unit}</small>}
        </span>
      </div>
    </div>
  );
}

function Telemetry() {
  const cvRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = cvRef.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;
    let vis = false;
    let t = 0;
    let W = 0;
    let H = 0;
    let raf = 0;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const css = (name: string, fallback: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

    function size() {
      const r = cv!.getBoundingClientRect();
      const d = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width;
      H = r.height;
      cv!.width = W * d;
      cv!.height = H * d;
      ctx!.setTransform(d, 0, 0, d, 0, 0);
    }
    const line = (fn: (x: number) => number, col: string, w: number) => {
      ctx!.beginPath();
      for (let x = 0; x <= W; x += 3) {
        const y = H - fn(x / W) * (H - 16) - 8;
        if (x) ctx!.lineTo(x, y);
        else ctx!.moveTo(x, y);
      }
      ctx!.strokeStyle = col;
      ctx!.lineWidth = w;
      ctx!.stroke();
    };
    function draw() {
      ctx!.clearRect(0, 0, W, H);
      ctx!.strokeStyle = css('--border', '#1d2a21');
      ctx!.lineWidth = 1;
      for (let i = 1; i < 5; i++) {
        ctx!.beginPath();
        ctx!.moveTo(0, (H * i) / 5);
        ctx!.lineTo(W, (H * i) / 5);
        ctx!.stroke();
      }
      const s = t * 0.6;
      line((x) => 0.72 + 0.12 * Math.sin(x * 14 + s) + 0.05 * Math.sin(x * 37 + s * 2), css('--aki-green-400', '#4be06a'), 2);
      line((x) => 0.84 + 0.07 * Math.sin(x * 9 - s * 1.3) + 0.03 * Math.sin(x * 41 + s), css('--text', '#ffffff'), 1.5);
      line((x) => 0.46 + 0.05 * Math.sin(x * 5 + s * 0.4) + 0.02 * Math.sin(x * 23), css('--warning', '#f5b83d'), 1.5);
    }

    const ro = new ResizeObserver(() => {
      size();
      if (reduce) draw();
    });
    ro.observe(cv);
    size();
    const io = new IntersectionObserver((e) => {
      vis = e[0].isIntersecting;
    });
    io.observe(cv);

    if (reduce) {
      draw();
    } else {
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!vis) return;
        t += 0.016;
        draw();
      };
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={cvRef} aria-label="Gráfico ilustrativo de telemetria" className="block h-[170px] w-full" />;
}

export function PerformanceStats() {
  return (
    <section id="performance" className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
      <Reveal>
        <div className="mb-12 grid items-end gap-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-aki-green-400">Performance em detalhes</span>
            <h2 className="section-title section-title--xl mt-3">Números de uma configuração de topo</h2>
          </div>
          <p className="max-w-md text-sm text-text-muted lg:justify-self-end">
            Valores de referência de uma máquina da linha Gamer/Creator com componentes de alto desempenho. Os resultados variam conforme o projeto.
          </p>
        </div>
      </Reveal>

      <Reveal className="reveal-scale">
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-surface-1/60 sm:grid-cols-2 lg:grid-cols-5">
          {STATS.map((s, i) => (
            <div
              key={s.title}
              className={
                'border-b border-border p-6 sm:border-r lg:border-b-0 lg:p-7 ' + (i === STATS.length - 1 ? 'sm:border-r-0 lg:border-r-0' : 'lg:border-r')
              }
            >
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-text-muted">{s.title}</h3>
              <Ring value={s.value} fill={s.fill} small={'small' in s} unit={'unit' in s ? s.unit : undefined} />
              <p className="text-sm text-text-muted">
                <b className="mb-1 block font-heading text-lg font-semibold text-text">{s.head}</b>
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="mt-7 rounded-2xl border border-border bg-surface-1/60 p-5 sm:p-6">
          <div className="mb-3 flex flex-wrap justify-between gap-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-text-muted">
            <span>Telemetria ilustrativa sob carga</span>
            <span className="flex gap-4">
              <span><i className="mr-2 inline-block h-0.5 w-3.5 bg-aki-green-400 align-middle" />CPU</span>
              <span><i className="mr-2 inline-block h-0.5 w-3.5 bg-text align-middle" />GPU</span>
              <span><i className="mr-2 inline-block h-0.5 w-3.5 bg-warning align-middle" />Temperatura</span>
            </span>
          </div>
          <Telemetry />
        </div>
      </Reveal>
    </section>
  );
}
