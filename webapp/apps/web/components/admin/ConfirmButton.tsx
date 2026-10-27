'use client';

import { useState, type ReactNode } from 'react';
import clsx from 'clsx';

interface ConfirmButtonProps {
  onConfirm: () => void | Promise<void>;
  children: ReactNode;
  confirmLabel?: string;
  className?: string;
}

export function ConfirmButton({ onConfirm, children, confirmLabel = 'Confirmar exclusão?', className }: ConfirmButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="text-xs text-text-muted">{confirmLabel}</span>
        <button
          type="button"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            await onConfirm();
            setLoading(false);
            setConfirming(false);
          }}
          className="text-xs font-semibold text-danger hover:underline"
        >
          Sim
        </button>
        <button type="button" onClick={() => setConfirming(false)} className="text-xs text-text-muted hover:underline">
          Não
        </button>
      </span>
    );
  }

  return (
    <button type="button" onClick={() => setConfirming(true)} className={clsx('text-xs text-danger hover:underline', className)}>
      {children}
    </button>
  );
}
