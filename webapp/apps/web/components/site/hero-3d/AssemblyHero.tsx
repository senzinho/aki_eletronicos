'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import clsx from 'clsx';
import { HeroWhatsAppButton } from '../HeroWhatsAppButton';
import { HERO_STEPS, type HeroScene } from './steps';
import { createTimelineApi, type SceneDefinition } from './timeline';

/** three.js and the scene models are only downloaded when a page with a 3D hero is opened. */
const LOAD_SCENE: Record<HeroScene, () => Promise<SceneDefinition>> = {
  pc: () => import('./pcScene').then((m) => m.scene),
  phone: () => import('./phoneScene').then((m) => m.scene),
};

/** Aligns absolutely-positioned overlays with the site's 1200px container. */
const GUTTER = 'max(1rem, calc((100% - 1200px) / 2))';

/** Once the visitor scrolls down, the intro plays this many times faster (eased in). */
const SCROLL_SPEEDUP = 5;
/** Downward scroll (px) that counts as "scrolling": ignores tiny jitters and scroll restoration back to the top. */
const SCROLL_TRIGGER_PX = 12;

interface AssemblyHeroProps {
  scene: HeroScene;
  ariaLabel: string;
  whatsappNumber: string;
  kicker: string;
  /** headline; wrap emphasised words in <HeroAccent> */
  title: ReactNode;
  subtitle: string;
  primary: { label: string; message: string };
  secondary: { label: string; href: string };
  marks: readonly string[];
}

/**
 * Full-screen 3D intro: the scene plays step by step with a HUD, then the headline and calls to
 * action fade in. As soon as the visitor scrolls down the intro speeds up (SCROLL_SPEEDUP) so it
 * is never in the way. The hero is always dark, whatever the site theme.
 */
export function AssemblyHero({ scene, ariaLabel, whatsappNumber, kicker, title, subtitle, primary, secondary, marks }: AssemblyHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [noGl, setNoGl] = useState(false);
  const steps = HERO_STEPS[scene];

  useEffect(() => {
    const hero = heroRef.current;
    const canvas = canvasRef.current;
    if (!hero || !canvas) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      let def: SceneDefinition;
      let gsapMod: typeof import('gsap');
      try {
        [def, gsapMod] = await Promise.all([LOAD_SCENE[scene](), import('gsap')]);
      } catch {
        if (!disposed) setNoGl(true);
        return;
      }
      if (disposed) return;
      const { gsap } = gsapMod;

      let S: ReturnType<SceneDefinition['create']>;
      try {
        S = def.create(canvas);
      } catch {
        setNoGl(true);
        return;
      }

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let stopScrollWatch = () => {};
      const finish = () => {
        stopScrollWatch();
        setDone(true);
        S.idleOn = true;
      };

      const tl = gsap.timeline({ paused: true, onComplete: finish });
      const api = createTimelineApi(tl, S.model.setOp, S.cs, setStep);
      const { doneAt, timeScale } = def.timeline({ tl, S, ...api });
      tl.call(() => setDone(true), undefined, doneAt);
      if (barRef.current) tl.to(barRef.current, { width: '100%', duration: tl.duration(), ease: 'none' }, 0);
      tl.timeScale(timeScale);

      // render loop, only while the hero is on screen
      let raf = 0;
      let last = performance.now();
      const io = new IntersectionObserver(
        (es) => {
          S.visible = es[0].isIntersecting;
          if (S.visible) last = performance.now();
        },
        { threshold: 0 },
      );
      io.observe(hero);
      const loop = (n: number) => {
        raf = requestAnimationFrame(loop);
        if (!S.visible) return;
        const dt = Math.min(0.05, (n - last) / 1000);
        last = n;
        S.frame(dt);
      };
      raf = requestAnimationFrame(loop);

      if (reduce) {
        // jump to the end state; callbacks must run (no suppressEvents) because the parts' opacity is set in onUpdate
        tl.progress(1);
        finish();
        S.spin = false;
        S.frame(0.016);
      } else {
        tl.play();
        // Scrolling down means "get on with it": ease the intro up to SCROLL_SPEEDUP× until it ends.
        // minY follows the lowest scroll position seen, so only a real move *down* triggers it.
        let minY = window.scrollY;
        const onScroll = () => {
          const y = window.scrollY;
          minY = Math.min(minY, y);
          if (y - minY < SCROLL_TRIGGER_PX) return;
          stopScrollWatch();
          gsap.to(tl, { timeScale: timeScale * SCROLL_SPEEDUP, duration: 0.6, ease: 'power2.out' });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        stopScrollWatch = () => window.removeEventListener('scroll', onScroll);
      }

      cleanup = () => {
        stopScrollWatch();
        cancelAnimationFrame(raf);
        io.disconnect();
        gsap.killTweensOf(tl);
        tl.kill();
        S.dispose();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [scene]);

  const showCopy = done || noGl;
  const [stepTitle, stepDesc] = steps[step];

  return (
    <section
      ref={heroRef}
      aria-label={ariaLabel}
      className="relative h-[calc(100svh-5rem)] min-h-[640px] overflow-hidden border-b border-white/10 text-white"
      style={{ background: 'radial-gradient(ellipse at 70% 40%, #0d2616 0, #020503 62%)' }}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block h-full w-full" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background: showCopy
            ? 'radial-gradient(ellipse at 60% 45%, transparent 35%, #020503 100%), linear-gradient(#02050380, transparent 22%, transparent 55%, #020503)'
            : 'radial-gradient(ellipse at 60% 45%, transparent 35%, #020503 100%), linear-gradient(#02050380, transparent 22%, transparent 70%, #020503)',
        }}
      />
      {/* phones: the headline sits over the model, so fade the scene out behind it */}
      <div
        aria-hidden="true"
        className={clsx('pointer-events-none absolute inset-0 transition-opacity duration-700 md:hidden', showCopy ? 'opacity-100' : 'opacity-0')}
        style={{ background: 'linear-gradient(transparent 12%, #020503d9 42%, #020503f2 100%)' }}
      />

      {/* assembly HUD */}
      <div
        aria-live="polite"
        className={clsx(
          'absolute bottom-16 w-[min(420px,calc(100%-2rem))] transition-opacity duration-500 max-md:bottom-10',
          showCopy && 'pointer-events-none opacity-0',
        )}
        style={{ left: GUTTER }}
      >
        <div className="text-xs font-semibold tracking-[0.2em] text-aki-green-400">
          {String(step + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
        </div>
        <h2 className="my-2.5 font-heading text-[clamp(1.35rem,3vw,2.1rem)] font-extrabold uppercase leading-tight">{stepTitle}</h2>
        <p className="min-h-11 text-sm text-white/65">{stepDesc}</p>
        <div className="relative mt-4 h-0.5 bg-white/10">
          <i ref={barRef} className="absolute left-0 top-0 h-full w-0 bg-aki-green-400" style={{ boxShadow: '0 0 12px var(--aki-green-400)' }} />
        </div>
      </div>

      {/* final headline + CTAs */}
      <div
        className={clsx(
          'absolute top-1/2 w-[min(620px,calc(100%-2rem))] -translate-y-[46%] transition-opacity duration-700 max-md:top-auto max-md:bottom-8 max-md:translate-y-0',
          showCopy ? 'visible opacity-100' : 'invisible opacity-0',
        )}
        style={{ left: GUTTER }}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-aki-green-400">{kicker}</span>
        <h1 className="mb-5 mt-4 font-heading text-[clamp(2.1rem,5.2vw,4.6rem)] font-extrabold uppercase leading-[1.04] tracking-tight">{title}</h1>
        <p className="max-w-[520px] text-[clamp(0.95rem,1.4vw,1.1rem)] text-white/75">{subtitle}</p>
        <div className="mt-7 flex flex-wrap gap-3.5">
          <HeroWhatsAppButton whatsappNumber={whatsappNumber} variant="primary" label={primary.label} message={primary.message} />
          <a
            href={secondary.href}
            className="inline-flex h-14 items-center justify-center whitespace-nowrap rounded-xl border border-white/20 bg-white/5 px-8 font-heading text-base font-semibold text-white backdrop-blur transition-colors hover:border-aki-green-400 hover:text-aki-green-400"
          >
            {secondary.label}
          </a>
        </div>
        <div className="mt-8 flex flex-wrap gap-x-7 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
          {marks.map((m) => (
            <span key={m} className="inline-flex items-center">
              <span className="mr-2.5 inline-block h-px w-[18px] bg-aki-green-400" />
              {m}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
