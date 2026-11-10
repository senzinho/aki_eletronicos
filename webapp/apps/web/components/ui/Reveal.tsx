'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import clsx from 'clsx';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** stagger delay in ms, e.g. index * 60 for grids */
  delay?: number;
  once?: boolean;
}

export function Reveal({ children, className, delay = 0, once = true }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={clsx('reveal min-w-0', visible && 'is-visible', className)}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}
