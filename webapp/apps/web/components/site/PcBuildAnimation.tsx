'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import {
  Box,
  Zap,
  CircuitBoard,
  Cpu,
  MemoryStick,
  HardDrive,
  Gpu,
  Cable,
  CheckCircle,
  type LucideIcon,
} from 'lucide-react';

interface BuildStep {
  icon: LucideIcon;
  label: string;
  detail: string;
}

const STEPS: BuildStep[] = [
  { icon: Box, label: 'Gabinete', detail: 'Abrimos o gabinete e preparamos a estrutura.' },
  { icon: Zap, label: 'Fonte', detail: 'Instalamos a fonte de alimentação certa pro seu PC.' },
  { icon: CircuitBoard, label: 'Placa-mãe', detail: 'Fixamos a placa-mãe com todo cuidado.' },
  { icon: Cpu, label: 'Processador', detail: 'Encaixamos o processador e aplicamos pasta térmica.' },
  { icon: MemoryStick, label: 'Memória RAM', detail: 'Instalamos os pentes de memória.' },
  { icon: HardDrive, label: 'Armazenamento', detail: 'Conectamos SSD/HD para seus arquivos e jogos.' },
  { icon: Gpu, label: 'Placa de vídeo', detail: 'Instalamos a GPU para rodar seus jogos e projetos.' },
  { icon: Cable, label: 'Cabeamento', detail: 'Organizamos os cabos para um fluxo de ar melhor.' },
  { icon: CheckCircle, label: 'Pronto!', detail: 'Testamos tudo antes de entregar funcionando 100%.' },
];

const STEP_DURATION_MS = 1700;
const FLIP_OUT_MS = 300;

export function PcBuildAnimation() {
  const [activeIndex, setActiveIndex] = useState(0);
  // The stage lags activeIndex by one flip so the old part can rotate out first.
  const [shownIndex, setShownIndex] = useState(0);
  const [flippedOut, setFlippedOut] = useState(false);
  const [running, setRunning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setRunning(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setRunning(entry.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActiveIndex(STEPS.length - 1);
      return;
    }
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % STEPS.length);
    }, STEP_DURATION_MS);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (activeIndex === shownIndex) return;
    setFlippedOut(true);
    const id = setTimeout(() => {
      setShownIndex(activeIndex);
      setFlippedOut(false);
    }, FLIP_OUT_MS);
    return () => clearTimeout(id);
  }, [activeIndex, shownIndex]);

  const current = STEPS[shownIndex];
  const CurrentIcon = current.icon;
  const isDone = shownIndex === STEPS.length - 1;

  return (
    <div ref={containerRef} className="grid items-center gap-10 md:grid-cols-2">
      {/* Stage: the part being "installed" right now */}
      <div className="relative mx-auto aspect-square w-full max-w-[340px]">
        <div
          className={clsx(
            'absolute inset-0 rounded-3xl border bg-surface-1/60 transition-colors duration-500',
            isDone ? 'border-aki-green-500/60' : 'border-border',
          )}
        />
        <div
          className={clsx(
            'pointer-events-none absolute inset-6 rounded-2xl border border-dashed transition-colors duration-500',
            isDone ? 'border-aki-green-500/40' : 'border-border/60',
          )}
        />

        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4"
          style={{
            transition: `transform ${FLIP_OUT_MS}ms ease-out, opacity ${FLIP_OUT_MS}ms ease-out`,
            transform: flippedOut
              ? 'perspective(1200px) rotateY(75deg) scale(0.85)'
              : 'perspective(1200px) rotateY(0deg) scale(1)',
            opacity: flippedOut ? 0 : 1,
          }}
        >
          <span
            className={clsx(
              'flex h-24 w-24 items-center justify-center rounded-2xl border',
              isDone
                ? 'border-aki-green-500/60 bg-aki-green-500/15 text-aki-green-400'
                : 'border-aki-green-500/30 bg-aki-green-500/10 text-aki-green-400',
            )}
          >
            <CurrentIcon size={44} strokeWidth={1.6} />
          </span>
          <div className="text-center">
            <p className="font-heading text-base font-semibold text-text">{current.label}</p>
            <p className="mt-1 max-w-[220px] text-xs text-text-muted">{current.detail}</p>
          </div>
        </div>

        <span
          className={clsx(
            'absolute -inset-3 -z-10 rounded-[2rem] blur-2xl transition-opacity duration-700',
            isDone ? 'bg-aki-green-500/20 opacity-100' : 'bg-aki-green-500/10 opacity-70',
          )}
        />
      </div>

      {/* Step list */}
      <ol className="flex flex-col gap-1">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const state = i === activeIndex ? 'active' : i < activeIndex ? 'done' : 'pending';
          return (
            <li
              key={step.label}
              className={clsx(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-300',
                state === 'active' && 'bg-aki-green-500/10',
              )}
            >
              <span
                className={clsx(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300',
                  state === 'pending' && 'border-border text-text-muted',
                  state === 'active' && 'border-aki-green-400 bg-aki-green-500/15 text-aki-green-400',
                  state === 'done' && 'border-aki-green-500/40 bg-aki-green-500/10 text-aki-green-400',
                )}
              >
                <Icon size={15} strokeWidth={1.8} />
              </span>
              <span
                className={clsx(
                  'text-sm font-medium transition-colors duration-300',
                  state === 'pending' ? 'text-text-muted' : 'text-text',
                )}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
