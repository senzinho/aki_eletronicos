'use client';

import { useEffect, useRef, useState } from 'react';

interface HeroVideoProps {
  src: string;
  poster?: string;
  /** Don't load or play until the user scrolls this into view (for below-the-fold videos). */
  lazy?: boolean;
}

/**
 * Background video, paused automatically when scrolled out of view to avoid
 * burning CPU/battery on a loop no one sees. By default it loads right after
 * the page is interactive (not competing with critical JS/CSS/fonts for
 * bandwidth) — pass `lazy` for a below-the-fold video that should only start
 * loading/playing once the viewer actually scrolls to it.
 */
export function HeroVideo({ src, poster, lazy = false }: HeroVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (lazy) return;

    const win = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    const start = () => setShouldLoad(true);

    if (document.readyState === 'complete') {
      const id = win.requestIdleCallback ? win.requestIdleCallback(start) : window.setTimeout(start, 300);
      return () => {
        if (typeof id === 'number') window.clearTimeout(id);
      };
    }

    window.addEventListener('load', start, { once: true });
    return () => window.removeEventListener('load', start);
  }, [lazy]);

  useEffect(() => {
    if (!lazy || shouldLoad) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [lazy, shouldLoad]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !shouldLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldLoad]);

  if (!shouldLoad) {
    return (
      <div ref={containerRef} className="h-full w-full">
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt="" className="h-full w-full object-cover opacity-90" />
        ) : null}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full w-full">
      <video
        ref={videoRef}
        className="h-full w-full object-cover transition-opacity duration-700"
        style={{ opacity: ready ? 0.9 : 0 }}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
        onCanPlay={() => setReady(true)}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
