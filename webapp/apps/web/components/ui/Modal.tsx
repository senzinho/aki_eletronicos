'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-label={title}
      className={clsx(
        'w-[min(560px,92vw)] rounded-2xl border border-border bg-surface-2 p-0 text-text backdrop:bg-black/70',
        'open:animate-[modal-in_180ms_ease-out]',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="font-heading text-lg font-semibold">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-1 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aki-green-400"
        >
          <X size={20} strokeWidth={2} />
        </button>
      </div>
      <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
    </dialog>
  );
}
