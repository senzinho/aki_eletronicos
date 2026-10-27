import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

type BadgeTone = 'green' | 'warning' | 'danger' | 'neutral';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = 'green', className, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold font-heading tracking-wide',
        tone === 'green' && 'bg-aki-green-500/15 text-aki-green-400 border border-aki-green-500/30',
        tone === 'warning' && 'bg-warning/15 text-warning border border-warning/30',
        tone === 'danger' && 'bg-danger/15 text-danger border border-danger/30',
        tone === 'neutral' && 'bg-surface-1 text-text-muted border border-border',
        className,
      )}
      {...props}
    />
  );
}
