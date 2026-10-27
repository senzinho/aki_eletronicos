import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-border bg-surface-2 transition-all duration-250 ease-out',
        className,
      )}
      {...props}
    />
  );
}
