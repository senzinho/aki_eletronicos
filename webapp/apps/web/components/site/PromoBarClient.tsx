'use client';

import { useEffect, useState } from 'react';
import type { PromotionalBar } from '../../lib/types';

export function PromoBarClient({ items }: { items: PromotionalBar[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 4000);
    return () => clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;
  const current = items[index];

  return (
    <div className="bg-surface-1 border-b border-border">
      <div className="mx-auto flex h-9 max-w-[1200px] items-center justify-center px-4 text-center">
        <p key={current.id} className="text-xs font-medium text-text-muted transition-opacity duration-200">
          {current.icon && <span className="mr-1.5">{current.icon}</span>}
          {current.text}
        </p>
      </div>
    </div>
  );
}
