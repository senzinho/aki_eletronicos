'use client';

import { useEffect, useRef, useState } from 'react';

interface HeroVideoProps {
  src: string;
  poster?: string;
}

/**
 * Background hero video, loaded after the page is interactive (not competing
 * with critical JS/CSS/fonts for bandwidth) and paused automatically when
 * scrolled out of view to avoid burning CPU/battery on a loop no one sees.
 */
export function HeroVideo({ src, poster }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
  }, []);

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
    return poster ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={poster} alt="" className="h-full w-full object-cover opacity-40" />
    ) : null;
  }

  return (
    <video
      ref={videoRef}
      className="h-full w-full object-cover opacity-40 transition-opacity duration-700"
      style={{ opacity: ready ? 0.4 : 0 }}
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
  );
}
